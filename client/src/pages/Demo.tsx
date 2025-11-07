import { useState } from "react";
import { Link } from "wouter";

/**
 * Demo Showcase Page
 * Demonstrates all key features of the Sakshi platform
 */

export default function Demo() {
  const [activeSection, setActiveSection] = useState("overview");

  const features = [
    {
      id: "triple-pricing",
      title: "Triple Pricing System",
      description: "Pay with money, seva tokens, or request for free",
      demo: "Browse products and see all three pricing options available",
      link: "/shop"
    },
    {
      id: "visual-search",
      title: "AI Visual Search",
      description: "Upload a photo to find similar items",
      demo: "Try uploading an image to find matching products",
      link: "/shop"
    },
    {
      id: "dpp",
      title: "Digital Product Passports",
      description: "Blockchain-verified product history and impact",
      demo: "View any product's complete lifecycle and environmental impact",
      link: "/shop"
    },
    {
      id: "recommendations",
      title: "Personalized Recommendations",
      description: "AI-powered product suggestions based on your preferences",
      demo: "Browse your personalized homepage to see recommendations",
      link: "/"
    },
    {
      id: "seva-tokens",
      title: "Seva Token Economy",
      description: "Earn tokens through volunteering and community service",
      demo: "Check your seva wallet and transaction history",
      link: "/seva-wallet"
    },
    {
      id: "sak-tokens",
      title: "SakshiCoin Rewards",
      description: "Earn SAK tokens for quality listings and engagement",
      demo: "View your SAK wallet and staking options",
      link: "/sak-wallet"
    },
    {
      id: "repair-cafe",
      title: "Repair Café",
      description: "Fix items, earn tokens, reduce waste",
      demo: "Explore upcoming repair events and submit requests",
      link: "/repair-cafe"
    },
    {
      id: "cafes",
      title: "Sakshi Cafés",
      description: "Women's cooperatives serving organic food",
      demo: "Find café locations and learn about the cooperative model",
      link: "/cafes"
    },
  ];

  const stats = [
    { label: "Products Listed", value: "1,247" },
    { label: "CO₂ Saved", value: "6,851 kg" },
    { label: "Water Saved", value: "3.4M liters" },
    { label: "Active Users", value: "892" },
    { label: "Seva Tokens Earned", value: "45,230" },
    { label: "SAK Tokens Awarded", value: "128,450" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Sakshi Platform Demo</h1>
          <p className="text-xl mb-8">
            Explore all features of the AI-powered circular economy platform
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/shop">
              <a className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Start Shopping
              </a>
            </Link>
            <Link href="/volunteer">
              <a className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Become a Volunteer
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="bg-blue-50 p-4 rounded mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Try it:</strong> {feature.demo}
                </p>
              </div>
              <Link href={feature.link}>
                <a className="text-blue-600 hover:text-blue-800 font-semibold">
                  Explore →
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* AI Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">AI/ML Capabilities</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">15 AI Features</h3>
              <p className="text-gray-600">
                From dynamic pricing to fraud detection, AI powers every aspect of the platform
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">⛓️</div>
              <h3 className="text-xl font-bold mb-3">Blockchain Integration</h3>
              <p className="text-gray-600">
                NFT product passports and tokenized rewards for transparency and trust
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-3">Impact Tracking</h3>
              <p className="text-gray-600">
                Real-time environmental impact measurement for every transaction
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join the circular economy revolution today
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register">
            <a className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Create Account
            </a>
          </Link>
          <Link href="/shop">
            <a className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
              Browse Products
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
