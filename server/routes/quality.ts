import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { qualityService } from '../lib/ai-quality';
import { TRPCError } from '@trpc/server';

export const qualityRouter = router({
  assess: protectedProcedure
    .input(z.object({ imageUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const result = await qualityService.assessQuality(input.imageUrl);
      return result;
    }),
});
