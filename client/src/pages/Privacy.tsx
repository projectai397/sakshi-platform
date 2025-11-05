import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="watercolor-bg py-16 md:py-24">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy <span className="text-gradient-sage">Policy</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Your privacy matters to us. Here's how we protect your information.
            </p>
            <p className="mt-4 text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
              Last updated: November 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="ghibli-card p-8 md:p-12 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  Sakshi ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website and use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <h3 className="text-xl font-bold mb-2 mt-4">Personal Information</h3>
                <p className="leading-relaxed mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  <li>Name and contact information (email, phone number)</li>
                  <li>Account credentials</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Volunteer history and seva token balance</li>
                  <li>Shopping preferences and order history</li>
                </ul>

                <h3 className="text-xl font-bold mb-2 mt-4">Automatically Collected Information</h3>
                <p className="leading-relaxed mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  When you access our website, we automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, click patterns)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="leading-relaxed mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  <li>Process your orders and manage your account</li>
                  <li>Track seva token earnings and volunteer hours</li>
                  <li>Send you order confirmations, receipts, and updates</li>
                  <li>Improve our website and services</li>
                  <li>Communicate about new products, events, and community programs</li>
                  <li>Prevent fraud and enhance security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
                <p className="leading-relaxed mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business (payment processors, hosting providers, email services)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure password hashing</li>
                  <li>Regular security audits</li>
                  <li>Limited access to personal information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <p className="leading-relaxed mb-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Export your data</li>
                </ul>
                <p className="leading-relaxed mt-4" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  To exercise these rights, please contact us at privacy@sakshithrift.org
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and 
                  personalize content. You can control cookies through your browser settings, but disabling 
                  them may affect website functionality.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  Our services are not directed to children under 13. We do not knowingly collect personal 
                  information from children. If you believe we have collected information from a child, 
                  please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  We may update this Privacy Policy from time to time. We will notify you of significant 
                  changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                  If you have questions about this Privacy Policy, please contact us:
                </p>
                <div className="mt-4 p-6 rounded-xl watercolor-sage">
                  <p className="font-medium">Sakshi</p>
                  <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Email: privacy@sakshithrift.org<br />
                    Phone: +91 (80) 1234-5678<br />
                    Address: 123 Community Street, Bangalore, Karnataka 560001, India
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
