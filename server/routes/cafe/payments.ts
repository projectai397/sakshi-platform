import { z } from 'zod';
import { router, protectedProcedure } from '../../_core/trpc';
import { getDb } from '../../db';
import { sakshiCafeOrders, classRegistrations } from '../../../drizzle/schema-cafe';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Razorpay configuration (should be in environment variables)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_key';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret';

export const paymentsRouter = router({
  // Create Razorpay order for cafe payment
  createPayment: protectedProcedure
    .input(
      z.object({
        orderId: z.number().optional(),
        classId: z.number().optional(),
        amount: z.number().positive(),
        priceTier: z.enum(['community', 'fair', 'supporter']),
        type: z.enum(['order', 'class', 'subscription']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Verify the order/class exists and belongs to user
      if (input.type === 'order' && input.orderId) {
        const [order] = await db
          .select()
          .from(sakshiCafeOrders)
          .where(eq(sakshiCafeOrders.id, input.orderId))
          .limit(1);

        if (!order || order.userId !== ctx.user.id) {
          throw new Error('Order not found or unauthorized');
        }
      }

      if (input.type === 'class' && input.classId) {
        const [registration] = await db
          .select()
          .from(classRegistrations)
          .where(eq(classRegistrations.classId, input.classId))
          .limit(1);

        // Check if already registered
        if (registration && registration.userId === ctx.user.id) {
          throw new Error('Already registered for this class');
        }
      }

      // Create Razorpay order
      // In production, use actual Razorpay SDK
      const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // For now, return mock data
      // TODO: Integrate actual Razorpay API
      return {
        id: razorpayOrderId,
        amount: Math.round(input.amount * 100), // Convert to paise
        currency: 'INR',
        keyId: RAZORPAY_KEY_ID,
      };
    }),

  // Verify Razorpay payment
  verifyPayment: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        paymentId: z.string(),
        signature: z.string(),
        sakshiOrderId: z.number().optional(),
        classId: z.number().optional(),
        type: z.enum(['order', 'class', 'subscription']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Verify Razorpay signature
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${input.orderId}|${input.paymentId}`)
        .digest('hex');

      if (generatedSignature !== input.signature) {
        throw new Error('Invalid payment signature');
      }

      // Update order/registration status based on type
      if (input.type === 'order' && input.sakshiOrderId) {
        await db
          .update(sakshiCafeOrders)
          .set({
            paymentStatus: 'paid',
            paymentId: input.paymentId,
            orderStatus: 'confirmed',
            updatedAt: new Date(),
          })
          .where(eq(sakshiCafeOrders.id, input.sakshiOrderId));
      }

      if (input.type === 'class' && input.classId) {
        // Update class registration payment status
        await db
          .update(classRegistrations)
          .set({
            paymentStatus: 'paid',
            paymentId: input.paymentId,
            registrationStatus: 'confirmed',
            updatedAt: new Date(),
          })
          .where(eq(classRegistrations.classId, input.classId));
      }

      return {
        success: true,
        paymentId: input.paymentId,
      };
    }),

  // Redeem Seva tokens for payment
  redeemSevaTokens: protectedProcedure
    .input(
      z.object({
        orderId: z.number().optional(),
        classId: z.number().optional(),
        amount: z.number().positive(),
        tokensToRedeem: z.number().positive(),
        type: z.enum(['order', 'class', 'subscription']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // TODO: Check user's Seva token balance
      // TODO: Deduct tokens from user's wallet
      // TODO: Update order/registration with token payment

      // For now, return mock success
      return {
        success: true,
        tokensRedeemed: input.tokensToRedeem,
        remainingBalance: 0, // TODO: Calculate actual balance
      };
    }),

  // Get payment history
  getPaymentHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = getDb();

      // Get all paid orders for user
      const orders = await db
        .select()
        .from(sakshiCafeOrders)
        .where(eq(sakshiCafeOrders.userId, ctx.user.id))
        .limit(input.limit)
        .offset(input.offset);

      return orders.filter((order) => order.paymentStatus === 'paid');
    }),
});
