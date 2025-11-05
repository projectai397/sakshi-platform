import React from 'react';
import { trpc } from '../../lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Sparkles, TrendingUp, Heart } from 'lucide-react';

interface RecommendationsWidgetProps {
  productId?: number;
  userId?: number;
  type: 'similar' | 'forYou' | 'popular';
  title?: string;
  limit?: number;
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  productId,
  userId,
  type,
  title,
  limit = 6,
}) => {
  const similarQuery = trpc.recommendations.getSimilar.useQuery(
    { productId: productId!, limit },
    { enabled: type === 'similar' && !!productId }
  );

  const forYouQuery = trpc.recommendations.getForUser.useQuery(
    { limit },
    { enabled: type === 'forYou' && !!userId }
  );

  const popularQuery = trpc.recommendations.getPopular.useQuery(
    { limit },
    { enabled: type === 'popular' }
  );

  const query = type === 'similar' ? similarQuery : type === 'forYou' ? forYouQuery : popularQuery;

  const defaultTitles = {
    similar: 'Similar Products',
    forYou: 'Recommended for You',
    popular: 'Trending Now',
  };

  const icons = {
    similar: <Sparkles className="h-5 w-5 text-purple-500" />,
    forYou: <Heart className="h-5 w-5 text-red-500" />,
    popular: <TrendingUp className="h-5 w-5 text-green-500" />,
  };

  if (query.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!query.data?.recommendations || query.data.recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icons[type]}
          {title || defaultTitles[type]}
        </CardTitle>
        <CardDescription>
          {type === 'similar' && 'Products you might also like'}
          {type === 'forYou' && 'Personalized picks based on your preferences'}
          {type === 'popular' && 'Popular products right now'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {query.data.recommendations.map((rec: any) => (
            <div
              key={rec.productId}
              className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {rec.product?.images && (
                <img
                  src={JSON.parse(rec.product.images)[0]}
                  alt={rec.product.name}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-2">
                <h4 className="font-medium text-xs truncate">
                  {rec.product?.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold">
                    ₹{rec.product?.price}
                  </span>
                  {rec.reason && (
                    <Badge variant="secondary" className="text-xs">
                      {rec.reason}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
