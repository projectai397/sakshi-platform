import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../trpc';
import { getDb } from '../../db';
import { recipes } from '../../../drizzle/schema-cafe';
import { eq, and, desc, sql } from 'drizzle-orm';

export const recipesRouter = router({
  // Get all approved recipes
  getRecipes: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      difficulty: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(recipes.isApproved, true)];
      
      if (input.category) {
        conditions.push(eq(recipes.category, input.category));
      }
      
      if (input.difficulty) {
        conditions.push(eq(recipes.difficulty, input.difficulty));
      }
      
      if (input.search) {
        conditions.push(
          sql`${recipes.title} ILIKE ${`%${input.search}%`} OR ${recipes.description} ILIKE ${`%${input.search}%`}`
        );
      }
      
      const recipeList = await db
        .select()
        .from(recipes)
        .where(and(...conditions))
        .orderBy(desc(recipes.ratingAvg), desc(recipes.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return recipeList;
    }),

  // Get single recipe
  getRecipe: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      const [recipe] = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, input.id));
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      return recipe;
    }),

  // Submit a new recipe
  submitRecipe: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string(),
      category: z.string(),
      cuisine: z.string().optional(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      prepTime: z.number(),
      cookTime: z.number(),
      servings: z.number(),
      ingredients: z.array(z.object({
        name: z.string(),
        quantity: z.string(),
        unit: z.string(),
      })),
      instructions: z.array(z.object({
        step: z.number(),
        text: z.string(),
        imageUrl: z.string().optional(),
      })),
      nutritionalInfo: z.any().optional(),
      ayurvedicInfo: z.any().optional(),
      tags: z.array(z.string()).optional(),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [newRecipe] = await db
        .insert(recipes)
        .values({
          ...input,
          authorId: ctx.user.id,
          isApproved: false, // Requires admin approval
        })
        .returning();
      
      return newRecipe;
    }),

  // Update recipe
  updateRecipe: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      cuisine: z.string().optional(),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      prepTime: z.number().optional(),
      cookTime: z.number().optional(),
      servings: z.number().optional(),
      ingredients: z.any().optional(),
      instructions: z.any().optional(),
      nutritionalInfo: z.any().optional(),
      ayurvedicInfo: z.any().optional(),
      tags: z.array(z.string()).optional(),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      // Check if user is author
      const [recipe] = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, id));
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      if (recipe.authorId !== ctx.user.id) {
        throw new Error('Not authorized to update this recipe');
      }
      
      const [updatedRecipe] = await db
        .update(recipes)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(recipes.id, id))
        .returning();
      
      return updatedRecipe;
    }),

  // Approve recipe (admin only)
  approveRecipe: protectedProcedure
    .input(z.object({
      id: z.number(),
      isApproved: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      
      const [updatedRecipe] = await db
        .update(recipes)
        .set({
          isApproved: input.isApproved,
          updatedAt: new Date(),
        })
        .where(eq(recipes.id, input.id))
        .returning();
      
      return updatedRecipe;
    }),

  // Rate recipe
  rateRecipe: protectedProcedure
    .input(z.object({
      id: z.number(),
      rating: z.number().min(1).max(5),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      // TODO: Store individual ratings in a separate table
      // For now, just update the average
      const [recipe] = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, input.id));
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      const currentAvg = parseFloat(recipe.ratingAvg || '0');
      const currentCount = recipe.ratingCount || 0;
      const newCount = currentCount + 1;
      const newAvg = ((currentAvg * currentCount) + input.rating) / newCount;
      
      const [updatedRecipe] = await db
        .update(recipes)
        .set({
          ratingAvg: newAvg.toFixed(2),
          ratingCount: newCount,
        })
        .where(eq(recipes.id, input.id))
        .returning();
      
      return updatedRecipe;
    }),

  // Get user's submitted recipes
  getMyRecipes: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const myRecipes = await db
        .select()
        .from(recipes)
        .where(eq(recipes.authorId, ctx.user.id))
        .orderBy(desc(recipes.createdAt));
      
      return myRecipes;
    }),

  // Get pending recipes (admin only)
  getPendingRecipes: protectedProcedure
    .query(async ({ ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      
      const pending = await db
        .select()
        .from(recipes)
        .where(eq(recipes.isApproved, false))
        .orderBy(desc(recipes.createdAt));
      
      return pending;
    }),
});
