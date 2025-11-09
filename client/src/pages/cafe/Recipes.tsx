import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, ChefHat, Plus } from "lucide-react";
import RecipeCard from "@/components/cafe/RecipeCard";

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: recipes, isLoading } = trpc.cafe.recipes.getRecipes.useQuery({
    category: selectedCategory || undefined,
    difficulty: selectedDifficulty || undefined,
    search: searchQuery || undefined,
    isApproved: true,
  });

  const categoryOptions = [
    { value: "breakfast", label: "Breakfast", emoji: "🌅" },
    { value: "lunch", label: "Lunch", emoji: "🍱" },
    { value: "dinner", label: "Dinner", emoji: "🌙" },
    { value: "snack", label: "Snacks", emoji: "🥜" },
    { value: "beverage", label: "Beverages", emoji: "🍵" },
    { value: "dessert", label: "Desserts", emoji: "🍰" },
  ];

  const difficultyOptions = [
    { value: "easy", label: "Easy", emoji: "😊", color: "green" },
    { value: "medium", label: "Medium", emoji: "🤔", color: "yellow" },
    { value: "hard", label: "Hard", emoji: "💪", color: "red" },
  ];

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">Satvic Recipe Library</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover plant-based recipes inspired by Ayurvedic wisdom and natural healing.
            Learn to cook delicious, nourishing meals at home.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search recipes..."
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
            {(selectedCategory || selectedDifficulty || searchQuery) && (
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
            <div className="mt-6 pt-6 border-t space-y-6">
              <div>
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
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-orange-600"
                      }`}
                    >
                      <span className="mr-2">{category.emoji}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Difficulty Level</h3>
                <div className="flex flex-wrap gap-2">
                  {difficultyOptions.map((difficulty) => (
                    <button
                      key={difficulty.value}
                      onClick={() => setSelectedDifficulty(
                        selectedDifficulty === difficulty.value ? null : difficulty.value as any
                      )}
                      className={`px-4 py-2 rounded-full border transition-colors ${
                        selectedDifficulty === difficulty.value
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-orange-600"
                      }`}
                    >
                      <span className="mr-2">{difficulty.emoji}</span>
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Recipe CTA */}
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Share Your Recipe</h2>
              <p className="text-gray-600">
                Have a delicious Satvic recipe? Share it with our community and earn Seva tokens!
              </p>
            </div>
            <Link href="/cafe/recipes/submit">
              <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Submit Recipe
              </Button>
            </Link>
          </div>
        </div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recipes...</p>
          </div>
        ) : recipes && recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory || selectedDifficulty
                ? "Try adjusting your filters"
                : "Recipes will appear here"}
            </p>
          </div>
        )}

        {/* Community Benefits */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Recipe Community Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Earn Seva Tokens</h3>
              <p className="text-sm text-gray-600">
                Get 25 Seva tokens for each approved recipe contribution
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Learn & Share</h3>
              <p className="text-sm text-gray-600">
                Access hundreds of plant-based recipes and cooking techniques
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Build Community</h3>
              <p className="text-sm text-gray-600">
                Connect with others on the Satvic journey and share experiences
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Link href="/cafe/classes">
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              Take a Cooking Class
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
