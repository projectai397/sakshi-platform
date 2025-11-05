/**
 * AI-Powered Visual Search Service
 * 
 * Uses OpenAI CLIP model to:
 * - Generate image embeddings
 * - Find visually similar products
 * - Support reverse image search
 * - Enable text-to-image search
 * 
 * Expected Impact: 40% increase in product discovery
 */

import { spawn } from 'child_process';
import path from 'path';
import * as db from '../db';
import { products } from '@db/schema';
import { sql } from 'drizzle-orm';
import { cache } from './cache/redis';
import fs from 'fs/promises';

interface ImageEmbedding {
  productId: number;
  embedding: number[];
  imageUrl: string;
  createdAt: Date;
}

interface SimilarProduct {
  productId: number;
  similarity: number;
  product?: any;
}

interface VisualSearchResult {
  results: SimilarProduct[];
  queryTime: number;
  totalProducts: number;
}

export class VisualSearchService {
  private pythonScriptPath: string;
  private embeddingsCache: Map<number, number[]> = new Map();

  constructor() {
    this.pythonScriptPath = path.join(__dirname, '../../ml-models/visual-search-clip.py');
  }

  /**
   * Generate embedding for an uploaded image
   */
  async generateImageEmbedding(imagePath: string): Promise<number[]> {
    try {
      const result = await this.runPythonScript('encode_image', [imagePath]);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate embedding');
      }

      return result.embedding;
    } catch (error) {
      console.error('Error generating image embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for text query
   */
  async generateTextEmbedding(text: string): Promise<number[]> {
    try {
      const result = await this.runPythonScript('encode_text', [text]);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate text embedding');
      }

      return result.embedding;
    } catch (error) {
      console.error('Error generating text embedding:', error);
      throw error;
    }
  }

  /**
   * Search for similar products using an uploaded image
   */
  async searchByImage(
    imagePath: string,
    limit: number = 10
  ): Promise<VisualSearchResult> {
    const startTime = Date.now();

    try {
      // Generate embedding for query image
      const queryEmbedding = await this.generateImageEmbedding(imagePath);

      // Get all product embeddings
      const productEmbeddings = await this.getAllProductEmbeddings();

      // Find similar products
      const similarProducts = await this.findSimilarProducts(
        queryEmbedding,
        productEmbeddings,
        limit
      );

      // Fetch full product details
      const results = await this.enrichResults(similarProducts);

      const queryTime = Date.now() - startTime;

      return {
        results,
        queryTime,
        totalProducts: productEmbeddings.length,
      };
    } catch (error) {
      console.error('Error in visual search:', error);
      throw error;
    }
  }

  /**
   * Search for products using text description
   */
  async searchByText(
    text: string,
    limit: number = 10
  ): Promise<VisualSearchResult> {
    const startTime = Date.now();

    try {
      // Check cache
      const cacheKey = `visual-search:text:${text}:${limit}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Generate embedding for text query
      const queryEmbedding = await this.generateTextEmbedding(text);

      // Get all product embeddings
      const productEmbeddings = await this.getAllProductEmbeddings();

      // Find similar products
      const similarProducts = await this.findSimilarProducts(
        queryEmbedding,
        productEmbeddings,
        limit
      );

      // Fetch full product details
      const results = await this.enrichResults(similarProducts);

      const queryTime = Date.now() - startTime;

      const result = {
        results,
        queryTime,
        totalProducts: productEmbeddings.length,
      };

      // Cache for 30 minutes
      await cache.set(cacheKey, JSON.stringify(result), 1800);

      return result;
    } catch (error) {
      console.error('Error in text-to-image search:', error);
      throw error;
    }
  }

  /**
   * Generate and store embeddings for all products
   */
  async indexAllProducts(): Promise<{
    indexed: number;
    failed: number;
    totalTime: number;
  }> {
    const startTime = Date.now();
    let indexed = 0;
    let failed = 0;

    try {
      const database = await db.getDb();
      if (!database) {
        throw new Error('Database not available');
      }

      // Get all products with images
      const allProducts = await database
        .select()
        .from(products)
        .where(sql`${products.images} IS NOT NULL AND ${products.images} != '[]'`);

      console.log(`Indexing ${allProducts.length} products...`);

      // Process in batches for efficiency
      const batchSize = 10;
      for (let i = 0; i < allProducts.length; i += batchSize) {
        const batch = allProducts.slice(i, i + batchSize);
        
        for (const product of batch) {
          try {
            // Get first image URL
            const images = JSON.parse(product.images || '[]');
            if (images.length === 0) continue;

            const imageUrl = images[0];
            
            // For now, we'll store embeddings in cache
            // In production, use a vector database like Pinecone or pgvector
            const embedding = await this.generateImageEmbedding(imageUrl);
            
            // Store in cache
            await this.storeProductEmbedding(product.id, embedding);
            
            indexed++;
          } catch (error) {
            console.error(`Failed to index product ${product.id}:`, error);
            failed++;
          }
        }

        // Progress update
        console.log(`Indexed ${Math.min(i + batchSize, allProducts.length)}/${allProducts.length} products`);
      }

      const totalTime = Date.now() - startTime;

      console.log(`Indexing complete: ${indexed} indexed, ${failed} failed, ${totalTime}ms`);

      return { indexed, failed, totalTime };
    } catch (error) {
      console.error('Error indexing products:', error);
      throw error;
    }
  }

  /**
   * Store product embedding in cache/database
   */
  private async storeProductEmbedding(
    productId: number,
    embedding: number[]
  ): Promise<void> {
    // Store in memory cache
    this.embeddingsCache.set(productId, embedding);

    // Store in Redis cache (expires in 7 days)
    const cacheKey = `product-embedding:${productId}`;
    await cache.set(cacheKey, JSON.stringify(embedding), 604800);
  }

  /**
   * Get all product embeddings
   */
  private async getAllProductEmbeddings(): Promise<Array<[number, number[]]>> {
    const database = await db.getDb();
    if (!database) {
      return [];
    }

    // Get all products
    const allProducts = await database.select({ id: products.id }).from(products);

    const embeddings: Array<[number, number[]]> = [];

    for (const product of allProducts) {
      // Try memory cache first
      let embedding = this.embeddingsCache.get(product.id);

      // Try Redis cache
      if (!embedding) {
        const cacheKey = `product-embedding:${product.id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
          embedding = JSON.parse(cached);
          this.embeddingsCache.set(product.id, embedding);
        }
      }

      if (embedding) {
        embeddings.push([product.id, embedding]);
      }
    }

    return embeddings;
  }

  /**
   * Find similar products using Python CLIP
   */
  private async findSimilarProducts(
    queryEmbedding: number[],
    productEmbeddings: Array<[number, number[]]>,
    limit: number
  ): Promise<SimilarProduct[]> {
    try {
      const result = await this.runPythonScript('find_similar', [
        JSON.stringify(queryEmbedding),
        JSON.stringify(productEmbeddings),
        limit.toString(),
      ]);

      if (!result.success) {
        throw new Error(result.error || 'Failed to find similar products');
      }

      return result.results.map(([productId, similarity]: [number, number]) => ({
        productId,
        similarity,
      }));
    } catch (error) {
      console.error('Error finding similar products:', error);
      return [];
    }
  }

  /**
   * Enrich similarity results with full product data
   */
  private async enrichResults(
    similarProducts: SimilarProduct[]
  ): Promise<SimilarProduct[]> {
    const database = await db.getDb();
    if (!database) {
      return similarProducts;
    }

    const enriched: SimilarProduct[] = [];

    for (const item of similarProducts) {
      try {
        const productData = await db.getProductById(item.productId);
        if (productData) {
          enriched.push({
            ...item,
            product: productData,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch product ${item.productId}:`, error);
      }
    }

    return enriched;
  }

  /**
   * Run Python CLIP script
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
   * Get visual search statistics
   */
  async getStatistics(): Promise<{
    totalIndexed: number;
    cacheSize: number;
    averageQueryTime: number;
  }> {
    const productEmbeddings = await this.getAllProductEmbeddings();

    return {
      totalIndexed: productEmbeddings.length,
      cacheSize: this.embeddingsCache.size,
      averageQueryTime: 500, // Placeholder - would track actual query times
    };
  }

  /**
   * Clear embeddings cache
   */
  async clearCache(): Promise<void> {
    this.embeddingsCache.clear();
    await cache.delPattern('product-embedding:*');
    await cache.delPattern('visual-search:*');
  }
}

// Export singleton instance
export const visualSearchService = new VisualSearchService();
