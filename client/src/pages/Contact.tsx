import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="adiyogi-bg-4 py-16 md:py-24">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in <span className="text-gradient-sage">Touch</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              We'd love to hear from you. Whether you have questions, feedback, or just want to say hello!
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="ghibli-card p-8">
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more..."
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full ghibli-button"
                    style={{
                      background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                      color: 'white'
                    }}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Location */}
                <div className="ghibli-card p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl watercolor-sage flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" style={{ color: 'rgb(var(--sage-green))' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                      <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                        Sakshi<br />
                        123 Community Street<br />
                        Bangalore, Karnataka 560001<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="ghibli-card p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl watercolor-terracotta flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" style={{ color: 'rgb(var(--terracotta))' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Call Us</h3>
                      <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                        +91 (80) 1234-5678<br />
                        Mon-Sat: 10am - 7pm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="ghibli-card p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--sky-blue)/0.2)] to-[rgb(var(--twilight-purple)/0.2)] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" style={{ color: 'rgb(var(--twilight-purple))' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Email Us</h3>
                      <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                        hello@sakshithrift.org<br />
                        volunteer@sakshithrift.org
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="ghibli-card p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--cherry-blossom)/0.2)] to-[rgb(var(--lavender)/0.2)] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6" style={{ color: 'rgb(var(--cherry-blossom))' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Store Hours</h3>
                      <div style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                        <p>Monday - Friday: 10am - 7pm</p>
                        <p>Saturday: 10am - 6pm</p>
                        <p>Sunday: 11am - 5pm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-12 ghibli-card p-8">
              <h3 className="text-2xl font-bold mb-6">Find Us on the Map</h3>
              <div 
                className="w-full h-96 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgb(var(--sage-green) / 0.1), rgb(var(--sky-blue) / 0.1))' }}
              >
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgb(var(--sage-green))' }} />
                  <p className="text-lg font-medium" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Map integration coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
