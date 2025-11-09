import React, { useState, useEffect } from 'react';

interface NutritionStats {
  totalMeals: number;
  plantBasedStreak: number;
  avgCalories: number;
  avgProtein: number;
  avgFiber: number;
  topNutrients: { name: string; percentage: number }[];
  weeklyTrend: { day: string; meals: number }[];
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress: number;
  target: number;
}

export const NutritionPassport: React.FC = () => {
  const [stats, setStats] = useState<NutritionStats | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    fetchStats();
    fetchMilestones();
  }, [selectedPeriod]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.nutritionPassport.getStats.query({
      //   period: selectedPeriod,
      // });

      // Mock data
      const mockData: NutritionStats = {
        totalMeals: 47,
        plantBasedStreak: 12,
        avgCalories: 520,
        avgProtein: 18,
        avgFiber: 12,
        topNutrients: [
          { name: 'Vitamin C', percentage: 145 },
          { name: 'Fiber', percentage: 120 },
          { name: 'Iron', percentage: 95 },
          { name: 'Calcium', percentage: 85 },
        ],
        weeklyTrend: [
          { day: 'Mon', meals: 2 },
          { day: 'Tue', meals: 1 },
          { day: 'Wed', meals: 2 },
          { day: 'Thu', meals: 1 },
          { day: 'Fri', meals: 2 },
          { day: 'Sat', meals: 1 },
          { day: 'Sun', meals: 2 },
        ],
      };

      setStats(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  const fetchMilestones = async () => {
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.nutritionPassport.getMilestones.query();

      // Mock data
      const mockData: Milestone[] = [
        {
          id: 1,
          title: 'First Meal',
          description: 'Ordered your first meal from Sakshi',
          icon: '🍽️',
          achieved: true,
          progress: 1,
          target: 1,
        },
        {
          id: 2,
          title: 'Week Warrior',
          description: 'Ate plant-based for 7 days straight',
          icon: '🌱',
          achieved: true,
          progress: 7,
          target: 7,
        },
        {
          id: 3,
          title: 'Mindful Month',
          description: 'Complete 30 mindful dining sessions',
          icon: '🧘',
          achieved: false,
          progress: 12,
          target: 30,
        },
        {
          id: 4,
          title: 'Century Club',
          description: 'Order 100 meals from Sakshi',
          icon: '💯',
          achieved: false,
          progress: 47,
          target: 100,
        },
        {
          id: 5,
          title: 'Nutrition Master',
          description: 'Meet all daily nutrition goals for 30 days',
          icon: '🏆',
          achieved: false,
          progress: 8,
          target: 30,
        },
      ];

      setMilestones(mockData);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-gray-600">Failed to load nutrition data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📊 Your Nutrition Passport
        </h1>
        <p className="text-gray-600">
          Track your nutrition journey and celebrate milestones
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center gap-2">
        {(['week', 'month', 'year'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedPeriod === period
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border-2 border-green-200">
          <div className="text-4xl mb-2">🍽️</div>
          <div className="text-3xl font-bold text-green-600">{stats.totalMeals}</div>
          <div className="text-sm text-gray-600">Total Meals</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-6 border-2 border-purple-200">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-purple-600">{stats.plantBasedStreak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
          <div className="text-4xl mb-2">⚡</div>
          <div className="text-3xl font-bold text-blue-600">{stats.avgCalories}</div>
          <div className="text-sm text-gray-600">Avg Calories</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg shadow-md p-6 border-2 border-orange-200">
          <div className="text-4xl mb-2">💪</div>
          <div className="text-3xl font-bold text-orange-600">{stats.avgProtein}g</div>
          <div className="text-sm text-gray-600">Avg Protein</div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Meal Trend</h3>
        <div className="flex items-end justify-between h-48 gap-2">
          {stats.weeklyTrend.map((day, index) => {
            const maxMeals = Math.max(...stats.weeklyTrend.map(d => d.meals));
            const heightPercentage = (day.meals / maxMeals) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full">
                  <div
                    className="bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-500"
                    style={{ height: `${Math.max(heightPercentage, 10)}%`, minHeight: '20px' }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-700">
                      {day.meals}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium">{day.day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Nutrients */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Top Nutrients (% of Daily Value)</h3>
        <div className="space-y-4">
          {stats.topNutrients.map((nutrient, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{nutrient.name}</span>
                <span className={`text-sm font-bold ${
                  nutrient.percentage >= 100 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {nutrient.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    nutrient.percentage >= 100
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-orange-400 to-yellow-400'
                  }`}
                  style={{ width: `${Math.min(nutrient.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Milestones & Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`rounded-lg p-4 border-2 ${
                milestone.achieved
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-4xl ${milestone.achieved ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                  {milestone.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{milestone.title}</h4>
                    {milestone.achieved && (
                      <span className="text-yellow-600 text-xl">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                  
                  {!milestone.achieved && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{milestone.progress} / {milestone.target}</span>
                        <span>{Math.round((milestone.progress / milestone.target) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${(milestone.progress / milestone.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export/Share */}
      <div className="text-center">
        <button className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition transform hover:scale-105 shadow-lg">
          📥 Download Nutrition Report
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Get a detailed PDF report of your nutrition journey
        </p>
      </div>
    </div>
  );
};

export default NutritionPassport;
