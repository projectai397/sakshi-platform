import React from 'react';
import { useParams } from 'wouter';

/**
 * User Profile Page
 * Displays public-facing user profile with their activity and contributions
 */
export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();

  // TODO: Fetch user data from API
  const user = {
    id: userId,
    name: 'Sample User',
    joinedDate: '2024-01-15',
    sevaTokensEarned: 150,
    donationsCount: 5,
    volunteeredHours: 20,
    bio: 'Passionate about sustainable living and community building.',
    avatar: '/placeholder-avatar.png',
  };

  return (
    <main id="main-content" className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar}
              alt={`${user.name}'s profile picture`}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">Member since {new Date(user.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>

          {user.bio && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}
        </div>

        {/* Contribution Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-700">{user.sevaTokensEarned}</div>
            <div className="text-gray-600 mt-2">Seva Tokens Earned</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-700">{user.donationsCount}</div>
            <div className="text-gray-600 mt-2">Items Donated</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-purple-700">{user.volunteeredHours}</div>
            <div className="text-gray-600 mt-2">Hours Volunteered</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-semibold">Earned 10 Seva Tokens</p>
              <p className="text-sm text-gray-600">Volunteered at Repair Café • 2 days ago</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold">Donated 3 Items</p>
              <p className="text-sm text-gray-600">Clothing and books • 1 week ago</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="font-semibold">Attended Swap Event</p>
              <p className="text-sm text-gray-600">Community Swap Day • 2 weeks ago</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
