import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./helpers";
import { db } from "../db";
import { reviews, products, users } from "@db/schema";
import { eq, desc, and, sql, avg } from "drizzle-orm";

export const reviewsRouter = router({
  // Create review
  create: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().min(5).max(200),
        comment: z.string().min(10).max(2000),
        images: z.array(z.string().url()).max(5).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { productId, rating, title, comment, images } = input;
      const userId = ctx.user.id;

      // Check if user has already reviewed this product
      const existingReview = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.productId, productId), eq(reviews.userId, userId)))
        .limit(1);

      if (existingReview.length > 0) {
        throw new Error("You have already reviewed this product");
      }

      // Check if user has purchased this product
      // TODO: Add order verification

      // Create review
      const [review] = await db
        .insert(reviews)
        .values({
          productId,
          userId,
          rating,
          title,
          comment,
          images: images || [],
          verified: true, // TODO: Set based on purchase verification
        })
        .returning();

      // Update product average rating
      await updateProductRating(productId);

      return review;
    }),

  // Update review
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        rating: z.number().min(1).max(5).optional(),
        title: z.string().min(5).max(200).optional(),
        comment: z.string().min(10).max(2000).optional(),
        images: z.array(z.string().url()).max(5).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;
      const userId = ctx.user.id;

      // Check if review belongs to user
      const [existingReview] = await db
        .select()
        .from(reviews)
        .where(eq(reviews.id, id))
        .limit(1);

      if (!existingReview) {
        throw new Error("Review not found");
      }

      if (existingReview.userId !== userId) {
        throw new Error("You can only update your own reviews");
      }

      // Update review
      const [review] = await db
        .update(reviews)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(reviews.id, id))
        .returning();

      // Update product average rating if rating changed
      if (updates.rating) {
        await updateProductRating(existingReview.productId);
      }

      return review;
    }),

  // Delete review
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      // Check if review belongs to user
      const [existingReview] = await db
        .select()
        .from(reviews)
        .where(eq(reviews.id, input.id))
        .limit(1);

      if (!existingReview) {
        throw new Error("Review not found");
      }

      if (existingReview.userId !== userId && ctx.user.role !== "admin") {
        throw new Error("You can only delete your own reviews");
      }

      // Delete review
      await db.delete(reviews).where(eq(reviews.id, input.id));

      // Update product average rating
      await updateProductRating(existingReview.productId);

      return { success: true };
    }),

  // Get reviews for a product
  getByProduct: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        rating: z.number().min(1).max(5).optional(),
        verified: z.boolean().optional(),
        sortBy: z.enum(["recent", "helpful", "rating_high", "rating_low"]).default("recent"),
      })
    )
    .query(async ({ input }) => {
      const { productId, page, limit, rating, verified, sortBy } = input;
      const offset = (page - 1) * limit;

      // Build conditions
      const conditions = [eq(reviews.productId, productId)];
      if (rating) conditions.push(eq(reviews.rating, rating));
      if (verified !== undefined) conditions.push(eq(reviews.verified, verified));

      // Build order by
      let orderBy;
      switch (sortBy) {
        case "helpful":
          orderBy = desc(reviews.helpfulCount);
          break;
        case "rating_high":
          orderBy = desc(reviews.rating);
          break;
        case "rating_low":
          orderBy = reviews.rating;
          break;
        default:
          orderBy = desc(reviews.createdAt);
      }

      // Get reviews with user info
      const reviewsList = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          title: reviews.title,
          comment: reviews.comment,
          images: reviews.images,
          verified: reviews.verified,
          helpfulCount: reviews.helpfulCount,
          createdAt: reviews.createdAt,
          userId: reviews.userId,
          userName: users.username,
          userFullName: users.fullName,
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      // Get total count
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(and(...conditions));

      // Get rating distribution
      const ratingDistribution = await db
        .select({
          rating: reviews.rating,
          count: sql<number>`count(*)`,
        })
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .groupBy(reviews.rating);

      return {
        reviews: reviewsList,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
        ratingDistribution,
      };
    }),

  // Get user's reviews
  getMyReviews: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;
      const userId = ctx.user.id;

      const reviewsList = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          title: reviews.title,
          comment: reviews.comment,
          images: reviews.images,
          verified: reviews.verified,
          helpfulCount: reviews.helpfulCount,
          createdAt: reviews.createdAt,
          productId: reviews.productId,
          productName: products.name,
          productImage: products.images,
        })
        .from(reviews)
        .leftJoin(products, eq(reviews.productId, products.id))
        .where(eq(reviews.userId, userId))
        .orderBy(desc(reviews.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(eq(reviews.userId, userId));

      return {
        reviews: reviewsList,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    }),

  // Mark review as helpful
  markHelpful: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const [review] = await db
        .update(reviews)
        .set({
          helpfulCount: sql`${reviews.helpfulCount} + 1`,
        })
        .where(eq(reviews.id, input.id))
        .returning();

      return review;
    }),

  // Get review statistics for a product
  getStatistics: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const { productId } = input;

      // Get average rating
      const [{ avgRating, totalReviews }] = await db
        .select({
          avgRating: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
          totalReviews: sql<number>`count(*)`,
        })
        .from(reviews)
        .where(eq(reviews.productId, productId));

      // Get rating distribution
      const distribution = await db
        .select({
          rating: reviews.rating,
          count: sql<number>`count(*)`,
          percentage: sql<number>`(count(*) * 100.0 / ${totalReviews})`,
        })
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .groupBy(reviews.rating)
        .orderBy(desc(reviews.rating));

      // Get verified vs unverified count
      const [{ verifiedCount, unverifiedCount }] = await db
        .select({
          verifiedCount: sql<number>`count(*) filter (where ${reviews.verified} = true)`,
          unverifiedCount: sql<number>`count(*) filter (where ${reviews.verified} = false)`,
        })
        .from(reviews)
        .where(eq(reviews.productId, productId));

      return {
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews,
        verifiedCount,
        unverifiedCount,
        distribution,
      };
    }),
});

// Helper function to update product average rating
async function updateProductRating(productId: number) {
  const [{ avgRating, totalReviews }] = await db
    .select({
      avgRating: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
      totalReviews: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  await db
    .update(products)
    .set({
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: totalReviews,
    })
    .where(eq(products.id, productId));
}
