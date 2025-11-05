# Sakshi Platform - AI Chatbot & Smart Features Guide

## Overview

This guide walks you through implementing AI-powered features for the Sakshi platform, including a customer support chatbot, smart product search, and personalized recommendations.

**AI Features:**
- 🤖 24/7 Customer Support Chatbot
- 🔍 Smart Product Search (Natural Language)
- 🎯 Personalized Recommendations
- 📸 Image Recognition for Product Uploads
- 💬 Multilingual Support

**Estimated Time**: 2-3 hours

---

## Table of Contents

1. [AI Chatbot Implementation](#ai-chatbot-implementation)
2. [Smart Product Search](#smart-product-search)
3. [Personalized Recommendations](#personalized-recommendations)
4. [Image Recognition](#image-recognition)
5. [Testing AI Features](#testing-ai-features)

---

## AI Chatbot Implementation

### Option A: Using OpenAI GPT-4

#### Step 1: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys**
4. Click **"Create new secret key"**
5. Save the key: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### Step 2: Install Dependencies

```bash
cd /home/ubuntu/sakshi
pnpm add openai
```

#### Step 3: Configure Environment

```bash
# AI - OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview
```

#### Step 4: Create Chatbot Backend

```typescript
// server/routers/chatbot.ts
import { z } from 'zod';
import { OpenAI } from 'openai';
import { router, publicProcedure } from '../trpc';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for Sakshi chatbot
const SYSTEM_PROMPT = `You are a helpful customer support assistant for Sakshi Platform, a circular economy e-commerce platform with spiritual values inspired by Adiyogi.

About Sakshi:
- Sakshi means "witness" in Sanskrit
- We offer a triple pricing system: money, seva tokens, or free
- Seva tokens are earned through donations, volunteering, and referrals
- We promote circular economy through repair cafés, donations, and sustainable practices
- We offer spiritual retreats and meditation programs
- All products are pre-loved, refurbished, or donated items

Your role:
- Answer questions about products, orders, and services
- Help users understand the seva token system
- Provide information about retreats and cafés
- Guide users through the shopping process
- Be warm, helpful, and spiritually mindful
- Use simple, clear language
- If you don't know something, admit it and offer to connect them with human support

Never:
- Make up product information
- Promise things outside your knowledge
- Discuss pricing you're not sure about
- Share personal user data
`;

export const chatbotRouter = router({
  // Send message to chatbot
  sendMessage: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(1000),
      conversationHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })).optional(),
      context: z.object({
        userId: z.string().optional(),
        currentPage: z.string().optional(),
        cartItems: z.number().optional(),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Build messages array
      const messages: any[] = [
        { role: 'system', content: SYSTEM_PROMPT },
      ];

      // Add conversation history
      if (input.conversationHistory) {
        messages.push(...input.conversationHistory);
      }

      // Add context if available
      if (input.context) {
        let contextMessage = '';
        if (input.context.currentPage) {
          contextMessage += `User is currently on: ${input.context.currentPage}. `;
        }
        if (input.context.cartItems) {
          contextMessage += `User has ${input.context.cartItems} items in cart. `;
        }
        if (contextMessage) {
          messages.push({
            role: 'system',
            content: `Context: ${contextMessage}`,
          });
        }
      }

      // Add user message
      messages.push({
        role: 'user',
        content: input.message,
      });

      // Get response from OpenAI
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0].message.content;

      return {
        message: response,
        timestamp: new Date().toISOString(),
      };
    }),

  // Get suggested questions
  getSuggestedQuestions: publicProcedure
    .query(() => {
      return [
        'How does the seva token system work?',
        'What products do you have available?',
        'Tell me about spiritual retreats',
        'How can I donate items?',
        'What is a repair café?',
        'How do I track my order?',
      ];
    }),
});
```

#### Step 5: Create Chatbot Frontend Component

```typescript
// client/src/components/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Send, X, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = trpc.chatbot.sendMessage.useMutation();
  const suggestedQuestions = trpc.chatbot.getSuggestedQuestions.useQuery();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessage.mutateAsync({
        message: input,
        conversationHistory: messages,
        context: {
          currentPage: window.location.pathname,
        },
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or contact support.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 animate-slideInRight">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Sakshi Assistant</h3>
              <p className="text-xs opacity-90">Always here to help 🙏</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p className="mb-4">Welcome to Sakshi! 🌿</p>
                <p className="text-sm">How can I help you today?</p>
                
                {/* Suggested Questions */}
                <div className="mt-6 space-y-2">
                  {suggestedQuestions.data?.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="block w-full text-left p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

#### Step 6: Add Chatbot to App

```typescript
// client/src/App.tsx
import { Chatbot } from '@/components/Chatbot';

export function App() {
  return (
    <div className="app">
      {/* ... other components */}
      
      <Chatbot />
    </div>
  );
}
```

---

## Smart Product Search

### Natural Language Search with AI

```typescript
// server/routers/search.ts
import { z } from 'zod';
import { OpenAI } from 'openai';
import { router, publicProcedure } from '../trpc';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const searchRouter = router({
  // Smart search with natural language
  smartSearch: publicProcedure
    .input(z.object({
      query: z.string().min(1),
    }))
    .query(async ({ input, ctx }) => {
      // Use AI to understand the query
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a search query analyzer for an e-commerce platform. 
            Extract search intent, categories, price range, and conditions from natural language queries.
            Respond with JSON only.`,
          },
          {
            role: 'user',
            content: `Query: "${input.query}"
            
            Extract:
            - keywords: array of relevant search terms
            - categories: array of product categories (clothing, books, electronics, home-garden, toys-games, sports-outdoors)
            - priceRange: {min: number, max: number} or null
            - condition: "excellent" | "good" | "fair" | null
            - intent: brief description of what user wants`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const searchIntent = JSON.parse(completion.choices[0].message.content!);

      // Build database query based on AI understanding
      let query = ctx.db.select().from(products);

      // Apply filters based on AI analysis
      const conditions = [];

      if (searchIntent.keywords?.length > 0) {
        const keywordConditions = searchIntent.keywords.map((keyword: string) =>
          or(
            like(products.name, `%${keyword}%`),
            like(products.description, `%${keyword}%`)
          )
        );
        conditions.push(or(...keywordConditions));
      }

      if (searchIntent.categories?.length > 0) {
        // Filter by categories
      }

      if (searchIntent.priceRange) {
        conditions.push(
          and(
            gte(products.price, searchIntent.priceRange.min),
            lte(products.price, searchIntent.priceRange.max)
          )
        );
      }

      if (searchIntent.condition) {
        conditions.push(eq(products.condition, searchIntent.condition));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const results = await query.limit(20);

      return {
        results,
        searchIntent,
        query: input.query,
      };
    }),
});
```

### Smart Search Component

```typescript
// client/src/components/SmartSearch.tsx
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Search, Sparkles } from 'lucide-react';

export function SmartSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const smartSearch = trpc.search.smartSearch.useQuery(
    { query },
    { enabled: false }
  );

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    await smartSearch.refetch();
    setIsSearching(false);
  };

  return (
    <div className="smart-search">
      <div className="search-input-container">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Try: 'yoga mat under 500' or 'excellent condition books'"
            className="w-full px-4 py-3 pl-12 pr-32 border-2 border-purple-200 rounded-lg focus:border-purple-600 focus:outline-none"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <div className="absolute right-2 top-2 flex items-center space-x-2">
            <span className="text-xs text-purple-600 flex items-center">
              <Sparkles size={14} className="mr-1" />
              AI-Powered
            </span>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-purple-600 text-white px-4 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {smartSearch.data && (
        <div className="search-results mt-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
            <p className="text-sm text-purple-900 dark:text-purple-100">
              <strong>Understanding:</strong> {smartSearch.data.searchIntent.intent}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {smartSearch.data.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Personalized Recommendations

### AI-Based Product Recommendations

```typescript
// server/routers/recommendations.ts
export const recommendationsRouter = router({
  getRecommendations: protectedProcedure
    .input(z.object({
      limit: z.number().default(6),
    }))
    .query(async ({ input, ctx }) => {
      // Get user's order history
      const userOrders = await ctx.db.query.orders.findMany({
        where: eq(orders.userId, ctx.user.id),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });

      // Extract categories and preferences
      const purchasedCategories = new Set();
      const purchasedProducts = new Set();
      
      userOrders.forEach((order) => {
        order.items.forEach((item) => {
          purchasedCategories.add(item.product.categoryId);
          purchasedProducts.add(item.product.id);
        });
      });

      // Use AI to generate personalized recommendations
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a product recommendation engine for a circular economy platform.',
          },
          {
            role: 'user',
            content: `User has purchased products in categories: ${Array.from(purchasedCategories).join(', ')}.
            Suggest ${input.limit} complementary product types they might be interested in.
            Respond with JSON array of product types.`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const suggestions = JSON.parse(completion.choices[0].message.content!);

      // Find matching products
      const recommendations = await ctx.db.select()
        .from(products)
        .where(
          and(
            notInArray(products.id, Array.from(purchasedProducts)),
            eq(products.isAvailable, true)
          )
        )
        .limit(input.limit);

      return recommendations;
    }),
});
```

---

## Image Recognition

### Product Image Analysis

```typescript
// server/routers/imageRecognition.ts
export const imageRecognitionRouter = router({
  analyzeProductImage: protectedProcedure
    .input(z.object({
      imageUrl: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this product image and provide:
                1. Product category
                2. Condition (excellent/good/fair)
                3. Suggested title
                4. Brief description
                5. Estimated price range in INR
                
                Respond with JSON only.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: input.imageUrl,
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500,
      });

      const analysis = JSON.parse(response.choices[0].message.content!);

      return analysis;
    }),
});
```

---

## Testing AI Features

### Test Chatbot

```bash
# Start dev server
pnpm dev

# Open browser
# Click chatbot button
# Try questions:
# - "How does seva token work?"
# - "What products do you have?"
# - "Tell me about retreats"
```

### Test Smart Search

```bash
# Try natural language queries:
# - "yoga mat under 500"
# - "excellent condition books about meditation"
# - "electronics in good condition"
```

### Test Recommendations

```bash
# Place some orders
# View recommendations on homepage
# Should see personalized suggestions
```

---

## Cost Estimation

### OpenAI Pricing

- **GPT-4 Turbo**: $0.01 per 1K input tokens, $0.03 per 1K output tokens
- **GPT-3.5 Turbo**: $0.0005 per 1K input tokens, $0.0015 per 1K output tokens
- **GPT-4 Vision**: $0.01 per image

**Example**: 1000 chatbot conversations ≈ $5-10

---

## Checklist

- [ ] OpenAI API key obtained
- [ ] Dependencies installed
- [ ] Chatbot backend implemented
- [ ] Chatbot frontend component created
- [ ] Smart search implemented
- [ ] Recommendations system working
- [ ] Image recognition tested
- [ ] Error handling implemented
- [ ] Rate limiting configured

---

## Next Steps

1. ✅ **Configure email notifications** (next phase)
2. ✅ **Add analytics tracking**
3. ✅ **Implement A/B testing** for AI features
4. ✅ **Monitor AI costs** and optimize
5. ✅ **Collect user feedback** on AI features

---

*For payment integration, see `PAYMENT_INTEGRATION_GUIDE.md`*  
*For external services, see `EXTERNAL_SERVICES_GUIDE.md`*  
*For deployment, see `RAILWAY_DEPLOYMENT_GUIDE.md`*
