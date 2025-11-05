import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Razorpay Payment Integration for Sakshi Platform
 * Supports cards, UPI, netbanking, wallets
 */

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface RazorpayOrderOptions {
  amount: number; // Amount in rupees (will be converted to paise)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Create a Razorpay order
 */
export async function createRazorpayOrder(options: RazorpayOrderOptions) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(options.amount * 100), // Convert to paise
      currency: options.currency || 'INR',
      receipt: options.receipt || `receipt_${Date.now()}`,
      notes: options.notes || {},
    });

    return {
      success: true,
      order,
    };
  } catch (error: any) {
    console.error('Razorpay order creation failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
  verification: RazorpayPaymentVerification
): boolean {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      verification;

    // Generate expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    // Compare signatures
    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Fetch payment details
 */
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment,
    };
  } catch (error: any) {
    console.error('Failed to fetch payment:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Capture payment (for authorized payments)
 */
export async function capturePayment(
  paymentId: string,
  amount: number,
  currency: string = 'INR'
) {
  try {
    const payment = await razorpay.payments.capture(
      paymentId,
      Math.round(amount * 100), // Convert to paise
      currency
    );

    return {
      success: true,
      payment,
    };
  } catch (error: any) {
    console.error('Payment capture failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Refund payment
 */
export async function refundPayment(
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
) {
  try {
    const refundData: any = {
      notes: notes || {},
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, refundData);

    return {
      success: true,
      refund,
    };
  } catch (error: any) {
    console.error('Refund failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a payment link
 */
export async function createPaymentLink(options: {
  amount: number;
  currency?: string;
  description: string;
  customer: {
    name: string;
    email: string;
    contact: string;
  };
  callback_url?: string;
  callback_method?: string;
}) {
  try {
    const link = await razorpay.paymentLink.create({
      amount: Math.round(options.amount * 100), // Convert to paise
      currency: options.currency || 'INR',
      description: options.description,
      customer: options.customer,
      callback_url: options.callback_url,
      callback_method: options.callback_method || 'get',
    });

    return {
      success: true,
      link,
    };
  } catch (error: any) {
    console.error('Payment link creation failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Handle Razorpay webhook
 */
export function verifyWebhookSignature(
  webhookBody: string,
  webhookSignature: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(webhookBody)
      .digest('hex');

    return expectedSignature === webhookSignature;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Process webhook event
 */
export async function processWebhookEvent(event: any) {
  const { event: eventType, payload } = event;

  switch (eventType) {
    case 'payment.captured':
      // Handle successful payment
      console.log('Payment captured:', payload.payment.entity.id);
      // Update order status in database
      break;

    case 'payment.failed':
      // Handle failed payment
      console.log('Payment failed:', payload.payment.entity.id);
      // Update order status in database
      break;

    case 'refund.created':
      // Handle refund
      console.log('Refund created:', payload.refund.entity.id);
      // Update order status in database
      break;

    default:
      console.log('Unhandled event type:', eventType);
  }
}

/**
 * Get Razorpay configuration for frontend
 */
export function getRazorpayConfig() {
  return {
    key_id: process.env.RAZORPAY_KEY_ID,
    currency: 'INR',
    name: 'Sakshi Platform',
    description: 'Conscious Commerce Platform',
    image: '/logo.png', // Your logo URL
    theme: {
      color: '#8B5CF6', // Sakshi purple theme
    },
  };
}

export default {
  createOrder: createRazorpayOrder,
  verifySignature: verifyRazorpaySignature,
  fetchPayment: fetchPaymentDetails,
  capturePayment,
  refundPayment,
  createPaymentLink,
  verifyWebhookSignature,
  processWebhookEvent,
  getConfig: getRazorpayConfig,
};
