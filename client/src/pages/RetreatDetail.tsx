import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Heart,
  Sparkles,
  CheckCircle2,
  Home,
  Utensils,
  Award,
} from "lucide-react";
import { getLoginUrl } from "@/const";

export default function RetreatDetail() {
  const { user, isAuthenticated } = useAuth();
  const [, params] = useRoute("/retreats/:id");
  
  // In real implementation, fetch retreat data based on params.id
  // For now, using sample data
  const retreat = {
    id: 1,
    title: "10-Day Vipassana Meditation Retreat",
    teacher: {
      name: "Venerable Bhante Gunaratana",
      title: "Senior Meditation Master",
      bio: "Bhante G has been teaching meditation for over 50 years. Author of 'Mindfulness in Plain English', he brings deep wisdom and compassionate guidance to all students.",
      photo: "👨‍🏫",
      certifications: ["Theravada Buddhist Monk", "40+ Years Teaching", "Author & Scholar"],
    },
    dates: {
      start: "March 15, 2025",
      end: "March 25, 2025",
      duration: "10 days",
    },
    location: "Sakshi Silent Village, Himachal Pradesh",
    capacity: 30,
    enrolled: 18,
    pricing: {
      standard: 15000,
      subsidized: 8000,
      scholarship: 0,
    },
    description: "Experience the profound practice of Vipassana meditation in the serene environment of our Silent Village. This 10-day intensive retreat follows the traditional Theravada Buddhist meditation technique, guiding you through progressive stages of mindfulness and insight.",
    highlights: [
      "Traditional Vipassana technique with modern adaptations",
      "Daily one-on-one teacher consultations",
      "Noble silence throughout the retreat",
      "Vegetarian meals prepared with mindfulness",
      "Beautiful mountain setting conducive to deep practice",
      "Small group size for personalized attention",
    ],
    schedule: [
      { time: "5:00 AM", activity: "Wake up bell" },
      { time: "5:30 - 6:30 AM", activity: "Morning meditation" },
      { time: "6:30 - 7:30 AM", activity: "Breakfast & rest" },
      { time: "8:00 - 9:00 AM", activity: "Group meditation" },
      { time: "9:00 - 11:00 AM", activity: "Meditation in hall or room" },
      { time: "11:00 AM", activity: "Lunch" },
      { time: "1:00 - 2:30 PM", activity: "Rest & personal practice" },
      { time: "2:30 - 3:30 PM", activity: "Group meditation" },
      { time: "3:30 - 5:00 PM", activity: "Meditation in hall or room" },
      { time: "5:00 PM", activity: "Tea & light snack" },
      { time: "6:00 - 7:00 PM", activity: "Group meditation" },
      { time: "7:00 - 8:15 PM", activity: "Dharma talk by teacher" },
      { time: "8:15 - 9:00 PM", activity: "Group meditation" },
      { time: "9:30 PM", activity: "Lights out" },
    ],
    accommodation: {
      type: "Shared dormitory or private rooms",
      amenities: ["Clean bedding", "Hot water", "Meditation cushions", "Storage space"],
      note: "Simple, comfortable accommodations designed to support your practice",
    },
    requirements: [
      "Commitment to complete the full 10 days",
      "Willingness to follow the code of discipline",
      "Maintain noble silence throughout",
      "No reading, writing, or electronic devices",
      "Previous meditation experience helpful but not required",
    ],
    includes: [
      "Accommodation for 10 nights",
      "All vegetarian meals",
      "Meditation instruction and guidance",
      "Daily dharma talks",
      "Course materials",
      "Tea and light snacks",
    ],
  };

  const availableSpots = retreat.capacity - retreat.enrolled;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-ghibli-sky/10 to-white">
      <Navigation />

      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-ghibli-forest/60">
          <Link href="/retreats">
            <span className="hover:text-ghibli-sage cursor-pointer">Retreats</span>
          </Link>
          {" / "}
          <span>{retreat.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ghibli-forest">
            {retreat.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-ghibli-forest/70">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{retreat.dates.start} - {retreat.dates.end}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{retreat.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{availableSpots} spots remaining</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-ghibli-forest">About This Retreat</h2>
              <p className="text-ghibli-forest/80 leading-relaxed mb-6">
                {retreat.description}
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-ghibli-forest">Retreat Highlights</h3>
              <ul className="space-y-2">
                {retreat.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-ghibli-sage flex-shrink-0 mt-0.5" />
                    <span className="text-ghibli-forest/80">{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Teacher */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-ghibli-forest">Your Teacher</h2>
              <div className="flex gap-4 mb-4">
                <div className="text-6xl">{retreat.teacher.photo}</div>
                <div>
                  <h3 className="text-xl font-semibold text-ghibli-forest">{retreat.teacher.name}</h3>
                  <p className="text-ghibli-sage font-medium mb-2">{retreat.teacher.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {retreat.teacher.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-ghibli-sage/10 text-ghibli-sage text-sm rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-ghibli-forest/80 leading-relaxed">
                {retreat.teacher.bio}
              </p>
            </Card>

            {/* Daily Schedule */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-ghibli-forest flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Daily Schedule
              </h2>
              <div className="space-y-3">
                {retreat.schedule.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-3 border-b border-ghibli-forest/10 last:border-0">
                    <div className="font-semibold text-ghibli-sage min-w-[120px]">
                      {item.time}
                    </div>
                    <div className="text-ghibli-forest/80">{item.activity}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Accommodation */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-ghibli-forest flex items-center gap-2">
                <Home className="w-6 h-6" />
                Accommodation
              </h2>
              <p className="text-ghibli-forest/80 mb-4">{retreat.accommodation.type}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {retreat.accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ghibli-sage" />
                    <span className="text-sm text-ghibli-forest/80">{amenity}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-ghibli-forest/60 italic">
                {retreat.accommodation.note}
              </p>
            </Card>

            {/* What's Included */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-ghibli-forest">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {retreat.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-ghibli-sage" />
                    <span className="text-ghibli-forest/80">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-6 bg-ghibli-sky/5">
              <h2 className="text-2xl font-bold mb-4 text-ghibli-forest">Requirements</h2>
              <ul className="space-y-2">
                {retreat.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-ghibli-sage flex-shrink-0 mt-0.5" />
                    <span className="text-ghibli-forest/80">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4 text-ghibli-forest">Book Your Spot</h3>
              
              {/* Pricing Options */}
              <div className="space-y-3 mb-6">
                <div className="p-4 border-2 border-ghibli-sage rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-ghibli-forest">Standard</span>
                    <span className="text-xl font-bold text-ghibli-sage">
                      ₹{retreat.pricing.standard.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-ghibli-forest/60">Full cost covering all expenses</p>
                </div>

                <div className="p-4 border-2 border-ghibli-forest/20 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-ghibli-forest">Subsidized</span>
                    <span className="text-xl font-bold text-ghibli-sage">
                      ₹{retreat.pricing.subsidized.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-ghibli-forest/60">For those with financial constraints</p>
                </div>

                <div className="p-4 border-2 border-ghibli-forest/20 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-ghibli-forest">Scholarship</span>
                    <span className="text-xl font-bold text-ghibli-sage">Free</span>
                  </div>
                  <p className="text-sm text-ghibli-forest/60">Dana-based, for sincere practitioners</p>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6 p-4 bg-ghibli-sage/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ghibli-forest">Availability</span>
                  <span className="text-lg font-bold text-ghibli-sage">
                    {availableSpots} / {retreat.capacity} spots
                  </span>
                </div>
                <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ghibli-sage transition-all"
                    style={{ width: `${(retreat.enrolled / retreat.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* CTA */}
              {isAuthenticated ? (
                <Link href={`/retreats/${retreat.id}/book`}>
                  <Button className="w-full bg-ghibli-sage hover:bg-ghibli-sage/90">
                    Book This Retreat
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => window.location.href = getLoginUrl()}
                  className="w-full bg-ghibli-sage hover:bg-ghibli-sage/90"
                >
                  Sign In to Book
                </Button>
              )}

              <p className="text-xs text-center text-ghibli-forest/60 mt-4">
                Secure your spot today. Full refund available up to 14 days before start date.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
