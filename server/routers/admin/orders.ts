import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../helpers";
import { db } from "../../db";
import { orders, orderItems, products, users } from "@db/schema";
import { eq, desc, and, or, like, gte, lte, sql } from "drizzle-orm";
import { sendShippingUpdate } from "../../lib/email/service";

export const adminOrdersRouter = router({
  // Get all orders with filters
  getAll: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
        paymentMethod: z.enum(["money", "seva-tokens", "free"]).optional(),
        search: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        minAmount: z.number().optional(),
        maxAmount: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, status, paymentMethod, search, startDate, endDate, minAmount, maxAmount } = input;
      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [];

      if (status) {
        conditions.push(eq(orders.status, status));
      }

      if (paymentMethod) {
        conditions.push(eq(orders.paymentMethod, paymentMethod));
      }

      if (search) {
        conditions.push(
          or(
            like(orders.id, `%${search}%`),
            like(orders.shippingAddress, `%${search}%`)
          )
        );
      }

      if (startDate) {
        conditions.push(gte(orders.createdAt, new Date(startDate)));
      }

      if (endDate) {
        conditions.push(lte(orders.createdAt, new Date(endDate)));
      }

      if (minAmount) {
        conditions.push(gte(orders.totalAmount, minAmount));
      }

      if (maxAmount) {
        conditions.push(lte(orders.totalAmount, maxAmount));
      }

      // Get orders
      const ordersList = await db
        .select()
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset);

      // Get total count
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        orders: ordersList,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    }),

  // Get order details
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (!order.length) {
        throw new Error("Order not found");
      }

      // Get order items with product details
      const items = await db
        .select({
          id: orderItems.id,
          quantity: orderItems.quantity,
          price: orderItems.price,
          productId: orderItems.productId,
          productName: products.name,
          productImage: products.images,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, input.id));

      // Get user details
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          fullName: users.fullName,
        })
        .from(users)
        .where(eq(users.id, order[0].userId))
        .limit(1);

      return {
        ...order[0],
        items,
        user,
      };
    }),

  // Update order status
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
        trackingNumber: z.string().optional(),
        trackingUrl: z.string().url().optional(),
        estimatedDelivery: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, status, trackingNumber, trackingUrl, estimatedDelivery, notes } = input;

      // Update order
      const [updatedOrder] = await db
        .update(orders)
        .set({
          status,
          trackingNumber,
          trackingUrl,
          estimatedDelivery,
          notes,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, id))
        .returning();

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      // Get user email
      const [user] = await db
        .select({ email: users.email, fullName: users.fullName })
        .from(users)
        .where(eq(users.id, updatedOrder.userId))
        .limit(1);

      // Send shipping update email
      if (user && ["processing", "shipped", "delivered"].includes(status)) {
        await sendShippingUpdate(user.email, {
          orderId: id,
          customerName: user.fullName || "Customer",
          status,
          trackingNumber,
          trackingUrl,
          estimatedDelivery,
        });
      }

      return updatedOrder;
    }),

  // Bulk update orders
  bulkUpdate: adminProcedure
    .input(
      z.object({
        orderIds: z.array(z.number()),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const { orderIds, status } = input;

      const updatedOrders = await db
        .update(orders)
        .set({ status, updatedAt: new Date() })
        .where(sql`${orders.id} IN ${orderIds}`)
        .returning();

      return {
        success: true,
        updated: updatedOrders.length,
      };
    }),

  // Get order statistics
  getStatistics: adminProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { startDate, endDate } = input;

      const conditions = [];
      if (startDate) conditions.push(gte(orders.createdAt, new Date(startDate)));
      if (endDate) conditions.push(lte(orders.createdAt, new Date(endDate)));

      // Total orders
      const [{ totalOrders }] = await db
        .select({ totalOrders: sql<number>`count(*)` })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Total revenue
      const [{ totalRevenue }] = await db
        .select({ totalRevenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)` })
        .from(orders)
        .where(
          and(
            eq(orders.paymentMethod, "money"),
            ...(conditions.length > 0 ? conditions : [])
          )
        );

      // Orders by status
      const ordersByStatus = await db
        .select({
          status: orders.status,
          count: sql<number>`count(*)`,
        })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(orders.status);

      // Orders by payment method
      const ordersByPaymentMethod = await db
        .select({
          paymentMethod: orders.paymentMethod,
          count: sql<number>`count(*)`,
          totalAmount: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
        })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(orders.paymentMethod);

      // Average order value
      const [{ avgOrderValue }] = await db
        .select({ avgOrderValue: sql<number>`coalesce(avg(${orders.totalAmount}), 0)` })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Orders over time (daily)
      const ordersOverTime = await db
        .select({
          date: sql<string>`date(${orders.createdAt})`,
          count: sql<number>`count(*)`,
          revenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
        })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(sql`date(${orders.createdAt})`)
        .orderBy(sql`date(${orders.createdAt})`);

      return {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        ordersByStatus,
        ordersByPaymentMethod,
        ordersOverTime,
      };
    }),

  // Cancel order
  cancel: adminProcedure
    .input(
      z.object({
        id: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, reason } = input;

      const [order] = await db
        .update(orders)
        .set({
          status: "cancelled",
          notes: reason,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, id))
        .returning();

      if (!order) {
        throw new Error("Order not found");
      }

      // TODO: Process refund if payment was made
      // TODO: Restore product inventory

      return order;
    }),

  // Export orders to CSV
  export: adminProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { startDate, endDate, status } = input;

      const conditions = [];
      if (startDate) conditions.push(gte(orders.createdAt, new Date(startDate)));
      if (endDate) conditions.push(lte(orders.createdAt, new Date(endDate)));
      if (status) conditions.push(eq(orders.status, status));

      const ordersList = await db
        .select()
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(orders.createdAt));

      // Convert to CSV format
      const headers = [
        "Order ID",
        "User ID",
        "Status",
        "Payment Method",
        "Total Amount",
        "Created At",
        "Shipping Address",
      ];

      const rows = ordersList.map((order) => [
        order.id,
        order.userId,
        order.status,
        order.paymentMethod,
        order.totalAmount,
        order.createdAt.toISOString(),
        order.shippingAddress,
      ]);

      const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

      return {
        csv,
        filename: `orders_${new Date().toISOString().split("T")[0]}.csv`,
      };
    }),
});
