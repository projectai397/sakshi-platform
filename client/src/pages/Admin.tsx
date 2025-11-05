import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Users,
  TrendingUp,
  Heart,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  BarChart3,
  ShoppingBag,
  Sparkles,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type Tab = "overview" | "products" | "users" | "donations" | "orders" | "analytics";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-4xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Please sign in with an admin account to access the dashboard
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

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">⛔</div>
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              You don't have permission to access the admin dashboard
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = "/"}
              className="rounded-full ghibli-button text-lg"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                color: 'white'
              }}
            >
              Go Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: BarChart3 },
    { id: "products" as Tab, label: "Products", icon: Package },
    { id: "users" as Tab, label: "Users", icon: Users },
    { id: "donations" as Tab, label: "Donations", icon: Heart },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingBag },
    { id: "analytics" as Tab, label: "Analytics", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--warm-cream))]">
      <Navigation />

      <main className="flex-1">
        {/* Admin Header */}
        <div className="watercolor-bg border-b border-[rgb(var(--soft-gray)/0.2)]">
          <div className="container py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="text-gradient-sage">Admin Dashboard</span>
                </h1>
                <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                  Welcome back, {user?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="rounded-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="rounded-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
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
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "products" && <ProductsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          {activeTab === "users" && <UsersTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          {activeTab === "donations" && <DonationsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function OverviewTab() {
  const stats = [
    {
      label: "Total Products",
      value: "234",
      change: "+12 this week",
      icon: Package,
      color: "sage"
    },
    {
      label: "Active Users",
      value: "1,847",
      change: "+156 this month",
      icon: Users,
      color: "terracotta"
    },
    {
      label: "Total Orders",
      value: "892",
      change: "+43 this week",
      icon: ShoppingBag,
      color: "purple"
    },
    {
      label: "Seva Tokens Circulated",
      value: "4,520",
      change: "+890 this month",
      icon: Sparkles,
      color: "cherry"
    }
  ];

  const recentActivity = [
    { type: "order", message: "New order #1234 - ₹450", time: "2 minutes ago" },
    { type: "donation", message: "New donation received - 5 items", time: "15 minutes ago" },
    { type: "user", message: "New user registered: Priya Sharma", time: "1 hour ago" },
    { type: "product", message: "Product added: Vintage Camera", time: "2 hours ago" },
    { type: "order", message: "Order #1233 completed", time: "3 hours ago" }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="ghibli-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${
                    stat.color === 'sage' ? 'watercolor-sage' :
                    stat.color === 'terracotta' ? 'watercolor-terracotta' :
                    stat.color === 'purple' ? 'bg-gradient-to-br from-[rgb(var(--twilight-purple)/0.2)] to-[rgb(var(--lavender)/0.2)]' :
                    'bg-gradient-to-br from-[rgb(var(--cherry-blossom)/0.2)] to-[rgb(var(--rose-pink)/0.2)]'
                  } flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm mb-1" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                {stat.label}
              </div>
              <div className="text-xs" style={{ color: 'rgb(var(--sage-green))' }}>
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="ghibli-card p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-[rgb(var(--soft-gray)/0.05)] transition-colors"
            >
              <div className="w-10 h-10 rounded-full watercolor-sage flex items-center justify-center flex-shrink-0">
                {activity.type === 'order' && '🛍️'}
                {activity.type === 'donation' && '💝'}
                {activity.type === 'user' && '👤'}
                {activity.type === 'product' && '📦'}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.message}</p>
                <p className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          className="h-24 rounded-2xl ghibli-button text-lg"
          style={{
            background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
            color: 'white'
          }}
        >
          <Plus className="w-6 h-6 mr-2" />
          Add New Product
        </Button>
        <Button
          variant="outline"
          className="h-24 rounded-2xl text-lg"
        >
          <Heart className="w-6 h-6 mr-2" />
          Process Donation
        </Button>
        <Button
          variant="outline"
          className="h-24 rounded-2xl text-lg"
        >
          <Users className="w-6 h-6 mr-2" />
          Manage Users
        </Button>
      </div>
    </div>
  );
}

function ProductsTab({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  const { data: products, isLoading } = trpc.products.list.useQuery({});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Product Management</h2>
        <Button
          className="rounded-full ghibli-button"
          style={{
            background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
            color: 'white'
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="ghibli-card p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgb(var(--charcoal) / 0.4)' }} />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="ghibli-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[rgb(var(--soft-gray)/0.1)] border-b border-[rgb(var(--soft-gray)/0.2)]">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Condition</th>
                <th className="text-left p-4 font-medium">Price Range</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="animate-pulse">Loading products...</div>
                  </td>
                </tr>
              ) : products && products.length > 0 ? (
                products.slice(0, 10).map((product: any) => (
                  <tr key={product.id} className="border-b border-[rgb(var(--soft-gray)/0.1)] hover:bg-[rgb(var(--soft-gray)/0.05)]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[rgb(var(--warm-cream))] to-[rgb(var(--sky-blue)/0.2)] flex items-center justify-center">
                          📦
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs watercolor-sage">
                        {product.categoryId}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="capitalize">{product.condition}</span>
                    </td>
                    <td className="p-4">
                      ₹{product.minimumPrice / 100} - ₹{product.maximumPrice / 100}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        product.status === 'available' ? 'bg-green-100 text-green-700' :
                        product.status === 'sold' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" className="rounded-full">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="rounded-full text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersTab({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">User Management</h2>
      </div>

      <div className="ghibli-card p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgb(var(--charcoal) / 0.4)' }} />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="ghibli-card p-8 text-center">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-bold mb-2">User Management</h3>
        <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
          User management features coming soon
        </p>
      </div>
    </div>
  );
}

function DonationsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Donation Processing</h2>
      <div className="ghibli-card p-8 text-center">
        <div className="text-6xl mb-4">💝</div>
        <h3 className="text-xl font-bold mb-2">Donation Management</h3>
        <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
          Donation processing features coming soon
        </p>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Order Management</h2>
      <div className="ghibli-card p-8 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-bold mb-2">Order Management</h3>
        <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
          Order management features coming soon
        </p>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="ghibli-card p-6">
          <h3 className="font-bold mb-4">Revenue Trends</h3>
          <div className="h-40 flex items-center justify-center watercolor-sage rounded-xl">
            <BarChart3 className="w-12 h-12" style={{ color: 'rgb(var(--sage-green))' }} />
          </div>
        </div>

        <div className="ghibli-card p-6">
          <h3 className="font-bold mb-4">User Growth</h3>
          <div className="h-40 flex items-center justify-center watercolor-terracotta rounded-xl">
            <TrendingUp className="w-12 h-12" style={{ color: 'rgb(var(--terracotta))' }} />
          </div>
        </div>

        <div className="ghibli-card p-6">
          <h3 className="font-bold mb-4">Impact Metrics</h3>
          <div className="h-40 flex items-center justify-center bg-gradient-to-br from-[rgb(var(--cherry-blossom)/0.2)] to-[rgb(var(--rose-pink)/0.2)] rounded-xl">
            <Heart className="w-12 h-12" style={{ color: 'rgb(var(--cherry-blossom))' }} />
          </div>
        </div>
      </div>

      <div className="ghibli-card p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
        <p style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
          Detailed analytics and reporting features coming soon
        </p>
      </div>
    </div>
  );
}
