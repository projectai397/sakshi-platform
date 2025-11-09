import React, { useState, useEffect } from 'react';

interface Farmer {
  id: number;
  name: string;
  farmName: string;
  location: string;
  state: string;
  photoUrl?: string;
  bio: string;
  farmingPractices: string[];
  certifications: string[];
  productsGrown: string[];
  farmSizeAcres: number;
  yearsExperience: number;
  familyMembers: number;
}

interface FarmerStats {
  totalKgSupplied: number;
  mealsImpacted: number;
  carbonSequestered: number;
  biodiversityScore: number;
}

interface FarmerProfileProps {
  farmerId: number;
}

export const FarmerProfile: React.FC<FarmerProfileProps> = ({ farmerId }) => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmer();
    fetchStats();
  }, [farmerId]);

  const fetchFarmer = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.farmTransparency.getFarmer.query({
      //   farmerId,
      // });

      // Mock data
      const mockData: Farmer = {
        id: farmerId,
        name: 'Ramesh Kumar',
        farmName: 'Green Valley Organic Farm',
        location: 'Mandya District',
        state: 'Karnataka',
        bio: 'Third-generation farmer committed to organic and regenerative agriculture. Our family has been stewarding this land for over 60 years, transitioning to fully organic practices in 2015.',
        farmingPractices: [
          'Organic (certified)',
          'No-till farming',
          'Crop rotation',
          'Composting',
          'Rainwater harvesting',
          'Integrated pest management',
        ],
        certifications: [
          'Organic India Certification',
          'Fair Trade Certified',
          'Regenerative Organic Certified',
        ],
        productsGrown: [
          'Rice (Red Matta)',
          'Vegetables (Seasonal)',
          'Pulses (Toor Dal)',
          'Turmeric',
          'Ginger',
        ],
        farmSizeAcres: 12,
        yearsExperience: 35,
        familyMembers: 6,
      };

      setFarmer(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch farmer:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.farmTransparency.getFarmerStats.query({
      //   farmerId,
      // });

      // Mock data
      const mockData: FarmerStats = {
        totalKgSupplied: 2847,
        mealsImpacted: 8541,
        carbonSequestered: 156.5,
        biodiversityScore: 8.5,
      };

      setStats(mockData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">Farmer not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with Photo */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-white">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Farmer Photo */}
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl flex-shrink-0">
              {farmer.photoUrl ? (
                <img src={farmer.photoUrl} alt={farmer.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                '👨‍🌾'
              )}
            </div>

            {/* Farmer Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{farmer.name}</h1>
              <h2 className="text-2xl text-green-100 mb-2">{farmer.farmName}</h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  📍 {farmer.location}, {farmer.state}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  🌾 {farmer.farmSizeAcres} acres
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  ⏱️ {farmer.yearsExperience} years
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">{stats.totalKgSupplied}</div>
            <div className="text-sm text-gray-600">kg Supplied</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">{stats.mealsImpacted.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Meals Impacted</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-600">{stats.carbonSequestered}</div>
            <div className="text-sm text-gray-600">kg CO₂ Sequestered</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600">{stats.biodiversityScore}/10</div>
            <div className="text-sm text-gray-600">Biodiversity Score</div>
          </div>
        </div>
      )}

      {/* Bio */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Farmer</h3>
        <p className="text-gray-700 leading-relaxed">{farmer.bio}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span>👨‍👩‍👧‍👦 Family of {farmer.familyMembers}</span>
        </div>
      </div>

      {/* Farming Practices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Farming Practices</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {farmer.farmingPractices.map((practice, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
            >
              <span className="text-sm font-medium text-green-800">{practice}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Certifications</h3>
        <div className="flex flex-wrap gap-3">
          {farmer.certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <span className="text-2xl">🏆</span>
              <span className="font-medium text-gray-900">{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Products Grown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {farmer.productsGrown.map((product, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center border border-green-200"
            >
              <div className="text-3xl mb-2">🌾</div>
              <div className="font-medium text-gray-900">{product}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Statement */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Impact</h3>
        <p className="text-gray-700 mb-4">
          When you choose meals made with ingredients from {farmer.farmName}, you're directly supporting 
          {farmer.name}'s family of {farmer.familyMembers} and helping preserve {farmer.farmSizeAcres} acres 
          of biodiverse farmland. Your choice matters!
        </p>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <span>Fair prices paid</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <span>Sustainable practices</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <span>Community supported</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition transform hover:scale-105 shadow-lg">
          🍽️ Order Meals with {farmer.name}'s Produce
        </button>
      </div>
    </div>
  );
};

export default FarmerProfile;
