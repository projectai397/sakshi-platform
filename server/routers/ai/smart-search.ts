import { z } from "zod";
import { router, publicProcedure } from "../../_core/trpc";
import * as smartSearch from "../../lib/ai/smart-search";
import * as db from "../../db";

export const smartSearchRouter = router({
  // Perform smart search
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().optional().default(20),
    }))
    .mutation(async ({ input }) => {
      // Analyze query with AI
      const analysis = await smartSearch.analyzeQuery(input.query);

      // Build search parameters from analysis
      const searchParams = {
        keywords: analysis.keywords,
        category: analysis.category,
        priceRange: analysis.priceRange,
        condition: analysis.condition,
        sortBy: analysis.sortBy,
        limit: input.limit,
      };

      // Perform database search
      const products = await db.searchProducts(searchParams);

      // Rank results with AI
      const rankedResults = await smartSearch.rankResults(
        products,
        input.query,
        analysis
      );

      return {
        results: rankedResults,
        analysis,
        suggestions: analysis.suggestions,
      };
    }),

  // Get search suggestions
  getSuggestions: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .query(async ({ input }) => {
      const suggestions = await smartSearch.generateSearchSuggestions(
        input.query
      );
      return { suggestions };
    }),

  // Analyze query (without performing search)
  analyzeQuery: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .mutation(async ({ input }) => {
      const analysis = await smartSearch.analyzeQuery(input.query);
      return { analysis };
    }),

  // Get no results suggestions
  getNoResultsSuggestions: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .mutation(async ({ input }) => {
      const suggestions = await smartSearch.generateNoResultsSuggestions(
        input.query
      );
      return { suggestions };
    }),
});
