import { useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Heart, ArrowRight, Download } from "lucide-react";

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  
  // Get order number from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('orderNumber') || 'ORD-000000';

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
      <Navigation />

      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 watercolor-sage">
              <CheckCircle className="w-12 h-12" style={{ color: 'rgb(var(--sage-green))' }} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Order <span className="text-gradient-sage">Confirmed!</span>
            </h1>
            <p className="text-lg md:text-xl mb-2" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Thank you for shopping with purpose and heart
            </p>
            <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
              Order Number: <span className="font-bold">{orderNumber}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="ghibli-card p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl watercolor-sage flex items-center justify-center">
                  <Package className="w-6 h-6" style={{ color: 'rgb(var(--sage-green))' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Order Processing</h3>
                  <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Our team is carefully preparing your items. You'll receive an email confirmation 
                    shortly with your order details.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--sky-blue)/0.2)] to-[rgb(var(--twilight-purple)/0.2)] flex items-center justify-center">
                  <Truck className="w-6 h-6" style={{ color: 'rgb(var(--twilight-purple))' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Shipping & Delivery</h3>
                  <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Your order will be shipped within 2-3 business days. We'll send you tracking 
                    information once it's on its way.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--cherry-blossom)/0.2)] to-[rgb(var(--lavender)/0.2)] flex items-center justify-center">
                  <Heart className="w-6 h-6" style={{ color: 'rgb(var(--cherry-blossom))' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Enjoy Your Items!</h3>
                  <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Each item you've chosen has a story. Thank you for giving these treasures 
                    a new home and supporting our community.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Message */}
          <div className="ghibli-card p-8 mb-8 watercolor-sage text-center">
            <h2 className="text-2xl font-bold mb-4">Your Impact</h2>
            <p className="text-lg mb-6" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
              By choosing to shop at Sakshi, you've helped divert items from landfills, 
              supported sustainable practices, and contributed to a more equitable community. 
              Every purchase makes a difference!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: 'rgb(var(--sage-green))' }}>
                  2,700L
                </div>
                <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Water Saved
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: 'rgb(var(--terracotta))' }}>
                  5.5kg
                </div>
                <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  CO₂ Prevented
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: 'rgb(var(--sunrise-orange))' }}>
                  100%
                </div>
                <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Landfill Diverted
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setLocation("/profile")}
              variant="outline"
              className="rounded-full"
            >
              <Package className="w-4 h-4 mr-2" />
              View My Orders
            </Button>

            <Button
              onClick={() => setLocation("/shop")}
              className="rounded-full ghibli-button"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                color: 'white'
              }}
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
              Need help? Contact us at <a href="mailto:hello@sakshithrift.org" className="font-medium hover:underline" style={{ color: 'rgb(var(--sage-green))' }}>hello@sakshithrift.org</a>
            </p>
            <p className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.5)' }}>
              You'll receive order updates via email. Check your spam folder if you don't see them.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
