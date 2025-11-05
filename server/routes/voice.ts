import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { voiceService } from '../lib/ai-voice';
export const voiceRouter = router({
  search: publicProcedure
    .input(z.object({ audio: z.string() }))
    .mutation(async ({ input }) => voiceService.processVoiceSearch(input.audio)),
});
