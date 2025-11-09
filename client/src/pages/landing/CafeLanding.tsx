import { Link } from 'wouter';
import { Leaf, Heart, Clock, MapPin, Star, Utensils, Coffee, Award } from 'lucide-react';

export default function CafeLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-amber-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Satvic Food That Nourishes Body, Mind & Spirit
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-50">
              Experience the joy of plant-based eating with our carefully crafted menu of wholesome, delicious meals. Every dish honors Ayurvedic wisdom while delighting modern palates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cafe/menu">
                <a className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-all transform hover:scale-105 shadow-lg inline-block text-center">
                  View Menu
                </a>
              </Link>
              <Link href="/cafe/order">
                <a className="bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-800 transition-all border-2 border-white inline-block text-center">
                  Order Now
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Featured Dishes</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our menu changes with the seasons, celebrating fresh, local ingredients at their peak
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Sattvic Thali</h3>
              <p className="text-gray-600 text-sm mb-4">
                A complete, balanced meal featuring seasonal vegetables, dal, rice, roti, salad, and dessert.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-green-600">₹180</span> / ₹250 / ₹350
                </div>
                <Link href="/cafe/menu">
                  <a className="text-green-600 font-semibold hover:text-green-700">Order →</a>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Buddha Bowl</h3>
              <p className="text-gray-600 text-sm mb-4">
                Nourishing bowl with quinoa, roasted vegetables, greens, sprouts, and tahini dressing.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-green-600">₹150</span> / ₹200 / ₹280
                </div>
                <Link href="/cafe/menu">
                  <a className="text-green-600 font-semibold hover:text-green-700">Order →</a>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-lime-400 to-green-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Green Goddess Smoothie</h3>
              <p className="text-gray-600 text-sm mb-4">
                Energizing blend of spinach, mango, banana, dates, and almond milk.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-green-600">₹80</span> / ₹120 / ₹160
                </div>
                <Link href="/cafe/menu">
                  <a className="text-green-600 font-semibold hover:text-green-700">Order →</a>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-amber-400 to-orange-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Ayurvedic Kitchari</h3>
              <p className="text-gray-600 text-sm mb-4">
                Healing one-pot meal of rice, mung dal, and spices. Gentle on digestion.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-green-600">₹120</span> / ₹170 / ₹230
                </div>
                <Link href="/cafe/menu">
                  <a className="text-green-600 font-semibold hover:text-green-700">Order →</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Sakshi Cafe */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Sakshi Cafe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">100% Plant-Based</h3>
                <p className="text-gray-600">
                  Every ingredient is thoughtfully selected to nourish without harm. No animal products, no compromise on taste.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Ayurvedic Wisdom</h3>
                <p className="text-gray-600">
                  Our menu is designed according to Ayurvedic principles, balancing doshas and promoting optimal health.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Locally Sourced</h3>
                <p className="text-gray-600">
                  We partner with local organic farmers whenever possible, supporting sustainable agriculture.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Made With Love</h3>
                <p className="text-gray-600">
                  Our chefs prepare each dish with care and consciousness, treating cooking as meditation and service.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-rose-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Community Atmosphere</h3>
                <p className="text-gray-600">
                  More than a cafe, we're a gathering place for like-minded souls seeking nourishment and connection.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Triple Pricing</h3>
                <p className="text-gray-600">
                  Choose the price that feels right—Community, Fair, or Supporter. Everyone eats with dignity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Triple Pricing Explanation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">How Triple Pricing Works</h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              We believe healthy food should be accessible to everyone, regardless of their financial situation.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-xl border-2 border-blue-200">
                <div className="text-center mb-4">
                  <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
                    Community Tier
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Covers the cost of ingredients and basic operations. Choose this tier if money is tight or you're going through a difficult time.
                </p>
                <p className="text-sm text-gray-600 italic">
                  No proof required, no questions asked.
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-xl border-2 border-green-200">
                <div className="text-center mb-4">
                  <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full font-bold">
                    Fair Tier
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Covers the full cost including ingredients, labor, rent, and operations. This is our suggested price.
                </p>
                <p className="text-sm text-gray-600 italic">
                  Helps us maintain quality and sustainability.
                </p>
              </div>

              <div className="bg-amber-50 p-8 rounded-xl border-2 border-amber-200">
                <div className="text-center mb-4">
                  <div className="inline-block bg-amber-600 text-white px-4 py-2 rounded-full font-bold">
                    Supporter Tier
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Pays a bit extra to help subsidize community tier meals for others. If you're in a position to help, this is beautiful.
                </p>
                <p className="text-sm text-gray-600 italic">
                  Support your neighbors with generosity.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-xl">
              <p className="text-center text-gray-700 text-lg">
                <strong>The beauty of this system</strong> is that it balances out naturally. Some pay less, some pay more, and everyone eats well. It's community economics at its finest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The Sattvic Thali is absolutely divine! I feel energized and light after every meal. The community pricing made it possible for me to eat here regularly."
              </p>
              <div className="font-semibold text-gray-800">Meera P.</div>
              <div className="text-sm text-gray-500">Regular Customer</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As someone new to plant-based eating, Sakshi Cafe has been a revelation. The food is so delicious, I don't even miss meat!"
              </p>
              <div className="font-semibold text-gray-800">Arjun S.</div>
              <div className="text-sm text-gray-500">New to Plant-Based</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The atmosphere is so peaceful and welcoming. I love that I can support others by choosing the supporter tier. It feels good to give back."
              </p>
              <div className="font-semibold text-gray-800">Lakshmi K.</div>
              <div className="text-sm text-gray-500">Supporter Tier Member</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Visit Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-8 rounded-xl">
                <div className="flex items-start gap-4 mb-6">
                  <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Location</h3>
                    <p className="text-gray-700">
                      123 Wellness Street<br />
                      Koramangala, Bangalore<br />
                      Karnataka 560034
                    </p>
                  </div>
                </div>
                <Link href="/cafe/locations">
                  <a className="text-green-600 font-semibold hover:text-green-700">
                    View All Locations →
                  </a>
                </Link>
              </div>

              <div className="bg-amber-50 p-8 rounded-xl">
                <div className="flex items-start gap-4 mb-6">
                  <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday: 8:00 AM - 9:00 PM<br />
                      Saturday - Sunday: 9:00 AM - 10:00 PM<br />
                      <span className="text-sm text-gray-600">Last order 30 mins before closing</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Satvic Dining?</h2>
          <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
            Join us for a meal that nourishes your body, delights your taste buds, and supports your wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cafe/menu">
              <a className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg inline-block">
                Browse Menu
              </a>
            </Link>
            <Link href="/cafe/order">
              <a className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-800 transition-all border-2 border-white inline-block">
                Order Online
              </a>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
