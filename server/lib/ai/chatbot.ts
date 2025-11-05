import OpenAI from 'openai';

/**
 * Sakshi Platform AI Chatbot
 * 24/7 Customer Support with Spiritual Awareness
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompt for Sakshi chatbot
const SAKSHI_SYSTEM_PROMPT = `You are Sakshi, an AI assistant for the Sakshi Platform - a conscious commerce platform inspired by spiritual values and sustainable living.

**Your Role:**
- Help users navigate the platform
- Answer questions about products, services, and the Seva token system
- Provide information about spiritual retreats and Isha cafés
- Assist with orders, payments, and account issues
- Embody compassion, mindfulness, and helpfulness

**Platform Features:**
- **Triple Pricing System**: Products can be purchased with money, seva tokens, or requested as donations
- **Seva Token Economy**: Users earn tokens through donations, volunteering, and referrals
- **Circular Economy**: Focus on repair, reuse, and sustainability
- **Spiritual Offerings**: Retreats, meditation resources, and Isha cafés
- **Product Categories**: Clothing, books, electronics, home & garden, sports, accessories

**Guidelines:**
- Be warm, helpful, and spiritually aware
- Use simple, clear language
- Provide specific, actionable answers
- When unsure, admit it and offer to connect with human support
- Respect all spiritual traditions and beliefs
- Encourage sustainable and conscious choices

**Tone:**
- Compassionate and patient
- Knowledgeable but humble
- Encouraging and supportive
- Professional yet friendly`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  userId?: string;
}

/**
 * Generate chatbot response
 */
export async function generateChatResponse(options: ChatOptions) {
  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: SAKSHI_SYSTEM_PROMPT },
      ...options.messages,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
      user: options.userId,
    });

    const response = completion.choices[0]?.message?.content || '';

    return {
      success: true,
      response,
      usage: completion.usage,
    };
  } catch (error: any) {
    console.error('Chatbot error:', error);
    return {
      success: false,
      error: error.message,
      response: "I apologize, but I'm having trouble responding right now. Please try again or contact our support team.",
    };
  }
}

/**
 * Generate suggested questions based on context
 */
export async function generateSuggestedQuestions(context: string) {
  try {
    const prompt = `Based on this context about the Sakshi Platform: "${context}"

Generate 3 helpful follow-up questions a user might want to ask. Format as a JSON array of strings.

Example: ["How do seva tokens work?", "What products are available?", "How can I volunteer?"]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You generate helpful follow-up questions.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    const questions = JSON.parse(response);

    return {
      success: true,
      questions,
    };
  } catch (error: any) {
    console.error('Failed to generate suggestions:', error);
    return {
      success: false,
      questions: [
        'How does the triple pricing system work?',
        'What are seva tokens?',
        'How can I browse products?',
      ],
    };
  }
}

/**
 * Analyze user intent
 */
export async function analyzeUserIntent(message: string) {
  try {
    const prompt = `Analyze this user message and determine the intent: "${message}"

Possible intents:
- product_search: User wants to find products
- order_inquiry: User asking about orders
- seva_tokens: User asking about seva tokens
- payment: User asking about payment methods
- retreats: User asking about spiritual retreats
- cafes: User asking about Isha cafés
- account: User asking about account issues
- general: General question or conversation

Respond with only the intent name.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 20,
    });

    const intent = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'general';

    return {
      success: true,
      intent,
    };
  } catch (error: any) {
    console.error('Intent analysis failed:', error);
    return {
      success: false,
      intent: 'general',
    };
  }
}

/**
 * Get context-aware response with platform data
 */
export async function getContextAwareResponse(
  message: string,
  platformContext?: {
    products?: any[];
    orders?: any[];
    sevaBalance?: number;
  }
) {
  try {
    // Add platform context to the message
    let contextualPrompt = message;

    if (platformContext) {
      contextualPrompt += '\n\nPlatform Context:';
      
      if (platformContext.sevaBalance !== undefined) {
        contextualPrompt += `\n- User's Seva Token Balance: ${platformContext.sevaBalance}`;
      }
      
      if (platformContext.orders && platformContext.orders.length > 0) {
        contextualPrompt += `\n- Recent Orders: ${platformContext.orders.length}`;
      }
      
      if (platformContext.products && platformContext.products.length > 0) {
        contextualPrompt += `\n- Available Products: ${platformContext.products.length}`;
      }
    }

    const response = await generateChatResponse({
      messages: [{ role: 'user', content: contextualPrompt }],
    });

    return response;
  } catch (error: any) {
    console.error('Context-aware response failed:', error);
    return {
      success: false,
      error: error.message,
      response: "I'm having trouble accessing that information right now.",
    };
  }
}

/**
 * Handle specific intents with custom logic
 */
export async function handleIntent(intent: string, message: string, context?: any) {
  switch (intent) {
    case 'product_search':
      return {
        response: "I can help you find products! What are you looking for? You can browse by category: Clothing, Books, Electronics, Home & Garden, Sports, or Accessories.",
        action: 'show_categories',
      };

    case 'order_inquiry':
      return {
        response: "I can help with your orders. Would you like to:\n1. Track an existing order\n2. View your order history\n3. Get help with a specific order",
        action: 'show_orders',
      };

    case 'seva_tokens':
      return {
        response: `Seva tokens are our gratitude currency! You can earn them by:\n- Making donations\n- Volunteering your time\n- Referring friends\n\nUse them to purchase items or donate to causes you care about. Current balance: ${context?.sevaBalance || 0} tokens.`,
        action: 'show_seva_wallet',
      };

    case 'payment':
      return {
        response: "We offer multiple payment options:\n- Pay with money (cards, UPI, netbanking)\n- Pay with seva tokens\n- Request as donation (if eligible)\n\nWhich would you like to know more about?",
        action: 'show_payment_options',
      };

    case 'retreats':
      return {
        response: "Our spiritual retreats offer transformative experiences in serene locations. Would you like to:\n1. Browse upcoming retreats\n2. Learn about retreat programs\n3. Check availability",
        action: 'show_retreats',
      };

    case 'cafes':
      return {
        response: "Isha cafés offer conscious dining experiences with organic, vegetarian food. Would you like to:\n1. Find a café near you\n2. View the menu\n3. Learn about our food philosophy",
        action: 'show_cafes',
      };

    default:
      return await generateChatResponse({
        messages: [{ role: 'user', content: message }],
      });
  }
}

/**
 * Get default suggested questions
 */
export function getDefaultSuggestedQuestions() {
  return [
    'How does the triple pricing system work?',
    'What are seva tokens and how do I earn them?',
    'What products are available?',
    'Tell me about spiritual retreats',
    'How can I volunteer?',
    'What payment methods do you accept?',
  ];
}

/**
 * Format chatbot response for frontend
 */
export function formatChatbotResponse(response: any) {
  return {
    message: response.response,
    timestamp: new Date().toISOString(),
    suggestions: response.suggestions || getDefaultSuggestedQuestions().slice(0, 3),
    action: response.action,
  };
}

export default {
  generateResponse: generateChatResponse,
  generateSuggestions: generateSuggestedQuestions,
  analyzeIntent: analyzeUserIntent,
  getContextAwareResponse,
  handleIntent,
  getDefaultSuggestions: getDefaultSuggestedQuestions,
  formatResponse: formatChatbotResponse,
};
