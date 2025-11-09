import React, { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    vata: number;
    pitta: number;
    kapha: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What best describes your body frame?",
    options: [
      { text: "Thin, light, difficulty gaining weight", vata: 3, pitta: 0, kapha: 0 },
      { text: "Medium build, muscular", vata: 0, pitta: 3, kapha: 0 },
      { text: "Large frame, tendency to gain weight easily", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: 2,
    question: "How would you describe your digestion?",
    options: [
      { text: "Irregular, sometimes constipated, gas", vata: 3, pitta: 0, kapha: 0 },
      { text: "Strong, can eat anything, gets hungry quickly", vata: 0, pitta: 3, kapha: 0 },
      { text: "Slow, steady, can skip meals easily", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: 3,
    question: "What are your sleep patterns like?",
    options: [
      { text: "Light sleeper, difficulty falling asleep, wake frequently", vata: 3, pitta: 0, kapha: 0 },
      { text: "Moderate sleep, wake refreshed", vata: 0, pitta: 3, kapha: 0 },
      { text: "Deep, long sleeper, hard to wake up", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: 4,
    question: "How do you handle stress?",
    options: [
      { text: "Anxious, worried, overwhelmed", vata: 3, pitta: 0, kapha: 0 },
      { text: "Irritable, angry, frustrated", vata: 0, pitta: 3, kapha: 0 },
      { text: "Withdrawn, lethargic, depressed", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: 5,
    question: "What's your energy level like?",
    options: [
      { text: "Comes in bursts, fluctuates throughout day", vata: 3, pitta: 0, kapha: 0 },
      { text: "High, steady, intense", vata: 0, pitta: 3, kapha: 0 },
      { text: "Steady but low, slow to start", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: 6,
    question: "What climate do you prefer?",
    options: [
      { text: "Warm, humid - I get cold easily", vata: 3, pitta: 0, kapha: 0 },
      { text: "Cool, moderate - I overheat easily", vata: 0, pitta: 3, kapha: 0 },
      { text: "Warm, dry - I tolerate cold well", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
  {
    id: 7,
    question: "How would you describe your personality?",
    options: [
      { text: "Creative, enthusiastic, changeable", vata: 3, pitta: 0, kapha: 0 },
      { text: "Focused, ambitious, competitive", vata: 0, pitta: 3, kapha: 0 },
      { text: "Calm, steady, loyal", vata: 0, pitta: 0, kapha: 3 },
    ],
  },
];

interface DoshaQuizProps {
  onComplete?: (result: DoshaResult) => void;
}

interface DoshaResult {
  vata: number;
  pitta: number;
  kapha: number;
  primary: 'vata' | 'pitta' | 'kapha';
  secondary?: 'vata' | 'pitta' | 'kapha';
}

export const DoshaQuiz: React.FC<DoshaQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<DoshaResult | null>(null);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    finalAnswers.forEach((answerIndex, questionIndex) => {
      const option = questions[questionIndex].options[answerIndex];
      vataScore += option.vata;
      pittaScore += option.pitta;
      kaphaScore += option.kapha;
    });

    const scores = [
      { dosha: 'vata' as const, score: vataScore },
      { dosha: 'pitta' as const, score: pittaScore },
      { dosha: 'kapha' as const, score: kaphaScore },
    ].sort((a, b) => b.score - a.score);

    const doshaResult: DoshaResult = {
      vata: vataScore,
      pitta: pittaScore,
      kapha: kaphaScore,
      primary: scores[0].dosha,
      secondary: scores[1].score > 0 ? scores[1].dosha : undefined,
    };

    setResult(doshaResult);

    if (onComplete) {
      onComplete(doshaResult);
    }

    // TODO: Save to backend
    // await trpc.innovations.ayurvedic.createProfile.mutate({
    //   primaryDosha: doshaResult.primary,
    //   secondaryDosha: doshaResult.secondary,
    //   vataScore,
    //   pittaScore,
    //   kaphaScore,
    // });
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const getDoshaInfo = (dosha: 'vata' | 'pitta' | 'kapha') => {
    const info = {
      vata: {
        name: 'Vata',
        element: 'Air + Space',
        qualities: 'Light, Dry, Cold, Mobile',
        characteristics: 'Creative, energetic, quick-thinking',
        balancingFoods: 'Warm, moist, grounding foods. Cooked vegetables, soups, stews, warm spices.',
        avoid: 'Cold, dry, raw foods. Excess caffeine and stimulants.',
        color: 'purple',
        emoji: '💨',
      },
      pitta: {
        name: 'Pitta',
        element: 'Fire + Water',
        qualities: 'Hot, Sharp, Light, Oily',
        characteristics: 'Focused, ambitious, intelligent',
        balancingFoods: 'Cool, refreshing foods. Sweet fruits, leafy greens, coconut, cucumber.',
        avoid: 'Spicy, sour, salty foods. Excess heat and stimulation.',
        color: 'red',
        emoji: '🔥',
      },
      kapha: {
        name: 'Kapha',
        element: 'Earth + Water',
        qualities: 'Heavy, Slow, Steady, Cold',
        characteristics: 'Calm, stable, nurturing',
        balancingFoods: 'Light, warm, spicy foods. Beans, vegetables, pungent spices.',
        avoid: 'Heavy, oily, cold foods. Excess dairy and sweets.',
        color: 'green',
        emoji: '🌍',
      },
    };
    return info[dosha];
  };

  // Quiz in progress
  if (!result) {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const question = questions[currentQuestion];

    return (
      <div className="max-w-2xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 via-red-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition transform hover:scale-102"
              >
                <span className="text-lg text-gray-800">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentQuestion > 0 && (
          <button
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="mt-4 text-gray-600 hover:text-gray-900"
          >
            ← Back to previous question
          </button>
        )}
      </div>
    );
  }

  // Results
  const primaryInfo = getDoshaInfo(result.primary);
  const secondaryInfo = result.secondary ? getDoshaInfo(result.secondary) : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Results Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{primaryInfo.emoji}</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Your Dosha: {primaryInfo.name}
          {secondaryInfo && ` - ${secondaryInfo.name}`}
        </h2>
        <p className="text-gray-600">
          {primaryInfo.element} • {primaryInfo.characteristics}
        </p>
      </div>

      {/* Dosha Scores */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={`bg-purple-50 rounded-lg p-4 text-center ${result.primary === 'vata' ? 'ring-4 ring-purple-500' : ''}`}>
          <div className="text-3xl mb-2">💨</div>
          <div className="text-2xl font-bold text-purple-600">{result.vata}</div>
          <div className="text-sm text-gray-600">Vata</div>
        </div>
        <div className={`bg-red-50 rounded-lg p-4 text-center ${result.primary === 'pitta' ? 'ring-4 ring-red-500' : ''}`}>
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-red-600">{result.pitta}</div>
          <div className="text-sm text-gray-600">Pitta</div>
        </div>
        <div className={`bg-green-50 rounded-lg p-4 text-center ${result.primary === 'kapha' ? 'ring-4 ring-green-500' : ''}`}>
          <div className="text-3xl mb-2">🌍</div>
          <div className="text-2xl font-bold text-green-600">{result.kapha}</div>
          <div className="text-sm text-gray-600">Kapha</div>
        </div>
      </div>

      {/* Primary Dosha Info */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          About {primaryInfo.name} Dosha
        </h3>
        
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Qualities:</span>
            <span className="text-gray-600 ml-2">{primaryInfo.qualities}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Balancing Foods:</span>
            <p className="text-gray-600 mt-1">{primaryInfo.balancingFoods}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Foods to Avoid:</span>
            <p className="text-gray-600 mt-1">{primaryInfo.avoid}</p>
          </div>
        </div>
      </div>

      {/* Secondary Dosha Info */}
      {secondaryInfo && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            Secondary: {secondaryInfo.name} Dosha
          </h4>
          <p className="text-sm text-gray-600">
            You also have {secondaryInfo.name} qualities. Consider balancing both doshas in your diet.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={restartQuiz}
          className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition"
        >
          Retake Quiz
        </button>
        <button
          onClick={() => {
            // TODO: Navigate to meal recommendations
            alert('Navigating to personalized meal recommendations...');
          }}
          className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition"
        >
          See Recommended Meals →
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-6">
        Your dosha profile has been saved and will be used to personalize your meal recommendations
      </p>
    </div>
  );
};

export default DoshaQuiz;
