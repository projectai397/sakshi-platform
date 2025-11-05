import { z } from "zod";
import { router, adminProcedure } from "../helpers";
import { db } from "../../db";
import { sevaWallet, users } from "@db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { sendSevaTokenNotification } from "../../lib/email/service";

export const adminSevaTokensRouter = router({
  // Get all seva wallet transactions
  getAllTransactions: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        type: z.enum(["earned", "spent"]).optional(),
        userId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, type, userId, startDate, endDate } = input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (type) conditions.push(eq(sevaWallet.type, type));
      if (userId) conditions.push(eq(sevaWallet.userId, userId));
      if (startDate) conditions.push(gte(sevaWallet.createdAt, new Date(startDate)));
      if (endDate) conditions.push(lte(sevaWallet.createdAt, new Date(endDate)));

      const transactions = await db
        .select({
          id: sevaWallet.id,
          userId: sevaWallet.userId,
          amount: sevaWallet.amount,
          type: sevaWallet.type,
          description: sevaWallet.description,
          balance: sevaWallet.balance,
          createdAt: sevaWallet.createdAt,
          username: users.username,
          userEmail: users.email,
        })
        .from(sevaWallet)
        .leftJoin(users, eq(sevaWallet.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(sevaWallet.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(sevaWallet)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        transactions,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    }),

  // Get seva token statistics
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
      if (startDate) conditions.push(gte(sevaWallet.createdAt, new Date(startDate)));
      if (endDate) conditions.push(lte(sevaWallet.createdAt, new Date(endDate)));

      // Total tokens earned
      const [{ totalEarned }] = await db
        .select({ totalEarned: sql<number>`coalesce(sum(${sevaWallet.amount}), 0)` })
        .from(sevaWallet)
        .where(
          and(eq(sevaWallet.type, "earned"), ...(conditions.length > 0 ? conditions : []))
        );

      // Total tokens spent
      const [{ totalSpent }] = await db
        .select({ totalSpent: sql<number>`coalesce(sum(${sevaWallet.amount}), 0)` })
        .from(sevaWallet)
        .where(
          and(eq(sevaWallet.type, "spent"), ...(conditions.length > 0 ? conditions : []))
        );

      // Total active users with tokens
      const [{ activeUsers }] = await db
        .select({ activeUsers: sql<number>`count(distinct ${sevaWallet.userId})` })
        .from(sevaWallet);

      // Average balance per user
      const [{ avgBalance }] = await db
        .select({ avgBalance: sql<number>`coalesce(avg(${sevaWallet.balance}), 0)` })
        .from(
          db
            .select({ balance: sql<number>`max(${sevaWallet.balance})` })
            .from(sevaWallet)
            .groupBy(sevaWallet.userId)
            .as("user_balances")
        );

      // Top earners
      const topEarners = await db
        .select({
          userId: sevaWallet.userId,
          username: users.username,
          totalEarned: sql<number>`sum(case when ${sevaWallet.type} = 'earned' then ${sevaWallet.amount} else 0 end)`,
          currentBalance: sql<number>`max(${sevaWallet.balance})`,
        })
        .from(sevaWallet)
        .leftJoin(users, eq(sevaWallet.userId, users.id))
        .groupBy(sevaWallet.userId, users.username)
        .orderBy(sql`sum(case when ${sevaWallet.type} = 'earned' then ${sevaWallet.amount} else 0 end) desc`)
        .limit(10);

      // Tokens over time
      const tokensOverTime = await db
        .select({
          date: sql<string>`date(${sevaWallet.createdAt})`,
          earned: sql<number>`sum(case when ${sevaWallet.type} = 'earned' then ${sevaWallet.amount} else 0 end)`,
          spent: sql<number>`sum(case when ${sevaWallet.type} = 'spent' then ${sevaWallet.amount} else 0 end)`,
        })
        .from(sevaWallet)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(sql`date(${sevaWallet.createdAt})`)
        .orderBy(sql`date(${sevaWallet.createdAt})`);

      return {
        totalEarned,
        totalSpent,
        netTokens: totalEarned - totalSpent,
        activeUsers,
        avgBalance,
        topEarners,
        tokensOverTime,
      };
    }),

  // Award seva tokens to user
  awardTokens: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        amount: z.number().positive(),
        description: z.string(),
        sendEmail: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, amount, description, sendEmail } = input;

      // Get current balance
      const [lastTransaction] = await db
        .select({ balance: sevaWallet.balance })
        .from(sevaWallet)
        .where(eq(sevaWallet.userId, userId))
        .orderBy(desc(sevaWallet.createdAt))
        .limit(1);

      const currentBalance = lastTransaction?.balance || 0;
      const newBalance = currentBalance + amount;

      // Create transaction
      const [transaction] = await db
        .insert(sevaWallet)
        .values({
          userId,
          amount,
          type: "earned",
          description,
          balance: newBalance,
        })
        .returning();

      // Send email notification
      if (sendEmail) {
        const [user] = await db
          .select({ email: users.email, username: users.username })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (user) {
          await sendSevaTokenNotification(user.email, {
            userName: user.username,
            amount,
            type: "earned",
            balance: newBalance,
            description,
          });
        }
      }

      return transaction;
    }),

  // Deduct seva tokens from user
  deductTokens: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        amount: z.number().positive(),
        description: z.string(),
        sendEmail: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, amount, description, sendEmail } = input;

      // Get current balance
      const [lastTransaction] = await db
        .select({ balance: sevaWallet.balance })
        .from(sevaWallet)
        .where(eq(sevaWallet.userId, userId))
        .orderBy(desc(sevaWallet.createdAt))
        .limit(1);

      const currentBalance = lastTransaction?.balance || 0;

      if (currentBalance < amount) {
        throw new Error("Insufficient seva token balance");
      }

      const newBalance = currentBalance - amount;

      // Create transaction
      const [transaction] = await db
        .insert(sevaWallet)
        .values({
          userId,
          amount,
          type: "spent",
          description,
          balance: newBalance,
        })
        .returning();

      // Send email notification
      if (sendEmail) {
        const [user] = await db
          .select({ email: users.email, username: users.username })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (user) {
          await sendSevaTokenNotification(user.email, {
            userName: user.username,
            amount,
            type: "spent",
            balance: newBalance,
            description,
          });
        }
      }

      return transaction;
    }),

  // Bulk award tokens
  bulkAward: adminProcedure
    .input(
      z.object({
        userIds: z.array(z.number()),
        amount: z.number().positive(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userIds, amount, description } = input;

      const results = [];

      for (const userId of userIds) {
        try {
          // Get current balance
          const [lastTransaction] = await db
            .select({ balance: sevaWallet.balance })
            .from(sevaWallet)
            .where(eq(sevaWallet.userId, userId))
            .orderBy(desc(sevaWallet.createdAt))
            .limit(1);

          const currentBalance = lastTransaction?.balance || 0;
          const newBalance = currentBalance + amount;

          // Create transaction
          await db.insert(sevaWallet).values({
            userId,
            amount,
            type: "earned",
            description,
            balance: newBalance,
          });

          results.push({ userId, success: true });
        } catch (error) {
          results.push({ userId, success: false, error: String(error) });
        }
      }

      return {
        total: userIds.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      };
    }),

  // Get user balance
  getUserBalance: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const [lastTransaction] = await db
        .select({ balance: sevaWallet.balance })
        .from(sevaWallet)
        .where(eq(sevaWallet.userId, input.userId))
        .orderBy(desc(sevaWallet.createdAt))
        .limit(1);

      return {
        userId: input.userId,
        balance: lastTransaction?.balance || 0,
      };
    }),

  // Export transactions to CSV
  export: adminProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { startDate, endDate } = input;

      const conditions = [];
      if (startDate) conditions.push(gte(sevaWallet.createdAt, new Date(startDate)));
      if (endDate) conditions.push(lte(sevaWallet.createdAt, new Date(endDate)));

      const transactions = await db
        .select({
          id: sevaWallet.id,
          userId: sevaWallet.userId,
          username: users.username,
          amount: sevaWallet.amount,
          type: sevaWallet.type,
          description: sevaWallet.description,
          balance: sevaWallet.balance,
          createdAt: sevaWallet.createdAt,
        })
        .from(sevaWallet)
        .leftJoin(users, eq(sevaWallet.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(sevaWallet.createdAt));

      const headers = [
        "Transaction ID",
        "User ID",
        "Username",
        "Amount",
        "Type",
        "Description",
        "Balance",
        "Date",
      ];

      const rows = transactions.map((t) => [
        t.id,
        t.userId,
        t.username,
        t.amount,
        t.type,
        t.description,
        t.balance,
        t.createdAt.toISOString(),
      ]);

      const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

      return {
        csv,
        filename: `seva_tokens_${new Date().toISOString().split("T")[0]}.csv`,
      };
    }),
});
