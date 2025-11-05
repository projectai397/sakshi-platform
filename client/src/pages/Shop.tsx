import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<"excellent" | "good" | "fair" | "worn" | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [useSmartSearch, setUseSmartSearch] = useState(false);
  const [smartSearchResults, setSmartSearchResults] = useState<any>(null);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: regularProducts, isLoading: regularLoading } = trpc.products.list.useQuery({
    categoryId: selectedCategory || undefined,
    condition: selectedCondition || undefined,
    search: searchQuery || undefined,
  });
  
  const smartSearchMutation = trpc.ai.smartSearch.useMutation();
  
  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setUseSmartSearch(true);
    const result = await smartSearchMutation.mutateAsync({ query: searchQuery });
    setSmartSearchResults(result);
  };
  
  const handleRegularSearch = () => {
    setUseSmartSearch(false);
    setSmartSearchResults(null);
  };
  
  const products = useSmartSearch && smartSearchResults ? smartSearchResults.products : regularProducts;
  const isLoading = useSmartSearch ? smartSearchMutation.isPending : regularLoading;

  const conditions = [
    { value: "excellent", label: "Excellent", emoji: "✨" },
    { value: "good", label: "Good", emoji: "👍" },
    { value: "fair", label: "Fair", emoji: "👌" },
  ];

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCondition(null);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory || selectedCondition || searchQuery;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="adiyogi-bg-3 py-12 md:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover <span className="text-gradient-sage">Treasures</span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Every item is unique and has its own story. Browse our collection of pre-loved items.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgb(var(--charcoal) / 0.4)' }} />
                  <Input
                    type="text"
                    placeholder="Try: 'red jacket for winter' or 'toys for 5 year old'..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (useSmartSearch) handleRegularSearch();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        handleSmartSearch();
                      }
                    }}
                    className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-[rgb(var(--soft-gray)/0.3)] focus:border-[rgb(var(--sage-green))]"
                  />
                </div>
                
                {searchQuery.trim() && (
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleSmartSearch}
                      disabled={smartSearchMutation.isPending}
                      className="bg-gradient-to-r from-[rgb(var(--sage-green))] to-[rgb(var(--forest-green))] text-white hover:opacity-90"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {smartSearchMutation.isPending ? "Searching..." : "Smart Search"}
                    </Button>
                    {useSmartSearch && (
                      <Button
                        onClick={handleRegularSearch}
                        variant="outline"
                      >
                        Regular Search
                      </Button>
                    )}
                  </div>
                )}
                
                {useSmartSearch && smartSearchResults && smartSearchResults.interpretation && (
                  <div className="bg-[rgb(var(--sage-green)/0.1)] border border-[rgb(var(--sage-green)/0.3)] rounded-lg p-4 text-center">
                    <p className="text-sm font-medium" style={{ color: 'rgb(var(--forest-green))' }}>
                      🤖 AI Understanding: {smartSearchResults.interpretation}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgb(var(--charcoal)/0.6)' }}>
                      Found {smartSearchResults.totalResults} matching {smartSearchResults.totalResults === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-sm"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="font-bold mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] font-medium'
                          : 'hover:bg-[rgb(var(--soft-gray)/0.1)]'
                      }`}
                    >
                      All Items
                    </button>
                    {categories?.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] font-medium'
                            : 'hover:bg-[rgb(var(--soft-gray)/0.1)]'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-8">
                  <h3 className="font-bold mb-3">Condition</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCondition(null)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        !selectedCondition
                          ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] font-medium'
                          : 'hover:bg-[rgb(var(--soft-gray)/0.1)]'
                      }`}
                    >
                      All Conditions
                    </button>
                    {conditions.map((condition) => (
                      <button
                        key={condition.value}
                        onClick={() => setSelectedCondition(condition.value as "excellent" | "good" | "fair" | "worn")}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCondition === condition.value
                            ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] font-medium'
                            : 'hover:bg-[rgb(var(--soft-gray)/0.1)]'
                        }`}
                      >
                        <span className="mr-2">{condition.emoji}</span>
                        {condition.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full rounded-full"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-0.5 bg-[rgb(var(--sage-green))] text-white text-xs rounded-full">
                    Active
                  </span>
                )}
              </Button>

              {/* Mobile Filters Modal */}
              {showFilters && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Filters</h2>
                      <button onClick={() => setShowFilters(false)}>
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="w-full mb-4"
                      >
                        Clear All Filters
                      </Button>
                    )}

                    {/* Categories */}
                    <div className="mb-8">
                      <h3 className="font-bold mb-3">Categories</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            !selectedCategory
                              ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] font-medium'
                              : 'hover:bg-[rgb(var(--soft-gray)/0.1)]'
                          }`}
                        >
                          All Items
                        </button>
                        {categories?.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setShowFilters(false);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                              selectedCategory === category.id
                                ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] font-medium'
                                : 'hover:bg-[rgb(var(--soft-gray)/0.1)]'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="mb-8">
                      <h3 className="font-bold mb-3">Condition</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedCondition(null);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            !selectedCondition
                              ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] font-medium'
                              : 'hover:bg-[rgb(var(--soft-gray)/0.1)]'
                          }`}
                        >
                          All Conditions
                        </button>
                        {conditions.map((condition) => (
                          <button
                            key={condition.value}
                            onClick={() => {
                              setSelectedCondition(condition.value as "excellent" | "good" | "fair" | "worn");
                              setShowFilters(false);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                              selectedCondition === condition.value
                                ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] font-medium'
                                : 'hover:bg-[rgb(var(--soft-gray)/0.1)]'
                            }`}
                          >
                            <span className="mr-2">{condition.emoji}</span>
                            {condition.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedCategory && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] rounded-full text-sm">
                      {categories?.find((c) => c.id === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory(null)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {selectedCondition && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] rounded-full text-sm">
                      {conditions.find((c) => c.value === selectedCondition)?.label}
                      <button onClick={() => setSelectedCondition(null)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {searchQuery && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))] rounded-full text-sm">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      Showing <span className="font-bold">{products?.length || 0}</span> items
                    </>
                  )}
                </p>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="ghibli-card animate-pulse">
                      <div className="aspect-square bg-[rgb(var(--soft-gray)/0.2)]" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-[rgb(var(--soft-gray)/0.2)] rounded" />
                        <div className="h-3 bg-[rgb(var(--soft-gray)/0.2)] rounded w-2/3" />
                        <div className="h-3 bg-[rgb(var(--soft-gray)/0.2)] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <Link key={product.id} href={`/product/${product.slug}`}>
                      <div className="ghibli-card cursor-pointer h-full flex flex-col">
                        <div className="aspect-square bg-gradient-to-br from-[rgb(var(--warm-cream))] to-[rgb(var(--sky-blue)/0.2)] flex items-center justify-center text-6xl relative">
                          📦
                          {product.isChildrenFree && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] text-white text-xs rounded-full font-medium">
                              FREE
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold mb-2 line-clamp-1">{product.name}</h3>
                          <p className="text-sm mb-3 line-clamp-2 flex-1" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                            {product.description}
                          </p>
                          
                          {/* Condition Badge */}
                          <div className="mb-3">
                            <span className="text-xs px-2 py-1 rounded-full watercolor-sage">
                              {product.condition === 'excellent' && '✨ Excellent'}
                              {product.condition === 'good' && '👍 Good'}
                              {product.condition === 'fair' && '👌 Fair'}
                            </span>
                          </div>

                          {/* Pricing */}
                          {product.isChildrenFree ? (
                            <div className="text-center py-2 px-3 rounded-lg bg-gradient-to-r from-[rgb(var(--cherry-blossom)/0.1)] to-[rgb(var(--twilight-purple)/0.1)]">
                              <span className="text-sm font-bold" style={{ color: 'rgb(var(--cherry-blossom))' }}>
                                Always Free for Children
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="text-sm">
                                <span style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>From </span>
                                <span className="font-bold text-[rgb(var(--sage-green))]">
                                  ₹{(product.minimumPrice / 100).toFixed(0)}
                                </span>
                              </div>
                              <div className="text-xs px-2 py-1 rounded-full watercolor-sage">
                                {product.sevaTokenPrice} tokens
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2">No items found</h3>
                  <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Try adjusting your filters or search query
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline" className="rounded-full">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
