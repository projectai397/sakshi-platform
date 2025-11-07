# Production Monitoring & Analytics Setup Guide

Complete guide for setting up monitoring, analytics, and observability for the Sakshi platform.

## Overview

This guide covers:
1. Application Performance Monitoring (APM)
2. Error Tracking
3. Analytics & User Behavior
4. Infrastructure Monitoring
5. Security Monitoring
6. Business Metrics Dashboard

## 1. Application Performance Monitoring

### Recommended: New Relic or Datadog

#### Setup with New Relic

```bash
# Install New Relic agent
pnpm add newrelic

# Create newrelic.js in project root
cp node_modules/newrelic/newrelic.js ./newrelic.js
```

**Configuration (`newrelic.js`):**

```javascript
exports.config = {
  app_name: ['Sakshi Platform'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  }
}
```

**Environment Variables:**

```bash
NEW_RELIC_LICENSE_KEY=your_license_key_here
NEW_RELIC_APP_NAME=Sakshi Platform
NEW_RELIC_LOG_LEVEL=info
```

**Import in server:**

```typescript
// Add as first line in server/_core/index.ts
import 'newrelic';
```

### Key Metrics to Monitor

- **Response Time:** Target < 200ms for API calls
- **Throughput:** Requests per minute
- **Error Rate:** Target < 0.1%
- **Apdex Score:** Target > 0.95
- **Database Query Time:** Target < 50ms
- **External API Calls:** Track all third-party services

## 2. Error Tracking

### Recommended: Sentry

#### Setup

```bash
# Install Sentry
pnpm add @sentry/node @sentry/tracing
```

**Configuration (`server/lib/sentry.ts`):**

```typescript
import * as Sentry from "@sentry/node";
import "@sentry/tracing";

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],
  });
}

export { Sentry };
```

**Environment Variables:**

```bash
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
SENTRY_ENVIRONMENT=production
```

**Usage in Express:**

```typescript
import { initSentry, Sentry } from './lib/sentry';

// Initialize Sentry
initSentry();

// Request handler (must be first)
app.use(Sentry.Handlers.requestHandler());

// Tracing handler
app.use(Sentry.Handlers.tracingHandler());

// Your routes here
// ...

// Error handler (must be last)
app.use(Sentry.Handlers.errorHandler());
```

### Error Categories to Track

- **Application Errors:** Uncaught exceptions, promise rejections
- **API Errors:** Failed external API calls
- **Database Errors:** Connection issues, query failures
- **Authentication Errors:** Login failures, token issues
- **Payment Errors:** Transaction failures
- **AI Model Errors:** ML prediction failures

## 3. Analytics & User Behavior

### Recommended: PostHog (Open Source) or Mixpanel

#### Setup with PostHog

```bash
# Install PostHog
pnpm add posthog-js posthog-node
```

**Frontend (`client/src/lib/analytics.ts`):**

```typescript
import posthog from 'posthog-js';

export function initAnalytics() {
  if (typeof window !== 'undefined') {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: 'https://app.posthog.com',
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  posthog.capture(eventName, properties);
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  posthog.identify(userId, traits);
}
```

**Backend (`server/lib/analytics.ts`):**

```typescript
import { PostHog } from 'posthog-node';

const posthog = new PostHog(
  process.env.POSTHOG_API_KEY!,
  { host: 'https://app.posthog.com' }
);

export function trackServerEvent(
  userId: string,
  eventName: string,
  properties?: Record<string, any>
) {
  posthog.capture({
    distinctId: userId,
    event: eventName,
    properties,
  });
}
```

**Environment Variables:**

```bash
VITE_POSTHOG_KEY=phc_your_project_api_key
POSTHOG_API_KEY=phc_your_project_api_key
```

### Key Events to Track

#### User Events
- `user_registered`
- `user_logged_in`
- `user_profile_updated`
- `seva_wallet_created`
- `sak_wallet_created`

#### Product Events
- `product_viewed`
- `product_searched`
- `visual_search_used`
- `product_added_to_cart`
- `product_purchased`
- `dpp_viewed`

#### Transaction Events
- `order_created`
- `payment_initiated`
- `payment_completed`
- `payment_failed`
- `seva_tokens_used`
- `sak_tokens_earned`

#### AI Events
- `ai_recommendation_shown`
- `ai_recommendation_clicked`
- `dynamic_pricing_applied`
- `fraud_detected`
- `quality_assessment_run`

#### Engagement Events
- `repair_request_submitted`
- `cafe_location_viewed`
- `retreat_enrolled`
- `volunteer_signup`

## 4. Infrastructure Monitoring

### Railway Built-in Monitoring

Railway provides basic metrics out of the box:
- CPU usage
- Memory usage
- Network traffic
- Deployment logs

**Access:** Railway Dashboard → Your Project → Metrics

### Additional: Uptime Monitoring with UptimeRobot

**Setup:**
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitors for:
   - Homepage: `https://your-domain.com`
   - API Health: `https://your-domain.com/api/health`
   - Admin Dashboard: `https://your-domain.com/admin`
3. Configure alerts (email, SMS, Slack)

**Recommended Check Intervals:**
- Critical endpoints: 1 minute
- Non-critical: 5 minutes

## 5. Security Monitoring

### Rate Limiting

Already implemented in `server/middleware/rate-limit.ts`

**Monitor:**
- Rate limit hits per endpoint
- IPs hitting rate limits frequently
- Suspicious patterns

### Audit Logging

**Create audit log table:**

```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(255),
  resource_type VARCHAR(100),
  resource_id INT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Log critical actions:**
- User registration/login
- Password changes
- Admin actions
- Payment transactions
- Seva/SAK token transfers

### Security Alerts

**Set up alerts for:**
- Multiple failed login attempts
- Unusual payment patterns
- Large seva/SAK transfers
- Admin privilege escalation
- API rate limit violations

## 6. Business Metrics Dashboard

### Key Performance Indicators (KPIs)

#### Revenue Metrics
- **Daily/Monthly Revenue:** Total sales
- **Average Order Value (AOV):** Revenue / Orders
- **Revenue by Payment Method:** Money vs. Seva vs. Free
- **Commission Earned:** Platform revenue

#### User Metrics
- **Daily/Monthly Active Users (DAU/MAU)**
- **New User Registrations**
- **User Retention Rate:** (Users returning / Total users) * 100
- **Churn Rate:** Users who stopped using platform

#### Product Metrics
- **Total Products Listed**
- **Products Sold**
- **Inventory Turnover:** Sales / Average inventory
- **Top Categories:** By views and sales

#### Engagement Metrics
- **Seva Tokens Earned:** Total and per user
- **SAK Tokens Awarded:** Total and per user
- **Repair Requests:** Total and completion rate
- **Volunteer Hours:** Total contributed

#### Environmental Impact
- **CO₂ Saved:** Total kilograms
- **Water Saved:** Total liters
- **Items Diverted from Landfill**
- **Extended Product Lifecycles**

#### AI Performance
- **Visual Search Usage:** Searches per day
- **Recommendation Click-Through Rate**
- **Dynamic Pricing Accuracy:** Predicted vs. actual sales
- **Fraud Detection Rate:** Flagged / Total transactions

### Dashboard Tools

**Option 1: Metabase (Open Source)**
```bash
docker run -d -p 3000:3000 --name metabase metabase/metabase
```

**Option 2: Grafana + Prometheus**
- More technical setup
- Better for infrastructure metrics

**Option 3: Custom Dashboard**
- Build with React + Chart.js
- Integrate with your database

## 7. Logging Strategy

### Log Levels

- **ERROR:** Application errors, exceptions
- **WARN:** Potential issues, deprecated features
- **INFO:** Important business events
- **DEBUG:** Detailed diagnostic information

### Structured Logging

**Use Winston or Pino:**

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'sakshi-platform' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export { logger };
```

### Log Aggregation

**Recommended: Logtail or Papertrail**

**Setup:**
```bash
LOGTAIL_SOURCE_TOKEN=your_token_here
```

## 8. Alerts & Notifications

### Critical Alerts (Immediate Response)

- **System Down:** Any endpoint returning 5xx errors
- **Database Connection Lost**
- **Payment Gateway Failure**
- **High Error Rate:** > 1% of requests

**Channels:** SMS, Phone Call, Slack

### Warning Alerts (Monitor)

- **High Response Time:** > 500ms average
- **Low Disk Space:** < 20% free
- **High Memory Usage:** > 80%
- **Unusual Traffic Patterns**

**Channels:** Email, Slack

### Info Alerts (Daily Digest)

- **Daily Metrics Summary**
- **New User Registrations**
- **Revenue Report**
- **Environmental Impact Update**

**Channels:** Email

## 9. Health Check Endpoints

**Create `/api/health` endpoint:**

```typescript
export const healthRouter = router({
  check: publicProcedure.query(async () => {
    const checks = {
      database: await checkDatabase(),
      redis: await checkRedis(),
      s3: await checkS3(),
      timestamp: new Date().toISOString(),
    };

    const healthy = Object.values(checks).every(c => c === true || c.status === 'ok');

    return {
      status: healthy ? 'healthy' : 'unhealthy',
      checks,
    };
  }),
});

async function checkDatabase() {
  try {
    await getDb().execute(sql`SELECT 1`);
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

## 10. Implementation Checklist

- [ ] Set up APM (New Relic/Datadog)
- [ ] Configure error tracking (Sentry)
- [ ] Implement analytics (PostHog/Mixpanel)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Create audit logging
- [ ] Build business metrics dashboard
- [ ] Configure structured logging
- [ ] Set up alert notifications
- [ ] Create health check endpoints
- [ ] Test all monitoring systems
- [ ] Document runbooks for common issues

## 11. Cost Estimate

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| New Relic | Free | $0 |
| Sentry | Team | $26 |
| PostHog | Startup | $0-50 |
| UptimeRobot | Pro | $7 |
| Logtail | Starter | $5 |
| **Total** | | **$38-88** |

## 12. Best Practices

1. **Start Simple:** Begin with free tiers and scale up
2. **Monitor What Matters:** Focus on business-critical metrics
3. **Set Realistic Thresholds:** Avoid alert fatigue
4. **Review Regularly:** Weekly dashboard reviews
5. **Document Everything:** Runbooks for common issues
6. **Test Alerts:** Ensure notifications work
7. **Privacy First:** Don't log sensitive data
8. **Correlate Data:** Connect metrics across tools

---

**Your platform is now fully observable and production-ready!** 📊🔍
