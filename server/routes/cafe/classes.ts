import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../_core/trpc';
import { getDb } from '../../db';
import { cookingClasses, classRegistrations } from '../../../drizzle/schema-cafe';
import { eq, and, gte, desc } from 'drizzle-orm';

export const cookingClassesRouter = router({
  // Get upcoming classes
  getUpcomingClasses: publicProcedure
    .input(z.object({
      classType: z.enum(['in-person', 'virtual']).optional(),
      cafeLocationId: z.number().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [
        eq(cookingClasses.isActive, true),
        gte(cookingClasses.dateTime, new Date()),
      ];
      
      if (input.classType) {
        conditions.push(eq(cookingClasses.classType, input.classType));
      }
      
      if (input.cafeLocationId) {
        conditions.push(eq(cookingClasses.cafeLocationId, input.cafeLocationId));
      }
      
      const classes = await db
        .select()
        .from(cookingClasses)
        .where(and(...conditions))
        .orderBy(cookingClasses.dateTime)
        .limit(input.limit);
      
      return classes;
    }),

  // Get single class
  getClass: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      const [classInfo] = await db
        .select()
        .from(cookingClasses)
        .where(eq(cookingClasses.id, input.id));
      
      if (!classInfo) {
        throw new Error('Class not found');
      }
      
      return classInfo;
    }),

  // Create class (admin only)
  createClass: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string(),
      instructorId: z.number(),
      classType: z.enum(['in-person', 'virtual']),
      cafeLocationId: z.number().optional(),
      dateTime: z.date(),
      duration: z.number(),
      maxParticipants: z.number(),
      communityPrice: z.number(),
      fairPrice: z.number(),
      supporterPrice: z.number(),
      ingredientsList: z.string().optional(),
      equipmentNeeded: z.string().optional(),
      skillLevel: z.string(),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      
      const [newClass] = await db
        .insert(cookingClasses)
        .values({
          ...input,
          communityPrice: input.communityPrice.toString(),
          fairPrice: input.fairPrice.toString(),
          supporterPrice: input.supporterPrice.toString(),
        })
        .returning();
      
      return newClass;
    }),

  // Register for class
  registerForClass: protectedProcedure
    .input(z.object({
      classId: z.number(),
      priceTier: z.enum(['community', 'fair', 'supporter']),
      paymentMethod: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      // Check if class exists and has space
      const [classInfo] = await db
        .select()
        .from(cookingClasses)
        .where(eq(cookingClasses.id, input.classId));
      
      if (!classInfo) {
        throw new Error('Class not found');
      }
      
      if (!classInfo.isActive) {
        throw new Error('Class is not active');
      }
      
      if (classInfo.currentParticipants >= classInfo.maxParticipants) {
        throw new Error('Class is full');
      }
      
      // Check if already registered
      const existingRegistration = await db
        .select()
        .from(classRegistrations)
        .where(
          and(
            eq(classRegistrations.classId, input.classId),
            eq(classRegistrations.userId, ctx.user.id)
          )
        );
      
      if (existingRegistration.length > 0) {
        throw new Error('Already registered for this class');
      }
      
      // Get price based on tier
      let price = 0;
      if (input.priceTier === 'community') {
        price = parseFloat(classInfo.communityPrice || '0');
      } else if (input.priceTier === 'fair') {
        price = parseFloat(classInfo.fairPrice || '0');
      } else {
        price = parseFloat(classInfo.supporterPrice || '0');
      }
      
      // Create registration
      const [registration] = await db
        .insert(classRegistrations)
        .values({
          classId: input.classId,
          userId: ctx.user.id,
          priceTier: input.priceTier,
          amountPaid: price.toString(),
          paymentStatus: 'pending',
          attendanceStatus: 'registered',
        })
        .returning();
      
      // Update participant count
      await db
        .update(cookingClasses)
        .set({
          currentParticipants: classInfo.currentParticipants + 1,
          updatedAt: new Date(),
        })
        .where(eq(cookingClasses.id, input.classId));
      
      return registration;
    }),

  // Get user's registrations
  getMyRegistrations: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const registrations = await db
        .select({
          registration: classRegistrations,
          class: cookingClasses,
        })
        .from(classRegistrations)
        .innerJoin(cookingClasses, eq(classRegistrations.classId, cookingClasses.id))
        .where(eq(classRegistrations.userId, ctx.user.id))
        .orderBy(desc(cookingClasses.dateTime));
      
      return registrations;
    }),

  // Cancel registration
  cancelRegistration: protectedProcedure
    .input(z.object({ registrationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [registration] = await db
        .select()
        .from(classRegistrations)
        .where(
          and(
            eq(classRegistrations.id, input.registrationId),
            eq(classRegistrations.userId, ctx.user.id)
          )
        );
      
      if (!registration) {
        throw new Error('Registration not found');
      }
      
      // Get class info
      const [classInfo] = await db
        .select()
        .from(cookingClasses)
        .where(eq(cookingClasses.id, registration.classId));
      
      if (!classInfo) {
        throw new Error('Class not found');
      }
      
      // Check if class is in the future
      if (classInfo.dateTime && classInfo.dateTime < new Date()) {
        throw new Error('Cannot cancel past class');
      }
      
      // Delete registration
      await db
        .delete(classRegistrations)
        .where(eq(classRegistrations.id, input.registrationId));
      
      // Update participant count
      await db
        .update(cookingClasses)
        .set({
          currentParticipants: Math.max(0, classInfo.currentParticipants - 1),
          updatedAt: new Date(),
        })
        .where(eq(cookingClasses.id, registration.classId));
      
      return { success: true };
    }),

  // Update attendance (instructor/admin only)
  updateAttendance: protectedProcedure
    .input(z.object({
      registrationId: z.number(),
      attendanceStatus: z.enum(['registered', 'attended', 'no-show']),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is instructor or admin
      const db = getDb();
      
      const [updated] = await db
        .update(classRegistrations)
        .set({
          attendanceStatus: input.attendanceStatus,
        })
        .where(eq(classRegistrations.id, input.registrationId))
        .returning();
      
      return updated;
    }),
});
