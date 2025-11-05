import axios from 'axios';

/**
 * Cryptocurrency Payment Integration for Sakshi Platform
 * Using Coinbase Commerce API
 */

const COINBASE_API_URL = 'https://api.commerce.coinbase.com';
const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY || '';

export interface CryptoPaymentOptions {
  name: string;
  description: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  redirect_url?: string;
  cancel_url?: string;
}

/**
 * Create a Coinbase Commerce charge
 */
export async function createCryptoCharge(options: CryptoPaymentOptions) {
  try {
    const response = await axios.post(
      `${COINBASE_API_URL}/charges`,
      {
        name: options.name,
        description: options.description,
        pricing_type: 'fixed_price',
        local_price: {
          amount: options.amount.toFixed(2),
          currency: options.currency,
        },
        metadata: options.metadata || {},
        redirect_url: options.redirect_url,
        cancel_url: options.cancel_url,
      },
      {
        headers: {
          'X-CC-Api-Key': COINBASE_API_KEY,
          'X-CC-Version': '2018-03-22',
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      charge: response.data.data,
    };
  } catch (error: any) {
    console.error('Crypto charge creation failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Get charge details
 */
export async function getCryptoCharge(chargeId: string) {
  try {
    const response = await axios.get(
      `${COINBASE_API_URL}/charges/${chargeId}`,
      {
        headers: {
          'X-CC-Api-Key': COINBASE_API_KEY,
          'X-CC-Version': '2018-03-22',
        },
      }
    );

    return {
      success: true,
      charge: response.data.data,
    };
  } catch (error: any) {
    console.error('Failed to fetch charge:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * List all charges
 */
export async function listCryptoCharges(limit: number = 25) {
  try {
    const response = await axios.get(`${COINBASE_API_URL}/charges`, {
      headers: {
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': '2018-03-22',
      },
      params: {
        limit,
      },
    });

    return {
      success: true,
      charges: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    console.error('Failed to list charges:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Cancel a charge
 */
export async function cancelCryptoCharge(chargeId: string) {
  try {
    const response = await axios.post(
      `${COINBASE_API_URL}/charges/${chargeId}/cancel`,
      {},
      {
        headers: {
          'X-CC-Api-Key': COINBASE_API_KEY,
          'X-CC-Version': '2018-03-22',
        },
      }
    );

    return {
      success: true,
      charge: response.data.data,
    };
  } catch (error: any) {
    console.error('Failed to cancel charge:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Resolve a charge (mark as resolved)
 */
export async function resolveCryptoCharge(chargeId: string) {
  try {
    const response = await axios.post(
      `${COINBASE_API_URL}/charges/${chargeId}/resolve`,
      {},
      {
        headers: {
          'X-CC-Api-Key': COINBASE_API_KEY,
          'X-CC-Version': '2018-03-22',
        },
      }
    );

    return {
      success: true,
      charge: response.data.data,
    };
  } catch (error: any) {
    console.error('Failed to resolve charge:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Verify webhook signature
 */
export function verifyCryptoWebhookSignature(
  payload: string,
  signature: string
): boolean {
  try {
    const crypto = require('crypto');
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET || '';

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Process webhook event
 */
export async function processCryptoWebhookEvent(event: any) {
  const { type, data } = event;

  switch (type) {
    case 'charge:created':
      console.log('Charge created:', data.id);
      // Store charge in database
      break;

    case 'charge:confirmed':
      console.log('Charge confirmed:', data.id);
      // Payment received, update order status
      break;

    case 'charge:failed':
      console.log('Charge failed:', data.id);
      // Payment failed, update order status
      break;

    case 'charge:delayed':
      console.log('Charge delayed:', data.id);
      // Payment delayed, notify user
      break;

    case 'charge:pending':
      console.log('Charge pending:', data.id);
      // Payment pending, waiting for confirmations
      break;

    case 'charge:resolved':
      console.log('Charge resolved:', data.id);
      // Charge resolved, finalize order
      break;

    default:
      console.log('Unhandled event type:', type);
  }
}

/**
 * Create crypto payment session for Sakshi
 */
export async function createCryptoPaymentSession(options: {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
}) {
  const charge = await createCryptoCharge({
    name: `Sakshi Order #${options.orderId}`,
    description: `Payment for order ${options.orderId}`,
    amount: options.amount,
    currency: options.currency,
    metadata: {
      orderId: options.orderId,
      customerName: options.customerName,
      customerEmail: options.customerEmail,
    },
    redirect_url: `${process.env.APP_URL}/orders/${options.orderId}/success`,
    cancel_url: `${process.env.APP_URL}/orders/${options.orderId}/cancel`,
  });

  if (charge.success) {
    return {
      success: true,
      session: {
        chargeId: charge.charge.id,
        hostedUrl: charge.charge.hosted_url,
        code: charge.charge.code,
        addresses: charge.charge.addresses,
        pricing: charge.charge.pricing,
        expiresAt: charge.charge.expires_at,
      },
    };
  }

  return charge;
}

/**
 * Get supported cryptocurrencies
 */
export function getSupportedCryptocurrencies() {
  return [
    {
      code: 'BTC',
      name: 'Bitcoin',
      icon: '/icons/crypto/btc.png',
    },
    {
      code: 'ETH',
      name: 'Ethereum',
      icon: '/icons/crypto/eth.png',
    },
    {
      code: 'USDC',
      name: 'USD Coin',
      icon: '/icons/crypto/usdc.png',
    },
    {
      code: 'DAI',
      name: 'Dai',
      icon: '/icons/crypto/dai.png',
    },
    {
      code: 'LTC',
      name: 'Litecoin',
      icon: '/icons/crypto/ltc.png',
    },
    {
      code: 'BCH',
      name: 'Bitcoin Cash',
      icon: '/icons/crypto/bch.png',
    },
  ];
}

/**
 * Get crypto payment instructions
 */
export function getCryptoPaymentInstructions() {
  return {
    steps: [
      'Choose your preferred cryptocurrency',
      'Copy the payment address or scan the QR code',
      'Send the exact amount from your wallet',
      'Wait for blockchain confirmation (usually 10-30 minutes)',
      'Your order will be confirmed automatically',
    ],
    notes: [
      'Send only the specified cryptocurrency to the address',
      'Sending wrong cryptocurrency may result in loss of funds',
      'Include the exact amount to avoid payment delays',
      'Transaction fees are separate and paid by you',
    ],
  };
}

/**
 * Convert fiat to crypto estimate
 */
export async function convertFiatToCrypto(
  amount: number,
  fromCurrency: string,
  toCrypto: string
) {
  try {
    // Use Coinbase exchange rates API
    const response = await axios.get(
      `https://api.coinbase.com/v2/exchange-rates?currency=${fromCurrency}`
    );

    const rate = response.data.data.rates[toCrypto];
    const cryptoAmount = amount / parseFloat(rate);

    return {
      success: true,
      amount: cryptoAmount,
      rate: parseFloat(rate),
      currency: toCrypto,
    };
  } catch (error: any) {
    console.error('Currency conversion failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  createCharge: createCryptoCharge,
  getCharge: getCryptoCharge,
  listCharges: listCryptoCharges,
  cancelCharge: cancelCryptoCharge,
  resolveCharge: resolveCryptoCharge,
  verifyWebhookSignature: verifyCryptoWebhookSignature,
  processWebhookEvent: processCryptoWebhookEvent,
  createSession: createCryptoPaymentSession,
  getSupportedCurrencies: getSupportedCryptocurrencies,
  getInstructions: getCryptoPaymentInstructions,
  convertFiatToCrypto,
};
