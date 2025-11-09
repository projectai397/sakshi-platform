import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Utensils
} from "lucide-react";

export default function CafeDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "subscriptions" | "classes" | "health">("orders");

  const { data: orders, isLoading: ordersLoading } = trpc.cafe.orders.getMyOrders.useQuery({
    limit: 10,
    offset: 0,
  });

  const { data: subscriptions, isLoading: subscriptionsLoading } = trpc.cafe.subscriptions.getMySubscriptions.useQuery();
  const { data: classes, isLoading: classesLoading } = trpc.cafe.classes.getMyRegistrations.useQuery();
  const { data: healthSummary, isLoading: healthLoading } = trpc.cafe.health.getDailyNutritionSummary.useQuery({
    date: new Date(),
  });

  const tabs = [
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "subscriptions", label: "Subscriptions", icon: Package },
    { id: "classes", label: "My Classes", icon: Calendar },
    { id: "health", label: "Health Tracking", icon: Heart },
  ];

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-100";
      case "preparing": return "text-blue-600 bg-blue-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Cafe Dashboard</h1>
          <p className="text-gray-600">Manage your orders, subscriptions, classes, and health tracking</p>
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
                    onClick={() => setActiveTab(tab.id as any)}
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
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  <Link href="/cafe/menu">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Order Now
                    </Button>
                  </Link>
                </div>

                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:border-green-600 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">Order #{order.id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getOrderStatusColor(order.orderStatus || '')}`}>
                                {getOrderStatusIcon(order.orderStatus || '')}
                                {order.orderStatus}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {order.orderType} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">₹{order.total}</p>
                            <p className="text-sm text-gray-600">{(order.items as any[])?.length || 0} items</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/cafe/orders/${order.id}`}>
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                          {order.orderStatus === 'delivered' && (
                            <Button variant="ghost" size="sm">Reorder</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start your Satvic journey with your first order!</p>
                    <Link href="/cafe/menu">
                      <Button className="bg-green-600 hover:bg-green-700">Browse Menu</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === "subscriptions" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Meal Subscriptions</h2>
                  <Link href="/cafe/subscriptions/new">
                    <Button className="bg-green-600 hover:bg-green-700">
                      New Subscription
                    </Button>
                  </Link>
                </div>

                {subscriptionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : subscriptions && subscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold mb-1">
                              {sub.frequency} Meal Subscription
                            </h3>
                            <p className="text-sm text-gray-600">
                              {sub.mealsPerDelivery} meals per delivery
                            </p>
                            <p className="text-sm text-gray-600">
                              Next delivery: {sub.nextDeliveryDate ? new Date(sub.nextDeliveryDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sub.status === 'active' ? 'bg-green-100 text-green-600' :
                              sub.status === 'paused' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {sub.status}
                            </span>
                            <p className="font-semibold mt-2">₹{sub.amountPerCycle}/cycle</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/cafe/subscriptions/${sub.id}`}>
                            <Button variant="outline" size="sm">Manage</Button>
                          </Link>
                          {sub.status === 'active' && (
                            <Button variant="ghost" size="sm">Pause</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active subscriptions</h3>
                    <p className="text-gray-600 mb-4">Save time and money with regular meal deliveries</p>
                    <Link href="/cafe/subscriptions/new">
                      <Button className="bg-green-600 hover:bg-green-700">Start Subscription</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Classes Tab */}
            {activeTab === "classes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Classes</h2>
                  <Link href="/cafe/classes">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Browse Classes
                    </Button>
                  </Link>
                </div>

                {classesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : classes && classes.length > 0 ? (
                  <div className="space-y-4">
                    {classes.map((registration) => (
                      <div key={registration.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold mb-1">Cooking Class #{registration.classId}</h3>
                            <p className="text-sm text-gray-600">
                              Status: {registration.attendanceStatus}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{registration.amountPaid}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              registration.paymentStatus === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {registration.paymentStatus}
                            </span>
                          </div>
                        </div>
                        {registration.certificateIssued && (
                          <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                            <CheckCircle className="w-4 h-4" />
                            Certificate issued
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes registered</h3>
                    <p className="text-gray-600 mb-4">Learn to cook delicious Satvic meals</p>
                    <Link href="/cafe/classes">
                      <Button className="bg-green-600 hover:bg-green-700">View Classes</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Health Tracking Tab */}
            {activeTab === "health" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Health Tracking</h2>
                  <Link href="/cafe/health/log">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Log Meal
                    </Button>
                  </Link>
                </div>

                {healthLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : healthSummary ? (
                  <div>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Calories</p>
                        <p className="text-2xl font-bold text-blue-600">{healthSummary.totalCalories || 0}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Protein</p>
                        <p className="text-2xl font-bold text-green-600">{healthSummary.totalProtein || 0}g</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Carbs</p>
                        <p className="text-2xl font-bold text-orange-600">{healthSummary.totalCarbs || 0}g</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Fiber</p>
                        <p className="text-2xl font-bold text-purple-600">{healthSummary.totalFiber || 0}g</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Link href="/cafe/health/metrics">
                        <Button variant="outline">View Trends</Button>
                      </Link>
                      <Link href="/cafe/health/log">
                        <Button variant="outline">Log Health Metrics</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start tracking your health</h3>
                    <p className="text-gray-600 mb-4">Monitor your nutrition and wellness journey</p>
                    <Link href="/cafe/health/log">
                      <Button className="bg-green-600 hover:bg-green-700">Log First Meal</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Utensils className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold">Total Orders</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{orders?.length || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold">Seva Tokens Earned</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-1">From cafe activities</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold">Classes Attended</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {classes?.filter(c => c.attendanceStatus === 'attended').length || 0}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
