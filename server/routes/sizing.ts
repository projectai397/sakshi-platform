import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { sizingService } from '../lib/ai-sizing';
export const sizingRouter = router({
  recommend: protectedProcedure
    .input(z.object({ userId: z.number(), productId: z.number() }))
    .query(async ({ input }) => sizingService.recommendSize(input.userId, input.productId)),
});
