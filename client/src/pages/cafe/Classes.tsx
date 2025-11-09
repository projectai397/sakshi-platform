import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Video, Users, Clock } from "lucide-react";
import ClassCard from "@/components/cafe/ClassCard";

export default function CookingClasses() {
  const [selectedType, setSelectedType] = useState<"in-person" | "virtual" | null>(null);

  const { data: classes, isLoading } = trpc.cafe.classes.getUpcomingClasses.useQuery({
    classType: selectedType || undefined,
    isActive: true,
  });

  const classTypes = [
    { value: "in-person", label: "In-Person", icon: MapPin, description: "Hands-on learning at our cafe locations" },
    { value: "virtual", label: "Virtual", icon: Video, description: "Join from anywhere via video call" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Cooking Classes</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn to prepare delicious Satvic meals with expert guidance.
            From beginner basics to advanced techniques, we have classes for everyone.
          </p>
        </div>

        {/* Class Type Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-semibold mb-4">Class Format</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {classTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(
                    selectedType === type.value ? null : type.value as any
                  )}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedType === type.value
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-6 h-6 mt-1 ${
                      selectedType === type.value ? "text-purple-600" : "text-gray-400"
                    }`} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{type.label}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {selectedType && (
            <Button
              variant="ghost"
              onClick={() => setSelectedType(null)}
              className="mt-4"
            >
              Clear Filter
            </Button>
          )}
        </div>

        {/* Benefits Banner */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Gain</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl">👨‍🍳</span>
              <div>
                <h3 className="font-semibold text-sm">Expert Instruction</h3>
                <p className="text-xs text-gray-600">Learn from experienced Satvic chefs</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl">📖</span>
              <div>
                <h3 className="font-semibold text-sm">Recipe Booklet</h3>
                <p className="text-xs text-gray-600">Take home detailed recipes</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="font-semibold text-sm">Certificate</h3>
                <p className="text-xs text-gray-600">Receive completion certificate</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl">🪙</span>
              <div>
                <h3 className="font-semibold text-sm">Earn Tokens</h3>
                <p className="text-xs text-gray-600">20 Seva tokens per class</p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading classes...</p>
          </div>
        ) : classes && classes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes available</h3>
            <p className="text-gray-600">
              {selectedType
                ? "Try selecting a different class format"
                : "Check back soon for upcoming classes"}
            </p>
          </div>
        )}

        {/* Class Categories */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Class Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg hover:border-purple-600 transition-colors">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-semibold mb-1">Beginner Basics</h3>
              <p className="text-sm text-gray-600">Simple techniques and easy recipes</p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:border-purple-600 transition-colors">
              <div className="text-3xl mb-2">🍲</div>
              <h3 className="font-semibold mb-1">Intermediate</h3>
              <p className="text-sm text-gray-600">Advanced techniques and meal planning</p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:border-purple-600 transition-colors">
              <div className="text-3xl mb-2">🧪</div>
              <h3 className="font-semibold mb-1">Specialized</h3>
              <p className="text-sm text-gray-600">Fermentation, sprouting, Ayurvedic cooking</p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:border-purple-600 transition-colors">
              <div className="text-3xl mb-2">👶</div>
              <h3 className="font-semibold mb-1">Kids Classes</h3>
              <p className="text-sm text-gray-600">Teaching children healthy cooking</p>
            </div>
          </div>
        </div>

        {/* Triple Pricing Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Accessible Pricing for All</h2>
          <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
            Our triple pricing system ensures everyone can learn to cook healthy meals, regardless of financial situation.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💙 Community</h3>
              <p className="text-sm text-gray-600">Subsidized access for those who need support</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💚 Fair</h3>
              <p className="text-sm text-gray-600">True cost covering instruction and materials</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🧡 Supporter</h3>
              <p className="text-sm text-gray-600">Help others learn by paying it forward</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center space-x-4">
          <Link href="/cafe/menu">
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              Browse Menu
            </Button>
          </Link>
          <Link href="/cafe/recipes">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Explore Recipes
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
