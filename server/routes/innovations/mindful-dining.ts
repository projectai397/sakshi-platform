import { router, protectedProcedure, publicProcedure } from '../../_core/trpc';
import { z } from 'zod';
import { db } from '../../db';
import { mindfulEatingSessions, gratitudeNotes, sevaWallets, sevaTransactions } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export const mindfulDiningRouter = router({
  // Start mindful eating session
  startSession: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      meditationCompleted: z.boolean().default(false),
      meditationDuration: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const [session] = await db.insert(mindfulEatingSessions).values({
        customerId: ctx.user.id,
        orderId: input.orderId,
        meditationCompleted: input.meditationCompleted,
        meditationDuration: input.meditationDuration,
        startTime: new Date(),
      });

      return { success: true, sessionId: session.insertId };
    }),

  // Complete mindful eating session
  completeSession: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      mealDuration: z.number(), // in minutes
      gratitudeExpressed: z.boolean().default(false),
      doshaBalanceRating: z.number().min(1).max(5).optional(),
      wastePhoto: z.string().optional(),
      hadZeroWaste: z.boolean().default(false),
      mindfulnessRating: z.number().min(1).max(5).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Update session
      await db.update(mindfulEatingSessions)
        .set({
          endTime: new Date(),
          mealDuration: input.mealDuration,
          gratitudeExpressed: input.gratitudeExpressed,
          doshaBalanceRating: input.doshaBalanceRating,
          wastePhoto: input.wastePhoto,
          hadZeroWaste: input.hadZeroWaste,
          mindfulnessRating: input.mindfulnessRating,
          notes: input.notes,
        })
        .where(eq(mindfulEatingSessions.id, input.sessionId));

      // Calculate seva tokens earned
      let tokensEarned = 0;
      
      // 20+ minute meal: 5 tokens
      if (input.mealDuration >= 20) tokensEarned += 5;
      
      // Meditation completed: 10 tokens
      const session = await db.select()
        .from(mindfulEatingSessions)
        .where(eq(mindfulEatingSessions.id, input.sessionId))
        .limit(1);
      
      if (session[0]?.meditationCompleted) tokensEarned += 10;
      
      // Gratitude expressed: 5 tokens
      if (input.gratitudeExpressed) tokensEarned += 5;
      
      // Zero waste: 10 tokens
      if (input.hadZeroWaste) tokensEarned += 10;

      // Award tokens
      if (tokensEarned > 0) {
        // Get user's wallet
        const wallet = await db.select()
          .from(sevaWallets)
          .where(eq(sevaWallets.userId, ctx.user.id))
          .limit(1);

        if (wallet.length > 0) {
          // Update wallet
          await db.update(sevaWallets)
            .set({
              balance: sql`${sevaWallets.balance} + ${tokensEarned}`,
              lifetimeEarned: sql`${sevaWallets.lifetimeEarned} + ${tokensEarned}`,
            })
            .where(eq(sevaWallets.id, wallet[0].id));

          // Create transaction
          await db.insert(sevaTransactions).values({
            walletId: wallet[0].id,
            type: 'earn',
            amount: tokensEarned,
            description: `Mindful dining rewards (${input.mealDuration} min meal)`,
            relatedEntityType: 'mindful_session',
            relatedEntityId: input.sessionId,
          });
        }
      }

      return {
        success: true,
        tokensEarned,
        message: `Session complete! You earned ${tokensEarned} seva tokens.`,
      };
    }),

  // Add gratitude note
  addGratitude: protectedProcedure
    .input(z.object({
      gratitudeText: z.string().min(10).max(500),
      isPublic: z.boolean().default(true),
      sessionId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const [note] = await db.insert(gratitudeNotes).values({
        customerId: ctx.user.id,
        gratitudeText: input.gratitudeText,
        isPublic: input.isPublic,
        sessionId: input.sessionId,
      });

      // Award 5 tokens for gratitude
      const wallet = await db.select()
        .from(sevaWallets)
        .where(eq(sevaWallets.userId, ctx.user.id))
        .limit(1);

      if (wallet.length > 0) {
        await db.update(sevaWallets)
          .set({
            balance: sql`${sevaWallets.balance} + 5`,
            lifetimeEarned: sql`${sevaWallets.lifetimeEarned} + 5`,
          })
          .where(eq(sevaWallets.id, wallet[0].id));

        await db.insert(sevaTransactions).values({
          walletId: wallet[0].id,
          type: 'earn',
          amount: 5,
          description: 'Gratitude journal entry',
          relatedEntityType: 'gratitude_note',
          relatedEntityId: note.insertId,
        });
      }

      return { success: true, tokensEarned: 5 };
    }),

  // Get user's mindful eating sessions
  getMySessions: protectedProcedure
    .query(async ({ ctx }) => {
      const sessions = await db.select()
        .from(mindfulEatingSessions)
        .where(eq(mindfulEatingSessions.customerId, ctx.user.id))
        .orderBy(sql`${mindfulEatingSessions.startTime} DESC`)
        .limit(50);

      return sessions;
    }),

  // Get public gratitude wall
  getPublicGratitude: publicProcedure
    .input(z.object({
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const notes = await db.select()
        .from(gratitudeNotes)
        .where(eq(gratitudeNotes.isPublic, true))
        .orderBy(sql`${gratitudeNotes.createdAt} DESC`)
        .limit(input.limit);

      return notes;
    }),

  // Get mindfulness stats
  getMyStats: protectedProcedure
    .query(async ({ ctx }) => {
      const sessions = await db.select()
        .from(mindfulEatingSessions)
        .where(eq(mindfulEatingSessions.customerId, ctx.user.id));

      const totalSessions = sessions.length;
      const meditationCount = sessions.filter(s => s.meditationCompleted).length;
      const zeroWasteCount = sessions.filter(s => s.hadZeroWaste).length;
      const avgMealDuration = sessions.reduce((sum, s) => sum + (s.mealDuration || 0), 0) / totalSessions || 0;
      const gratitudeCount = sessions.filter(s => s.gratitudeExpressed).length;

      const gratitudeNoteCount = await db.select({ count: sql`COUNT(*)` })
        .from(gratitudeNotes)
        .where(eq(gratitudeNotes.customerId, ctx.user.id));

      return {
        totalSessions,
        meditationCount,
        zeroWasteCount,
        avgMealDuration: Math.round(avgMealDuration),
        gratitudeCount,
        gratitudeNoteCount: gratitudeNoteCount[0]?.count || 0,
        mindfulnessScore: Math.round((meditationCount + zeroWasteCount + gratitudeCount) / totalSessions * 100) || 0,
      };
    }),

  // Get session details
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input, ctx }) => {
      const session = await db.select()
        .from(mindfulEatingSessions)
        .where(and(
          eq(mindfulEatingSessions.id, input.sessionId),
          eq(mindfulEatingSessions.customerId, ctx.user.id)
        ))
        .limit(1);

      if (session.length === 0) {
        throw new Error('Session not found');
      }

      return session[0];
    }),
});
