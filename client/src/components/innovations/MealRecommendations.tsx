import React, { useState, useEffect } from 'react';

interface MealRecommendation {
  id: number;
  name: string;
  description: string;
  price: {
    community: number;
    fair: number;
    supporter: number;
  };
  doshaScore: number; // 0-100, how well it matches user's dosha
  doshaEffect: {
    vata: 'increase' | 'decrease' | 'neutral';
    pitta: 'increase' | 'decrease' | 'neutral';
    kapha: 'increase' | 'decrease' | 'neutral';
  };
  spiceLevel: 'mild' | 'medium' | 'spicy';
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  imageUrl?: string;
}

type CurrentState = 'balanced' | 'anxious' | 'irritable' | 'lethargic' | 'energetic';

export const MealRecommendations: React.FC = () => {
  const [currentState, setCurrentState] = useState<CurrentState>('balanced');
  const [recommendations, setRecommendations] = useState<MealRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userDosha, setUserDosha] = useState<'vata' | 'pitta' | 'kapha'>('vata');

  useEffect(() => {
    fetchRecommendations();
  }, [currentState]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.ayurvedic.getRecommendations.query({
      //   currentState,
      // });

      // Mock data
      const mockData: MealRecommendation[] = [
        {
          id: 1,
          name: 'Warm Kitchari Bowl',
          description: 'Nourishing blend of mung dal, rice, and warming spices. Perfect for grounding and digestion.',
          price: { community: 50, fair: 80, supporter: 120 },
          doshaScore: 95,
          doshaEffect: { vata: 'decrease', pitta: 'neutral', kapha: 'neutral' },
          spiceLevel: 'mild',
          category: 'lunch',
        },
        {
          id: 2,
          name: 'Cooling Cucumber Salad',
          description: 'Fresh cucumber, mint, and coconut. Cooling and refreshing for hot days.',
          price: { community: 40, fair: 60, supporter: 90 },
          doshaScore: 85,
          doshaEffect: { vata: 'increase', pitta: 'decrease', kapha: 'neutral' },
          spiceLevel: 'mild',
          category: 'lunch',
        },
        {
          id: 3,
          name: 'Spiced Vegetable Stew',
          description: 'Hearty vegetables with warming spices. Energizing and satisfying.',
          price: { community: 60, fair: 90, supporter: 135 },
          doshaScore: 75,
          doshaEffect: { vata: 'decrease', pitta: 'increase', kapha: 'decrease' },
          spiceLevel: 'spicy',
          category: 'dinner',
        },
        {
          id: 4,
          name: 'Sweet Potato & Coconut Soup',
          description: 'Creamy, grounding soup with sweet potato and coconut milk.',
          price: { community: 55, fair: 85, supporter: 125 },
          doshaScore: 90,
          doshaEffect: { vata: 'decrease', pitta: 'neutral', kapha: 'increase' },
          spiceLevel: 'mild',
          category: 'lunch',
        },
      ];

      setRecommendations(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setLoading(false);
    }
  };

  const handleCheckIn = async (state: CurrentState) => {
    setCurrentState(state);
    
    // TODO: Log check-in to backend
    // await trpc.innovations.ayurvedic.checkIn.mutate({
    //   currentState: state,
    // });
  };

  const getDoshaEffectIcon = (effect: 'increase' | 'decrease' | 'neutral') => {
    if (effect === 'increase') return '↑';
    if (effect === 'decrease') return '↓';
    return '→';
  };

  const getDoshaEffectColor = (effect: 'increase' | 'decrease' | 'neutral') => {
    if (effect === 'increase') return 'text-red-500';
    if (effect === 'decrease') return 'text-green-500';
    return 'text-gray-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Highly Recommended';
    if (score >= 70) return 'Good Match';
    return 'Okay';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Personalized Meal Recommendations
        </h1>
        <p className="text-gray-600">
          Based on your Ayurvedic dosha profile and current state
        </p>
      </div>

      {/* Daily Check-in */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          How are you feeling today?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { state: 'balanced' as const, emoji: '😌', label: 'Balanced' },
            { state: 'anxious' as const, emoji: '😰', label: 'Anxious' },
            { state: 'irritable' as const, emoji: '😤', label: 'Irritable' },
            { state: 'lethargic' as const, emoji: '😴', label: 'Lethargic' },
            { state: 'energetic' as const, emoji: '⚡', label: 'Energetic' },
          ].map(({ state, emoji, label }) => (
            <button
              key={state}
              onClick={() => handleCheckIn(state)}
              className={`p-4 rounded-lg border-2 transition ${
                currentState === state
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="text-3xl mb-1">{emoji}</div>
              <div className="text-sm font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map(meal => (
            <div
              key={meal.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition hover:shadow-lg ${
                meal.doshaScore >= 85 ? 'border-green-300' : 'border-gray-200'
              }`}
            >
              {/* Meal Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <span className="text-6xl">🍲</span>
              </div>

              <div className="p-6">
                {/* Score Badge */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{meal.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getScoreColor(meal.doshaScore)}`}>
                    {meal.doshaScore}% Match
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {meal.description}
                </p>

                {/* Dosha Effects */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs font-medium text-gray-700 mb-2">Dosha Effects:</div>
                  <div className="flex gap-4 text-sm">
                    <span className={`flex items-center gap-1 ${getDoshaEffectColor(meal.doshaEffect.vata)}`}>
                      <span className="font-medium">V</span>
                      <span>{getDoshaEffectIcon(meal.doshaEffect.vata)}</span>
                    </span>
                    <span className={`flex items-center gap-1 ${getDoshaEffectColor(meal.doshaEffect.pitta)}`}>
                      <span className="font-medium">P</span>
                      <span>{getDoshaEffectIcon(meal.doshaEffect.pitta)}</span>
                    </span>
                    <span className={`flex items-center gap-1 ${getDoshaEffectColor(meal.doshaEffect.kapha)}`}>
                      <span className="font-medium">K</span>
                      <span>{getDoshaEffectIcon(meal.doshaEffect.kapha)}</span>
                    </span>
                  </div>
                </div>

                {/* Spice Level */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-600">Spice Level:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(level => (
                      <span
                        key={level}
                        className={`text-lg ${
                          (meal.spiceLevel === 'spicy' && level <= 3) ||
                          (meal.spiceLevel === 'medium' && level <= 2) ||
                          (meal.spiceLevel === 'mild' && level <= 1)
                            ? 'opacity-100'
                            : 'opacity-20'
                        }`}
                      >
                        🌶️
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <div>Community: ₹{meal.price.community}</div>
                      <div>Fair: ₹{meal.price.fair}</div>
                      <div>Supporter: ₹{meal.price.supporter}</div>
                    </div>
                    <button className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition">
                      Order
                    </button>
                  </div>
                </div>

                {/* Recommendation Badge */}
                {meal.doshaScore >= 85 && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <span className="text-green-600 text-xl">✨</span>
                    <span className="text-sm text-green-800 font-medium">
                      Perfect for your dosha today!
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-2">Understanding the Symbols:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>V, P, K:</strong> Vata, Pitta, Kapha doshas</li>
          <li><strong>↑:</strong> Increases this dosha</li>
          <li><strong>↓:</strong> Decreases this dosha (balancing)</li>
          <li><strong>→:</strong> Neutral effect on this dosha</li>
          <li><strong>Match %:</strong> How well this meal suits your current state and dosha profile</li>
        </ul>
      </div>
    </div>
  );
};

export default MealRecommendations;
