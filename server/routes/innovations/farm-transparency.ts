import { router, protectedProcedure, publicProcedure } from '../../_core/trpc';
import { z } from 'zod';
import { db } from '../../db';
import { farmers, ingredientSources, menuItemIngredients, farmerTips } from '../../../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

export const farmTransparencyRouter = router({
  // Get all farmers
  getFarmers: publicProcedure
    .query(async () => {
      const allFarmers = await db.select()
        .from(farmers)
        .where(eq(farmers.isActive, true))
        .orderBy(farmers.name);

      return allFarmers;
    }),

  // Get farmer details
  getFarmer: publicProcedure
    .input(z.object({ farmerId: z.number() }))
    .query(async ({ input }) => {
      const farmer = await db.select()
        .from(farmers)
        .where(eq(farmers.id, input.farmerId))
        .limit(1);

      if (farmer.length === 0) {
        throw new Error('Farmer not found');
      }

      // Get farmer's recent ingredient deliveries
      const recentDeliveries = await db.select()
        .from(ingredientSources)
        .where(eq(ingredientSources.farmerId, input.farmerId))
        .orderBy(sql`${ingredientSources.deliveryDate} DESC`)
        .limit(10);

      return {
        ...farmer[0],
        recentDeliveries,
      };
    }),

  // Get ingredient source for menu item
  getMenuItemSources: publicProcedure
    .input(z.object({ menuItemId: z.number() }))
    .query(async ({ input }) => {
      const ingredients = await db.select({
        ingredient: ingredientSources,
        farmer: farmers,
        quantity: menuItemIngredients.quantityUsed,
        unit: menuItemIngredients.unit,
      })
      .from(menuItemIngredients)
      .innerJoin(ingredientSources, eq(menuItemIngredients.ingredientSourceId, ingredientSources.id))
      .innerJoin(farmers, eq(ingredientSources.farmerId, farmers.id))
      .where(eq(menuItemIngredients.menuItemId, input.menuItemId));

      return ingredients;
    }),

  // Tip a farmer
  tipFarmer: protectedProcedure
    .input(z.object({
      farmerId: z.number(),
      amount: z.number().positive(),
      message: z.string().optional(),
      orderId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(farmerTips).values({
        customerId: ctx.user.id,
        farmerId: input.farmerId,
        amount: input.amount.toString(),
        message: input.message,
        orderId: input.orderId,
      });

      return { success: true, message: 'Thank you for supporting our farmers!' };
    }),

  // Get seasonal ingredients
  getSeasonalIngredients: publicProcedure
    .query(async () => {
      const seasonal = await db.select()
        .from(ingredientSources)
        .where(eq(ingredientSources.isSeasonal, true))
        .orderBy(sql`${ingredientSources.deliveryDate} DESC`)
        .limit(20);

      return seasonal;
    }),

  // Get farmer map data (all locations)
  getFarmerMap: publicProcedure
    .query(async () => {
      const farmersWithLocation = await db.select({
        id: farmers.id,
        name: farmers.name,
        farmName: farmers.farmName,
        location: farmers.location,
        latitude: farmers.latitude,
        longitude: farmers.longitude,
        specialties: farmers.specialties,
        farmingMethod: farmers.farmingMethod,
      })
      .from(farmers)
      .where(and(
        eq(farmers.isActive, true),
        sql`${farmers.latitude} IS NOT NULL`,
        sql`${farmers.longitude} IS NOT NULL`
      ));

      return farmersWithLocation;
    }),

  // Admin: Add farmer
  addFarmer: protectedProcedure
    .input(z.object({
      name: z.string(),
      farmName: z.string().optional(),
      location: z.string(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      photo: z.string().optional(),
      story: z.string().optional(),
      certifications: z.array(z.string()).optional(),
      contactPhone: z.string().optional(),
      contactEmail: z.string().optional(),
      farmSize: z.string().optional(),
      farmingMethod: z.string().optional(),
      yearsOfExperience: z.number().optional(),
      specialties: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const [farmer] = await db.insert(farmers).values({
        name: input.name,
        farmName: input.farmName,
        location: input.location,
        latitude: input.latitude?.toString(),
        longitude: input.longitude?.toString(),
        photo: input.photo,
        story: input.story,
        certifications: JSON.stringify(input.certifications || []),
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        farmSize: input.farmSize,
        farmingMethod: input.farmingMethod,
        yearsOfExperience: input.yearsOfExperience,
        specialties: JSON.stringify(input.specialties || []),
        isActive: true,
      });

      return { success: true, farmerId: farmer.insertId };
    }),

  // Admin: Add ingredient source
  addIngredientSource: protectedProcedure
    .input(z.object({
      ingredientName: z.string(),
      farmerId: z.number(),
      harvestDate: z.string(),
      deliveryDate: z.string(),
      quantity: z.number(),
      unit: z.string(),
      pricePerUnit: z.number(),
      marketPricePerUnit: z.number(),
      isOrganic: z.boolean().default(false),
      isSeasonal: z.boolean().default(true),
      batchNumber: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'staff') {
        throw new Error('Unauthorized');
      }

      const fairPricePremium = ((input.pricePerUnit - input.marketPricePerUnit) / input.marketPricePerUnit) * 100;

      const [source] = await db.insert(ingredientSources).values({
        ingredientName: input.ingredientName,
        farmerId: input.farmerId,
        harvestDate: input.harvestDate,
        deliveryDate: input.deliveryDate,
        quantity: input.quantity.toString(),
        unit: input.unit,
        pricePerUnit: input.pricePerUnit.toString(),
        marketPricePerUnit: input.marketPricePerUnit.toString(),
        fairPricePremium: fairPricePremium.toString(),
        isOrganic: input.isOrganic,
        isSeasonal: input.isSeasonal,
        batchNumber: input.batchNumber,
      });

      return { success: true, sourceId: source.insertId };
    }),
});
