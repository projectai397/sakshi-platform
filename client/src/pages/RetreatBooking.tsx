import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import {
  CheckCircle2,
  User,
  Heart,
  CreditCard,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function RetreatBooking() {
  const { user, isAuthenticated } = useAuth();
  const [, params] = useRoute("/retreats/:id/book");
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Step 2: Health & Dietary
    dietaryRestrictions: "",
    allergies: "",
    medicalConditions: "",
    medications: "",
    previousMeditationExperience: "",
    
    // Step 3: Payment
    pricingTier: "standard",
    accommodationType: "shared",
    specialRequests: "",
  });

  // Sample retreat data (in real app, fetch based on params.id)
  const retreat = {
    id: params?.id || 1,
    title: "10-Day Vipassana Meditation Retreat",
    dates: "March 15-25, 2025",
    pricing: {
      standard: 15000,
      subsidized: 8000,
      scholarship: 0,
    },
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Health & Dietary", icon: Heart },
    { number: 3, title: "Payment", icon: CreditCard },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.emergencyContact || !formData.emergencyPhone) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // In real app, submit to backend API
    toast.success("Booking submitted successfully!");
    setTimeout(() => {
      setLocation("/profile");
    }, 2000);
  };

  const getPrice = () => {
    return retreat.pricing[formData.pricingTier as keyof typeof retreat.pricing];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-ghibli-sky/10 to-white">
      <Navigation />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-ghibli-forest">
            Book Your Retreat
          </h1>
          <p className="text-xl text-ghibli-forest/70">{retreat.title}</p>
          <p className="text-ghibli-forest/60">{retreat.dates}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-ghibli-forest/10 -z-10">
              <div
                className="h-full bg-ghibli-sage transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-ghibli-sage text-white"
                        : isActive
                        ? "bg-ghibli-sage text-white ring-4 ring-ghibli-sage/20"
                        : "bg-white border-2 border-ghibli-forest/20 text-ghibli-forest/40"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isActive ? "text-ghibli-forest" : "text-ghibli-forest/60"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 mb-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-ghibli-forest">
                  Personal Information
                </h2>
                <p className="text-ghibli-forest/70 mb-6">
                  Please provide your contact details and emergency contact information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health & Dietary */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-ghibli-forest">
                  Health & Dietary Information
                </h2>
                <p className="text-ghibli-forest/70 mb-6">
                  Help us provide you with the best care during your retreat.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => updateFormData("dietaryRestrictions", e.target.value)}
                    placeholder="e.g., Vegan, gluten-free, no onion/garlic..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => updateFormData("allergies", e.target.value)}
                    placeholder="Any food or environmental allergies..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea
                    id="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={(e) => updateFormData("medicalConditions", e.target.value)}
                    placeholder="Any medical conditions we should be aware of..."
                    rows={3}
                  />
                  <p className="text-xs text-ghibli-forest/60 mt-1">
                    This information is kept strictly confidential
                  </p>
                </div>

                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => updateFormData("medications", e.target.value)}
                    placeholder="List any medications you're currently taking..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="previousExperience">Previous Meditation Experience</Label>
                  <Textarea
                    id="previousExperience"
                    value={formData.previousMeditationExperience}
                    onChange={(e) => updateFormData("previousMeditationExperience", e.target.value)}
                    placeholder="Describe your meditation background..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-ghibli-forest">
                  Payment & Accommodation
                </h2>
                <p className="text-ghibli-forest/70 mb-6">
                  Choose your pricing tier and accommodation preference.
                </p>
              </div>

              <div className="space-y-6">
                {/* Pricing Tier */}
                <div>
                  <Label htmlFor="pricingTier">Pricing Tier *</Label>
                  <Select
                    value={formData.pricingTier}
                    onValueChange={(value) => updateFormData("pricingTier", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard - ₹{retreat.pricing.standard.toLocaleString()}
                      </SelectItem>
                      <SelectItem value="subsidized">
                        Subsidized - ₹{retreat.pricing.subsidized.toLocaleString()}
                      </SelectItem>
                      <SelectItem value="scholarship">
                        Scholarship - Dana-based (Free)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-ghibli-forest/60 mt-2">
                    {formData.pricingTier === "standard" && "Full cost covering all retreat expenses"}
                    {formData.pricingTier === "subsidized" && "Partial scholarship for those with financial constraints"}
                    {formData.pricingTier === "scholarship" && "For sincere practitioners unable to pay. Optional dana (donation) welcome."}
                  </p>
                </div>

                {/* Accommodation */}
                <div>
                  <Label htmlFor="accommodationType">Accommodation Preference *</Label>
                  <Select
                    value={formData.accommodationType}
                    onValueChange={(value) => updateFormData("accommodationType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shared">Shared Dormitory (Included)</SelectItem>
                      <SelectItem value="private">Private Room (+₹3,000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests">Special Requests or Questions</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => updateFormData("specialRequests", e.target.value)}
                    placeholder="Any special needs or questions..."
                    rows={4}
                  />
                </div>

                {/* Price Summary */}
                <Card className="p-6 bg-ghibli-sage/5">
                  <h3 className="font-bold text-lg mb-4 text-ghibli-forest">Booking Summary</h3>
                  <div className="space-y-2 text-ghibli-forest/80">
                    <div className="flex justify-between">
                      <span>Retreat Fee</span>
                      <span className="font-semibold">
                        {getPrice() === 0 ? "Dana-based" : `₹${getPrice().toLocaleString()}`}
                      </span>
                    </div>
                    {formData.accommodationType === "private" && getPrice() > 0 && (
                      <div className="flex justify-between">
                        <span>Private Room</span>
                        <span className="font-semibold">₹3,000</span>
                      </div>
                    )}
                    <div className="border-t border-ghibli-forest/20 pt-2 mt-2 flex justify-between text-xl font-bold text-ghibli-forest">
                      <span>Total</span>
                      <span>
                        {getPrice() === 0
                          ? "Dana-based"
                          : `₹${(getPrice() + (formData.accommodationType === "private" ? 3000 : 0)).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Terms */}
                <div className="text-sm text-ghibli-forest/70 space-y-2">
                  <p>By submitting this booking, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Complete the full retreat duration</li>
                    <li>Follow the code of discipline</li>
                    <li>Maintain noble silence throughout</li>
                    <li>No refunds after 14 days before start date</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              className="bg-ghibli-sage hover:bg-ghibli-sage/90 flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-ghibli-sage hover:bg-ghibli-sage/90 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Booking
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
