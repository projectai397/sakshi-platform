import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { taggingService } from '../lib/ai-tagging';
export const taggingRouter = router({
  tag: protectedProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ input }) => taggingService.tagProduct(input.description)),
});
