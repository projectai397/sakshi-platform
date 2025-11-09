import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Utensils,
  ShoppingBag,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  ChefHat,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type Tab = "overview" | "menu" | "orders" | "classes" | "locations" | "recipes" | "franchises";

export default function CafeAdmin() {
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
            <p className="text-lg mb-8 text-gray-600">
              Please sign in with an admin account to access the cafe dashboard
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-green-600 hover:bg-green-700"
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
            <p className="text-lg mb-8 text-gray-600">
              You don't have permission to access the cafe admin dashboard
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = "/"}
              className="bg-green-600 hover:bg-green-700"
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
    { id: "overview" as Tab, label: "Overview", icon: TrendingUp },
    { id: "menu" as Tab, label: "Menu Items", icon: Utensils },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingBag },
    { id: "classes" as Tab, label: "Classes", icon: Calendar },
    { id: "locations" as Tab, label: "Locations", icon: MapPin },
    { id: "recipes" as Tab, label: "Recipes", icon: ChefHat },
    { id: "franchises" as Tab, label: "Franchises", icon: Package },
  ];

  const { data: orders } = trpc.cafe.orders.getAllOrders.useQuery({
    limit: 10,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sakshi Cafe Admin</h1>
          <p className="text-gray-600">Manage menu, orders, classes, and cafe operations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Cafe Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                      <h3 className="font-semibold">Today's Orders</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-gray-600 mt-1">₹0 revenue</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Utensils className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold">Menu Items</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600 mt-1">0 active</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      <h3 className="font-semibold">Upcoming Classes</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-600 mt-1">0 registrations</p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-6 h-6 text-orange-600" />
                      <h3 className="font-semibold">Locations</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-gray-600 mt-1">0 active</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Recent Orders</h3>
                  {orders && orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{order.orderType}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' :
                              order.orderStatus === 'preparing' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No recent orders</p>
                  )}
                </div>
              </div>
            )}

            {/* Menu Items Tab */}
            {activeTab === "menu" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Menu Management</h2>
                  <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Menu Item
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="text-center py-12 text-gray-500">
                  Menu items management interface will be implemented here
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Order Management</h2>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="text-center py-12 text-gray-500">
                  Order management interface will be implemented here
                </div>
              </div>
            )}

            {/* Classes Tab */}
            {activeTab === "classes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Class Management</h2>
                  <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Schedule Class
                  </Button>
                </div>

                <div className="text-center py-12 text-gray-500">
                  Class management interface will be implemented here
                </div>
              </div>
            )}

            {/* Locations Tab */}
            {activeTab === "locations" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Location Management</h2>
                  <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Location
                  </Button>
                </div>

                <div className="text-center py-12 text-gray-500">
                  Location management interface will be implemented here
                </div>
              </div>
            )}

            {/* Recipes Tab */}
            {activeTab === "recipes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recipe Moderation</h2>
                  <Button variant="outline">
                    View Pending ({0})
                  </Button>
                </div>

                <div className="text-center py-12 text-gray-500">
                  Recipe moderation interface will be implemented here
                </div>
              </div>
            )}

            {/* Franchises Tab */}
            {activeTab === "franchises" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Franchise Applications</h2>
                  <Button variant="outline">
                    View Pending ({0})
                  </Button>
                </div>

                <div className="text-center py-12 text-gray-500">
                  Franchise management interface will be implemented here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
