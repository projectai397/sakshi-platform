import { router, protectedProcedure } from '../../_core/trpc';
import { db } from '../../db';
import { 
  nutritionPassports, 
  mealSponsorships, 
  regenerativeActions,
  mindfulEatingSessions,
  volunteerShifts,
} from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export const impactDashboardRouter = router({
  // Get user's overall impact
  getMyImpact: protectedProcedure
    .query(async ({ ctx }) => {
      // Environmental impact
      const passport = await db.select()
        .from(nutritionPassports)
        .where(eq(nutritionPassports.customerId, ctx.user.id))
        .limit(1);

      // Social impact - meals sponsored
      const sponsorships = await db.select({
        totalSponsored: sql`SUM(${mealSponsorships.mealCount})`,
        totalAmount: sql`SUM(${mealSponsorships.amountPaid})`,
      })
      .from(mealSponsorships)
      .where(eq(mealSponsorships.sponsorUserId, ctx.user.id));

      // Regenerative actions
      const actions = await db.select()
        .from(regenerativeActions)
        .where(eq(regenerativeActions.customerId, ctx.user.id));

      // Mindful dining
      const mindfulSessions = await db.select()
        .from(mindfulEatingSessions)
        .where(eq(mindfulEatingSessions.customerId, ctx.user.id));

      // Volunteer hours
      const volunteer = await db.select({
        totalHours: sql`SUM(${volunteerShifts.hoursWorked})`,
      })
      .from(volunteerShifts)
      .where(eq(volunteerShifts.userId, ctx.user.id));

      // Calculate impact score (0-1000)
      const environmentalScore = Math.min(300, (passport[0]?.totalMeals || 0) * 2);
      const socialScore = Math.min(300, (sponsorships[0]?.totalSponsored || 0) * 10);
      const mindfulnessScore = Math.min(200, mindfulSessions.length * 5);
      const volunteerScore = Math.min(200, (volunteer[0]?.totalHours || 0) / 60 * 10);

      const totalScore = environmentalScore + socialScore + mindfulnessScore + volunteerScore;

      return {
        totalScore,
        environmental: {
          score: environmentalScore,
          mealsEaten: passport[0]?.totalMeals || 0,
          carbonSaved: passport[0]?.carbonFootprintSaved || 0,
          waterSaved: passport[0]?.waterSaved || 0,
        },
        social: {
          score: socialScore,
          mealsSponsored: sponsorships[0]?.totalSponsored || 0,
          amountDonated: sponsorships[0]?.totalAmount || 0,
        },
        mindfulness: {
          score: mindfulnessScore,
          sessionsCompleted: mindfulSessions.length,
          avgMealDuration: mindfulSessions.reduce((sum, s) => sum + (s.mealDuration || 0), 0) / mindfulSessions.length || 0,
        },
        community: {
          score: volunteerScore,
          volunteerHours: (volunteer[0]?.totalHours || 0) / 60,
          regenerativeActions: actions.length,
        },
      };
    }),

  // Get shareable impact report
  getShareable: protectedProcedure
    .query(async ({ ctx }) => {
      const impact = await impactDashboardRouter.createCaller({ user: ctx.user }).getMyImpact();

      return {
        ...impact,
        shareText: `I've made a positive impact through conscious dining! 🌿\n\n` +
          `🌍 ${impact.environmental.mealsEaten} plant-based meals\n` +
          `💚 ${Math.round(impact.environmental.carbonSaved)} kg CO2 saved\n` +
          `🤝 ${impact.social.mealsSponsored} meals sponsored\n` +
          `🧘 ${impact.mindfulness.sessionsCompleted} mindful dining sessions\n\n` +
          `Join me in making sustainable living accessible! #SakshiPlatform`,
      };
    }),
});
