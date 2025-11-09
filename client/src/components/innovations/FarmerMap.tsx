import React, { useState, useEffect } from 'react';

interface Farmer {
  id: number;
  name: string;
  farmName: string;
  location: string;
  state: string;
  latitude: number;
  longitude: number;
  productsGrown: string[];
  distanceKm: number;
  isOrganic: boolean;
}

interface FarmerMapProps {
  cafeLocationId?: number;
}

export const FarmerMap: React.FC<FarmerMapProps> = ({ cafeLocationId = 1 }) => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterOrganic, setFilterOrganic] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'name'>('distance');

  useEffect(() => {
    fetchFarmers();
  }, [cafeLocationId]);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.farmTransparency.getFarmers.query({
      //   cafeLocationId,
      // });

      // Mock data
      const mockData: Farmer[] = [
        {
          id: 1,
          name: 'Ramesh Kumar',
          farmName: 'Green Valley Organic Farm',
          location: 'Mandya',
          state: 'Karnataka',
          latitude: 12.5226,
          longitude: 76.8951,
          productsGrown: ['Rice', 'Vegetables', 'Turmeric'],
          distanceKm: 85,
          isOrganic: true,
        },
        {
          id: 2,
          name: 'Lakshmi Devi',
          farmName: 'Sunrise Vegetable Farm',
          location: 'Kolar',
          state: 'Karnataka',
          latitude: 13.1372,
          longitude: 78.1294,
          productsGrown: ['Tomatoes', 'Leafy Greens', 'Beans'],
          distanceKm: 72,
          isOrganic: true,
        },
        {
          id: 3,
          name: 'Suresh Reddy',
          farmName: 'Heritage Grains Farm',
          location: 'Tumkur',
          state: 'Karnataka',
          latitude: 13.3392,
          longitude: 77.1011,
          productsGrown: ['Millets', 'Pulses', 'Groundnuts'],
          distanceKm: 68,
          isOrganic: false,
        },
        {
          id: 4,
          name: 'Meera Patel',
          farmName: 'Spice Garden',
          location: 'Chikmagalur',
          state: 'Karnataka',
          latitude: 13.3161,
          longitude: 75.7720,
          productsGrown: ['Cardamom', 'Pepper', 'Ginger'],
          distanceKm: 245,
          isOrganic: true,
        },
      ];

      setFarmers(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch farmers:', error);
      setLoading(false);
    }
  };

  const filteredFarmers = farmers
    .filter(f => !filterOrganic || f.isOrganic)
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return a.name.localeCompare(b.name);
    });

  const avgDistance = farmers.reduce((sum, f) => sum + f.distanceKm, 0) / farmers.length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🗺️ Farm-to-Table Map
        </h1>
        <p className="text-gray-600">
          Meet the farmers who grow your food and see how close they are
        </p>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">{farmers.length}</div>
            <div className="text-sm text-green-100">Partner Farmers</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{farmers.filter(f => f.isOrganic).length}</div>
            <div className="text-sm text-green-100">Organic Certified</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{Math.round(avgDistance)} km</div>
            <div className="text-sm text-green-100">Avg Distance</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {farmers.reduce((sum, f) => sum + f.productsGrown.length, 0)}
            </div>
            <div className="text-sm text-green-100">Products</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filterOrganic}
              onChange={(e) => setFilterOrganic(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Organic Only
            </span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'distance' | 'name')}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="distance">Distance</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Map Placeholder + Farmer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Visualization (Simplified) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Location Map</h3>
          
          {/* Simplified map visualization */}
          <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-96 overflow-hidden border-2 border-gray-200">
            {/* Cafe location (center) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold text-red-600">
                  Sakshi Cafe
                </div>
              </div>
            </div>

            {/* Farmer locations (scattered) */}
            {filteredFarmers.map((farmer, index) => {
              // Simple positioning based on distance and index
              const angle = (index / filteredFarmers.length) * 2 * Math.PI;
              const distance = Math.min(farmer.distanceKm / 3, 120); // Scale down for display
              const x = 50 + Math.cos(angle) * (distance / 2);
              const y = 50 + Math.sin(angle) * (distance / 2);

              return (
                <div
                  key={farmer.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => setSelectedFarmer(farmer)}
                >
                  {/* Farmer marker */}
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-150 ${
                    selectedFarmer?.id === farmer.id ? 'bg-yellow-500 scale-150' : 'bg-green-600'
                  }`}></div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {farmer.name}
                      <div className="text-gray-300">{farmer.distanceKm} km</div>
                    </div>
                  </div>

                  {/* Distance line */}
                  <svg className="absolute top-0 left-0 pointer-events-none" style={{ width: '200%', height: '200%', transform: 'translate(-50%, -50%)' }}>
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${(50 - x) + 50}%`}
                      y2={`${(50 - y) + 50}%`}
                      stroke={selectedFarmer?.id === farmer.id ? '#eab308' : '#d1d5db'}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Sakshi Cafe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Partner Farms</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Click on a farmer marker to see details
          </p>
        </div>

        {/* Farmer List */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">Partner Farmers</h3>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredFarmers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No farmers match your filters</p>
            </div>
          ) : (
            filteredFarmers.map(farmer => (
              <div
                key={farmer.id}
                onClick={() => setSelectedFarmer(farmer)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition hover:shadow-lg ${
                  selectedFarmer?.id === farmer.id ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{farmer.name}</h4>
                    <p className="text-sm text-gray-600">{farmer.farmName}</p>
                  </div>
                  {farmer.isOrganic && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Organic
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>📍 {farmer.location}, {farmer.state}</span>
                  <span>🚗 {farmer.distanceKm} km</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {farmer.productsGrown.slice(0, 3).map((product, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {product}
                    </span>
                  ))}
                  {farmer.productsGrown.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{farmer.productsGrown.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Farmer Detail */}
      {selectedFarmer && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedFarmer.farmName}</h3>
              <p className="text-gray-600">{selectedFarmer.name}</p>
            </div>
            <button
              onClick={() => setSelectedFarmer(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Location</div>
              <div className="font-medium">{selectedFarmer.location}, {selectedFarmer.state}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Distance from Cafe</div>
              <div className="font-medium">{selectedFarmer.distanceKm} km</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Products Grown:</div>
            <div className="flex flex-wrap gap-2">
              {selectedFarmer.productsGrown.map((product, index) => (
                <span
                  key={index}
                  className="bg-white border border-green-300 text-green-800 font-medium px-3 py-1 rounded-full text-sm"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              // TODO: Navigate to farmer profile
              alert(`Navigating to ${selectedFarmer.name}'s full profile...`);
            }}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition"
          >
            View Full Profile →
          </button>
        </div>
      )}
    </div>
  );
};

export default FarmerMap;
