import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../_core/trpc';
import { getDb } from '../../db';
import { sakshiMenuItems, recipes } from '../../../drizzle/schema-cafe';
import { eq, and, like, sql } from 'drizzle-orm';

export const cafeMenuRouter = router({
  // Get all menu items with optional filtering
  getMenuItems: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      isAvailable: z.boolean().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      
      if (input.category) {
        conditions.push(eq(sakshiMenuItems.category, input.category));
      }
      
      if (input.isAvailable !== undefined) {
        conditions.push(eq(sakshiMenuItems.isAvailable, input.isAvailable));
      }
      
      if (input.search) {
        conditions.push(
          sql`${sakshiMenuItems.name} LIKE ${`%${input.search}%`} OR ${sakshiMenuItems.description} LIKE ${`%${input.search}%`}`
        );
      }
      
      const items = await db
        .select()
        .from(sakshiMenuItems)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(sakshiMenuItems.category, sakshiMenuItems.name);
      
      return items;
    }),

  // Get single menu item by ID
  getMenuItem: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [item] = await db
        .select()
        .from(sakshiMenuItems)
        .where(eq(sakshiMenuItems.id, input.id));
      
      if (!item) {
        throw new Error('Menu item not found');
      }
      
      return item;
    }),

  // Create menu item (admin only)
  createMenuItem: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.string(),
      imageUrl: z.string().optional(),
      preparationTime: z.number().optional(),
      servingSize: z.string().optional(),
      calories: z.number().optional(),
      proteinG: z.number().optional(),
      carbsG: z.number().optional(),
      fatG: z.number().optional(),
      fiberG: z.number().optional(),
      ayurvedicProperties: z.any().optional(),
      allergens: z.array(z.string()).optional(),
      communityPrice: z.number(),
      fairPrice: z.number(),
      supporterPrice: z.number(),
      recipeId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      
      const [newItem] = await db
        .insert(sakshiMenuItems)
        .values({
          ...input,
          proteinG: input.proteinG?.toString(),
          carbsG: input.carbsG?.toString(),
          fatG: input.fatG?.toString(),
          fiberG: input.fiberG?.toString(),
          communityPrice: input.communityPrice.toString(),
          fairPrice: input.fairPrice.toString(),
          supporterPrice: input.supporterPrice.toString(),
        })
        .returning();
      
      return newItem;
    }),

  // Update menu item
  updateMenuItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      imageUrl: z.string().optional(),
      preparationTime: z.number().optional(),
      servingSize: z.string().optional(),
      calories: z.number().optional(),
      proteinG: z.number().optional(),
      carbsG: z.number().optional(),
      fatG: z.number().optional(),
      fiberG: z.number().optional(),
      ayurvedicProperties: z.any().optional(),
      allergens: z.array(z.string()).optional(),
      communityPrice: z.number().optional(),
      fairPrice: z.number().optional(),
      supporterPrice: z.number().optional(),
      isAvailable: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      const updateData: any = { ...updates, updatedAt: new Date() };
      
      // Convert numbers to strings for decimal fields
      if (updates.proteinG !== undefined) updateData.proteinG = updates.proteinG.toString();
      if (updates.carbsG !== undefined) updateData.carbsG = updates.carbsG.toString();
      if (updates.fatG !== undefined) updateData.fatG = updates.fatG.toString();
      if (updates.fiberG !== undefined) updateData.fiberG = updates.fiberG.toString();
      if (updates.communityPrice !== undefined) updateData.communityPrice = updates.communityPrice.toString();
      if (updates.fairPrice !== undefined) updateData.fairPrice = updates.fairPrice.toString();
      if (updates.supporterPrice !== undefined) updateData.supporterPrice = updates.supporterPrice.toString();
      
      const [updatedItem] = await db
        .update(sakshiMenuItems)
        .set(updateData)
        .where(eq(sakshiMenuItems.id, id))
        .returning();
      
      return updatedItem;
    }),

  // Delete menu item
  deleteMenuItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      await db
        .delete(sakshiMenuItems)
        .where(eq(sakshiMenuItems.id, input.id));
      
      return { success: true };
    }),

  // Get menu categories
  getCategories: publicProcedure
    .query(async () => {
      const db = getDb();
      
      const categories = await db
        .selectDistinct({ category: sakshiMenuItems.category })
        .from(sakshiMenuItems)
        .where(eq(sakshiMenuItems.isAvailable, true));
      
      return categories.map(c => c.category).filter(Boolean);
    }),
});
