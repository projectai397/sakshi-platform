# Sakshi Platform - Email Notifications & Analytics Guide

## Overview

This guide walks you through implementing email notifications and analytics tracking for the Sakshi platform.

**Features Covered:**
- 📧 Transactional Emails (Order confirmations, etc.)
- 🎫 Seva Token Notifications
- 📊 Google Analytics Integration
- 📈 PostHog Product Analytics
- 📉 Custom Event Tracking

**Estimated Time**: 1-2 hours

---

## Table of Contents

1. [Email Notifications Setup](#email-notifications-setup)
2. [Email Templates](#email-templates)
3. [Google Analytics Integration](#google-analytics-integration)
4. [PostHog Analytics](#posthog-analytics)
5. [Custom Event Tracking](#custom-event-tracking)

---

## Email Notifications Setup

### Install Dependencies

```bash
cd /home/ubuntu/sakshi
pnpm add nodemailer @react-email/components @react-email/render
```

### Configure Email Service

Already covered in `EXTERNAL_SERVICES_GUIDE.md`. Ensure you have:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=Sakshi Platform <noreply@sakshi.org>
```

### Create Email Service

```typescript
// server/lib/email.ts
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Send email function
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      text,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready');
    return true;
  } catch (error) {
    console.error('❌ Email server error:', error);
    return false;
  }
}
```

---

## Email Templates

### Order Confirmation Email

```typescript
// server/emails/OrderConfirmation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  total,
  paymentMethod,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Sakshi order #{orderNumber} is confirmed 🙏</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://your-domain.com/logo.png"
            width="150"
            height="50"
            alt="Sakshi Platform"
            style={logo}
          />
          
          <Heading style={h1}>Order Confirmed!</Heading>
          
          <Text style={text}>
            Namaste {customerName},
          </Text>
          
          <Text style={text}>
            Thank you for your order. We're preparing your items with care and gratitude. 🙏
          </Text>
          
          <Section style={orderInfo}>
            <Text style={orderNumber}>Order #{orderNumber}</Text>
            <Text style={orderDate}>
              {new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Section>
          
          <Section style={itemsSection}>
            <Heading as="h2" style={h2}>Order Items</Heading>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <Text style={itemName}>{item.name}</Text>
                <Text style={itemDetails}>
                  Qty: {item.quantity} × ₹{item.price}
                </Text>
              </div>
            ))}
            
            <div style={totalRow}>
              <Text style={totalLabel}>Total:</Text>
              <Text style={totalAmount}>₹{total}</Text>
            </div>
          </Section>
          
          <Section style={addressSection}>
            <Heading as="h2" style={h2}>Shipping Address</Heading>
            <Text style={address}>{shippingAddress}</Text>
          </Section>
          
          <Section style={paymentSection}>
            <Text style={paymentInfo}>
              Payment Method: <strong>{paymentMethod}</strong>
            </Text>
          </Section>
          
          <Section style={ctaSection}>
            <Link
              href={`https://your-domain.com/orders/${orderNumber}`}
              style={button}
            >
              Track Your Order
            </Link>
          </Section>
          
          <Text style={footer}>
            With gratitude,<br />
            The Sakshi Team 🌿
          </Text>
          
          <Text style={footerSmall}>
            Questions? Reply to this email or visit our{' '}
            <Link href="https://your-domain.com/help">Help Center</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 40px',
};

const orderInfo = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '20px 40px',
  padding: '20px',
  textAlign: 'center' as const,
};

const orderNumber = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
};

const orderDate = {
  color: '#666',
  fontSize: '14px',
  margin: '8px 0 0',
};

const itemsSection = {
  margin: '20px 40px',
};

const itemRow = {
  borderBottom: '1px solid #eee',
  padding: '12px 0',
  display: 'flex',
  justifyContent: 'space-between',
};

const itemName = {
  fontSize: '16px',
  margin: '0',
};

const itemDetails = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
};

const totalRow = {
  borderTop: '2px solid #333',
  padding: '16px 0',
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '12px',
};

const totalLabel = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const totalAmount = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#8B5CF6',
  margin: '0',
};

const addressSection = {
  margin: '20px 40px',
};

const address = {
  backgroundColor: '#f9fafb',
  borderRadius: '4px',
  padding: '12px',
  fontSize: '14px',
  lineHeight: '20px',
};

const paymentSection = {
  margin: '20px 40px',
};

const paymentInfo = {
  fontSize: '14px',
  color: '#666',
};

const ctaSection = {
  margin: '32px 40px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#8B5CF6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 40px 16px',
};

const footerSmall = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 40px',
  textAlign: 'center' as const,
};
```

### Seva Token Notification Email

```typescript
// server/emails/SevaTokenNotification.tsx
export function SevaTokenNotificationEmail({
  userName,
  amount,
  type,
  description,
  newBalance,
}: {
  userName: string;
  amount: number;
  type: 'earned' | 'spent';
  description: string;
  newBalance: number;
}) {
  return (
    <Html>
      <Head />
      <Preview>
        {type === 'earned' 
          ? `You earned ${amount} seva tokens! 🎉`
          : `You spent ${amount} seva tokens`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src="https://your-domain.com/logo.png" width="150" height="50" alt="Sakshi" style={logo} />
          
          <Heading style={h1}>
            {type === 'earned' ? '🎉 Seva Tokens Earned!' : '✨ Seva Tokens Used'}
          </Heading>
          
          <Text style={text}>Namaste {userName},</Text>
          
          <Section style={tokenBox}>
            <Text style={tokenAmount}>
              {type === 'earned' ? '+' : '-'}{amount}
            </Text>
            <Text style={tokenLabel}>Seva Tokens</Text>
          </Section>
          
          <Text style={description}>{description}</Text>
          
          <Section style={balanceSection}>
            <Text style={balanceLabel}>New Balance:</Text>
            <Text style={balanceAmount}>{newBalance} tokens</Text>
          </Section>
          
          {type === 'earned' && (
            <Section style={ctaSection}>
              <Link href="https://your-domain.com/shop" style={button}>
                Shop with Seva Tokens
              </Link>
            </Section>
          )}
          
          <Text style={footer}>
            Keep spreading kindness! 🙏<br />
            The Sakshi Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Send Email Functions

```typescript
// server/lib/emailService.ts
import { render } from '@react-email/render';
import { sendEmail } from './email';
import { OrderConfirmationEmail } from '../emails/OrderConfirmation';
import { SevaTokenNotificationEmail } from '../emails/SevaTokenNotification';

export async function sendOrderConfirmation(order: any, user: any) {
  const html = render(
    OrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: user.name,
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
    })
  );

  await sendEmail({
    to: user.email,
    subject: `Order Confirmation #${order.orderNumber}`,
    html,
  });
}

export async function sendSevaTokenNotification(
  user: any,
  transaction: any
) {
  const html = render(
    SevaTokenNotificationEmail({
      userName: user.name,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      newBalance: transaction.newBalance,
    })
  );

  await sendEmail({
    to: user.email,
    subject: `Seva Tokens ${transaction.type === 'earned' ? 'Earned' : 'Used'}`,
    html,
  });
}
```

---

## Google Analytics Integration

### Step 1: Get Tracking ID

(Already covered in `EXTERNAL_SERVICES_GUIDE.md`)

```bash
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Step 2: Install Google Analytics

```typescript
// client/src/lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function initGoogleAnalytics() {
  const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
  
  if (!GA_ID) {
    console.warn('Google Analytics ID not configured');
    return;
  }

  // Load GA script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
      page_path: url,
    });
  }
}

// Track events
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
}

// Track e-commerce events
export function trackPurchase(order: any) {
  trackEvent('purchase', {
    transaction_id: order.orderNumber,
    value: order.total,
    currency: 'INR',
    items: order.items.map((item: any) => ({
      item_id: item.productId,
      item_name: item.product.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export function trackAddToCart(product: any) {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
    }],
  });
}
```

### Step 3: Initialize in App

```typescript
// client/src/main.tsx
import { initGoogleAnalytics } from './lib/analytics';

// Initialize analytics
initGoogleAnalytics();

// Track page views on route change
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './lib/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    // ... app content
  );
}
```

### Step 4: Track Custom Events

```typescript
// Track button clicks
<button
  onClick={() => {
    trackEvent('button_click', {
      button_name: 'shop_now',
      page: 'homepage',
    });
    navigate('/shop');
  }}
>
  Shop Now
</button>

// Track search
<input
  onKeyPress={(e) => {
    if (e.key === 'Enter') {
      trackEvent('search', {
        search_term: searchQuery,
      });
    }
  }}
/>

// Track seva token usage
trackEvent('seva_token_used', {
  amount: tokens,
  order_id: orderId,
});
```

---

## PostHog Analytics

### Step 1: Install PostHog

```bash
pnpm add posthog-js
```

### Step 2: Initialize PostHog

```typescript
// client/src/lib/posthog.ts
import posthog from 'posthog-js';

export function initPostHog() {
  const API_KEY = import.meta.env.VITE_POSTHOG_API_KEY;
  const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (!API_KEY) {
    console.warn('PostHog API key not configured');
    return;
  }

  posthog.init(API_KEY, {
    api_host: HOST,
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
  });
}

// Identify user
export function identifyUser(user: any) {
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

// Track custom events
export function trackPostHogEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  posthog.capture(eventName, properties);
}

// Feature flags
export function isFeatureEnabled(flag: string): boolean {
  return posthog.isFeatureEnabled(flag);
}
```

### Step 3: Track User Actions

```typescript
// Track feature usage
trackPostHogEvent('feature_used', {
  feature: 'seva_wallet',
  action: 'view_balance',
});

// Track A/B test variants
if (isFeatureEnabled('new_checkout_flow')) {
  // Show new checkout
  trackPostHogEvent('ab_test_variant', {
    test: 'checkout_flow',
    variant: 'new',
  });
} else {
  // Show old checkout
  trackPostHogEvent('ab_test_variant', {
    test: 'checkout_flow',
    variant: 'old',
  });
}
```

---

## Custom Event Tracking

### Define Custom Events

```typescript
// client/src/lib/events.ts
export const Events = {
  // User events
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  
  // Shopping events
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  CART_VIEWED: 'cart_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  ORDER_COMPLETED: 'order_completed',
  
  // Seva token events
  SEVA_TOKENS_EARNED: 'seva_tokens_earned',
  SEVA_TOKENS_SPENT: 'seva_tokens_spent',
  SEVA_WALLET_VIEWED: 'seva_wallet_viewed',
  
  // Engagement events
  CHATBOT_OPENED: 'chatbot_opened',
  CHATBOT_MESSAGE_SENT: 'chatbot_message_sent',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  
  // Content events
  RETREAT_VIEWED: 'retreat_viewed',
  CAFE_VIEWED: 'cafe_viewed',
  BLOG_POST_READ: 'blog_post_read',
};

// Track function
export function track(
  eventName: string,
  properties?: Record<string, any>
) {
  // Send to all analytics platforms
  trackEvent(eventName, properties); // Google Analytics
  trackPostHogEvent(eventName, properties); // PostHog
  
  // Log in development
  if (import.meta.env.DEV) {
    console.log('📊 Event:', eventName, properties);
  }
}
```

### Use Throughout App

```typescript
// Track product view
useEffect(() => {
  track(Events.PRODUCT_VIEWED, {
    product_id: product.id,
    product_name: product.name,
    category: product.category,
    price: product.price,
  });
}, [product]);

// Track checkout
const handleCheckout = () => {
  track(Events.CHECKOUT_STARTED, {
    cart_total: cartTotal,
    item_count: cartItems.length,
    payment_method: paymentMethod,
  });
  
  // Proceed with checkout
};

// Track seva tokens
const handleEarnTokens = (amount: number, source: string) => {
  track(Events.SEVA_TOKENS_EARNED, {
    amount,
    source,
    new_balance: newBalance,
  });
};
```

---

## Testing

### Test Email Sending

```bash
# In your app, trigger an order
# Check email inbox
# Verify email received and formatted correctly
```

### Test Analytics

```bash
# Open Google Analytics Real-Time view
# Navigate around your site
# See events appearing in real-time

# Check PostHog dashboard
# View user sessions
# Check event stream
```

---

## Monitoring & Debugging

### Email Delivery Monitoring

```typescript
// Log email sends
export async function sendEmail(options: any) {
  try {
    const result = await transporter.sendMail(options);
    
    // Log success
    await db.insert(emailLogs).values({
      to: options.to,
      subject: options.subject,
      status: 'sent',
      messageId: result.messageId,
      sentAt: new Date(),
    });
    
    return result;
  } catch (error) {
    // Log failure
    await db.insert(emailLogs).values({
      to: options.to,
      subject: options.subject,
      status: 'failed',
      error: error.message,
      sentAt: new Date(),
    });
    
    throw error;
  }
}
```

### Analytics Debugging

```typescript
// Enable debug mode in development
if (import.meta.env.DEV) {
  window.gtag('config', GA_ID, {
    debug_mode: true,
  });
  
  posthog.debug();
}
```

---

## Checklist

### Email Notifications ✅
- [ ] SMTP configured
- [ ] Email templates created
- [ ] Order confirmation emails working
- [ ] Seva token notifications working
- [ ] Email delivery monitored

### Analytics ✅
- [ ] Google Analytics configured
- [ ] PostHog configured
- [ ] Page views tracked
- [ ] Custom events tracked
- [ ] E-commerce events tracked
- [ ] User identification working

---

## Next Steps

1. ✅ **Add more email templates** (password reset, welcome, etc.)
2. ✅ **Set up email campaigns** (newsletters)
3. ✅ **Create analytics dashboards**
4. ✅ **Implement A/B testing**
5. ✅ **Add design customizations** (next phase)

---

*For AI features, see `AI_CHATBOT_GUIDE.md`*  
*For payment integration, see `PAYMENT_INTEGRATION_GUIDE.md`*  
*For external services, see `EXTERNAL_SERVICES_GUIDE.md`*
