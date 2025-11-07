import { mysqlTable, varchar, text, int, decimal, timestamp, boolean, json } from "drizzle-orm/mysql-core";

// Digital Product Passports (DPPs)
export const digitalProductPassports = mysqlTable("digital_product_passports", {
  id: int("id").primaryKey().autoincrement(),
  productId: int("product_id").notNull(), // References products table
  nftTokenId: varchar("nft_token_id", { length: 255 }).unique(),
  nftContractAddress: varchar("nft_contract_address", { length: 255 }),
  blockchainNetwork: varchar("blockchain_network", { length: 50 }).default("polygon"),
  
  // Provenance Data
  originalBrand: varchar("original_brand", { length: 255 }),
  materialComposition: text("material_composition"),
  manufacturingDate: varchar("manufacturing_date", { length: 100 }),
  countryOfOrigin: varchar("country_of_origin", { length: 100 }),
  
  // Ownership & Transaction History (stored as JSON array)
  ownershipHistory: json("ownership_history").$type<Array<{
    ownerId: number;
    acquiredAt: string;
    soldAt?: string;
    price?: number;
    currency?: string;
  }>>(),
  
  // Care & Repair Log (stored as JSON array)
  careRepairLog: json("care_repair_log").$type<Array<{
    date: string;
    type: "repair" | "alteration" | "upcycle" | "cleaning";
    description: string;
    performedBy?: string;
    sakEarned?: number;
  }>>(),
  
  // Impact Score
  impactScore: decimal("impact_score", { precision: 10, scale: 2 }).default("0"),
  co2Saved: decimal("co2_saved_kg", { precision: 10, scale: 2 }).default("0"),
  waterSaved: decimal("water_saved_liters", { precision: 10, scale: 2 }).default("0"),
  
  // Metadata
  metadataUri: varchar("metadata_uri", { length: 500 }),
  isMinted: boolean("is_minted").default(false),
  mintedAt: timestamp("minted_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// SakshiCoin Wallets
export const sakWallets = mysqlTable("sak_wallets", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().unique(), // References users table
  walletAddress: varchar("wallet_address", { length: 255 }).unique(),
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0"),
  
  // Lifetime Stats
  totalEarned: decimal("total_earned", { precision: 20, scale: 8 }).default("0"),
  totalSpent: decimal("total_spent", { precision: 20, scale: 8 }).default("0"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// SakshiCoin Transactions
export const sakTransactions = mysqlTable("sak_transactions", {
  id: int("id").primaryKey().autoincrement(),
  transactionHash: varchar("transaction_hash", { length: 255 }).unique(),
  
  fromWalletId: int("from_wallet_id"), // References sak_wallets
  toWalletId: int("to_wallet_id"), // References sak_wallets
  
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  
  type: varchar("type", { length: 50 }).notNull(), // "earn", "spend", "transfer", "stake", "reward"
  category: varchar("category", { length: 100 }), // "listing", "purchase", "repair", "review", "referral", etc.
  
  // Related entities
  relatedProductId: int("related_product_id"),
  relatedOrderId: int("related_order_id"),
  
  description: text("description"),
  metadata: json("metadata").$type<Record<string, any>>(),
  
  status: varchar("status", { length: 50 }).default("completed"), // "pending", "completed", "failed"
  
  createdAt: timestamp("created_at").defaultNow(),
});

// SakshiCoin Staking
export const sakStaking = mysqlTable("sak_staking", {
  id: int("id").primaryKey().autoincrement(),
  walletId: int("wallet_id").notNull(), // References sak_wallets
  
  stakedAmount: decimal("staked_amount", { precision: 20, scale: 8 }).notNull(),
  stakingPeriod: int("staking_period_days").notNull(), // Duration in days
  
  rewardRate: decimal("reward_rate", { precision: 5, scale: 2 }).notNull(), // APY percentage
  earnedRewards: decimal("earned_rewards", { precision: 20, scale: 8 }).default("0"),
  
  status: varchar("status", { length: 50 }).default("active"), // "active", "completed", "withdrawn"
  
  stakedAt: timestamp("staked_at").defaultNow(),
  unstakedAt: timestamp("unstaked_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Governance Proposals
export const governanceProposals = mysqlTable("governance_proposals", {
  id: int("id").primaryKey().autoincrement(),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  
  proposedBy: int("proposed_by").notNull(), // References users table
  
  proposalType: varchar("proposal_type", { length: 50 }).notNull(), // "charity", "feature", "policy", "other"
  
  votingStartsAt: timestamp("voting_starts_at").notNull(),
  votingEndsAt: timestamp("voting_ends_at").notNull(),
  
  votesFor: decimal("votes_for", { precision: 20, scale: 8 }).default("0"),
  votesAgainst: decimal("votes_against", { precision: 20, scale: 8 }).default("0"),
  
  status: varchar("status", { length: 50 }).default("active"), // "active", "passed", "rejected", "executed"
  
  executedAt: timestamp("executed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Governance Votes
export const governanceVotes = mysqlTable("governance_votes", {
  id: int("id").primaryKey().autoincrement(),
  
  proposalId: int("proposal_id").notNull(), // References governance_proposals
  voterId: int("voter_id").notNull(), // References users table
  walletId: int("wallet_id").notNull(), // References sak_wallets
  
  voteWeight: decimal("vote_weight", { precision: 20, scale: 8 }).notNull(), // Amount of SAK used to vote
  voteChoice: varchar("vote_choice", { length: 20 }).notNull(), // "for", "against"
  
  votedAt: timestamp("voted_at").defaultNow(),
});
