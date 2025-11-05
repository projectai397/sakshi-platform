import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, ShoppingBag, Coins, User, Package, 
  Calendar, CreditCard, Heart, TrendingUp, Gift,
  Sparkles, Clock, CheckCircle2
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");

  // Fetch user data
  const { data: orders = [], isLoading: ordersLoading } = trpc.orders.getUserOrders.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: wallet, isLoading: walletLoading } = trpc.seva.getWallet.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: transactions = [], isLoading: transactionsLoading } = trpc.seva.getTransactions.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-50">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="max-w-md p-12 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your dashboard
            </p>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              Sign In
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "money": return <CreditCard className="h-4 w-4" />;
      case "seva_tokens": return <Coins className="h-4 w-4" />;
      case "free": return <Heart className="h-4 w-4" />;
      case "mixed": return <Sparkles className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-forest-800 mb-2">
              Welcome back, {user?.name || "Friend"}!
            </h1>
            <p className="text-gray-600">
              Manage your orders, seva tokens, and account settings
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-sage-50 to-green-50">
              <div className="flex items-center justify-between mb-2">
                <ShoppingBag className="h-8 w-8 text-sage-600" />
                <Badge variant="secondary">{orders.length}</Badge>
              </div>
              <h3 className="text-2xl font-bold text-forest-800">{orders.length}</h3>
              <p className="text-sm text-gray-600">Total Orders</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center justify-between mb-2">
                <Coins className="h-8 w-8 text-amber-600" />
                <Badge variant="secondary">{wallet?.balance || 0}</Badge>
              </div>
              <h3 className="text-2xl font-bold text-forest-800">{wallet?.balance || 0}</h3>
              <p className="text-sm text-gray-600">Seva Tokens</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-sky-600" />
                <Badge variant="secondary">{wallet?.lifetimeEarned || 0}</Badge>
              </div>
              <h3 className="text-2xl font-bold text-forest-800">{wallet?.lifetimeEarned || 0}</h3>
              <p className="text-sm text-gray-600">Lifetime Earned</p>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wallet">Seva Wallet</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Order History</h2>
                
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Button onClick={() => setLocation("/shop")}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">
                                Order #{order.orderNumber}
                              </h3>
                              <Badge className={getStatusColor(order.fulfillmentStatus)}>
                                {order.fulfillmentStatus}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(order.createdAt), "MMM d, yyyy")}
                              </div>
                              <div className="flex items-center gap-1">
                                {getPaymentMethodIcon(order.paymentMethod)}
                                <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {order.totalAmount > 0 && (
                              <div className="text-lg font-semibold text-forest-800">
                                ₹{(order.totalAmount / 100).toFixed(2)}
                              </div>
                            )}
                            {order.tokensUsed > 0 && (
                              <div className="text-sm text-amber-600 font-medium">
                                {order.tokensUsed} tokens
                              </div>
                            )}
                            {order.paymentMethod === "free" && (
                              <div className="text-sm text-rose-600 font-medium">
                                Free
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            {order.fulfillmentType === "pickup" ? "Store Pickup" : "Delivery"}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/order/${order.orderNumber}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Seva Wallet Tab */}
            <TabsContent value="wallet" className="space-y-6">
              {/* Wallet Overview */}
              <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-forest-800 mb-1">
                      {wallet?.balance || 0} Tokens
                    </h2>
                    <p className="text-gray-600">Available Balance</p>
                  </div>
                  <Coins className="h-16 w-16 text-amber-500" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-amber-200">
                  <div>
                    <div className="text-2xl font-semibold text-forest-800">
                      {wallet?.lifetimeEarned || 0}
                    </div>
                    <div className="text-sm text-gray-600">Lifetime Earned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-forest-800">
                      {wallet?.lifetimeSpent || 0}
                    </div>
                    <div className="text-sm text-gray-600">Lifetime Spent</div>
                  </div>
                </div>
              </Card>

              {/* Ways to Earn More */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-amber-500" />
                  Ways to Earn More Tokens
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/volunteer")}>
                    <Gift className="h-8 w-8 text-green-600 mb-3" />
                    <h3 className="font-semibold mb-2">Volunteer</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Earn 5-10 tokens per hour helping at our store or events
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Opportunities
                    </Button>
                  </Card>

                  <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation("/donate")}>
                    <Heart className="h-8 w-8 text-rose-600 mb-3" />
                    <h3 className="font-semibold mb-2">Donate Items</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Earn tokens based on the value of items you donate
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Donating
                    </Button>
                  </Card>

                  <Card className="p-6 hover:shadow-md transition-shadow">
                    <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">Refer Friends</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Earn 10 tokens when a friend makes their first purchase
                    </p>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </Card>
                </div>
              </Card>

              {/* Transaction History */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
                
                {transactionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
                    <p className="text-gray-600">
                      Start earning and spending tokens to see your history here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((txn: any) => (
                      <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            txn.type === "earn" ? "bg-green-100" : "bg-red-100"
                          }`}>
                            {txn.type === "earn" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <ShoppingBag className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{txn.description}</div>
                            <div className="text-sm text-gray-600">
                              {format(new Date(txn.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-semibold ${
                          txn.type === "earn" ? "text-green-600" : "text-red-600"
                        }`}>
                          {txn.type === "earn" ? "+" : "-"}{txn.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        {user?.name || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        {user?.email || "Not provided"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <div className="p-3 border rounded-lg bg-gray-50 capitalize">
                      {user?.role || "user"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Member Since</label>
                    <div className="p-3 border rounded-lg bg-gray-50">
                      {user?.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : "Unknown"}
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Profile information is managed through your authentication provider.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Account Actions */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto py-4"
                    onClick={() => setLocation("/shop")}
                  >
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Browse Products</div>
                      <div className="text-sm text-gray-600">Find unique treasures</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="justify-start h-auto py-4"
                    onClick={() => setLocation("/donate")}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Donate Items</div>
                      <div className="text-sm text-gray-600">Give back to community</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="justify-start h-auto py-4"
                    onClick={() => setLocation("/volunteer")}
                  >
                    <Gift className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Volunteer</div>
                      <div className="text-sm text-gray-600">Earn seva tokens</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="justify-start h-auto py-4"
                    onClick={() => setLocation("/cafes")}
                  >
                    <Sparkles className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Visit Sakshi Cafés</div>
                      <div className="text-sm text-gray-600">Support women cooperatives</div>
                    </div>
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
