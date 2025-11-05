import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Package, Camera, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Donate() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    donorName: user?.name || "",
    email: user?.email || "",
    phone: "",
    itemName: "",
    category: "",
    condition: "",
    description: "",
    quantity: "1",
    pickupAddress: "",
    preferredPickupDate: "",
    photos: [] as File[]
  });

  const categories = [
    "Clothing & Accessories",
    "Books & Media",
    "Toys & Games",
    "Home & Kitchen",
    "Furniture",
    "Electronics",
    "Sports & Outdoors",
    "Other"
  ];

  const conditions = [
    "Like New",
    "Gently Used",
    "Well Loved",
    "Needs Repair"
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData({ ...formData, photos: [...formData.photos, ...newPhotos].slice(0, 5) });
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  const createDonation = trpc.donations.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Donation submitted successfully!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit donation. Please try again.");
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.donorName || !formData.email || !formData.itemName || 
        !formData.category || !formData.condition || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare donation data
      const itemsDescription = `${formData.itemName} - ${formData.category} (${formData.condition})\n\n${formData.description}`;
      
      createDonation.mutate({
        donorName: formData.donorName,
        donorEmail: formData.email,
        donorPhone: formData.phone || undefined,
        donorAddress: formData.pickupAddress || undefined,
        itemsDescription,
        numberOfItems: parseInt(formData.quantity) || 1,
        pickupDate: formData.preferredPickupDate ? new Date(formData.preferredPickupDate) : undefined,
      });
    } catch (error) {
      toast.error("Failed to submit donation. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
        <Navigation />
        <main className="flex-1 py-16">
          <div className="container max-w-3xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 watercolor-sage">
                <CheckCircle className="w-12 h-12" style={{ color: 'rgb(var(--sage-green))' }} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Thank You for Your <span className="text-gradient-sage">Generosity!</span>
              </h1>
              <p className="text-lg md:text-xl mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Your donation will help someone in our community and keep items out of landfills.
              </p>
            </div>

            <div className="ghibli-card p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full watercolor-sage flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Review & Confirmation</h3>
                    <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                      Our team will review your donation within 24-48 hours and send you a confirmation email.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full watercolor-sage flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Pickup Scheduling</h3>
                    <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                      We'll contact you to schedule a convenient pickup time or provide drop-off instructions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full watercolor-sage flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Impact Tracking</h3>
                    <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                      Once processed, you'll receive an impact report showing how your donation helped the community.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="rounded-full"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    donorName: user?.name || "",
                    email: user?.email || "",
                    phone: "",
                    itemName: "",
                    category: "",
                    condition: "",
                    description: "",
                    quantity: "1",
                    pickupAddress: "",
                    preferredPickupDate: "",
                    photos: []
                  });
                }}
                className="rounded-full ghibli-button"
                style={{
                  background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                  color: 'white'
                }}
              >
                Donate More Items
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
      <Navigation />

      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 watercolor-sage">
              <Heart className="w-10 h-10" style={{ color: 'rgb(var(--sage-green))' }} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Donate <span className="text-gradient-sage">with Heart</span>
            </h1>
            <p className="text-lg md:text-xl" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Give your gently used items a second life and help our community thrive
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="ghibli-card p-6 text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-bold mb-2">Help the Planet</h3>
              <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Reduce waste and save resources
              </p>
            </div>
            <div className="ghibli-card p-6 text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold mb-2">Support Community</h3>
              <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Help families in need
              </p>
            </div>
            <div className="ghibli-card p-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold mb-2">Earn Seva Tokens</h3>
              <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Get tokens for future shopping
              </p>
            </div>
          </div>

          {/* Donation Form */}
          <form onSubmit={handleSubmit} className="ghibli-card p-8">
            <h2 className="text-2xl font-bold mb-6">Donation Details</h2>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <Input
                    required
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Item Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Item Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Item Name *</label>
                  <Input
                    required
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="e.g., Blue Cotton Shirt, Wooden Chair, Children's Books"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--soft-gray))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sage-green))]"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Condition *</label>
                    <select
                      required
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--soft-gray))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sage-green))]"
                    >
                      <option value="">Select condition</option>
                      {conditions.map(cond => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about the item - its story, condition, any special features..."
                    rows={4}
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Photos (Optional, up to 5)</label>
                  <div className="border-2 border-dashed border-[rgb(var(--soft-gray))] rounded-lg p-6 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgb(var(--charcoal) / 0.4)' }} />
                    <p className="text-sm mb-2" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                      Upload photos of your items
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </label>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pickup Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Pickup Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pickup Address</label>
                  <Textarea
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    placeholder="Street address, apartment, city, state, pincode"
                    rows={3}
                  />
                  <p className="text-xs mt-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                    Leave blank if you prefer to drop off at our center
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Pickup Date</label>
                  <Input
                    type="date"
                    value={formData.preferredPickupDate}
                    onChange={(e) => setFormData({ ...formData, preferredPickupDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full ghibli-button text-lg"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                color: 'white'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Package className="w-5 h-5 mr-2" />
                  Submit Donation
                </>
              )}
            </Button>

            <p className="text-xs text-center mt-4" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
              By submitting, you agree that the items are yours to donate and in the condition described
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
