/**
 * AI-Powered Personalized Recommendations Service
 * 
 * Uses collaborative filtering + content-based filtering to:
 * - Recommend products based on user behavior
 * - Find similar products
 * - Personalize homepage
 * - Generate email recommendations
 * 
 * Expected Impact: 30% increase in average order value
 */

import { spawn } from 'child_process';
import path from 'path';
import * as db from '../db';
import { products, orders, orderItems, users } from '@db/schema';
import { sql, eq, desc, and, gte } from 'drizzle-orm';
import { cache } from './cache/redis';

interface UserInteraction {
  userId: number;
  productId: number;
  score: number; // 1-5 scale
}

interface ProductFeatures {
  id: number;
  category: string;
  condition: string;
  price: number;
}

interface Recommendation {
  productId: number;
  score: number;
  reason: string;
  product?: any;
}

export class RecommendationService {
  private pythonScriptPath: string;
  private modelTrained: boolean = false;

  constructor() {
    this.pythonScriptPath = path.join(__dirname, '../../ml-models/recommendation-engine.py');
  }

  /**
   * Get personalized recommendations for a user
   */
  async getRecommendationsForUser(
    userId: number,
    limit: number = 10
  ): Promise<Recommendation[]> {
    try {
      // Check cache first
      const cacheKey = `recommendations:user:${userId}:${limit}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Collect user interactions
      const interactions = await this.collectUserInteractions();
      
      // Get product features
      const productFeatures = await this.getProductFeatures();

      // Get recommendations from Python
      const result = await this.runPythonScript('recommend', [
        JSON.stringify(interactions),
        JSON.stringify(productFeatures),
        userId.toString(),
        limit.toString(),
      ]);

      if (!result.success) {
        throw new Error(result.error || 'Failed to get recommendations');
      }

      // Enrich with product data and reasons
      const recommendations = await this.enrichRecommendations(
        result.recommendations,
        userId
      );

      // Cache for 1 hour
      await cache.set(cacheKey, JSON.stringify(recommendations), 3600);

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Fallback to popular products
      return this.getPopularProducts(limit);
    }
  }

  /**
   * Get similar products for a product
   */
  async getSimilarProducts(
    productId: number,
    limit: number = 6
  ): Promise<Recommendation[]> {
    try {
      // Check cache
      const cacheKey = `recommendations:similar:${productId}:${limit}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Get product features
      const productFeatures = await this.getProductFeatures();

      // Get similar products from Python
      const result = await this.runPythonScript('similar_products', [
        JSON.stringify(productFeatures),
        productId.toString(),
        limit.toString(),
      ]);

      if (!result.success) {
        throw new Error(result.error || 'Failed to get similar products');
      }

      // Enrich with product data
      const recommendations = await this.enrichSimilarProducts(
        result.similar_products
      );

      // Cache for 24 hours (similar products don't change often)
      await cache.set(cacheKey, JSON.stringify(recommendations), 86400);

      return recommendations;
    } catch (error) {
      console.error('Error getting similar products:', error);
      return [];
    }
  }

  /**
   * Get popular/trending products
   */
  async getPopularProducts(limit: number = 10): Promise<Recommendation[]> {
    try {
      // Check cache
      const cacheKey = `recommendations:popular:${limit}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const interactions = await this.collectUserInteractions();

      const result = await this.runPythonScript('popular', [
        JSON.stringify(interactions),
        limit.toString(),
      ]);

      if (!result.success) {
        // Fallback to recent products
        return this.getRecentProducts(limit);
      }

      const recommendations = await this.enrichPopularProducts(
        result.popular_items
      );

      // Cache for 6 hours
      await cache.set(cacheKey, JSON.stringify(recommendations), 21600);

      return recommendations;
    } catch (error) {
      console.error('Error getting popular products:', error);
      return this.getRecentProducts(limit);
    }
  }

  /**
   * Get personalized homepage recommendations
   */
  async getHomepageRecommendations(
    userId: number | null
  ): Promise<{
    forYou: Recommendation[];
    trending: Recommendation[];
    newArrivals: Recommendation[];
  }> {
    try {
      const [forYou, trending, newArrivals] = await Promise.all([
        userId
          ? this.getRecommendationsForUser(userId, 8)
          : this.getPopularProducts(8),
        this.getPopularProducts(8),
        this.getRecentProducts(8),
      ]);

      return {
        forYou,
        trending,
        newArrivals,
      };
    } catch (error) {
      console.error('Error getting homepage recommendations:', error);
      return {
        forYou: [],
        trending: [],
        newArrivals: [],
      };
    }
  }

  /**
   * Collect user interactions for training
   */
  private async collectUserInteractions(): Promise<UserInteraction[]> {
    const database = await db.getDb();
    if (!database) {
      return [];
    }

    // Get purchase interactions (highest weight)
    const purchases = await database
      .select({
        userId: orders.userId,
        productId: orderItems.productId,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.status, 'completed'));

    const interactions: UserInteraction[] = purchases.map((p) => ({
      userId: p.userId,
      productId: p.productId,
      score: 5, // Purchase = highest score
    }));

    // Could add view interactions, cart additions, etc. with lower scores

    return interactions;
  }

  /**
   * Get product features for content-based filtering
   */
  private async getProductFeatures(): Promise<ProductFeatures[]> {
    const database = await db.getDb();
    if (!database) {
      return [];
    }

    const allProducts = await database
      .select({
        id: products.id,
        category: products.category,
        condition: products.condition,
        price: products.price,
      })
      .from(products);

    return allProducts;
  }

  /**
   * Enrich recommendations with product data and reasons
   */
  private async enrichRecommendations(
    recommendations: Array<[number, number]>,
    userId: number
  ): Promise<Recommendation[]> {
    const enriched: Recommendation[] = [];

    for (const [productId, score] of recommendations) {
      try {
        const product = await db.getProductById(productId);
        if (product) {
          enriched.push({
            productId,
            score,
            reason: this.generateRecommendationReason(score, userId),
            product,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch product ${productId}:`, error);
      }
    }

    return enriched;
  }

  /**
   * Enrich similar products
   */
  private async enrichSimilarProducts(
    similarProducts: Array<[number, number]>
  ): Promise<Recommendation[]> {
    const enriched: Recommendation[] = [];

    for (const [productId, similarity] of similarProducts) {
      try {
        const product = await db.getProductById(productId);
        if (product) {
          enriched.push({
            productId,
            score: similarity,
            reason: `${(similarity * 100).toFixed(0)}% similar`,
            product,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch product ${productId}:`, error);
      }
    }

    return enriched;
  }

  /**
   * Enrich popular products
   */
  private async enrichPopularProducts(
    popularItems: Array<[number, number]>
  ): Promise<Recommendation[]> {
    const enriched: Recommendation[] = [];

    for (const [productId, popularity] of popularItems) {
      try {
        const product = await db.getProductById(productId);
        if (product) {
          enriched.push({
            productId,
            score: popularity,
            reason: 'Trending now',
            product,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch product ${productId}:`, error);
      }
    }

    return enriched;
  }

  /**
   * Generate recommendation reason
   */
  private generateRecommendationReason(score: number, userId: number): string {
    if (score > 0.8) {
      return 'Perfect match for you';
    } else if (score > 0.6) {
      return 'Based on your preferences';
    } else if (score > 0.4) {
      return 'You might like this';
    } else {
      return 'Recommended for you';
    }
  }

  /**
   * Get recent products (fallback)
   */
  private async getRecentProducts(limit: number): Promise<Recommendation[]> {
    const database = await db.getDb();
    if (!database) {
      return [];
    }

    const recentProducts = await database
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return recentProducts.map((product) => ({
      productId: product.id,
      score: 1.0,
      reason: 'New arrival',
      product,
    }));
  }

  /**
   * Run Python recommendation script
   */
  private runPythonScript(command: string, args: string[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const python = spawn('python3', [
        this.pythonScriptPath,
        command,
        ...args,
      ]);

      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${errorOutput}`));
        } else {
          try {
            resolve(JSON.parse(output));
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${output}`));
          }
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        python.kill();
        reject(new Error('Python script timeout'));
      }, 30000);
    });
  }

  /**
   * Clear recommendation cache
   */
  async clearCache(): Promise<void> {
    await cache.delPattern('recommendations:*');
  }

  /**
   * Get recommendation statistics
   */
  async getStatistics(): Promise<{
    totalUsers: number;
    totalProducts: number;
    totalInteractions: number;
    cacheSize: number;
  }> {
    const database = await db.getDb();
    if (!database) {
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalInteractions: 0,
        cacheSize: 0,
      };
    }

    const [usersCount, productsCount, interactionsCount] = await Promise.all([
      database.select({ count: sql<number>`COUNT(*)` }).from(users),
      database.select({ count: sql<number>`COUNT(*)` }).from(products),
      database.select({ count: sql<number>`COUNT(*)` }).from(orderItems),
    ]);

    return {
      totalUsers: usersCount[0]?.count || 0,
      totalProducts: productsCount[0]?.count || 0,
      totalInteractions: interactionsCount[0]?.count || 0,
      cacheSize: 0, // Would need to query Redis for actual size
    };
  }
}

// Export singleton instance
export const recommendationService = new RecommendationService();
