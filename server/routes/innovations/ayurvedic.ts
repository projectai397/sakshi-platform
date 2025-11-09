import { router, protectedProcedure } from '../../_core/trpc';
import { z } from 'zod';
import { db } from '../../db';
import { customerDoshaProfiles, doshaCheckIns, mealDoshaRatings } from '../../../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

export const ayurvedicRouter = router({
  // Create or update dosha profile
  createProfile: protectedProcedure
    .input(z.object({
      vataScore: z.number().min(0).max(100),
      pittaScore: z.number().min(0).max(100),
      kaphaScore: z.number().min(0).max(100),
      quizAnswers: z.record(z.any()).optional(),
      bodyType: z.string().optional(),
      digestiveStrength: z.enum(['weak', 'moderate', 'strong']).optional(),
      allergies: z.array(z.string()).optional(),
      healthGoals: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if profile exists
      const existing = await db.select()
        .from(customerDoshaProfiles)
        .where(eq(customerDoshaProfiles.customerId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        // Update existing
        await db.update(customerDoshaProfiles)
          .set({
            vataScore: input.vataScore,
            pittaScore: input.pittaScore,
            kaphaScore: input.kaphaScore,
            quizAnswers: JSON.stringify(input.quizAnswers || {}),
            bodyType: input.bodyType,
            digestiveStrength: input.digestiveStrength,
            allergies: JSON.stringify(input.allergies || []),
            healthGoals: JSON.stringify(input.healthGoals || []),
            updatedAt: new Date(),
          })
          .where(eq(customerDoshaProfiles.id, existing[0].id));

        return { success: true, profileId: existing[0].id, isNew: false };
      } else {
        // Create new
        const [profile] = await db.insert(customerDoshaProfiles).values({
          customerId: ctx.user.id,
          vataScore: input.vataScore,
          pittaScore: input.pittaScore,
          kaphaScore: input.kaphaScore,
          quizAnswers: JSON.stringify(input.quizAnswers || {}),
          bodyType: input.bodyType,
          digestiveStrength: input.digestiveStrength,
          allergies: JSON.stringify(input.allergies || []),
          healthGoals: JSON.stringify(input.healthGoals || []),
        });

        return { success: true, profileId: profile.insertId, isNew: true };
      }
    }),

  // Get user's dosha profile
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const profile = await db.select()
        .from(customerDoshaProfiles)
        .where(eq(customerDoshaProfiles.customerId, ctx.user.id))
        .limit(1);

      if (profile.length === 0) {
        return null;
      }

      return {
        ...profile[0],
        quizAnswers: JSON.parse(profile[0].quizAnswers || '{}'),
        allergies: JSON.parse(profile[0].allergies || '[]'),
        healthGoals: JSON.parse(profile[0].healthGoals || '[]'),
      };
    }),

  // Daily state check-in
  checkIn: protectedProcedure
    .input(z.object({
      currentState: z.enum(['balanced', 'stressed', 'tired', 'energetic', 'anxious', 'calm', 'heavy', 'light']),
      sleepQuality: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
      digestionQuality: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
      energyLevel: z.number().min(1).max(10).optional(),
      symptoms: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const today = new Date().toISOString().split('T')[0];

      await db.insert(doshaCheckIns).values({
        customerId: ctx.user.id,
        date: today,
        currentState: input.currentState,
        sleepQuality: input.sleepQuality,
        digestionQuality: input.digestionQuality,
        energyLevel: input.energyLevel,
        symptoms: JSON.stringify(input.symptoms || []),
        notes: input.notes,
      });

      return { success: true, message: 'Check-in recorded' };
    }),

  // Get personalized meal recommendations
  getRecommendations: protectedProcedure
    .input(z.object({
      menuItems: z.array(z.object({
        id: z.number(),
        name: z.string(),
        vataEffect: z.enum(['increase', 'decrease', 'neutral']),
        pittaEffect: z.enum(['increase', 'decrease', 'neutral']),
        kaphaEffect: z.enum(['increase', 'decrease', 'neutral']),
      })),
    }))
    .query(async ({ input, ctx }) => {
      // Get user's profile
      const profile = await db.select()
        .from(customerDoshaProfiles)
        .where(eq(customerDoshaProfiles.customerId, ctx.user.id))
        .limit(1);

      if (profile.length === 0) {
        return { recommendations: [], message: 'Please complete dosha quiz first' };
      }

      const userProfile = profile[0];

      // Get today's check-in
      const today = new Date().toISOString().split('T')[0];
      const checkIn = await db.select()
        .from(doshaCheckIns)
        .where(and(
          eq(doshaCheckIns.customerId, ctx.user.id),
          eq(doshaCheckIns.date, today)
        ))
        .limit(1);

      // Determine which dosha to balance
      let targetDosha = 'vata';
      if (userProfile.vataScore > userProfile.pittaScore && userProfile.vataScore > userProfile.kaphaScore) {
        targetDosha = 'vata';
      } else if (userProfile.pittaScore > userProfile.kaphaScore) {
        targetDosha = 'pitta';
      } else {
        targetDosha = 'kapha';
      }

      // Adjust based on current state
      if (checkIn.length > 0) {
        const state = checkIn[0].currentState;
        if (state === 'stressed' || state === 'anxious') targetDosha = 'vata';
        if (state === 'energetic' || state === 'hot') targetDosha = 'pitta';
        if (state === 'heavy' || state === 'tired') targetDosha = 'kapha';
      }

      // Score each menu item
      const scored = input.menuItems.map(item => {
        let score = 50; // Base score

        // Prefer items that decrease dominant dosha
        if (targetDosha === 'vata' && item.vataEffect === 'decrease') score += 30;
        if (targetDosha === 'pitta' && item.pittaEffect === 'decrease') score += 30;
        if (targetDosha === 'kapha' && item.kaphaEffect === 'decrease') score += 30;

        // Avoid items that increase dominant dosha
        if (targetDosha === 'vata' && item.vataEffect === 'increase') score -= 20;
        if (targetDosha === 'pitta' && item.pittaEffect === 'increase') score -= 20;
        if (targetDosha === 'kapha' && item.kaphaEffect === 'increase') score -= 20;

        return { ...item, score };
      });

      // Sort by score
      scored.sort((a, b) => b.score - a.score);

      return {
        recommendations: scored,
        targetDosha,
        message: `Recommendations to balance ${targetDosha}`,
      };
    }),

  // Rate meal after eating
  rateMeal: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      menuItemId: z.number(),
      satisfactionRating: z.number().min(1).max(5),
      doshaBalance: z.enum(['more_balanced', 'same', 'less_balanced']),
      digestionRating: z.number().min(1).max(5).optional(),
      energyAfterMeal: z.enum(['increased', 'same', 'decreased']).optional(),
      wouldOrderAgain: z.boolean().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(mealDoshaRatings).values({
        customerId: ctx.user.id,
        orderId: input.orderId,
        menuItemId: input.menuItemId,
        satisfactionRating: input.satisfactionRating,
        doshaBalance: input.doshaBalance,
        digestionRating: input.digestionRating,
        energyAfterMeal: input.energyAfterMeal,
        wouldOrderAgain: input.wouldOrderAgain,
        notes: input.notes,
      });

      return { success: true, message: 'Thank you for your feedback!' };
    }),

  // Get dosha balance over time
  getBalance: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const checkIns = await db.select()
        .from(doshaCheckIns)
        .where(and(
          eq(doshaCheckIns.customerId, ctx.user.id),
          sql`${doshaCheckIns.date} BETWEEN ${input.startDate} AND ${input.endDate}`
        ))
        .orderBy(doshaCheckIns.date);

      const ratings = await db.select()
        .from(mealDoshaRatings)
        .where(and(
          eq(mealDoshaRatings.customerId, ctx.user.id),
          sql`${mealDoshaRatings.createdAt} BETWEEN ${input.startDate} AND ${input.endDate}`
        ))
        .orderBy(mealDoshaRatings.createdAt);

      return {
        checkIns,
        mealRatings: ratings,
      };
    }),

  // Get meal history with dosha effects
  getMealHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const ratings = await db.select()
        .from(mealDoshaRatings)
        .where(eq(mealDoshaRatings.customerId, ctx.user.id))
        .orderBy(sql`${mealDoshaRatings.createdAt} DESC`)
        .limit(50);

      return ratings;
    }),
});
