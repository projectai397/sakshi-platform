import { router, protectedProcedure } from '../../_core/trpc';
import { z } from 'zod';
import { db } from '../../db';
import { nutritionPassports, impactMilestones } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export const nutritionPassportRouter = router({
  // Get user's nutrition passport
  getPassport: protectedProcedure
    .query(async ({ ctx }) => {
      const passport = await db.select()
        .from(nutritionPassports)
        .where(eq(nutritionPassports.customerId, ctx.user.id))
        .limit(1);

      if (passport.length === 0) {
        // Create new passport
        const [newPassport] = await db.insert(nutritionPassports).values({
          customerId: ctx.user.id,
        });
        return { id: newPassport.insertId, customerId: ctx.user.id, totalMeals: 0 };
      }

      return passport[0];
    }),

  // Record meal nutrition
  recordMeal: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      calories: z.number().optional(),
      protein: z.number().optional(),
      carbs: z.number().optional(),
      fat: z.number().optional(),
      fiber: z.number().optional(),
      carbonFootprint: z.number().optional(),
      waterUsed: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const passport = await db.select()
        .from(nutritionPassports)
        .where(eq(nutritionPassports.customerId, ctx.user.id))
        .limit(1);

      if (passport.length > 0) {
        await db.update(nutritionPassports)
          .set({
            totalMeals: sql`${nutritionPassports.totalMeals} + 1`,
            totalCalories: sql`${nutritionPassports.totalCalories} + ${input.calories || 0}`,
            totalProtein: sql`${nutritionPassports.totalProtein} + ${input.protein || 0}`,
            totalCarbs: sql`${nutritionPassports.totalCarbs} + ${input.carbs || 0}`,
            totalFat: sql`${nutritionPassports.totalFat} + ${input.fat || 0}`,
            totalFiber: sql`${nutritionPassports.totalFiber} + ${input.fiber || 0}`,
            carbonFootprintSaved: sql`${nutritionPassports.carbonFootprintSaved} + ${input.carbonFootprint || 0}`,
            waterSaved: sql`${nutritionPassports.waterSaved} + ${input.waterUsed || 0}`,
          })
          .where(eq(nutritionPassports.id, passport[0].id));
      }

      return { success: true };
    }),

  // Get milestones
  getMilestones: protectedProcedure
    .query(async ({ ctx }) => {
      const milestones = await db.select()
        .from(impactMilestones)
        .where(eq(impactMilestones.customerId, ctx.user.id))
        .orderBy(sql`${impactMilestones.achievedAt} DESC`);

      return milestones;
    }),

  // Export data
  exportData: protectedProcedure
    .query(async ({ ctx }) => {
      const passport = await db.select()
        .from(nutritionPassports)
        .where(eq(nutritionPassports.customerId, ctx.user.id))
        .limit(1);

      const milestones = await db.select()
        .from(impactMilestones)
        .where(eq(impactMilestones.customerId, ctx.user.id));

      return {
        passport: passport[0] || null,
        milestones,
        exportDate: new Date().toISOString(),
      };
    }),
});
