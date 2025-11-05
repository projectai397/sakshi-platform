import Redis from 'ioredis';

class CacheService {
  private client: Redis | null = null;
  private isEnabled: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      console.log('Redis not configured, caching disabled');
      return;
    }

    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.isEnabled = true;
      });

      this.client.on('error', (err) => {
        console.error('Redis error:', err);
        this.isEnabled = false;
      });
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.isEnabled = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled || !this.client) return null;

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<boolean> {
    if (!this.isEnabled || !this.client) return false;

    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isEnabled || !this.client) return false;

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async delPattern(pattern: string): Promise<number> {
    if (!this.isEnabled || !this.client) return 0;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;
      
      await this.client.del(...keys);
      return keys.length;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isEnabled || !this.client) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.isEnabled || !this.client) return -1;

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -1;
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    if (!this.isEnabled || !this.client) return 0;

    try {
      return await this.client.incrby(key, amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  async decrement(key: string, amount: number = 1): Promise<number> {
    if (!this.isEnabled || !this.client) return 0;

    try {
      return await this.client.decrby(key, amount);
    } catch (error) {
      console.error('Cache decrement error:', error);
      return 0;
    }
  }

  // Cache with function execution
  async remember<T>(
    key: string,
    ttlSeconds: number,
    fn: () => Promise<T>
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn();
    await this.set(key, result, ttlSeconds);
    return result;
  }

  // Cache key generators
  keys = {
    product: (id: number) => `product:${id}`,
    products: (filters: string) => `products:${filters}`,
    user: (id: number) => `user:${id}`,
    order: (id: number) => `order:${id}`,
    orders: (userId: number) => `orders:user:${userId}`,
    sevaWallet: (userId: number) => `seva:wallet:${userId}`,
    sevaTransactions: (userId: number) => `seva:transactions:${userId}`,
    reviews: (productId: number) => `reviews:product:${productId}`,
    stats: (type: string) => `stats:${type}`,
    search: (query: string) => `search:${query}`,
  };

  // Cache TTLs (in seconds)
  ttl = {
    short: 300, // 5 minutes
    medium: 1800, // 30 minutes
    long: 3600, // 1 hour
    day: 86400, // 24 hours
    week: 604800, // 7 days
  };

  async clearAll(): Promise<boolean> {
    if (!this.isEnabled || !this.client) return false;

    try {
      await this.client.flushdb();
      return true;
    } catch (error) {
      console.error('Cache clear all error:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isEnabled = false;
    }
  }
}

export const cache = new CacheService();
