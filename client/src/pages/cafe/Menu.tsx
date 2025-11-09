import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Leaf, Clock, Flame } from "lucide-react";
import MenuCard from "@/components/cafe/MenuCard";

export default function CafeMenu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = trpc.cafe.menu.getCategories.useQuery();
  const { data: menuItems, isLoading } = trpc.cafe.menu.getMenuItems.useQuery({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    isAvailable: true,
  });

  const categoryOptions = [
    { value: "breakfast", label: "Breakfast", emoji: "🌅" },
    { value: "lunch", label: "Lunch", emoji: "🍱" },
    { value: "dinner", label: "Dinner", emoji: "🌙" },
    { value: "snack", label: "Snacks", emoji: "🥜" },
    { value: "beverage", label: "Beverages", emoji: "🍵" },
    { value: "dessert", label: "Desserts", emoji: "🍰" },
  ];

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Sakshi Cafe Menu</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            100% plant-based, Ayurvedic-inspired meals crafted with consciousness and care.
            Choose your pricing tier to support our community.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
            {(selectedCategory || searchQuery) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.value ? null : category.value
                    )}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedCategory === category.value
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-600"
                    }`}
                  >
                    <span className="mr-2">{category.emoji}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Satvic Principles Banner */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Satvic Principles</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Leaf className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Plant-Based</h3>
                <p className="text-sm text-gray-600">100% plant-based, whole foods with minimal processing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Ayurvedic Wisdom</h3>
                <p className="text-sm text-gray-600">Balanced doshas and six tastes in every meal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Flame className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Conscious Living</h3>
                <p className="text-sm text-gray-600">Sustainable, local, and mindfully prepared</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        ) : menuItems && menuItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory
                ? "Try adjusting your filters"
                : "Menu items will appear here"}
            </p>
          </div>
        )}

        {/* Triple Pricing Explanation */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Our Triple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💙</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Tier</h3>
              <p className="text-sm text-gray-600">
                Subsidized pricing (40% of fair price) for those who need support. Everyone deserves healthy food.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fair Tier</h3>
              <p className="text-sm text-gray-600">
                True cost pricing that covers ingredients, labor, and sustainable operations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🧡</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Supporter Tier</h3>
              <p className="text-sm text-gray-600">
                Pay it forward pricing (150% of fair price) that helps subsidize community tier access.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Link href="/cafe/classes">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Explore Cooking Classes
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
