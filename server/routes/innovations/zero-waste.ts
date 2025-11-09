import { router, protectedProcedure, publicProcedure } from '../../_core/trpc';
import { z } from 'zod';
import { db } from '../../db';
import { wasteTracking, compostTracking, foodDonations, customerPortionFeedback, wasteReductionChallenges } from '../../../drizzle/schema';
import { eq, and, sql, between } from 'drizzle-orm';

export const zeroWasteRouter = router({
  // Get today's waste metrics for location
  getDailyWaste: publicProcedure
    .input(z.object({
      locationId: z.number(),
      date: z.string().optional(), // YYYY-MM-DD
    }))
    .query(async ({ input }) => {
      const targetDate = input.date || new Date().toISOString().split('T')[0];

      const wasteItems = await db.select()
        .from(wasteTracking)
        .where(and(
          eq(wasteTracking.locationId, input.locationId),
          eq(wasteTracking.date, targetDate)
        ));

      const totalWasteKg = wasteItems.reduce((sum, item) => sum + parseFloat(item.quantity || '0'), 0);
      const totalCost = wasteItems.reduce((sum, item) => sum + parseFloat(item.estimatedCost || '0'), 0);
      
      const categoryBreakdown = wasteItems.reduce((acc, item) => {
        const category = item.wasteCategory || 'unknown';
        if (!acc[category]) acc[category] = 0;
        acc[category] += parseFloat(item.quantity || '0');
        return acc;
      }, {} as Record<string, number>);

      return {
        date: targetDate,
        totalWasteKg,
        totalCost,
        categoryBreakdown,
        items: wasteItems,
        wastePercentage: 0, // TODO: Calculate based on total food prepared
      };
    }),

  // Log waste item
  logWaste: protectedProcedure
    .input(z.object({
      locationId: z.number(),
      wasteCategory: z.enum(['spoilage', 'prep_waste', 'customer_leftover', 'expired']),
      itemName: z.string(),
      quantity: z.number().positive(),
      unit: z.string(),
      estimatedCost: z.number().optional(),
      reason: z.string().optional(),
      preventable: z.boolean().default(true),
      photo: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const today = new Date().toISOString().split('T')[0];

      await db.insert(wasteTracking).values({
        locationId: input.locationId,
        date: today,
        wasteCategory: input.wasteCategory,
        itemName: input.itemName,
        quantity: input.quantity.toString(),
        unit: input.unit,
        estimatedCost: input.estimatedCost?.toString(),
        reason: input.reason,
        preventable: input.preventable,
        staffMemberId: ctx.user.id,
        photo: input.photo,
      });

      return { success: true, message: 'Waste logged successfully' };
    }),

  // Get waste trends
  getWasteTrends: publicProcedure
    .input(z.object({
      locationId: z.number(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const trends = await db.select()
        .from(wasteTracking)
        .where(and(
          eq(wasteTracking.locationId, input.locationId),
          between(wasteTracking.date, input.startDate, input.endDate)
        ))
        .orderBy(wasteTracking.date);

      // Group by date
      const dailyTotals = trends.reduce((acc, item) => {
        const date = item.date;
        if (!acc[date]) acc[date] = { date, totalKg: 0, totalCost: 0, items: 0 };
        acc[date].totalKg += parseFloat(item.quantity || '0');
        acc[date].totalCost += parseFloat(item.estimatedCost || '0');
        acc[date].items += 1;
        return acc;
      }, {} as Record<string, any>);

      return Object.values(dailyTotals);
    }),

  // Log composting activity
  logCompost: protectedProcedure
    .input(z.object({
      locationId: z.number(),
      weightKg: z.number().positive(),
      compostMethod: z.string().optional(),
      maturityDate: z.string().optional(),
      usedFor: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const today = new Date().toISOString().split('T')[0];

      await db.insert(compostTracking).values({
        locationId: input.locationId,
        date: today,
        weightKg: input.weightKg.toString(),
        compostMethod: input.compostMethod,
        maturityDate: input.maturityDate,
        usedFor: input.usedFor,
      });

      return { success: true, message: 'Composting activity logged' };
    }),

  // Log food donation
  logDonation: protectedProcedure
    .input(z.object({
      locationId: z.number(),
      recipientOrganization: z.string(),
      itemsDescription: z.string(),
      estimatedMeals: z.number().optional(),
      estimatedValue: z.number().optional(),
      pickupTime: z.string().optional(),
      deliveredBy: z.string().optional(),
      recipientContact: z.string().optional(),
      photo: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const today = new Date().toISOString().split('T')[0];

      await db.insert(foodDonations).values({
        locationId: input.locationId,
        date: today,
        recipientOrganization: input.recipientOrganization,
        itemsDescription: input.itemsDescription,
        estimatedMeals: input.estimatedMeals,
        estimatedValue: input.estimatedValue?.toString(),
        pickupTime: input.pickupTime,
        deliveredBy: input.deliveredBy,
        recipientContact: input.recipientContact,
        photo: input.photo,
      });

      return { success: true, message: 'Donation logged successfully' };
    }),

  // Submit portion feedback
  submitPortionFeedback: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      menuItemId: z.number(),
      portionSize: z.enum(['too_much', 'just_right', 'too_little']),
      wasteEstimate: z.enum(['none', 'quarter', 'half', 'most']).optional(),
      comments: z.string().optional(),
      photo: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(customerPortionFeedback).values({
        orderId: input.orderId,
        menuItemId: input.menuItemId,
        customerId: ctx.user.id,
        portionSize: input.portionSize,
        wasteEstimate: input.wasteEstimate,
        comments: input.comments,
        photo: input.photo,
      });

      return { success: true, message: 'Thank you for your feedback!' };
    }),

  // Get active challenges
  getChallenges: publicProcedure
    .input(z.object({ locationId: z.number() }))
    .query(async ({ input }) => {
      const challenges = await db.select()
        .from(wasteReductionChallenges)
        .where(and(
          eq(wasteReductionChallenges.locationId, input.locationId),
          eq(wasteReductionChallenges.status, 'active')
        ));

      return challenges;
    }),

  // Create waste reduction challenge
  createChallenge: protectedProcedure
    .input(z.object({
      locationId: z.number(),
      challengeName: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      targetWastePercentage: z.number(),
      participants: z.array(z.number()).optional(),
      reward: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'staff') {
        throw new Error('Unauthorized');
      }

      const [challenge] = await db.insert(wasteReductionChallenges).values({
        locationId: input.locationId,
        challengeName: input.challengeName,
        startDate: input.startDate,
        endDate: input.endDate,
        targetWastePercentage: input.targetWastePercentage.toString(),
        teamLeader: ctx.user.id,
        participants: JSON.stringify(input.participants || []),
        reward: input.reward,
        status: 'active',
      });

      return { success: true, challengeId: challenge.insertId };
    }),

  // Get composting stats
  getCompostStats: publicProcedure
    .input(z.object({
      locationId: z.number(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const compostData = await db.select()
        .from(compostTracking)
        .where(and(
          eq(compostTracking.locationId, input.locationId),
          between(compostTracking.date, input.startDate, input.endDate)
        ));

      const totalWeight = compostData.reduce((sum, item) => sum + parseFloat(item.weightKg || '0'), 0);

      return {
        totalWeightKg: totalWeight,
        entries: compostData.length,
        data: compostData,
      };
    }),

  // Get donation stats
  getDonationStats: publicProcedure
    .input(z.object({
      locationId: z.number(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const donations = await db.select()
        .from(foodDonations)
        .where(and(
          eq(foodDonations.locationId, input.locationId),
          between(foodDonations.date, input.startDate, input.endDate)
        ));

      const totalMeals = donations.reduce((sum, item) => sum + (item.estimatedMeals || 0), 0);
      const totalValue = donations.reduce((sum, item) => sum + parseFloat(item.estimatedValue || '0'), 0);

      return {
        totalDonations: donations.length,
        totalMeals,
        totalValue,
        data: donations,
      };
    }),
});
