import { z } from "zod";
import { router, protectedProcedure } from "../../trpc";
import { db } from "../../db";
import { products, productVariants, inventory } from "@shared/schema";
import { eq, and, sql, desc, asc, like, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminProductsRouter = router({
  // Get all products with advanced filtering
  list: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      category: z.string().optional(),
      condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']).optional(),
      status: z.enum(['active', 'inactive', 'out_of_stock']).optional(),
      sortBy: z.enum(['name', 'price', 'stock', 'created']).default('created'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { page, limit, search, category, condition, status, sortBy, sortOrder } = input;
      const offset = (page - 1) * limit;

      let query = db.select().from(products);
      let conditions = [];

      if (search) {
        conditions.push(like(products.name, `%${search}%`));
      }
      if (category) {
        conditions.push(eq(products.category, category));
      }
      if (condition) {
        conditions.push(eq(products.condition, condition));
      }
      if (status) {
        conditions.push(eq(products.status, status));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Apply sorting
      const sortColumn = {
        name: products.name,
        price: products.suggestedPrice,
        stock: products.stock,
        created: products.createdAt,
      }[sortBy];

      query = sortOrder === 'asc' 
        ? query.orderBy(asc(sortColumn))
        : query.orderBy(desc(sortColumn));

      const items = await query.limit(limit).offset(offset);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = Number(totalResult[0]?.count || 0);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Bulk update products
  bulkUpdate: protectedProcedure
    .input(z.object({
      productIds: z.array(z.number()),
      updates: z.object({
        status: z.enum(['active', 'inactive', 'out_of_stock']).optional(),
        category: z.string().optional(),
        discount: z.number().optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { productIds, updates } = input;

      await db
        .update(products)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(inArray(products.id, productIds));

      return {
        success: true,
        updated: productIds.length,
      };
    }),

  // Bulk delete products
  bulkDelete: protectedProcedure
    .input(z.object({
      productIds: z.array(z.number()),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { productIds } = input;

      // Delete associated variants first
      await db.delete(productVariants).where(inArray(productVariants.productId, productIds));

      // Delete products
      await db.delete(products).where(inArray(products.id, productIds));

      return {
        success: true,
        deleted: productIds.length,
      };
    }),

  // Product variants management
  createVariant: protectedProcedure
    .input(z.object({
      productId: z.number(),
      name: z.string(),
      sku: z.string(),
      price: z.number(),
      stock: z.number(),
      attributes: z.record(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const variant = await db.insert(productVariants).values({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      return variant[0];
    }),

  // Get product variants
  getVariants: protectedProcedure
    .input(z.object({
      productId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, input.productId));

      return variants;
    }),

  // Update variant
  updateVariant: protectedProcedure
    .input(z.object({
      variantId: z.number(),
      updates: z.object({
        name: z.string().optional(),
        sku: z.string().optional(),
        price: z.number().optional(),
        stock: z.number().optional(),
        attributes: z.record(z.string()).optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { variantId, updates } = input;

      const variant = await db
        .update(productVariants)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(productVariants.id, variantId))
        .returning();

      return variant[0];
    }),

  // Delete variant
  deleteVariant: protectedProcedure
    .input(z.object({
      variantId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      await db.delete(productVariants).where(eq(productVariants.id, input.variantId));

      return { success: true };
    }),

  // Inventory tracking
  getInventory: protectedProcedure
    .input(z.object({
      productId: z.number().optional(),
      lowStock: z.boolean().optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      let query = db.select().from(inventory);

      if (input.productId) {
        query = query.where(eq(inventory.productId, input.productId));
      }

      if (input.lowStock) {
        query = query.where(sql`${inventory.quantity} <= ${inventory.reorderPoint}`);
      }

      const items = await query;

      return items;
    }),

  // Update inventory
  updateInventory: protectedProcedure
    .input(z.object({
      productId: z.number(),
      quantity: z.number(),
      reorderPoint: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { productId, quantity, reorderPoint, notes } = input;

      // Check if inventory record exists
      const existing = await db
        .select()
        .from(inventory)
        .where(eq(inventory.productId, productId))
        .limit(1);

      if (existing.length > 0) {
        // Update existing
        const updated = await db
          .update(inventory)
          .set({
            quantity,
            reorderPoint: reorderPoint ?? existing[0].reorderPoint,
            notes,
            updatedAt: new Date(),
          })
          .where(eq(inventory.productId, productId))
          .returning();

        return updated[0];
      } else {
        // Create new
        const created = await db
          .insert(inventory)
          .values({
            productId,
            quantity,
            reorderPoint: reorderPoint ?? 10,
            notes,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return created[0];
      }
    }),

  // Inventory adjustments
  adjustInventory: protectedProcedure
    .input(z.object({
      productId: z.number(),
      adjustment: z.number(), // Positive or negative
      reason: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { productId, adjustment, reason } = input;

      // Get current inventory
      const current = await db
        .select()
        .from(inventory)
        .where(eq(inventory.productId, productId))
        .limit(1);

      if (current.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Inventory not found" });
      }

      const newQuantity = current[0].quantity + adjustment;

      if (newQuantity < 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient inventory" });
      }

      // Update inventory
      await db
        .update(inventory)
        .set({
          quantity: newQuantity,
          notes: `${current[0].notes || ''}\n${new Date().toISOString()}: ${reason} (${adjustment > 0 ? '+' : ''}${adjustment})`,
          updatedAt: new Date(),
        })
        .where(eq(inventory.productId, productId));

      return {
        success: true,
        previousQuantity: current[0].quantity,
        newQuantity,
      };
    }),

  // Low stock alerts
  getLowStockAlerts: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const lowStock = await db
        .select({
          product: products,
          inventory: inventory,
        })
        .from(inventory)
        .innerJoin(products, eq(inventory.productId, products.id))
        .where(sql`${inventory.quantity} <= ${inventory.reorderPoint}`);

      return lowStock;
    }),

  // Product import/export
  exportProducts: protectedProcedure
    .input(z.object({
      format: z.enum(['csv', 'json']).default('csv'),
      filters: z.object({
        category: z.string().optional(),
        status: z.string().optional(),
      }).optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      let query = db.select().from(products);

      if (input.filters?.category) {
        query = query.where(eq(products.category, input.filters.category));
      }
      if (input.filters?.status) {
        query = query.where(eq(products.status, input.filters.status as any));
      }

      const items = await query;

      if (input.format === 'json') {
        return {
          format: 'json',
          data: JSON.stringify(items, null, 2),
          filename: `products-export-${Date.now()}.json`,
        };
      } else {
        // CSV format
        const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Condition'];
        const rows = items.map(p => [
          p.id,
          p.name,
          p.category,
          p.suggestedPrice,
          p.stock,
          p.status,
          p.condition,
        ]);

        const csv = [
          headers.join(','),
          ...rows.map(row => row.join(',')),
        ].join('\n');

        return {
          format: 'csv',
          data: csv,
          filename: `products-export-${Date.now()}.csv`,
        };
      }
    }),

  // Product statistics
  getStatistics: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const [
        totalProducts,
        activeProducts,
        outOfStock,
        lowStock,
        totalValue,
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(products),
        db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.status, 'active')),
        db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.status, 'out_of_stock')),
        db.select({ count: sql<number>`count(*)` }).from(inventory).where(sql`${inventory.quantity} <= ${inventory.reorderPoint}`),
        db.select({ total: sql<number>`sum(${products.suggestedPrice} * ${products.stock})` }).from(products),
      ]);

      return {
        totalProducts: Number(totalProducts[0]?.count || 0),
        activeProducts: Number(activeProducts[0]?.count || 0),
        outOfStock: Number(outOfStock[0]?.count || 0),
        lowStock: Number(lowStock[0]?.count || 0),
        totalValue: Number(totalValue[0]?.total || 0),
      };
    }),
});
