import { Link } from "wouter";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="watercolor-bg border-t border-[rgb(var(--soft-gray)/0.2)] mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gradient-sage">Sakshi</h3>
            <p className="text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              A revolutionary thrift store where you can pay with money, seva tokens, or get items free. 
              Part of Sakshi Center's mission to heal individuals, communities, and the planet.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4" style={{ color: 'rgb(var(--cherry-blossom))' }} />
              <span style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>Made with love in Gujarat</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Shop All Items
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    How It Works
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/donate">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Donate Items
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/volunteer">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Volunteer
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    About Sakshi
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Circular Economy */}
          <div>
            <h3 className="text-lg font-bold mb-4">Circular Economy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/repair-cafe">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Repair Café
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/swap-events">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Swap Events
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/upcycle">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Upcycle Studio
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/childrens-free-zone">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Children's Free Zone
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/impact">
                  <span className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors cursor-pointer" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Our Impact
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                <span className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Sakshi Center<br />
                  Gujarat, India
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                <a 
                  href="mailto:hello@sakshicenter.org" 
                  className="text-sm hover:text-[rgb(var(--sage-green))] transition-colors"
                  style={{ color: 'rgb(var(--charcoal) / 0.7)' }}
                >
                  hello@sakshicenter.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                <span className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  +91 XXX XXX XXXX
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgb(var(--soft-gray)/0.2)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
            © 2025 Sakshi Center Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm handwritten" style={{ color: 'rgb(var(--sage-green))' }}>
              🍃 Healing the planet, one item at a time
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
