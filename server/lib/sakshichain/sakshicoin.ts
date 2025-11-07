import { getDb } from "../../db";
import { sakWallets, sakTransactions, sakStaking } from "../../../drizzle/schema-sakshichain";
import { eq, and, sql } from "drizzle-orm";

export class SakshiCoinService {
  /**
   * Create a new SAK wallet for a user
   */
  static async createWallet(userId: number, walletAddress?: string) {
    const db = getDb();
    
    // Generate wallet address if not provided
    const address = walletAddress || `SAK-${userId}-${Date.now()}`;
    
    const [wallet] = await db.insert(sakWallets).values({
      userId,
      walletAddress: address,
      balance: "0",
      totalEarned: "0",
      totalSpent: "0",
    });

    return wallet;
  }

  /**
   * Get wallet by user ID
   */
  static async getWalletByUserId(userId: number) {
    const db = getDb();
    
    const [wallet] = await db.select()
      .from(sakWallets)
      .where(eq(sakWallets.userId, userId));

    return wallet;
  }

  /**
   * Get or create wallet for user
   */
  static async getOrCreateWallet(userId: number) {
    let wallet = await this.getWalletByUserId(userId);
    
    if (!wallet) {
      wallet = await this.createWallet(userId);
    }

    return wallet;
  }

  /**
   * Award SAK tokens to a user
   */
  static async awardTokens(params: {
    userId: number;
    amount: number;
    type: string;
    category: string;
    description: string;
    relatedProductId?: number;
    relatedOrderId?: number;
    metadata?: Record<string, any>;
  }) {
    const db = getDb();
    
    const wallet = await this.getOrCreateWallet(params.userId);

    // Create transaction
    const [transaction] = await db.insert(sakTransactions).values({
      toWalletId: wallet.id,
      amount: params.amount.toString(),
      type: params.type,
      category: params.category,
      description: params.description,
      relatedProductId: params.relatedProductId,
      relatedOrderId: params.relatedOrderId,
      metadata: params.metadata,
      status: "completed",
    });

    // Update wallet balance
    await db.update(sakWallets)
      .set({
        balance: sql`${sakWallets.balance} + ${params.amount}`,
        totalEarned: sql`${sakWallets.totalEarned} + ${params.amount}`,
      })
      .where(eq(sakWallets.id, wallet.id));

    return transaction;
  }

  /**
   * Spend SAK tokens
   */
  static async spendTokens(params: {
    userId: number;
    amount: number;
    type: string;
    category: string;
    description: string;
    relatedProductId?: number;
    relatedOrderId?: number;
    metadata?: Record<string, any>;
  }) {
    const db = getDb();
    
    const wallet = await this.getWalletByUserId(params.userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Check balance
    const balance = parseFloat(wallet.balance);
    if (balance < params.amount) {
      throw new Error("Insufficient SAK balance");
    }

    // Create transaction
    const [transaction] = await db.insert(sakTransactions).values({
      fromWalletId: wallet.id,
      amount: params.amount.toString(),
      type: params.type,
      category: params.category,
      description: params.description,
      relatedProductId: params.relatedProductId,
      relatedOrderId: params.relatedOrderId,
      metadata: params.metadata,
      status: "completed",
    });

    // Update wallet balance
    await db.update(sakWallets)
      .set({
        balance: sql`${sakWallets.balance} - ${params.amount}`,
        totalSpent: sql`${sakWallets.totalSpent} + ${params.amount}`,
      })
      .where(eq(sakWallets.id, wallet.id));

    return transaction;
  }

  /**
   * Transfer SAK between users
   */
  static async transferTokens(params: {
    fromUserId: number;
    toUserId: number;
    amount: number;
    description: string;
    metadata?: Record<string, any>;
  }) {
    const db = getDb();
    
    const fromWallet = await this.getWalletByUserId(params.fromUserId);
    const toWallet = await this.getOrCreateWallet(params.toUserId);

    if (!fromWallet) {
      throw new Error("Sender wallet not found");
    }

    // Check balance
    const balance = parseFloat(fromWallet.balance);
    if (balance < params.amount) {
      throw new Error("Insufficient SAK balance");
    }

    // Create transaction
    const [transaction] = await db.insert(sakTransactions).values({
      fromWalletId: fromWallet.id,
      toWalletId: toWallet.id,
      amount: params.amount.toString(),
      type: "transfer",
      category: "p2p_transfer",
      description: params.description,
      metadata: params.metadata,
      status: "completed",
    });

    // Update sender balance
    await db.update(sakWallets)
      .set({
        balance: sql`${sakWallets.balance} - ${params.amount}`,
        totalSpent: sql`${sakWallets.totalSpent} + ${params.amount}`,
      })
      .where(eq(sakWallets.id, fromWallet.id));

    // Update receiver balance
    await db.update(sakWallets)
      .set({
        balance: sql`${sakWallets.balance} + ${params.amount}`,
        totalEarned: sql`${sakWallets.totalEarned} + ${params.amount}`,
      })
      .where(eq(sakWallets.id, toWallet.id));

    return transaction;
  }

  /**
   * Stake SAK tokens
   */
  static async stakeTokens(params: {
    userId: number;
    amount: number;
    stakingPeriodDays: number;
    rewardRate: number;
  }) {
    const db = getDb();
    
    const wallet = await this.getWalletByUserId(params.userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Check balance
    const balance = parseFloat(wallet.balance);
    if (balance < params.amount) {
      throw new Error("Insufficient SAK balance");
    }

    // Create staking record
    const [staking] = await db.insert(sakStaking).values({
      walletId: wallet.id,
      stakedAmount: params.amount.toString(),
      stakingPeriod: params.stakingPeriodDays,
      rewardRate: params.rewardRate.toString(),
      status: "active",
    });

    // Deduct from wallet balance
    await db.update(sakWallets)
      .set({
        balance: sql`${sakWallets.balance} - ${params.amount}`,
      })
      .where(eq(sakWallets.id, wallet.id));

    // Create transaction record
    await db.insert(sakTransactions).values({
      fromWalletId: wallet.id,
      amount: params.amount.toString(),
      type: "stake",
      category: "staking",
      description: `Staked ${params.amount} SAK for ${params.stakingPeriodDays} days`,
      status: "completed",
    });

    return staking;
  }

  /**
   * Get transaction history for a user
   */
  static async getTransactionHistory(userId: number, limit = 50) {
    const db = getDb();
    
    const wallet = await this.getWalletByUserId(userId);

    if (!wallet) {
      return [];
    }

    const transactions = await db.select()
      .from(sakTransactions)
      .where(
        sql`${sakTransactions.fromWalletId} = ${wallet.id} OR ${sakTransactions.toWalletId} = ${wallet.id}`
      )
      .orderBy(sql`${sakTransactions.createdAt} DESC`)
      .limit(limit);

    return transactions;
  }

  /**
   * Calculate SAK rewards for different actions
   */
  static calculateReward(action: string, metadata?: Record<string, any>): number {
    const rewardRates: Record<string, number> = {
      // Listing rewards
      "listing_basic": 5,
      "listing_detailed": 10,
      "listing_premium": 20,
      
      // Purchase rewards (cashback)
      "purchase_cashback": 0.02, // 2% of purchase value
      
      // Repair & Care rewards
      "repair": 50,
      "upcycle": 100,
      "alteration": 30,
      "cleaning": 10,
      
      // Community engagement
      "review": 5,
      "helpful_review": 15,
      "referral": 100,
      "forum_post": 2,
      "helpful_answer": 10,
      
      // Milestone rewards
      "first_listing": 50,
      "first_purchase": 25,
      "verified_seller": 100,
    };

    let baseReward = rewardRates[action] || 0;

    // Apply multipliers based on metadata
    if (metadata?.isQualityListing) {
      baseReward *= 1.5;
    }

    if (metadata?.purchaseValue) {
      baseReward = metadata.purchaseValue * rewardRates["purchase_cashback"];
    }

    return Math.floor(baseReward);
  }
}
