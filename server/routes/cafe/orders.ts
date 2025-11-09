import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../_core/trpc';
import { getDb } from '../../db';
import { sakshiCafeOrders, sakshiMenuItems } from '../../../drizzle/schema-cafe';
import { eq, and, desc } from 'drizzle-orm';

export const cafeOrdersRouter = router({
  // Create a new cafe order
  createOrder: protectedProcedure
    .input(z.object({
      orderType: z.enum(['dine-in', 'delivery', 'pickup', 'catering']),
      cafeLocationId: z.number(),
      deliveryAddress: z.string().optional(),
      deliveryLatitude: z.number().optional(),
      deliveryLongitude: z.number().optional(),
      scheduledTime: z.date().optional(),
      items: z.array(z.object({
        menuItemId: z.number(),
        quantity: z.number().min(1),
        priceTier: z.enum(['community', 'fair', 'supporter']),
        customizations: z.string().optional(),
      })),
      specialInstructions: z.string().optional(),
      paymentMethod: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      // Calculate order totals
      let subtotal = 0;
      const itemsWithPrices = [];
      
      for (const item of input.items) {
        const [menuItem] = await db
          .select()
          .from(sakshiMenuItems)
          .where(eq(sakshiMenuItems.id, item.menuItemId));
        
        if (!menuItem) {
          throw new Error(`Menu item ${item.menuItemId} not found`);
        }
        
        if (!menuItem.isAvailable) {
          throw new Error(`Menu item ${menuItem.name} is not available`);
        }
        
        let price = 0;
        if (item.priceTier === 'community') {
          price = parseFloat(menuItem.communityPrice || '0');
        } else if (item.priceTier === 'fair') {
          price = parseFloat(menuItem.fairPrice || '0');
        } else {
          price = parseFloat(menuItem.supporterPrice || '0');
        }
        
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
        
        itemsWithPrices.push({
          ...item,
          name: menuItem.name,
          price,
          total: itemTotal,
        });
      }
      
      // Calculate delivery fee
      let deliveryFee = 0;
      if (input.orderType === 'delivery') {
        deliveryFee = 50; // Base delivery fee
        // TODO: Calculate based on distance
      }
      
      const total = subtotal + deliveryFee;
      
      // Create order
      const [order] = await db
        .insert(sakshiCafeOrders)
        .values({
          userId: ctx.user.id,
          orderType: input.orderType,
          cafeLocationId: input.cafeLocationId,
          deliveryAddress: input.deliveryAddress,
          deliveryLatitude: input.deliveryLatitude?.toString(),
          deliveryLongitude: input.deliveryLongitude?.toString(),
          scheduledTime: input.scheduledTime,
          items: itemsWithPrices,
          subtotal: subtotal.toString(),
          deliveryFee: deliveryFee.toString(),
          total: total.toString(),
          paymentMethod: input.paymentMethod,
          paymentStatus: 'pending',
          orderStatus: 'pending',
          specialInstructions: input.specialInstructions,
        })
        .returning();
      
      return order;
    }),

  // Get user's orders
  getMyOrders: protectedProcedure
    .input(z.object({
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      
      const orders = await db
        .select()
        .from(sakshiCafeOrders)
        .where(eq(sakshiCafeOrders.userId, ctx.user.id))
        .orderBy(desc(sakshiCafeOrders.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return orders;
    }),

  // Get single order
  getOrder: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      
      const [order] = await db
        .select()
        .from(sakshiCafeOrders)
        .where(
          and(
            eq(sakshiCafeOrders.id, input.id),
            eq(sakshiCafeOrders.userId, ctx.user.id)
          )
        );
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    }),

  // Update order status (admin/staff only)
  updateOrderStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      orderStatus: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if user is admin/staff
      const db = getDb();
      
      const [updatedOrder] = await db
        .update(sakshiCafeOrders)
        .set({
          orderStatus: input.orderStatus,
          updatedAt: new Date(),
        })
        .where(eq(sakshiCafeOrders.id, input.id))
        .returning();
      
      return updatedOrder;
    }),

  // Cancel order
  cancelOrder: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      const [order] = await db
        .select()
        .from(sakshiCafeOrders)
        .where(
          and(
            eq(sakshiCafeOrders.id, input.id),
            eq(sakshiCafeOrders.userId, ctx.user.id)
          )
        );
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (['delivered', 'cancelled'].includes(order.orderStatus || '')) {
        throw new Error('Cannot cancel this order');
      }
      
      const [updatedOrder] = await db
        .update(sakshiCafeOrders)
        .set({
          orderStatus: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(sakshiCafeOrders.id, input.id))
        .returning();
      
      return updatedOrder;
    }),

  // Get all orders (admin only)
  getAllOrders: protectedProcedure
    .input(z.object({
      cafeLocationId: z.number().optional(),
      orderStatus: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      // TODO: Check if user is admin
      const db = getDb();
      const conditions = [];
      
      if (input.cafeLocationId) {
        conditions.push(eq(sakshiCafeOrders.cafeLocationId, input.cafeLocationId));
      }
      
      if (input.orderStatus) {
        conditions.push(eq(sakshiCafeOrders.orderStatus, input.orderStatus));
      }
      
      const orders = await db
        .select()
        .from(sakshiCafeOrders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(sakshiCafeOrders.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return orders;
    }),
});
