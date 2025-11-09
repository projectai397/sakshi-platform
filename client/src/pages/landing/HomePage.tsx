import { Link } from 'wouter';
import { Leaf, Heart, Users, TrendingUp, ChefHat, Recycle, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Conscious Living Made Accessible
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              Join thousands discovering the joy of healthy food, sustainable living, and meaningful community—all at a price that feels right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <a className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg">
                  Start Your Journey
                </a>
              </Link>
              <Link href="/cafe">
                <a className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-800 transition-all border-2 border-white">
                  Explore Our Cafe
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">100% Plant-Based</h3>
            <p className="text-gray-600 leading-relaxed">
              Discover the power of Satvic nutrition with our carefully crafted menu of wholesome, plant-based meals. Every dish is designed to nourish your body, calm your mind, and honor the planet.
            </p>
          </div>

          <div className="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Pay What Feels Right</h3>
            <p className="text-gray-600 leading-relaxed">
              Our revolutionary triple pricing system ensures everyone can access healthy food with dignity. Choose the Community tier if money is tight, the Fair tier to cover costs, or the Supporter tier to help others.
            </p>
          </div>

          <div className="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Earn While You Learn</h3>
            <p className="text-gray-600 leading-relaxed">
              Every action you take earns Seva tokens—attend a cooking class, volunteer at a repair cafe, share an upcycle project. Use your tokens for discounts on meals, workshops, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25,847</div>
              <div className="text-gray-600">Healthy Meals Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">1,293</div>
              <div className="text-gray-600">Items Repaired & Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">847</div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">12,450</div>
              <div className="text-gray-600">Seva Tokens Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Join Our Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create your free account in seconds. No credit card required, no commitment necessary. Just your email and a desire to live more consciously.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Explore Our Offerings</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse our Satvic cafe menu, upcoming cooking classes, repair cafe events, swap meetups, and upcycle workshops. There's something for everyone.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Choose Your Price</h3>
                <p className="text-gray-600 leading-relaxed">
                  Select the pricing tier that feels right for you. Community pricing if you're on a tight budget, Fair pricing to cover our costs, or Supporter pricing to help others.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Earn & Grow</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every meal, class, and community contribution earns you Seva tokens. Use them for discounts, unlock special workshops, or donate them to help others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <ChefHat className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Sakshi Cafe</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Step into our warm, welcoming space where every meal is crafted with consciousness and care. Our menu celebrates the Satvic Movement's principles—100% plant-based, locally sourced when possible, and prepared with love.
              </p>
              <Link href="/cafe/menu">
                <a className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center">
                  View Menu →
                </a>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Cooking Classes</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Master the art of Satvic cooking with our hands-on classes led by experienced chefs. From knife skills to Ayurvedic meal planning, you'll gain practical knowledge you can use every day.
              </p>
              <Link href="/cafe/classes">
                <a className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center">
                  Browse Classes →
                </a>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Repair Cafe</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Bring your broken items and our skilled volunteers will help you repair them—completely free. From electronics to clothing, we're keeping things out of landfills and extending their useful life.
              </p>
              <Link href="/repair-cafe">
                <a className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center">
                  Learn More →
                </a>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Recycle className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Swap & Upcycle</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Join our money-free exchange marketplace and creative upcycle workshops. Transform trash into treasure, swap items you no longer need, and learn sustainable living skills.
              </p>
              <Link href="/circular-economy">
                <a className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center">
                  Explore →
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Community Stories</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <p className="text-gray-600 italic mb-6">
              "I never thought I could afford to eat this healthy. The community pricing changed my life."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                P
              </div>
              <div>
                <div className="font-semibold text-gray-800">Priya S.</div>
                <div className="text-sm text-gray-500">Bangalore</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <p className="text-gray-600 italic mb-6">
              "The cooking classes taught me skills I'll use forever. Plus I earned tokens to try more workshops!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                R
              </div>
              <div>
                <div className="font-semibold text-gray-800">Rahul M.</div>
                <div className="text-sm text-gray-500">Mumbai</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <p className="text-gray-600 italic mb-6">
              "Finally, a place that aligns with my values. The food is incredible and the community is even better."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                A
              </div>
              <div>
                <div className="font-semibold text-gray-800">Anjali K.</div>
                <div className="text-sm text-gray-500">Delhi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Conscious Living Journey?</h2>
          <p className="text-xl mb-8 text-green-50 max-w-3xl mx-auto">
            Join our growing community of people who believe that healthy food, sustainable living, and meaningful connections should be accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup">
              <a className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg">
                Create Free Account
              </a>
            </Link>
            <Link href="/cafe">
              <a className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-800 transition-all border-2 border-white">
                Visit Our Cafe
              </a>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-green-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              100% plant-based guarantee
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <details className="bg-white p-6 rounded-lg shadow-md">
            <summary className="font-semibold text-lg cursor-pointer text-gray-800">
              What is Satvic food?
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Satvic food is based on ancient Ayurvedic principles and consists of pure, wholesome, plant-based ingredients that promote clarity, peace, and vitality. It excludes onion, garlic, and other tamasic (heavy) foods.
            </p>
          </details>

          <details className="bg-white p-6 rounded-lg shadow-md">
            <summary className="font-semibold text-lg cursor-pointer text-gray-800">
              How does the triple pricing work?
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Simply choose the tier that feels right for you when ordering. Community tier if you're on a budget, Fair tier to cover our costs, or Supporter tier to help others. There's no verification process—we trust you.
            </p>
          </details>

          <details className="bg-white p-6 rounded-lg shadow-md">
            <summary className="font-semibold text-lg cursor-pointer text-gray-800">
              What are Seva tokens?
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Seva tokens are our community currency. You earn them by participating—attending classes, volunteering, sharing recipes, helping at events. Use them for discounts on meals, workshops, and more.
            </p>
          </details>

          <details className="bg-white p-6 rounded-lg shadow-md">
            <summary className="font-semibold text-lg cursor-pointer text-gray-800">
              Do I need to be vegetarian to join?
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Not at all! While our food is 100% plant-based, we welcome everyone regardless of their dietary choices. Many of our members are on a journey toward plant-based eating, and we're here to support wherever you are on that path.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
