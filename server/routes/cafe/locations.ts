import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../_core/trpc';
import { getDb } from '../../db';
import { cafeLocations, franchises } from '../../../drizzle/schema-cafe';
import { eq, and, sql } from 'drizzle-orm';

export const cafeLocationsRouter = router({
  // Get all active cafe locations
  getLocations: publicProcedure
    .input(z.object({
      city: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      
      if (input.city) {
        conditions.push(eq(cafeLocations.city, input.city));
      }
      
      if (input.isActive !== undefined) {
        conditions.push(eq(cafeLocations.isActive, input.isActive));
      }
      
      const locations = await db
        .select()
        .from(cafeLocations)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(cafeLocations.city, cafeLocations.name);
      
      return locations;
    }),

  // Get single location
  getLocation: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      const [location] = await db
        .select()
        .from(cafeLocations)
        .where(eq(cafeLocations.id, input.id));
      
      if (!location) {
        throw new Error('Location not found');
      }
      
      return location;
    }),

  // Find nearest locations
  findNearestLocations: publicProcedure
    .input(z.object({
      latitude: z.number(),
      longitude: z.number(),
      radiusKm: z.number().default(10),
      limit: z.number().default(5),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      
      // Using Haversine formula to calculate distance
      const locations = await db
        .select({
          location: cafeLocations,
          distance: sql<number>`
            6371 * acos(
              cos(radians(${input.latitude})) * 
              cos(radians(${cafeLocations.latitude})) * 
              cos(radians(${cafeLocations.longitude}) - radians(${input.longitude})) + 
              sin(radians(${input.latitude})) * 
              sin(radians(${cafeLocations.latitude}))
            )
          `.as('distance'),
        })
        .from(cafeLocations)
        .where(eq(cafeLocations.isActive, true))
        .orderBy(sql`distance`)
        .limit(input.limit);
      
      // Filter by radius
      return locations.filter(l => l.distance <= input.radiusKm);
    }),

  // Create location (admin only)
  createLocation: protectedProcedure
    .input(z.object({
      name: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().default('India'),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      hoursOfOperation: z.any().optional(),
      seatingCapacity: z.number().optional(),
      franchiseId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      
      const [newLocation] = await db
        .insert(cafeLocations)
        .values({
          ...input,
          latitude: input.latitude?.toString(),
          longitude: input.longitude?.toString(),
        })
        .returning();
      
      return newLocation;
    }),

  // Update location
  updateLocation: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      hoursOfOperation: z.any().optional(),
      seatingCapacity: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      const { id, ...updates } = input;
      
      const [updated] = await db
        .update(cafeLocations)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(cafeLocations.id, id))
        .returning();
      
      return updated;
    }),

  // Get cities with cafes
  getCities: publicProcedure
    .query(async () => {
      const db = getDb();
      
      const cities = await db
        .selectDistinct({ city: cafeLocations.city })
        .from(cafeLocations)
        .where(eq(cafeLocations.isActive, true))
        .orderBy(cafeLocations.city);
      
      return cities.map(c => c.city);
    }),
});

export const franchisesRouter = router({
  // Submit franchise application
  applyForFranchise: protectedProcedure
    .input(z.object({
      franchiseeName: z.string(),
      franchiseeEmail: z.string().email(),
      franchiseePhone: z.string(),
      organizationName: z.string().optional(),
      territory: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [application] = await db
        .insert(franchises)
        .values({
          ...input,
          applicationStatus: 'pending',
        })
        .returning();
      
      return application;
    }),

  // Get franchise applications (admin only)
  getApplications: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      const conditions = [];
      
      if (input.status) {
        conditions.push(eq(franchises.applicationStatus, input.status));
      }
      
      const applications = await db
        .select()
        .from(franchises)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(franchises.createdAt);
      
      return applications;
    }),

  // Update franchise application status
  updateApplicationStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      applicationStatus: z.enum(['pending', 'approved', 'rejected']),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      
      const [updated] = await db
        .update(franchises)
        .set({
          applicationStatus: input.applicationStatus,
          notes: input.notes,
          updatedAt: new Date(),
        })
        .where(eq(franchises.id, input.id))
        .returning();
      
      return updated;
    }),

  // Sign franchise agreement
  signAgreement: protectedProcedure
    .input(z.object({
      id: z.number(),
      licenseFee: z.number(),
      royaltyPercentage: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      
      const [updated] = await db
        .update(franchises)
        .set({
          agreementSigned: true,
          agreementDate: new Date(),
          licenseFee: input.licenseFee.toString(),
          royaltyPercentage: input.royaltyPercentage.toString(),
          updatedAt: new Date(),
        })
        .where(eq(franchises.id, input.id))
        .returning();
      
      return updated;
    }),
});
