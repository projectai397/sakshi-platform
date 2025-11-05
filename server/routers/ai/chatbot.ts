import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../../_core/trpc";
import * as chatbot from "../../lib/ai/chatbot";
import * as db from "../../db";

// Store conversations in memory (in production, use database or Redis)
const conversations = new Map<string, any[]>();

export const chatbotRouter = router({
  // Send message to chatbot
  sendMessage: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(1000),
      conversationId: z.string().optional(),
      userId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = input.userId || ctx.user?.id;
      const conversationId = input.conversationId || `conv_${Date.now()}`;

      // Get conversation history
      const history = conversations.get(conversationId) || [];

      // Process message with chatbot
      const response = await chatbot.processMessage(
        input.message,
        history,
        userId
      );

      // Update conversation history
      history.push(
        { role: "user", content: input.message },
        { role: "assistant", content: response.message }
      );
      conversations.set(conversationId, history);

      return {
        message: response.message,
        intent: response.intent,
        suggestedQuestions: response.suggestedQuestions,
        actions: response.actions,
        conversationId,
      };
    }),

  // Get suggested questions
  getSuggestedQuestions: publicProcedure
    .input(z.object({
      context: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const questions = await chatbot.generateSuggestedQuestions(
        input.context
      );
      return { questions };
    }),

  // Analyze user intent
  analyzeIntent: publicProcedure
    .input(z.object({
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      const intent = await chatbot.analyzeIntent(input.message);
      return { intent };
    }),

  // Get conversation history
  getConversation: publicProcedure
    .input(z.object({
      conversationId: z.string(),
    }))
    .query(({ input }) => {
      const history = conversations.get(input.conversationId) || [];
      return { history };
    }),

  // Clear conversation
  clearConversation: publicProcedure
    .input(z.object({
      conversationId: z.string(),
    }))
    .mutation(({ input }) => {
      conversations.delete(input.conversationId);
      return { success: true };
    }),

  // Get chatbot stats (admin only)
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return {
      totalConversations: conversations.size,
      activeConversations: Array.from(conversations.values()).filter(
        (h) => h.length > 0
      ).length,
    };
  }),
});
