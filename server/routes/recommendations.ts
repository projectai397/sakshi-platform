import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { recommendationService } from '../lib/ai-recommendations';
import { TRPCError } from '@trpc/server';

export const recommendationsRouter = router({
  getForUser: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional().default(10) }))
    .query(async ({ input, ctx }) => {
      try {
        const recommendations = await recommendationService.getRecommendationsForUser(
          ctx.user.id,
          input.limit
        );
        return { success: true, recommendations };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get recommendations',
          cause: error,
        });
      }
    }),

  getSimilar: publicProcedure
    .input(z.object({ productId: z.number(), limit: z.number().min(1).max(20).optional().default(6) }))
    .query(async ({ input }) => {
      try {
        const recommendations = await recommendationService.getSimilarProducts(
          input.productId,
          input.limit
        );
        return { success: true, recommendations };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get similar products',
          cause: error,
        });
      }
    }),

  getPopular: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional().default(10) }))
    .query(async ({ input }) => {
      try {
        const recommendations = await recommendationService.getPopularProducts(input.limit);
        return { success: true, recommendations };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get popular products',
          cause: error,
        });
      }
    }),

  getHomepage: publicProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.user?.id || null;
      const recommendations = await recommendationService.getHomepageRecommendations(userId);
      return { success: true, ...recommendations };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get homepage recommendations',
        cause: error,
      });
    }
  }),

  getStatistics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view statistics' });
    }
    try {
      const stats = await recommendationService.getStatistics();
      return { success: true, statistics: stats };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get statistics',
        cause: error,
      });
    }
  }),

  clearCache: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can clear cache' });
    }
    try {
      await recommendationService.clearCache();
      return { success: true, message: 'Cache cleared successfully' };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to clear cache',
        cause: error,
      });
    }
  }),
});
