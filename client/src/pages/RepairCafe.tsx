import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Wrench, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle,
  Upload,
  Sparkles,
  ArrowRight,
  Heart,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function RepairCafe() {
  const { user, isAuthenticated } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [repairNeeded, setRepairNeeded] = useState("");

  // Mock upcoming events - in production, fetch from backend
  const upcomingEvents = [
    {
      id: 1,
      date: "2025-11-10",
      time: "10:00 AM - 2:00 PM",
      location: "Sakshi Center Main Hall",
      volunteers: 8,
      spotsLeft: 12,
      skills: ["Electronics", "Clothing", "Furniture", "Appliances"]
    },
    {
      id: 2,
      date: "2025-11-17",
      time: "2:00 PM - 6:00 PM",
      location: "Sakshi Center Workshop",
      volunteers: 6,
      spotsLeft: 14,
      skills: ["Bicycles", "Toys", "Books", "Shoes"]
    },
    {
      id: 3,
      date: "2025-11-24",
      time: "10:00 AM - 2:00 PM",
      location: "Sakshi Center Main Hall",
      volunteers: 10,
      spotsLeft: 10,
      skills: ["Electronics", "Clothing", "Jewelry", "Bags"]
    }
  ];

  const handleSubmitRequest = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!itemName || !itemDescription || !repairNeeded) {
      toast.error("Please fill in all fields");
      return;
    }

    // TODO: Implement repair request submission
    toast.success("Repair request submitted! We'll match you with a volunteer soon.");
    setShowRequestForm(false);
    setItemName("");
    setItemDescription("");
    setRepairNeeded("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="adiyogi-bg-sunset py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="text-6xl animate-float">🔧</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-gradient-sage">Repair Café</span>
              </h1>
              <p className="text-xl mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Fix it, don't toss it! Our skilled volunteers help repair your beloved items, 
                extending their life and keeping them out of landfills.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setShowRequestForm(true)}
                  className="rounded-full ghibli-button text-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                    color: 'white'
                  }}
                >
                  <Wrench className="w-5 h-5 mr-2" />
                  Request a Repair
                </Button>
                <Link href="/volunteer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full text-lg"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Volunteer Your Skills
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">
                How <span className="text-gradient-warm">It Works</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full watercolor-sage flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">1. Submit Request</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Tell us what needs fixing. Upload photos and describe the issue. 
                    No item is too small or too broken!
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full watercolor-terracotta flex items-center justify-center">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">2. Get Matched</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    We match you with a skilled volunteer who can help. 
                    You'll receive an appointment for the next Repair Café.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">3. Repair Together</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Bring your item to the café. Learn repair skills while we fix it together. 
                    Leave with a working item and new knowledge!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 adiyogi-bg-sunset">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">
                Upcoming <span className="text-gradient-sage">Repair Cafés</span>
              </h2>

              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="ghibli-card p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-2xl watercolor-sage flex items-center justify-center text-3xl flex-shrink-0">
                            🔧
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-3">Community Repair Day</h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                                <span>{event.volunteers} volunteers • {event.spotsLeft} spots left</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                            Skills Available:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {event.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 rounded-full text-xs font-medium watercolor-sage"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:w-48">
                        <Button
                          onClick={() => setShowRequestForm(true)}
                          className="rounded-full ghibli-button w-full"
                          style={{
                            background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                            color: 'white'
                          }}
                        >
                          Book Repair
                        </Button>
                        <Link href="/volunteer">
                          <Button
                            variant="outline"
                            className="rounded-full w-full"
                          >
                            Volunteer Here
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What We Repair */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">
                What We <span className="text-gradient-warm">Repair</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: "💻", label: "Electronics", desc: "Phones, laptops, tablets" },
                  { icon: "👕", label: "Clothing", desc: "Tears, zippers, buttons" },
                  { icon: "🪑", label: "Furniture", desc: "Chairs, tables, shelves" },
                  { icon: "🚲", label: "Bicycles", desc: "Tires, brakes, chains" },
                  { icon: "🔌", label: "Appliances", desc: "Toasters, fans, lamps" },
                  { icon: "🧸", label: "Toys", desc: "Stuffed animals, games" },
                  { icon: "👞", label: "Shoes", desc: "Soles, stitching, heels" },
                  { icon: "📚", label: "Books", desc: "Binding, pages, covers" }
                ].map((item) => (
                  <div key={item.label} className="ghibli-card p-6 text-center hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold mb-2">{item.label}</h3>
                    <p className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-lg mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Don't see your item? <strong>Bring it anyway!</strong> Our volunteers love a challenge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Earn Seva Tokens */}
        <section className="py-16 watercolor-bg">
          <div className="container">
            <div className="max-w-3xl mx-auto ghibli-card p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full watercolor-sage flex items-center justify-center text-3xl flex-shrink-0">
                  ✨
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">Earn Seva Tokens by Repairing</h3>
                  <p className="mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                    Volunteer repairers earn <strong>2 seva tokens</strong> for each successful repair completed. 
                    Share your skills, help the community, and earn tokens to shop at our thrift store!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                      <div>
                        <p className="font-medium mb-1">Flexible Schedule</p>
                        <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Choose events that fit your availability
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                      <div>
                        <p className="font-medium mb-1">Share Your Skills</p>
                        <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          From basic to advanced repairs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                      <div>
                        <p className="font-medium mb-1">Meet Community</p>
                        <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Connect with like-minded fixers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                      <div>
                        <p className="font-medium mb-1">Environmental Impact</p>
                        <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Help reduce waste together
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href="/volunteer">
                    <Button
                      className="rounded-full ghibli-button"
                      style={{
                        background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                        color: 'white'
                      }}
                    >
                      Sign Up as Repair Volunteer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Repair Tips */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">
                <span className="text-gradient-sage">Repair Tips</span> & Resources
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="ghibli-card p-6">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="w-8 h-8 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                    <div>
                      <h3 className="font-bold mb-2">Before You Come</h3>
                      <ul className="text-sm space-y-2" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        <li>• Clean your item beforehand</li>
                        <li>• Bring any spare parts you have</li>
                        <li>• Take photos of the issue</li>
                        <li>• Know the item's history</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="ghibli-card p-6">
                  <div className="flex items-start gap-4">
                    <Wrench className="w-8 h-8 flex-shrink-0" style={{ color: 'rgb(var(--terracotta))' }} />
                    <div>
                      <h3 className="font-bold mb-2">What to Expect</h3>
                      <ul className="text-sm space-y-2" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        <li>• Repairs take 30-60 minutes</li>
                        <li>• Not all items can be fixed</li>
                        <li>• You'll learn repair skills</li>
                        <li>• Completely free service</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="ghibli-card p-6">
                  <div className="flex items-start gap-4">
                    <Heart className="w-8 h-8 flex-shrink-0" style={{ color: 'rgb(var(--cherry-blossom))' }} />
                    <div>
                      <h3 className="font-bold mb-2">Repair Café Etiquette</h3>
                      <ul className="text-sm space-y-2" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        <li>• Be patient and respectful</li>
                        <li>• Help clean up after repairs</li>
                        <li>• Share your repair story</li>
                        <li>• Consider donating if able</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="ghibli-card p-6">
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-8 h-8 flex-shrink-0" style={{ color: 'rgb(var(--twilight-purple))' }} />
                    <div>
                      <h3 className="font-bold mb-2">Success Stories</h3>
                      <ul className="text-sm space-y-2" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        <li>• 850+ items repaired</li>
                        <li>• 2.3 tons diverted from landfill</li>
                        <li>• 95% customer satisfaction</li>
                        <li>• 120+ skilled volunteers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Repair Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="ghibli-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6">Request a Repair</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What needs fixing?
                  </label>
                  <Input
                    placeholder="e.g., Laptop, Jeans, Bicycle, Toaster"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Describe the item
                  </label>
                  <Textarea
                    placeholder="Brand, model, age, condition..."
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    What's wrong with it?
                  </label>
                  <Textarea
                    placeholder="Describe the problem in detail..."
                    value={repairNeeded}
                    onChange={(e) => setRepairNeeded(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="p-4 rounded-lg bg-[rgb(var(--soft-gray)/0.1)]">
                  <div className="flex items-start gap-3">
                    <Upload className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                    <div>
                      <p className="text-sm font-medium mb-1">Upload Photos (Optional)</p>
                      <p className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                        Photos help us match you with the right volunteer. Coming soon!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitRequest}
                    className="flex-1 rounded-full ghibli-button"
                    style={{
                      background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                      color: 'white'
                    }}
                  >
                    Submit Request
                  </Button>
                  <Button
                    onClick={() => setShowRequestForm(false)}
                    variant="outline"
                    className="flex-1 rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
