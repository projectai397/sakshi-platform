import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import {
  Home,
  Users,
  Leaf,
  Sun,
  Droplet,
  Wind,
  Heart,
  BookOpen,
  Microscope,
  TreePine,
} from "lucide-react";

export default function SilentVillage() {
  const infrastructure = [
    {
      icon: Home,
      title: "Residential",
      items: [
        "30 Residential Pods",
        "15 Family Dwellings",
        "5 Guest Houses",
        "Community Spaces",
      ],
    },
    {
      icon: Heart,
      title: "Meditation & Research",
      items: [
        "Central Meditation Dome (150 capacity)",
        "10 VR Meditation Pods",
        "Neuroscience Research Lab",
        "20 Individual Kutis",
      ],
    },
    {
      icon: Leaf,
      title: "Sustainable Systems",
      items: [
        "100% Renewable Energy",
        "Water-positive Operations",
        "80% Food Self-sufficiency",
        "Carbon Negative (-50T CO₂)",
      ],
    },
  ];

  const dailyLife = [
    {
      time: "5 AM - 12 PM",
      title: "Morning",
      activities: [
        "Sunrise meditation",
        "Communal breakfast from farm",
        "Community work (research, farming, building)",
        "Neuroscience sessions",
      ],
    },
    {
      time: "1 PM - 6 PM",
      title: "Afternoon",
      activities: [
        "Rest and personal time",
        "Workshops and skill-sharing",
        "VR meditation experiences",
        "Walking meditation",
      ],
    },
    {
      time: "6:30 PM - 10 PM",
      title: "Evening",
      activities: [
        "Sunset meditation",
        "Community dinner and gathering",
        "Music, storytelling, dharma talks",
        "Noble Silence begins at 10 PM",
      ],
    },
  ];

  const researchAreas = [
    {
      icon: Microscope,
      title: "Neuroscience of Meditation",
      description: "EEG/fMRI studies, brain mapping, consciousness research",
    },
    {
      icon: Sun,
      title: "Sustainable Technology R&D",
      description: "Solar optimization, biogas systems, water harvesting",
    },
    {
      icon: BookOpen,
      title: "Contemplative Pedagogy",
      description: "Teaching methods, technology integration, learning science",
    },
    {
      icon: Users,
      title: "Circular Economy Models",
      description: "Gift economy, cooperative governance, shared ownership",
    },
  ];

  const membershipOptions = [
    {
      type: "Long-Term Residents",
      duration: "6+ months",
      price: "₹15,000-30,000/month",
      features: [
        "Full community membership",
        "Voting rights in governance",
        "Priority housing selection",
        "Research collaboration opportunities",
      ],
    },
    {
      type: "Short-Term Residents",
      duration: "1-6 months",
      price: "₹20,000-40,000/month",
      features: [
        "Trial period option",
        "Community participation",
        "Workshop access",
        "Pathway to long-term residency",
      ],
    },
    {
      type: "Researchers & Fellows",
      duration: "3-12 months",
      price: "Stipend/scholarship available",
      features: [
        "Focus on specific projects",
        "Lab and equipment access",
        "Publication support",
        "Mentorship from senior researchers",
      ],
    },
    {
      type: "Work-Study",
      duration: "3-6 months",
      price: "₹10,000/month or work exchange",
      features: [
        "For young adults 18-30",
        "Skill development",
        "Community immersion",
        "Seva token earning",
      ],
    },
  ];

  const stats = [
    { icon: Users, value: "100", label: "Resident Capacity" },
    { icon: Sun, value: "500kW", label: "Solar + Wind Power" },
    { icon: Droplet, value: "5M L/year", label: "Water Harvested" },
    { icon: TreePine, value: "10 acres", label: "Forest Regeneration" },
    { icon: Leaf, value: "-50T", label: "CO₂ Annually" },
    { icon: Wind, value: "80%", label: "Food Self-sufficient" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-ghibli-sage/10 via-white to-ghibli-sky/10">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ghibli-sage/20 via-transparent to-ghibli-sky/20" />
        
        <div className="container relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-ghibli-sage/20 rounded-full border-2 border-ghibli-sage/30">
            <span className="text-ghibli-sage font-semibold">🌱 A Living Prototype for Conscious Civilization</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-ghibli-forest leading-tight">
            The Silent Village
          </h1>
          
          <p className="text-2xl md:text-3xl text-ghibli-forest/70 mb-4 font-handwriting">
            यह गाँव केवल जगह नहीं — एक चेतना है
          </p>
          
          <p className="text-xl text-ghibli-forest/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Not a retreat from the world—a laboratory for the future where consciousness becomes infrastructure.
            A self-sustaining community of 100 residents demonstrating that humans, nature, and technology can coexist consciously.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/village/apply">
              <Button size="lg" className="text-lg px-8 py-6 bg-ghibli-sage hover:bg-ghibli-sage/90">
                Apply to Join
              </Button>
            </Link>
            <Link href="/village/residents">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-ghibli-sage text-ghibli-sage hover:bg-ghibli-sage/10">
                Meet Our Residents
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-ghibli-sage" />
                <div className="text-3xl font-bold text-ghibli-forest mb-1">{stat.value}</div>
                <div className="text-sm text-ghibli-forest/60">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-ghibli-forest">
            Core Infrastructure
          </h2>
          <p className="text-center text-ghibli-forest/70 mb-12 text-lg max-w-2xl mx-auto">
            Everything needed for conscious living, research, and community
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {infrastructure.map((section, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                <section.icon className="w-12 h-12 mb-4 text-ghibli-sage" />
                <h3 className="text-2xl font-bold mb-4 text-ghibli-forest">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ghibli-forest/80">
                      <span className="text-ghibli-sage mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Life Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-ghibli-sky/10 to-transparent">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-ghibli-forest">
            A Day in the Village
          </h2>
          <p className="text-center text-ghibli-forest/70 mb-12 text-lg max-w-2xl mx-auto">
            Structured rhythm supporting meditation, work, and community
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {dailyLife.map((period, index) => (
              <Card key={index} className="p-8">
                <div className="text-sm font-semibold text-ghibli-sage mb-2">{period.time}</div>
                <h3 className="text-2xl font-bold mb-4 text-ghibli-forest">{period.title}</h3>
                <ul className="space-y-3">
                  {period.activities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-2 text-ghibli-forest/80">
                      <span className="text-ghibli-sage mt-1">→</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research Focus Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-ghibli-forest">
            Research Focus Areas
          </h2>
          <p className="text-center text-ghibli-forest/70 mb-12 text-lg max-w-2xl mx-auto">
            Advancing knowledge for the benefit of all beings
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {researchAreas.map((area, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                <area.icon className="w-12 h-12 mb-4 text-ghibli-sage" />
                <h3 className="text-2xl font-bold mb-3 text-ghibli-forest">{area.title}</h3>
                <p className="text-ghibli-forest/80 leading-relaxed">{area.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Options Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-ghibli-sage/10 to-transparent">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-ghibli-forest">
            Membership Options
          </h2>
          <p className="text-center text-ghibli-forest/70 mb-12 text-lg max-w-2xl mx-auto">
            Multiple pathways to join our conscious community
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {membershipOptions.map((option, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold mb-2 text-ghibli-forest">{option.type}</h3>
                <div className="text-sm text-ghibli-sage font-semibold mb-2">{option.duration}</div>
                <div className="text-xl font-bold text-ghibli-terracotta mb-4">{option.price}</div>
                <ul className="space-y-2">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-ghibli-forest/80">
                      <span className="text-ghibli-sage mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/village/apply">
              <Button size="lg" className="text-lg px-8 py-6 bg-ghibli-sage hover:bg-ghibli-sage/90">
                Start Your Application
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-ghibli-sage/20 to-ghibli-sky/20">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-ghibli-forest">
            Ready to Join the Experiment?
          </h2>
          <p className="text-xl text-ghibli-forest/80 mb-8 leading-relaxed">
            Whether you're a researcher, meditator, farmer, engineer, or simply someone seeking a more conscious way of living—
            there's a place for you in the Silent Village.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/village/apply">
              <Button size="lg" className="text-lg px-8 py-6 bg-ghibli-forest hover:bg-ghibli-forest/90">
                Apply Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-ghibli-forest text-ghibli-forest hover:bg-ghibli-forest/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
