import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { demandService } from '../lib/ai-demand';
export const demandRouter = router({
  forecast: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => demandService.forecastDemand(input.category)),
});
