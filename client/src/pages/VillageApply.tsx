import { useState } from "react";
import { useLocation } from "wouter";
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
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

export default function VillageApply() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    age: "",
    currentLocation: "",
    
    // Residency Details
    residencyType: "",
    preferredStartDate: "",
    preferredDuration: "",
    
    // Experience & Skills
    meditationExperience: "",
    relevantSkills: "",
    education: "",
    occupation: "",
    
    // Motivation & Commitment
    motivation: "",
    expectations: "",
    contribution: "",
    
    // Logistics
    dietaryRequirements: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const steps = [
    { number: 1, title: "Personal Info", description: "Basic details about you" },
    { number: 2, title: "Residency Details", description: "Type and duration" },
    { number: 3, title: "Experience & Skills", description: "What you bring" },
    { number: 4, title: "Motivation", description: "Why the Silent Village" },
    { number: 5, title: "Logistics", description: "Practical considerations" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement API call to submit application
    toast.success("Application submitted successfully! We'll review and contact you within 7 days.");
    setTimeout(() => setLocation("/village"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-ghibli-sage/10 to-white">
      <Navigation />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ghibli-forest">
            Apply to Silent Village
          </h1>
          <p className="text-lg text-ghibli-forest/70">
            Begin your journey toward conscious living
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep > step.number
                        ? "bg-ghibli-sage text-white"
                        : currentStep === step.number
                        ? "bg-ghibli-sage text-white ring-4 ring-ghibli-sage/30"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        currentStep > step.number ? "bg-ghibli-sage" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2 hidden md:block">
                  <div className="text-sm font-semibold text-ghibli-forest">{step.title}</div>
                  <div className="text-xs text-ghibli-forest/60">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 mb-8">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-ghibli-forest mb-6">Personal Information</h2>
              
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Your age"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="currentLocation">Current Location *</Label>
                  <Input
                    id="currentLocation"
                    value={formData.currentLocation}
                    onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Residency Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-ghibli-forest mb-6">Residency Details</h2>
              
              <div>
                <Label htmlFor="residencyType">Residency Type *</Label>
                <Select
                  value={formData.residencyType}
                  onValueChange={(value) => handleInputChange("residencyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select residency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long_term">Long-Term (6+ months)</SelectItem>
                    <SelectItem value="short_term">Short-Term (1-6 months)</SelectItem>
                    <SelectItem value="researcher">Researcher/Fellow</SelectItem>
                    <SelectItem value="family">Family Residency</SelectItem>
                    <SelectItem value="work_study">Work-Study (18-30 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="preferredStartDate">Preferred Start Date *</Label>
                  <Input
                    id="preferredStartDate"
                    type="date"
                    value={formData.preferredStartDate}
                    onChange={(e) => handleInputChange("preferredStartDate", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="preferredDuration">Preferred Duration</Label>
                  <Input
                    id="preferredDuration"
                    value={formData.preferredDuration}
                    onChange={(e) => handleInputChange("preferredDuration", e.target.value)}
                    placeholder="e.g., 6 months, 1 year"
                  />
                </div>
              </div>

              <div className="bg-ghibli-sage/10 p-6 rounded-lg border-2 border-ghibli-sage/30">
                <h3 className="font-semibold text-ghibli-forest mb-3">Pricing Information</h3>
                <ul className="space-y-2 text-sm text-ghibli-forest/80">
                  <li>• Long-Term: ₹15,000-30,000/month (sliding scale)</li>
                  <li>• Short-Term: ₹20,000-40,000/month</li>
                  <li>• Researcher: Stipend/scholarship available</li>
                  <li>• Work-Study: ₹10,000/month or work exchange</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Experience & Skills */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-ghibli-forest mb-6">Experience & Skills</h2>
              
              <div>
                <Label htmlFor="meditationExperience">Meditation Experience *</Label>
                <Textarea
                  id="meditationExperience"
                  value={formData.meditationExperience}
                  onChange={(e) => handleInputChange("meditationExperience", e.target.value)}
                  placeholder="Describe your meditation practice, traditions you've studied, retreats attended, etc."
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="relevantSkills">Relevant Skills *</Label>
                <Textarea
                  id="relevantSkills"
                  value={formData.relevantSkills}
                  onChange={(e) => handleInputChange("relevantSkills", e.target.value)}
                  placeholder="What skills can you contribute? (farming, cooking, building, teaching, research, technology, etc.)"
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="education">Education Background</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    placeholder="Highest degree or relevant education"
                  />
                </div>

                <div>
                  <Label htmlFor="occupation">Current Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="Your current work"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Motivation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-ghibli-forest mb-6">Motivation & Commitment</h2>
              
              <div>
                <Label htmlFor="motivation">Why Silent Village? *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                  placeholder="What draws you to the Silent Village? What are you seeking?"
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="expectations">What Do You Hope to Learn/Experience? *</Label>
                <Textarea
                  id="expectations"
                  value={formData.expectations}
                  onChange={(e) => handleInputChange("expectations", e.target.value)}
                  placeholder="Your hopes and expectations for your time here"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contribution">How Will You Contribute? *</Label>
                <Textarea
                  id="contribution"
                  value={formData.contribution}
                  onChange={(e) => handleInputChange("contribution", e.target.value)}
                  placeholder="How do you envision contributing to the community?"
                  rows={4}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 5: Logistics */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-ghibli-forest mb-6">Logistics & Health</h2>
              
              <div>
                <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
                <Textarea
                  id="dietaryRequirements"
                  value={formData.dietaryRequirements}
                  onChange={(e) => handleInputChange("dietaryRequirements", e.target.value)}
                  placeholder="Any dietary restrictions, allergies, or preferences"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                  placeholder="Any medical conditions we should be aware of (kept confidential)"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                    placeholder="Contact person's name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="bg-ghibli-sky/20 p-6 rounded-lg border-2 border-ghibli-sky/40">
                <h3 className="font-semibold text-ghibli-forest mb-3">What Happens Next?</h3>
                <ol className="space-y-2 text-sm text-ghibli-forest/80 list-decimal list-inside">
                  <li>We'll review your application within 7 days</li>
                  <li>If selected, we'll schedule a video interview</li>
                  <li>Accepted applicants can choose a trial period (2-4 weeks)</li>
                  <li>After successful trial, full residency begins</li>
                </ol>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-8"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button onClick={handleNext} className="px-8 bg-ghibli-sage hover:bg-ghibli-sage/90">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="px-8 bg-ghibli-forest hover:bg-ghibli-forest/90">
              Submit Application
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
