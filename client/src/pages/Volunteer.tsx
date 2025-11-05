import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Volunteer() {
  const { user, isAuthenticated } = useAuth();
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  const { data: myShifts } = trpc.volunteer.getMyShifts.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Sample shifts for demo
  const shifts = [
    {
      id: 1,
      activity: "Sorting & Organization",
      title: "Weekend Donation Sort",
      description: "Help sort and organize incoming donations. Perfect for first-time volunteers!",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      startTime: "10:00 AM",
      endTime: "2:00 PM",
      tokensPerHour: 10,
      maxVolunteers: 8,
      currentVolunteers: 3,
    },
    {
      id: 2,
      activity: "Repair Café",
      title: "Fix-It Saturday",
      description: "Use your repair skills to help fix items for community members. Bring your tools!",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      startTime: "1:00 PM",
      endTime: "5:00 PM",
      tokensPerHour: 15,
      maxVolunteers: 6,
      currentVolunteers: 2,
    },
    {
      id: 3,
      activity: "Upcycle Studio",
      title: "Creative Upcycling Workshop",
      description: "Transform old items into new treasures. All skill levels welcome!",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startTime: "11:00 AM",
      endTime: "3:00 PM",
      tokensPerHour: 12,
      maxVolunteers: 10,
      currentVolunteers: 5,
    },
  ];

  const isLoading = false;

  const handleSignup = (shiftId: number) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    toast.info("Shift signup coming soon! We'll notify you when this feature is ready.");
  };

  const myShiftIds = new Set();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="adiyogi-bg-2 py-16 md:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="text-6xl animate-float">✨</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Volunteer & Earn <span className="text-gradient-sage">Seva Tokens</span>
              </h1>
              <p className="text-lg md:text-xl mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Give your time, gain community, and earn tokens to shop with
              </p>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  onClick={() => window.location.href = getLoginUrl()}
                  className="rounded-full ghibli-button text-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                    color: 'white'
                  }}
                >
                  Sign In to Volunteer
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Why Volunteer */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why <span className="text-gradient-warm">Volunteer?</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Volunteering at Sakshi is more than just earning tokens—it's about building community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="ghibli-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full watercolor-sage flex items-center justify-center">
                  <Sparkles className="w-8 h-8" style={{ color: 'rgb(var(--sage-green))' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Earn Seva Tokens</h3>
                <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  10-15 tokens per hour depending on the activity. Use them to shop without spending money!
                </p>
              </div>

              <div className="ghibli-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full watercolor-sky flex items-center justify-center">
                  <Users className="w-8 h-8" style={{ color: 'rgb(var(--sky-blue))' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Meet Amazing People</h3>
                <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Connect with like-minded community members who share your values
                </p>
              </div>

              <div className="ghibli-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full watercolor-terracotta flex items-center justify-center">
                  <Heart className="w-8 h-8" style={{ color: 'rgb(var(--terracotta))' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Make a Difference</h3>
                <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Help divert items from landfills and support families in need
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Shifts */}
        <section className="py-16 adiyogi-bg-2">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Available <span className="text-gradient-sage">Shifts</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Choose a shift that works for your schedule
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="ghibli-card p-6 animate-pulse">
                    <div className="h-6 bg-[rgb(var(--soft-gray)/0.2)] rounded mb-4" />
                    <div className="h-4 bg-[rgb(var(--soft-gray)/0.2)] rounded mb-2" />
                    <div className="h-4 bg-[rgb(var(--soft-gray)/0.2)] rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {shifts?.map((shift: any) => {
                  const isSignedUp = myShiftIds.has(shift.id);
                  const isFull = shift.currentVolunteers >= shift.maxVolunteers;
                  const spotsLeft = shift.maxVolunteers - shift.currentVolunteers;

                  return (
                    <div key={shift.id} className="ghibli-card p-6">
                      {/* Activity Badge */}
                      <div className="mb-4">
                        <span className="text-xs px-3 py-1 rounded-full watercolor-sage font-medium">
                          {shift.activity}
                        </span>
                      </div>

                      {/* Shift Title */}
                      <h3 className="text-xl font-bold mb-3">{shift.title}</h3>

                      {/* Description */}
                      <p className="text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                        {shift.description}
                      </p>

                      {/* Date & Time */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                          <span>{new Date(shift.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                          <span>{shift.startTime} - {shift.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                          <span className="font-medium">{shift.tokensPerHour} tokens/hour</span>
                        </div>
                      </div>

                      {/* Spots Available */}
                      <div className="mb-4">
                        {isFull ? (
                          <p className="text-sm text-red-500 font-medium">Shift Full</p>
                        ) : (
                          <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                            {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                          </p>
                        )}
                      </div>

                      {/* Signup Button */}
                      {isSignedUp ? (
                        <Button
                          disabled
                          className="w-full rounded-full"
                          style={{
                            background: 'rgb(var(--sage-green))',
                            color: 'white',
                            opacity: 0.7
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Signed Up
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSignup(shift.id)}
                          disabled={isFull}
                          className="w-full rounded-full ghibli-button"
                          style={{
                            background: isFull 
                              ? 'rgb(var(--soft-gray))' 
                              : 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                            color: 'white'
                          }}
                        >
                          {isFull ? 'Full' : 'Sign Up'}
                          {!isFull && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {shifts && shifts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  No shifts available right now. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* My Upcoming Shifts */}
        {isAuthenticated && myShifts && myShifts.length > 0 && (
          <section className="py-16">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">
                  My <span className="text-gradient-sage">Upcoming Shifts</span>
                </h2>

                <div className="space-y-4">
                  {myShifts.map((signup: any) => (
                    <div key={signup.id} className="ghibli-card p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{signup.shift.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(signup.shift.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{signup.shift.startTime} - {signup.shift.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              <span className="font-medium">{signup.shift.tokensPerHour} tokens/hour</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            signup.status === 'confirmed' 
                              ? 'watercolor-sage' 
                              : signup.status === 'completed'
                              ? 'watercolor-terracotta'
                              : 'bg-[rgb(var(--soft-gray)/0.2)]'
                          }`}>
                            {signup.status.charAt(0).toUpperCase() + signup.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 watercolor-bg">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Join our community of volunteers and start earning seva tokens today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isAuthenticated ? (
                  <Button
                    size="lg"
                    onClick={() => window.location.href = getLoginUrl()}
                    className="rounded-full ghibli-button text-lg px-8"
                    style={{
                      background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                      color: 'white'
                    }}
                  >
                    Sign In to Volunteer
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="rounded-full ghibli-button text-lg px-8"
                      style={{
                        background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                        color: 'white'
                      }}
                    >
                      View Shifts
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Link href="/how-it-works">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full text-lg px-8"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
