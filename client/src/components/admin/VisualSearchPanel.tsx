import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Eye, Database, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const VisualSearchPanel: React.FC = () => {
  const [isIndexing, setIsIndexing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const statisticsQuery = trpc.visualSearch.getStatistics.useQuery();
  const indexMutation = trpc.visualSearch.indexProducts.useMutation();
  const clearCacheMutation = trpc.visualSearch.clearCache.useMutation();

  const handleIndexProducts = async () => {
    setIsIndexing(true);
    try {
      const result = await indexMutation.mutateAsync();

      toast.success(
        `Indexed ${result.indexed} products in ${(result.totalTime / 1000).toFixed(1)}s`
      );

      statisticsQuery.refetch();
    } catch (error) {
      toast.error('Failed to index products');
      console.error(error);
    } finally {
      setIsIndexing(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the visual search cache?')) {
      return;
    }

    setIsClearing(true);
    try {
      await clearCacheMutation.mutateAsync();

      toast.success('Cache cleared successfully');
      statisticsQuery.refetch();
    } catch (error) {
      toast.error('Failed to clear cache');
      console.error(error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Visual Search</h2>
        <p className="text-muted-foreground">
          Manage image embeddings and visual search functionality
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Index Products
            </CardTitle>
            <CardDescription>
              Generate image embeddings for all products to enable visual search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleIndexProducts}
              disabled={isIndexing}
              className="w-full"
            >
              {isIndexing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Indexing Products...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Index All Products
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This may take several minutes for large catalogs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Clear Cache
            </CardTitle>
            <CardDescription>
              Remove all cached embeddings and search results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleClearCache}
              disabled={isClearing}
              variant="outline"
              className="w-full"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cache
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      {statisticsQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : statisticsQuery.data?.statistics ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Products Indexed
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statisticsQuery.data.statistics.totalIndexed}
                </div>
                <p className="text-xs text-muted-foreground">
                  Products with image embeddings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cache Size
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statisticsQuery.data.statistics.cacheSize}
                </div>
                <p className="text-xs text-muted-foreground">
                  Embeddings in memory
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Query Time
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statisticsQuery.data.statistics.averageQueryTime}ms
                </div>
                <p className="text-xs text-muted-foreground">
                  Average search speed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How Visual Search Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Image Embedding Generation</h4>
                    <p className="text-sm text-muted-foreground">
                      OpenAI CLIP model converts product images into 512-dimensional vectors that capture visual features
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Similarity Search</h4>
                    <p className="text-sm text-muted-foreground">
                      When users upload an image, it's converted to a vector and compared with all product vectors using cosine similarity
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Ranked Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Products are ranked by similarity score and returned with confidence percentages
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Text-to-Image Search</h4>
                    <p className="text-sm text-muted-foreground">
                      CLIP also understands text, enabling "find me a blue vintage jacket" style searches
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
                    40%
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Increase in product discovery
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    45%
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Higher engagement rate
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    30%
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Conversion rate improvement
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
