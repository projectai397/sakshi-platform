import { z } from "zod";
import { router, protectedProcedure } from "../../trpc";
import { db } from "../../db";
import { users, orders, sevaWallets } from "@shared/schema";
import { eq, and, sql, desc, asc, like, inArray, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminUsersRouter = router({
  // List all users with filtering
  list: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      role: z.enum(['user', 'admin', 'volunteer']).optional(),
      status: z.enum(['active', 'suspended', 'banned']).optional(),
      sortBy: z.enum(['name', 'email', 'created', 'lastActive']).default('created'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { page, limit, search, role, status, sortBy, sortOrder } = input;
      const offset = (page - 1) * limit;

      let query = db.select().from(users);
      let conditions = [];

      if (search) {
        conditions.push(
          sql`(${users.username} LIKE ${`%${search}%`} OR ${users.email} LIKE ${`%${search}%`})`
        );
      }
      if (role) {
        conditions.push(eq(users.role, role));
      }
      if (status) {
        conditions.push(eq(users.status, status));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Apply sorting
      const sortColumn = {
        name: users.username,
        email: users.email,
        created: users.createdAt,
        lastActive: users.lastActiveAt,
      }[sortBy];

      query = sortOrder === 'asc' 
        ? query.orderBy(asc(sortColumn))
        : query.orderBy(desc(sortColumn));

      const items = await query.limit(limit).offset(offset);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = Number(totalResult[0]?.count || 0);

      return {
        items: items.map(user => ({
          ...user,
          password: undefined, // Never send passwords
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get user details with activity
  getDetails: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      if (user.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Get user's orders
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, input.userId))
        .orderBy(desc(orders.createdAt))
        .limit(10);

      // Get seva wallet
      const wallet = await db
        .select()
        .from(sevaWallets)
        .where(eq(sevaWallets.userId, input.userId))
        .limit(1);

      return {
        user: {
          ...user[0],
          password: undefined,
        },
        orders: userOrders,
        sevaWallet: wallet[0] || null,
      };
    }),

  // Update user
  update: protectedProcedure
    .input(z.object({
      userId: z.number(),
      updates: z.object({
        username: z.string().optional(),
        email: z.string().email().optional(),
        role: z.enum(['user', 'admin', 'volunteer']).optional(),
        status: z.enum(['active', 'suspended', 'banned']).optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { userId, updates } = input;

      const updated = await db
        .update(users)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      return {
        ...updated[0],
        password: undefined,
      };
    }),

  // Suspend user
  suspend: protectedProcedure
    .input(z.object({
      userId: z.number(),
      reason: z.string(),
      duration: z.number().optional(), // Days
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { userId, reason, duration } = input;

      const suspendedUntil = duration 
        ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
        : null;

      await db
        .update(users)
        .set({
          status: 'suspended',
          suspendedUntil,
          suspensionReason: reason,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return {
        success: true,
        suspendedUntil,
      };
    }),

  // Ban user
  ban: protectedProcedure
    .input(z.object({
      userId: z.number(),
      reason: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { userId, reason } = input;

      await db
        .update(users)
        .set({
          status: 'banned',
          suspensionReason: reason,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),

  // Unban/unsuspend user
  restore: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      await db
        .update(users)
        .set({
          status: 'active',
          suspendedUntil: null,
          suspensionReason: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Delete user
  delete: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      // Soft delete by setting status
      await db
        .update(users)
        .set({
          status: 'deleted',
          deletedAt: new Date(),
        })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // User statistics
  getStatistics: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        bannedUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users),
        db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.status, 'active')),
        db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.status, 'suspended')),
        db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.status, 'banned')),
        db.select({ count: sql<number>`count(*)` }).from(users).where(
          gte(users.createdAt, new Date(new Date().setHours(0, 0, 0, 0)))
        ),
        db.select({ count: sql<number>`count(*)` }).from(users).where(
          gte(users.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        ),
        db.select({ count: sql<number>`count(*)` }).from(users).where(
          gte(users.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        ),
      ]);

      return {
        totalUsers: Number(totalUsers[0]?.count || 0),
        activeUsers: Number(activeUsers[0]?.count || 0),
        suspendedUsers: Number(suspendedUsers[0]?.count || 0),
        bannedUsers: Number(bannedUsers[0]?.count || 0),
        newUsersToday: Number(newUsersToday[0]?.count || 0),
        newUsersThisWeek: Number(newUsersThisWeek[0]?.count || 0),
        newUsersThisMonth: Number(newUsersThisMonth[0]?.count || 0),
      };
    }),

  // User activity log
  getActivityLog: protectedProcedure
    .input(z.object({
      userId: z.number(),
      limit: z.number().default(50),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      // Get user's recent orders as activity
      const activity = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, input.userId))
        .orderBy(desc(orders.createdAt))
        .limit(input.limit);

      return activity.map(order => ({
        type: 'order',
        action: `Placed order #${order.id}`,
        timestamp: order.createdAt,
        details: {
          orderId: order.id,
          total: order.total,
          status: order.status,
        },
      }));
    }),

  // Bulk operations
  bulkUpdate: protectedProcedure
    .input(z.object({
      userIds: z.array(z.number()),
      updates: z.object({
        role: z.enum(['user', 'admin', 'volunteer']).optional(),
        status: z.enum(['active', 'suspended', 'banned']).optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const { userIds, updates } = input;

      await db
        .update(users)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(inArray(users.id, userIds));

      return {
        success: true,
        updated: userIds.length,
      };
    }),

  // Export users
  export: protectedProcedure
    .input(z.object({
      format: z.enum(['csv', 'json']).default('csv'),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const allUsers = await db.select().from(users);

      const sanitized = allUsers.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      }));

      if (input.format === 'json') {
        return {
          format: 'json',
          data: JSON.stringify(sanitized, null, 2),
          filename: `users-export-${Date.now()}.json`,
        };
      } else {
        const headers = ['ID', 'Username', 'Email', 'Role', 'Status', 'Created'];
        const rows = sanitized.map(u => [
          u.id,
          u.username,
          u.email,
          u.role,
          u.status,
          u.createdAt.toISOString(),
        ]);

        const csv = [
          headers.join(','),
          ...rows.map(row => row.join(',')),
        ].join('\n');

        return {
          format: 'csv',
          data: csv,
          filename: `users-export-${Date.now()}.csv`,
        };
      }
    }),
});
