# Sakshi Platform - Feature Development Plan

## Overview

This document outlines new features and integrations to enhance the Sakshi platform beyond its current capabilities.

---

## Phase 4A: Payment Integrations

### 1. Razorpay Integration (Indian Payments)

**Purpose**: Enable online payments for products and donations

**Implementation**:

```typescript
// server/routers/payment.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export const paymentRouter = router({
  createOrder: publicProcedure
    .input(z.object({
      amount: z.number(),
      currency: z.string().default('INR'),
      orderId: z.string()
    }))
    .mutation(async ({ input }) => {
      const order = await razorpay.orders.create({
        amount: input.amount * 100, // Convert to paise
        currency: input.currency,
        receipt: input.orderId,
        notes: {
          order_id: input.orderId
        }
      });
      
      return { orderId: order.id, amount: order.amount };
    }),
    
  verifyPayment: publicProcedure
    .input(z.object({
      razorpay_order_id: z.string(),
      razorpay_payment_id: z.string(),
      razorpay_signature: z.string()
    }))
    .mutation(async ({ input }) => {
      // Verify signature
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`);
      const generated_signature = hmac.digest('hex');
      
      if (generated_signature === input.razorpay_signature) {
        // Payment verified, update order status
        return { success: true };
      }
      
      throw new Error('Payment verification failed');
    })
});
```

**Frontend Integration**:

```tsx
// client/src/components/RazorpayCheckout.tsx
import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';

export default function RazorpayCheckout({ amount, orderId }: Props) {
  const createOrder = trpc.payment.createOrder.useMutation();
  const verifyPayment = trpc.payment.verifyPayment.useMutation();
  
  const handlePayment = async () => {
    const order = await createOrder.mutateAsync({ amount, orderId });
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'Sakshi Platform',
      description: 'Purchase from Sakshi',
      order_id: order.orderId,
      handler: async (response: any) => {
        await verifyPayment.mutateAsync(response);
        // Show success message
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      },
      theme: {
        color: '#8BC34A' // Sage green
      }
    };
    
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };
  
  return (
    <button onClick={handlePayment} className="ghibli-button">
      Pay with Razorpay
    </button>
  );
}
```

### 2. UPI Payment Integration

**Purpose**: Direct UPI payments for Indian users

**Implementation**:

```tsx
// client/src/components/UPIPayment.tsx
export default function UPIPayment({ amount, orderId }: Props) {
  const upiId = 'sakshi@upi'; // Your UPI ID
  const upiLink = `upi://pay?pa=${upiId}&pn=Sakshi&am=${amount}&cu=INR&tn=Order ${orderId}`;
  
  return (
    <div className="ghibli-card p-6">
      <h3 className="font-bold mb-4">Pay with UPI</h3>
      
      {/* QR Code */}
      <div className="mb-4">
        <QRCode value={upiLink} size={200} />
      </div>
      
      {/* UPI Apps */}
      <div className="grid grid-cols-3 gap-4">
        <a href={`gpay://upi/pay?${upiLink}`} className="btn">
          Google Pay
        </a>
        <a href={`phonepe://pay?${upiLink}`} className="btn">
          PhonePe
        </a>
        <a href={`paytmmp://pay?${upiLink}`} className="btn">
          Paytm
        </a>
      </div>
      
      {/* Manual UPI ID */}
      <div className="mt-4">
        <p className="text-sm">Or pay to UPI ID:</p>
        <code className="bg-gray-100 px-2 py-1 rounded">{upiId}</code>
      </div>
    </div>
  );
}
```

### 3. Crypto Wallet Integration

**Purpose**: Accept cryptocurrency donations

**Implementation**:

```tsx
// client/src/components/CryptoPayment.tsx
import { useState } from 'react';

export default function CryptoPayment({ amount }: Props) {
  const wallets = {
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    USDT: 'TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS'
  };
  
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  
  return (
    <div className="ghibli-card p-6">
      <h3 className="font-bold mb-4">Pay with Cryptocurrency</h3>
      
      {/* Crypto Selection */}
      <div className="flex gap-2 mb-4">
        {Object.keys(wallets).map(crypto => (
          <button
            key={crypto}
            onClick={() => setSelectedCrypto(crypto)}
            className={`px-4 py-2 rounded ${
              selectedCrypto === crypto ? 'bg-sage-green text-white' : 'bg-gray-200'
            }`}
          >
            {crypto}
          </button>
        ))}
      </div>
      
      {/* Wallet Address */}
      <div className="mb-4">
        <QRCode value={wallets[selectedCrypto]} size={200} />
      </div>
      
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-sm font-mono break-all">
          {wallets[selectedCrypto]}
        </p>
        <button 
          onClick={() => navigator.clipboard.writeText(wallets[selectedCrypto])}
          className="text-sm text-sage-green mt-2"
        >
          Copy Address
        </button>
      </div>
    </div>
  );
}
```

---

## Phase 4B: AI-Powered Features

### 1. Smart Product Search

**Purpose**: Natural language product search with AI

**Implementation**:

```typescript
// server/routers/ai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const aiRouter = router({
  smartSearch: publicProcedure
    .input(z.object({
      query: z.string()
    }))
    .query(async ({ input, ctx }) => {
      // Generate embedding for search query
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: input.query
      });
      
      // Search products using vector similarity
      const products = await ctx.db.query.products.findMany({
        // Vector similarity search
        // This requires pgvector extension in PostgreSQL
      });
      
      return products;
    }),
    
  productRecommendations: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      // Get user's purchase history
      const orders = await ctx.db.query.orders.findMany({
        where: eq(orders.userId, userId)
      });
      
      // Use AI to recommend similar products
      const recommendations = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: 'You are a product recommendation assistant for a thrift store.'
        }, {
          role: 'user',
          content: `Based on these purchases: ${JSON.stringify(orders)}, recommend 5 similar products.`
        }]
      });
      
      return recommendations;
    })
});
```

### 2. AI Chatbot for Customer Support

**Purpose**: 24/7 automated customer support

**Implementation**:

```tsx
// client/src/components/AIChatbot.tsx
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function AIChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const sendMessage = trpc.ai.chat.useMutation();
  
  const handleSend = async () => {
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    
    const response = await sendMessage.mutateAsync({
      messages: [...messages, userMessage]
    });
    
    setMessages([...messages, userMessage, response]);
    setInput('');
  };
  
  return (
    <div className="fixed bottom-20 right-20 w-96 h-[500px] ghibli-card flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-bold">Sakshi Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              msg.role === 'user' 
                ? 'bg-sage-green text-white ml-auto' 
                : 'bg-gray-100'
            } max-w-[80%]`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button onClick={handleSend} className="ghibli-button">
          Send
        </button>
      </div>
    </div>
  );
}
```

### 3. Image Recognition for Product Uploads

**Purpose**: Automatically categorize and tag products from images

**Implementation**:

```typescript
// server/routers/ai.ts
analyzeProductImage: protectedProcedure
  .input(z.object({
    imageUrl: z.string()
  }))
  .mutation(async ({ input }) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this product image and provide: category, condition, suggested price range, and description.' },
          { type: 'image_url', image_url: { url: input.imageUrl } }
        ]
      }]
    });
    
    return JSON.parse(response.choices[0].message.content);
  })
```

---

## Phase 4C: Email Notifications

### 1. Order Confirmation Emails

**Implementation**:

```typescript
// server/services/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export async function sendOrderConfirmation(order: Order) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: order.user.email,
    subject: `Order Confirmation #${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8BC34A;">Thank you for your order!</h1>
        <p>Your order #${order.orderNumber} has been confirmed.</p>
        
        <h2>Order Details</h2>
        <ul>
          ${order.items.map(item => `
            <li>${item.product.name} - ₹${item.price}</li>
          `).join('')}
        </ul>
        
        <p><strong>Total: ₹${order.total}</strong></p>
        
        <p>We'll notify you when your order is ready for pickup.</p>
        
        <p style="color: #666; font-size: 12px;">
          Sakshi Platform - Witnessing every journey 🌿
        </p>
      </div>
    `
  });
}
```

### 2. Seva Token Notifications

```typescript
export async function sendSevaTokenEarned(user: User, amount: number, source: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: `You earned ${amount} Seva Tokens!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8BC34A;">✨ Seva Tokens Earned!</h1>
        <p>Congratulations! You've earned <strong>${amount} Seva Tokens</strong> from ${source}.</p>
        
        <p>Your new balance: <strong>${user.sevaWallet.balance} tokens</strong></p>
        
        <p>Use your tokens to shop, attend retreats, or enjoy our cafés!</p>
        
        <a href="${process.env.APP_URL}/seva-wallet" style="display: inline-block; background: #8BC34A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          View Seva Wallet
        </a>
      </div>
    `
  });
}
```

---

## Phase 4D: Analytics & Tracking

### 1. Google Analytics Integration

```tsx
// client/src/lib/analytics.ts
export const initGA = () => {
  const gaId = import.meta.env.VITE_GA_ID;
  if (!gaId) return;
  
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', gaId);
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag === 'undefined') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

// Usage
trackEvent('purchase', 'ecommerce', 'Product Name', 299);
trackEvent('seva_earned', 'engagement', 'Volunteering', 5);
```

### 2. PostHog Integration (Product Analytics)

```tsx
// client/src/lib/posthog.ts
import posthog from 'posthog-js';

export const initPostHog = () => {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;
  if (!apiKey) return;
  
  posthog.init(apiKey, {
    api_host: 'https://app.posthog.com',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true
  });
};

export const identifyUser = (userId: string, traits: Record<string, any>) => {
  posthog.identify(userId, traits);
};

export const trackFeature = (feature: string, properties?: Record<string, any>) => {
  posthog.capture(feature, properties);
};

// Usage
trackFeature('product_viewed', { productId: '123', category: 'clothing' });
trackFeature('seva_wallet_opened', { balance: 50 });
```

---

## Phase 4E: Social Features

### 1. Social Sharing

```tsx
// client/src/components/SocialShare.tsx
export default function SocialShare({ url, title, description }: Props) {
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };
  
  return (
    <div className="flex gap-2">
      {Object.entries(shareLinks).map(([platform, link]) => (
        <a
          key={platform}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded hover-lift"
        >
          <Icon name={platform} />
        </a>
      ))}
    </div>
  );
}
```

### 2. Product Reviews & Ratings

```typescript
// server/db/schema.ts
export const reviews = mysqlTable('reviews', {
  id: serial('id').primaryKey(),
  productId: int('product_id').notNull(),
  userId: int('user_id').notNull(),
  rating: int('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow()
});

// server/routers/reviews.ts
export const reviewsRouter = router({
  create: protectedProcedure
    .input(z.object({
      productId: z.number(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.insert(reviews).values({
        ...input,
        userId: ctx.user.id
      });
    }),
    
  getByProduct: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.reviews.findMany({
        where: eq(reviews.productId, input.productId),
        with: { user: true }
      });
    })
});
```

---

## Implementation Priority

### High Priority (Implement First)
1. ✅ Payment integrations (Razorpay, UPI)
2. ✅ Email notifications
3. ✅ Analytics tracking
4. ✅ Social sharing

### Medium Priority (Implement Next)
1. ✅ AI chatbot
2. ✅ Product reviews
3. ✅ Smart search
4. ✅ Crypto payments

### Low Priority (Future Enhancement)
1. ⏳ Image recognition
2. ⏳ AI recommendations
3. ⏳ Advanced analytics dashboard
4. ⏳ Social login (Google, Facebook)

---

## Testing Checklist

- [ ] Payment flow (test mode)
- [ ] Email delivery
- [ ] Analytics events
- [ ] AI responses
- [ ] Social sharing links
- [ ] Review submission
- [ ] Mobile responsiveness
- [ ] Error handling

---

## Security Considerations

1. **Payment Security**
   - Use HTTPS only
   - Validate all inputs
   - Verify payment signatures
   - Store no card details

2. **API Keys**
   - Never expose in frontend
   - Use environment variables
   - Rotate regularly
   - Limit permissions

3. **User Data**
   - Encrypt sensitive data
   - GDPR compliance
   - Data retention policies
   - User consent for emails

---

*For deployment, see `DEPLOYMENT_PLATFORMS.md`*  
*For environment setup, see `ENVIRONMENT_SETUP.md`*  
*For testing, see next phase documentation*
