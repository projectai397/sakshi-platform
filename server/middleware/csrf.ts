import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Store CSRF tokens in memory (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Generate CSRF token
export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  csrfTokens.set(sessionId, { token, expires });

  // Clean up expired tokens
  cleanupExpiredTokens();

  return token;
}

// Validate CSRF token
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);

  if (!stored) return false;
  if (stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }

  return stored.token === token;
}

// Cleanup expired tokens
function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (data.expires < now) {
      csrfTokens.delete(sessionId);
    }
  }
}

// CSRF protection middleware
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF check for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Skip CSRF check for API endpoints (use other auth methods)
  if (req.path.startsWith("/api/")) {
    return next();
  }

  // Get session ID from cookie
  const sessionId = req.cookies?.sessionId || req.session?.id;

  if (!sessionId) {
    return res.status(403).json({
      error: "CSRF validation failed",
      message: "No session found",
    });
  }

  // Get CSRF token from header or body
  const token =
    req.headers["x-csrf-token"] ||
    req.headers["csrf-token"] ||
    req.body?._csrf ||
    req.query?._csrf;

  if (!token || typeof token !== "string") {
    return res.status(403).json({
      error: "CSRF validation failed",
      message: "CSRF token missing",
    });
  }

  // Validate token
  if (!validateCSRFToken(sessionId, token)) {
    return res.status(403).json({
      error: "CSRF validation failed",
      message: "Invalid CSRF token",
    });
  }

  next();
}

// Middleware to attach CSRF token to response
export function attachCSRFToken(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.sessionId || req.session?.id;

  if (sessionId) {
    const token = generateCSRFToken(sessionId);
    res.locals.csrfToken = token;

    // Add token to response header
    res.setHeader("X-CSRF-Token", token);
  }

  next();
}

// Route handler to get CSRF token
export function getCSRFToken(req: Request, res: Response) {
  const sessionId = req.cookies?.sessionId || req.session?.id;

  if (!sessionId) {
    return res.status(400).json({
      error: "No session found",
      message: "Please establish a session first",
    });
  }

  const token = generateCSRFToken(sessionId);

  res.json({
    csrfToken: token,
  });
}

// Double Submit Cookie pattern (alternative to server-side storage)
export function doubleSubmitCookieCSRF(req: Request, res: Response, next: NextFunction) {
  // Skip for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    // Generate and set CSRF cookie for GET requests
    if (!req.cookies?.["XSRF-TOKEN"]) {
      const token = crypto.randomBytes(32).toString("hex");
      res.cookie("XSRF-TOKEN", token, {
        httpOnly: false, // Must be readable by JavaScript
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
    }
    return next();
  }

  // For unsafe methods, validate token
  const cookieToken = req.cookies?.["XSRF-TOKEN"];
  const headerToken = req.headers["x-xsrf-token"] || req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken) {
    return res.status(403).json({
      error: "CSRF validation failed",
      message: "CSRF token missing",
    });
  }

  if (cookieToken !== headerToken) {
    return res.status(403).json({
      error: "CSRF validation failed",
      message: "CSRF token mismatch",
    });
  }

  next();
}

// Synchronizer Token Pattern
export class CSRFTokenManager {
  private tokens: Map<string, Set<string>> = new Map();

  generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString("hex");

    if (!this.tokens.has(sessionId)) {
      this.tokens.set(sessionId, new Set());
    }

    this.tokens.get(sessionId)!.add(token);

    // Limit tokens per session
    const sessionTokens = this.tokens.get(sessionId)!;
    if (sessionTokens.size > 10) {
      const firstToken = sessionTokens.values().next().value;
      sessionTokens.delete(firstToken);
    }

    return token;
  }

  validateToken(sessionId: string, token: string): boolean {
    const sessionTokens = this.tokens.get(sessionId);
    if (!sessionTokens) return false;

    const isValid = sessionTokens.has(token);

    // Remove token after use (one-time use)
    if (isValid) {
      sessionTokens.delete(token);
    }

    return isValid;
  }

  clearSession(sessionId: string) {
    this.tokens.delete(sessionId);
  }

  cleanup() {
    // In production, implement TTL-based cleanup
    // For now, just clear all tokens periodically
    if (this.tokens.size > 10000) {
      this.tokens.clear();
    }
  }
}

// Export singleton instance
export const csrfTokenManager = new CSRFTokenManager();

// Cleanup interval
setInterval(() => {
  cleanupExpiredTokens();
  csrfTokenManager.cleanup();
}, 60 * 60 * 1000); // Every hour
