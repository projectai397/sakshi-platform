import { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Package, 
  Sparkles,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type PaymentMethod = "money" | "seva_tokens" | "free";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const { user, isAuthenticated } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [customPrice, setCustomPrice] = useState("");
  const [requestReason, setRequestReason] = useState("");

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );

  // AI-powered product recommendations
  const { data: recommendations } = trpc.ai.getProductRecommendations.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      toast.success("Added to cart!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!product) return;

    if (selectedPayment === "money" && !customPrice) {
      toast.error("Please enter an amount");
      return;
    }

    if (selectedPayment === "free" && !requestReason.trim()) {
      toast.error("Please tell us why you need this item");
      return;
    }

    const priceInPaise = selectedPayment === "money" 
      ? Math.round(parseFloat(customPrice) * 100)
      : selectedPayment === "seva_tokens"
      ? product.sevaTokenPrice
      : 0;

    addToCartMutation.mutate({
      productId: product.id,
      paymentMethod: selectedPayment as "money" | "seva_tokens" | "free",
      selectedPrice: priceInPaise,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[rgb(var(--soft-gray)/0.2)] rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-[rgb(var(--soft-gray)/0.2)] rounded-3xl" />
              <div className="space-y-6">
                <div className="h-10 bg-[rgb(var(--soft-gray)/0.2)] rounded w-3/4" />
                <div className="h-4 bg-[rgb(var(--soft-gray)/0.2)] rounded w-1/2" />
                <div className="h-20 bg-[rgb(var(--soft-gray)/0.2)] rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-16 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
            This item may have been sold or is no longer available.
          </p>
          <Link href="/shop">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const minPrice = product.minimumPrice / 100;
  const maxPrice = product.maximumPrice / 100;
  const suggestedPrice = product.suggestedPrice / 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container py-8">
          {/* Back Button */}
          <Link href="/shop">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="ghibli-card overflow-hidden sticky top-24">
                <div className="aspect-square bg-gradient-to-br from-[rgb(var(--warm-cream))] to-[rgb(var(--sky-blue)/0.2)] flex items-center justify-center relative">
                  <span className="text-9xl">📦</span>
                  {product.isChildrenFree && (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] text-white text-sm rounded-full font-medium">
                      Always Free for Children
                    </div>
                  )}
                </div>
                
                {/* Product Meta */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs mb-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                        Condition
                      </div>
                      <div className="font-medium">
                        {product.condition === 'excellent' && '✨ Excellent'}
                        {product.condition === 'good' && '👍 Good'}
                        {product.condition === 'fair' && '👌 Fair'}
                      </div>
                    </div>
                    {product.brand && (
                      <div className="flex-1">
                        <div className="text-xs mb-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                          Brand
                        </div>
                        <div className="font-medium">{product.brand}</div>
                      </div>
                    )}
                  </div>

                  {(product.size || product.color) && (
                    <div className="flex items-center gap-4">
                      {product.size && (
                        <div className="flex-1">
                          <div className="text-xs mb-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                            Size
                          </div>
                          <div className="font-medium">{product.size}</div>
                        </div>
                      )}
                      {product.color && (
                        <div className="flex-1">
                          <div className="text-xs mb-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                            Color
                          </div>
                          <div className="font-medium">{product.color}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {product.material && (
                    <div>
                      <div className="text-xs mb-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                        Material
                      </div>
                      <div className="font-medium">{product.material}</div>
                    </div>
                  )}

                  {product.donorName && (
                    <div className="pt-4 border-t border-[rgb(var(--soft-gray)/0.2)]">
                      <div className="text-xs mb-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                        Donated by
                      </div>
                      <div className="font-medium flex items-center gap-2">
                        <Heart className="w-4 h-4" style={{ color: 'rgb(var(--cherry-blossom))' }} />
                        {product.donorName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <p className="text-lg mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                {product.description}
              </p>

              {/* Story */}
              {product.story && (
                <div className="mb-8 p-6 rounded-2xl watercolor-sage">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <h2 className="text-lg font-bold">This Item's Story</h2>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                    {product.story}
                  </p>
                </div>
              )}

              {/* Payment Options */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Choose How to Pay</h2>
                
                <div className="space-y-4">
                  {/* Money Option */}
                  {!product.isChildrenFree && (
                    <div
                      onClick={() => setSelectedPayment("money")}
                      className={`pricing-option ${selectedPayment === "money" ? "selected" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full watercolor-terracotta flex items-center justify-center text-2xl flex-shrink-0">
                          💰
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-2">Sliding Scale (Pay What You Can)</h3>
                          <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                            Suggested: ₹{suggestedPrice} • Range: ₹{minPrice} - ₹{maxPrice}
                          </p>
                          {selectedPayment === "money" && (
                            <div className="space-y-3">
                              <div className="relative">
                                <input
                                  type="range"
                                  min={minPrice}
                                  max={maxPrice}
                                  step="10"
                                  value={customPrice || suggestedPrice}
                                  onChange={(e) => setCustomPrice(e.target.value)}
                                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                  style={{
                                    background: `linear-gradient(to right, rgb(var(--sage-green)) 0%, rgb(var(--sage-green)) ${((parseFloat(customPrice || String(suggestedPrice)) - minPrice) / (maxPrice - minPrice)) * 100}%, rgb(var(--soft-gray) / 0.2) ${((parseFloat(customPrice || String(suggestedPrice)) - minPrice) / (maxPrice - minPrice)) * 100}%, rgb(var(--soft-gray) / 0.2) 100%)`
                                  }}
                                />
                                <div className="flex justify-between text-xs mt-2" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                                  <span>₹{minPrice}</span>
                                  <span className="font-medium" style={{ color: 'rgb(var(--sage-green))' }}>₹{suggestedPrice} suggested</span>
                                  <span>₹{maxPrice}</span>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-3xl font-bold mb-1" style={{ color: 'rgb(var(--sage-green))' }}>
                                  ₹{customPrice || suggestedPrice}
                                </div>
                                <p className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                                  {parseFloat(customPrice || String(suggestedPrice)) < suggestedPrice * 0.8 && "Every amount helps. Thank you for being honest about your situation."}
                                  {parseFloat(customPrice || String(suggestedPrice)) >= suggestedPrice * 0.8 && parseFloat(customPrice || String(suggestedPrice)) <= suggestedPrice * 1.2 && "Fair market value. Thank you for supporting our mission!"}
                                  {parseFloat(customPrice || String(suggestedPrice)) > suggestedPrice * 1.2 && "Thank you for paying forward! Your generosity helps others access items for free."}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Seva Tokens Option */}
                  {!product.isChildrenFree && product.sevaTokenPrice > 0 && (
                    <div
                      onClick={() => setSelectedPayment("seva_tokens")}
                      className={`pricing-option ${selectedPayment === "seva_tokens" ? "selected" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full watercolor-sage flex items-center justify-center text-2xl flex-shrink-0">
                          ✨
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-2">Pay with Seva Tokens</h3>
                          <p className="text-sm mb-2" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                            Cost: {product.sevaTokenPrice} tokens
                          </p>
                          {selectedPayment === "seva_tokens" && (
                            <div>
                              {/* TODO: Fetch seva wallet balance */}
                          {false ? (
                                <p className="text-xs text-[rgb(var(--sage-green))]">
                                  ✓ You have tokens available
                                </p>
                              ) : (
                                <p className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                                  Earn seva tokens by volunteering.{" "}
                                  <Link href="/volunteer">
                                    <span className="text-[rgb(var(--sage-green))] underline cursor-pointer">
                                      Volunteer to earn tokens
                                    </span>
                                  </Link>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Free Request Option */}
                  <div
                    onClick={() => setSelectedPayment("free")}
                    className={`pricing-option ${selectedPayment === "free" ? "selected" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] flex items-center justify-center text-2xl flex-shrink-0">
                        💝
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">
                          {product.isChildrenFree ? "Free for All Children" : "Request Free"}
                        </h3>
                        <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          {product.isChildrenFree
                            ? "All children's items are always free. No questions asked."
                            : "Need this but can't pay? Just tell us why. We trust you."}
                        </p>
                        {selectedPayment === "free" && !product.isChildrenFree && (
                          <div>
                            <Textarea
                              placeholder="Tell us briefly why you need this item..."
                              value={requestReason}
                              onChange={(e) => setRequestReason(e.target.value)}
                              className="mb-2"
                              rows={3}
                            />
                            <p className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                              <Info className="w-3 h-3 inline mr-1" />
                              Your request is private and will be reviewed with care and respect.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedPayment || addToCartMutation.isPending}
                size="lg"
                className="w-full rounded-full ghibli-button text-lg"
                style={{
                  background: selectedPayment
                    ? 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))'
                    : undefined,
                  color: selectedPayment ? 'white' : undefined,
                }}
              >
                <Package className="w-5 h-5 mr-2" />
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>

              {!selectedPayment && (
                <p className="text-center text-sm mt-3" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                  Please select a payment method above
                </p>
              )}

              {/* Item Journey Timeline */}
              <div className="mt-8 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgb(var(--warm-cream)), rgb(var(--soft-gray) / 0.1))' }}>
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  Item Journey
                </h3>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[rgb(var(--sage-green))] to-[rgb(var(--bamboo-green))]"></div>
                  
                  {/* Timeline Steps */}
                  <div className="space-y-6 relative">
                    {/* Step 1: Donation */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--sage-green))] flex items-center justify-center text-white font-bold z-10">
                        ✓
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="font-bold mb-1">Donated with Love</div>
                        <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          {product.donorName ? `Generously donated by ${product.donorName}` : 'Donated by a caring community member'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'rgb(var(--charcoal) / 0.5)' }}>
                          {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Quality Check */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--sage-green))] flex items-center justify-center text-white font-bold z-10">
                        ✓
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="font-bold mb-1">Quality Checked</div>
                        <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Inspected, cleaned, and verified to meet our quality standards
                        </p>
                        <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgb(var(--sage-green) / 0.2)', color: 'rgb(var(--sage-green))' }}>
                          Condition: {product.condition}
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Listed */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--sage-green))] flex items-center justify-center text-white font-bold z-10">
                        ✓
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="font-bold mb-1">Ready for a New Home</div>
                        <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Listed with flexible pricing options to serve all community members
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 rounded-full text-xs" style={{ background: 'rgb(var(--sky-blue) / 0.2)', color: 'rgb(var(--sky-blue))' }}>💰 Sliding Scale</span>
                          <span className="px-2 py-1 rounded-full text-xs" style={{ background: 'rgb(var(--terracotta) / 0.2)', color: 'rgb(var(--terracotta))' }}>✨ Seva Tokens</span>
                          <span className="px-2 py-1 rounded-full text-xs" style={{ background: 'rgb(var(--cherry-blossom) / 0.2)', color: 'rgb(var(--cherry-blossom))' }}>💝 Free</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Awaiting You */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[rgb(var(--sage-green))] bg-white flex items-center justify-center z-10">
                        <div className="w-3 h-3 rounded-full bg-[rgb(var(--sage-green))] animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold mb-1">Waiting for You</div>
                        <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          This item is ready to become part of your story. Will you give it a loving home?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="mt-8 p-6 rounded-2xl watercolor-sage">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  Environmental Impact of Buying This Item
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">💧</div>
                    <div className="text-sm font-medium">2,700 liters</div>
                    <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>water saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌱</div>
                    <div className="text-sm font-medium">5.5 kg CO₂</div>
                    <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>emissions prevented</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">♻️</div>
                    <div className="text-sm font-medium">1 item</div>
                    <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>saved from landfill</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔄</div>
                    <div className="text-sm font-medium">Extended</div>
                    <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>product lifecycle</div>
                  </div>
                </div>
                <p className="text-xs text-center mt-4" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                  vs. buying new production
                </p>
              </div>

              {/* Share Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full mt-4"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share This Item
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* AI-Powered Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-ghibli-sky/10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-ghibli-sage" />
              <h2 className="text-3xl font-bold text-ghibli-forest">
                You Might Also Love
              </h2>
            </div>
            <p className="text-ghibli-forest/70 mb-8">
              Based on this item, our AI assistant suggests these treasures:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((item: any) => (
                <Link key={item.id} href={`/product/${item.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square bg-ghibli-sage/10 rounded-2xl mb-4 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-ghibli-sage/20 to-ghibli-sky/20 group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-16 h-16 text-ghibli-sage/40" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-ghibli-forest group-hover:text-ghibli-sage transition-colors mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-ghibli-forest/60 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ghibli-sage">
                        From ₹{item.suggestedPrice}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-ghibli-sage/10 text-ghibli-sage capitalize">
                        {item.condition}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
