import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Coffee, Users, Heart, Leaf, Scale, Sparkles, MapPin, Clock, Award } from "lucide-react";

export default function Cafes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-warm-cream">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta/10 via-cherry-blossom/10 to-lavender/10"></div>
        <div className="container relative z-10 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <Coffee className="w-16 h-16 text-terracotta mx-auto" />
            </div>
            <h1 className="font-comfortaa text-5xl md:text-6xl font-bold mb-6">
              <span className="text-charcoal">Sakshi </span>
              <span className="text-gradient-terracotta">Cafés</span>
            </h1>
            <p className="text-2xl md:text-3xl font-quicksand text-charcoal/80 mb-4">
              महिलाओं का सम्मान, समाज का उत्थान
            </p>
            <p className="text-xl text-charcoal/70 italic">
              Women's dignity, society's upliftment
            </p>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg text-charcoal/80 leading-relaxed">
              Women-run cooperative spaces where every cup of chai builds dignity, every meal creates community, 
              and every conversation matters. 100% worker-owned, democratically governed, and committed to 
              local, organic, zero-waste values.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/cafes/locations">
              <Button size="lg" className="bg-gradient-to-r from-terracotta to-sunrise-orange hover:from-sunrise-orange hover:to-terracotta text-white shadow-lg">
                <MapPin className="w-5 h-5 mr-2" />
                Find a Café
              </Button>
            </Link>
            <Link href="/cafes/join">
              <Button size="lg" variant="outline" className="border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                <Users className="w-5 h-5 mr-2" />
                Join a Cooperative
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Revolutionary Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-6xl">
          <h2 className="font-comfortaa text-4xl font-bold text-center mb-4">
            What Makes Us <span className="text-gradient-terracotta">Revolutionary</span>
          </h2>
          <p className="text-center text-charcoal/70 mb-16 max-w-2xl mx-auto">
            Not just a café—a movement for women's empowerment, conscious consumption, and genuine community
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Democratic Ownership */}
            <div className="ghibli-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-terracotta/20 to-sunrise-orange/20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-terracotta" />
              </div>
              <h3 className="font-comfortaa text-2xl font-bold mb-4 text-charcoal">
                100% Worker-Owned
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-4">
                Every café is owned by 5-8 women workers. Equal voting rights, profit-sharing, 
                and democratic decision-making. Not just employees—owners with dignity.
              </p>
              <ul className="text-left text-sm text-charcoal/60 space-y-2">
                <li>✓ One person, one vote</li>
                <li>✓ Transparent finances</li>
                <li>✓ Monthly wages: ₹15,000-25,000</li>
                <li>✓ Health insurance included</li>
                <li>✓ 6 months paid maternity leave</li>
              </ul>
            </div>

            {/* Feature 2: No WiFi Policy */}
            <div className="ghibli-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cherry-blossom/20 to-lavender/20 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-cherry-blossom" />
              </div>
              <h3 className="font-comfortaa text-2xl font-bold mb-4 text-charcoal">
                Analog Social Space
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-4">
                No WiFi. No charging points. Just books, board games, conversation starter cards, 
                and genuine human connection. Be present with your food and company.
              </p>
              <ul className="text-left text-sm text-charcoal/60 space-y-2">
                <li>✓ Face-to-face conversations</li>
                <li>✓ Books & board games available</li>
                <li>✓ Community bulletin board</li>
                <li>✓ Handwritten menu boards</li>
                <li>✓ Slower, meaningful pace</li>
              </ul>
            </div>

            {/* Feature 3: Sliding Scale Pricing */}
            <div className="ghibli-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-green/20 to-forest-green/20 flex items-center justify-center mx-auto mb-6">
                <Scale className="w-8 h-8 text-sage-green" />
              </div>
              <h3 className="font-comfortaa text-2xl font-bold mb-4 text-charcoal">
                Triple Pricing
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-4">
                Every item has three prices: Community (if money is tight), Fair (covers costs), 
                Supporter (helps others). Plus seva tokens and free meal program.
              </p>
              <div className="text-left text-sm space-y-3 mt-6">
                <div className="p-3 bg-sage-green/10 rounded-lg">
                  <div className="font-semibold text-charcoal mb-1">Masala Chai</div>
                  <div className="text-charcoal/60">₹20 | ₹30 | ₹50 or 2 tokens</div>
                </div>
                <div className="p-3 bg-terracotta/10 rounded-lg">
                  <div className="font-semibold text-charcoal mb-1">Full Thali</div>
                  <div className="text-charcoal/60">₹60 | ₹100 | ₹150 or 8 tokens</div>
                </div>
              </div>
            </div>

            {/* Feature 4: Local & Organic */}
            <div className="ghibli-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-green/20 to-sage-green/20 flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-forest-green" />
              </div>
              <h3 className="font-comfortaa text-2xl font-bold mb-4 text-charcoal">
                Local & Organic
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-4">
                80%+ ingredients sourced within 50km. 100% organic. Seasonal menu changes every 3 months. 
                Traditional recipes, zero processed foods.
              </p>
              <ul className="text-left text-sm text-charcoal/60 space-y-2">
                <li>✓ Support local farmers</li>
                <li>✓ Certified organic ingredients</li>
                <li>✓ Vegetarian with vegan options</li>
                <li>✓ Seasonal, fresh menu</li>
                <li>✓ Traditional recipes</li>
              </ul>
            </div>

            {/* Feature 5: Zero Waste */}
            <div className="ghibli-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-blue/20 to-twilight-purple/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-sky-blue" />
              </div>
              <h3 className="font-comfortaa text-2xl font-bold mb-4 text-charcoal">
                Zero Waste
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-4">
                99%+ waste diversion. No single-use plastics. Bring your own container for 10% discount. 
                Food waste composted, surplus donated.
              </p>
              <ul className="text-left text-sm text-charcoal/60 space-y-2">
                <li>✓ Steel plates & cloth napkins</li>
                <li>✓ Compostable packaging only</li>
                <li>✓ Root-to-stem cooking</li>
                <li>✓ Coffee grounds to gardeners</li>
                <li>✓ Zero to landfill</li>
              </ul>
            </div>

            {/* Feature 6: Community Impact */}
            <div className="ghibli-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sunrise-orange/20 to-terracotta/20 flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-sunrise-orange" />
              </div>
              <h3 className="font-comfortaa text-2xl font-bold mb-4 text-charcoal">
                Community First
              </h3>
              <p className="text-charcoal/70 leading-relaxed mb-4">
                Suspended meals program. First Sunday monthly: all meals free. Partnership with shelters. 
                No one turned away hungry.
              </p>
              <ul className="text-left text-sm text-charcoal/60 space-y-2">
                <li>✓ Pay-it-forward meal tokens</li>
                <li>✓ Monthly community celebration</li>
                <li>✓ Bulk orders for shelters</li>
                <li>✓ Discreet free meal requests</li>
                <li>✓ Dignity for all</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Menu Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-warm-cream via-cherry-blossom/5 to-lavender/5">
        <div className="container max-w-6xl">
          <h2 className="font-comfortaa text-4xl font-bold text-center mb-4">
            Sample <span className="text-gradient-terracotta">Menu</span>
          </h2>
          <p className="text-center text-charcoal/70 mb-12">
            Seasonal, organic, lovingly prepared. Menu changes every 3 months.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Beverages */}
            <div className="ghibli-card p-6">
              <h3 className="font-comfortaa text-2xl font-bold mb-6 text-terracotta flex items-center gap-2">
                <Coffee className="w-6 h-6" />
                Beverages
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-charcoal mb-1">Masala Chai</div>
                  <div className="text-sm text-charcoal/60">₹20 | ₹30 | ₹50</div>
                  <div className="text-xs text-sage-green mt-1">or 2 seva tokens</div>
                </div>
                <div>
                  <div className="font-semibold text-charcoal mb-1">Filter Coffee</div>
                  <div className="text-sm text-charcoal/60">₹25 | ₹35 | ₹60</div>
                  <div className="text-xs text-sage-green mt-1">or 3 seva tokens</div>
                </div>
                <div>
                  <div className="font-semibold text-charcoal mb-1">Fresh Lime Soda</div>
                  <div className="text-sm text-charcoal/60">₹15 | ₹25 | ₹40</div>
                  <div className="text-xs text-sage-green mt-1">or 2 seva tokens</div>
                </div>
                <div>
                  <div className="font-semibold text-charcoal mb-1">Golden Milk</div>
                  <div className="text-sm text-charcoal/60">₹30 | ₹45 | ₹70</div>
                  <div className="text-xs text-sage-green mt-1">or 4 seva tokens</div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="ghibli-card p-6">
              <h3 className="font-comfortaa text-2xl font-bold mb-6 text-terracotta flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Meals
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-charcoal mb-1">Full Thali</div>
                  <div className="text-xs text-charcoal/50 mb-1">Dal, sabzi, roti, rice, salad</div>
                  <div className="text-sm text-charcoal/60">₹60 | ₹100 | ₹150</div>
                  <div className="text-xs text-sage-green mt-1">or 8 seva tokens</div>
                </div>
                <div>
                  <div className="font-semibold text-charcoal mb-1">Khichdi with Kadhi</div>
                  <div className="text-sm text-charcoal/60">₹50 | ₹80 | ₹120</div>
                  <div className="text-xs text-sage-green mt-1">or 6 seva tokens</div>
                </div>
                <div>
                  <div className="font-semibold text-charcoal mb-1">Fresh Salad Bowl</div>
                  <div className="text-sm text-charcoal/60">₹40 | ₹60 | ₹90</div>
                  <div className="text-xs text-sage-green mt-1">or 5 seva tokens</div>
                </div>
                <div>
                  <div className="font-semibold text-charcoal mb-1">Seasonal Soup + Bread</div>
                  <div className="text-sm text-charcoal/60">₹45 | ₹70 | ₹100</div>
                  <div className="text-xs text-sage-green mt-1">or 6 seva tokens</div>
                </div>
              </div>
            </div>

            {/* Snacks */}
            <div className="ghibli-card p-6">
              <h3 className="font-comfortaa text-2xl font-bold mb-6 text-terracotta flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Snacks
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-charcoal mb-1">Samosas (2 pc)</div>
                  <div className="text-sm text-charcoal/60">₹20 | ₹30 | ₹50</div>
                  <div className="text-xs text-sage-green mt-1">or 3 seva tokens</div>
                </div>
                <div>
                  <div className="font-semibold text-charcoal mb-1">Pakoras</div>
                  <div className="text-sm text-charcoal/60">₹25 | ₹40 | ₹60</div>
                  <div className="text-xs text-sage-green mt-1">or 3 seva tokens</div>
                </div>
                <div>
                  <div className="font-semibold text-charcoal mb-1">Homemade Cookies (2 pc)</div>
                  <div className="text-sm text-charcoal/60">₹15 | ₹25 | ₹40</div>
                  <div className="text-xs text-sage-green mt-1">or 2 seva tokens</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-charcoal/60 italic">
              * Menu varies by season and location. All items 100% organic and locally sourced.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-6xl">
          <h2 className="font-comfortaa text-4xl font-bold text-center mb-4">
            Our <span className="text-gradient-terracotta">Impact</span>
          </h2>
          <p className="text-center text-charcoal/70 mb-16">
            Building dignity, one cup at a time
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient-terracotta mb-2">50+</div>
              <div className="text-charcoal/70 font-quicksand">Women Empowered</div>
              <div className="text-sm text-charcoal/50 mt-1">by Year 3</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient-sage mb-2">10</div>
              <div className="text-charcoal/70 font-quicksand">Cooperative Cafés</div>
              <div className="text-sm text-charcoal/50 mt-1">across 5 cities</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient-terracotta mb-2">99%</div>
              <div className="text-charcoal/70 font-quicksand">Waste Diverted</div>
              <div className="text-sm text-charcoal/50 mt-1">zero to landfill</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient-sage mb-2">₹3Cr</div>
              <div className="text-charcoal/70 font-quicksand">Annual Revenue</div>
              <div className="text-sm text-charcoal/50 mt-1">self-sustaining</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-terracotta/10 via-cherry-blossom/10 to-warm-cream">
        <div className="container max-w-4xl text-center">
          <h2 className="font-comfortaa text-4xl font-bold mb-6">
            Join the <span className="text-gradient-terracotta">Movement</span>
          </h2>
          <p className="text-xl text-charcoal/70 mb-12 leading-relaxed">
            Whether you're a woman looking for dignified livelihood, a customer seeking conscious consumption, 
            or someone who believes in community—there's a place for you at Sakshi Cafés.
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/cafes/locations">
              <Button size="lg" className="bg-gradient-to-r from-terracotta to-sunrise-orange hover:from-sunrise-orange hover:to-terracotta text-white shadow-lg">
                <MapPin className="w-5 h-5 mr-2" />
                Visit a Café
              </Button>
            </Link>
            <Link href="/cafes/join">
              <Button size="lg" variant="outline" className="border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                <Users className="w-5 h-5 mr-2" />
                Become a Co-op Member
              </Button>
            </Link>
            <Link href="/seva-wallet">
              <Button size="lg" variant="outline" className="border-2 border-sage-green text-sage-green hover:bg-sage-green hover:text-white">
                <Sparkles className="w-5 h-5 mr-2" />
                Earn Seva Tokens
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
