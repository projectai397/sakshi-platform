import helmet from "helmet";
import cors from "cors";
import type { Express } from "express";

// Configure security headers with Helmet
export function configureSecurityHeaders(app: Express) {
  // Use Helmet for security headers
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://checkout.razorpay.com",
            "https://cdn.jsdelivr.net",
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: [
            "'self'",
            "https://api.razorpay.com",
            "https://api.openai.com",
            "https://api.coinbase.com",
          ],
          frameSrc: ["'self'", "https://api.razorpay.com"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },

      // HTTP Strict Transport Security
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },

      // X-Frame-Options
      frameguard: {
        action: "deny",
      },

      // X-Content-Type-Options
      noSniff: true,

      // X-XSS-Protection
      xssFilter: true,

      // Referrer-Policy
      referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
      },

      // Permissions-Policy
      permittedCrossDomainPolicies: {
        permittedPolicies: "none",
      },
    })
  );

  // Configure CORS
  const corsOptions = {
    origin: function (origin: string | undefined, callback: Function) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // List of allowed origins
      const allowedOrigins = [
        process.env.VITE_BASE_URL || "http://localhost:3000",
        "http://localhost:3000",
        "http://localhost:5173", // Vite dev server
      ];

      // Check if origin is allowed
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
    maxAge: 86400, // 24 hours
  };

  app.use(cors(corsOptions));
}

// Additional security middleware
export function additionalSecurityMiddleware(app: Express) {
  // Remove X-Powered-By header
  app.disable("x-powered-by");

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set("trust proxy", 1);

  // Add custom security headers
  app.use((req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "DENY");

    // Enable XSS protection
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Referrer policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions policy
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), payment=(self)"
    );

    // Feature policy (deprecated but still supported)
    res.setHeader(
      "Feature-Policy",
      "geolocation 'none'; microphone 'none'; camera 'none'; payment 'self'"
    );

    next();
  });
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  return require("crypto").randomBytes(32).toString("hex");
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
}

// Input sanitization helper
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .substring(0, 10000); // Limit length
}

// SQL injection prevention helper
export function escapeSQLInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, "") // Remove semicolons
    .replace(/--/g, "") // Remove SQL comments
    .replace(/\/\*/g, "") // Remove multi-line comments
    .replace(/\*\//g, "");
}

// XSS prevention helper
export function escapeHTML(input: string): string {
  if (typeof input !== "string") return "";

  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'/]/g, (char) => map[char]);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
}

// Validate URL format
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Password strength validator
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Rate limit by user ID (in addition to IP)
export function getUserRateLimitKey(userId: number, action: string): string {
  return `user:${userId}:${action}`;
}

// Check if request is from a bot
export function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
  ];

  return botPatterns.some((pattern) => pattern.test(userAgent));
}

// Log security events
export function logSecurityEvent(event: {
  type: string;
  ip: string;
  userId?: number;
  details?: any;
}) {
  console.log(`[SECURITY] ${event.type}`, {
    timestamp: new Date().toISOString(),
    ip: event.ip,
    userId: event.userId,
    details: event.details,
  });

  // In production, send to security monitoring service
  // e.g., Sentry, LogRocket, etc.
}
