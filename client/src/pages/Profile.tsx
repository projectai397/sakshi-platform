import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  ShoppingBag,
  Heart,
  Settings,
  Edit,
  Save,
  X,
  TrendingUp,
  Award,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

type Tab = "overview" | "orders" | "wallet" | "settings";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-4xl font-bold mb-4">Sign In Required</h1>
            <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Please sign in to view your profile
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="rounded-full ghibli-button text-lg"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                color: 'white'
              }}
            >
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: User },
    { id: "orders" as Tab, label: "My Orders", icon: ShoppingBag },
    { id: "wallet" as Tab, label: "Seva Wallet", icon: Sparkles },
    { id: "settings" as Tab, label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
      <Navigation />

      <main className="flex-1">
        {/* Profile Header */}
        <div className="adiyogi-bg-forest border-b border-[rgb(var(--soft-gray)/0.2)]">
          <div className="container py-12">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full watercolor-sage flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12" style={{ color: 'rgb(var(--sage-green))' }} />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{user?.name || 'User'}</h1>
                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date(user?.createdAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-6">
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'rgb(var(--sage-green))' }}>
                      0
                    </div>
                    <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                      Orders
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'rgb(var(--terracotta))' }}>
                      0
                    </div>
                    <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                      Seva Tokens
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'rgb(var(--twilight-purple))' }}>
                      0
                    </div>
                    <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                      Volunteer Hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[rgb(var(--soft-gray)/0.2)] bg-white">
          <div className="container">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-[rgb(var(--sage-green))] border-b-2 border-[rgb(var(--sage-green))]'
                        : 'text-[rgb(var(--charcoal)/0.6)] hover:text-[rgb(var(--charcoal))]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          {activeTab === "overview" && <OverviewTab user={user} />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "wallet" && <WalletTab />}
          {activeTab === "settings" && <SettingsTab user={user} logout={logout} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function OverviewTab({ user }: { user: any }) {
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="ghibli-card p-8 watercolor-sage">
        <h2 className="text-3xl font-bold mb-4">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-lg" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
          Thank you for being part of our community. Every purchase, volunteer hour, and shared item 
          helps build a more sustainable and caring world.
        </p>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ghibli-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl watercolor-sage flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" style={{ color: 'rgb(var(--sage-green))' }} />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                Total Orders
              </div>
            </div>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="rounded-full w-full">
              Start Shopping
            </Button>
          </Link>
        </div>

        <div className="ghibli-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl watercolor-terracotta flex items-center justify-center">
              <Sparkles className="w-6 h-6" style={{ color: 'rgb(var(--terracotta))' }} />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                Seva Tokens
              </div>
            </div>
          </div>
          <Link href="/volunteer">
            <Button variant="outline" className="rounded-full w-full">
              Earn Tokens
            </Button>
          </Link>
        </div>

        <div className="ghibli-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--twilight-purple)/0.2)] to-[rgb(var(--lavender)/0.2)] flex items-center justify-center">
              <Heart className="w-6 h-6" style={{ color: 'rgb(var(--twilight-purple))' }} />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                Impact Points
              </div>
            </div>
          </div>
          <Link href="/circular-economy">
            <Button variant="outline" className="rounded-full w-full">
              Get Involved
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="ghibli-card p-8">
        <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-lg" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
            No activity yet. Start shopping or volunteering to see your history here!
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="ghibli-card p-8">
        <h3 className="text-2xl font-bold mb-6">Your Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl watercolor-sage">
            <Award className="w-10 h-10" style={{ color: 'rgb(var(--sage-green))' }} />
            <div>
              <div className="font-bold">Community Member</div>
              <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Welcome to Sakshi!
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 opacity-50">
            <Package className="w-10 h-10" style={{ color: 'rgb(var(--charcoal) / 0.4)' }} />
            <div>
              <div className="font-bold">First Purchase</div>
              <div className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.5)' }}>
                Make your first purchase
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My Orders</h2>
        <Button variant="outline" className="rounded-full">
          <TrendingUp className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="ghibli-card p-8 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
        <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
          Start shopping to see your orders here
        </p>
        <Link href="/shop">
          <Button
            size="lg"
            className="rounded-full ghibli-button"
            style={{
              background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
              color: 'white'
            }}
          >
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}

function WalletTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Seva Wallet</h2>
        <Link href="/seva-wallet">
          <Button variant="outline" className="rounded-full">
            View Full Wallet
          </Button>
        </Link>
      </div>

      <div className="ghibli-card p-8 watercolor-sage">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">0</div>
          <div className="text-xl mb-6">Seva Tokens Available</div>
          <Link href="/volunteer">
            <Button
              size="lg"
              className="rounded-full ghibli-button"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                color: 'white'
              }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Earn Tokens
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ user, logout }: { user: any; logout: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Account Settings</h2>

      <div className="ghibli-card p-8">
        <h3 className="text-xl font-bold mb-6">Personal Information</h3>
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input value={user?.name || ''} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input value={user?.email || ''} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Input value={user?.role || 'user'} disabled className="capitalize" />
          </div>
        </div>
      </div>

      <div className="ghibli-card p-8">
        <h3 className="text-xl font-bold mb-6">Account Actions</h3>
        <div className="space-y-4 max-w-2xl">
          <Button
            variant="outline"
            className="rounded-full w-full"
            onClick={() => {
              logout();
              toast.success("Logged out successfully");
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
