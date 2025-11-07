import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { SAKWalletDashboard } from "@/components/sakshichain/SAKWalletDashboard";
import { Loader2 } from "lucide-react";

export default function SAKWallet() {
  const { user } = useAuth();
  
  const { data: wallet, isLoading: walletLoading } = trpc.sakshicoin.getWallet.useQuery();
  const { data: transactions, isLoading: transactionsLoading } = trpc.sakshicoin.getTransactions.useQuery({
    limit: 50,
  });

  if (walletLoading || transactionsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!wallet) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Unable to load wallet</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">SakshiCoin Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your SAK tokens and view your transaction history
          </p>
        </div>

        <SAKWalletDashboard
          wallet={wallet}
          transactions={transactions || []}
          currentWalletId={wallet.id}
        />
      </div>
    </DashboardLayout>
  );
}
