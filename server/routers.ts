import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { razorpayRouter } from "./routers/payments/razorpay";
import { upiRouter } from "./routers/payments/upi";
import { cryptoRouter } from "./routers/payments/crypto";
import { chatbotRouter } from "./routers/ai/chatbot";
import { smartSearchRouter } from "./routers/ai/smart-search";
import { pricingRouter } from "./routes/pricing";
import { visualSearchRouter } from "./routes/visual-search";
import { recommendationsRouter } from "./routes/recommendations";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== PAYMENTS ====================
  payments: router({
    razorpay: razorpayRouter,
    upi: upiRouter,
    crypto: cryptoRouter,
  }),

  // ==================== AI FEATURES ====================
  ai: router({
    chatbot: chatbotRouter,
    smartSearch: smartSearchRouter,
  }),

  // ==================== DYNAMIC PRICING ====================
  pricing: pricingRouter,

  // ==================== VISUAL SEARCH ====================
  visualSearch: visualSearchRouter,

  // ==================== RECOMMENDATIONS ====================
  recommendations: recommendationsRouter,

  // ==================== SEVA WALLET ====================
  seva: router({
    getWallet: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrCreateSevaWallet(ctx.user.id);
    }),
    
    getTransactions: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getSevaTransactions(ctx.user.id, input.limit);
      }),
  }),

  // ==================== CATEGORIES ====================
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getCategoryBySlug(input.slug);
      }),
  }),

  // ==================== PRODUCTS ====================
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        condition: z.enum(['excellent', 'good', 'fair', 'worn']).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        status: z.enum(['available', 'sold', 'reserved', 'donated_out']).optional(),
        search: z.string().optional(),
        isFeatured: z.boolean().optional(),
        isChildrenFree: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getProducts(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await db.getProductBySlug(input.slug);
        if (product) {
          await db.incrementProductViews(product.id);
        }
        return product;
      }),
    
    getFeatured: publicProcedure.query(async () => {
      return await db.getProducts({ isFeatured: true, status: 'available', limit: 8 });
    }),
    
    getChildrenFree: publicProcedure.query(async () => {
      return await db.getProducts({ isChildrenFree: true, status: 'available' });
    }),
  }),

  // ==================== CART ====================
  cart: router({
    get: publicProcedure
      .input(z.object({ 
        userId: z.number().optional(),
        sessionId: z.string().optional()
      }))
      .query(async ({ input }) => {
        const cart = await db.getOrCreateCart(input.userId, input.sessionId);
        if (!cart) return { cart: null, items: [] };
        const items = await db.getCartItems(cart.id);
        return { cart, items };
      }),
    
    addItem: publicProcedure
      .input(z.object({
        userId: z.number().optional(),
        sessionId: z.string().optional(),
        productId: z.number(),
        paymentMethod: z.enum(['money', 'seva_tokens', 'free']).optional(),
        selectedPrice: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const cart = await db.getOrCreateCart(input.userId, input.sessionId);
        if (!cart) throw new Error('Failed to create cart');
        return await db.addToCart(cart.id, input.productId, input.paymentMethod, input.selectedPrice);
      }),
    
    removeItem: publicProcedure
      .input(z.object({ cartItemId: z.number() }))
      .mutation(async ({ input }) => {
        await db.removeFromCart(input.cartItemId);
        return { success: true };
      }),
    
    clear: publicProcedure
      .input(z.object({ cartId: z.number() }))
      .mutation(async ({ input }) => {
        await db.clearCart(input.cartId);
        return { success: true };
      }),
  }),

  // ==================== ORDERS ====================
  orders: router({
    create: publicProcedure
      .input(z.object({
        userId: z.number().optional(),
        customerName: z.string().optional(),
        customerEmail: z.string().optional(),
        customerPhone: z.string().optional(),
        paymentMethod: z.enum(['money', 'seva_tokens', 'free', 'mixed']),
        fulfillmentType: z.enum(['pickup', 'delivery']),
        deliveryAddress: z.string().optional(),
        deliveryCity: z.string().optional(),
        deliveryState: z.string().optional(),
        deliveryPostalCode: z.string().optional(),
        notes: z.string().optional(),
        items: z.array(z.object({
          productId: z.number(),
          paymentMethod: z.enum(['money', 'seva_tokens', 'free']),
          pricePaid: z.number(),
          tokensPaid: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        const { items, ...orderData } = input;
        
        const totalAmount = items.reduce((sum, item) => sum + item.pricePaid, 0);
        const tokensUsed = items.reduce((sum, item) => sum + item.tokensPaid, 0);
        
        const order = await db.createOrder(
          {
            ...orderData,
            totalAmount,
            tokensUsed,
            paymentStatus: 'completed',
            fulfillmentStatus: 'pending',
            orderNumber: '', // Will be generated in createOrder
          },
          items
        );

        if (order && tokensUsed > 0 && input.userId) {
          await db.spendSevaTokens(
            input.userId,
            tokensUsed,
            `Order ${order.orderNumber}`,
            'order',
            order.id
          );
        }

        return order;
      }),
    
    getById: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrderById(input.orderId);
      }),
    
    getUserOrders: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserOrders(ctx.user.id);
    }),
  }),

  // ==================== DONATIONS ====================
  donations: router({
    create: publicProcedure
      .input(z.object({
        donorName: z.string(),
        donorEmail: z.string().optional(),
        donorPhone: z.string().optional(),
        donorAddress: z.string().optional(),
        itemsDescription: z.string(),
        estimatedValue: z.number().optional(),
        numberOfItems: z.number().optional(),
        pickupDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createDonation({
          ...input,
          receiptNumber: '', // Will be generated in createDonation
        });
      }),
    
    list: publicProcedure
      .input(z.object({ status: z.string().optional() }))
      .query(async ({ input }) => {
        return await db.getDonations(input.status);
      }),
  }),

  // ==================== VOLUNTEER ====================
  volunteer: router({
    getMyShifts: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserVolunteerShifts(ctx.user.id);
    }),
    
    createShift: protectedProcedure
      .input(z.object({
        shiftType: z.string(),
        shiftDate: z.date(),
        startTime: z.string(),
        endTime: z.string(),
        hoursWorked: z.number(),
        tokensEarned: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createVolunteerShift({
          ...input,
          userId: ctx.user.id,
          status: 'scheduled',
        });
      }),
  }),

  // ==================== EVENTS ====================
  events: router({
    list: publicProcedure
      .input(z.object({ 
        type: z.enum(['repair_cafe', 'swap_event', 'upcycle_workshop', 'community']).optional(),
        activeOnly: z.boolean().optional()
      }).optional())
      .query(async ({ input }) => {
        return await db.getEvents(input?.type, input?.activeOnly);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getEventBySlug(input.slug);
      }),
    
    register: publicProcedure
      .input(z.object({
        eventId: z.number(),
        userId: z.number().optional(),
        guestName: z.string().optional(),
        guestEmail: z.string().optional(),
        guestPhone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { eventId, userId, guestName, guestEmail, guestPhone } = input;
        return await db.registerForEvent(
          eventId,
          userId,
          guestName ? { name: guestName, email: guestEmail!, phone: guestPhone } : undefined
        );
      }),
  }),

  // ==================== IMPACT ====================
  impact: router({
    getLatest: publicProcedure.query(async () => {
      return await db.getLatestImpactMetrics();
    }),
    
    getTotal: publicProcedure.query(async () => {
      return await db.getTotalImpactMetrics();
    }),
  }),

  // ==================== LEGACY AI FEATURES (moved to ai router above) ====================
  // Keeping for backward compatibility
  aiLegacy: router({
    // Customer assistance chatbot
    customerChat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(['system', 'user', 'assistant']),
          content: z.string()
        }))
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: input.messages as any,
        });
        
        return response.choices[0].message.content || "I'm sorry, I couldn't process that. Please try again.";
      }),
    
    getProductRecommendations: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        // Get the current product
        const product = await db.getProductById(input.productId);
        if (!product) return [];

        // Get all products to recommend from
        const allProducts = await db.getProducts({});
        const otherProducts = allProducts.filter((p: any) => p.id !== input.productId);

        // Use AI to analyze and recommend similar products
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for a thrift store that recommends similar products. Analyze the given product and recommend 3-4 similar items from the list based on category, condition, price range, and story/description similarity. Return only a JSON array of product IDs."
            },
            {
              role: "user",
              content: `Current product: ${JSON.stringify({ id: product.id, name: product.name, category: product.categoryId, condition: product.condition, suggestedPrice: product.suggestedPrice, description: product.description })}\n\nAvailable products: ${JSON.stringify(otherProducts.map((p: any) => ({ id: p.id, name: p.name, category: p.categoryId, condition: p.condition, suggestedPrice: p.suggestedPrice, description: p.description })))}`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "product_recommendations",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  recommendedIds: {
                    type: "array",
                    items: { type: "number" },
                    description: "Array of recommended product IDs"
                  }
                },
                required: ["recommendedIds"],
                additionalProperties: false
              }
            }
          }
        });

        const messageContent = response.choices[0].message.content;
        const result = JSON.parse(typeof messageContent === 'string' ? messageContent : "{}");
        const recommendedIds = result.recommendedIds || [];
        
        // Return the recommended products
        return otherProducts.filter((p: any) => recommendedIds.includes(p.id)).slice(0, 4);
      }),

    // Smart natural language search
    smartSearch: publicProcedure
      .input(z.object({
        query: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { query } = input;
        
        // Get all products
        const allProducts = await db.getProducts({});
        
        if (!allProducts || allProducts.length === 0) {
          return { products: [], interpretation: "No products available." };
        }
        
        // Use LLM to understand the query and match products
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an intelligent search assistant for a thrift store. Analyze the user's natural language query and match it with available products. Consider: category, condition, color, size, age appropriateness, price range, style, and any other attributes mentioned. Return product IDs that match the query, ordered by relevance (best matches first). Also provide a brief interpretation of what the user is looking for."
            },
            {
              role: "user",
              content: `User query: "${query}"\n\nAvailable products: ${JSON.stringify(allProducts.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                category: p.categoryId,
                condition: p.condition,
                suggestedPrice: p.suggestedPrice,
                minimumPrice: p.minimumPrice,
                maximumPrice: p.maximumPrice,
                color: p.color,
                size: p.size,
                brand: p.brand
              })))}`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "smart_search_results",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  matchedIds: {
                    type: "array",
                    items: { type: "number" },
                    description: "Array of matching product IDs, ordered by relevance"
                  },
                  interpretation: {
                    type: "string",
                    description: "Brief explanation of what the user is searching for"
                  }
                },
                required: ["matchedIds", "interpretation"],
                additionalProperties: false
              }
            }
          }
        });
        
        const messageContent = response.choices[0].message.content;
        const result = JSON.parse(typeof messageContent === 'string' ? messageContent : "{}");
        const matchedIds = result.matchedIds || [];
        const interpretation = result.interpretation || "";
        
        // Return the matched products
        const matchedProducts = allProducts.filter((p: any) => matchedIds.includes(p.id));
        
        return {
          products: matchedProducts,
          interpretation,
          totalResults: matchedProducts.length
        };
      }),
  }),

  // ==================== SAKSHI CAFÉS ====================
  cafes: router({
    // List all cafés
    list: publicProcedure.query(async () => {
      return await db.getAllCafes();
    }),
    
    // Get café by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getCafeBySlug(input.slug);
      }),
    
    // Get café menu
    getMenu: publicProcedure
      .input(z.object({ cafeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCafeMenu(input.cafeId);
      }),
    
    // Get café members
    getMembers: publicProcedure
      .input(z.object({ cafeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCafeMembers(input.cafeId);
      }),
    
    // Submit cooperative application
    submitApplication: publicProcedure
      .input(z.object({
        fullName: z.string(),
        age: z.number(),
        phone: z.string(),
        email: z.string().optional(),
        city: z.string(),
        experience: z.string().optional(),
        motivation: z.string(),
        availability: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCafeApplication(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
