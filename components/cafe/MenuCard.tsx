import React from 'react';
import Image from 'next/image';
import { Leaf, Clock, Flame } from 'lucide-react';

interface MenuItemProps {
  id: number;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  preparationTime?: number;
  calories?: number;
  communityPrice: string;
  fairPrice: string;
  supporterPrice: string;
  ayurvedicProperties?: any;
  allergens?: string[];
  isAvailable: boolean;
  onAddToCart?: (itemId: number, priceTier: 'community' | 'fair' | 'supporter') => void;
}

export const MenuCard: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  category,
  imageUrl,
  preparationTime,
  calories,
  communityPrice,
  fairPrice,
  supporterPrice,
  ayurvedicProperties,
  allergens,
  isAvailable,
  onAddToCart,
}) => {
  const [selectedTier, setSelectedTier] = React.useState<'community' | 'fair' | 'supporter'>('fair');

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id, selectedTier);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Currently Unavailable</span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            {category && (
              <span className="text-xs text-green-600 uppercase tracking-wide">{category}</span>
            )}
          </div>
          {ayurvedicProperties?.doshaBalance && (
            <span className="flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
              <Leaf className="w-3 h-3 mr-1" />
              {ayurvedicProperties.doshaBalance}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {preparationTime && (
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {preparationTime} min
            </span>
          )}
          {calories && (
            <span className="flex items-center">
              <Flame className="w-3 h-3 mr-1" />
              {calories} cal
            </span>
          )}
        </div>

        {allergens && allergens.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500">
              Allergens: {allergens.join(', ')}
            </p>
          </div>
        )}

        <div className="border-t pt-3">
          <p className="text-xs text-gray-600 mb-2">Choose your pricing tier:</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => setSelectedTier('community')}
              className={`px-2 py-1 text-xs rounded ${
                selectedTier === 'community'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Community<br />₹{communityPrice}
            </button>
            <button
              onClick={() => setSelectedTier('fair')}
              className={`px-2 py-1 text-xs rounded ${
                selectedTier === 'fair'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fair<br />₹{fairPrice}
            </button>
            <button
              onClick={() => setSelectedTier('supporter')}
              className={`px-2 py-1 text-xs rounded ${
                selectedTier === 'supporter'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Supporter<br />₹{supporterPrice}
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`w-full py-2 rounded font-medium transition-colors ${
              isAvailable
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};
