import React, { useState, useEffect } from 'react';

interface ImpactScore {
  totalScore: number;
  environmental: {
    score: number;
    mealsEaten: number;
    carbonSaved: number;
    waterSaved: number;
  };
  social: {
    score: number;
    mealsSponsored: number;
    amountDonated: number;
  };
  mindfulness: {
    score: number;
    sessionsCompleted: number;
    avgMealDuration: number;
  };
  community: {
    score: number;
    volunteerHours: number;
    regenerativeActions: number;
  };
}

export const ImpactDashboard: React.FC = () => {
  const [impact, setImpact] = useState<ImpactScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareText, setShareText] = useState('');

  useEffect(() => {
    fetchImpact();
  }, []);

  const fetchImpact = async () => {
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.impactDashboard.getMyImpact.query();
      
      // Mock data
      const data: ImpactScore = {
        totalScore: 687,
        environmental: {
          score: 240,
          mealsEaten: 120,
          carbonSaved: 156.5,
          waterSaved: 48000,
        },
        social: {
          score: 180,
          mealsSponsored: 18,
          amountDonated: 900,
        },
        mindfulness: {
          score: 145,
          sessionsCompleted: 29,
          avgMealDuration: 22,
        },
        community: {
          score: 122,
          volunteerHours: 12,
          regenerativeActions: 45,
        },
      };

      setImpact(data);
      
      // Generate share text
      const shareMsg = `I've made a positive impact through conscious dining! 🌿\n\n` +
        `🌍 ${data.environmental.mealsEaten} plant-based meals\n` +
        `💚 ${Math.round(data.environmental.carbonSaved)} kg CO2 saved\n` +
        `🤝 ${data.social.mealsSponsored} meals sponsored\n` +
        `🧘 ${data.mindfulness.sessionsCompleted} mindful dining sessions\n\n` +
        `Join me in making sustainable living accessible! #SakshiPlatform`;
      setShareText(shareMsg);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch impact:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 250) return 'text-green-600';
    if (score >= 150) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 250) return 'Excellent';
    if (score >= 150) return 'Good';
    if (score >= 75) return 'Fair';
    return 'Getting Started';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Sakshi Impact',
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Impact summary copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!impact) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">Failed to load impact data. Please try again.</p>
      </div>
    );
  }

  const treesEquivalent = Math.round(impact.environmental.carbonSaved / 20);
  const showersEquivalent = Math.round(impact.environmental.waterSaved / 80);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Your Impact Dashboard
        </h1>
        <p className="text-gray-600">
          See the positive change you're creating through conscious living
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-8xl font-bold mb-4">
          {impact.totalScore}
        </div>
        <div className="text-2xl font-medium mb-2">
          Impact Score
        </div>
        <div className="text-green-100">
          {getScoreLabel(impact.totalScore)} • Keep up the great work!
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <div className="text-sm">Max Score</div>
            <div className="text-xl font-bold">1000</div>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <div className="text-sm">Your Progress</div>
            <div className="text-xl font-bold">{Math.round(impact.totalScore / 10)}%</div>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Environmental */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <div className="text-4xl mb-2">🌍</div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {impact.environmental.score}
          </div>
          <div className="text-sm font-medium text-gray-700">Environmental</div>
          <div className="text-xs text-gray-500 mt-1">of 300</div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <div className="text-4xl mb-2">🤝</div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {impact.social.score}
          </div>
          <div className="text-sm font-medium text-gray-700">Social</div>
          <div className="text-xs text-gray-500 mt-1">of 300</div>
        </div>

        {/* Mindfulness */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
          <div className="text-4xl mb-2">🧘</div>
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {impact.mindfulness.score}
          </div>
          <div className="text-sm font-medium text-gray-700">Mindfulness</div>
          <div className="text-xs text-gray-500 mt-1">of 200</div>
        </div>

        {/* Community */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {impact.community.score}
          </div>
          <div className="text-sm font-medium text-gray-700">Community</div>
          <div className="text-xs text-gray-500 mt-1">of 200</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environmental Impact */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🌍</span> Environmental Impact
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plant-based meals:</span>
              <span className="font-bold text-green-600">{impact.environmental.mealsEaten}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CO₂ saved:</span>
              <span className="font-bold text-green-600">{impact.environmental.carbonSaved.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Water saved:</span>
              <span className="font-bold text-green-600">{(impact.environmental.waterSaved / 1000).toFixed(1)} L</span>
            </div>
          </div>
        </div>

        {/* Social Impact */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🤝</span> Social Impact
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Meals sponsored:</span>
              <span className="font-bold text-blue-600">{impact.social.mealsSponsored}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount donated:</span>
              <span className="font-bold text-blue-600">₹{impact.social.amountDonated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">People helped:</span>
              <span className="font-bold text-blue-600">{impact.social.mealsSponsored}</span>
            </div>
          </div>
        </div>

        {/* Mindfulness */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🧘</span> Mindfulness Practice
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sessions completed:</span>
              <span className="font-bold text-purple-600">{impact.mindfulness.sessionsCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. meal duration:</span>
              <span className="font-bold text-purple-600">{impact.mindfulness.avgMealDuration} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mindfulness level:</span>
              <span className="font-bold text-purple-600">
                {impact.mindfulness.avgMealDuration >= 20 ? 'High' : 'Growing'}
              </span>
            </div>
          </div>
        </div>

        {/* Community Engagement */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>👥</span> Community Engagement
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Volunteer hours:</span>
              <span className="font-bold text-orange-600">{impact.community.volunteerHours}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Regenerative actions:</span>
              <span className="font-bold text-orange-600">{impact.community.regenerativeActions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Engagement level:</span>
              <span className="font-bold text-orange-600">
                {impact.community.volunteerHours >= 10 ? 'Active' : 'Growing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparisons */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Your Impact Equals:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-2">🌳</div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {treesEquivalent}
            </div>
            <div className="text-sm text-gray-600">Trees Planted</div>
            <div className="text-xs text-gray-500 mt-1">
              (in terms of CO₂ absorption)
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-2">💧</div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {showersEquivalent}
            </div>
            <div className="text-sm text-gray-600">Showers Saved</div>
            <div className="text-xs text-gray-500 mt-1">
              (80L per shower)
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-2">🍽️</div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {impact.social.mealsSponsored}
            </div>
            <div className="text-sm text-gray-600">Meals Provided</div>
            <div className="text-xs text-gray-500 mt-1">
              to those in need
            </div>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <div className="text-center">
        <button
          onClick={handleShare}
          className="bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition transform hover:scale-105 shadow-lg"
        >
          📱 Share My Impact
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Inspire others to join the conscious living movement
        </p>
      </div>
    </div>
  );
};

export default ImpactDashboard;
