import { db } from "@db";
import { cache } from "../cache/redis";

/**
 * Database query optimization utilities
 */

// Batch loading utility
export class DataLoader<T> {
  private batch: Array<{ id: number; resolve: (value: T | null) => void }> = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private batchDelay = 10; // ms

  constructor(
    private loadFn: (ids: number[]) => Promise<T[]>,
    private idKey: keyof T = 'id' as keyof T
  ) {}

  async load(id: number): Promise<T | null> {
    return new Promise((resolve) => {
      this.batch.push({ id, resolve });

      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      this.batchTimeout = setTimeout(() => {
        this.executeBatch();
      }, this.batchDelay);
    });
  }

  private async executeBatch() {
    const currentBatch = this.batch;
    this.batch = [];
    this.batchTimeout = null;

    const ids = currentBatch.map((item) => item.id);
    const uniqueIds = [...new Set(ids)];

    try {
      const results = await this.loadFn(uniqueIds);
      const resultMap = new Map(
        results.map((item) => [item[this.idKey] as number, item])
      );

      currentBatch.forEach(({ id, resolve }) => {
        resolve(resultMap.get(id) || null);
      });
    } catch (error) {
      console.error('Batch load error:', error);
      currentBatch.forEach(({ resolve }) => resolve(null));
    }
  }
}

// Query result caching
export async function cachedQuery<T>(
  cacheKey: string,
  ttl: number,
  queryFn: () => Promise<T>
): Promise<T> {
  return cache.remember(cacheKey, ttl, queryFn);
}

// Pagination helper
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function paginate<T>(
  query: any,
  countQuery: any,
  params: PaginationParams
): Promise<PaginatedResult<T>> {
  const { page, pageSize } = params;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    query.limit(pageSize).offset(offset),
    countQuery,
  ]);

  const total = Array.isArray(countResult) ? countResult.length : countResult[0]?.count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Index suggestions based on common queries
export const indexSuggestions = {
  products: [
    'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
    'CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)',
    'CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition)',
    'CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)',
    'CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC)',
  ],
  orders: [
    'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
    'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status)',
  ],
  reviews: [
    'CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id)',
    'CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)',
    'CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC)',
  ],
  seva_transactions: [
    'CREATE INDEX IF NOT EXISTS idx_seva_user_id ON seva_transactions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_seva_type ON seva_transactions(type)',
    'CREATE INDEX IF NOT EXISTS idx_seva_created_at ON seva_transactions(created_at DESC)',
  ],
};

// Query performance monitoring
export class QueryMonitor {
  private slowQueryThreshold = 1000; // ms

  async monitor<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;

      if (duration > this.slowQueryThreshold) {
        console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
      }

      return result;
    } catch (error) {
      console.error(`Query error in ${queryName}:`, error);
      throw error;
    }
  }
}

export const queryMonitor = new QueryMonitor();

// Connection pool optimization
export const poolConfig = {
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Bulk insert helper
export async function bulkInsert<T>(
  table: any,
  records: T[],
  batchSize: number = 100
): Promise<void> {
  const batches = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await table.insert(batch);
  }
}

// Query result streaming for large datasets
export async function* streamResults<T>(
  query: any,
  batchSize: number = 100
): AsyncGenerator<T[], void, unknown> {
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const batch = await query.limit(batchSize).offset(offset);
    
    if (batch.length === 0) {
      hasMore = false;
    } else {
      yield batch;
      offset += batchSize;
      
      if (batch.length < batchSize) {
        hasMore = false;
      }
    }
  }
}

// Cache invalidation patterns
export const cacheInvalidation = {
  async invalidateProduct(productId: number) {
    await Promise.all([
      cache.del(cache.keys.product(productId)),
      cache.delPattern('products:*'),
      cache.delPattern(`reviews:product:${productId}`),
    ]);
  },

  async invalidateUser(userId: number) {
    await Promise.all([
      cache.del(cache.keys.user(userId)),
      cache.del(cache.keys.sevaWallet(userId)),
      cache.del(cache.keys.sevaTransactions(userId)),
      cache.delPattern(`orders:user:${userId}`),
    ]);
  },

  async invalidateOrder(orderId: number, userId: number) {
    await Promise.all([
      cache.del(cache.keys.order(orderId)),
      cache.delPattern(`orders:user:${userId}`),
      cache.delPattern('stats:*'),
    ]);
  },

  async invalidateStats() {
    await cache.delPattern('stats:*');
  },
};
