import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../trpc';
import { getDb } from '../../db';
import { mealSubscriptions, subscriptionDeliveries } from '../../../drizzle/schema-cafe';
import { eq, and, desc } from 'drizzle-orm';

export const mealSubscriptionsRouter = router({
  // Create meal subscription
  createSubscription: protectedProcedure
    .input(z.object({
      frequency: z.enum(['daily', 'weekly', 'bi-weekly']),
      mealsPerDelivery: z.number().min(1),
      deliveryAddress: z.string(),
      deliveryTimePreference: z.string(),
      priceTier: z.enum(['community', 'fair', 'supporter']),
      mealPreferences: z.object({
        categories: z.array(z.string()).optional(),
        excludeIngredients: z.array(z.string()).optional(),
        dietaryRestrictions: z.array(z.string()).optional(),
        spiceLevel: z.string().optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      // Calculate next delivery date
      const nextDeliveryDate = new Date();
      nextDeliveryDate.setDate(nextDeliveryDate.getDate() + 1);
      
      // Calculate amount per cycle (simplified)
      const basePrice = input.priceTier === 'community' ? 100 : 
                       input.priceTier === 'fair' ? 150 : 200;
      const amountPerCycle = basePrice * input.mealsPerDelivery;
      
      const [subscription] = await db
        .insert(mealSubscriptions)
        .values({
          userId: ctx.user.id,
          frequency: input.frequency,
          mealsPerDelivery: input.mealsPerDelivery,
          deliveryAddress: input.deliveryAddress,
          deliveryTimePreference: input.deliveryTimePreference,
          priceTier: input.priceTier,
          mealPreferences: input.mealPreferences,
          status: 'active',
          nextDeliveryDate,
          billingCycleStart: new Date(),
          amountPerCycle: amountPerCycle.toString(),
        })
        .returning();
      
      return subscription;
    }),

  // Get user's subscriptions
  getMySubscriptions: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const subscriptions = await db
        .select()
        .from(mealSubscriptions)
        .where(eq(mealSubscriptions.userId, ctx.user.id))
        .orderBy(desc(mealSubscriptions.createdAt));
      
      return subscriptions;
    }),

  // Get single subscription
  getSubscription: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      
      const [subscription] = await db
        .select()
        .from(mealSubscriptions)
        .where(
          and(
            eq(mealSubscriptions.id, input.id),
            eq(mealSubscriptions.userId, ctx.user.id)
          )
        );
      
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      return subscription;
    }),

  // Update subscription
  updateSubscription: protectedProcedure
    .input(z.object({
      id: z.number(),
      frequency: z.enum(['daily', 'weekly', 'bi-weekly']).optional(),
      mealsPerDelivery: z.number().optional(),
      deliveryAddress: z.string().optional(),
      deliveryTimePreference: z.string().optional(),
      priceTier: z.enum(['community', 'fair', 'supporter']).optional(),
      mealPreferences: z.any().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      // Verify ownership
      const [subscription] = await db
        .select()
        .from(mealSubscriptions)
        .where(
          and(
            eq(mealSubscriptions.id, id),
            eq(mealSubscriptions.userId, ctx.user.id)
          )
        );
      
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      const [updated] = await db
        .update(mealSubscriptions)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(mealSubscriptions.id, id))
        .returning();
      
      return updated;
    }),

  // Pause subscription
  pauseSubscription: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [updated] = await db
        .update(mealSubscriptions)
        .set({
          status: 'paused',
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(mealSubscriptions.id, input.id),
            eq(mealSubscriptions.userId, ctx.user.id)
          )
        )
        .returning();
      
      return updated;
    }),

  // Resume subscription
  resumeSubscription: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [updated] = await db
        .update(mealSubscriptions)
        .set({
          status: 'active',
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(mealSubscriptions.id, input.id),
            eq(mealSubscriptions.userId, ctx.user.id)
          )
        )
        .returning();
      
      return updated;
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [updated] = await db
        .update(mealSubscriptions)
        .set({
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(mealSubscriptions.id, input.id),
            eq(mealSubscriptions.userId, ctx.user.id)
          )
        )
        .returning();
      
      return updated;
    }),

  // Get subscription deliveries
  getSubscriptionDeliveries: protectedProcedure
    .input(z.object({
      subscriptionId: z.number(),
      limit: z.number().default(20),
    }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      
      // Verify subscription ownership
      const [subscription] = await db
        .select()
        .from(mealSubscriptions)
        .where(
          and(
            eq(mealSubscriptions.id, input.subscriptionId),
            eq(mealSubscriptions.userId, ctx.user.id)
          )
        );
      
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      const deliveries = await db
        .select()
        .from(subscriptionDeliveries)
        .where(eq(subscriptionDeliveries.subscriptionId, input.subscriptionId))
        .orderBy(desc(subscriptionDeliveries.deliveryDate))
        .limit(input.limit);
      
      return deliveries;
    }),

  // Skip next delivery
  skipNextDelivery: protectedProcedure
    .input(z.object({ subscriptionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      // Verify ownership
      const [subscription] = await db
        .select()
        .from(mealSubscriptions)
        .where(
          and(
            eq(mealSubscriptions.id, input.subscriptionId),
            eq(mealSubscriptions.userId, ctx.user.id)
          )
        );
      
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      // Calculate new next delivery date
      let daysToAdd = 1;
      if (subscription.frequency === 'weekly') daysToAdd = 7;
      else if (subscription.frequency === 'bi-weekly') daysToAdd = 14;
      
      const currentNextDate = subscription.nextDeliveryDate || new Date();
      const newNextDate = new Date(currentNextDate);
      newNextDate.setDate(newNextDate.getDate() + daysToAdd);
      
      const [updated] = await db
        .update(mealSubscriptions)
        .set({
          nextDeliveryDate: newNextDate,
          updatedAt: new Date(),
        })
        .where(eq(mealSubscriptions.id, input.subscriptionId))
        .returning();
      
      return updated;
    }),
});
