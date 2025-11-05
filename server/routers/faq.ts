import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "./helpers";
import { db } from "../db";
import { sql } from "drizzle-orm";

// FAQ schema (would be added to db/schema.ts)
// For now, we'll use in-memory storage as a placeholder

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage (replace with database in production)
let faqs: FAQ[] = [
  {
    id: 1,
    category: "General",
    question: "What is Sakshi Platform?",
    answer: "Sakshi (साक्षी - The Witness) is a spiritual thrift store platform that combines conscious consumption with community values. We offer products through three pricing models: traditional money, seva tokens (community currency), and free for those in need.",
    order: 1,
    published: true,
    helpful: 45,
    notHelpful: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    category: "Seva Tokens",
    question: "What are Seva Tokens?",
    answer: "Seva Tokens are our community currency that you earn by contributing to the community through volunteering, donating items, or participating in community activities. You can use these tokens to purchase products on our platform.",
    order: 1,
    published: true,
    helpful: 38,
    notHelpful: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    category: "Seva Tokens",
    question: "How do I earn Seva Tokens?",
    answer: "You can earn Seva Tokens by: 1) Volunteering at events or centers, 2) Donating quality items to the thrift store, 3) Referring friends who make purchases, 4) Participating in community activities, 5) Writing helpful product reviews.",
    order: 2,
    published: true,
    helpful: 52,
    notHelpful: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    category: "Shopping",
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment methods: 1) Traditional payments via Razorpay (cards, UPI, netbanking, wallets), 2) Direct UPI payments, 3) Cryptocurrency (BTC, ETH, USDC), 4) Seva Tokens, 5) Free (for those in need, subject to verification).",
    order: 1,
    published: true,
    helpful: 41,
    notHelpful: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    category: "Shopping",
    question: "How does shipping work?",
    answer: "We offer shipping across India. Shipping costs are calculated based on your location and order weight. Orders are typically processed within 1-2 business days and delivered within 5-7 business days. You'll receive tracking information via email.",
    order: 2,
    published: true,
    helpful: 33,
    notHelpful: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextId = 6;

export const faqRouter = router({
  // Get all FAQs (public)
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      let filtered = faqs.filter((faq) => faq.published);

      if (input.category) {
        filtered = filtered.filter((faq) => faq.category === input.category);
      }

      if (input.search) {
        const searchLower = input.search.toLowerCase();
        filtered = filtered.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchLower) ||
            faq.answer.toLowerCase().includes(searchLower)
        );
      }

      // Group by category
      const grouped = filtered.reduce((acc, faq) => {
        if (!acc[faq.category]) {
          acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
      }, {} as Record<string, FAQ[]>);

      // Sort within categories
      Object.keys(grouped).forEach((category) => {
        grouped[category].sort((a, b) => a.order - b.order);
      });

      return {
        faqs: grouped,
        categories: Object.keys(grouped).sort(),
      };
    }),

  // Get FAQ by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const faq = faqs.find((f) => f.id === input.id && f.published);
      if (!faq) {
        throw new Error("FAQ not found");
      }
      return faq;
    }),

  // Get all categories
  getCategories: publicProcedure.query(async () => {
    const categories = [...new Set(faqs.filter((f) => f.published).map((f) => f.category))];
    return categories.sort();
  }),

  // Search FAQs
  search: publicProcedure
    .input(z.object({ query: z.string().min(2) }))
    .query(async ({ input }) => {
      const searchLower = input.query.toLowerCase();
      const results = faqs
        .filter((faq) => faq.published)
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchLower) ||
            faq.answer.toLowerCase().includes(searchLower) ||
            faq.category.toLowerCase().includes(searchLower)
        )
        .map((faq) => ({
          ...faq,
          relevance: calculateRelevance(faq, searchLower),
        }))
        .sort((a, b) => b.relevance - a.relevance);

      return results;
    }),

  // Mark FAQ as helpful
  markHelpful: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const faq = faqs.find((f) => f.id === input.id);
      if (!faq) {
        throw new Error("FAQ not found");
      }
      faq.helpful += 1;
      return { helpful: faq.helpful };
    }),

  // Mark FAQ as not helpful
  markNotHelpful: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const faq = faqs.find((f) => f.id === input.id);
      if (!faq) {
        throw new Error("FAQ not found");
      }
      faq.notHelpful += 1;
      return { notHelpful: faq.notHelpful };
    }),

  // Admin: Get all FAQs (including unpublished)
  adminGetAll: adminProcedure.query(async () => {
    const grouped = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, FAQ[]>);

    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.order - b.order);
    });

    return {
      faqs: grouped,
      categories: Object.keys(grouped).sort(),
      total: faqs.length,
      published: faqs.filter((f) => f.published).length,
      unpublished: faqs.filter((f) => !f.published).length,
    };
  }),

  // Admin: Create FAQ
  adminCreate: adminProcedure
    .input(
      z.object({
        category: z.string().min(2).max(100),
        question: z.string().min(10).max(500),
        answer: z.string().min(20).max(5000),
        order: z.number().int().min(0).default(0),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const newFaq: FAQ = {
        id: nextId++,
        category: input.category,
        question: input.question,
        answer: input.answer,
        order: input.order,
        published: input.published,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      faqs.push(newFaq);
      return newFaq;
    }),

  // Admin: Update FAQ
  adminUpdate: adminProcedure
    .input(
      z.object({
        id: z.number(),
        category: z.string().min(2).max(100).optional(),
        question: z.string().min(10).max(500).optional(),
        answer: z.string().min(20).max(5000).optional(),
        order: z.number().int().min(0).optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const faq = faqs.find((f) => f.id === input.id);
      if (!faq) {
        throw new Error("FAQ not found");
      }

      if (input.category !== undefined) faq.category = input.category;
      if (input.question !== undefined) faq.question = input.question;
      if (input.answer !== undefined) faq.answer = input.answer;
      if (input.order !== undefined) faq.order = input.order;
      if (input.published !== undefined) faq.published = input.published;
      faq.updatedAt = new Date();

      return faq;
    }),

  // Admin: Delete FAQ
  adminDelete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const index = faqs.findIndex((f) => f.id === input.id);
      if (index === -1) {
        throw new Error("FAQ not found");
      }

      faqs.splice(index, 1);
      return { success: true };
    }),

  // Admin: Reorder FAQs
  adminReorder: adminProcedure
    .input(
      z.object({
        category: z.string(),
        faqIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const { category, faqIds } = input;

      faqIds.forEach((id, index) => {
        const faq = faqs.find((f) => f.id === id && f.category === category);
        if (faq) {
          faq.order = index;
          faq.updatedAt = new Date();
        }
      });

      return { success: true };
    }),

  // Admin: Get FAQ statistics
  adminGetStatistics: adminProcedure.query(async () => {
    const total = faqs.length;
    const published = faqs.filter((f) => f.published).length;
    const unpublished = total - published;

    const byCategory = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = 0;
      }
      acc[faq.category] += 1;
      return acc;
    }, {} as Record<string, number>);

    const mostHelpful = [...faqs]
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, 5)
      .map((f) => ({
        id: f.id,
        question: f.question,
        helpful: f.helpful,
        notHelpful: f.notHelpful,
      }));

    const leastHelpful = [...faqs]
      .filter((f) => f.helpful + f.notHelpful > 10)
      .sort((a, b) => {
        const ratioA = a.helpful / (a.helpful + a.notHelpful);
        const ratioB = b.helpful / (b.helpful + b.notHelpful);
        return ratioA - ratioB;
      })
      .slice(0, 5)
      .map((f) => ({
        id: f.id,
        question: f.question,
        helpful: f.helpful,
        notHelpful: f.notHelpful,
        ratio: (f.helpful / (f.helpful + f.notHelpful) * 100).toFixed(1),
      }));

    return {
      total,
      published,
      unpublished,
      byCategory,
      mostHelpful,
      leastHelpful,
    };
  }),
});

// Helper function to calculate search relevance
function calculateRelevance(faq: FAQ, searchTerm: string): number {
  let score = 0;

  // Exact match in question (highest priority)
  if (faq.question.toLowerCase() === searchTerm) {
    score += 100;
  } else if (faq.question.toLowerCase().includes(searchTerm)) {
    score += 50;
  }

  // Match in answer
  if (faq.answer.toLowerCase().includes(searchTerm)) {
    score += 25;
  }

  // Match in category
  if (faq.category.toLowerCase().includes(searchTerm)) {
    score += 10;
  }

  // Boost by helpfulness
  const helpfulnessRatio = faq.helpful / (faq.helpful + faq.notHelpful + 1);
  score += helpfulnessRatio * 20;

  return score;
}
