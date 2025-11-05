import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../../_core/trpc";
import * as upi from "../../lib/payments/upi";
import * as db from "../../db";

export const upiRouter = router({
  // Generate UPI payment string
  generatePaymentString: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      amount: z.number(),
      merchantVPA: z.string(),
      merchantName: z.string(),
      transactionNote: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const upiString = upi.generateUPIString(
        input.merchantVPA,
        input.merchantName,
        input.amount,
        input.transactionNote || `Order #${input.orderId}`,
        `SAKSHI${input.orderId}`
      );

      return { upiString };
    }),

  // Generate QR code for UPI payment
  generateQRCode: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      amount: z.number(),
      merchantVPA: z.string(),
      merchantName: z.string(),
      transactionNote: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const qrCode = await upi.generateQRCode(
        input.merchantVPA,
        input.merchantName,
        input.amount,
        input.transactionNote || `Order #${input.orderId}`,
        `SAKSHI${input.orderId}`
      );

      return { qrCode };
    }),

  // Get UPI deep link for mobile
  getDeepLink: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      amount: z.number(),
      merchantVPA: z.string(),
      merchantName: z.string(),
      upiApp: z.enum(["gpay", "phonepe", "paytm", "bhim", "generic"]),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const deepLink = upi.getUPIDeepLink(
        input.merchantVPA,
        input.merchantName,
        input.amount,
        `Order #${input.orderId}`,
        `SAKSHI${input.orderId}`,
        input.upiApp
      );

      return { deepLink };
    }),

  // Create UPI payment session
  createPaymentSession: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      amount: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const session = await upi.createPaymentSession(
        input.orderId,
        input.amount,
        ctx.user.id
      );

      return session;
    }),

  // Verify UPI payment
  verifyPayment: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      transactionId: z.string(),
      upiTransactionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const verified = await upi.verifyPayment(
        input.transactionId,
        input.upiTransactionId
      );

      if (verified) {
        // Update order status
        await db.updateOrderStatus(input.orderId, "paid");
        await db.updateOrderPaymentDetails(input.orderId, {
          paymentMethod: "upi",
          upiTransactionId: input.upiTransactionId,
        });
      }

      return { success: verified };
    }),

  // Get payment status
  getPaymentStatus: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      transactionId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const status = await upi.getPaymentStatus(input.transactionId);
      return status;
    }),

  // Get supported UPI apps
  getSupportedApps: publicProcedure.query(() => {
    return upi.getSupportedUPIApps();
  }),

  // Detect if device is mobile
  detectDevice: publicProcedure.query(({ ctx }) => {
    const userAgent = ctx.req.headers["user-agent"] || "";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    return { isMobile };
  }),
});
