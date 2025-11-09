import React, { useEffect, useState } from 'react';

interface ImpactBoardProps {
  locationId: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface ImpactData {
  totalMealsSponsored: number;
  totalMealsRedeemed: number;
  totalAmountSponsored: number;
  topSponsorMessage: string | null;
}

export const ImpactBoard: React.FC<ImpactBoardProps> = ({ 
  locationId, 
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [impact, setImpact] = useState<ImpactData>({
    totalMealsSponsored: 0,
    totalMealsRedeemed: 0,
    totalAmountSponsored: 0,
    topSponsorMessage: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchImpact = async () => {
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.sponsorships.getImpactBoard.query({
      //   locationId,
      //   date: new Date().toISOString().split('T')[0],
      // });
      
      // Mock data for now
      const data: ImpactData = {
        totalMealsSponsored: 47,
        totalMealsRedeemed: 42,
        totalAmountSponsored: 2350,
        topSponsorMessage: "May everyone have access to nourishing food 🙏",
      };
      
      setImpact(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch impact data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpact();
    
    if (autoRefresh) {
      const interval = setInterval(fetchImpact, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [locationId, autoRefresh, refreshInterval]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 rounded-lg animate-pulse">
        <div className="h-32 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-2">
          🤝 Today's Community Impact
        </h2>
        <p className="text-green-100 text-lg">
          Together, we're making sustainable living accessible to all
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Meals Sponsored */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition">
          <div className="text-7xl font-bold mb-2 animate-pulse">
            {impact.totalMealsSponsored}
          </div>
          <div className="text-xl font-medium">Meals Sponsored</div>
          <div className="text-sm text-green-100 mt-2">
            ₹{impact.totalAmountSponsored} contributed
          </div>
        </div>

        {/* Meals Redeemed */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition">
          <div className="text-7xl font-bold mb-2 animate-pulse">
            {impact.totalMealsRedeemed}
          </div>
          <div className="text-xl font-medium">Meals Redeemed</div>
          <div className="text-sm text-green-100 mt-2">
            Nourishing our community
          </div>
        </div>

        {/* Available Meals */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition">
          <div className="text-7xl font-bold mb-2">
            {impact.totalMealsSponsored - impact.totalMealsRedeemed}
          </div>
          <div className="text-xl font-medium">Available Now</div>
          <div className="text-sm text-green-100 mt-2">
            Ready to be claimed
          </div>
        </div>
      </div>

      {/* Top Sponsor Message */}
      {impact.topSponsorMessage && (
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border-2 border-white/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💚</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-green-100 mb-2">
                Message from our community:
              </div>
              <p className="text-xl italic font-light">
                "{impact.topSponsorMessage}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <p className="text-green-100 mb-4">
          Want to sponsor a meal for someone in need?
        </p>
        <button className="bg-white text-green-700 font-bold py-3 px-8 rounded-lg hover:bg-green-50 transition transform hover:scale-105">
          Sponsor a Meal →
        </button>
      </div>

      {/* Auto-refresh indicator */}
      {autoRefresh && (
        <div className="mt-6 text-center text-sm text-green-100">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
            Updates automatically every {refreshInterval / 1000} seconds
          </span>
        </div>
      )}
    </div>
  );
};

export default ImpactBoard;
