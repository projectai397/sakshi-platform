import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { sentimentService } from '../lib/ai-sentiment';
export const sentimentRouter = router({
  analyze: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => sentimentService.analyzeSentiment(input.text)),
});
