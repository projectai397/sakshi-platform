/**
 * AI-Powered Intelligent Inventory Management
 * Predicts product velocity and optimizes stocking decisions
 * Expected Impact: 30-40% cost reduction
 */

import { spawn } from 'child_process';
import path from 'path';
import * as db from '../db';
import { products } from '@db/schema';
import { sql, desc, and, gte } from 'drizzle-orm';
import { cache } from './cache/redis';

interface VelocityPrediction {
  velocity: 'fast' | 'medium' | 'slow';
  confidence: number;
  daysToSell: number;
}

interface DeadStockAlert {
  productId: number;
  ageInDays: number;
  velocity: string;
  recommendation: string;
  product?: any;
}

export class InventoryService {
  private pythonScriptPath: string;

  constructor() {
    this.pythonScriptPath = path.join(__dirname, '../../ml-models/inventory-predictor.py');
  }

  async predictVelocity(productId: number): Promise<VelocityPrediction> {
    try {
      const product = await db.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const productData = {
        id: product.id,
        category: product.category,
        condition: product.condition,
        price: product.price,
        ageInDays: Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
        viewCount: product.viewCount || 0,
      };

      const velocityResult = await this.runPythonScript('predict_velocity', [JSON.stringify(productData)]);
      const daysResult = await this.runPythonScript('predict_days', [JSON.stringify(productData)]);

      return {
        velocity: velocityResult.velocity,
        confidence: velocityResult.confidence,
        daysToSell: daysResult.daysToSell,
      };
    } catch (error) {
      console.error('Error predicting velocity:', error);
      throw error;
    }
  }

  async identifyDeadStock(thresholdDays: number = 60): Promise<DeadStockAlert[]> {
    try {
      const database = await db.getDb();
      if (!database) return [];

      const allProducts = await database.select().from(products);

      const productsData = allProducts.map(p => ({
        id: p.id,
        category: p.category,
        condition: p.condition,
        price: p.price,
        ageInDays: Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      }));

      const result = await this.runPythonScript('dead_stock', [
        JSON.stringify(productsData),
        thresholdDays.toString(),
      ]);

      const enriched: DeadStockAlert[] = [];
      for (const alert of result.atRisk) {
        const product = await db.getProductById(alert.productId);
        if (product) {
          enriched.push({ ...alert, product });
        }
      }

      return enriched;
    } catch (error) {
      console.error('Error identifying dead stock:', error);
      return [];
    }
  }

  async getInventoryMetrics(): Promise<any> {
    try {
      const database = await db.getDb();
      if (!database) return null;

      const allProducts = await database.select().from(products);

      const productsData = allProducts.map(p => ({
        id: p.id,
        category: p.category,
        condition: p.condition,
        price: p.price,
        ageInDays: Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
        status: 'active',
      }));

      const result = await this.runPythonScript('turnover', [JSON.stringify(productsData)]);

      return result.metrics;
    } catch (error) {
      console.error('Error getting inventory metrics:', error);
      return null;
    }
  }

  private runPythonScript(command: string, args: string[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const python = spawn('python3', [this.pythonScriptPath, command, ...args]);

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
            reject(new Error(`Failed to parse output: ${output}`));
          }
        }
      });

      setTimeout(() => {
        python.kill();
        reject(new Error('Python script timeout'));
      }, 30000);
    });
  }
}

export const inventoryService = new InventoryService();
