import { eq, and, desc, sql, gte, lte, inArray, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  sevaWallets, InsertSevaWallet, sevaTransactions, InsertSevaTransaction,
  categories, InsertCategory,
  products, InsertProduct,
  carts, InsertCart, cartItems, InsertCartItem,
  orders, InsertOrder, orderItems, InsertOrderItem,
  donations, InsertDonation,
  volunteerShifts, InsertVolunteerShift,
  events, InsertEvent, eventRegistrations, InsertEventRegistration,
  impactMetrics, InsertImpactMetric
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER MANAGEMENT ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone", "avatarUrl", "languagePreference"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== SEVA WALLET ====================

export async function getOrCreateSevaWallet(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const existing = await db.select().from(sevaWallets).where(eq(sevaWallets.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];

  const newWallet: InsertSevaWallet = { userId, balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 };
  await db.insert(sevaWallets).values(newWallet);
  
  const created = await db.select().from(sevaWallets).where(eq(sevaWallets.userId, userId)).limit(1);
  return created[0];
}

export async function addSevaTokens(userId: number, amount: number, description: string, relatedEntityType?: string, relatedEntityId?: number) {
  const db = await getDb();
  if (!db) return null;

  const wallet = await getOrCreateSevaWallet(userId);
  if (!wallet) return null;

  await db.update(sevaWallets)
    .set({ 
      balance: wallet.balance + amount,
      lifetimeEarned: wallet.lifetimeEarned + amount,
      updatedAt: new Date()
    })
    .where(eq(sevaWallets.id, wallet.id));

  const transaction: InsertSevaTransaction = {
    walletId: wallet.id,
    type: 'earn',
    amount,
    description,
    relatedEntityType,
    relatedEntityId
  };
  await db.insert(sevaTransactions).values(transaction);

  return await getOrCreateSevaWallet(userId);
}

export async function spendSevaTokens(userId: number, amount: number, description: string, relatedEntityType?: string, relatedEntityId?: number) {
  const db = await getDb();
  if (!db) return null;

  const wallet = await getOrCreateSevaWallet(userId);
  if (!wallet || wallet.balance < amount) return null;

  await db.update(sevaWallets)
    .set({ 
      balance: wallet.balance - amount,
      lifetimeSpent: wallet.lifetimeSpent + amount,
      updatedAt: new Date()
    })
    .where(eq(sevaWallets.id, wallet.id));

  const transaction: InsertSevaTransaction = {
    walletId: wallet.id,
    type: 'spend',
    amount,
    description,
    relatedEntityType,
    relatedEntityId
  };
  await db.insert(sevaTransactions).values(transaction);

  return await getOrCreateSevaWallet(userId);
}

export async function getSevaTransactions(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  const wallet = await getOrCreateSevaWallet(userId);
  if (!wallet) return [];

  return await db.select()
    .from(sevaTransactions)
    .where(eq(sevaTransactions.walletId, wallet.id))
    .orderBy(desc(sevaTransactions.createdAt))
    .limit(limit);
}

// ==================== CATEGORIES ====================

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.displayOrder);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ==================== PRODUCTS ====================

export async function getProducts(filters?: {
  categoryId?: number;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  search?: string;
  isFeatured?: boolean;
  isChildrenFree?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(products);
  const conditions = [];

  if (filters?.categoryId) conditions.push(eq(products.categoryId, filters.categoryId));
  if (filters?.condition) conditions.push(eq(products.condition, filters.condition as any));
  if (filters?.status) conditions.push(eq(products.status, filters.status as any));
  if (filters?.isFeatured !== undefined) conditions.push(eq(products.isFeatured, filters.isFeatured));
  if (filters?.isChildrenFree !== undefined) conditions.push(eq(products.isChildrenFree, filters.isChildrenFree));
  
  if (filters?.minPrice) conditions.push(gte(products.suggestedPrice, filters.minPrice));
  if (filters?.maxPrice) conditions.push(lte(products.suggestedPrice, filters.maxPrice));
  
  if (filters?.search) {
    conditions.push(
      or(
        like(products.name, `%${filters.search}%`),
        like(products.description, `%${filters.search}%`),
        like(products.story, `%${filters.search}%`)
      )!
    );
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }

  query = query.orderBy(desc(products.createdAt)) as any;

  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  if (filters?.offset) {
    query = query.offset(filters.offset) as any;
  }

  return await query;
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function incrementProductViews(productId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(products)
    .set({ viewCount: sql`${products.viewCount} + 1` })
    .where(eq(products.id, productId));
}

export async function updateProductStatus(productId: number, status: 'available' | 'sold' | 'reserved' | 'donated_out') {
  const db = await getDb();
  if (!db) return null;
  await db.update(products).set({ status, updatedAt: new Date() }).where(eq(products.id, productId));
  return await getProductById(productId);
}

// ==================== CART ====================

export async function getOrCreateCart(userId?: number, sessionId?: string) {
  const db = await getDb();
  if (!db) return null;

  let existing;
  if (userId) {
    existing = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
  } else if (sessionId) {
    existing = await db.select().from(carts).where(eq(carts.sessionId, sessionId)).limit(1);
  }

  if (existing && existing.length > 0) return existing[0];

  const newCart: InsertCart = { userId, sessionId };
  await db.insert(carts).values(newCart);

  if (userId) {
    existing = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
  } else if (sessionId) {
    existing = await db.select().from(carts).where(eq(carts.sessionId, sessionId)).limit(1);
  }
  return existing && existing.length > 0 ? existing[0] : null;
}

export async function getCartItems(cartId: number) {
  const db = await getDb();
  if (!db) return [];

  const items = await db.select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cartId));

  const itemsWithProducts = await Promise.all(
    items.map(async (item) => {
      const product = await getProductById(item.productId);
      return { ...item, product };
    })
  );

  return itemsWithProducts;
}

export async function addToCart(cartId: number, productId: number, paymentMethod?: 'money' | 'seva_tokens' | 'free', selectedPrice?: number) {
  const db = await getDb();
  if (!db) return null;

  const item: InsertCartItem = {
    cartId,
    productId,
    selectedPaymentMethod: paymentMethod,
    selectedPrice
  };

  await db.insert(cartItems).values(item);
  return await getCartItems(cartId);
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function clearCart(cartId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

// ==================== ORDERS ====================

export async function createOrder(orderData: InsertOrder, items: { productId: number; paymentMethod: 'money' | 'seva_tokens' | 'free'; pricePaid: number; tokensPaid: number }[]) {
  const db = await getDb();
  if (!db) return null;

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const order: InsertOrder = { ...orderData, orderNumber };

  const result = await db.insert(orders).values(order);
  const orderId = Number(result[0].insertId);

  for (const item of items) {
    const product = await getProductById(item.productId);
    if (!product) continue;

    const orderItem: InsertOrderItem = {
      orderId,
      productId: item.productId,
      productName: product.name,
      paymentMethod: item.paymentMethod,
      pricePaid: item.pricePaid,
      tokensPaid: item.tokensPaid
    };

    await db.insert(orderItems).values(orderItem);
    await updateProductStatus(item.productId, 'sold');
  }

  return await getOrderById(orderId);
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (result.length === 0) return null;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { ...result[0], items };
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

// ==================== DONATIONS ====================

export async function createDonation(donation: InsertDonation) {
  const db = await getDb();
  if (!db) return null;

  const receiptNumber = `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const data: InsertDonation = { ...donation, receiptNumber };

  await db.insert(donations).values(data);
  const result = await db.select().from(donations).where(eq(donations.receiptNumber, receiptNumber)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getDonations(status?: string) {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return await db.select().from(donations).where(eq(donations.status, status as any)).orderBy(desc(donations.createdAt));
  }
  return await db.select().from(donations).orderBy(desc(donations.createdAt));
}

// ==================== VOLUNTEER SHIFTS ====================

export async function createVolunteerShift(shift: InsertVolunteerShift) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(volunteerShifts).values(shift);
  return shift;
}

export async function getUserVolunteerShifts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(volunteerShifts).where(eq(volunteerShifts.userId, userId)).orderBy(desc(volunteerShifts.shiftDate));
}

export async function completeVolunteerShift(shiftId: number, verifiedBy: number) {
  const db = await getDb();
  if (!db) return null;

  const shift = await db.select().from(volunteerShifts).where(eq(volunteerShifts.id, shiftId)).limit(1);
  if (shift.length === 0) return null;

  await db.update(volunteerShifts)
    .set({ status: 'completed', verifiedBy, verifiedAt: new Date() })
    .where(eq(volunteerShifts.id, shiftId));

  await addSevaTokens(shift[0].userId, shift[0].tokensEarned, `Volunteer shift: ${shift[0].shiftType}`, 'volunteer_shift', shiftId);

  return shift[0];
}

// ==================== EVENTS ====================

export async function getEvents(type?: string, activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (type) conditions.push(eq(events.type, type as any));
  if (activeOnly) conditions.push(eq(events.isActive, true));

  let query = db.select().from(events);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }

  return await query.orderBy(events.eventDate);
}

export async function getEventBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function registerForEvent(eventId: number, userId?: number, guestInfo?: { name: string; email: string; phone?: string }) {
  const db = await getDb();
  if (!db) return null;

  const registration: InsertEventRegistration = {
    eventId,
    userId,
    guestName: guestInfo?.name,
    guestEmail: guestInfo?.email,
    guestPhone: guestInfo?.phone
  };

  await db.insert(eventRegistrations).values(registration);

  await db.update(events)
    .set({ currentParticipants: sql`${events.currentParticipants} + 1` })
    .where(eq(events.id, eventId));

  return registration;
}

// ==================== IMPACT METRICS ====================

export async function getLatestImpactMetrics() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(impactMetrics).orderBy(desc(impactMetrics.metricDate)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getTotalImpactMetrics() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select({
    totalItemsDiverted: sql<number>`SUM(${impactMetrics.itemsDiverted})`,
    totalCo2Prevented: sql<number>`SUM(${impactMetrics.co2Prevented})`,
    totalWaterSaved: sql<number>`SUM(${impactMetrics.waterSaved})`,
    totalFamiliesServed: sql<number>`SUM(${impactMetrics.familiesServed})`,
    totalFreeItemsGiven: sql<number>`SUM(${impactMetrics.freeItemsGiven})`,
    totalChildrenItemsFree: sql<number>`SUM(${impactMetrics.childrenItemsFree})`,
    totalRevenueGenerated: sql<number>`SUM(${impactMetrics.revenueGenerated})`,
    totalTokensCirculated: sql<number>`SUM(${impactMetrics.tokensCirculated})`,
    totalVolunteerHours: sql<number>`SUM(${impactMetrics.volunteerHours})`
  }).from(impactMetrics);

  return result[0];
}

// ==================== SAKSHI CAFÉS ====================

export async function getAllCafes() {
  const db = await getDb();
  if (!db) return [];
  
  const { cafes } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  return await db.select().from(cafes).where(eq(cafes.status, "open"));
}

export async function getCafeBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const { cafes } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const result = await db.select().from(cafes).where(eq(cafes.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCafeMenu(cafeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { cafeMenuItems } = await import("../drizzle/schema");
  const { eq, or, isNull, and } = await import("drizzle-orm");
  
  // Get items for this specific café OR items available at all cafés (cafeId is NULL)
  return await db.select().from(cafeMenuItems)
    .where(
      and(
        or(
          eq(cafeMenuItems.cafeId, cafeId),
          isNull(cafeMenuItems.cafeId)
        ),
        eq(cafeMenuItems.isActive, true)
      )
    )
    .orderBy(cafeMenuItems.displayOrder, cafeMenuItems.category);
}

export async function getCafeMembers(cafeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { cafeMembers } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");
  
  return await db.select().from(cafeMembers)
    .where(
      and(
        eq(cafeMembers.cafeId, cafeId),
        eq(cafeMembers.status, "active")
      )
    );
}

export async function createCafeApplication(data: {
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  city: string;
  experience?: string;
  motivation: string;
  availability: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { cafeApplications } = await import("../drizzle/schema");
  
  await db.insert(cafeApplications).values({
    fullName: data.fullName,
    age: data.age,
    phone: data.phone,
    email: data.email || null,
    city: data.city,
    experience: data.experience || null,
    motivation: data.motivation,
    availability: data.availability,
    status: "pending",
  });
  
  return { success: true };
}
