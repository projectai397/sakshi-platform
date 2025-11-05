import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { emailMarketingService } from '../lib/ai-email';
export const emailMarketingRouter = router({
  generate: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => emailMarketingService.generateCampaign(input.userId)),
});
