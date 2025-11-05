import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { inventoryService } from '../lib/ai-inventory';
import { TRPCError } from '@trpc/server';

export const inventoryRouter = router({
  predictVelocity: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
      }
      try {
        const prediction = await inventoryService.predictVelocity(input.productId);
        return { success: true, prediction };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to predict velocity', cause: error });
      }
    }),

  getDeadStock: protectedProcedure
    .input(z.object({ thresholdDays: z.number().optional().default(60) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
      }
      try {
        const alerts = await inventoryService.identifyDeadStock(input.thresholdDays);
        return { success: true, alerts, count: alerts.length };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to identify dead stock', cause: error });
      }
    }),

  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
    }
    try {
      const metrics = await inventoryService.getInventoryMetrics();
      return { success: true, metrics };
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get metrics', cause: error });
    }
  }),
});
