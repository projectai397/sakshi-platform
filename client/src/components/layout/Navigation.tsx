import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  User,
  Menu,
  X,
  Settings,
  Coffee
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/donate", label: "Donate", icon: Heart },
    { href: "/cafes", label: "Sakshi Cafés", icon: Coffee },
    { href: "/village", label: "Silent Village", icon: TrendingUp },
    { href: "/retreats", label: "Retreats", icon: Calendar },
    { href: "/meditate", label: "Meditate", icon: Sparkles },
    { href: "/how-it-works", label: "How It Works", icon: Sparkles },
    { href: "/circular-economy", label: "Circular Economy", icon: TrendingUp },
    { href: "/about", label: "About", icon: Heart },
    { href: "/volunteer", label: "Volunteer", icon: Calendar },
  ];

  const authenticatedLinks = [
    { href: "/seva-wallet", label: "Seva Wallet", icon: Sparkles },
  ];

  const adminLinks = user?.role === 'admin' ? [
    { href: "/admin", label: "Admin", icon: Settings },
  ] : [];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[rgb(var(--soft-gray)/0.2)]">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--sage-green))] to-[rgb(var(--bamboo-green))] flex items-center justify-center text-white text-xl font-bold">
                🍃
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-sage">Sakshi Thrift</h1>
                <p className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                  Shop with Purpose
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
                      isActive(link.href)
                        ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))]'
                        : 'text-[rgb(var(--charcoal)/0.7)] hover:bg-[rgb(var(--sage-green)/0.05)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                </Link>
              );
            })}
            {isAuthenticated && authenticatedLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
                      isActive(link.href)
                        ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))]'
                        : 'text-[rgb(var(--charcoal)/0.7)] hover:bg-[rgb(var(--sage-green)/0.05)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                </Link>
              );
            })}
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
                      isActive(link.href)
                        ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))]'
                        : 'text-[rgb(var(--charcoal)/0.7)] hover:bg-[rgb(var(--sage-green)/0.05)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/cart">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Cart
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <User className="w-4 h-4 mr-2" />
                    {user?.name || 'Profile'}
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="rounded-full ghibli-button"
                style={{ 
                  background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                  color: 'white'
                }}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[rgb(var(--soft-gray)/0.2)] animate-fadeIn">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <div
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                        isActive(link.href)
                          ? 'bg-[rgb(var(--sage-green)/0.1)] text-[rgb(var(--sage-green))]'
                          : 'text-[rgb(var(--charcoal)/0.7)] hover:bg-[rgb(var(--sage-green)/0.05)]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
              
              <div className="mt-4 pt-4 border-t border-[rgb(var(--soft-gray)/0.2)] flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/cart">
                      <Button 
                        variant="outline" 
                        className="w-full rounded-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Cart
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button 
                        variant="outline" 
                        className="w-full rounded-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.location.href = getLoginUrl();
                    }}
                    className="w-full rounded-full ghibli-button"
                    style={{ 
                      background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                      color: 'white'
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
