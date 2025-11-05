import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { visualSearchService } from '../lib/ai-visual-search';
import { TRPCError } from '@trpc/server';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

export const visualSearchRouter = router({
  /**
   * Search by text description (text-to-image)
   */
  searchByText: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).optional().default(10),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const results = await visualSearchService.searchByText(
          input.query,
          input.limit
        );

        return {
          success: true,
          ...results,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to perform visual search',
          cause: error,
        });
      }
    }),

  /**
   * Search by uploaded image (reverse image search)
   * Note: Image upload handled separately via Express endpoint
   */
  searchByImage: publicProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        limit: z.number().min(1).max(50).optional().default(10),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // For now, we'll use the image URL directly
        // In production, download and process the image
        const results = await visualSearchService.searchByImage(
          input.imageUrl,
          input.limit
        );

        return {
          success: true,
          ...results,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to perform image search',
          cause: error,
        });
      }
    }),

  /**
   * Index all products for visual search (admin only)
   */
  indexProducts: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only admins can index products',
      });
    }

    try {
      const result = await visualSearchService.indexAllProducts();

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to index products',
        cause: error,
      });
    }
  }),

  /**
   * Get visual search statistics (admin only)
   */
  getStatistics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only admins can view statistics',
      });
    }

    try {
      const stats = await visualSearchService.getStatistics();

      return {
        success: true,
        statistics: stats,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get statistics',
        cause: error,
      });
    }
  }),

  /**
   * Clear visual search cache (admin only)
   */
  clearCache: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only admins can clear cache',
      });
    }

    try {
      await visualSearchService.clearCache();

      return {
        success: true,
        message: 'Cache cleared successfully',
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to clear cache',
        cause: error,
      });
    }
  }),

  /**
   * Get similar products for a specific product
   */
  getSimilarProducts: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        limit: z.number().min(1).max(20).optional().default(6),
      })
    )
    .query(async ({ input }) => {
      try {
        // Get product details
        const database = await import('../db').then(m => m.getDb());
        if (!database) {
          throw new Error('Database not available');
        }

        const product = await import('../db').then(m => 
          m.getProductById(input.productId)
        );

        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          });
        }

        // Get product images
        const images = JSON.parse(product.images || '[]');
        if (images.length === 0) {
          return {
            success: true,
            results: [],
            queryTime: 0,
            totalProducts: 0,
          };
        }

        // Search by first image
        const results = await visualSearchService.searchByImage(
          images[0],
          input.limit + 1 // +1 to exclude the query product itself
        );

        // Filter out the query product
        const filtered = results.results.filter(
          (r) => r.productId !== input.productId
        );

        return {
          success: true,
          results: filtered.slice(0, input.limit),
          queryTime: results.queryTime,
          totalProducts: results.totalProducts,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get similar products',
          cause: error,
        });
      }
    }),
});
