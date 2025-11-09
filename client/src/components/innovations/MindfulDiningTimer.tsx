import React, { useState, useEffect } from 'react';

interface MindfulDiningTimerProps {
  orderId: number;
  onComplete?: (tokensEarned: number) => void;
}

type SessionPhase = 'meditation' | 'eating' | 'completion';

export const MindfulDiningTimer: React.FC<MindfulDiningTimerProps> = ({ orderId, onComplete }) => {
  const [phase, setPhase] = useState<SessionPhase>('meditation');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [meditationTime, setMeditationTime] = useState(120); // 2 minutes in seconds
  const [eatingTime, setEatingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [doshaRating, setDoshaRating] = useState(3);
  const [hadZeroWaste, setHadZeroWaste] = useState(false);
  const [mindfulnessRating, setMindfulnessRating] = useState(3);

  // Meditation timer
  useEffect(() => {
    if (phase === 'meditation' && isRunning && meditationTime > 0) {
      const timer = setInterval(() => {
        setMeditationTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (meditationTime === 0 && phase === 'meditation') {
      handleMeditationComplete();
    }
  }, [phase, isRunning, meditationTime]);

  // Eating timer
  useEffect(() => {
    if (phase === 'eating' && isRunning) {
      const timer = setInterval(() => {
        setEatingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startMeditation = async () => {
    setIsRunning(true);
    // TODO: Start session in backend
    // const result = await trpc.innovations.mindfulDining.startSession.mutate({
    //   orderId,
    //   meditationCompleted: false,
    // });
    // setSessionId(result.sessionId);
    setSessionId(1); // Mock
  };

  const skipMeditation = async () => {
    // TODO: Start session without meditation
    // const result = await trpc.innovations.mindfulDining.startSession.mutate({
    //   orderId,
    //   meditationCompleted: false,
    // });
    // setSessionId(result.sessionId);
    setSessionId(1); // Mock
    setPhase('eating');
    setIsRunning(true);
  };

  const handleMeditationComplete = () => {
    setIsRunning(false);
    setPhase('eating');
    setIsRunning(true);
  };

  const finishMeal = () => {
    setIsRunning(false);
    setPhase('completion');
  };

  const handleComplete = async () => {
    try {
      // TODO: Complete session in backend
      // const result = await trpc.innovations.mindfulDining.completeSession.mutate({
      //   sessionId: sessionId!,
      //   mealDuration: Math.floor(eatingTime / 60),
      //   gratitudeExpressed: gratitudeText.length > 0,
      //   doshaBalanceRating: doshaRating,
      //   hadZeroWaste,
      //   mindfulnessRating,
      //   notes: gratitudeText,
      // });

      // Mock calculation
      let tokensEarned = 0;
      if (Math.floor(eatingTime / 60) >= 20) tokensEarned += 5;
      if (meditationTime === 0) tokensEarned += 10; // Completed meditation
      if (gratitudeText.length > 0) tokensEarned += 5;
      if (hadZeroWaste) tokensEarned += 10;

      if (onComplete) {
        onComplete(tokensEarned);
      }

      alert(`Mindful dining complete! You earned ${tokensEarned} seva tokens 🙏`);
    } catch (error) {
      console.error('Failed to complete session:', error);
      alert('Failed to save session. Please try again.');
    }
  };

  // Meditation Phase
  if (phase === 'meditation') {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧘</div>
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            Pre-Meal Meditation
          </h2>
          <p className="text-purple-700">
            Take a moment to center yourself before eating
          </p>
        </div>

        {!isRunning ? (
          <div className="space-y-4">
            <button
              onClick={startMeditation}
              className="w-full bg-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-700 transition"
            >
              Start 2-Minute Meditation (+10 tokens)
            </button>
            <button
              onClick={skipMeditation}
              className="w-full bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition"
            >
              Skip Meditation
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-8xl font-bold text-purple-600 mb-6">
              {formatTime(meditationTime)}
            </div>
            <div className="bg-purple-100 rounded-lg p-6 mb-6">
              <p className="text-purple-900 italic">
                "Breathe deeply. Feel gratitude for this nourishing meal. 
                Acknowledge all who made it possible - from the earth to your plate."
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleMeditationComplete}
                className="flex-1 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition"
              >
                Finish Early
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Eating Phase
  if (phase === 'eating') {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-3xl font-bold text-green-900 mb-2">
            Mindful Eating
          </h2>
          <p className="text-green-700">
            Savor each bite. Eat slowly and with awareness.
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="text-7xl font-bold text-green-600 mb-2">
            {formatTime(eatingTime)}
          </div>
          <div className="text-sm text-green-700">
            {eatingTime >= 1200 ? '✨ Excellent mindfulness! (20+ min)' : 
             eatingTime >= 900 ? '👍 Good pace (15+ min)' :
             'Take your time...'}
          </div>
        </div>

        <div className="bg-green-100 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-green-900 mb-3">Mindful Eating Tips:</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• Chew each bite 20-30 times</li>
            <li>• Put down your utensils between bites</li>
            <li>• Notice the colors, textures, and flavors</li>
            <li>• Eat without distractions (no phone/TV)</li>
            <li>• Stop when you're 80% full</li>
          </ul>
        </div>

        <button
          onClick={finishMeal}
          className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition"
        >
          I'm Finished Eating
        </button>
      </div>
    );
  }

  // Completion Phase
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🙏</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Reflection & Gratitude
        </h2>
        <p className="text-gray-600">
          Complete your mindful dining experience
        </p>
      </div>

      {/* Meal Duration Summary */}
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Meal Duration:</span>
          <span className="text-2xl font-bold text-green-600">
            {Math.floor(eatingTime / 60)} minutes
          </span>
        </div>
        {Math.floor(eatingTime / 60) >= 20 && (
          <p className="text-sm text-green-700 mt-2">
            ✨ Great job! Eating for 20+ minutes earns +5 tokens
          </p>
        )}
      </div>

      {/* Gratitude */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Express Gratitude (+5 tokens)
        </label>
        <textarea
          value={gratitudeText}
          onChange={(e) => setGratitudeText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          placeholder="What are you grateful for today?"
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">
          {gratitudeText.length}/200 characters
        </p>
      </div>

      {/* Dosha Balance Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How balanced do you feel?
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setDoshaRating(rating)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                doshaRating === rating
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Unbalanced</span>
          <span>Very Balanced</span>
        </div>
      </div>

      {/* Zero Waste */}
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hadZeroWaste}
            onChange={(e) => setHadZeroWaste(e.target.checked)}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="ml-3 text-sm font-medium text-gray-700">
            I had zero food waste (+10 tokens) 🌿
          </span>
        </label>
      </div>

      {/* Mindfulness Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How mindful was your meal?
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setMindfulnessRating(rating)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                mindfulnessRating === rating
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={handleComplete}
        className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition"
      >
        Complete Mindful Dining Experience
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Your responses help us understand the impact of mindful eating
      </p>
    </div>
  );
};

export default MindfulDiningTimer;
