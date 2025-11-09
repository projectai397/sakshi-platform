import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CafePaymentProps {
  orderId?: number;
  classId?: number;
  amount: number;
  priceTier: 'community' | 'fair' | 'supporter';
  type: 'order' | 'class' | 'subscription';
  onSuccess: (paymentId: string) => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CafePayment({
  orderId,
  classId,
  amount,
  priceTier,
  type,
  onSuccess,
  onError,
}: CafePaymentProps) {
  const [loading, setLoading] = useState(false);

  // Create Razorpay order mutation
  const createPaymentMutation = trpc.cafe.orders.createPayment.useMutation();

  // Verify payment mutation
  const verifyPaymentMutation = trpc.cafe.orders.verifyPayment.useMutation();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create Razorpay order
      const razorpayOrder = await createPaymentMutation.mutateAsync({
        orderId,
        classId,
        amount,
        priceTier,
        type,
      });

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize Razorpay
      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Sakshi Cafe",
        description: getPaymentDescription(type, orderId, classId),
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            await verifyPaymentMutation.mutateAsync({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              sakshiOrderId: orderId,
              classId,
              type,
            });

            toast.success("Payment successful!");
            onSuccess(response.razorpay_payment_id);
          } catch (error) {
            toast.error("Payment verification failed");
            onError?.("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#16a34a", // Green color for Sakshi Cafe
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      toast.error("Failed to initiate payment");
      onError?.("Failed to initiate payment");
    }
  };

  const handleSevaTokenPayment = async () => {
    try {
      setLoading(true);
      
      // TODO: Implement Seva token redemption
      toast.info("Seva token payment coming soon!");
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to process Seva token payment");
    }
  };

  return (
    <div className="space-y-4">
      {/* Razorpay Payment */}
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay ₹{amount.toFixed(2)} with Razorpay
          </>
        )}
      </Button>

      {/* Seva Token Payment */}
      <Button
        onClick={handleSevaTokenPayment}
        disabled={loading}
        variant="outline"
        className="w-full border-green-600 text-green-600 hover:bg-green-50"
        size="lg"
      >
        Pay with Seva Tokens
      </Button>

      {/* Pricing Tier Info */}
      <div className="text-sm text-gray-600 text-center">
        <p>
          You selected: <span className="font-semibold capitalize">{priceTier} Tier</span>
        </p>
        {priceTier === 'community' && (
          <p className="text-xs mt-1">Thank you for being part of our community</p>
        )}
        {priceTier === 'supporter' && (
          <p className="text-xs mt-1">Thank you for supporting others!</p>
        )}
      </div>
    </div>
  );
}

function getPaymentDescription(
  type: 'order' | 'class' | 'subscription',
  orderId?: number,
  classId?: number
): string {
  switch (type) {
    case 'order':
      return `Cafe Order #${orderId}`;
    case 'class':
      return `Cooking Class Registration #${classId}`;
    case 'subscription':
      return 'Meal Subscription';
    default:
      return 'Sakshi Cafe Payment';
  }
}
