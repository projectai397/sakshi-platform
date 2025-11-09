import { Link } from 'wouter';
import { ChefHat, Users, Clock, Award } from 'lucide-react';

export default function ClassesLanding() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[600px] bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master the Art of Satvic Cooking
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Learn to create delicious, nourishing plant-based meals from expert chefs.
            </p>
            <Link href="/cafe/classes">
              <a className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-all inline-block">
                Browse Classes
              </a>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
