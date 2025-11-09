import React, { useState } from 'react';

interface MealSponsorProps {
  onSponsor?: (mealCount: number, amount: number) => void;
}

export const MealSponsor: React.FC<MealSponsorProps> = ({ onSponsor }) => {
  const [mealCount, setMealCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  const pricePerMeal = 50; // ₹50 per meal

  const handleSponsor = async () => {
    setLoading(true);
    try {
      // TODO: Call API
      // await trpc.innovations.sponsorships.create.mutate({
      //   mealCount,
      //   amountPaid: mealCount * pricePerMeal * 100, // Convert to paise
      //   message,
      //   isAnonymous,
      // });
      
      if (onSponsor) {
        onSponsor(mealCount, mealCount * pricePerMeal);
      }
      
      alert(`Thank you for sponsoring ${mealCount} meal(s)!`);
      setMealCount(1);
      setMessage('');
    } catch (error) {
      console.error('Sponsorship failed:', error);
      alert('Failed to create sponsorship. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h3 className="text-2xl font-bold text-green-800 mb-4">
        🤝 Sponsor a Meal
      </h3>
      
      <p className="text-gray-600 mb-6">
        Help someone in need enjoy a healthy, plant-based meal. Your generosity makes sustainable living accessible to all.
      </p>

      {/* Meal count selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Meals
        </label>
        <div className="flex gap-2">
          {[1, 5, 10, 20].map((count) => (
            <button
              key={count}
              onClick={() => setMealCount(count)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mealCount === count
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
        
        <div className="mt-2">
          <input
            type="number"
            min="1"
            max="100"
            value={mealCount}
            onChange={(e) => setMealCount(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Custom amount"
          />
        </div>
      </div>

      {/* Total amount */}
      <div className="bg-green-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-green-800">
            ₹{mealCount * pricePerMeal}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          ₹{pricePerMeal} per meal
        </p>
      </div>

      {/* Optional message */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message (Optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          placeholder="Add a message of hope..."
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">
          {message.length}/200 characters
        </p>
      </div>

      {/* Anonymous checkbox */}
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Keep my donation anonymous
          </span>
        </label>
      </div>

      {/* Sponsor button */}
      <button
        onClick={handleSponsor}
        disabled={loading || mealCount < 1}
        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Sponsor ${mealCount} Meal${mealCount > 1 ? 's' : ''}`}
      </button>

      {/* Impact message */}
      <p className="text-xs text-gray-500 text-center mt-4">
        🌿 100% of your donation goes directly to providing meals. Tax receipt will be emailed.
      </p>
    </div>
  );
};

export default MealSponsor;
