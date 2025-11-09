import { router, protectedProcedure, publicProcedure } from '../../_core/trpc';
import { z } from 'zod';
import { db } from '../../db';
import { regenerativeActions, sevaWallets, sevaTransactions } from '../../../drizzle/schema';
import { eq, sql, desc } from 'drizzle-orm';

export const regenerativeCreditsRouter = router({
  // Log regenerative action
  logAction: protectedProcedure
    .input(z.object({
      actionType: z.enum(['bring_container', 'bicycle_delivery', 'off_peak_dining', 'volunteer', 'referral', 'review', 'social_share']),
      orderId: z.number().optional(),
      details: z.string().optional(),
      proof: z.string().optional(), // Photo or link
    }))
    .mutation(async ({ input, ctx }) => {
      // Token rewards by action type
      const tokenRewards: Record<string, number> = {
        bring_container: 10,
        bicycle_delivery: 20,
        off_peak_dining: 0, // Percentage discount instead
        volunteer: 100, // Per 2 hours
        referral: 50,
        review: 10,
        social_share: 5,
      };

      const tokensEarned = tokenRewards[input.actionType] || 0;

      // Log action
      const [action] = await db.insert(regenerativeActions).values({
        customerId: ctx.user.id,
        actionType: input.actionType,
        tokensEarned,
        orderId: input.orderId,
        details: input.details,
        proof: input.proof,
      });

      // Award tokens
      if (tokensEarned > 0) {
        const wallet = await db.select()
          .from(sevaWallets)
          .where(eq(sevaWallets.userId, ctx.user.id))
          .limit(1);

        if (wallet.length > 0) {
          await db.update(sevaWallets)
            .set({
              balance: sql`${sevaWallets.balance} + ${tokensEarned}`,
              lifetimeEarned: sql`${sevaWallets.lifetimeEarned} + ${tokensEarned}`,
            })
            .where(eq(sevaWallets.id, wallet[0].id));

          await db.insert(sevaTransactions).values({
            walletId: wallet[0].id,
            type: 'earn',
            amount: tokensEarned,
            description: `Regenerative action: ${input.actionType}`,
            relatedEntityType: 'regenerative_action',
            relatedEntityId: action.insertId,
          });
        }
      }

      return { success: true, tokensEarned, actionId: action.insertId };
    }),

  // Get user's regenerative actions
  getMyActions: protectedProcedure
    .query(async ({ ctx }) => {
      const actions = await db.select()
        .from(regenerativeActions)
        .where(eq(regenerativeActions.customerId, ctx.user.id))
        .orderBy(desc(regenerativeActions.createdAt))
        .limit(100);

      return actions;
    }),

  // Get leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const leaderboard = await db.select({
        customerId: regenerativeActions.customerId,
        totalTokens: sql`SUM(${regenerativeActions.tokensEarned})`,
        actionCount: sql`COUNT(*)`,
      })
      .from(regenerativeActions)
      .groupBy(regenerativeActions.customerId)
      .orderBy(sql`SUM(${regenerativeActions.tokensEarned}) DESC`)
      .limit(input.limit);

      return leaderboard;
    }),

  // Get carbon savings
  getCarbonSavings: protectedProcedure
    .query(async ({ ctx }) => {
      const actions = await db.select()
        .from(regenerativeActions)
        .where(eq(regenerativeActions.customerId, ctx.user.id));

      // Estimate carbon savings (in kg CO2)
      const carbonSavings: Record<string, number> = {
        bring_container: 0.05, // 50g per container
        bicycle_delivery: 2.0, // 2kg per delivery
        volunteer: 0, // Indirect impact
        referral: 0, // Indirect impact
        review: 0,
        social_share: 0,
      };

      const totalCarbonSaved = actions.reduce((sum, action) => {
        return sum + (carbonSavings[action.actionType] || 0);
      }, 0);

      return {
        totalCarbonSavedKg: totalCarbonSaved,
        treesEquivalent: Math.round(totalCarbonSaved / 20), // 1 tree = ~20kg CO2/year
        actions,
      };
    }),
});
