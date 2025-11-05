import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Clock, Users, Coffee, Phone, Navigation as NavigationIcon } from "lucide-react";

// Sample café data - will be replaced with database queries
const cafes = [
  {
    id: 1,
    name: "Sakshi Café Navrangpura",
    city: "Ahmedabad",
    address: "123 CG Road, Navrangpura, Ahmedabad, Gujarat 380009",
    phone: "+91 79 2640 1234",
    hours: "7:00 AM - 9:00 PM",
    daysOpen: "Monday - Saturday",
    cooperativeMembers: 6,
    established: "2025",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    description: "Our flagship café in the heart of Ahmedabad. Warm, welcoming space with local art and community bulletin board.",
    specialties: ["Masala Chai", "Full Thali", "Seasonal Soups"],
    mapLink: "https://maps.google.com/?q=Navrangpura+Ahmedabad"
  },
  {
    id: 2,
    name: "Sakshi Café Bodakdev",
    city: "Ahmedabad",
    address: "456 SG Highway, Bodakdev, Ahmedabad, Gujarat 380054",
    phone: "+91 79 2640 5678",
    hours: "7:00 AM - 9:00 PM",
    daysOpen: "Monday - Saturday",
    cooperativeMembers: 5,
    established: "2025",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
    description: "Cozy neighborhood café with garden seating. Perfect for morning chai and evening conversations.",
    specialties: ["Filter Coffee", "Khichdi with Kadhi", "Homemade Cookies"],
    mapLink: "https://maps.google.com/?q=Bodakdev+Ahmedabad"
  },
  {
    id: 3,
    name: "Sakshi Café Koramangala",
    city: "Bangalore",
    address: "789 80 Feet Road, Koramangala, Bangalore, Karnataka 560095",
    phone: "+91 80 4112 9012",
    hours: "7:00 AM - 9:00 PM",
    daysOpen: "Monday - Saturday",
    cooperativeMembers: 7,
    established: "2026",
    image: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800&q=80",
    description: "Vibrant café in tech hub with focus on organic breakfast and lunch bowls. Popular with local community.",
    specialties: ["Golden Milk", "Fresh Salad Bowl", "Seasonal Pakoras"],
    mapLink: "https://maps.google.com/?q=Koramangala+Bangalore"
  }
];

export default function CafeLocations() {
  return (
    <div className="min-h-screen bg-warm-cream">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="font-comfortaa text-5xl md:text-6xl font-bold mb-4">
              <span className="text-charcoal">Find a </span>
              <span className="text-gradient-terracotta">Café</span>
            </h1>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Visit one of our women-run cooperative spaces for organic food, genuine connection, and community warmth
            </p>
          </div>
        </div>
      </section>

      {/* Café Listings */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl">
          <div className="space-y-8">
            {cafes.map((cafe) => (
              <div key={cafe.id} className="ghibli-card overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-terracotta text-white text-sm font-semibold rounded-full">
                        {cafe.city}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8">
                    <h2 className="font-comfortaa text-3xl font-bold text-charcoal mb-2">
                      {cafe.name}
                    </h2>
                    <p className="text-charcoal/70 mb-6 leading-relaxed">
                      {cafe.description}
                    </p>

                    {/* Info Grid */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-charcoal text-sm mb-1">Address</div>
                          <div className="text-charcoal/70 text-sm">{cafe.address}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-charcoal text-sm mb-1">Hours</div>
                          <div className="text-charcoal/70 text-sm">
                            {cafe.hours}
                            <br />
                            {cafe.daysOpen}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-charcoal text-sm mb-1">Contact</div>
                          <div className="text-charcoal/70 text-sm">{cafe.phone}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-charcoal text-sm mb-1">Cooperative</div>
                          <div className="text-charcoal/70 text-sm">
                            {cafe.cooperativeMembers} women owners
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Coffee className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-charcoal text-sm mb-1">Specialties</div>
                          <div className="text-charcoal/70 text-sm">
                            {cafe.specialties.join(" • ")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={cafe.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button className="bg-gradient-to-r from-terracotta to-sunrise-orange hover:from-sunrise-orange hover:to-terracotta text-white">
                          <NavigationIcon className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </a>
                      <Link href={`/cafes/${cafe.id}`}>
                        <Button variant="outline" className="border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                          <Coffee className="w-4 h-4 mr-2" />
                          View Menu
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-terracotta/10 via-cherry-blossom/10 to-warm-cream">
        <div className="container max-w-4xl text-center">
          <h2 className="font-comfortaa text-4xl font-bold mb-6">
            Want to Start Your Own <span className="text-gradient-terracotta">Cooperative Café?</span>
          </h2>
          <p className="text-xl text-charcoal/70 mb-8">
            Join our network of women-owned cafés. We provide training, support, and community.
          </p>
          <Link href="/cafes/join">
            <Button size="lg" className="bg-gradient-to-r from-terracotta to-sunrise-orange hover:from-sunrise-orange hover:to-terracotta text-white shadow-lg">
              <Users className="w-5 h-5 mr-2" />
              Apply to Join
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
