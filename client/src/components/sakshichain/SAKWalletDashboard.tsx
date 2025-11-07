import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Gift,
  Lock,
  Vote
} from "lucide-react";

interface SAKWalletData {
  balance: string;
  totalEarned: string;
  totalSpent: string;
  walletAddress: string;
}

interface Transaction {
  id: number;
  amount: string;
  type: string;
  category: string;
  description: string;
  createdAt: string;
  fromWalletId?: number;
  toWalletId?: number;
}

interface SAKWalletDashboardProps {
  wallet: SAKWalletData;
  transactions: Transaction[];
  currentWalletId: number;
}

export function SAKWalletDashboard({ wallet, transactions, currentWalletId }: SAKWalletDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatSAK = (amount: string) => {
    return parseFloat(amount).toFixed(2);
  };

  const getTransactionIcon = (tx: Transaction) => {
    if (tx.toWalletId === currentWalletId) {
      return <ArrowDownRight className="h-4 w-4 text-green-600" />;
    } else {
      return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    }
  };

  const getTransactionColor = (tx: Transaction) => {
    if (tx.toWalletId === currentWalletId) {
      return "text-green-600";
    } else {
      return "text-red-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">SAK Balance</p>
                <p className="text-3xl font-bold mt-1">{formatSAK(wallet.balance)}</p>
                <p className="text-xs opacity-75 mt-1">SakshiCoin</p>
              </div>
              <Wallet className="h-12 w-12 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  +{formatSAK(wallet.totalEarned)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  -{formatSAK(wallet.totalSpent)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <ArrowUpRight className="h-10 w-10 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>SakshiCoin Wallet</CardTitle>
          <CardDescription>
            Manage your SAK tokens and view transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="earn">Earn SAK</TabsTrigger>
              <TabsTrigger value="stake">Stake</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Wallet Address</p>
                <p className="text-xs font-mono break-all">{wallet.walletAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full" variant="outline">
                  <Gift className="h-4 w-4 mr-2" />
                  Send SAK
                </Button>
                <Button className="w-full" variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Stake SAK
                </Button>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No transactions yet
                </p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(tx)}
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {tx.category}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${getTransactionColor(tx)}`}>
                      {tx.toWalletId === currentWalletId ? "+" : "-"}
                      {formatSAK(tx.amount)} SAK
                    </p>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Earn SAK Tab */}
            <TabsContent value="earn" className="space-y-4">
              <div className="space-y-3">
                <EarnCard
                  title="List Quality Items"
                  description="Earn 5-20 SAK for each quality listing"
                  reward="5-20 SAK"
                  icon={<Gift className="h-5 w-5" />}
                />
                <EarnCard
                  title="Repair & Upcycle"
                  description="Earn 30-100 SAK for extending product life"
                  reward="30-100 SAK"
                  icon={<TrendingUp className="h-5 w-5" />}
                />
                <EarnCard
                  title="Write Reviews"
                  description="Earn 5-15 SAK for helpful reviews"
                  reward="5-15 SAK"
                  icon={<Vote className="h-5 w-5" />}
                />
                <EarnCard
                  title="Refer Friends"
                  description="Earn 100 SAK for each successful referral"
                  reward="100 SAK"
                  icon={<Gift className="h-5 w-5" />}
                />
              </div>
            </TabsContent>

            {/* Stake Tab */}
            <TabsContent value="stake" className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Stake SAK to Earn Rewards
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Lock your SAK tokens for a period of time to earn additional rewards and 
                  gain voting power in platform governance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StakeCard
                  period="30 Days"
                  apy="5%"
                  description="Short-term staking"
                />
                <StakeCard
                  period="90 Days"
                  apy="12%"
                  description="Medium-term staking"
                  featured
                />
                <StakeCard
                  period="180 Days"
                  apy="25%"
                  description="Long-term staking"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function EarnCard({ title, description, reward, icon }: {
  title: string;
  description: string;
  reward: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Badge variant="success">{reward}</Badge>
    </div>
  );
}

function StakeCard({ period, apy, description, featured }: {
  period: string;
  apy: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <Card className={featured ? "border-primary" : ""}>
      <CardContent className="pt-6">
        <div className="text-center">
          {featured && (
            <Badge variant="default" className="mb-2">
              Popular
            </Badge>
          )}
          <p className="text-2xl font-bold">{apy}</p>
          <p className="text-sm text-muted-foreground">APY</p>
          <p className="text-lg font-semibold mt-2">{period}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
          <Button className="w-full mt-4" variant={featured ? "default" : "outline"}>
            Stake Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
