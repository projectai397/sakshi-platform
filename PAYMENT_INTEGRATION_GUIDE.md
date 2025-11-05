# Sakshi Platform - Payment Integration Guide

## Overview

This guide walks you through implementing payment integrations for the Sakshi platform, including Razorpay, UPI, and cryptocurrency options.

**Payment Methods Supported:**
- 💳 Razorpay (Cards, UPI, Netbanking, Wallets)
- 📱 Direct UPI (QR Code, Intent)
- 💰 Cryptocurrency (Optional)
- 🎫 Seva Tokens (Already implemented)
- 🆓 Free (Already implemented)

**Estimated Time**: 1-2 hours

---

## Table of Contents

1. [Razorpay Integration](#razorpay-integration)
2. [Direct UPI Integration](#direct-upi-integration)
3. [Cryptocurrency Integration](#cryptocurrency-integration)
4. [Testing Payments](#testing-payments)
5. [Webhook Configuration](#webhook-configuration)

---

## Razorpay Integration

### Why Razorpay?

- ✅ Most popular payment gateway in India
- ✅ Supports 100+ payment methods
- ✅ Easy integration
- ✅ Competitive pricing (2% + GST)
- ✅ Instant settlements
- ✅ Great documentation

### Step 1: Create Razorpay Account

1. Visit [Razorpay](https://razorpay.com)
2. Click **"Sign Up"**
3. Fill in business details
4. Verify email and phone
5. Complete KYC (for live mode)

### Step 2: Get API Keys

#### Test Mode Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Click **"Settings"** → **"API Keys"**
3. Click **"Generate Test Key"**
4. Save:
   - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxx`

#### Live Mode Keys (After KYC)

1. Switch to **Live Mode** in dashboard
2. Generate live keys
3. Save securely

### Step 3: Install Razorpay SDK

```bash
cd /home/ubuntu/sakshi
pnpm add razorpay
```

### Step 4: Configure Environment Variables

```bash
# Payment - Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 5: Implement Backend Integration

Create payment router:

```typescript
// server/routers/payment.ts
import { z } from 'zod';
import Razorpay from 'razorpay';
import { router, protectedProcedure } from '../trpc';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const paymentRouter = router({
  // Create Razorpay order
  createOrder: protectedProcedure
    .input(z.object({
      amount: z.number().positive(),
      currency: z.string().default('INR'),
      orderId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const options = {
        amount: input.amount * 100, // Convert to paise
        currency: input.currency,
        receipt: input.orderId,
        notes: {
          userId: ctx.user.id,
          orderId: input.orderId,
        },
      };

      const razorpayOrder = await razorpay.orders.create(options);

      return {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    }),

  // Verify payment signature
  verifyPayment: protectedProcedure
    .input(z.object({
      razorpay_order_id: z.string(),
      razorpay_payment_id: z.string(),
      razorpay_signature: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const body = input.razorpay_order_id + '|' + input.razorpay_payment_id;
      
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === input.razorpay_signature;

      if (!isValid) {
        throw new Error('Invalid payment signature');
      }

      // Update order status in database
      await ctx.db.update(orders)
        .set({ 
          status: 'paid',
          paymentId: input.razorpay_payment_id,
          paidAt: new Date(),
        })
        .where(eq(orders.razorpayOrderId, input.razorpay_order_id));

      return { success: true };
    }),

  // Get payment details
  getPayment: protectedProcedure
    .input(z.object({
      paymentId: z.string(),
    }))
    .query(async ({ input }) => {
      const payment = await razorpay.payments.fetch(input.paymentId);
      return payment;
    }),
});
```

### Step 6: Implement Frontend Integration

Create payment component:

```typescript
// client/src/components/RazorpayCheckout.tsx
import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';

interface RazorpayCheckoutProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export function RazorpayCheckout({ 
  amount, 
  orderId, 
  onSuccess, 
  onError 
}: RazorpayCheckoutProps) {
  const createOrder = trpc.payment.createOrder.useMutation();
  const verifyPayment = trpc.payment.verifyPayment.useMutation();

  const handlePayment = async () => {
    try {
      // Create Razorpay order
      const order = await createOrder.mutateAsync({
        amount,
        currency: 'INR',
        orderId,
      });

      // Load Razorpay checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Sakshi Platform',
        description: `Order #${orderId}`,
        image: '/logo.png',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            await verifyPayment.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess();
          } catch (error) {
            onError(error as Error);
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#8B5CF6', // Sakshi purple
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      onError(error as Error);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <button
      onClick={handlePayment}
      className="btn-primary"
      disabled={createOrder.isLoading || verifyPayment.isLoading}
    >
      {createOrder.isLoading || verifyPayment.isLoading 
        ? 'Processing...' 
        : `Pay ₹${amount}`}
    </button>
  );
}
```

### Step 7: Update Checkout Page

```typescript
// client/src/pages/Checkout.tsx
import { RazorpayCheckout } from '@/components/RazorpayCheckout';

export function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState<'money' | 'seva' | 'free'>('money');
  
  // ... other checkout logic

  return (
    <div className="checkout-page">
      {/* ... other checkout UI */}
      
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="money"
            checked={paymentMethod === 'money'}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
          />
          Pay with Money (Razorpay)
        </label>
        
        <label>
          <input
            type="radio"
            value="seva"
            checked={paymentMethod === 'seva'}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
          />
          Pay with Seva Tokens
        </label>
        
        <label>
          <input
            type="radio"
            value="free"
            checked={paymentMethod === 'free'}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
          />
          Free (Donation)
        </label>
      </div>

      {paymentMethod === 'money' && (
        <RazorpayCheckout
          amount={total}
          orderId={order.id}
          onSuccess={() => {
            // Redirect to success page
            navigate('/order-confirmation');
          }}
          onError={(error) => {
            // Show error message
            toast.error('Payment failed: ' + error.message);
          }}
        />
      )}

      {paymentMethod === 'seva' && (
        <button onClick={handleSevaPayment}>
          Pay with {sevaTokensRequired} Seva Tokens
        </button>
      )}

      {paymentMethod === 'free' && (
        <button onClick={handleFreeOrder}>
          Request as Donation
        </button>
      )}
    </div>
  );
}
```

---

## Direct UPI Integration

### Option A: UPI QR Code

```typescript
// Generate UPI QR code
import QRCode from 'qrcode';

export async function generateUPIQR(
  amount: number,
  orderId: string,
  upiId: string = 'sakshi@paytm'
) {
  const upiUrl = `upi://pay?pa=${upiId}&pn=Sakshi Platform&am=${amount}&cu=INR&tn=Order ${orderId}`;
  
  const qrCodeDataUrl = await QRCode.toDataURL(upiUrl);
  
  return qrCodeDataUrl;
}
```

### Option B: UPI Intent (Mobile)

```typescript
// Trigger UPI app on mobile
export function triggerUPIIntent(
  amount: number,
  orderId: string,
  upiId: string = 'sakshi@paytm'
) {
  const upiUrl = `upi://pay?pa=${upiId}&pn=Sakshi Platform&am=${amount}&cu=INR&tn=Order ${orderId}`;
  
  // Open UPI app
  window.location.href = upiUrl;
  
  // Poll for payment status
  const pollInterval = setInterval(async () => {
    const status = await checkPaymentStatus(orderId);
    if (status === 'paid') {
      clearInterval(pollInterval);
      // Redirect to success
    }
  }, 3000);
}
```

### UPI Component

```typescript
// client/src/components/UPIPayment.tsx
import { useState, useEffect } from 'react';
import { generateUPIQR } from '@/lib/upi';

export function UPIPayment({ amount, orderId }: { amount: number; orderId: string }) {
  const [qrCode, setQRCode] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    setIsMobile(/Android|iPhone/i.test(navigator.userAgent));
    
    // Generate QR code
    generateUPIQR(amount, orderId).then(setQRCode);
  }, [amount, orderId]);

  return (
    <div className="upi-payment">
      <h3>Pay with UPI</h3>
      
      {isMobile ? (
        <button
          onClick={() => triggerUPIIntent(amount, orderId)}
          className="btn-primary"
        >
          Pay ₹{amount} with UPI App
        </button>
      ) : (
        <div className="qr-code">
          <p>Scan QR code with any UPI app:</p>
          <img src={qrCode} alt="UPI QR Code" />
          <p className="text-sm text-gray-600">
            Google Pay, PhonePe, Paytm, BHIM, etc.
          </p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-4">
        After payment, it may take a few moments to confirm.
      </p>
    </div>
  );
}
```

---

## Cryptocurrency Integration

### Using Coinbase Commerce

#### Step 1: Create Coinbase Commerce Account

1. Visit [Coinbase Commerce](https://commerce.coinbase.com)
2. Sign up
3. Complete verification

#### Step 2: Get API Key

1. Go to **Settings** → **API Keys**
2. Create new API key
3. Save the key

#### Step 3: Install SDK

```bash
pnpm add coinbase-commerce-node
```

#### Step 4: Implement Backend

```typescript
// server/routers/crypto.ts
import { Client, resources } from 'coinbase-commerce-node';

Client.init(process.env.COINBASE_COMMERCE_API_KEY!);

export const cryptoRouter = router({
  createCharge: protectedProcedure
    .input(z.object({
      amount: z.number(),
      orderId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const chargeData = {
        name: 'Sakshi Order',
        description: `Order #${input.orderId}`,
        local_price: {
          amount: input.amount.toString(),
          currency: 'USD',
        },
        pricing_type: 'fixed_price',
        metadata: {
          order_id: input.orderId,
        },
      };

      const charge = await resources.Charge.create(chargeData);

      return {
        id: charge.id,
        hosted_url: charge.hosted_url,
        addresses: charge.addresses,
      };
    }),
});
```

#### Step 5: Frontend Component

```typescript
// client/src/components/CryptoPayment.tsx
export function CryptoPayment({ amount, orderId }: { amount: number; orderId: string }) {
  const createCharge = trpc.crypto.createCharge.useMutation();

  const handleCryptoPayment = async () => {
    const charge = await createCharge.mutateAsync({ amount, orderId });
    
    // Redirect to Coinbase Commerce hosted page
    window.location.href = charge.hosted_url;
  };

  return (
    <button onClick={handleCryptoPayment} className="btn-primary">
      Pay with Crypto (BTC, ETH, USDC)
    </button>
  );
}
```

---

## Testing Payments

### Razorpay Test Mode

**Test Cards:**

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| 4111 1111 1111 1111 | 123 | Any future | Success |
| 4012 0010 3714 1112 | 123 | Any future | Success (3D Secure) |
| 5555 5555 5555 4444 | 123 | Any future | Failure |

**Test UPI:**
- UPI ID: `success@razorpay`
- PIN: Any 4-6 digits

**Test Netbanking:**
- Select any bank
- Use credentials: `test` / `test`

### Testing Workflow

1. **Create Test Order**
   ```bash
   # In your app
   # Add items to cart
   # Go to checkout
   # Select "Pay with Money"
   ```

2. **Complete Payment**
   ```bash
   # Use test card details
   # Complete payment
   # Verify order status changes to "paid"
   ```

3. **Check Database**
   ```bash
   # Verify order record updated
   # Check payment ID stored
   # Confirm timestamp recorded
   ```

4. **Test Webhooks**
   ```bash
   # Trigger test webhook from Razorpay dashboard
   # Verify your endpoint receives it
   # Check order status updated
   ```

---

## Webhook Configuration

### Razorpay Webhooks

#### Step 1: Create Webhook Endpoint

```typescript
// server/webhooks/razorpay.ts
import express from 'express';
import crypto from 'crypto';

export const razorpayWebhookRouter = express.Router();

razorpayWebhookRouter.post('/webhooks/razorpay', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = req.body.toString();

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(body);

    // Handle different events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
    }

    res.json({ received: true });
  }
);

async function handlePaymentCaptured(payment: any) {
  // Update order status
  await db.update(orders)
    .set({ status: 'paid', paymentId: payment.id })
    .where(eq(orders.razorpayOrderId, payment.order_id));
  
  // Send confirmation email
  await sendOrderConfirmationEmail(payment.order_id);
}
```

#### Step 2: Configure Webhook in Razorpay

1. Go to **Settings** → **Webhooks**
2. Click **"Add Webhook"**
3. URL: `https://your-domain.com/webhooks/razorpay`
4. Secret: Generate and save in `.env`
5. Events: Select:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
6. Click **"Create Webhook"**

---

## Security Best Practices

### API Keys

- ✅ Never expose secret keys in frontend
- ✅ Use environment variables
- ✅ Rotate keys regularly
- ✅ Use test keys in development

### Payment Verification

- ✅ Always verify signatures
- ✅ Validate amounts on backend
- ✅ Check order status before fulfillment
- ✅ Log all payment attempts

### PCI Compliance

- ✅ Never store card details
- ✅ Use Razorpay's hosted checkout
- ✅ Implement HTTPS
- ✅ Follow security guidelines

---

## Error Handling

```typescript
// Handle payment errors gracefully
try {
  const order = await createRazorpayOrder(amount, orderId);
  // ... proceed with payment
} catch (error) {
  if (error.code === 'BAD_REQUEST_ERROR') {
    toast.error('Invalid payment details');
  } else if (error.code === 'GATEWAY_ERROR') {
    toast.error('Payment gateway error. Please try again.');
  } else {
    toast.error('Payment failed. Please contact support.');
    // Log error to Sentry
    Sentry.captureException(error);
  }
}
```

---

## Cost Estimation

### Razorpay Pricing

- **Domestic Cards**: 2% + GST
- **International Cards**: 3% + GST
- **UPI**: 2% + GST (capped at ₹3000)
- **Netbanking**: 2% + GST
- **Wallets**: 2% + GST

**Example**: ₹1000 order = ₹20 + ₹3.6 GST = ₹23.6 fee

### Coinbase Commerce

- **Transaction Fee**: 1%
- **No monthly fees**
- **Instant settlements**

---

## Checklist

### Razorpay ✅
- [ ] Account created
- [ ] KYC completed (for live mode)
- [ ] API keys obtained
- [ ] SDK installed
- [ ] Backend integration complete
- [ ] Frontend component created
- [ ] Test payments successful
- [ ] Webhooks configured
- [ ] Error handling implemented

### UPI ✅
- [ ] QR code generation working
- [ ] Mobile intent working
- [ ] Payment verification implemented
- [ ] Tested on mobile devices

### Cryptocurrency ✅
- [ ] Coinbase Commerce account created
- [ ] API key obtained
- [ ] Integration implemented
- [ ] Test transaction completed

---

## Next Steps

After implementing payments:

1. ✅ **Test thoroughly** with all payment methods
2. ✅ **Set up monitoring** for failed payments
3. ✅ **Implement refunds** workflow
4. ✅ **Add payment analytics** tracking
5. ✅ **Configure email notifications** for payments
6. ✅ **Set up AI chatbot** (next phase)

---

*For external services, see `EXTERNAL_SERVICES_GUIDE.md`*  
*For deployment, see `RAILWAY_DEPLOYMENT_GUIDE.md`*  
*For testing, see `LOCAL_DEVELOPMENT_GUIDE.md`*
