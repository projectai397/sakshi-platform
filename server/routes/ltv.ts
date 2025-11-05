import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { ltvService } from '../lib/ai-ltv';
export const ltvRouter = router({
  predict: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => ltvService.predictLTV(input.userId)),
});
