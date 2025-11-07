import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { SakshiCoinService } from "../lib/sakshichain/sakshicoin";
import { TRPCError } from "@trpc/server";

export const sakshicoinRouter = router({
  // Get or create wallet for current user
  getWallet: protectedProcedure
    .query(async ({ ctx }) => {
      const wallet = await SakshiCoinService.getOrCreateWallet(ctx.user.id);
      return wallet;
    }),

  // Get wallet balance
  getBalance: protectedProcedure
    .query(async ({ ctx }) => {
      const wallet = await SakshiCoinService.getWalletByUserId(ctx.user.id);
      
      if (!wallet) {
        return { balance: "0", totalEarned: "0", totalSpent: "0" };
      }

      return {
        balance: wallet.balance,
        totalEarned: wallet.totalEarned,
        totalSpent: wallet.totalSpent,
      };
    }),

  // Get transaction history
  getTransactions: protectedProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const transactions = await SakshiCoinService.getTransactionHistory(
        ctx.user.id,
        input.limit
      );
      return transactions;
    }),

  // Award tokens (admin or system)
  awardTokens: protectedProcedure
    .input(z.object({
      userId: z.number(),
      amount: z.number(),
      type: z.string(),
      category: z.string(),
      description: z.string(),
      relatedProductId: z.number().optional(),
      relatedOrderId: z.number().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const transaction = await SakshiCoinService.awardTokens(input);
        return { success: true, transaction };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to award tokens",
        });
      }
    }),

  // Spend tokens
  spendTokens: protectedProcedure
    .input(z.object({
      amount: z.number(),
      type: z.string(),
      category: z.string(),
      description: z.string(),
      relatedProductId: z.number().optional(),
      relatedOrderId: z.number().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const transaction = await SakshiCoinService.spendTokens({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, transaction };
      } catch (error: any) {
        if (error.message === "Insufficient SAK balance") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient SAK balance",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to spend tokens",
        });
      }
    }),

  // Transfer tokens to another user
  transferTokens: protectedProcedure
    .input(z.object({
      toUserId: z.number(),
      amount: z.number(),
      description: z.string(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const transaction = await SakshiCoinService.transferTokens({
          fromUserId: ctx.user.id,
          toUserId: input.toUserId,
          amount: input.amount,
          description: input.description,
          metadata: input.metadata,
        });
        return { success: true, transaction };
      } catch (error: any) {
        if (error.message === "Insufficient SAK balance") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient SAK balance",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to transfer tokens",
        });
      }
    }),

  // Stake tokens
  stakeTokens: protectedProcedure
    .input(z.object({
      amount: z.number(),
      stakingPeriodDays: z.number(),
      rewardRate: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const staking = await SakshiCoinService.stakeTokens({
          userId: ctx.user.id,
          amount: input.amount,
          stakingPeriodDays: input.stakingPeriodDays,
          rewardRate: input.rewardRate,
        });
        return { success: true, staking };
      } catch (error: any) {
        if (error.message === "Insufficient SAK balance") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient SAK balance",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to stake tokens",
        });
      }
    }),

  // Calculate reward for an action
  calculateReward: protectedProcedure
    .input(z.object({
      action: z.string(),
      metadata: z.record(z.any()).optional(),
    }))
    .query(async ({ input }) => {
      const reward = SakshiCoinService.calculateReward(input.action, input.metadata);
      return { reward };
    }),

  // Earn SAK for listing a product
  earnForListing: protectedProcedure
    .input(z.object({
      productId: z.number(),
      isQualityListing: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const action = input.isQualityListing ? "listing_premium" : "listing_basic";
      const reward = SakshiCoinService.calculateReward(action);

      const transaction = await SakshiCoinService.awardTokens({
        userId: ctx.user.id,
        amount: reward,
        type: "earn",
        category: "listing",
        description: `Earned SAK for listing product #${input.productId}`,
        relatedProductId: input.productId,
      });

      return { success: true, reward, transaction };
    }),

  // Earn SAK for making a purchase
  earnForPurchase: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      purchaseValue: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const reward = SakshiCoinService.calculateReward("purchase_cashback", {
        purchaseValue: input.purchaseValue,
      });

      const transaction = await SakshiCoinService.awardTokens({
        userId: ctx.user.id,
        amount: reward,
        type: "earn",
        category: "purchase",
        description: `Cashback for order #${input.orderId}`,
        relatedOrderId: input.orderId,
        metadata: { purchaseValue: input.purchaseValue },
      });

      return { success: true, reward, transaction };
    }),

  // Earn SAK for repair/upcycle
  earnForRepair: protectedProcedure
    .input(z.object({
      productId: z.number(),
      repairType: z.enum(["repair", "upcycle", "alteration", "cleaning"]),
      description: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const reward = SakshiCoinService.calculateReward(input.repairType);

      const transaction = await SakshiCoinService.awardTokens({
        userId: ctx.user.id,
        amount: reward,
        type: "earn",
        category: "repair",
        description: input.description,
        relatedProductId: input.productId,
        metadata: { repairType: input.repairType },
      });

      return { success: true, reward, transaction };
    }),
});
