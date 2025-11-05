import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { client } from "../../lib/client";

interface RazorpayCheckoutProps {
  orderId: number;
  amount: number;
  currency?: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout({
  orderId,
  amount,
  currency = "INR",
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);

  // Get Razorpay config
  const { data: config } = useQuery({
    queryKey: ["razorpay-config"],
    queryFn: () => client.payments.razorpay.getConfig.query(),
  });

  // Create Razorpay order
  const createOrderMutation = useMutation({
    mutationFn: () =>
      client.payments.razorpay.createOrder.mutate({
        orderId,
        amount,
        currency,
      }),
  });

  // Verify payment
  const verifyPaymentMutation = useMutation({
    mutationFn: (data: {
      orderId: string;
      paymentId: string;
      signature: string;
    }) =>
      client.payments.razorpay.verifyPayment.mutate({
        ...data,
        sakshiOrderId: orderId,
      }),
  });

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create Razorpay order
      const razorpayOrder = await createOrderMutation.mutateAsync();

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
        key: config?.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Sakshi Platform",
        description: `Order #${orderId}`,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            await verifyPaymentMutation.mutateAsync({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            onSuccess(response.razorpay_payment_id);
          } catch (error) {
            onError("Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#FF6B35",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      onError("Failed to initiate payment");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          Pay with Razorpay - ₹{amount.toFixed(2)}
        </>
      )}
    </button>
  );
}
