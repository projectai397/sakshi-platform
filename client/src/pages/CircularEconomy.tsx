import { Link } from "wouter";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Recycle, 
  Wrench, 
  Shuffle, 
  Palette, 
  Baby,
  ArrowRight,
  Heart,
  Leaf,
  Users,
  TrendingUp
} from "lucide-react";

export default function CircularEconomy() {
  const programs = [
    {
      id: "repair-cafe",
      icon: Wrench,
      emoji: "🔧",
      title: "Repair Café",
      tagline: "Fix it, Don't Toss It",
      description: "Skilled volunteers help repair your beloved items, extending their life and keeping them out of landfills. From electronics to clothing, we fix it together.",
      features: [
        "Free repair services",
        "Learn repair skills",
        "Earn 2 seva tokens per repair",
        "850+ items repaired"
      ],
      impact: {
        items: "850+",
        label: "Items Repaired",
        co2: "2.3 tons",
        co2Label: "Waste Diverted"
      },
      cta: "Find Repair Events",
      href: "/repair-cafe",
      color: "sage"
    },
    {
      id: "swap-events",
      icon: Shuffle,
      emoji: "🔄",
      title: "Swap Events",
      tagline: "Trade, Don't Buy",
      description: "Bring quality items you no longer need and swap them for things you want. No money needed—just good stuff finding new homes.",
      features: [
        "Monthly swap meets",
        "All categories welcome",
        "Earn tokens for participation",
        "Meet your neighbors"
      ],
      impact: {
        items: "1,200+",
        label: "Items Swapped",
        co2: "3.5 tons",
        co2Label: "New Production Avoided"
      },
      cta: "Upcoming Swaps",
      href: "/swap-events",
      color: "terracotta"
    },
    {
      id: "upcycle-studio",
      icon: Palette,
      emoji: "🎨",
      title: "Upcycle Studio",
      tagline: "Create, Don't Waste",
      description: "Transform old items into beautiful new creations. Join workshops, get materials, and learn upcycling techniques from skilled artisans.",
      features: [
        "Weekly workshops",
        "Free materials library",
        "Sell your creations",
        "Learn from experts"
      ],
      impact: {
        items: "450+",
        label: "Items Upcycled",
        co2: "1.8 tons",
        co2Label: "Materials Saved"
      },
      cta: "Browse Workshops",
      href: "/upcycle-studio",
      color: "purple"
    },
    {
      id: "childrens-zone",
      icon: Baby,
      emoji: "🧸",
      title: "Children's Free Zone",
      tagline: "Every Child Deserves",
      description: "All children's items are completely free, always. Toys, books, clothes, and school supplies—no questions asked, no forms to fill.",
      features: [
        "100% free for children",
        "No verification needed",
        "Quality items only",
        "Toys, books, clothes"
      ],
      impact: {
        items: "2,100+",
        label: "Families Served",
        co2: "450",
        co2Label: "Children Helped"
      },
      cta: "Shop for Kids",
      href: "/shop?category=children",
      color: "cherry"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "sage":
        return {
          bg: "watercolor-sage",
          text: "text-[rgb(var(--sage-green))]",
          gradient: "linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))"
        };
      case "terracotta":
        return {
          bg: "watercolor-terracotta",
          text: "text-[rgb(var(--terracotta))]",
          gradient: "linear-gradient(135deg, rgb(var(--terracotta)), rgb(var(--burnt-orange)))"
        };
      case "purple":
        return {
          bg: "bg-gradient-to-br from-[rgb(var(--twilight-purple)/0.2)] to-[rgb(var(--lavender)/0.2)]",
          text: "text-[rgb(var(--twilight-purple))]",
          gradient: "linear-gradient(135deg, rgb(var(--twilight-purple)), rgb(var(--lavender)))"
        };
      case "cherry":
        return {
          bg: "bg-gradient-to-br from-[rgb(var(--cherry-blossom)/0.2)] to-[rgb(var(--rose-pink)/0.2)]",
          text: "text-[rgb(var(--cherry-blossom))]",
          gradient: "linear-gradient(135deg, rgb(var(--cherry-blossom)), rgb(var(--rose-pink)))"
        };
      default:
        return {
          bg: "watercolor-sage",
          text: "text-[rgb(var(--sage-green))]",
          gradient: "linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))"
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="adiyogi-bg-1 py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="text-6xl animate-float">♻️</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-gradient-sage">Circular Economy</span> Programs
              </h1>
              <p className="text-xl mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Beyond shopping—join our community programs that repair, swap, upcycle, and share. 
                Together, we're building a zero-waste future.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1" style={{ color: 'rgb(var(--sage-green))' }}>
                    5,200+
                  </div>
                  <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                    Items Circulated
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1" style={{ color: 'rgb(var(--terracotta))' }}>
                    8.6 tons
                  </div>
                  <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                    Waste Diverted
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1" style={{ color: 'rgb(var(--twilight-purple))' }}>
                    1,850
                  </div>
                  <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                    Participants
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1" style={{ color: 'rgb(var(--cherry-blossom))' }}>
                    95%
                  </div>
                  <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                    Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-12">
              {programs.map((program, index) => {
                const Icon = program.icon;
                const colors = getColorClasses(program.color);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={program.id}
                    className={`ghibli-card overflow-hidden ${
                      isEven ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Content Side */}
                      <div className="p-8 lg:p-12">
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center`}
                          >
                            <span className="text-3xl">{program.emoji}</span>
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold">{program.title}</h2>
                            <p className={`text-sm font-medium ${colors.text}`}>
                              {program.tagline}
                            </p>
                          </div>
                        </div>

                        <p className="text-lg mb-6" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                          {program.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                          {program.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-2">
                              <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <span className="text-xs">✓</span>
                              </div>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Link href={program.href}>
                          <Button
                            size="lg"
                            className="rounded-full ghibli-button w-full lg:w-auto"
                            style={{
                              background: colors.gradient,
                              color: 'white'
                            }}
                          >
                            {program.cta}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </Link>
                      </div>

                      {/* Impact Side */}
                      <div className={`p-8 lg:p-12 ${colors.bg} flex flex-col justify-center`}>
                        <h3 className="text-2xl font-bold mb-6">Community Impact</h3>
                        <div className="space-y-6">
                          <div>
                            <div className="text-5xl font-bold mb-2">
                              {program.impact.items}
                            </div>
                            <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                              {program.impact.label}
                            </div>
                          </div>
                          <div>
                            <div className="text-4xl font-bold mb-2">
                              {program.impact.co2}
                            </div>
                            <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                              {program.impact.co2Label}
                            </div>
                          </div>
                          <div className="pt-6 border-t border-[rgb(var(--charcoal)/0.1)]">
                            <p className="text-sm italic" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                              "Every item that stays in circulation is a victory for our planet."
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Circular Economy */}
        <section className="py-16 adiyogi-bg-1">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">
                Why <span className="text-gradient-warm">Circular Economy?</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="ghibli-card p-8">
                  <div className="flex items-start gap-4">
                    <Leaf className="w-10 h-10 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                    <div>
                      <h3 className="text-xl font-bold mb-3">Environmental</h3>
                      <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        Every item we repair, swap, or upcycle prevents new production, saves resources, 
                        and reduces landfill waste. Small actions, massive impact.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ghibli-card p-8">
                  <div className="flex items-start gap-4">
                    <Users className="w-10 h-10 flex-shrink-0" style={{ color: 'rgb(var(--terracotta))' }} />
                    <div>
                      <h3 className="text-xl font-bold mb-3">Community</h3>
                      <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        These programs bring neighbors together, share skills across generations, 
                        and build relationships that strengthen our community fabric.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ghibli-card p-8">
                  <div className="flex items-start gap-4">
                    <Heart className="w-10 h-10 flex-shrink-0" style={{ color: 'rgb(var(--cherry-blossom))' }} />
                    <div>
                      <h3 className="text-xl font-bold mb-3">Accessibility</h3>
                      <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        Everyone deserves access to quality items. Through repair, swap, and free programs, 
                        we ensure no one is left behind.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ghibli-card p-8">
                  <div className="flex items-start gap-4">
                    <TrendingUp className="w-10 h-10 flex-shrink-0" style={{ color: 'rgb(var(--twilight-purple))' }} />
                    <div>
                      <h3 className="text-xl font-bold mb-3">Economic</h3>
                      <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        Circular economy creates local jobs, reduces household expenses, 
                        and keeps money circulating within our community.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved CTA */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto ghibli-card p-12 text-center watercolor-sage">
              <div className="text-6xl mb-6">🌍</div>
              <h2 className="text-4xl font-bold mb-6">
                Join the <span className="text-gradient-sage">Movement</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                Whether you want to repair, swap, create, or volunteer—there's a place for you 
                in our circular economy. Together, we're proving that another way is possible.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/volunteer">
                  <Button
                    size="lg"
                    className="rounded-full ghibli-button text-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                      color: 'white'
                    }}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Volunteer
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full text-lg"
                  >
                    Learn Our Story
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
