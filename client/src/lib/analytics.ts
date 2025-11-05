import ReactGA from "react-ga4";
import posthog from "posthog-js";

// Analytics configuration
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";
const POSTHOG_API_KEY = import.meta.env.VITE_POSTHOG_API_KEY || "";
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";

// Initialize analytics
let analyticsInitialized = false;

export function initializeAnalytics() {
  if (analyticsInitialized) return;

  // Initialize Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true,
        cookieFlags: "SameSite=None;Secure",
      },
    });
    console.log("✅ Google Analytics initialized");
  }

  // Initialize PostHog
  if (POSTHOG_API_KEY) {
    posthog.init(POSTHOG_API_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          posthog.opt_out_capturing();
        }
      },
    });
    console.log("✅ PostHog initialized");
  }

  analyticsInitialized = true;
}

// Track page view
export function trackPageView(path: string, title?: string) {
  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: "pageview", page: path, title });
  }

  // PostHog
  if (POSTHOG_API_KEY) {
    posthog.capture("$pageview", { path, title });
  }
}

// Track event
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: properties?.category || "General",
      action: eventName,
      label: properties?.label,
      value: properties?.value,
      ...properties,
    });
  }

  // PostHog
  if (POSTHOG_API_KEY) {
    posthog.capture(eventName, properties);
  }

  // Console log in development
  if (import.meta.env.DEV) {
    console.log("📊 Event:", eventName, properties);
  }
}

// Identify user
export function identifyUser(userId: string, traits?: Record<string, any>) {
  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.set({ userId });
  }

  // PostHog
  if (POSTHOG_API_KEY) {
    posthog.identify(userId, traits);
  }
}

// Reset user identity (on logout)
export function resetUser() {
  // PostHog
  if (POSTHOG_API_KEY) {
    posthog.reset();
  }
}

// E-commerce tracking
export const ecommerce = {
  // View item
  viewItem: (product: {
    id: number;
    name: string;
    price: number;
    category?: string;
  }) => {
    trackEvent("view_item", {
      category: "Ecommerce",
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          price: product.price,
          item_category: product.category,
        },
      ],
    });
  },

  // Add to cart
  addToCart: (product: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }) => {
    trackEvent("add_to_cart", {
      category: "Ecommerce",
      currency: "INR",
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    });
  },

  // Remove from cart
  removeFromCart: (product: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }) => {
    trackEvent("remove_from_cart", {
      category: "Ecommerce",
      currency: "INR",
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    });
  },

  // Begin checkout
  beginCheckout: (cart: {
    items: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
  }) => {
    trackEvent("begin_checkout", {
      category: "Ecommerce",
      currency: "INR",
      value: cart.total,
      items: cart.items.map((item) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  // Purchase
  purchase: (order: {
    id: number;
    total: number;
    items: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
    }>;
    paymentMethod: string;
  }) => {
    trackEvent("purchase", {
      category: "Ecommerce",
      transaction_id: order.id.toString(),
      currency: "INR",
      value: order.total,
      payment_method: order.paymentMethod,
      items: order.items.map((item) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  // Refund
  refund: (order: { id: number; total: number }) => {
    trackEvent("refund", {
      category: "Ecommerce",
      transaction_id: order.id.toString(),
      currency: "INR",
      value: order.total,
    });
  },
};

// User events
export const userEvents = {
  // Sign up
  signUp: (method: string) => {
    trackEvent("sign_up", {
      category: "User",
      method,
    });
  },

  // Login
  login: (method: string) => {
    trackEvent("login", {
      category: "User",
      method,
    });
  },

  // Logout
  logout: () => {
    trackEvent("logout", {
      category: "User",
    });
    resetUser();
  },

  // Profile update
  profileUpdate: () => {
    trackEvent("profile_update", {
      category: "User",
    });
  },
};

// Seva token events
export const sevaTokenEvents = {
  // Earn tokens
  earnTokens: (amount: number, source: string) => {
    trackEvent("seva_tokens_earned", {
      category: "Seva Tokens",
      value: amount,
      source,
    });
  },

  // Spend tokens
  spendTokens: (amount: number, purpose: string) => {
    trackEvent("seva_tokens_spent", {
      category: "Seva Tokens",
      value: amount,
      purpose,
    });
  },

  // View balance
  viewBalance: (balance: number) => {
    trackEvent("seva_tokens_view_balance", {
      category: "Seva Tokens",
      balance,
    });
  },
};

// Search events
export const searchEvents = {
  // Search
  search: (query: string, resultsCount: number) => {
    trackEvent("search", {
      category: "Search",
      search_term: query,
      results_count: resultsCount,
    });
  },

  // AI search
  aiSearch: (query: string, resultsCount: number) => {
    trackEvent("ai_search", {
      category: "Search",
      search_term: query,
      results_count: resultsCount,
    });
  },
};

// Chatbot events
export const chatbotEvents = {
  // Open chatbot
  open: () => {
    trackEvent("chatbot_open", {
      category: "Chatbot",
    });
  },

  // Send message
  sendMessage: (messageLength: number) => {
    trackEvent("chatbot_message", {
      category: "Chatbot",
      message_length: messageLength,
    });
  },

  // Receive response
  receiveResponse: (responseTime: number) => {
    trackEvent("chatbot_response", {
      category: "Chatbot",
      response_time: responseTime,
    });
  },

  // Click suggested question
  clickSuggestion: (question: string) => {
    trackEvent("chatbot_suggestion_click", {
      category: "Chatbot",
      question,
    });
  },
};

// Engagement events
export const engagementEvents = {
  // Button click
  buttonClick: (buttonName: string, location: string) => {
    trackEvent("button_click", {
      category: "Engagement",
      button_name: buttonName,
      location,
    });
  },

  // Link click
  linkClick: (linkText: string, destination: string) => {
    trackEvent("link_click", {
      category: "Engagement",
      link_text: linkText,
      destination,
    });
  },

  // Form submission
  formSubmit: (formName: string) => {
    trackEvent("form_submit", {
      category: "Engagement",
      form_name: formName,
    });
  },

  // Video play
  videoPlay: (videoTitle: string) => {
    trackEvent("video_play", {
      category: "Engagement",
      video_title: videoTitle,
    });
  },

  // Share
  share: (contentType: string, method: string) => {
    trackEvent("share", {
      category: "Engagement",
      content_type: contentType,
      method,
    });
  },
};

// Error tracking
export const errorEvents = {
  // Track error
  error: (errorMessage: string, errorLocation: string) => {
    trackEvent("error", {
      category: "Error",
      error_message: errorMessage,
      error_location: errorLocation,
    });
  },

  // Track 404
  notFound: (path: string) => {
    trackEvent("404_not_found", {
      category: "Error",
      path,
    });
  },
};

// Performance tracking
export const performanceEvents = {
  // Page load time
  pageLoad: (loadTime: number) => {
    trackEvent("page_load", {
      category: "Performance",
      value: loadTime,
    });
  },

  // API response time
  apiResponse: (endpoint: string, responseTime: number) => {
    trackEvent("api_response", {
      category: "Performance",
      endpoint,
      response_time: responseTime,
    });
  },
};

// Export all tracking functions
export const analytics = {
  initialize: initializeAnalytics,
  trackPageView,
  trackEvent,
  identifyUser,
  resetUser,
  ecommerce,
  userEvents,
  sevaTokenEvents,
  searchEvents,
  chatbotEvents,
  engagementEvents,
  errorEvents,
  performanceEvents,
};

export default analytics;
