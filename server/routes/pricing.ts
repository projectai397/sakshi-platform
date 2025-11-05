import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { dynamicPricingService } from '../lib/ai-dynamic-pricing';
import * as db from '../db';
import { products } from '@db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const pricingRouter = router({
  /**
   * Get pricing recommendation for a product
   */
  getRecommendation: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        factors: z.object({
          category: z.string(),
          condition: z.string(),
          brand: z.string().optional(),
          ageInDays: z.number(),
          viewCount: z.number(),
          averageMarketPrice: z.number().optional(),
          seasonalityScore: z.number(),
          demandScore: z.number(),
          inventoryLevel: z.number(),
          competitorPrice: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const recommendation = await dynamicPricingService.getPricingRecommendation(
          input.productId,
          input.factors
        );

        return {
          success: true,
          recommendation,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get pricing recommendation',
          cause: error,
        });
      }
    }),

  /**
   * Get auto-pricing for a product (simplified)
   */
  getAutoPrice: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      try {
        const database = await db.getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        // Fetch product
        const product = await database
          .select()
          .from(products)
          .where(eq(products.id, input.productId))
          .limit(1);

        if (!product.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          });
        }

        const prod = product[0];

        // Calculate age
        const ageInDays = Math.floor(
          (Date.now() - new Date(prod.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );

        // Calculate seasonality
        const now = new Date();
        const month = now.getMonth();
        let seasonalityScore = 0.5;
        if (month === 9 || month === 10) seasonalityScore = 0.9; // Diwali
        else if (month === 2 || month === 3) seasonalityScore = 0.7; // Holi

        // Build factors
        const factors = {
          category: prod.category,
          condition: prod.condition,
          ageInDays,
          viewCount: prod.viewCount || 0,
          seasonalityScore,
          demandScore: 0.5, // Default
          inventoryLevel: 50, // Default
        };

        const recommendation = await dynamicPricingService.getPricingRecommendation(
          input.productId,
          factors
        );

        return {
          success: true,
          currentPrice: prod.price,
          currentSevaTokens: prod.sevaTokens,
          recommendation,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get auto pricing',
          cause: error,
        });
      }
    }),

  /**
   * Apply pricing recommendation to product (admin only)
   */
  applyRecommendation: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        recommendedPrice: z.number(),
        recommendedSevaTokens: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can apply pricing recommendations',
        });
      }

      try {
        const database = await db.getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        await database
          .update(products)
          .set({
            price: input.recommendedPrice,
            sevaTokens: input.recommendedSevaTokens,
          })
          .where(eq(products.id, input.productId));

        return {
          success: true,
          message: 'Pricing updated successfully',
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to apply pricing recommendation',
          cause: error,
        });
      }
    }),

  /**
   * Bulk update prices for category (admin only)
   */
  bulkUpdatePrices: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can bulk update prices',
        });
      }

      try {
        const result = await dynamicPricingService.bulkUpdatePrices(input.category);

        return {
          success: true,
          ...result,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to bulk update prices',
          cause: error,
        });
      }
    }),

  /**
   * Train ML pricing model (admin only)
   */
  trainModel: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only admins can train ML models',
      });
    }

    try {
      const result = await dynamicPricingService.trainModel();

      return result;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to train ML model',
        cause: error,
      });
    }
  }),

  /**
   * Get pricing analytics (admin only)
   */
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only admins can view pricing analytics',
      });
    }

    try {
      const analytics = await dynamicPricingService.getPricingAnalytics();

      return {
        success: true,
        analytics,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get pricing analytics',
        cause: error,
      });
    }
  }),

  /**
   * Get pricing history for a product
   */
  getPricingHistory: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      // Placeholder - would fetch from price history table
      return {
        success: true,
        history: [
          {
            date: new Date().toISOString(),
            price: 100,
            sevaTokens: 15,
            reason: 'Initial pricing',
          },
        ],
      };
    }),
});
