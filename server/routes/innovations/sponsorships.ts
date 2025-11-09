import { router, protectedProcedure, publicProcedure } from '../../_core/trpc';
import { z } from 'zod';
import { db } from '../../db';
import { mealSponsorships, sponsoredMealRedemptions, sponsorshipImpactBoard } from '../../../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

export const sponsorshipsRouter = router({
  // Create a meal sponsorship
  create: protectedProcedure
    .input(z.object({
      mealCount: z.number().min(1).max(100),
      amountPaid: z.number().positive(),
      message: z.string().optional(),
      isAnonymous: z.boolean().default(true),
      expiresInDays: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const expiresAt = input.expiresInDays 
        ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
        : null;

      const [sponsorship] = await db.insert(mealSponsorships).values({
        sponsorUserId: ctx.user.id,
        mealCount: input.mealCount,
        amountPaid: input.amountPaid.toString(),
        message: input.message,
        isAnonymous: input.isAnonymous,
        expiresAt,
        status: 'active',
      });

      return { success: true, sponsorshipId: sponsorship.insertId };
    }),

  // Redeem a sponsored meal
  redeem: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      amountCovered: z.number().positive(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Find available sponsorship
      const availableSponsorships = await db.select()
        .from(mealSponsorships)
        .where(and(
          eq(mealSponsorships.status, 'active'),
          sql`${mealSponsorships.mealsRedeemed} < ${mealSponsorships.mealCount}`
        ))
        .limit(1);

      if (availableSponsorships.length === 0) {
        throw new Error('No sponsored meals available');
      }

      const sponsorship = availableSponsorships[0];

      // Create redemption record
      await db.insert(sponsoredMealRedemptions).values({
        sponsorshipId: sponsorship.id,
        recipientUserId: ctx.user.id,
        orderId: input.orderId,
        amountCovered: input.amountCovered.toString(),
      });

      // Update sponsorship
      await db.update(mealSponsorships)
        .set({ 
          mealsRedeemed: sql`${mealSponsorships.mealsRedeemed} + 1`,
          status: sql`CASE WHEN ${mealSponsorships.mealsRedeemed} + 1 >= ${mealSponsorships.mealCount} THEN 'completed' ELSE 'active' END`
        })
        .where(eq(mealSponsorships.id, sponsorship.id));

      return { success: true, message: 'Meal sponsored successfully!' };
    }),

  // Add gratitude note
  addGratitude: protectedProcedure
    .input(z.object({
      redemptionId: z.number(),
      gratitudeNote: z.string().min(1).max(500),
    }))
    .mutation(async ({ input }) => {
      await db.update(sponsoredMealRedemptions)
        .set({ gratitudeNote: input.gratitudeNote })
        .where(eq(sponsoredMealRedemptions.id, input.redemptionId));

      return { success: true };
    }),

  // Get impact board for location
  getImpactBoard: publicProcedure
    .input(z.object({
      locationId: z.number(),
      date: z.string().optional(), // YYYY-MM-DD
    }))
    .query(async ({ input }) => {
      const targetDate = input.date || new Date().toISOString().split('T')[0];

      const board = await db.select()
        .from(sponsorshipImpactBoard)
        .where(and(
          eq(sponsorshipImpactBoard.locationId, input.locationId),
          eq(sponsorshipImpactBoard.date, targetDate)
        ))
        .limit(1);

      if (board.length === 0) {
        return {
          totalMealsSponsored: 0,
          totalMealsRedeemed: 0,
          totalAmountSponsored: 0,
          topSponsorMessage: null,
        };
      }

      return board[0];
    }),

  // Get user's sponsorship history
  getMySponsorships: protectedProcedure
    .query(async ({ ctx }) => {
      const sponsorships = await db.select()
        .from(mealSponsorships)
        .where(eq(mealSponsorships.sponsorUserId, ctx.user.id))
        .orderBy(sql`${mealSponsorships.createdAt} DESC`);

      return sponsorships;
    }),

  // Get user's redeemed meals
  getMyRedemptions: protectedProcedure
    .query(async ({ ctx }) => {
      const redemptions = await db.select()
        .from(sponsoredMealRedemptions)
        .where(eq(sponsoredMealRedemptions.recipientUserId, ctx.user.id))
        .orderBy(sql`${sponsoredMealRedemptions.redeemedAt} DESC`);

      return redemptions;
    }),

  // Get available sponsored meals count
  getAvailableCount: publicProcedure
    .query(async () => {
      const result = await db.select({
        availableMeals: sql`SUM(${mealSponsorships.mealCount} - ${mealSponsorships.mealsRedeemed})`
      })
      .from(mealSponsorships)
      .where(eq(mealSponsorships.status, 'active'));

      return { availableMeals: result[0]?.availableMeals || 0 };
    }),
});
