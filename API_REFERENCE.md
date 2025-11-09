# Sakshi Platform API Reference

**Version:** 1.0.0  
**Base URL:** `https://api.sakshi.com/trpc`  
**Protocol:** tRPC over HTTP  
**Authentication:** JWT Bearer Token

---

## Overview

The Sakshi Platform API provides programmatic access to all platform features including cafe operations, orders, recipes, classes, subscriptions, and innovative features. The API is built using tRPC, providing end-to-end type safety and automatic TypeScript client generation.

---

## Authentication

All API requests require authentication using JWT tokens in the Authorization header.

### Login

```typescript
const result = await trpc.auth.login.mutate({
  email: 'user@example.com',
  password: 'password123',
});

// Returns: { token: string, user: User }
```

### Using the Token

```typescript
// Set token in headers
const headers = {
  'Authorization': `Bearer ${token}`,
};
```

---

## Cafe API

### Menu Items

#### Get All Menu Items

```typescript
const menuItems = await trpc.cafe.menu.getAll.query({
  category?: string;
  available?: boolean;
  limit?: number;
  offset?: number;
});
```

**Response:**
```typescript
{
  items: MenuItem[];
  total: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  community_price: number;
  fair_price: number;
  supporter_price: number;
  vata_effect: 'increase' | 'decrease' | 'neutral';
  pitta_effect: 'increase' | 'decrease' | 'neutral';
  kapha_effect: 'increase' | 'decrease' | 'neutral';
  spice_level: number;
  is_available: boolean;
  image_url: string;
  nutrition_info: object;
  created_at: Date;
}
```

#### Get Menu Item by ID

```typescript
const item = await trpc.cafe.menu.getById.query({ id: 1 });
```

#### Create Menu Item

```typescript
const newItem = await trpc.cafe.menu.create.mutate({
  name: 'Satvic Bowl',
  description: 'A nourishing bowl of seasonal vegetables',
  category: 'main',
  community_price: 80,
  fair_price: 120,
  supporter_price: 200,
  vata_effect: 'neutral',
  pitta_effect: 'decrease',
  kapha_effect: 'decrease',
  spice_level: 2,
  image_url: 'https://...',
  nutrition_info: {
    calories: 350,
    protein: 12,
    carbs: 45,
    fat: 8,
  },
});
```

#### Update Menu Item

```typescript
const updated = await trpc.cafe.menu.update.mutate({
  id: 1,
  is_available: false,
});
```

#### Delete Menu Item

```typescript
await trpc.cafe.menu.delete.mutate({ id: 1 });
```

---

### Orders

#### Create Order

```typescript
const order = await trpc.cafe.orders.create.mutate({
  location_id: 1,
  pricing_tier: 'fair',
  items: [
    { menu_item_id: 1, quantity: 2 },
    { menu_item_id: 3, quantity: 1 },
  ],
  special_instructions: 'No onions please',
  payment_method: 'razorpay',
});
```

**Response:**
```typescript
{
  id: number;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed';
  razorpay_order_id?: string;
  created_at: Date;
}
```

#### Get User Orders

```typescript
const orders = await trpc.cafe.orders.getUserOrders.query({
  status?: string;
  limit?: number;
  offset?: number;
});
```

#### Get Order by ID

```typescript
const order = await trpc.cafe.orders.getById.query({ id: 123 });
```

#### Update Order Status

```typescript
await trpc.cafe.orders.updateStatus.mutate({
  id: 123,
  status: 'preparing',
});
```

---

### Recipes

#### Get All Recipes

```typescript
const recipes = await trpc.cafe.recipes.getAll.query({
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  limit?: number;
  offset?: number;
});
```

**Response:**
```typescript
{
  recipes: Recipe[];
  total: number;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition_info: object;
  image_url: string;
  author_id: number;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  created_at: Date;
}
```

#### Submit Recipe

```typescript
const recipe = await trpc.cafe.recipes.submit.mutate({
  title: 'Green Smoothie Bowl',
  description: 'Refreshing and nutritious',
  category: 'breakfast',
  difficulty: 'easy',
  prep_time: 10,
  cook_time: 0,
  servings: 2,
  ingredients: [
    { item: 'Spinach', quantity: '2 cups' },
    { item: 'Banana', quantity: '1' },
    { item: 'Almond milk', quantity: '1 cup' },
  ],
  instructions: [
    'Blend all ingredients until smooth',
    'Pour into bowl',
    'Top with fruits and nuts',
  ],
  nutrition_info: { calories: 250, protein: 8, carbs: 35, fat: 6 },
  image_url: 'https://...',
});
```

#### Rate Recipe

```typescript
await trpc.cafe.recipes.rate.mutate({
  recipe_id: 1,
  rating: 5,
  review: 'Absolutely delicious!',
});
```

---

### Cooking Classes

#### Get All Classes

```typescript
const classes = await trpc.cafe.classes.getAll.query({
  type?: 'in-person' | 'virtual';
  upcoming?: boolean;
  limit?: number;
  offset?: number;
});
```

**Response:**
```typescript
{
  classes: CookingClass[];
  total: number;
}

interface CookingClass {
  id: number;
  title: string;
  description: string;
  type: 'in-person' | 'virtual';
  instructor: string;
  date: Date;
  duration: number;
  max_participants: number;
  current_participants: number;
  community_price: number;
  fair_price: number;
  supporter_price: number;
  location_id?: number;
  meeting_link?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  created_at: Date;
}
```

#### Register for Class

```typescript
const registration = await trpc.cafe.classes.register.mutate({
  class_id: 1,
  pricing_tier: 'fair',
  payment_method: 'razorpay',
});
```

#### Get User Registrations

```typescript
const registrations = await trpc.cafe.classes.getUserRegistrations.query();
```

---

## Innovations API

### Meal Sponsorship

#### Sponsor Meals

```typescript
const sponsorship = await trpc.innovations.sponsorships.create.mutate({
  meal_count: 10,
  amount: 1000,
  message: 'May everyone have access to healthy food',
  is_anonymous: false,
  payment_method: 'razorpay',
});
```

#### Get Sponsorship Stats

```typescript
const stats = await trpc.innovations.sponsorships.getStats.query();
```

**Response:**
```typescript
{
  total_meals_sponsored: number;
  total_amount: number;
  meals_redeemed: number;
  meals_available: number;
  top_sponsors: Array<{
    name: string;
    meals_sponsored: number;
  }>;
}
```

---

### Farm Transparency

#### Get Farmer Info

```typescript
const farmer = await trpc.innovations.farmTransparency.getFarmer.query({
  id: 1,
});
```

**Response:**
```typescript
{
  id: number;
  name: string;
  farm_name: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  bio: string;
  farming_practices: string[];
  certifications: string[];
  products: string[];
  photo_url: string;
  impact: {
    kg_supplied: number;
    meals_contributed: number;
    carbon_saved: number;
  };
}
```

#### Track Ingredient

```typescript
const journey = await trpc.innovations.farmTransparency.trackIngredient.query({
  menu_item_id: 1,
  ingredient: 'tomatoes',
});
```

**Response:**
```typescript
{
  ingredient: string;
  farmer: Farmer;
  harvest_date: Date;
  delivery_date: Date;
  distance_km: number;
  carbon_footprint: number;
  certifications: string[];
}
```

---

### Zero Waste Dashboard

#### Log Waste

```typescript
await trpc.innovations.zeroWaste.logWaste.mutate({
  location_id: 1,
  date: new Date(),
  food_waste_kg: 2.5,
  composted_kg: 2.5,
  donated_kg: 0,
  items: [
    { item: 'Vegetable scraps', weight_kg: 1.5 },
    { item: 'Expired bread', weight_kg: 1.0 },
  ],
});
```

#### Get Waste Stats

```typescript
const stats = await trpc.innovations.zeroWaste.getStats.query({
  location_id: 1,
  start_date: new Date('2024-01-01'),
  end_date: new Date('2024-01-31'),
});
```

**Response:**
```typescript
{
  total_waste_kg: number;
  composted_kg: number;
  donated_kg: number;
  diversion_rate: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  trend: 'improving' | 'stable' | 'declining';
  top_waste_items: Array<{
    item: string;
    weight_kg: number;
  }>;
}
```

---

### Mindful Dining

#### Start Session

```typescript
const session = await trpc.innovations.mindfulDining.startSession.mutate({
  order_id: 123,
});
```

#### Complete Session

```typescript
await trpc.innovations.mindfulDining.completeSession.mutate({
  session_id: 1,
  meditation_duration: 120,
  eating_duration: 1200,
  gratitude_entry: 'Grateful for this nourishing meal',
  mindfulness_rating: 4,
  dosha_balance_rating: 5,
  zero_waste: true,
});
```

**Response:**
```typescript
{
  seva_tokens_earned: number;
  total_sessions: number;
  streak_days: number;
}
```

---

### Ayurvedic Customization

#### Take Dosha Quiz

```typescript
const result = await trpc.innovations.ayurvedic.takeDoshaQuiz.mutate({
  answers: [
    { question_id: 1, answer: 'a' },
    { question_id: 2, answer: 'b' },
    // ... 7 questions total
  ],
});
```

**Response:**
```typescript
{
  primary_dosha: 'vata' | 'pitta' | 'kapha';
  secondary_dosha: 'vata' | 'pitta' | 'kapha';
  percentages: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  recommendations: {
    foods_to_favor: string[];
    foods_to_avoid: string[];
    lifestyle_tips: string[];
  };
}
```

#### Get Personalized Recommendations

```typescript
const recommendations = await trpc.innovations.ayurvedic.getRecommendations.query({
  dosha: 'vata',
  current_state: 'stressed',
  season: 'winter',
});
```

---

### Impact Tracking

#### Get User Impact

```typescript
const impact = await trpc.innovations.impact.getUserImpact.query({
  period: 'month',
});
```

**Response:**
```typescript
{
  overall_score: number;
  categories: {
    environmental: {
      score: number;
      co2_saved_kg: number;
      water_saved_liters: number;
      waste_diverted_kg: number;
    };
    social: {
      score: number;
      meals_sponsored: number;
      farmers_supported: number;
      community_hours: number;
    };
    mindfulness: {
      score: number;
      mindful_sessions: number;
      meditation_minutes: number;
      gratitude_entries: number;
    };
    community: {
      score: number;
      recipes_shared: number;
      reviews_written: number;
      referrals: number;
    };
  };
  milestones: Array<{
    title: string;
    achieved_at: Date;
    badge_url: string;
  }>;
  seva_tokens: {
    earned: number;
    spent: number;
    balance: number;
  };
}
```

---

## Webhooks

### Order Status Updates

Subscribe to order status changes:

```typescript
POST https://your-server.com/webhooks/order-status
{
  "event": "order.status_changed",
  "data": {
    "order_id": 123,
    "old_status": "confirmed",
    "new_status": "preparing",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Payment Confirmations

```typescript
POST https://your-server.com/webhooks/payment
{
  "event": "payment.completed",
  "data": {
    "order_id": 123,
    "amount": 350,
    "razorpay_payment_id": "pay_xxx",
    "timestamp": "2024-01-15T10:25:00Z"
  }
}
```

---

## Rate Limits

- **Authenticated requests:** 1000 requests per hour
- **Unauthenticated requests:** 100 requests per hour
- **Burst limit:** 20 requests per second

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705315200
```

---

## Error Handling

All errors follow this format:

```typescript
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

---

## TypeScript Client

Install the client:

```bash
npm install @sakshi/api-client
```

Usage:

```typescript
import { createTRPCClient } from '@sakshi/api-client';

const client = createTRPCClient({
  url: 'https://api.sakshi.com/trpc',
  headers: {
    authorization: `Bearer ${token}`,
  },
});

// Full type safety
const menuItems = await client.cafe.menu.getAll.query();
```

---

## Support

- **Documentation:** https://docs.sakshi.com
- **API Status:** https://status.sakshi.com
- **Support Email:** api@sakshi.com
- **GitHub Issues:** https://github.com/sakshi-platform/api/issues

---

**API Reference Version 1.0.0** | Last Updated: January 2024
