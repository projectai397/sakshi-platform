import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { fraudService } from '../lib/ai-fraud';
export const fraudRouter = router({
  check: protectedProcedure
    .input(z.object({ transactionId: z.number() }))
    .mutation(async ({ input }) => fraudService.detectFraud(input)),
});
