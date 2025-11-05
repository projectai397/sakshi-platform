import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "./helpers";
import { db } from "../db";
import { sql } from "drizzle-orm";

// Blog post schema (would be added to db/schema.ts)
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  category: string;
  tags: string[];
  authorId: number;
  authorName: string;
  published: boolean;
  publishedAt: Date | null;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage (replace with database in production)
let blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Journey of Conscious Consumption",
    slug: "journey-of-conscious-consumption",
    excerpt: "Discover how mindful shopping can transform not just your wardrobe, but your entire relationship with material possessions.",
    content: `# The Journey of Conscious Consumption

In today's fast-paced world, we often find ourselves caught in the cycle of endless consumption. But what if there was a better way?

## Understanding Conscious Consumption

Conscious consumption is about making intentional choices about what we buy, why we buy it, and how it impacts the world around us.

## The Three Pillars

1. **Mindfulness** - Being aware of our purchasing decisions
2. **Sustainability** - Choosing products that don't harm the environment
3. **Community** - Supporting local and ethical businesses

## How Sakshi Helps

At Sakshi, we believe in the power of thrift shopping combined with spiritual values. Our platform offers:

- Quality pre-loved items
- Seva token economy for community contribution
- Free items for those in need

## Start Your Journey Today

Begin by asking yourself: "Do I really need this?" More often than not, you'll find that less is truly more.`,
    featuredImage: "/images/blog/conscious-consumption.jpg",
    category: "Sustainability",
    tags: ["conscious living", "sustainability", "mindfulness"],
    authorId: 1,
    authorName: "Admin",
    published: true,
    publishedAt: new Date("2025-11-01"),
    views: 245,
    likes: 34,
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2025-11-01"),
  },
  {
    id: 2,
    title: "Understanding Seva Tokens: A New Economy",
    slug: "understanding-seva-tokens",
    excerpt: "Learn how our community currency system works and how you can earn tokens by contributing to the community.",
    content: `# Understanding Seva Tokens

Seva Tokens represent a revolutionary approach to community economics...`,
    featuredImage: "/images/blog/seva-tokens.jpg",
    category: "Community",
    tags: ["seva tokens", "community", "economy"],
    authorId: 1,
    authorName: "Admin",
    published: true,
    publishedAt: new Date("2025-10-28"),
    views: 189,
    likes: 27,
    createdAt: new Date("2025-10-28"),
    updatedAt: new Date("2025-10-28"),
  },
];

let nextId = 3;

export const blogRouter = router({
  // Get all published posts
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        category: z.string().optional(),
        tag: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, category, tag, search } = input;
      const offset = (page - 1) * limit;

      let filtered = blogPosts.filter((post) => post.published);

      if (category) {
        filtered = filtered.filter((post) => post.category === category);
      }

      if (tag) {
        filtered = filtered.filter((post) => post.tags.includes(tag));
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchLower) ||
            post.excerpt.toLowerCase().includes(searchLower) ||
            post.content.toLowerCase().includes(searchLower) ||
            post.tags.some((t) => t.toLowerCase().includes(searchLower))
        );
      }

      // Sort by published date (newest first)
      filtered.sort((a, b) => {
        const dateA = a.publishedAt?.getTime() || 0;
        const dateB = b.publishedAt?.getTime() || 0;
        return dateB - dateA;
      });

      const paginated = filtered.slice(offset, offset + limit);

      return {
        posts: paginated,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
        },
      };
    }),

  // Get post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = blogPosts.find((p) => p.slug === input.slug && p.published);
      if (!post) {
        throw new Error("Post not found");
      }

      // Increment views
      post.views += 1;

      return post;
    }),

  // Get related posts
  getRelated: publicProcedure
    .input(z.object({ postId: z.number(), limit: z.number().min(1).max(10).default(3) }))
    .query(async ({ input }) => {
      const post = blogPosts.find((p) => p.id === input.postId);
      if (!post) {
        return [];
      }

      // Find posts with similar tags or category
      const related = blogPosts
        .filter((p) => p.id !== input.postId && p.published)
        .map((p) => {
          let score = 0;
          if (p.category === post.category) score += 5;
          const commonTags = p.tags.filter((t) => post.tags.includes(t)).length;
          score += commonTags * 2;
          return { post: p, score };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, input.limit)
        .map((r) => r.post);

      return related;
    }),

  // Get all categories
  getCategories: publicProcedure.query(async () => {
    const categories = [...new Set(blogPosts.filter((p) => p.published).map((p) => p.category))];
    return categories.sort();
  }),

  // Get all tags
  getTags: publicProcedure.query(async () => {
    const allTags = blogPosts
      .filter((p) => p.published)
      .flatMap((p) => p.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }),

  // Get popular posts
  getPopular: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(5) }))
    .query(async ({ input }) => {
      const popular = blogPosts
        .filter((p) => p.published)
        .sort((a, b) => b.views - a.views)
        .slice(0, input.limit);

      return popular;
    }),

  // Get recent posts
  getRecent: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(5) }))
    .query(async ({ input }) => {
      const recent = blogPosts
        .filter((p) => p.published)
        .sort((a, b) => {
          const dateA = a.publishedAt?.getTime() || 0;
          const dateB = b.publishedAt?.getTime() || 0;
          return dateB - dateA;
        })
        .slice(0, input.limit);

      return recent;
    }),

  // Like post
  like: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input }) => {
      const post = blogPosts.find((p) => p.id === input.postId);
      if (!post) {
        throw new Error("Post not found");
      }

      post.likes += 1;
      return { likes: post.likes };
    }),

  // Admin: Get all posts (including unpublished)
  adminGetAll: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        status: z.enum(["all", "published", "draft"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, status } = input;
      const offset = (page - 1) * limit;

      let filtered = blogPosts;

      if (status === "published") {
        filtered = filtered.filter((p) => p.published);
      } else if (status === "draft") {
        filtered = filtered.filter((p) => !p.published);
      }

      // Sort by updated date (newest first)
      filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      const paginated = filtered.slice(offset, offset + limit);

      return {
        posts: paginated,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
        },
        statistics: {
          total: blogPosts.length,
          published: blogPosts.filter((p) => p.published).length,
          draft: blogPosts.filter((p) => !p.published).length,
        },
      };
    }),

  // Admin: Create post
  adminCreate: adminProcedure
    .input(
      z.object({
        title: z.string().min(10).max(200),
        slug: z.string().min(5).max(200),
        excerpt: z.string().min(20).max(500),
        content: z.string().min(100),
        featuredImage: z.string().url().optional(),
        category: z.string().min(2).max(100),
        tags: z.array(z.string()).max(10),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if slug already exists
      const existing = blogPosts.find((p) => p.slug === input.slug);
      if (existing) {
        throw new Error("A post with this slug already exists");
      }

      const newPost: BlogPost = {
        id: nextId++,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        featuredImage: input.featuredImage || null,
        category: input.category,
        tags: input.tags,
        authorId: ctx.user.id,
        authorName: ctx.user.username || "Admin",
        published: input.published,
        publishedAt: input.published ? new Date() : null,
        views: 0,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      blogPosts.push(newPost);
      return newPost;
    }),

  // Admin: Update post
  adminUpdate: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(10).max(200).optional(),
        slug: z.string().min(5).max(200).optional(),
        excerpt: z.string().min(20).max(500).optional(),
        content: z.string().min(100).optional(),
        featuredImage: z.string().url().nullable().optional(),
        category: z.string().min(2).max(100).optional(),
        tags: z.array(z.string()).max(10).optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const post = blogPosts.find((p) => p.id === input.id);
      if (!post) {
        throw new Error("Post not found");
      }

      // Check if slug is being changed and if it's unique
      if (input.slug && input.slug !== post.slug) {
        const existing = blogPosts.find((p) => p.slug === input.slug);
        if (existing) {
          throw new Error("A post with this slug already exists");
        }
      }

      if (input.title !== undefined) post.title = input.title;
      if (input.slug !== undefined) post.slug = input.slug;
      if (input.excerpt !== undefined) post.excerpt = input.excerpt;
      if (input.content !== undefined) post.content = input.content;
      if (input.featuredImage !== undefined) post.featuredImage = input.featuredImage;
      if (input.category !== undefined) post.category = input.category;
      if (input.tags !== undefined) post.tags = input.tags;
      
      if (input.published !== undefined) {
        const wasPublished = post.published;
        post.published = input.published;
        
        // Set publishedAt when first published
        if (!wasPublished && input.published) {
          post.publishedAt = new Date();
        }
      }

      post.updatedAt = new Date();

      return post;
    }),

  // Admin: Delete post
  adminDelete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const index = blogPosts.findIndex((p) => p.id === input.id);
      if (index === -1) {
        throw new Error("Post not found");
      }

      blogPosts.splice(index, 1);
      return { success: true };
    }),

  // Admin: Get statistics
  adminGetStatistics: adminProcedure.query(async () => {
    const total = blogPosts.length;
    const published = blogPosts.filter((p) => p.published).length;
    const draft = total - published;

    const totalViews = blogPosts.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = blogPosts.reduce((sum, p) => sum + p.likes, 0);

    const byCategory = blogPosts.reduce((acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = 0;
      }
      acc[post.category] += 1;
      return acc;
    }, {} as Record<string, number>);

    const mostViewed = [...blogPosts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        views: p.views,
        likes: p.likes,
      }));

    const mostLiked = [...blogPosts]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        views: p.views,
        likes: p.likes,
      }));

    return {
      total,
      published,
      draft,
      totalViews,
      totalLikes,
      byCategory,
      mostViewed,
      mostLiked,
    };
  }),
});
