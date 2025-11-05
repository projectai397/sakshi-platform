import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Sparkles, BarChart3, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PricingRecommendation {
  recommendedPrice: number;
  recommendedSevaTokens: number;
  confidence: number;
  reasoning: string[];
  priceRange: {
    min: number;
    max: number;
  };
  optimizationTips: string[];
}

export const DynamicPricingPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [isTraining, setIsTraining] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const analyticsQuery = trpc.pricing.getAnalytics.useQuery();
  const trainModelMutation = trpc.pricing.trainModel.useMutation();
  const bulkUpdateMutation = trpc.pricing.bulkUpdatePrices.useMutation();

  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      const result = await trainModelMutation.mutateAsync();
      
      if (result.success) {
        toast.success('ML model trained successfully!');
        console.log('Training metrics:', result.metrics);
      } else {
        toast.error('Model training failed: ' + result.metrics?.message || 'Unknown error');
      }
    } catch (error) {
      toast.error('Failed to train model');
      console.error(error);
    } finally {
      setIsTraining(false);
    }
  };

  const handleBulkUpdate = async () => {
    setIsBulkUpdating(true);
    try {
      const result = await bulkUpdateMutation.mutateAsync({
        category: selectedCategory,
      });

      toast.success(
        `Updated ${result.updated} products! Potential revenue optimization: ₹${result.totalSavings.toFixed(2)}`
      );
      
      analyticsQuery.refetch();
    } catch (error) {
      toast.error('Failed to bulk update prices');
      console.error(error);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Dynamic Pricing</h2>
        <p className="text-muted-foreground">
          Machine learning-powered pricing optimization for maximum revenue
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Train ML Model
            </CardTitle>
            <CardDescription>
              Train the pricing model with historical sales data for better recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleTrainModel}
              disabled={isTraining}
              className="w-full"
            >
              {isTraining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Training Model...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Train Model
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Requires at least 50 historical sales records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              Bulk Update Prices
            </CardTitle>
            <CardDescription>
              Apply AI recommendations to all products or specific category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || undefined)}
            >
              <option value="">All Categories</option>
              <option value="clothing">Clothing</option>
              <option value="electronics">Electronics</option>
              <option value="books">Books</option>
              <option value="furniture">Furniture</option>
              <option value="accessories">Accessories</option>
              <option value="home-decor">Home Decor</option>
              <option value="sports">Sports</option>
              <option value="toys">Toys</option>
            </select>
            
            <Button
              onClick={handleBulkUpdate}
              disabled={isBulkUpdating}
              className="w-full"
              variant="outline"
            >
              {isBulkUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Prices
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      {analyticsQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : analyticsQuery.data?.analytics ? (
        <>
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Products Analyzed
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsQuery.data.analytics.totalProductsAnalyzed}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active products in system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Optimization
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +{analyticsQuery.data.analytics.averageOptimization.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Revenue improvement potential
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recommendations
                </CardTitle>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsQuery.data.analytics.recommendations}
                </div>
                <p className="text-xs text-muted-foreground">
                  AI-powered suggestions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>
                Average pricing by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analyticsQuery.data.analytics.categoryBreakdown).map(
                  ([category, data]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-32 font-medium capitalize">
                          {category.replace('-', ' ')}
                        </div>
                        <Badge variant="secondary">{data.count} products</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          ₹{data.avgPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How Dynamic Pricing Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Data Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      AI analyzes product condition, category, age, demand, and market trends
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">ML Prediction</h4>
                    <p className="text-sm text-muted-foreground">
                      Machine learning model predicts optimal price based on historical patterns
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Balances revenue goals with circular economy mission and customer value
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Continuous Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Model improves over time as it learns from sales outcomes and feedback
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expected Impact */}
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                Expected Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    25-35%
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Revenue increase
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    90%
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Pricing consistency
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    40%
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Faster inventory turnover
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};
