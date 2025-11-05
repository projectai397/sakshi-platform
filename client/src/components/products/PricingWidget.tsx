import React, { useState, useEffect } from 'react';
import { trpc } from '../../lib/trpc';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Sparkles, TrendingUp, TrendingDown, Info, Lightbulb } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PricingWidgetProps {
  productId: number;
  currentPrice: number;
  currentSevaTokens: number;
  isAdmin?: boolean;
  onPriceUpdate?: (newPrice: number, newTokens: number) => void;
}

export const PricingWidget: React.FC<PricingWidgetProps> = ({
  productId,
  currentPrice,
  currentSevaTokens,
  isAdmin = false,
  onPriceUpdate,
}) => {
  const [showRecommendation, setShowRecommendation] = useState(false);

  const autoPriceQuery = trpc.pricing.getAutoPrice.useQuery(
    { productId },
    { enabled: showRecommendation }
  );

  const applyRecommendationMutation = trpc.pricing.applyRecommendation.useMutation();

  const handleGetRecommendation = () => {
    setShowRecommendation(true);
  };

  const handleApplyRecommendation = async () => {
    if (!autoPriceQuery.data?.recommendation) return;

    try {
      await applyRecommendationMutation.mutateAsync({
        productId,
        recommendedPrice: autoPriceQuery.data.recommendation.recommendedPrice,
        recommendedSevaTokens: autoPriceQuery.data.recommendation.recommendedSevaTokens,
      });

      toast.success('Pricing updated successfully!');
      
      if (onPriceUpdate) {
        onPriceUpdate(
          autoPriceQuery.data.recommendation.recommendedPrice,
          autoPriceQuery.data.recommendation.recommendedSevaTokens
        );
      }

      setShowRecommendation(false);
    } catch (error) {
      toast.error('Failed to update pricing');
      console.error(error);
    }
  };

  if (!isAdmin) {
    return null; // Only show to admins
  }

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Pricing Assistant
        </CardTitle>
        <CardDescription>
          Get ML-powered pricing recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showRecommendation ? (
          <Button
            onClick={handleGetRecommendation}
            className="w-full"
            variant="outline"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Get AI Recommendation
          </Button>
        ) : autoPriceQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : autoPriceQuery.data?.recommendation ? (
          <div className="space-y-4">
            {/* Price Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold">₹{currentPrice}</p>
                <p className="text-xs text-muted-foreground">
                  {currentSevaTokens} seva tokens
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Recommended</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{autoPriceQuery.data.recommendation.recommendedPrice}
                </p>
                <p className="text-xs text-muted-foreground">
                  {autoPriceQuery.data.recommendation.recommendedSevaTokens} seva tokens
                </p>
              </div>
            </div>

            {/* Price Change Indicator */}
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted">
              {autoPriceQuery.data.recommendation.recommendedPrice > currentPrice ? (
                <>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-600">
                    +{((autoPriceQuery.data.recommendation.recommendedPrice - currentPrice) / currentPrice * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">increase recommended</span>
                </>
              ) : autoPriceQuery.data.recommendation.recommendedPrice < currentPrice ? (
                <>
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold text-orange-600">
                    {((autoPriceQuery.data.recommendation.recommendedPrice - currentPrice) / currentPrice * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">decrease recommended</span>
                </>
              ) : (
                <>
                  <Info className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Current price is optimal</span>
                </>
              )}
            </div>

            {/* Confidence Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <Badge variant={autoPriceQuery.data.recommendation.confidence > 0.7 ? 'default' : 'secondary'}>
                  {(autoPriceQuery.data.recommendation.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${autoPriceQuery.data.recommendation.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="p-3 rounded-lg bg-muted space-y-1">
              <p className="text-sm font-medium">Recommended Range</p>
              <p className="text-xs text-muted-foreground">
                ₹{autoPriceQuery.data.recommendation.priceRange.min} - ₹{autoPriceQuery.data.recommendation.priceRange.max}
              </p>
            </div>

            {/* Reasoning */}
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                AI Reasoning
              </p>
              <ul className="space-y-1">
                {autoPriceQuery.data.recommendation.reasoning.map((reason, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optimization Tips */}
            {autoPriceQuery.data.recommendation.optimizationTips.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Optimization Tips
                </p>
                <ul className="space-y-1">
                  {autoPriceQuery.data.recommendation.optimizationTips.map((tip, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleApplyRecommendation}
                disabled={applyRecommendationMutation.isLoading}
                className="flex-1"
              >
                {applyRecommendationMutation.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  'Apply Recommendation'
                )}
              </Button>
              <Button
                onClick={() => setShowRecommendation(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
