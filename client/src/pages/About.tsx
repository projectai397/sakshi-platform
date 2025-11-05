import { Link } from "wouter";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Users, Leaf, Sparkles, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="adiyogi-bg-2 py-16 md:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="text-6xl animate-float">🌱</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About <span className="text-gradient-sage">Sakshi</span>
              </h1>
              <p className="text-lg md:text-xl" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                More than a thrift store—we're building a community where everyone belongs
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="ghibli-card p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-lg" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  <p>
                    Sakshi began with a simple question: <strong>What if shopping could be an act of kindness?</strong>
                  </p>
                  <p>
                    Founded as an initiative of an NGO dedicated to community welfare, Sakshi reimagines how we think about value, exchange, and belonging. We believe that everyone deserves access to quality items, regardless of their financial situation.
                  </p>
                  <p>
                    Our name, "Sakshi," means "witness" in Sanskrit—a reminder that we witness and honor each person's story, struggles, and strengths. Here, you're not just a customer; you're part of a movement toward a more compassionate economy.
                  </p>
                  <p>
                    Through our revolutionary <strong>triple pricing system</strong> and <strong>seva token economy</strong>, we've created a space where money isn't the only currency that matters. Time, skills, and community contribution are equally valuable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 adiyogi-bg-2">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our <span className="text-gradient-warm">Values</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                These principles guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="ghibli-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full watercolor-sage flex items-center justify-center">
                  <Heart className="w-8 h-8" style={{ color: 'rgb(var(--sage-green))' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Dignity</h3>
                <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Everyone deserves respect and access, no matter their circumstances
                </p>
              </div>

              <div className="ghibli-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full watercolor-sky flex items-center justify-center">
                  <Users className="w-8 h-8" style={{ color: 'rgb(var(--sky-blue))' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  We're stronger together, supporting each other through shared resources
                </p>
              </div>

              <div className="ghibli-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full watercolor-terracotta flex items-center justify-center">
                  <Leaf className="w-8 h-8" style={{ color: 'rgb(var(--terracotta))' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Sustainability</h3>
                <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Every item saved from landfill is a victory for our planet
                </p>
              </div>

              <div className="ghibli-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[rgb(var(--cherry-blossom))] to-[rgb(var(--twilight-purple))] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Reimagining commerce to put people and planet first
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our <span className="text-gradient-sage">Impact</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Together, we're making a real difference
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="impact-stat">
                <div className="impact-number">1,250</div>
                <div className="impact-label">Items Saved</div>
              </div>
              <div className="impact-stat">
                <div className="impact-number">450</div>
                <div className="impact-label">Families Served</div>
              </div>
              <div className="impact-stat">
                <div className="impact-number">890</div>
                <div className="impact-label">Tokens Circulated</div>
              </div>
              <div className="impact-stat">
                <div className="impact-number">70</div>
                <div className="impact-label">Volunteer Hours</div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="ghibli-card p-8">
                <h3 className="text-2xl font-bold mb-4">Beyond the Numbers</h3>
                <div className="space-y-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  <p>
                    Behind every statistic is a story—a family who found what they needed, a volunteer who discovered new skills, a community member who felt seen and valued.
                  </p>
                  <p>
                    We've hosted repair cafés where neighbors teach each other to fix broken items. We've run swap events where children trade toys they've outgrown. We've created an upcycle studio where creativity transforms the old into something beautiful and new.
                  </p>
                  <p>
                    But our greatest impact? <strong>Building a community where everyone belongs.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="py-16 watercolor-bg">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet the <span className="text-gradient-warm">Team</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Sakshi is powered by a dedicated team of staff, volunteers, and community members who believe in our mission. From sorting donations to running events, from managing the store to welcoming customers—every person plays a vital role.
              </p>
              <div className="ghibli-card p-8">
                <p className="text-lg font-medium mb-4">
                  "We're not just running a thrift store. We're building a blueprint for a more compassionate economy—one where everyone has what they need, and no one is left behind."
                </p>
                <p className="text-sm handwritten" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                  — The Sakshi Team
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join Our Movement
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Whether you shop, volunteer, or donate, you're part of something bigger
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
                    Start Shopping
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/volunteer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full text-lg px-8"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Volunteer With Us
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
