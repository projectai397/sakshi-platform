import { Link } from "wouter";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Sparkles, 
  Heart, 
  Users, 
  ShoppingBag,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="adiyogi-bg-sunset py-16 md:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="text-6xl animate-float">✨</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                How <span className="text-gradient-sage">Sakshi</span> Works
              </h1>
              <p className="text-lg md:text-xl" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                A revolutionary approach to thrift shopping that values people over profit
              </p>
            </div>
          </div>
        </section>

        {/* Three Ways to Pay */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Three Ways to <span className="text-gradient-warm">Pay</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Choose the payment method that works best for you. Everyone deserves access to quality items.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Sliding Scale */}
              <div className="ghibli-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full watercolor-terracotta flex items-center justify-center">
                  <DollarSign className="w-8 h-8" style={{ color: 'rgb(var(--terracotta))' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Sliding Scale</h3>
                <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Pay what you can afford. Every item has a suggested price range, but you decide what's right for your situation.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">Choose any amount within the range</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">No judgment, no questions asked</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">Pay more if you can to help others</span>
                  </div>
                </div>
              </div>

              {/* Seva Tokens */}
              <div className="ghibli-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full watercolor-sage flex items-center justify-center">
                  <Sparkles className="w-8 h-8" style={{ color: 'rgb(var(--sage-green))' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Seva Tokens</h3>
                <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Earn tokens by volunteering your time and skills. Use them to "purchase" items without spending money.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">1 hour volunteering = 10 tokens</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">Tokens never expire</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">Build community while you earn</span>
                  </div>
                </div>
              </div>

              {/* Request Free */}
              <div className="ghibli-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Request Free</h3>
                <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Need something but can't pay? Just tell us why. We trust you and want to help.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">Share your story briefly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">Your request stays private</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="text-sm">All children's items always free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Seva Tokens Work */}
        <section className="py-16 adiyogi-bg-sunset">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  The <span className="text-gradient-sage">Seva Token</span> Economy
                </h2>
                <p className="text-lg" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  "Seva" means selfless service. Our token system creates a circular economy where time and skills are as valuable as money.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="ghibli-card p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" style={{ color: 'rgb(var(--sage-green))' }} />
                    Earning Tokens
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">📦</span>
                      <div>
                        <div className="font-medium">Sort & Organize</div>
                        <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Help sort donated items - 10 tokens/hour
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🔧</span>
                      <div>
                        <div className="font-medium">Repair Café</div>
                        <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Fix items for others - 15 tokens/hour
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🎨</span>
                      <div>
                        <div className="font-medium">Upcycle Studio</div>
                        <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Transform old items - 12 tokens/hour
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">👥</span>
                      <div>
                        <div className="font-medium">Event Support</div>
                        <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Help at swap events - 10 tokens/hour
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="ghibli-card p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" style={{ color: 'rgb(var(--terracotta))' }} />
                    Spending Tokens
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">👕</span>
                      <div>
                        <div className="font-medium">Clothing</div>
                        <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Most items: 20-50 tokens
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">📚</span>
                      <div>
                        <div className="font-medium">Books & Media</div>
                        <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Typical range: 10-30 tokens
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🏠</span>
                      <div>
                        <div className="font-medium">Home Goods</div>
                        <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Varies by item: 30-100 tokens
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <div className="font-medium">Special Items</div>
                        <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          Unique pieces: 50-150 tokens
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl watercolor-sage text-center">
                <p className="text-lg font-medium">
                  💡 <strong>Pro Tip:</strong> Tokens never expire! Save up for that special item or use them as you go.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shopping Process */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Your Shopping <span className="text-gradient-warm">Journey</span>
                </h2>
                <p className="text-lg" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  From browsing to checkout, we've made it simple and welcoming
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Browse Our Collection",
                    description: "Explore unique, one-of-a-kind items. Each piece has its own story and character.",
                    icon: "🔍"
                  },
                  {
                    step: 2,
                    title: "Choose Your Payment Method",
                    description: "On each product page, select sliding scale money, seva tokens, or request free. It's entirely up to you.",
                    icon: "💳"
                  },
                  {
                    step: 3,
                    title: "Add to Cart",
                    description: "Items are reserved for 24 hours. Take your time to browse and decide.",
                    icon: "🛒"
                  },
                  {
                    step: 4,
                    title: "Checkout & Collect",
                    description: "Complete your order and arrange pickup at our center. We'll have everything ready for you.",
                    icon: "✅"
                  }
                ].map((item) => (
                  <div key={item.step} className="ghibli-card p-6 flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full watercolor-sage flex items-center justify-center text-3xl">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold px-3 py-1 rounded-full watercolor-terracotta">
                          Step {item.step}
                        </span>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                      <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 watercolor-bg">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Shopping?
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Join our community and discover the joy of conscious consumption
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="rounded-full ghibli-button text-lg px-8"
                    style={{
                      background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                      color: 'white'
                    }}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Browse Items
                  </Button>
                </Link>
                <Link href="/volunteer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full text-lg px-8"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Volunteering
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
