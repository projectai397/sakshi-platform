import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Email configuration from environment variables
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
};

// Create transporter
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);
  }
  return transporter;
}

// Email sending interface
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transport = getTransporter();

    const mailOptions = {
      from: options.from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html),
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(", ") : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(", ") : options.bcc) : undefined,
      attachments: options.attachments,
    };

    const info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log("Email configuration verified successfully");
    return true;
  } catch (error) {
    console.error("Email configuration verification failed:", error);
    return false;
  }
}

// Helper function to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

// Send order confirmation email
export async function sendOrderConfirmation(
  to: string,
  orderData: {
    orderId: number;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    paymentMethod: string;
  }
): Promise<boolean> {
  const { orderConfirmationTemplate } = await import("./templates/orderConfirmation");
  const html = orderConfirmationTemplate(orderData);

  return sendEmail({
    to,
    subject: `Order Confirmation #${orderData.orderId} - Sakshi Platform`,
    html,
  });
}

// Send seva token notification
export async function sendSevaTokenNotification(
  to: string,
  data: {
    userName: string;
    amount: number;
    type: "earned" | "spent";
    balance: number;
    description: string;
  }
): Promise<boolean> {
  const { sevaTokenTemplate } = await import("./templates/sevaToken");
  const html = sevaTokenTemplate(data);

  const subject =
    data.type === "earned"
      ? `You earned ${data.amount} Seva Tokens! 🙏`
      : `You spent ${data.amount} Seva Tokens`;

  return sendEmail({
    to,
    subject,
    html,
  });
}

// Send shipping update
export async function sendShippingUpdate(
  to: string,
  data: {
    orderId: number;
    customerName: string;
    status: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
  }
): Promise<boolean> {
  const { shippingUpdateTemplate } = await import("./templates/shippingUpdate");
  const html = shippingUpdateTemplate(data);

  return sendEmail({
    to,
    subject: `Shipping Update for Order #${data.orderId}`,
    html,
  });
}

// Send welcome email
export async function sendWelcomeEmail(
  to: string,
  data: {
    userName: string;
  }
): Promise<boolean> {
  const { welcomeTemplate } = await import("./templates/welcome");
  const html = welcomeTemplate(data);

  return sendEmail({
    to,
    subject: "Welcome to Sakshi Platform! 🙏",
    html,
  });
}

// Send password reset email
export async function sendPasswordReset(
  to: string,
  data: {
    userName: string;
    resetLink: string;
    expiresIn: string;
  }
): Promise<boolean> {
  const { passwordResetTemplate } = await import("./templates/passwordReset");
  const html = passwordResetTemplate(data);

  return sendEmail({
    to,
    subject: "Reset Your Password - Sakshi Platform",
    html,
  });
}

// Test email function
export async function sendTestEmail(to: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: "Test Email from Sakshi Platform",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF6B35;">Test Email</h1>
        <p>This is a test email from Sakshi Platform.</p>
        <p>If you received this, your email configuration is working correctly! ✅</p>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          Sakshi Platform - Witnessing every journey, supporting every soul 🙏
        </p>
      </div>
    `,
  });
}
