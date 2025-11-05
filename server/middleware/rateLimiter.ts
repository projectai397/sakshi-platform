import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many requests",
      message: "You have exceeded the rate limit. Please try again later.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: "Too many login attempts, please try again later.",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many login attempts",
      message: "Your account has been temporarily locked due to too many failed login attempts. Please try again in 15 minutes.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Rate limiter for payment operations
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 payment attempts per hour
  message: "Too many payment attempts, please try again later.",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many payment attempts",
      message: "You have exceeded the payment attempt limit. Please try again in an hour or contact support.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Rate limiter for AI chatbot
export const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 messages per minute
  message: "Too many messages, please slow down.",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many messages",
      message: "You're sending messages too quickly. Please wait a moment before trying again.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Rate limiter for search operations
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 searches per minute
  message: "Too many search requests, please slow down.",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many searches",
      message: "You're searching too frequently. Please wait a moment.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Rate limiter for email sending
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 emails per hour
  message: "Too many email requests, please try again later.",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many email requests",
      message: "You have exceeded the email sending limit. Please try again in an hour.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: "Too many upload requests, please try again later.",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many uploads",
      message: "You have exceeded the file upload limit. Please try again in an hour.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset attempts per hour
  message: "Too many password reset attempts, please try again later.",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many password reset attempts",
      message: "You have exceeded the password reset limit. Please try again in an hour or contact support.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Rate limiter for registration
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration attempts per hour
  message: "Too many registration attempts, please try again later.",
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many registration attempts",
      message: "You have exceeded the registration limit. Please try again in an hour.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Flexible rate limiter factory
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: "Rate limit exceeded",
        message: options.message || "Too many requests, please try again later.",
        retryAfter: req.rateLimit?.resetTime,
      });
    },
  });
}
