import React, { useState, useEffect } from 'react';

type ActionType = 'bring_container' | 'bicycle_delivery' | 'off_peak_dining' | 'volunteer' | 'referral' | 'review' | 'social_share';

interface Action {
  id: number;
  actionType: ActionType;
  tokensEarned: number;
  createdAt: string;
  details?: string;
  proof?: string;
}

interface CarbonSavings {
  totalCarbonSavedKg: number;
  treesEquivalent: number;
  actions: Action[];
}

const actionConfig: Record<ActionType, { label: string; icon: string; tokens: number; description: string }> = {
  bring_container: {
    label: 'Brought Container',
    icon: '🥡',
    tokens: 10,
    description: 'Brought your own reusable container',
  },
  bicycle_delivery: {
    label: 'Bicycle Delivery',
    icon: '🚲',
    tokens: 20,
    description: 'Chose bicycle delivery instead of motor vehicle',
  },
  off_peak_dining: {
    label: 'Off-Peak Dining',
    icon: '🕐',
    tokens: 0,
    description: 'Dined during off-peak hours (discount instead)',
  },
  volunteer: {
    label: 'Volunteered',
    icon: '🙌',
    tokens: 100,
    description: 'Volunteered 2+ hours at Sakshi',
  },
  referral: {
    label: 'Referred Friend',
    icon: '👥',
    tokens: 50,
    description: 'Referred a friend who made their first order',
  },
  review: {
    label: 'Left Review',
    icon: '⭐',
    tokens: 10,
    description: 'Left a review on Google/social media',
  },
  social_share: {
    label: 'Social Share',
    icon: '📱',
    tokens: 5,
    description: 'Shared Sakshi on social media',
  },
};

export const RegenerativeActions: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [carbonSavings, setCarbonSavings] = useState<CarbonSavings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [details, setDetails] = useState('');
  const [proof, setProof] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActions();
    fetchCarbonSavings();
  }, []);

  const fetchActions = async () => {
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.regenerativeCredits.getMyActions.query();

      // Mock data
      const mockData: Action[] = [
        {
          id: 1,
          actionType: 'bring_container',
          tokensEarned: 10,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          actionType: 'bicycle_delivery',
          tokensEarned: 20,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          actionType: 'review',
          tokensEarned: 10,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          details: 'Left 5-star review on Google',
        },
      ];

      setActions(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch actions:', error);
      setLoading(false);
    }
  };

  const fetchCarbonSavings = async () => {
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.regenerativeCredits.getCarbonSavings.query();

      // Mock data
      const mockData: CarbonSavings = {
        totalCarbonSavedKg: 4.15,
        treesEquivalent: 0,
        actions: [],
      };

      setCarbonSavings(mockData);
    } catch (error) {
      console.error('Failed to fetch carbon savings:', error);
    }
  };

  const handleLogAction = async (actionType: ActionType) => {
    if (actionType === 'volunteer' || actionType === 'referral') {
      // These require admin verification
      alert('This action requires verification. Please contact staff.');
      return;
    }

    setSelectedAction(actionType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAction) return;

    setSubmitting(true);
    try {
      // TODO: Submit to backend
      // const result = await trpc.innovations.regenerativeCredits.logAction.mutate({
      //   actionType: selectedAction,
      //   details,
      //   proof,
      // });

      const tokensEarned = actionConfig[selectedAction].tokens;

      // Add to local state (mock)
      const newAction: Action = {
        id: Date.now(),
        actionType: selectedAction,
        tokensEarned,
        createdAt: new Date().toISOString(),
        details,
        proof,
      };

      setActions([newAction, ...actions]);
      setSelectedAction(null);
      setDetails('');
      setProof('');
      
      alert(`Action logged! You earned ${tokensEarned} seva tokens 🎉`);
      
      // Refresh carbon savings
      fetchCarbonSavings();
    } catch (error) {
      console.error('Failed to log action:', error);
      alert('Failed to log action. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🌱 Regenerative Actions
        </h1>
        <p className="text-gray-600">
          Earn seva tokens by taking actions that benefit the planet and community
        </p>
      </div>

      {/* Carbon Savings Summary */}
      {carbonSavings && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                {carbonSavings.totalCarbonSavedKg.toFixed(2)}
              </div>
              <div className="text-xl">kg CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                {carbonSavings.treesEquivalent}
              </div>
              <div className="text-xl">Trees Equivalent</div>
              <div className="text-sm text-green-100 mt-1">
                (1 tree absorbs ~20kg CO₂/year)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Log an Action
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(actionConfig) as ActionType[]).map((actionType) => {
            const config = actionConfig[actionType];
            return (
              <button
                key={actionType}
                onClick={() => handleLogAction(actionType)}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">{config.icon}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {config.label}
                </div>
                <div className="text-xs text-green-600 font-bold">
                  +{config.tokens} tokens
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Form Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {actionConfig[selectedAction].icon} {actionConfig[selectedAction].label}
            </h3>
            <p className="text-gray-600 mb-4">
              {actionConfig[selectedAction].description}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Details (Optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any additional details..."
                  maxLength={200}
                />
              </div>

              {(selectedAction === 'review' || selectedAction === 'social_share') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAction(null);
                    setDetails('');
                    setProof('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {submitting ? 'Logging...' : `Earn ${actionConfig[selectedAction].tokens} Tokens`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Action History
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : actions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No actions logged yet. Start earning tokens by taking regenerative actions!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((action) => {
              const config = actionConfig[action.actionType];
              return (
                <div
                  key={action.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{config.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {config.label}
                      </div>
                      {action.details && (
                        <div className="text-sm text-gray-600">{action.details}</div>
                      )}
                      <div className="text-xs text-gray-500">
                        {getTimeAgo(action.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      +{action.tokensEarned}
                    </div>
                    <div className="text-xs text-gray-500">tokens</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-2">💡 How It Works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Take sustainable actions to earn seva tokens</li>
          <li>• Use tokens to get discounts on future meals</li>
          <li>• Track your environmental impact</li>
          <li>• Some actions require staff verification</li>
        </ul>
      </div>
    </div>
  );
};

export default RegenerativeActions;
