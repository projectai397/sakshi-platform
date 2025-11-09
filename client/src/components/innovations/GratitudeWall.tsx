import React, { useState, useEffect } from 'react';

interface GratitudeNote {
  id: number;
  customerId: number;
  customerName?: string;
  gratitudeText: string;
  isPublic: boolean;
  createdAt: string;
}

export const GratitudeWall: React.FC = () => {
  const [notes, setNotes] = useState<GratitudeNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGratitude, setNewGratitude] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGratitude();
  }, []);

  const fetchGratitude = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual tRPC call
      // const data = await trpc.innovations.mindfulDining.getPublicGratitude.query({
      //   limit: 50,
      // });

      // Mock data
      const mockData: GratitudeNote[] = [
        {
          id: 1,
          customerId: 1,
          customerName: 'Priya S.',
          gratitudeText: 'Grateful for this nourishing meal and the farmers who grew these vegetables with love. 🙏',
          isPublic: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          customerId: 2,
          customerName: 'Raj K.',
          gratitudeText: 'Thank you for making healthy food accessible to everyone. This meal brought me peace today.',
          isPublic: true,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          customerId: 3,
          customerName: 'Anonymous',
          gratitudeText: 'Grateful for the community that sponsored my meal today. Your kindness means everything. 💚',
          isPublic: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          customerId: 4,
          customerName: 'Meera D.',
          gratitudeText: 'Thankful for the earth, the sun, the rain, and all who made this meal possible.',
          isPublic: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 5,
          customerId: 5,
          customerName: 'Arjun M.',
          gratitudeText: 'This kitchari bowl warmed not just my body but my soul. Grateful for conscious food. 🍲',
          isPublic: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 6,
          customerId: 6,
          customerName: 'Lakshmi P.',
          gratitudeText: 'Grateful for the opportunity to eat mindfully and support sustainable farming.',
          isPublic: true,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setNotes(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch gratitude notes:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newGratitude.trim().length < 10) {
      alert('Please write at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Submit to backend
      // await trpc.innovations.mindfulDining.addGratitude.mutate({
      //   gratitudeText: newGratitude,
      //   isPublic,
      // });

      // Add to local state (mock)
      const newNote: GratitudeNote = {
        id: Date.now(),
        customerId: 999,
        customerName: 'You',
        gratitudeText: newGratitude,
        isPublic,
        createdAt: new Date().toISOString(),
      };

      setNotes([newNote, ...notes]);
      setNewGratitude('');
      setShowAddForm(false);
      alert('Thank you for sharing your gratitude! You earned 5 seva tokens. 🙏');
    } catch (error) {
      console.error('Failed to submit gratitude:', error);
      alert('Failed to submit. Please try again.');
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
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const colors = [
    'from-purple-50 to-pink-50 border-purple-200',
    'from-blue-50 to-cyan-50 border-blue-200',
    'from-green-50 to-emerald-50 border-green-200',
    'from-yellow-50 to-orange-50 border-yellow-200',
    'from-rose-50 to-red-50 border-rose-200',
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🙏 Gratitude Wall
        </h1>
        <p className="text-gray-600 mb-6">
          A space to express and share gratitude for our food, farmers, and community
        </p>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
        >
          {showAddForm ? 'Cancel' : '✨ Add Your Gratitude (+5 tokens)'}
        </button>
      </div>

      {/* Add Gratitude Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-green-300">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you grateful for today?
            </label>
            <textarea
              value={newGratitude}
              onChange={(e) => setNewGratitude(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Express your gratitude... (min 10 characters)"
              maxLength={500}
              required
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">
                  {newGratitude.length}/500 characters
                </span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Share publicly on gratitude wall
                  </span>
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting || newGratitude.trim().length < 10}
                className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Share Gratitude'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gratitude Notes - Masonry Layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-2">No gratitude notes yet</p>
          <p>Be the first to share your gratitude!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <div
              key={note.id}
              className={`bg-gradient-to-br ${colors[index % colors.length]} rounded-lg shadow-md p-6 border-2 transform hover:scale-105 transition duration-200`}
            >
              {/* Quote Icon */}
              <div className="text-4xl text-gray-300 mb-2">"</div>
              
              {/* Gratitude Text */}
              <p className="text-gray-800 italic mb-4 leading-relaxed">
                {note.gratitudeText}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">
                  — {note.customerName || 'Anonymous'}
                </span>
                <span className="text-gray-500">
                  {getTimeAgo(note.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-900">
          <strong>💡 Did you know?</strong> Expressing gratitude before meals improves digestion and mindfulness. 
          Share your gratitude and earn 5 seva tokens!
        </p>
      </div>
    </div>
  );
};

export default GratitudeWall;
