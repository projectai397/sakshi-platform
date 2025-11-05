import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Heart, Award, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function CafeJoin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    email: "",
    city: "",
    experience: "",
    motivation: "",
    availability: "",
    agreedToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      toast.error("Please agree to the cooperative principles");
      return;
    }

    // TODO: Implement actual submission
    toast.success("Application submitted successfully! We'll contact you within 5 business days.");
    setTimeout(() => {
      setLocation("/cafes");
    }, 2000);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-warm-cream">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <Users className="w-16 h-16 text-terracotta mx-auto" />
            </div>
            <h1 className="font-comfortaa text-5xl md:text-6xl font-bold mb-4">
              <span className="text-charcoal">Join a </span>
              <span className="text-gradient-terracotta">Cooperative</span>
            </h1>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Become a co-owner of a Sakshi Café. Earn dignified livelihood, share in profits, 
              and build community together.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl">
          <h2 className="font-comfortaa text-3xl font-bold text-center mb-12">
            What You'll <span className="text-gradient-terracotta">Receive</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="ghibli-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta/20 to-sunrise-orange/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-comfortaa text-xl font-bold mb-3 text-charcoal">
                Ownership & Voice
              </h3>
              <ul className="text-sm text-charcoal/70 text-left space-y-2">
                <li>✓ Equal voting rights</li>
                <li>✓ Profit sharing</li>
                <li>✓ Democratic decisions</li>
                <li>✓ Transparent finances</li>
              </ul>
            </div>

            <div className="ghibli-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-green/20 to-forest-green/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-sage-green" />
              </div>
              <h3 className="font-comfortaa text-xl font-bold mb-3 text-charcoal">
                Fair Compensation
              </h3>
              <ul className="text-sm text-charcoal/70 text-left space-y-2">
                <li>✓ ₹15,000-25,000/month</li>
                <li>✓ Health insurance</li>
                <li>✓ Paid leave (12 days/year)</li>
                <li>✓ 6 months maternity leave</li>
              </ul>
            </div>

            <div className="ghibli-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cherry-blossom/20 to-lavender/20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-cherry-blossom" />
              </div>
              <h3 className="font-comfortaa text-xl font-bold mb-3 text-charcoal">
                Training & Support
              </h3>
              <ul className="text-sm text-charcoal/70 text-left space-y-2">
                <li>✓ Culinary training</li>
                <li>✓ Business management</li>
                <li>✓ Financial literacy</li>
                <li>✓ Ongoing mentorship</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12 px-4">
        <div className="container max-w-3xl">
          <div className="ghibli-card p-8 md:p-12">
            <h2 className="font-comfortaa text-3xl font-bold mb-2 text-center">
              Application Form
            </h2>
            <p className="text-center text-charcoal/70 mb-8">
              Tell us about yourself. We review applications on a rolling basis.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-comfortaa text-xl font-bold mb-4 text-charcoal">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        required
                        value={formData.age}
                        onChange={(e) => handleChange("age", e.target.value)}
                        placeholder="Your age"
                        min="18"
                        max="65"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="your.email@example.com (optional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Preferred City *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleChange("city", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="any">Any location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Experience & Motivation */}
              <div>
                <h3 className="font-comfortaa text-xl font-bold mb-4 text-charcoal">
                  Experience & Motivation
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="experience">
                      Previous Experience (cooking, service, business, etc.)
                    </Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleChange("experience", e.target.value)}
                      placeholder="Tell us about your relevant experience. No experience required—we provide training!"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivation">
                      Why do you want to join a Sakshi Café cooperative? *
                    </Label>
                    <Textarea
                      id="motivation"
                      required
                      value={formData.motivation}
                      onChange={(e) => handleChange("motivation", e.target.value)}
                      placeholder="Share your story and what draws you to this opportunity..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="availability">Availability *</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => handleChange("availability", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="When can you start?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">Immediately</SelectItem>
                        <SelectItem value="1month">Within 1 month</SelectItem>
                        <SelectItem value="2months">Within 2 months</SelectItem>
                        <SelectItem value="3months">Within 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Cooperative Principles */}
              <div className="p-6 bg-sage-green/10 rounded-lg">
                <h3 className="font-comfortaa text-lg font-bold mb-4 text-charcoal">
                  Cooperative Principles
                </h3>
                <div className="space-y-3 text-sm text-charcoal/70 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-sage-green flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Democratic Governance:</strong> One person, one vote. All major decisions made collectively.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-sage-green flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Shared Responsibility:</strong> All members contribute to operations, cleaning, and management.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-sage-green flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Transparent Finances:</strong> Open books. All members see income, expenses, and profit distribution.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-sage-green flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Community Values:</strong> Commitment to local, organic, zero-waste, and social justice principles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      handleChange("agreedToTerms", checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I understand and agree to these cooperative principles. I am committed to 
                    democratic participation, shared responsibility, and community values.
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-terracotta to-sunrise-orange hover:from-sunrise-orange hover:to-terracotta text-white shadow-lg"
                >
                  Submit Application
                </Button>
              </div>

              <p className="text-center text-sm text-charcoal/60 mt-4">
                We review applications within 5 business days. You'll receive a call or email to schedule an interview.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
