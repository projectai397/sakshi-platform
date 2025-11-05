import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../../_core/trpc";
import * as razorpay from "../../lib/payments/razorpay";
import * as db from "../../db";

export const razorpayRouter = router({
  // Create Razorpay order
  createOrder: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      amount: z.number(),
      currency: z.string().default("INR"),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      // Create Razorpay order
      const razorpayOrder = await razorpay.createOrder(
        input.amount,
        input.orderId,
        input.currency
      );

      return razorpayOrder;
    }),

  // Verify payment
  verifyPayment: protectedProcedure
    .input(z.object({
      orderId: z.string(),
      paymentId: z.string(),
      signature: z.string(),
      sakshiOrderId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify payment signature
      const isValid = await razorpay.verifyPayment(
        input.orderId,
        input.paymentId,
        input.signature
      );

      if (!isValid) {
        throw new Error("Invalid payment signature");
      }

      // Update order status
      await db.updateOrderStatus(input.sakshiOrderId, "paid");
      await db.updateOrderPaymentDetails(input.sakshiOrderId, {
        paymentMethod: "razorpay",
        paymentId: input.paymentId,
        razorpayOrderId: input.orderId,
      });

      return { success: true, verified: true };
    }),

  // Capture payment
  capturePayment: protectedProcedure
    .input(z.object({
      paymentId: z.string(),
      amount: z.number(),
    }))
    .mutation(async ({ input }) => {
      const captured = await razorpay.capturePayment(
        input.paymentId,
        input.amount
      );
      return captured;
    }),

  // Create payment link
  createPaymentLink: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      amount: z.number(),
      description: z.string(),
      customerName: z.string(),
      customerEmail: z.string(),
      customerPhone: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const paymentLink = await razorpay.createPaymentLink(
        input.amount,
        input.description,
        {
          name: input.customerName,
          email: input.customerEmail,
          contact: input.customerPhone,
        },
        input.orderId
      );

      return paymentLink;
    }),

  // Process refund
  processRefund: protectedProcedure
    .input(z.object({
      paymentId: z.string(),
      amount: z.number().optional(),
      orderId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user or user is admin
      const order = await db.getOrderById(input.orderId);
      if (!order || (order.userId !== ctx.user.id && ctx.user.role !== "admin")) {
        throw new Error("Order not found or unauthorized");
      }

      const refund = await razorpay.processRefund(
        input.paymentId,
        input.amount
      );

      // Update order status
      await db.updateOrderStatus(input.orderId, "refunded");

      return refund;
    }),

  // Webhook handler (public endpoint)
  webhook: publicProcedure
    .input(z.object({
      event: z.string(),
      payload: z.any(),
      signature: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Verify webhook signature
      const isValid = razorpay.verifyWebhookSignature(
        JSON.stringify(input.payload),
        input.signature
      );

      if (!isValid) {
        throw new Error("Invalid webhook signature");
      }

      // Handle different event types
      await razorpay.handleWebhook(input.event, input.payload);

      return { success: true };
    }),

  // Get payment details
  getPaymentDetails: protectedProcedure
    .input(z.object({
      paymentId: z.string(),
    }))
    .query(async ({ input }) => {
      // This would call Razorpay API to get payment details
      // For now, return from database
      return { paymentId: input.paymentId };
    }),

  // Get Razorpay config for frontend
  getConfig: publicProcedure.query(() => {
    return razorpay.getRazorpayConfig();
  }),
});
