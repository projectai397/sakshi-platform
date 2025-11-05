import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, Users, MapPin, Search, Filter } from "lucide-react";

export default function Retreats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Sample retreat data (will be replaced with API call)
  const retreats = [
    {
      id: 1,
      title: "10-Day Vipassana Intensive",
      teacher: "S.N. Goenka Tradition",
      duration: "10 days",
      type: "vipassana",
      startDate: "2025-12-01",
      endDate: "2025-12-11",
      location: "Silent Village, Madhya Pradesh",
      capacity: 50,
      enrolled: 32,
      price: {
        standard: 15000,
        subsidized: 8000,
        scholarship: 0,
      },
      description: "Traditional 10-day Vipassana retreat in the lineage of S.N. Goenka. Noble silence, body scanning meditation, and dhamma talks.",
      image: "🧘",
      level: "All levels",
    },
    {
      id: 2,
      title: "21-Day Insight Meditation",
      teacher: "Ajahn Amaro",
      duration: "21 days",
      type: "insight",
      startDate: "2025-12-15",
      endDate: "2026-01-05",
      location: "Silent Village, Madhya Pradesh",
      capacity: 30,
      enrolled: 18,
      price: {
        standard: 35000,
        subsidized: 18000,
        scholarship: 0,
      },
      description: "Extended insight meditation retreat with daily interviews, walking meditation, and teachings on the Four Noble Truths.",
      image: "🌙",
      level: "Intermediate to Advanced",
    },
    {
      id: 3,
      title: "3-Day Introduction to Meditation",
      teacher: "Dr. Priya Sharma",
      duration: "3 days",
      type: "beginner",
      startDate: "2025-11-20",
      endDate: "2025-11-23",
      location: "Silent Village, Madhya Pradesh",
      capacity: 40,
      enrolled: 35,
      price: {
        standard: 5000,
        subsidized: 2500,
        scholarship: 0,
      },
      description: "Perfect for beginners. Learn basic meditation techniques, mindfulness practices, and establish a daily practice.",
      image: "🌱",
      level: "Beginner",
    },
    {
      id: 4,
      title: "7-Day Metta (Loving-Kindness) Retreat",
      teacher: "Sharon Salzberg",
      duration: "7 days",
      type: "metta",
      startDate: "2025-12-08",
      endDate: "2025-12-15",
      location: "Silent Village, Madhya Pradesh",
      capacity: 35,
      enrolled: 28,
      price: {
        standard: 12000,
        subsidized: 6000,
        scholarship: 0,
      },
      description: "Cultivate loving-kindness, compassion, and joy through metta meditation practices. Includes guided meditations and dharma talks.",
      image: "💚",
      level: "All levels",
    },
    {
      id: 5,
      title: "30-Day Silent Retreat",
      teacher: "Multiple Teachers",
      duration: "30 days",
      type: "intensive",
      startDate: "2026-01-10",
      endDate: "2026-02-09",
      location: "Silent Village, Madhya Pradesh",
      capacity: 20,
      enrolled: 12,
      price: {
        standard: 50000,
        subsidized: 25000,
        scholarship: 0,
      },
      description: "Deep dive into meditation practice with complete noble silence, daily sits, walking meditation, and individual guidance.",
      image: "🏔️",
      level: "Advanced (requires interview)",
    },
  ];

  const filteredRetreats = retreats.filter((retreat) => {
    const matchesSearch = retreat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         retreat.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDuration = durationFilter === "all" || 
                           (durationFilter === "short" && parseInt(retreat.duration) <= 7) ||
                           (durationFilter === "medium" && parseInt(retreat.duration) > 7 && parseInt(retreat.duration) <= 14) ||
                           (durationFilter === "long" && parseInt(retreat.duration) > 14);
    const matchesType = typeFilter === "all" || retreat.type === typeFilter;
    
    return matchesSearch && matchesDuration && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-ghibli-sky/10 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ghibli-sky/20 via-transparent to-ghibli-sage/20" />
        
        <div className="container relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-ghibli-sky/20 rounded-full border-2 border-ghibli-sky/30">
            <span className="text-ghibli-sky font-semibold">🧘 Transform Through Silence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-ghibli-forest leading-tight">
            Silent Retreats
          </h1>
          
          <p className="text-2xl md:text-3xl text-ghibli-forest/70 mb-4 font-handwriting">
            मौन में मिलती है शांति
          </p>
          
          <p className="text-xl text-ghibli-forest/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in meditation practice. From 3-day introductions to 30-day intensives,
            find the retreat that matches your journey.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 bg-white/50 border-y border-ghibli-forest/10">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ghibli-forest/40" />
              <Input
                placeholder="Search retreats or teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Duration Filter */}
            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="short">Short (≤7 days)</SelectItem>
                <SelectItem value="medium">Medium (8-14 days)</SelectItem>
                <SelectItem value="long">Long (15+ days)</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="vipassana">Vipassana</SelectItem>
                <SelectItem value="insight">Insight</SelectItem>
                <SelectItem value="metta">Metta</SelectItem>
                <SelectItem value="intensive">Intensive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Retreats Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          {filteredRetreats.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-ghibli-forest/60">No retreats found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredRetreats.map((retreat) => (
                <Card key={retreat.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Retreat Header */}
                  <div className="bg-gradient-to-br from-ghibli-sky/20 to-ghibli-sage/20 p-8 text-center">
                    <div className="text-6xl mb-4">{retreat.image}</div>
                    <h3 className="text-2xl font-bold text-ghibli-forest mb-2">{retreat.title}</h3>
                    <p className="text-ghibli-forest/70 font-semibold">{retreat.teacher}</p>
                  </div>

                  {/* Retreat Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-ghibli-sage/10 text-ghibli-sage rounded-full text-sm font-semibold">
                        {retreat.level}
                      </span>
                      <span className="px-3 py-1 bg-ghibli-sky/10 text-ghibli-sky rounded-full text-sm font-semibold">
                        {retreat.duration}
                      </span>
                    </div>

                    <p className="text-ghibli-forest/80 leading-relaxed">{retreat.description}</p>

                    <div className="space-y-2 text-sm text-ghibli-forest/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-ghibli-sage" />
                        <span>{new Date(retreat.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(retreat.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-ghibli-sage" />
                        <span>{retreat.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-ghibli-sage" />
                        <span>{retreat.enrolled}/{retreat.capacity} enrolled</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-4 border-t border-ghibli-forest/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-ghibli-forest/60">Standard Price</span>
                        <span className="text-xl font-bold text-ghibli-forest">₹{retreat.price.standard.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-ghibli-forest/60 mb-4">
                        Subsidized: ₹{retreat.price.subsidized.toLocaleString()} • Scholarships available
                      </div>
                      <Link href={`/retreats/${retreat.id}`}>
                        <Button className="w-full bg-ghibli-sage hover:bg-ghibli-sage/90">
                          View Details & Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-ghibli-sage/10 to-transparent">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-ghibli-forest">
            What to Expect
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <Card className="p-6">
              <div className="text-3xl mb-3">🤫</div>
              <h3 className="text-xl font-bold mb-2 text-ghibli-forest">Noble Silence</h3>
              <p className="text-ghibli-forest/70">Complete silence of body, speech, and mind. No phones, books, or distractions.</p>
            </Card>
            <Card className="p-6">
              <div className="text-3xl mb-3">🍲</div>
              <h3 className="text-xl font-bold mb-2 text-ghibli-forest">Sattvic Meals</h3>
              <p className="text-ghibli-forest/70">Simple vegetarian food from our organic farm. Breakfast, lunch, and light dinner.</p>
            </Card>
            <Card className="p-6">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-xl font-bold mb-2 text-ghibli-forest">Teacher Guidance</h3>
              <p className="text-ghibli-forest/70">Daily dharma talks, optional individual interviews, and group meditation.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-ghibli-forest">
            Not Sure Which Retreat?
          </h2>
          <p className="text-xl text-ghibli-forest/80 mb-8">
            Contact us for guidance on choosing the right retreat for your practice level and goals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-6 bg-ghibli-forest hover:bg-ghibli-forest/90">
                Get Guidance
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-ghibli-forest text-ghibli-forest hover:bg-ghibli-forest/10">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
