import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ShoppingBag, CreditCard, Coins, Heart, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const { data: cartData } = trpc.cart.get.useQuery({}, {
    enabled: isAuthenticated
  });

  const clearCartMutation = trpc.cart.clear.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="ghibli-card p-12 text-center max-w-md">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgb(var(--sage-green))' }} />
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              You need to be signed in to complete your purchase.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="rounded-full ghibli-button"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                color: 'white'
              }}
            >
              Go to Homepage
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cartItems = cartData?.items || [];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="ghibli-card p-12 text-center max-w-md">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgb(var(--charcoal) / 0.3)' }} />
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Add some items to your cart before checking out.
            </p>
            <Button
              onClick={() => setLocation("/shop")}
              className="rounded-full ghibli-button"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                color: 'white'
              }}
            >
              Browse Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum: number, item: any) => {
      if (item.paymentMethod === 'money') {
        return sum + (item.customPrice || item.product.suggestedPrice);
      }
      return sum;
    }, 0);
  };

  const calculateSevaTokens = () => {
    return cartItems.reduce((sum: number, item: any) => {
      if (item.paymentMethod === 'seva_tokens') {
        return sum + (item.product.sevaTokenPrice || 0);
      }
      return sum;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
      toast.error("Please fill in all shipping information");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart
      if (cartData?.cart?.id) {
        await clearCartMutation.mutateAsync({ cartId: cartData.cart.id });
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      toast.success("Order placed successfully!");
      setLocation(`/order-confirmation?orderNumber=${orderNumber}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  const totalMoney = calculateTotal();
  const totalTokens = calculateSevaTokens();
  const freeItems = cartItems.filter((item: any) => item.paymentMethod === 'free').length;

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
      <Navigation />

      <main className="flex-1 py-16">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">
            Complete Your <span className="text-gradient-sage">Order</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="ghibli-card p-8">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        required
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        required
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      required
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <Textarea
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      placeholder="Street address, apartment, suite, etc."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <Input
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <Input
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode *</label>
                      <Input
                        required
                        value={shippingInfo.pincode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                        placeholder="560001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="ghibli-card p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.product.images[0] || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.product.name}</div>
                        <div className="text-xs mt-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                          {item.paymentMethod === 'money' && `₹${((item.customPrice || item.product.suggestedPrice) / 100).toFixed(2)}`}
                          {item.paymentMethod === 'seva_tokens' && `${item.product.sevaTokenPrice} tokens`}
                          {item.paymentMethod === 'free' && 'Free'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3" style={{ borderColor: 'rgb(var(--soft-gray))' }}>
                  {totalMoney > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                        <span className="font-medium">Money</span>
                      </div>
                      <span className="font-bold">₹{(totalMoney / 100).toFixed(2)}</span>
                    </div>
                  )}

                  {totalTokens > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4" style={{ color: 'rgb(var(--sunrise-orange))' }} />
                        <span className="font-medium">Seva Tokens</span>
                      </div>
                      <span className="font-bold">{totalTokens} tokens</span>
                    </div>
                  )}

                  {freeItems > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" style={{ color: 'rgb(var(--cherry-blossom))' }} />
                        <span className="font-medium">Free Items</span>
                      </div>
                      <span className="font-bold">{freeItems} item{freeItems > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full mt-6 rounded-full ghibli-button"
                  style={{
                    background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                    color: 'white'
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center mt-4" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
