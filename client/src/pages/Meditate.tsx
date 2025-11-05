import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import {
  Play,
  Pause,
  RotateCcw,
  Heart,
  Brain,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Meditate() {
  const { user, isAuthenticated } = useAuth();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [targetDuration, setTargetDuration] = useState(10);
  const [emotionalState, setEmotionalState] = useState("");
  const [intention, setIntention] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [aiGuidance, setAiGuidance] = useState("");
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);
  const [showPostSession, setShowPostSession] = useState(false);
  const [postSessionMood, setPostSessionMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");

  // Sample meditation techniques
  const techniques = [
    {
      id: "breath",
      name: "Breath Awareness",
      icon: "🌬️",
      description: "Focus on the natural rhythm of your breath",
      duration: "5-20 min",
    },
    {
      id: "body-scan",
      name: "Body Scan",
      icon: "🧘",
      description: "Progressive relaxation through body awareness",
      duration: "10-30 min",
    },
    {
      id: "metta",
      name: "Loving-Kindness",
      icon: "💚",
      description: "Cultivate compassion for self and others",
      duration: "10-20 min",
    },
    {
      id: "vipassana",
      name: "Insight Meditation",
      icon: "👁️",
      description: "Observe sensations with equanimity",
      duration: "20-60 min",
    },
  ];

  // Sample user stats (would come from API)
  const userStats = {
    totalSessions: 47,
    totalMinutes: 823,
    currentStreak: 12,
    longestStreak: 28,
    sevaTokensEarned: 15,
  };

  const handleStartSession = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!emotionalState || !intention) {
      toast.error("Please share your current state and intention");
      return;
    }

    setIsLoadingGuidance(true);
    
    // Simulate AI guidance generation (would use invokeLLM in real implementation)
    setTimeout(() => {
      const guidance = `Based on your ${emotionalState} state and intention to ${intention}, I recommend starting with gentle breath awareness. 
      
Find a comfortable seated position. Close your eyes gently. Take three deep breaths to settle in.

Now, simply observe your natural breath. No need to control it. Notice the cool air entering your nostrils, the gentle rise and fall of your chest.

When your mind wanders (and it will), gently bring your attention back to the breath. Each return is a moment of mindfulness.

I'll be here to guide you. Let's begin.`;
      
      setAiGuidance(guidance);
      setIsSessionActive(true);
      setIsLoadingGuidance(false);
      toast.success("Session started. May you find peace.");
    }, 2000);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Session resumed" : "Session paused");
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    setIsPaused(false);
    setShowPostSession(true);
  };

  const handleSaveReflection = () => {
    // In real implementation, this would save to database via tRPC
    toast.success(`Reflection saved! You earned 2 seva tokens. 🌟`);
    setShowPostSession(false);
    setSessionTime(0);
    setPostSessionMood("");
    setJournalEntry("");
    setEmotionalState("");
    setIntention("");
  };

  const handleSkipReflection = () => {
    toast.success(`Session complete! You earned 2 seva tokens. 🌟`);
    setShowPostSession(false);
    setSessionTime(0);
    setPostSessionMood("");
    setJournalEntry("");
    setEmotionalState("");
    setIntention("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-ghibli-sky/10 to-white">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md p-8 text-center">
            <div className="text-6xl mb-4">🧘</div>
            <h2 className="text-2xl font-bold mb-4 text-ghibli-forest">
              Sign In to Meditate
            </h2>
            <p className="text-ghibli-forest/70 mb-6">
              Track your practice, earn seva tokens, and receive personalized AI guidance.
            </p>
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              className="w-full bg-ghibli-sage hover:bg-ghibli-sage/90"
            >
              Sign In to Continue
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-ghibli-sky/10 to-white">
      <Navigation />

      <div className="container max-w-6xl mx-auto px-4 py-12">
        {showPostSession ? (
          /* Post-Session Reflection */
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-3xl font-bold mb-2 text-ghibli-forest">
                  Session Complete!
                </h2>
                <p className="text-ghibli-forest/70">
                  Take a moment to reflect on your practice
                </p>
              </div>

              <div className="space-y-6">
                {/* Mood Selector */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-ghibli-forest">
                    How do you feel now?
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { emoji: "😌", label: "Calm", value: "calm" },
                      { emoji: "😊", label: "Happy", value: "happy" },
                      { emoji: "🙏", label: "Grateful", value: "grateful" },
                      { emoji: "💪", label: "Energized", value: "energized" },
                      { emoji: "😴", label: "Relaxed", value: "relaxed" },
                    ].map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setPostSessionMood(mood.value)}
                        className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                          postSessionMood === mood.value
                            ? "border-ghibli-sage bg-ghibli-sage/10"
                            : "border-ghibli-forest/10 hover:border-ghibli-sage/50"
                        }`}
                      >
                        <div className="text-3xl mb-1">{mood.emoji}</div>
                        <div className="text-xs text-ghibli-forest/70">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Journal Entry */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-ghibli-forest">
                    Journal Your Thoughts (Optional)
                  </label>
                  <Textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="What did you notice during your practice? Any insights or observations..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-ghibli-forest/60 mt-1">
                    Your journal is private and helps track your meditation journey
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveReflection}
                    disabled={!postSessionMood}
                    className="flex-1 bg-ghibli-sage hover:bg-ghibli-sage/90"
                  >
                    Save Reflection
                  </Button>
                  <Button
                    onClick={handleSkipReflection}
                    variant="outline"
                    className="flex-1"
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : !isSessionActive ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ghibli-forest">
                AI Meditation Guide
              </h1>
              <p className="text-xl text-ghibli-forest/70 font-handwriting">
                मन की शांति, AI के साथ
              </p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-ghibli-sage">{userStats.totalSessions}</div>
                <div className="text-sm text-ghibli-forest/60">Sessions</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-ghibli-sage">{userStats.totalMinutes}</div>
                <div className="text-sm text-ghibli-forest/60">Minutes</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-ghibli-sage">{userStats.currentStreak}</div>
                <div className="text-sm text-ghibli-forest/60">Day Streak</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-ghibli-sage">{userStats.longestStreak}</div>
                <div className="text-sm text-ghibli-forest/60">Best Streak</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-ghibli-terracotta">{userStats.sevaTokensEarned}</div>
                <div className="text-sm text-ghibli-forest/60">Tokens Earned</div>
              </Card>
            </div>

            {/* Meditation Techniques */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-ghibli-forest">Choose Your Practice</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {techniques.map((technique) => (
                  <Card key={technique.id} className="p-6 hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="text-4xl mb-3">{technique.icon}</div>
                    <h3 className="text-lg font-bold mb-2 text-ghibli-forest">{technique.name}</h3>
                    <p className="text-sm text-ghibli-forest/70 mb-3">{technique.description}</p>
                    <div className="text-xs text-ghibli-sage font-semibold">{technique.duration}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Session Setup */}
            <Card className="p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-ghibli-forest">Start Your Session</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-ghibli-forest">
                    How are you feeling right now?
                  </label>
                  <Textarea
                    value={emotionalState}
                    onChange={(e) => setEmotionalState(e.target.value)}
                    placeholder="E.g., anxious, peaceful, restless, grateful..."
                    rows={3}
                  />
                  <p className="text-xs text-ghibli-forest/60 mt-1">
                    This helps the AI provide personalized guidance
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-ghibli-forest">
                    What's your intention for this session?
                  </label>
                  <Textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="E.g., find calm, develop focus, cultivate compassion..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-4 text-ghibli-forest">
                    Session Duration: {targetDuration} minutes
                  </label>
                  <Slider
                    value={[targetDuration]}
                    onValueChange={(value) => setTargetDuration(value[0])}
                    min={5}
                    max={60}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-ghibli-forest/60">
                    <span>5 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                <Button
                  onClick={handleStartSession}
                  disabled={isLoadingGuidance}
                  className="w-full bg-ghibli-sage hover:bg-ghibli-sage/90 text-lg py-6"
                >
                  {isLoadingGuidance ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Preparing Your Session...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Begin Meditation
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </>
        ) : (
          /* Active Session View */
          <div className="max-w-3xl mx-auto">
            {/* Timer Display */}
            <Card className="p-12 text-center mb-8 bg-gradient-to-br from-ghibli-sky/10 to-ghibli-sage/10">
              <div className="text-7xl font-bold text-ghibli-forest mb-4">
                {formatTime(sessionTime)}
              </div>
              <div className="text-lg text-ghibli-forest/60 mb-8">
                of {targetDuration} minutes
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-ghibli-forest/10 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-ghibli-sage transition-all duration-1000"
                  style={{ width: `${(sessionTime / (targetDuration * 60)) * 100}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handlePauseResume}
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  {isPaused ? (
                    <><Play className="w-5 h-5 mr-2" /> Resume</>
                  ) : (
                    <><Pause className="w-5 h-5 mr-2" /> Pause</>
                  )}
                </Button>
                <Button
                  onClick={handleEndSession}
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  End Session
                </Button>
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </Card>

            {/* AI Guidance */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-ghibli-sage" />
                <h3 className="text-xl font-bold text-ghibli-forest">AI Guidance</h3>
              </div>
              <div className="prose prose-sm max-w-none text-ghibli-forest/80 whitespace-pre-line leading-relaxed">
                {aiGuidance}
              </div>
            </Card>

            {/* Breathing Animation */}
            <div className="mt-8 text-center">
              <div className="inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ghibli-sage/30 to-ghibli-sky/30 animate-pulse flex items-center justify-center">
                  <Heart className="w-16 h-16 text-ghibli-sage" />
                </div>
                <p className="text-sm text-ghibli-forest/60 mt-4">Breathe naturally</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
