# Sakshi Cafe Payment Integration Guide

## Overview

This guide explains how payment processing is integrated into Sakshi Cafe for orders, cooking classes, and meal subscriptions.

**Payment Methods Supported:**
1. Razorpay (Credit/Debit Cards, UPI, Net Banking)
2. Seva Tokens (Platform currency)
3. Request Free (Dignity-centered, no payment required)

---

## Architecture

### Payment Flow

```
User selects item → Chooses pricing tier → Initiates payment
    ↓
Creates Razorpay order (backend)
    ↓
Opens Razorpay checkout (frontend)
    ↓
User completes payment
    ↓
Razorpay callback with payment details
    ↓
Verify payment signature (backend)
    ↓
Update order/registration status
    ↓
Send confirmation (email/notification)
```

### Components

**Frontend:**
- `CafePayment.tsx` - Payment component
- Razorpay SDK integration
- Seva token redemption UI

**Backend:**
- `payments.ts` - Payment API routes
- Razorpay order creation
- Payment verification
- Seva token management

---

## Setup Instructions

### 1. Get Razorpay Credentials

1. Sign up at [Razorpay](https://razorpay.com)
2. Navigate to Settings → API Keys
3. Generate Test/Live API keys
4. Note down Key ID and Key Secret

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# For production
# RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
# RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

### 3. Install Dependencies

```bash
# Install Razorpay SDK (if not already installed)
pnpm add razorpay

# Install types
pnpm add -D @types/razorpay
```

### 4. Update Payment Router

The payment router is already created at `server/routes/cafe/payments.ts`. You need to:

1. **Import Razorpay SDK:**

```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
```

2. **Update createPayment mutation:**

```typescript
createPayment: protectedProcedure
  .input(...)
  .mutation(async ({ input, ctx }) => {
    // Create actual Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(input.amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `cafe_${input.type}_${input.orderId || input.classId}`,
      notes: {
        userId: ctx.user.id,
        type: input.type,
        priceTier: input.priceTier,
      },
    });

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID!,
    };
  }),
```

---

## Usage

### For Cafe Orders

```typescript
import { CafePayment } from '@/components/cafe/CafePayment';

function OrderCheckout() {
  const [orderId, setOrderId] = useState<number>();
  const [amount, setAmount] = useState(0);
  const [priceTier, setPriceTier] = useState<'community' | 'fair' | 'supporter'>('fair');

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // Redirect to order confirmation
    router.push(`/cafe/orders/${orderId}`);
  };

  return (
    <div>
      <h2>Complete Your Order</h2>
      <CafePayment
        orderId={orderId}
        amount={amount}
        priceTier={priceTier}
        type="order"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
```

### For Cooking Classes

```typescript
import { CafePayment } from '@/components/cafe/CafePayment';

function ClassRegistration() {
  const [classId, setClassId] = useState<number>();
  const [amount, setAmount] = useState(0);
  const [priceTier, setPriceTier] = useState<'community' | 'fair' | 'supporter'>('fair');

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Registration successful:', paymentId);
    // Show confirmation
    toast.success('Successfully registered for class!');
  };

  return (
    <div>
      <h2>Register for Class</h2>
      <CafePayment
        classId={classId}
        amount={amount}
        priceTier={priceTier}
        type="class"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
```

### For Meal Subscriptions

```typescript
import { CafePayment } from '@/components/cafe/CafePayment';

function SubscriptionCheckout() {
  const [amount, setAmount] = useState(0);
  const [priceTier, setPriceTier] = useState<'community' | 'fair' | 'supporter'>('fair');

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Subscription activated:', paymentId);
    // Activate subscription
  };

  return (
    <div>
      <h2>Subscribe to Meal Plan</h2>
      <CafePayment
        amount={amount}
        priceTier={priceTier}
        type="subscription"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
```

---

## API Endpoints

### Create Payment

**Endpoint:** `cafe.payments.createPayment`

**Input:**
```typescript
{
  orderId?: number;
  classId?: number;
  amount: number;
  priceTier: 'community' | 'fair' | 'supporter';
  type: 'order' | 'class' | 'subscription';
}
```

**Output:**
```typescript
{
  id: string;          // Razorpay order ID
  amount: number;      // Amount in paise
  currency: string;    // 'INR'
  keyId: string;       // Razorpay key ID
}
```

### Verify Payment

**Endpoint:** `cafe.payments.verifyPayment`

**Input:**
```typescript
{
  orderId: string;           // Razorpay order ID
  paymentId: string;         // Razorpay payment ID
  signature: string;         // Razorpay signature
  sakshiOrderId?: number;    // Sakshi order ID
  classId?: number;          // Class ID
  type: 'order' | 'class' | 'subscription';
}
```

**Output:**
```typescript
{
  success: boolean;
  paymentId: string;
}
```

### Redeem Seva Tokens

**Endpoint:** `cafe.payments.redeemSevaTokens`

**Input:**
```typescript
{
  orderId?: number;
  classId?: number;
  amount: number;
  tokensToRedeem: number;
  type: 'order' | 'class' | 'subscription';
}
```

**Output:**
```typescript
{
  success: boolean;
  tokensRedeemed: number;
  remainingBalance: number;
}
```

### Get Payment History

**Endpoint:** `cafe.payments.getPaymentHistory`

**Input:**
```typescript
{
  limit?: number;    // Default: 20
  offset?: number;   // Default: 0
}
```

**Output:**
```typescript
Array<{
  id: number;
  userId: number;
  orderType: string;
  total: string;
  paymentStatus: string;
  paymentId: string;
  createdAt: Date;
}>
```

---

## Seva Token Integration

### How Seva Tokens Work

1. **Earning Tokens:**
   - Attend cooking class: 20 tokens
   - Submit approved recipe: 25 tokens
   - Write detailed review: 5 tokens
   - Volunteer at cafe: 50 tokens/hour

2. **Redemption Rate:**
   - 1 token = ₹1 discount

3. **Usage:**
   - Can be used for any cafe order
   - Can be used for class registration
   - Can be used for subscriptions
   - Cannot be combined with community tier (already subsidized)

### Implementation

**TODO:** Complete Seva token implementation

1. Create Seva wallet table
2. Add token earning triggers
3. Implement token redemption logic
4. Add token balance display
5. Create token transaction history

---

## Testing

### Test Mode

Razorpay provides test cards for testing:

**Test Cards:**
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

### Test Flow

1. **Create Test Order:**
   ```bash
   curl -X POST http://localhost:5000/api/trpc/cafe.payments.createPayment \
     -H "Content-Type: application/json" \
     -d '{
       "orderId": 1,
       "amount": 250,
       "priceTier": "fair",
       "type": "order"
     }'
   ```

2. **Complete Payment:**
   - Use Razorpay checkout with test card
   - Complete payment flow

3. **Verify Payment:**
   - Check order status updated to "paid"
   - Check payment ID stored
   - Check order status updated to "confirmed"

### Integration Tests

```typescript
describe('Cafe Payment Integration', () => {
  it('should create Razorpay order', async () => {
    const result = await trpc.cafe.payments.createPayment.mutate({
      orderId: 1,
      amount: 250,
      priceTier: 'fair',
      type: 'order',
    });

    expect(result.id).toBeDefined();
    expect(result.amount).toBe(25000); // 250 * 100
    expect(result.currency).toBe('INR');
  });

  it('should verify payment signature', async () => {
    const result = await trpc.cafe.payments.verifyPayment.mutate({
      orderId: 'order_test123',
      paymentId: 'pay_test123',
      signature: 'valid_signature',
      sakshiOrderId: 1,
      type: 'order',
    });

    expect(result.success).toBe(true);
  });

  it('should redeem Seva tokens', async () => {
    const result = await trpc.cafe.payments.redeemSevaTokens.mutate({
      orderId: 1,
      amount: 100,
      tokensToRedeem: 50,
      type: 'order',
    });

    expect(result.success).toBe(true);
    expect(result.tokensRedeemed).toBe(50);
  });
});
```

---

## Security Considerations

### Payment Verification

**Always verify payments on the backend:**

1. **Signature Verification:**
   ```typescript
   const generatedSignature = crypto
     .createHmac('sha256', RAZORPAY_KEY_SECRET)
     .update(`${orderId}|${paymentId}`)
     .digest('hex');

   if (generatedSignature !== signature) {
     throw new Error('Invalid payment signature');
   }
   ```

2. **Amount Verification:**
   - Verify amount matches order total
   - Check for tampering
   - Validate currency

3. **User Authorization:**
   - Verify user owns the order
   - Check user is authenticated
   - Validate permissions

### Best Practices

1. **Never trust client-side data**
2. **Always verify on backend**
3. **Use HTTPS in production**
4. **Store API keys securely**
5. **Log all payment transactions**
6. **Handle failures gracefully**
7. **Send payment confirmations**

---

## Webhooks

### Setup Razorpay Webhooks

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events to listen:
   - payment.authorized
   - payment.captured
   - payment.failed
   - refund.created

### Webhook Handler

```typescript
// server/routes/webhooks/razorpay.ts
import { router, publicProcedure } from '../../_core/trpc';
import crypto from 'crypto';

export const razorpayWebhookRouter = router({
  handleWebhook: publicProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      // Verify webhook signature
      const signature = ctx.req.headers['x-razorpay-signature'];
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(input))
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new Error('Invalid webhook signature');
      }

      // Handle different events
      switch (input.event) {
        case 'payment.captured':
          // Update order status
          break;
        case 'payment.failed':
          // Handle failed payment
          break;
        case 'refund.created':
          // Process refund
          break;
      }

      return { success: true };
    }),
});
```

---

## Troubleshooting

### Common Issues

**Issue: Razorpay script not loading**

Solution:
```typescript
// Ensure script is loaded before opening checkout
if (!window.Razorpay) {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
  await new Promise((resolve) => {
    script.onload = resolve;
  });
}
```

**Issue: Payment verification fails**

Solution:
- Check RAZORPAY_KEY_SECRET is correct
- Verify signature calculation
- Check order ID and payment ID match

**Issue: Payment succeeds but order not updated**

Solution:
- Check database connection
- Verify order ID is correct
- Check for errors in verifyPayment mutation

---

## Next Steps

1. **Complete Razorpay SDK Integration**
   - Replace mock data with actual API calls
   - Add error handling
   - Implement retry logic

2. **Implement Seva Token System**
   - Create wallet table
   - Add earning logic
   - Implement redemption
   - Add transaction history

3. **Add Email Notifications**
   - Payment confirmation
   - Order receipt
   - Class registration confirmation

4. **Implement Refunds**
   - Refund API endpoint
   - Admin refund interface
   - Automatic refund for cancellations

5. **Add Payment Analytics**
   - Revenue tracking
   - Payment method distribution
   - Failed payment analysis

---

**Status**: ✅ Payment infrastructure ready  
**TODO**: Complete Razorpay SDK integration and Seva token system

**Last updated**: November 9, 2025
