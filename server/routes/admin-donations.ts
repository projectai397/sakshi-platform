import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { getDb } from '../db';
import { donations, products, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Admin Donation Processing Workflow
 * Handles donation approval, rejection, and product creation
 */

const processDonationSchema = z.object({
  donationId: z.number(),
  action: z.enum(['approve', 'reject', 'create_product']),
  rejectionReason: z.string().optional(),
  productData: z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    condition: z.enum(['new', 'like-new', 'good', 'fair']),
    communityPrice: z.number(),
    fairPrice: z.number(),
    supporterPrice: z.number(),
    images: z.array(z.string()),
    ageRange: z.object({
      min: z.number(),
      max: z.number(),
    }).optional(),
  }).optional(),
});

export const adminDonationsRouter = router({
  // Get all pending donations
  getPendingDonations: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const pendingDonations = await db
        .select()
        .from(donations)
        .where(eq(donations.status, 'pending'))
        .orderBy(donations.createdAt);

      return pendingDonations;
    }),

  // Process a donation (approve/reject/create product)
  processDonation: protectedProcedure
    .input(processDonationSchema)
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { donationId, action, rejectionReason, productData } = input;

      // Get donation
      const [donation] = await db
        .select()
        .from(donations)
        .where(eq(donations.id, donationId));

      if (!donation) {
        throw new Error('Donation not found');
      }

      if (action === 'approve') {
        // Approve donation
        await db
          .update(donations)
          .set({ 
            status: 'approved',
            processedAt: new Date(),
            processedBy: ctx.user.id,
          })
          .where(eq(donations.id, donationId));

        // Award seva tokens to donor (5 tokens per donation)
        await db
          .update(users)
          .set({
            sevaTokens: (donation.userId ? 
              db.select({ tokens: users.sevaTokens }).from(users).where(eq(users.id, donation.userId)).then(r => (r[0]?.tokens || 0) + 5) 
              : 0
            ),
          })
          .where(eq(users.id, donation.userId!));

        return { success: true, message: 'Donation approved and tokens awarded' };
      }

      if (action === 'reject') {
        // Reject donation
        await db
          .update(donations)
          .set({ 
            status: 'rejected',
            processedAt: new Date(),
            processedBy: ctx.user.id,
            notes: rejectionReason,
          })
          .where(eq(donations.id, donationId));

        return { success: true, message: 'Donation rejected' };
      }

      if (action === 'create_product' && productData) {
        // Create product from donation
        const [newProduct] = await db
          .insert(products)
          .values({
            ...productData,
            donationId: donationId,
            status: 'available',
            createdAt: new Date(),
          })
          .returning();

        // Mark donation as processed
        await db
          .update(donations)
          .set({ 
            status: 'processed',
            processedAt: new Date(),
            processedBy: ctx.user.id,
          })
          .where(eq(donations.id, donationId));

        return { 
          success: true, 
          message: 'Product created from donation',
          productId: newProduct.id,
        };
      }

      throw new Error('Invalid action');
    }),

  // Get donation statistics
  getDonationStats: protectedProcedure
    .query(async () => {
      const db = getDb();
      
      const stats = await db
        .select({
          total: donations.id,
          status: donations.status,
        })
        .from(donations);

      const pending = stats.filter(s => s.status === 'pending').length;
      const approved = stats.filter(s => s.status === 'approved').length;
      const rejected = stats.filter(s => s.status === 'rejected').length;
      const processed = stats.filter(s => s.status === 'processed').length;

      return {
        total: stats.length,
        pending,
        approved,
        rejected,
        processed,
      };
    }),
});
