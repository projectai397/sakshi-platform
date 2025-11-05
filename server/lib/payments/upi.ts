import QRCode from 'qrcode';
import crypto from 'crypto';

/**
 * Direct UPI Payment Integration for Sakshi Platform
 * Supports UPI QR codes and payment intent
 */

export interface UPIPaymentOptions {
  amount: number;
  merchantName: string;
  merchantVPA: string; // UPI ID (e.g., sakshi@paytm)
  transactionNote?: string;
  transactionRef?: string;
}

/**
 * Generate UPI payment string
 */
export function generateUPIString(options: UPIPaymentOptions): string {
  const {
    amount,
    merchantName,
    merchantVPA,
    transactionNote = 'Payment to Sakshi Platform',
    transactionRef = `TXN${Date.now()}`,
  } = options;

  // UPI payment string format
  const upiString = `upi://pay?pa=${encodeURIComponent(merchantVPA)}&pn=${encodeURIComponent(merchantName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${encodeURIComponent(transactionRef)}`;

  return upiString;
}

/**
 * Generate UPI QR code
 */
export async function generateUPIQRCode(
  options: UPIPaymentOptions
): Promise<string> {
  try {
    const upiString = generateUPIString(options);
    const qrCodeDataURL = await QRCode.toDataURL(upiString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate UPI QR code');
  }
}

/**
 * Generate UPI deep link for mobile
 */
export function generateUPIDeepLink(options: UPIPaymentOptions): string {
  return generateUPIString(options);
}

/**
 * Verify UPI transaction (manual verification)
 * Note: UPI doesn't have automatic verification like Razorpay
 * You'll need to implement manual verification or use a payment aggregator
 */
export interface UPITransactionVerification {
  transactionRef: string;
  upiTransactionId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
}

/**
 * Create UPI payment session
 */
export async function createUPIPaymentSession(options: {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}) {
  const merchantVPA = process.env.UPI_MERCHANT_VPA || 'sakshi@paytm';
  const merchantName = process.env.UPI_MERCHANT_NAME || 'Sakshi Platform';

  const transactionRef = `ORD${options.orderId}_${Date.now()}`;

  const upiOptions: UPIPaymentOptions = {
    amount: options.amount,
    merchantName,
    merchantVPA,
    transactionNote: `Order #${options.orderId}`,
    transactionRef,
  };

  // Generate QR code
  const qrCode = await generateUPIQRCode(upiOptions);

  // Generate deep link for mobile
  const deepLink = generateUPIDeepLink(upiOptions);

  return {
    success: true,
    session: {
      transactionRef,
      qrCode,
      deepLink,
      upiString: generateUPIString(upiOptions),
      merchantVPA,
      amount: options.amount,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  };
}

/**
 * Verify UPI payment (requires manual confirmation or webhook)
 */
export async function verifyUPIPayment(
  transactionRef: string,
  upiTransactionId: string
): Promise<UPITransactionVerification> {
  // In a real implementation, you would:
  // 1. Check with your bank's API
  // 2. Use a payment aggregator's verification API
  // 3. Implement manual verification workflow

  // For now, return pending status
  return {
    transactionRef,
    upiTransactionId,
    amount: 0, // Would be fetched from your records
    status: 'pending',
  };
}

/**
 * Generate UPI payment instructions for users
 */
export function getUPIPaymentInstructions() {
  return {
    desktop: [
      'Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)',
      'Verify the payment amount and merchant name',
      'Enter your UPI PIN to complete the payment',
      'Take a screenshot of the transaction confirmation',
      'Upload the screenshot or enter the UPI transaction ID',
    ],
    mobile: [
      'Tap the "Pay with UPI" button',
      'Choose your preferred UPI app',
      'Verify the payment amount and merchant name',
      'Enter your UPI PIN to complete the payment',
      'You will be redirected back automatically',
    ],
  };
}

/**
 * Popular UPI apps configuration
 */
export const UPI_APPS = [
  {
    name: 'Google Pay',
    package: 'com.google.android.apps.nbu.paisa.user',
    icon: '/icons/gpay.png',
  },
  {
    name: 'PhonePe',
    package: 'com.phonepe.app',
    icon: '/icons/phonepe.png',
  },
  {
    name: 'Paytm',
    package: 'net.one97.paytm',
    icon: '/icons/paytm.png',
  },
  {
    name: 'Amazon Pay',
    package: 'in.amazon.mShop.android.shopping',
    icon: '/icons/amazonpay.png',
  },
  {
    name: 'BHIM',
    package: 'in.org.npci.upiapp',
    icon: '/icons/bhim.png',
  },
];

/**
 * Check if device is mobile
 */
export function isMobileDevice(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

/**
 * Get UPI payment method based on device
 */
export function getUPIPaymentMethod(userAgent: string) {
  if (isMobileDevice(userAgent)) {
    return {
      method: 'intent',
      apps: UPI_APPS,
      instructions: getUPIPaymentInstructions().mobile,
    };
  } else {
    return {
      method: 'qr',
      instructions: getUPIPaymentInstructions().desktop,
    };
  }
}

export default {
  generateQRCode: generateUPIQRCode,
  generateDeepLink: generateUPIDeepLink,
  createSession: createUPIPaymentSession,
  verifyPayment: verifyUPIPayment,
  getInstructions: getUPIPaymentInstructions,
  getPaymentMethod: getUPIPaymentMethod,
  UPI_APPS,
};
