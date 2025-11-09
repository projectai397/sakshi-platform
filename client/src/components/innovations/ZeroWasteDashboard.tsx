import React, { useState, useEffect } from 'react';

interface WasteStats {
  totalWasteKg: number;
  compostedKg: number;
  donatedKg: number;
  wastePercentage: number;
  topWasteItems: { item: string; count: number }[];
  monthlyTrend: { month: string; waste: number; composted: number }[];
}

interface LocationStats {
  locationId: number;
  locationName: string;
  wastePercentage: number;
  totalMeals: number;
}

export const ZeroWasteDashboard: React.FC = () => {
  const [stats, setStats] = useState<WasteStats | null>(null);
  const [locations, setLocations] = useState<LocationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStats();
    fetchLocations();
  }, [selectedPeriod]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.zeroWaste.getPublicStats.query({
      //   period: selectedPeriod,
      // });

      // Mock data
      const mockData: WasteStats = {
        totalWasteKg: 12.5,
        compostedKg: 45.8,
        donatedKg: 18.3,
        wastePercentage: 16.3,
        topWasteItems: [
          { item: 'Vegetable peels', count: 45 },
          { item: 'Leftover rice', count: 23 },
          { item: 'Bread crusts', count: 18 },
          { item: 'Fruit cores', count: 12 },
        ],
        monthlyTrend: [
          { month: 'Jan', waste: 18, composted: 42 },
          { month: 'Feb', waste: 15, composted: 44 },
          { month: 'Mar', waste: 12.5, composted: 45.8 },
        ],
      };

      setStats(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.zeroWaste.getLocationStats.query();

      // Mock data
      const mockData: LocationStats[] = [
        { locationId: 1, locationName: 'Koramangala', wastePercentage: 12.5, totalMeals: 1247 },
        { locationId: 2, locationName: 'Indiranagar', wastePercentage: 18.2, totalMeals: 892 },
      ];

      setLocations(mockData);
    } catch (error) {
      console.error('Failed to fetch location stats:', error);
    }
  };

  const getWasteColor = (percentage: number): string => {
    if (percentage <= 10) return 'text-green-600';
    if (percentage <= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWasteGrade = (percentage: number): string => {
    if (percentage <= 10) return 'A+';
    if (percentage <= 15) return 'A';
    if (percentage <= 20) return 'B';
    if (percentage <= 30) return 'C';
    return 'D';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
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
        <p className="text-gray-600">Failed to load waste data. Please try again.</p>
      </div>
    );
  }

  const totalHandledKg = stats.totalWasteKg + stats.compostedKg + stats.donatedKg;
  const diversionRate = ((stats.compostedKg + stats.donatedKg) / totalHandledKg) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ♻️ Zero Waste Dashboard
        </h1>
        <p className="text-gray-600">
          Tracking our journey towards zero food waste
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

      {/* Overall Grade */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-8xl font-bold mb-2">{getWasteGrade(stats.wastePercentage)}</div>
        <div className="text-2xl font-medium mb-4">Zero Waste Grade</div>
        <div className="text-lg text-green-100">
          Only {stats.wastePercentage}% food waste • {diversionRate.toFixed(1)}% diversion rate
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">🗑️</span>
            <span className={`text-3xl font-bold ${getWasteColor(stats.wastePercentage)}`}>
              {stats.totalWasteKg} kg
            </span>
          </div>
          <div className="text-sm text-gray-600">Food Waste (Landfill)</div>
          <div className="text-xs text-gray-500 mt-1">{stats.wastePercentage}% of total</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">🌱</span>
            <span className="text-3xl font-bold text-green-600">{stats.compostedKg} kg</span>
          </div>
          <div className="text-sm text-gray-600">Composted</div>
          <div className="text-xs text-gray-500 mt-1">{((stats.compostedKg / totalHandledKg) * 100).toFixed(1)}% of total</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">🤝</span>
            <span className="text-3xl font-bold text-blue-600">{stats.donatedKg} kg</span>
          </div>
          <div className="text-sm text-gray-600">Donated</div>
          <div className="text-xs text-gray-500 mt-1">{((stats.donatedKg / totalHandledKg) * 100).toFixed(1)}% of total</div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Trend</h3>
        <div className="space-y-4">
          {stats.monthlyTrend.map((month, index) => {
            const total = month.waste + month.composted;
            const wastePercent = (month.waste / total) * 100;
            const compostPercent = (month.composted / total) * 100;

            return (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{month.month}</span>
                  <span className="text-sm text-gray-600">
                    {month.waste}kg waste • {month.composted}kg composted
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 flex overflow-hidden">
                  <div
                    className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${wastePercent}%` }}
                  >
                    {wastePercent > 15 && `${wastePercent.toFixed(0)}%`}
                  </div>
                  <div
                    className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${compostPercent}%` }}
                  >
                    {compostPercent > 15 && `${compostPercent.toFixed(0)}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Waste (Landfill)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Composted</span>
          </div>
        </div>
      </div>

      {/* Top Waste Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Most Wasted Items</h3>
        <div className="space-y-3">
          {stats.topWasteItems.map((item, index) => {
            const maxCount = stats.topWasteItems[0].count;
            const percentage = (item.count / maxCount) * 100;

            return (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.item}</span>
                  <span className="text-sm text-gray-600">{item.count} instances</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location Leaderboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Location Leaderboard</h3>
        <div className="space-y-3">
          {locations
            .sort((a, b) => a.wastePercentage - b.wastePercentage)
            .map((location, index) => (
              <div
                key={location.locationId}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${
                    index === 0 ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{location.locationName}</div>
                    <div className="text-sm text-gray-600">{location.totalMeals} meals served</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getWasteColor(location.wastePercentage)}`}>
                    {location.wastePercentage}%
                  </div>
                  <div className="text-xs text-gray-500">waste rate</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Impact Statement */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h3>
        <p className="text-gray-700 max-w-3xl mx-auto">
          At Sakshi, we're committed to achieving true zero waste. Every scrap is either composted to nourish the soil, 
          donated to feed those in need, or carefully analyzed to prevent future waste. Together, we're proving that 
          delicious, nutritious food and environmental responsibility go hand in hand.
        </p>
        <div className="mt-6 flex justify-center gap-8">
          <div>
            <div className="text-3xl font-bold text-green-600">{diversionRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Waste Diverted</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{(stats.compostedKg * 0.3).toFixed(1)} kg</div>
            <div className="text-sm text-gray-600">Soil Created</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroWasteDashboard;
