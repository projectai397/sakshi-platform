import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../../_core/trpc";
import * as crypto from "../../lib/payments/crypto";
import * as db from "../../db";

export const cryptoRouter = router({
  // Create cryptocurrency charge
  createCharge: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      amount: z.number(),
      currency: z.string().default("USD"),
      description: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const charge = await crypto.createCharge(
        input.amount,
        input.currency,
        input.description,
        input.orderId
      );

      // Store charge ID in order
      await db.updateOrderPaymentDetails(input.orderId, {
        paymentMethod: "cryptocurrency",
        cryptoChargeId: charge.id,
        cryptoHostedUrl: charge.hosted_url,
      });

      return charge;
    }),

  // Get charge details
  getCharge: protectedProcedure
    .input(z.object({
      chargeId: z.string(),
      orderId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const charge = await crypto.getCharge(input.chargeId);
      return charge;
    }),

  // List all charges for user
  listCharges: protectedProcedure
    .input(z.object({
      limit: z.number().optional().default(10),
    }))
    .query(async ({ input, ctx }) => {
      // Get user's orders with crypto payments
      const orders = await db.getUserOrders(ctx.user.id);
      const cryptoOrders = orders.filter(o => 
        o.paymentMethod === "cryptocurrency" && o.cryptoChargeId
      );

      // Fetch charge details from Coinbase
      const charges = await Promise.all(
        cryptoOrders.slice(0, input.limit).map(async (order) => {
          try {
            return await crypto.getCharge(order.cryptoChargeId!);
          } catch (error) {
            return null;
          }
        })
      );

      return charges.filter(c => c !== null);
    }),

  // Cancel charge
  cancelCharge: protectedProcedure
    .input(z.object({
      chargeId: z.string(),
      orderId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify order belongs to user
      const order = await db.getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found or unauthorized");
      }

      const cancelled = await crypto.cancelCharge(input.chargeId);

      if (cancelled) {
        await db.updateOrderStatus(input.orderId, "cancelled");
      }

      return { success: cancelled };
    }),

  // Webhook handler (public endpoint)
  webhook: publicProcedure
    .input(z.object({
      event: z.any(),
      signature: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Get raw body for signature verification
      const rawBody = JSON.stringify(input.event);

      // Verify webhook signature
      const isValid = crypto.verifyWebhookSignature(
        rawBody,
        input.signature
      );

      if (!isValid) {
        throw new Error("Invalid webhook signature");
      }

      // Handle webhook event
      await crypto.handleWebhook(input.event);

      // Update order status based on event
      if (input.event.type === "charge:confirmed") {
        const orderId = input.event.data.metadata?.orderId;
        if (orderId) {
          await db.updateOrderStatus(parseInt(orderId), "paid");
        }
      } else if (input.event.type === "charge:failed") {
        const orderId = input.event.data.metadata?.orderId;
        if (orderId) {
          await db.updateOrderStatus(parseInt(orderId), "failed");
        }
      }

      return { success: true };
    }),

  // Get supported cryptocurrencies
  getSupportedCurrencies: publicProcedure.query(() => {
    return crypto.getSupportedCryptocurrencies();
  }),

  // Get current exchange rates
  getExchangeRates: publicProcedure
    .input(z.object({
      fiatCurrency: z.string().default("USD"),
    }))
    .query(async ({ input }) => {
      // This would call Coinbase API for real-time rates
      // For now, return mock data
      return {
        BTC: 0.000023,
        ETH: 0.00035,
        USDC: 1.0,
        DAI: 1.0,
      };
    }),

  // Convert fiat to crypto
  convertFiatToCrypto: publicProcedure
    .input(z.object({
      amount: z.number(),
      fiatCurrency: z.string().default("USD"),
      cryptoCurrency: z.string(),
    }))
    .query(async ({ input }) => {
      const converted = await crypto.convertFiatToCrypto(
        input.amount,
        input.fiatCurrency,
        input.cryptoCurrency
      );
      return converted;
    }),
});
