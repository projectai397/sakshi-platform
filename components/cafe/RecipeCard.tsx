import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Star, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  id: number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  ratingAvg?: string;
  ratingCount?: number;
  tags?: string[];
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  description,
  category,
  difficulty,
  prepTime,
  cookTime,
  servings,
  imageUrl,
  ratingAvg,
  ratingCount,
  tags,
}) => {
  const totalTime = (prepTime || 0) + (cookTime || 0);
  const rating = parseFloat(ratingAvg || '0');

  const difficultyColor = {
    easy: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    hard: 'text-red-600 bg-red-50',
  }[difficulty || 'easy'] || 'text-gray-600 bg-gray-50';

  return (
    <Link href={`/cafe/recipes/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer">
        {imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
            {category && (
              <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-green-700">
                {category}
              </div>
            )}
            {difficulty && (
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${difficultyColor}`}>
                {difficulty}
              </div>
            )}
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            {totalTime > 0 && (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {totalTime} min
              </span>
            )}
            {servings && (
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {servings} servings
              </span>
            )}
            {rating > 0 && (
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                {rating.toFixed(1)} ({ratingCount})
              </span>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-gray-500">+{tags.length - 3} more</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="flex items-center text-sm text-green-600">
              <ChefHat className="w-4 h-4 mr-1" />
              View Recipe
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
