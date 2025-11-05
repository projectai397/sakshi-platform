import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  ArrowRight,
  Calendar,
  Award
} from "lucide-react";
import { getLoginUrl } from "@/const";

export default function SevaWallet() {
  const { user, isAuthenticated } = useAuth();

  const { data: wallet, isLoading: walletLoading } = trpc.seva.getWallet.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: transactions, isLoading: txLoading } = trpc.seva.getTransactions.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6 animate-float">✨</div>
            <h1 className="text-4xl font-bold mb-4">Your Seva Wallet</h1>
            <p className="text-lg mb-8" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
              Sign in to view your seva token balance and transaction history
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

  const isLoading = walletLoading || txLoading;

  // Calculate expiring tokens (mock for now)
  const expiringTokens = 0; // TODO: Calculate from transactions with expires_at

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="adiyogi-bg-nature py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-4">
                <span className="text-5xl animate-float">✨</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your <span className="text-gradient-sage">Seva Wallet</span>
              </h1>
              <p className="text-lg" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                Track your community contributions and spending
              </p>
            </div>
          </div>
        </section>

        {/* Balance Card */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {isLoading ? (
                <div className="ghibli-card p-8 animate-pulse">
                  <div className="h-8 bg-[rgb(var(--soft-gray)/0.2)] rounded w-48 mb-4 mx-auto" />
                  <div className="h-16 bg-[rgb(var(--soft-gray)/0.2)] rounded w-32 mx-auto" />
                </div>
              ) : (
                <div className="ghibli-card p-8 text-center watercolor-sage">
                  <h2 className="text-2xl font-bold mb-6">Current Balance</h2>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Sparkles className="w-12 h-12" style={{ color: 'rgb(var(--sage-green))' }} />
                    <div className="text-6xl font-bold" style={{ color: 'rgb(var(--sage-green))' }}>
                      {wallet?.balance || 0}
                    </div>
                    <span className="text-2xl" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>tokens</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5" style={{ color: 'rgb(var(--sage-green))' }} />
                        <span className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>Lifetime Earned</span>
                      </div>
                      <div className="text-2xl font-bold">{wallet?.lifetimeEarned || 0}</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5" style={{ color: 'rgb(var(--terracotta))' }} />
                        <span className="text-sm" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>Lifetime Spent</span>
                      </div>
                      <div className="text-2xl font-bold">{wallet?.lifetimeSpent || 0}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expiring Soon Alert */}
              {expiringTokens > 0 && (
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[rgb(var(--cherry-blossom)/0.2)] to-[rgb(var(--twilight-purple)/0.2)] border-2 border-[rgb(var(--cherry-blossom))]">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'rgb(var(--cherry-blossom))' }} />
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">Tokens Expiring Soon</h3>
                      <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                        <strong>{expiringTokens} tokens</strong> will expire in the next 30 days. Use them before they're gone!
                      </p>
                      <Link href="/shop">
                        <Button
                          size="sm"
                          className="rounded-full"
                          style={{
                            background: 'rgb(var(--cherry-blossom))',
                            color: 'white'
                          }}
                        >
                          Shop Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ways to Earn */}
        <section className="py-8 adiyogi-bg-nature">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Ways to <span className="text-gradient-sage">Earn More Tokens</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="ghibli-card p-6">
                  <div className="text-3xl mb-3">🏪</div>
                  <h3 className="font-bold mb-2">Volunteer at Store</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Help sort donations, assist customers, or organize inventory
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="font-medium">1 token/hour</span>
                  </div>
                </div>

                <div className="ghibli-card p-6">
                  <div className="text-3xl mb-3">🔧</div>
                  <h3 className="font-bold mb-2">Repair Café</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Use your skills to fix items for community members
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="font-medium">2 tokens/repair</span>
                  </div>
                </div>

                <div className="ghibli-card p-6">
                  <div className="text-3xl mb-3">📦</div>
                  <h3 className="font-bold mb-2">Donate Items</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Donate quality items in good condition
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="font-medium">1-5 tokens/donation</span>
                  </div>
                </div>

                <div className="ghibli-card p-6">
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="font-bold mb-2">Lead Workshop</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Share your skills through upcycling or repair workshops
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="font-medium">5-10 tokens/session</span>
                  </div>
                </div>

                <div className="ghibli-card p-6">
                  <div className="text-3xl mb-3">🔄</div>
                  <h3 className="font-bold mb-2">Swap Events</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Participate in community swap events
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="font-medium">1-3 tokens/event</span>
                  </div>
                </div>

                <div className="ghibli-card p-6">
                  <div className="text-3xl mb-3">☕</div>
                  <h3 className="font-bold mb-2">Sakshi Café</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Help at our community café
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: 'rgb(var(--sage-green))' }} />
                    <span className="font-medium">1 token/hour</span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href="/volunteer">
                  <Button
                    size="lg"
                    className="rounded-full ghibli-button text-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                      color: 'white'
                    }}
                  >
                    View Volunteer Opportunities
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Recent <span className="text-gradient-warm">Activity</span>
              </h2>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="ghibli-card p-6 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[rgb(var(--soft-gray)/0.2)] rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-[rgb(var(--soft-gray)/0.2)] rounded w-3/4 mb-2" />
                          <div className="h-3 bg-[rgb(var(--soft-gray)/0.2)] rounded w-1/2" />
                        </div>
                        <div className="h-6 bg-[rgb(var(--soft-gray)/0.2)] rounded w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx: any) => (
                    <div key={tx.id} className="ghibli-card p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            tx.transactionType === 'earn' ? 'watercolor-sage' : 'watercolor-terracotta'
                          }`}
                        >
                          {tx.transactionType === 'earn' ? '↑' : '↓'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{tx.description}</p>
                          <div className="flex items-center gap-3 text-xs" style={{ color: 'rgb(var(--charcoal) / 0.6)' }}>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(tx.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            {tx.sourceType && (
                              <span className="px-2 py-0.5 rounded-full bg-[rgb(var(--soft-gray)/0.2)]">
                                {tx.sourceType.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            tx.transactionType === 'earn'
                              ? 'text-[rgb(var(--sage-green))]'
                              : 'text-[rgb(var(--terracotta))]'
                          }`}
                        >
                          {tx.transactionType === 'earn' ? '+' : '-'}
                          {tx.amount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ghibli-card p-12 text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-bold mb-2">No Activity Yet</h3>
                  <p className="mb-6" style={{ color: 'rgb(var(--charcoal) / 0.7)' }}>
                    Start volunteering to earn your first seva tokens!
                  </p>
                  <Link href="/volunteer">
                    <Button
                      className="rounded-full ghibli-button"
                      style={{
                        background: 'linear-gradient(135deg, rgb(var(--sage-green)), rgb(var(--forest-green)))',
                        color: 'white'
                      }}
                    >
                      Find Volunteer Opportunities
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8 watercolor-bg">
          <div className="container">
            <div className="max-w-3xl mx-auto ghibli-card p-8">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 flex-shrink-0" style={{ color: 'rgb(var(--sage-green))' }} />
                <div>
                  <h3 className="text-xl font-bold mb-3">About Seva Tokens</h3>
                  <div className="space-y-2 text-sm" style={{ color: 'rgb(var(--charcoal) / 0.8)' }}>
                    <p>
                      <strong>Seva tokens</strong> are our community currency. One hour of service equals one token, 
                      whether you're washing dishes or teaching meditation.
                    </p>
                    <p>
                      Tokens can be spent across all Sakshi Center programs: thrift store, café, meditation retreats, 
                      healing center sessions, and workshops.
                    </p>
                    <p>
                      <strong>Important:</strong> Tokens expire after 1 year to encourage circulation. They cannot be 
                      transferred or sold—only earned through service and spent on experiences.
                    </p>
                  </div>
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
