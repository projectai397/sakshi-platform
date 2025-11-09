# Sakshi Cafe Email Notification Setup

## Overview

This guide explains how to set up automated email notifications for Sakshi Cafe operations.

**Email Types:**
1. Order confirmations
2. Class registrations
3. Recipe approvals
4. Subscription updates
5. Class reminders (24 hours before)
6. Health tracking reminders

---

## Email Service Options

### Option 1: SendGrid (Recommended)

**Pros:**
- Free tier: 100 emails/day
- Easy setup
- Good deliverability
- Email templates
- Analytics

**Setup:**
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API key
3. Verify sender domain
4. Install SDK: `pnpm add @sendgrid/mail`

### Option 2: AWS SES

**Pros:**
- Very cheap ($0.10 per 1000 emails)
- Highly scalable
- AWS integration

**Cons:**
- More complex setup
- Requires AWS account

### Option 3: Resend

**Pros:**
- Developer-friendly
- Modern API
- React email templates

**Setup:**
1. Sign up at [Resend](https://resend.com)
2. Get API key
3. Install SDK: `pnpm add resend`

---

## Implementation with SendGrid

### 1. Install Dependencies

```bash
pnpm add @sendgrid/mail
pnpm add -D @types/sendgrid__mail
```

### 2. Configure Environment

Add to `.env`:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=orders@sakshicafe.org
SENDGRID_FROM_NAME=Sakshi Cafe

# Email addresses
EMAIL_ORDERS=orders@sakshicafe.org
EMAIL_CLASSES=classes@sakshicafe.org
EMAIL_RECIPES=recipes@sakshicafe.org
EMAIL_SUPPORT=support@sakshicafe.org
```

### 3. Create Email Service

Create `server/services/email/sendgrid.ts`:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendEmailParams {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  try {
    await sgMail.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
    
    console.log(`Email sent to ${params.to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
```

### 4. Update Email Functions

Update `server/services/email/cafe-emails.ts`:

```typescript
import { sendEmail } from './sendgrid';

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  const emailConfig = {
    to: data.customerEmail,
    from: process.env.EMAIL_ORDERS!,
    subject: `Order Confirmed #${data.orderId} - Sakshi Cafe`,
    html: getOrderConfirmationTemplate(data),
  };

  await sendEmail(emailConfig);
}

// Similar updates for other email functions
```

---

## Integration Points

### 1. Order Confirmation

**Trigger:** After successful payment verification

```typescript
// In server/routes/cafe/payments.ts
import { sendOrderConfirmation } from '../../services/email/cafe-emails';

// After payment verification
await db.update(sakshiCafeOrders)
  .set({ paymentStatus: 'paid', orderStatus: 'confirmed' })
  .where(eq(sakshiCafeOrders.id, orderId));

// Send confirmation email
const order = await db.select().from(sakshiCafeOrders)
  .where(eq(sakshiCafeOrders.id, orderId))
  .limit(1);

await sendOrderConfirmation({
  orderId: order.id,
  customerName: user.name,
  customerEmail: user.email,
  orderType: order.orderType,
  items: order.items,
  total: order.total,
  priceTier: order.priceTier,
  deliveryAddress: order.deliveryAddress,
  estimatedTime: '30-45 minutes',
});
```

### 2. Class Registration

**Trigger:** After successful class registration payment

```typescript
// In server/routes/cafe/classes.ts
import { sendClassRegistration } from '../../services/email/cafe-emails';

// After registration
await sendClassRegistration({
  classId: classData.id,
  className: classData.title,
  customerName: user.name,
  customerEmail: user.email,
  classDate: classData.dateTime,
  classTime: formatTime(classData.dateTime),
  location: classData.location,
  isVirtual: classData.classType === 'virtual',
  meetingLink: classData.videoUrl,
  priceTier: registration.priceTier,
  amount: registration.amountPaid,
});
```

### 3. Recipe Approval

**Trigger:** When admin approves a recipe

```typescript
// In server/routes/cafe/recipes.ts
import { sendRecipeApproval } from '../../services/email/cafe-emails';

// After approval
await db.update(recipes)
  .set({ isApproved: true })
  .where(eq(recipes.id, recipeId));

// Award Seva tokens
await awardSevaTokens(recipe.authorId, 25, 'Recipe approved');

// Send approval email
await sendRecipeApproval({
  recipeId: recipe.id,
  recipeTitle: recipe.title,
  authorName: author.name,
  authorEmail: author.email,
  approvedBy: admin.name,
  sevaTokensEarned: 25,
});
```

### 4. Class Reminders

**Trigger:** Scheduled job 24 hours before class

```typescript
// Create a cron job or scheduled task
import { sendClassReminder } from '../../services/email/cafe-emails';

// Run daily to check upcoming classes
async function sendClassReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingClasses = await db.select()
    .from(cookingClasses)
    .where(
      and(
        gte(cookingClasses.dateTime, tomorrow),
        lte(cookingClasses.dateTime, addHours(tomorrow, 24))
      )
    );

  for (const classData of upcomingClasses) {
    const registrations = await db.select()
      .from(classRegistrations)
      .where(eq(classRegistrations.classId, classData.id));

    for (const registration of registrations) {
      await sendClassReminder({
        classId: classData.id,
        className: classData.title,
        customerName: registration.userName,
        customerEmail: registration.userEmail,
        classDate: classData.dateTime,
        classTime: formatTime(classData.dateTime),
        location: classData.location,
        isVirtual: classData.classType === 'virtual',
        meetingLink: classData.videoUrl,
        priceTier: registration.priceTier,
        amount: registration.amountPaid,
      });
    }
  }
}

// Schedule to run daily
// Use node-cron or similar
```

---

## Email Templates

All email templates are in `server/services/email/cafe-emails.ts`.

### Customization

**Brand Colors:**
- Primary Green: `#16a34a`
- Purple (Classes): `#7c3aed`
- Orange (Recipes): `#f59e0b`

**Fonts:**
- System fonts for best compatibility
- Fallback to Arial/sans-serif

**Responsive Design:**
- Max width: 600px
- Mobile-friendly
- Tested on major email clients

### Template Variables

**Order Confirmation:**
- `orderId`, `customerName`, `customerEmail`
- `orderType`, `items`, `total`, `priceTier`
- `deliveryAddress`, `estimatedTime`

**Class Registration:**
- `classId`, `className`, `customerName`, `customerEmail`
- `classDate`, `classTime`, `location`
- `isVirtual`, `meetingLink`, `priceTier`, `amount`

**Recipe Approval:**
- `recipeId`, `recipeTitle`, `authorName`, `authorEmail`
- `approvedBy`, `sevaTokensEarned`

---

## Testing

### Test Email Sending

```typescript
// Create a test endpoint
import { sendOrderConfirmation } from './services/email/cafe-emails';

export const testEmailRouter = router({
  sendTestEmail: protectedProcedure
    .mutation(async ({ ctx }) => {
      await sendOrderConfirmation({
        orderId: 123,
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        orderType: 'delivery',
        items: [
          { name: 'Sattvic Thali', quantity: 1, price: '250' },
        ],
        total: '250',
        priceTier: 'fair',
        deliveryAddress: '123 Test Street',
        estimatedTime: '30-45 minutes',
      });

      return { success: true };
    }),
});
```

### SendGrid Test Mode

SendGrid provides a sandbox mode for testing without actually sending emails.

```typescript
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
sgMail.setSubstitutionWrappers('{{', '}}'); // Optional

// For testing, use sandbox mode
if (process.env.NODE_ENV === 'development') {
  sgMail.setSandboxMode(true);
}
```

---

## Monitoring

### Email Delivery Tracking

**SendGrid Dashboard:**
- Open rate
- Click rate
- Bounce rate
- Spam reports

**Log Email Events:**

```typescript
export async function sendEmail(params: SendEmailParams): Promise<void> {
  try {
    const result = await sgMail.send(params);
    
    // Log successful send
    await db.insert(emailLogs).values({
      to: params.to,
      subject: params.subject,
      status: 'sent',
      provider: 'sendgrid',
      messageId: result[0].headers['x-message-id'],
      sentAt: new Date(),
    });
    
  } catch (error) {
    // Log failed send
    await db.insert(emailLogs).values({
      to: params.to,
      subject: params.subject,
      status: 'failed',
      error: error.message,
      sentAt: new Date(),
    });
    
    throw error;
  }
}
```

---

## Best Practices

### 1. Deliverability

- Verify sender domain (SPF, DKIM, DMARC)
- Use consistent "From" addresses
- Include unsubscribe links
- Avoid spam trigger words
- Test emails before sending

### 2. Performance

- Send emails asynchronously
- Use queue for bulk emails
- Implement retry logic
- Handle failures gracefully

### 3. Privacy

- Don't include sensitive data in emails
- Use secure links with tokens
- Respect user preferences
- Comply with GDPR/privacy laws

### 4. User Experience

- Clear subject lines
- Mobile-responsive design
- Personalized content
- Clear call-to-action
- Contact information

---

## Troubleshooting

### Emails Not Sending

**Check:**
1. API key is correct
2. Sender email is verified
3. Recipient email is valid
4. No rate limiting
5. Check SendGrid dashboard for errors

### Emails Going to Spam

**Solutions:**
1. Verify domain authentication
2. Warm up IP address
3. Improve email content
4. Add unsubscribe link
5. Monitor spam reports

### Template Not Rendering

**Check:**
1. HTML is valid
2. Inline CSS used
3. Images have alt text
4. Test in multiple clients
5. Use email testing tools

---

## Advanced Features

### 1. Email Scheduling

Schedule emails for optimal delivery times:

```typescript
import { scheduleEmail } from './email-scheduler';

await scheduleEmail({
  to: user.email,
  template: 'class-reminder',
  data: classData,
  sendAt: subHours(classData.dateTime, 24), // 24 hours before
});
```

### 2. Email Preferences

Allow users to customize email notifications:

```typescript
// User preferences
interface EmailPreferences {
  orderConfirmations: boolean;
  classReminders: boolean;
  recipeUpdates: boolean;
  healthReminders: boolean;
  marketingEmails: boolean;
}

// Check preferences before sending
if (user.emailPreferences.orderConfirmations) {
  await sendOrderConfirmation(data);
}
```

### 3. A/B Testing

Test different email templates:

```typescript
const template = Math.random() < 0.5 
  ? getOrderConfirmationTemplateA(data)
  : getOrderConfirmationTemplateB(data);

await sendEmail({
  ...config,
  html: template,
  customArgs: {
    variant: template === templateA ? 'A' : 'B',
  },
});
```

---

## Next Steps

1. **Set up SendGrid account**
2. **Verify sender domain**
3. **Install dependencies**
4. **Update email functions**
5. **Test email sending**
6. **Integrate with payment flow**
7. **Set up class reminders**
8. **Monitor delivery rates**

---

**Status**: ✅ Email templates ready  
**TODO**: Complete SendGrid integration

**Last updated**: November 9, 2025
