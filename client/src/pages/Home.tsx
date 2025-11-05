import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  TrendingUp,
  Gift,
  Recycle,
  Users,
  ArrowRight,
  Coffee
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = trpc.products.getFeatured.useQuery();
  const { data: impactMetrics } = trpc.impact.getTotal.useQuery();
  const { data: upcomingEvents } = trpc.events.list.useQuery({ activeOnly: true });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="adiyogi-bg-1 py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center animate-fadeIn">
              <div className="inline-block mb-6">
                <span className="text-6xl animate-float">🍃</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Shop with <span className="text-gradient-sage">Purpose</span>,<br />
                Pay with <span className="text-gradient-warm">Heart</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                A revolutionary thrift store where every item has a story. Pay with money, 
                seva tokens earned through volunteering, or request items free—no questions asked.
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
                    Start Shopping
                  </Button>
                </Link>
                <Link href="/repair-cafe">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full text-lg px-8"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Triple Pricing Explainer */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Three Ways to <span className="text-gradient-sage">Shop</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Choose the payment method that works best for you. Everyone deserves access to quality items.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Money */}
              <div className="ghibli-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full watercolor-terracotta flex items-center justify-center text-3xl">
                  💰
                </div>
                <h3 className="text-xl font-bold mb-3">Sliding Scale</h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Pay what you can afford. Every item has a suggested price range (₹50-₹300). 
                  Choose what feels right for your situation.
                </p>
                <div className="inline-block px-4 py-2 rounded-full watercolor-terracotta text-sm font-medium">
                  Pay What You Can
                </div>
              </div>

              {/* Seva Tokens */}
              <div className="ghibli-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full watercolor-sage flex items-center justify-center text-3xl">
                  ✨
                </div>
                <h3 className="text-xl font-bold mb-3">Seva Tokens</h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Earn tokens by volunteering (1 hour = 1 token). Use tokens to shop across 
                  all Sakshi programs—stores, cafés, retreats.
                </p>
                <div className="inline-block px-4 py-2 rounded-full watercolor-sage text-sm font-medium">
                  Earn Through Service
                </div>
              </div>

              {/* Free */}
              <div className="ghibli-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] flex items-center justify-center text-3xl">
                  💝
                </div>
                <h3 className="text-xl font-bold mb-3">Request Free</h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Need something but can't pay? Just request it. No forms, no proof required. 
                  We trust you and honor your dignity.
                </p>
                <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] text-sm font-medium text-white">
                  No Questions Asked
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {!productsLoading && featuredProducts && featuredProducts.length > 0 && (
          <section className="py-16 md:py-24 adiyogi-bg-1">
            <div className="container">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Featured <span className="text-gradient-sage">Treasures</span>
                  </h2>
                  <p className="text-lg" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Each item is unique and has its own story
                  </p>
                </div>
                <Link href="/shop">
                  <Button variant="outline" className="rounded-full">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <Link key={product.id} href={`/product/${product.slug}`}>
                    <div className="ghibli-card cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-[rgb(var(--warm-cream))] to-[rgb(var(--sky-blue)/0.2)] flex items-center justify-center text-6xl">
                        📦
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-1">{product.name}</h3>
                        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                          {product.description}
                        </p>
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
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Impact Metrics */}
        {impactMetrics && (
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Our <span className="text-gradient-sage">Impact</span>
                </h2>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Together, we're healing the planet and supporting our community
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <div className="impact-stat">
                  <div className="impact-number">{impactMetrics.totalItemsDiverted || 0}</div>
                  <div className="impact-label">Items Saved from Landfill</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-number">{impactMetrics.totalFamiliesServed || 0}</div>
                  <div className="impact-label">Families Served</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-number">{impactMetrics.totalTokensCirculated || 0}</div>
                  <div className="impact-label">Seva Tokens Circulated</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-number">{Math.floor((impactMetrics.totalVolunteerHours || 0) / 60)}</div>
                  <div className="impact-label">Volunteer Hours</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Circular Economy Features */}
        <section className="py-16 md:py-24 adiyogi-bg-1">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Beyond <span className="text-gradient-sage">Shopping</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                We're building a circular economy where nothing goes to waste
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/cafes">
                <div className="ghibli-card p-6 text-center cursor-pointer h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[rgb(var(--terracotta))] to-[rgb(var(--sunrise-orange))] flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Sakshi Cafés</h3>
                  <p className="text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Women-owned cooperative spaces. Organic food, no WiFi, genuine connection.
                  </p>
                  <Button variant="outline" className="rounded-full w-full">
                    Learn More
                  </Button>
                </div>
              </Link>

              <Link href="/repair-cafe">
                <div className="ghibli-card p-6 text-center cursor-pointer h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full watercolor-sage flex items-center justify-center">
                    <Recycle className="w-6 h-6" style={{ color: 'rgb(var(--sage-green))' }} />
                  </div>
                 <h3 className="text-xl font-bold mb-3">Repair Café</h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Fix it, don't toss it! Skilled volunteers help repair your beloved items.
                </p>
                <Button variant="outline" className="rounded-full w-full">
                  Learn More
                </Button>          </div>
              </Link>

              <Link href="/swap-events">
                <div className="ghibli-card p-6 text-center cursor-pointer h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full watercolor-sky flex items-center justify-center">
                    <Users className="w-6 h-6" style={{ color: 'rgb(var(--sky-blue))' }} />
                  </div>
                  <h3 className="font-bold mb-2">Swap Events</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Monthly community exchanges. Bring items, take items—no money needed.
                  </p>
                </div>
              </Link>

              <Link href="/upcycle">
                <div className="ghibli-card p-6 text-center cursor-pointer h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full watercolor-terracotta flex items-center justify-center">
                    <Sparkles className="w-6 h-6" style={{ color: 'rgb(var(--terracotta))' }} />
                  </div>
                  <h3 className="font-bold mb-2">Upcycle Studio</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Transform worn items into art. Creative workshops every weekend.
                  </p>
                </div>
              </Link>

              <Link href="/childrens-free-zone">
                <div className="ghibli-card p-6 text-center cursor-pointer h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">Children's Free Zone</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    ALL children's items are always free. Every child deserves quality items.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Community Stories</h2>
            <p className="text-center text-lg mb-12" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Real stories from our community members
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="ghibli-card p-8">
                <div className="text-4xl mb-4">💚</div>
                <p className="text-lg mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  "I volunteered for 10 hours and earned enough tokens to furnish my entire apartment. 
                  This place changed my life!"
                </p>
                <div className="font-bold">- Priya, Student</div>
              </div>

              <div className="ghibli-card p-8">
                <div className="text-4xl mb-4">🌟</div>
                <p className="text-lg mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  "Every item has a story. Shopping here feels like connecting with the community's 
                  history and heart."
                </p>
                <div className="font-bold">- Rajesh, Teacher</div>
              </div>

              <div className="ghibli-card p-8">
                <div className="text-4xl mb-4">🎁</div>
                <p className="text-lg mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  "I got my daughter's school supplies completely free. No judgment, just kindness. 
                  Thank you Sakshi!"
                </p>
                <div className="font-bold">- Meera, Mother</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="ghibli-card p-12 text-center max-w-3xl mx-auto watercolor-sage">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our <span className="text-gradient-sage">Community</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Whether you shop, donate, volunteer, or simply spread the word—you're part of 
                something beautiful. Together, we're proving that another way is possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/donate">
                  <Button 
                    size="lg" 
                    className="rounded-full ghibli-button"
                    style={{ 
                      background: 'linear-gradient(135deg, rgb(var(--terracotta)), rgb(var(--sunrise-orange)))',
                      color: 'white'
                    }}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Donate Items
                  </Button>
                </Link>
                <Link href="/volunteer">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Volunteer
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
