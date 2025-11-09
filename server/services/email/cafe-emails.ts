/**
 * Sakshi Cafe Email Service
 * 
 * Handles all email notifications for cafe operations:
 * - Order confirmations
 * - Class registrations
 * - Recipe approvals
 * - Subscription updates
 * - Health tracking reminders
 */

interface EmailConfig {
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

interface OrderConfirmationData {
  orderId: number;
  customerName: string;
  customerEmail: string;
  orderType: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  total: string;
  priceTier: string;
  deliveryAddress?: string;
  estimatedTime?: string;
}

interface ClassRegistrationData {
  classId: number;
  className: string;
  customerName: string;
  customerEmail: string;
  classDate: Date;
  classTime: string;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  priceTier: string;
  amount: string;
}

interface RecipeApprovalData {
  recipeId: number;
  recipeTitle: string;
  authorName: string;
  authorEmail: string;
  approvedBy: string;
  sevaTokensEarned: number;
}

interface SubscriptionUpdateData {
  subscriptionId: number;
  customerName: string;
  customerEmail: string;
  updateType: 'created' | 'paused' | 'resumed' | 'cancelled';
  nextDelivery?: Date;
}

// Email templates
function getOrderConfirmationTemplate(data: OrderConfirmationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Sakshi Cafe</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .order-details {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .total {
      font-size: 1.25rem;
      font-weight: bold;
      color: #16a34a;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #16a34a;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .badge-community { background: #dbeafe; color: #1e40af; }
    .badge-fair { background: #d1fae5; color: #065f46; }
    .badge-supporter { background: #fed7aa; color: #9a3412; }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">🌿 Order Confirmed!</h1>
    <p style="margin: 10px 0 0 0;">Thank you for choosing Sakshi Cafe</p>
  </div>
  
  <div class="content">
    <p>Namaste ${data.customerName},</p>
    
    <p>Your order has been confirmed and is being prepared with love and consciousness.</p>
    
    <div class="order-details">
      <h2 style="margin-top: 0;">Order #${data.orderId}</h2>
      <p><strong>Order Type:</strong> ${data.orderType}</p>
      ${data.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${data.deliveryAddress}</p>` : ''}
      ${data.estimatedTime ? `<p><strong>Estimated Time:</strong> ${data.estimatedTime}</p>` : ''}
      
      <h3>Items:</h3>
      ${data.items.map(item => `
        <div class="item">
          <span>${item.name} x ${item.quantity}</span>
          <span>₹${item.price}</span>
        </div>
      `).join('')}
      
      <div class="total">
        Total: ₹${data.total}
        <span class="badge badge-${data.priceTier}">${data.priceTier} tier</span>
      </div>
    </div>
    
    ${data.priceTier === 'community' ? `
      <p style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af;">
        💙 Thank you for being part of our community. We're honored to serve you.
      </p>
    ` : ''}
    
    ${data.priceTier === 'supporter' ? `
      <p style="background: #fed7aa; padding: 15px; border-radius: 8px; border-left: 4px solid #9a3412;">
        🧡 Thank you for supporting others! Your contribution helps make healthy food accessible to all.
      </p>
    ` : ''}
    
    <p>Track your order status in your <a href="https://sakshicafe.org/cafe/dashboard" style="color: #16a34a;">dashboard</a>.</p>
    
    <p>With gratitude,<br>The Sakshi Cafe Team</p>
  </div>
  
  <div class="footer">
    <p>Sakshi Cafe - Conscious Food, Conscious Living</p>
    <p>🌿 100% Plant-Based | 🧘 Ayurvedic Wisdom | 💚 Universal Access</p>
  </div>
</body>
</html>
  `;
}

function getClassRegistrationTemplate(data: ClassRegistrationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Class Registration Confirmed - Sakshi Cafe</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .class-details {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .button {
      display: inline-block;
      background: #7c3aed;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">👨‍🍳 You're Registered!</h1>
    <p style="margin: 10px 0 0 0;">Get ready to learn Satvic cooking</p>
  </div>
  
  <div class="content">
    <p>Namaste ${data.customerName},</p>
    
    <p>We're excited to have you join us for <strong>${data.className}</strong>!</p>
    
    <div class="class-details">
      <h2 style="margin-top: 0;">Class Details</h2>
      
      <div class="detail-row">
        <span><strong>Date:</strong></span>
        <span>${data.classDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      
      <div class="detail-row">
        <span><strong>Time:</strong></span>
        <span>${data.classTime}</span>
      </div>
      
      ${data.isVirtual ? `
        <div class="detail-row">
          <span><strong>Format:</strong></span>
          <span>Virtual (Online)</span>
        </div>
        ${data.meetingLink ? `
          <div style="margin-top: 20px;">
            <a href="${data.meetingLink}" class="button">Join Virtual Class</a>
          </div>
        ` : ''}
      ` : `
        <div class="detail-row">
          <span><strong>Location:</strong></span>
          <span>${data.location}</span>
        </div>
      `}
      
      <div class="detail-row">
        <span><strong>Amount Paid:</strong></span>
        <span>₹${data.amount} (${data.priceTier} tier)</span>
      </div>
    </div>
    
    <h3>What to Expect:</h3>
    <ul>
      <li>Hands-on cooking demonstration</li>
      <li>Expert instruction from experienced chefs</li>
      <li>Recipe booklet to take home</li>
      <li>Q&A session</li>
      <li>Certificate of completion</li>
      <li><strong>20 Seva tokens</strong> upon attendance!</li>
    </ul>
    
    ${!data.isVirtual ? `
      <h3>What to Bring:</h3>
      <ul>
        <li>Comfortable clothes (apron provided)</li>
        <li>Enthusiasm to learn!</li>
      </ul>
      <p><em>All ingredients and equipment will be provided.</em></p>
    ` : `
      <h3>Before the Class:</h3>
      <ul>
        <li>Check your email for the ingredient list</li>
        <li>Test your video/audio connection</li>
        <li>Have basic kitchen tools ready</li>
      </ul>
    `}
    
    <p>View your registration in your <a href="https://sakshicafe.org/cafe/dashboard" style="color: #7c3aed;">dashboard</a>.</p>
    
    <p>See you in class!<br>The Sakshi Cafe Team</p>
  </div>
  
  <div class="footer">
    <p>Sakshi Cafe - Learn, Cook, Thrive</p>
    <p>Questions? Reply to this email or call us at +91-80-12345678</p>
  </div>
</body>
</html>
  `;
}

function getRecipeApprovalTemplate(data: RecipeApprovalData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recipe Approved - Sakshi Cafe</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .celebration {
      background: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .tokens {
      font-size: 3rem;
      font-weight: bold;
      color: #f59e0b;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background: #f59e0b;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">🎉 Recipe Approved!</h1>
    <p style="margin: 10px 0 0 0;">Your contribution is now live</p>
  </div>
  
  <div class="content">
    <p>Congratulations ${data.authorName}!</p>
    
    <p>Your recipe "<strong>${data.recipeTitle}</strong>" has been approved and is now part of the Sakshi Cafe community recipe library!</p>
    
    <div class="celebration">
      <h2>You've Earned Seva Tokens!</h2>
      <div class="tokens">+${data.sevaTokensEarned} 🪙</div>
      <p>Use these tokens for discounts on cafe orders, cooking classes, and more.</p>
      <a href="https://sakshicafe.org/seva-wallet" class="button">View Your Wallet</a>
    </div>
    
    <h3>What's Next?</h3>
    <ul>
      <li>Your recipe is now visible to all users</li>
      <li>Community members can rate and review it</li>
      <li>You'll receive notifications for comments</li>
      <li>Keep sharing more delicious Satvic recipes!</li>
    </ul>
    
    <p>Thank you for contributing to our community and helping others discover the joy of Satvic cooking.</p>
    
    <a href="https://sakshicafe.org/cafe/recipes/${data.recipeId}" class="button">View Your Recipe</a>
    
    <p>With gratitude,<br>${data.approvedBy}<br>Sakshi Cafe Team</p>
  </div>
  
  <div class="footer">
    <p>Sakshi Cafe - Community-Powered Satvic Cooking</p>
    <p>Keep cooking, keep sharing! 🌿</p>
  </div>
</body>
</html>
  `;
}

// Email sending functions
export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  const emailConfig: EmailConfig = {
    from: 'Sakshi Cafe <orders@sakshicafe.org>',
    replyTo: 'support@sakshicafe.org',
    subject: `Order Confirmed #${data.orderId} - Sakshi Cafe`,
    html: getOrderConfirmationTemplate(data),
  };

  // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
  console.log('Sending order confirmation email to:', data.customerEmail);
  console.log('Email config:', emailConfig);
  
  // Placeholder for actual email sending
  // await emailService.send({
  //   to: data.customerEmail,
  //   ...emailConfig,
  // });
}

export async function sendClassRegistration(data: ClassRegistrationData): Promise<void> {
  const emailConfig: EmailConfig = {
    from: 'Sakshi Cafe Classes <classes@sakshicafe.org>',
    replyTo: 'support@sakshicafe.org',
    subject: `Class Registration Confirmed - ${data.className}`,
    html: getClassRegistrationTemplate(data),
  };

  console.log('Sending class registration email to:', data.customerEmail);
  console.log('Email config:', emailConfig);
  
  // TODO: Integrate with actual email service
}

export async function sendRecipeApproval(data: RecipeApprovalData): Promise<void> {
  const emailConfig: EmailConfig = {
    from: 'Sakshi Cafe Recipes <recipes@sakshicafe.org>',
    replyTo: 'support@sakshicafe.org',
    subject: `🎉 Your Recipe "${data.recipeTitle}" is Approved!`,
    html: getRecipeApprovalTemplate(data),
  };

  console.log('Sending recipe approval email to:', data.authorEmail);
  console.log('Email config:', emailConfig);
  
  // TODO: Integrate with actual email service
}

export async function sendSubscriptionUpdate(data: SubscriptionUpdateData): Promise<void> {
  // TODO: Implement subscription email templates
  console.log('Sending subscription update email to:', data.customerEmail);
}

export async function sendClassReminder(data: ClassRegistrationData): Promise<void> {
  // TODO: Implement class reminder template (send 24 hours before class)
  console.log('Sending class reminder to:', data.customerEmail);
}

export async function sendHealthTrackingReminder(email: string, name: string): Promise<void> {
  // TODO: Implement health tracking reminder template
  console.log('Sending health tracking reminder to:', email);
}
