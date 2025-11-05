import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

// Generic validation middleware
export function validate(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}

// Common validation schemas
export const schemas = {
  // User registration
  register: z.object({
    body: z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
      fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
    }),
  }),

  // User login
  login: z.object({
    body: z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
    }),
  }),

  // Product creation
  createProduct: z.object({
    body: z.object({
      name: z.string().min(3, "Product name must be at least 3 characters").max(200),
      description: z.string().min(10, "Description must be at least 10 characters").max(5000),
      price: z.number().min(0, "Price must be positive"),
      sevaTokenPrice: z.number().min(0, "Seva token price must be positive").optional(),
      category: z.string().min(1, "Category is required"),
      condition: z.enum(["new", "like-new", "good", "fair", "poor"]),
      quantity: z.number().int().min(0, "Quantity must be a positive integer"),
      images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
    }),
  }),

  // Order creation
  createOrder: z.object({
    body: z.object({
      items: z
        .array(
          z.object({
            productId: z.number().int().positive(),
            quantity: z.number().int().positive(),
          })
        )
        .min(1, "At least one item is required"),
      paymentMethod: z.enum(["money", "seva-tokens", "free"]),
      shippingAddress: z.object({
        street: z.string().min(5, "Street address is required"),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        postalCode: z.string().regex(/^\d{6}$/, "Invalid postal code"),
        country: z.string().min(2, "Country is required"),
      }),
    }),
  }),

  // Payment creation
  createPayment: z.object({
    body: z.object({
      orderId: z.number().int().positive(),
      amount: z.number().positive(),
      currency: z.string().length(3, "Currency must be 3 characters"),
      method: z.enum(["razorpay", "upi", "crypto"]),
    }),
  }),

  // Seva token transaction
  sevaTokenTransaction: z.object({
    body: z.object({
      amount: z.number().int().positive(),
      type: z.enum(["earned", "spent"]),
      description: z.string().min(5, "Description is required").max(500),
      relatedId: z.number().int().positive().optional(),
    }),
  }),

  // Review creation
  createReview: z.object({
    body: z.object({
      productId: z.number().int().positive(),
      rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
      comment: z.string().min(10, "Comment must be at least 10 characters").max(1000),
    }),
  }),

  // Email sending
  sendEmail: z.object({
    body: z.object({
      to: z.string().email("Invalid recipient email"),
      subject: z.string().min(1, "Subject is required").max(200),
      message: z.string().min(10, "Message must be at least 10 characters").max(10000),
    }),
  }),

  // Chatbot message
  chatbotMessage: z.object({
    body: z.object({
      message: z.string().min(1, "Message is required").max(1000),
      conversationId: z.string().optional(),
    }),
  }),

  // Search query
  search: z.object({
    query: z.object({
      q: z.string().min(1, "Search query is required").max(200),
      category: z.string().optional(),
      minPrice: z.string().regex(/^\d+$/).optional(),
      maxPrice: z.string().regex(/^\d+$/).optional(),
      condition: z.enum(["new", "like-new", "good", "fair", "poor"]).optional(),
      page: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
    }),
  }),

  // ID parameter
  idParam: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, "Invalid ID"),
    }),
  }),
};

// Sanitize input middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize body
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query);
  }

  next();
}

function sanitizeObject(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return sanitizeValue(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }

  return sanitized;
}

function sanitizeValue(value: any): any {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .trim()
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .substring(0, 10000); // Limit length
}

// File upload validation
export function validateFileUpload(options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxFiles?: number;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;

    if (!files) {
      return next();
    }

    const fileArray = Array.isArray(files) ? files : Object.values(files).flat();

    // Check number of files
    if (options.maxFiles && fileArray.length > options.maxFiles) {
      return res.status(400).json({
        error: "Too many files",
        message: `Maximum ${options.maxFiles} files allowed`,
      });
    }

    // Check each file
    for (const file of fileArray) {
      // Check file size
      if (options.maxSize && file.size > options.maxSize) {
        return res.status(400).json({
          error: "File too large",
          message: `File ${file.name} exceeds maximum size of ${options.maxSize / 1024 / 1024}MB`,
        });
      }

      // Check file type
      if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: "Invalid file type",
          message: `File ${file.name} has invalid type. Allowed types: ${options.allowedTypes.join(", ")}`,
        });
      }
    }

    next();
  };
}

// Pagination validation
export function validatePagination(req: Request, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  if (page < 1) {
    return res.status(400).json({
      error: "Invalid pagination",
      message: "Page must be at least 1",
    });
  }

  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      error: "Invalid pagination",
      message: "Limit must be between 1 and 100",
    });
  }

  req.query.page = page.toString();
  req.query.limit = limit.toString();

  next();
}
