import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Triple Pricing System",
    question: "How does the sliding scale pricing work?",
    answer: "Each item has a suggested price range (minimum to maximum). You choose what you can afford within that range. Paying more helps subsidize free items for those in need. There's no verification—we trust you to pay what's fair for your situation."
  },
  {
    category: "Triple Pricing System",
    question: "Can I really get items for free?",
    answer: "Yes! Select 'Request Free' on any product page. You can optionally share why you need it, but it's not required. We believe everyone deserves access to quality items, no questions asked."
  },
  {
    category: "Seva Tokens",
    question: "How do I earn seva tokens?",
    answer: "Volunteer at our thrift store (1 token per hour), help at repair cafés (2 tokens per repair), participate in swap events, lead upcycling workshops, or contribute to community programs. Check the Volunteer page for current opportunities."
  },
  {
    category: "Seva Tokens",
    question: "Do seva tokens expire?",
    answer: "Yes, tokens expire 1 year from the date you earn them. This encourages circulation and ensures active community participation. You'll receive alerts when tokens are nearing expiration."
  },
  {
    category: "Seva Tokens",
    question: "Can I transfer seva tokens to someone else?",
    answer: "Currently, tokens are non-transferable to maintain the volunteer-to-shopper connection. However, you can gift items purchased with your tokens to anyone!"
  },
  {
    category: "Shopping",
    question: "Are all items one-of-a-kind?",
    answer: "Yes! Every item in our store is unique. Once it's sold, it's gone. This makes each purchase special and encourages mindful shopping."
  },
  {
    category: "Shopping",
    question: "Can I return or exchange items?",
    answer: "Due to the unique nature of our items and our triple pricing model, all sales are final. However, if an item is significantly different from its description, please contact us within 48 hours."
  },
  {
    category: "Shopping",
    question: "How do I know the condition of items?",
    answer: "Every item is marked as Excellent, Good, Fair, or Worn. We provide detailed descriptions, multiple photos, and honest assessments. Our staff personally inspects each donation."
  },
  {
    category: "Donations",
    question: "What items do you accept?",
    answer: "We accept gently used clothing, furniture, books, toys, electronics, home goods, and sports equipment. Items should be clean, functional, and in good condition. We cannot accept mattresses, large appliances, or items with safety recalls."
  },
  {
    category: "Donations",
    question: "Do I get a tax receipt for donations?",
    answer: "Yes! We provide tax receipts for all donations. You'll receive an email receipt with the estimated fair market value of your items."
  },
  {
    category: "Circular Economy",
    question: "What happens at a Repair Café?",
    answer: "Bring broken items (electronics, clothing, furniture, etc.) and work alongside skilled volunteers to repair them. It's free, educational, and you earn 2 seva tokens per successful repair. Plus, you learn valuable skills!"
  },
  {
    category: "Circular Economy",
    question: "How do Swap Events work?",
    answer: "Bring quality items you no longer need and swap them for items others have brought. No money involved—just direct exchange. Everyone leaves with something new (to them) and earns seva tokens for participating."
  },
  {
    category: "Children's Free Zone",
    question: "Are children's items really always free?",
    answer: "Yes! All items in the Children's Free Zone are 100% free, always. No seva tokens, no sliding scale—just free. We believe every child deserves access to books, toys, clothes, and educational materials."
  },
  {
    category: "Account & Privacy",
    question: "Is my information secure?",
    answer: "Yes. We use industry-standard encryption and never sell your data. Your payment information is processed through secure, PCI-compliant systems. See our Privacy Policy for full details."
  },
  {
    category: "Account & Privacy",
    question: "Can I shop anonymously?",
    answer: "You can browse without an account, but you'll need to create one to make purchases or earn seva tokens. We only collect essential information and respect your privacy."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const filteredFAQs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="adiyogi-bg-mountain py-16 md:py-24">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Frequently Asked <span className="text-gradient-sage">Questions</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Everything you need to know about shopping, volunteering, and being part of our community
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container max-w-4xl">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[rgb(var(--sage-green))] text-white'
                      : 'bg-white text-[rgb(var(--charcoal)/0.7)] hover:bg-[rgb(var(--sage-green)/0.1)]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="ghibli-card overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-[rgb(var(--sage-green)/0.05)] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="text-xs font-medium mb-1" style={{ color: 'rgb(var(--sage-green))' }}>
                        {faq.category}
                      </div>
                      <div className="text-lg font-bold">{faq.question}</div>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 transition-transform flex-shrink-0 ml-4 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      style={{ color: 'rgb(var(--sage-green))' }}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-base leading-relaxed" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Still Have Questions */}
            <div className="ghibli-card p-8 text-center mt-12 watercolor-sage">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                We're here to help! Reach out to our friendly team.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 rounded-full font-medium text-white ghibli-button"
                style={{
                  background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))'
                }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
