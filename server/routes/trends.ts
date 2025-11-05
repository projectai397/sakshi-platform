import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { trendService } from '../lib/ai-trends';
export const trendRouter = router({
  predict: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => trendService.predictTrends(input.category)),
});
