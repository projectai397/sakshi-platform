import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, ShoppingBag, ArrowRight, Leaf, Droplets, Wind } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: cart, isLoading } = trpc.cart.get.useQuery({}, {
    enabled: isAuthenticated,
  });

  const cartItems = cart?.items || [];

  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success("Item removed from cart");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success("Cart cleared");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold mb-4">Sign In to View Cart</h1>
            <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Please sign in to add items to your cart and checkout.
            </p>
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              size="lg"
              className="rounded-full ghibli-button"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                color: 'white'
              }}
            >
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalItems = cartItems?.length || 0;
  const totalPrice = cartItems?.reduce((sum: number, item: any) => sum + (item.selectedPrice || 0), 0) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="watercolor-bg py-12">
          <div className="container">
            <Link href="/shop">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">
              Your <span className="text-gradient-sage">Cart</span>
            </h1>
          </div>
        </div>

        <div className="container py-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="ghibli-card p-6 animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-[rgb(var(--soft-gray)/0.2)] rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-[rgb(var(--soft-gray)/0.2)] rounded w-1/3" />
                      <div className="h-3 bg-[rgb(var(--soft-gray)/0.2)] rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Start adding items to your cart to see them here!
              </p>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="rounded-full ghibli-button"
                  style={{
                    background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                    color: 'white'
                  }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                  </h2>
                  {totalItems > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (cart && 'cart' in cart && cart.cart) {
                          clearCartMutation.mutate({ cartId: cart.cart.id });
                        }
                      }}
                      disabled={clearCartMutation.isPending}
                    >
                      Clear Cart
                    </Button>
                  )}
                </div>

                {cartItems?.map((item: any) => (
                  <div key={item.id} className="ghibli-card p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-[rgb(var(--warm-cream))] to-[rgb(var(--sky-blue)/0.2)] flex items-center justify-center text-4xl">
                        📦
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.slug}`}>
                          <h3 className="font-bold text-lg mb-2 hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer">
                            {item.product.name}
                          </h3>
                        </Link>

                        {/* Payment Method Badge */}
                        <div className="mb-3">
                          {item.paymentMethod === 'money' && (
                            <span className="text-xs px-3 py-1 rounded-full watercolor-terracotta">
                              💰 Sliding Scale: ₹{((item.selectedPrice || 0) / 100).toFixed(0)}
                            </span>
                          )}
                          {item.paymentMethod === 'seva_tokens' && (
                            <span className="text-xs px-3 py-1 rounded-full watercolor-sage">
                              ✨ Seva Tokens: {item.selectedPrice}
                            </span>
                          )}
                          {item.paymentMethod === 'free' && (
                            <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[rgb(var(--cherry-blossom)/0.2)] to-[rgb(var(--twilight-purple)/0.2)]">
                              💝 Free Request
                            </span>
                          )}
                        </div>

                        <p className="text-sm line-clamp-2" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          {item.product.description}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <div className="flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItemMutation.mutate({ cartItemId: item.id })}
                          disabled={removeItemMutation.isPending}
                          className="text-[rgb(var(--charcoal)/0.5)] hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Environmental Impact */}
              <div className="lg:col-span-1">
                <div className="ghibli-card p-6 mb-6" style={{
                  background: 'linear-gradient(135deg, rgba(var(--sage-green), 0.1), rgba(var(--sky-blue), 0.1))',
                  border: '2px solid rgba(var(--sage-green), 0.2)'
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="w-5 h-5 text-[rgb(var(--sage-green))]" />
                    <h3 className="font-bold text-lg">Your Environmental Impact</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[rgb(var(--sky-blue)/0.2)] flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-[rgb(var(--sky-blue))]" />
                      </div>
                      <div>
                        <div className="font-semibold">{(totalItems * 2700).toLocaleString()} L</div>
                        <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>Water Saved</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[rgb(var(--sage-green)/0.2)] flex items-center justify-center">
                        <Wind className="w-5 h-5 text-[rgb(var(--sage-green))]" />
                      </div>
                      <div>
                        <div className="font-semibold">{(totalItems * 5.5).toFixed(1)} kg</div>
                        <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>CO₂ Prevented</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[rgb(var(--terracotta)/0.2)] flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-[rgb(var(--terracotta))]" />
                      </div>
                      <div>
                        <div className="font-semibold">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</div>
                        <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>Saved from Landfill</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[rgb(var(--soft-gray)/0.2)]">
                    <p className="text-xs text-center" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                      Every purchase extends product lifecycle and reduces environmental impact 🌱
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="ghibli-card p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>Items</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>

                    <div className="flex justify-between">
                      <span style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>Subtotal</span>
                      <span className="font-medium">
                        {cartItems?.some((item: any) => item.paymentMethod === 'seva_tokens') ? (
                          <span>Mixed Payment</span>
                        ) : cartItems?.some((item: any) => item.paymentMethod === 'free') ? (
                          <span>Free</span>
                        ) : (
                          <span>₹{(totalPrice / 100).toFixed(2)}</span>
                        )}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-[rgb(var(--soft-gray)/0.2)]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-2xl text-[rgb(var(--sage-green))]">
                          {cartItems?.some((item: any) => item.paymentMethod === 'seva_tokens') ? (
                            <span className="text-lg">Mixed</span>
                          ) : cartItems?.some((item: any) => item.paymentMethod === 'free') ? (
                            <span className="text-lg">Free</span>
                          ) : (
                            <span>₹{(totalPrice / 100).toFixed(2)}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button
                      size="lg"
                      className="w-full rounded-full ghibli-button text-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                        color: 'white'
                      }}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <p className="text-xs text-center mt-4" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                    Your items are reserved for 24 hours
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
