import { z } from 'zod';
import { router, protectedProcedure } from '../../_core/trpc';
import { getDb } from '../../db';
import { nutritionLogs, healthMetrics } from '../../../drizzle/schema-cafe';
import { eq, and, between, desc, sql } from 'drizzle-orm';

export const healthTrackingRouter = router({
  // Log nutrition
  logNutrition: protectedProcedure
    .input(z.object({
      logDate: z.date(),
      mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
      sourceType: z.enum(['cafe_order', 'recipe', 'manual']),
      sourceId: z.number().optional(),
      foodName: z.string(),
      portionSize: z.string().optional(),
      calories: z.number(),
      proteinG: z.number().optional(),
      carbsG: z.number().optional(),
      fatG: z.number().optional(),
      fiberG: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [log] = await db
        .insert(nutritionLogs)
        .values({
          userId: ctx.user.id,
          ...input,
          proteinG: input.proteinG?.toString(),
          carbsG: input.carbsG?.toString(),
          fatG: input.fatG?.toString(),
          fiberG: input.fiberG?.toString(),
        })
        .returning();
      
      return log;
    }),

  // Get nutrition logs
  getNutritionLogs: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
      mealType: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const conditions = [
        eq(nutritionLogs.userId, ctx.user.id),
        between(nutritionLogs.logDate, input.startDate, input.endDate),
      ];
      
      if (input.mealType) {
        conditions.push(eq(nutritionLogs.mealType, input.mealType));
      }
      
      const logs = await db
        .select()
        .from(nutritionLogs)
        .where(and(...conditions))
        .orderBy(desc(nutritionLogs.logDate), nutritionLogs.mealType);
      
      return logs;
    }),

  // Get daily nutrition summary
  getDailyNutritionSummary: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      
      const summary = await db
        .select({
          totalCalories: sql<number>`SUM(${nutritionLogs.calories})`,
          totalProtein: sql<number>`SUM(CAST(${nutritionLogs.proteinG} AS DECIMAL))`,
          totalCarbs: sql<number>`SUM(CAST(${nutritionLogs.carbsG} AS DECIMAL))`,
          totalFat: sql<number>`SUM(CAST(${nutritionLogs.fatG} AS DECIMAL))`,
          totalFiber: sql<number>`SUM(CAST(${nutritionLogs.fiberG} AS DECIMAL))`,
          mealCount: sql<number>`COUNT(*)`,
        })
        .from(nutritionLogs)
        .where(
          and(
            eq(nutritionLogs.userId, ctx.user.id),
            eq(nutritionLogs.logDate, input.date)
          )
        );
      
      return summary[0];
    }),

  // Log health metrics
  logHealthMetrics: protectedProcedure
    .input(z.object({
      metricDate: z.date(),
      weightKg: z.number().optional(),
      bloodSugarMgDl: z.number().optional(),
      bloodPressureSystolic: z.number().optional(),
      bloodPressureDiastolic: z.number().optional(),
      energyLevel: z.number().min(1).max(10).optional(),
      mood: z.number().min(1).max(10).optional(),
      sleepHours: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      // Check if metrics already exist for this date
      const existing = await db
        .select()
        .from(healthMetrics)
        .where(
          and(
            eq(healthMetrics.userId, ctx.user.id),
            eq(healthMetrics.metricDate, input.metricDate)
          )
        );
      
      if (existing.length > 0) {
        // Update existing
        const [updated] = await db
          .update(healthMetrics)
          .set({
            ...input,
            weightKg: input.weightKg?.toString(),
            sleepHours: input.sleepHours?.toString(),
          })
          .where(eq(healthMetrics.id, existing[0].id))
          .returning();
        
        return updated;
      } else {
        // Create new
        const [log] = await db
          .insert(healthMetrics)
          .values({
            userId: ctx.user.id,
            ...input,
            weightKg: input.weightKg?.toString(),
            sleepHours: input.sleepHours?.toString(),
          })
          .returning();
        
        return log;
      }
    }),

  // Get health metrics
  getHealthMetrics: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      
      const metrics = await db
        .select()
        .from(healthMetrics)
        .where(
          and(
            eq(healthMetrics.userId, ctx.user.id),
            between(healthMetrics.metricDate, input.startDate, input.endDate)
          )
        )
        .orderBy(healthMetrics.metricDate);
      
      return metrics;
    }),

  // Get health trends
  getHealthTrends: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
      metric: z.enum(['weight', 'bloodSugar', 'bloodPressure', 'energy', 'mood', 'sleep']),
    }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      
      const metrics = await db
        .select()
        .from(healthMetrics)
        .where(
          and(
            eq(healthMetrics.userId, ctx.user.id),
            between(healthMetrics.metricDate, input.startDate, input.endDate)
          )
        )
        .orderBy(healthMetrics.metricDate);
      
      // Extract the specific metric
      const trend = metrics.map(m => ({
        date: m.metricDate,
        value: input.metric === 'weight' ? m.weightKg :
               input.metric === 'bloodSugar' ? m.bloodSugarMgDl :
               input.metric === 'bloodPressure' ? m.bloodPressureSystolic :
               input.metric === 'energy' ? m.energyLevel :
               input.metric === 'mood' ? m.mood :
               input.metric === 'sleep' ? m.sleepHours : null,
      })).filter(t => t.value !== null);
      
      return trend;
    }),

  // Delete nutrition log
  deleteNutritionLog: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      await db
        .delete(nutritionLogs)
        .where(
          and(
            eq(nutritionLogs.id, input.id),
            eq(nutritionLogs.userId, ctx.user.id)
          )
        );
      
      return { success: true };
    }),
});
