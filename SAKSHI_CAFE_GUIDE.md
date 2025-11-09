# Sakshi Cafe - Complete Implementation Guide

## Overview

The **Sakshi Cafe** is a conscious food marketplace that integrates Satvic Movement principles with the Sakshi platform's triple pricing system and Seva Token economy. It offers plant-based, whole-food meals, recipes, cooking classes, meal subscriptions, and health tracking—all aligned with the vision of conscious commerce and holistic wellness.

## Table of Contents

1. [Vision & Philosophy](#vision--philosophy)
2. [Core Features](#core-features)
3. [Database Schema](#database-schema)
4. [API Routes](#api-routes)
5. [Frontend Components](#frontend-components)
6. [Integration with Existing Platform](#integration-with-existing-platform)
7. [Satvic Movement Integration](#satvic-movement-integration)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Business Model](#business-model)
10. [Franchise Opportunities](#franchise-opportunities)

---

## Vision & Philosophy

### Satvic Movement Principles

The Sakshi Cafe embodies the core principles of the Satvic Movement:

1. **Plant-Based Nutrition**: All menu items are 100% plant-based, focusing on whole foods
2. **No Processed Foods**: Emphasis on fresh, natural ingredients without preservatives or additives
3. **Ayurvedic Wisdom**: Menu items balanced according to Ayurvedic principles (doshas, tastes, seasons)
4. **Conscious Eating**: Mindful preparation and consumption of food as a spiritual practice
5. **Health Education**: Cooking classes and recipes that teach sustainable, healthy cooking
6. **Community Building**: Shared meals, group classes, and collective learning experiences

### Sakshi Center Alignment

The cafe integrates seamlessly with the Sakshi Center vision:

- **Consciousness as Currency**: Seva tokens earned through meditation can be used for meals
- **Universal Access**: Triple pricing ensures everyone can access healthy food regardless of financial status
- **Women's Empowerment**: Employment opportunities for women in cafe operations and as instructors
- **Circular Economy**: Composting, zero-waste practices, and sustainable sourcing
- **Social Impact**: Portion of proceeds support community health initiatives

---

## Core Features

### 1. Menu & Ordering System

**Features:**
- Browse menu items by category (breakfast, lunch, dinner, snacks, beverages, desserts)
- View nutritional information (calories, macros, fiber)
- See Ayurvedic properties (dosha balance, tastes, seasonal appropriateness)
- Filter by allergens, dietary preferences
- Choose pricing tier (Community/Fair/Supporter)
- Multiple order types: dine-in, delivery, pickup, catering
- Schedule orders in advance
- Real-time order tracking

**Triple Pricing Example:**
- Green Smoothie Bowl: ₹100 (Community) / ₹150 (Fair) / ₹200 (Supporter)
- Sattvic Thali: ₹150 (Community) / ₹250 (Fair) / ₹350 (Supporter)

### 2. Recipe Library

**Features:**
- Community-contributed recipes (user submissions)
- Professional recipes from cafe chefs
- Step-by-step instructions with images
- Video tutorials
- Nutritional analysis
- Ayurvedic information
- Ingredient substitutions
- Rating and review system
- Save favorites
- Share recipes

**Categories:**
- Breakfast bowls and smoothies
- Salads and raw foods
- Cooked meals and curries
- Fermented foods
- Herbal teas and beverages
- Desserts and treats

### 3. Cooking Classes

**Features:**
- In-person classes at cafe locations
- Virtual classes via video conferencing
- Triple pricing for accessibility
- Small group sizes for personalized instruction
- Certificate of completion
- Recipe booklets provided
- Hands-on learning
- Q&A sessions

**Class Types:**
- Beginner: Basic cooking techniques, simple recipes
- Intermediate: Advanced techniques, meal planning
- Specialized: Fermentation, sprouting, raw foods, Ayurvedic cooking
- Kids Classes: Teaching children healthy cooking
- Corporate Workshops: Team-building cooking events

### 4. Meal Subscriptions

**Features:**
- Daily, weekly, or bi-weekly delivery
- Customizable meal preferences
- Dietary restrictions support
- Flexible scheduling (pause, skip, cancel)
- Triple pricing tiers
- Seasonal menu rotation
- Delivery time preferences
- Subscription management dashboard

**Subscription Plans:**
- Breakfast Only: 7 breakfasts/week
- Lunch Only: 5 lunches/week (weekdays)
- Full Day: 2-3 meals/day
- Custom: Choose your own combination

### 5. Health Tracking

**Features:**
- Nutrition logging (automatic from cafe orders)
- Manual food logging
- Daily nutrition summaries
- Health metrics tracking (weight, blood sugar, blood pressure, energy, mood, sleep)
- Progress charts and trends
- Goal setting
- Health insights and recommendations
- Export data for healthcare providers

**Integration:**
- Automatically log nutrition from cafe orders
- Track correlation between diet and health metrics
- Personalized meal recommendations based on health goals
- Integration with wearables (future enhancement)

### 6. Cafe Locations

**Features:**
- Location finder with map
- Distance-based search
- Hours of operation
- Seating capacity
- Contact information
- Directions and navigation
- Real-time availability

**Locations (Planned):**
- Urban centers: Mumbai, Delhi, Bangalore, Pune
- Sakshi Centers: Co-located with thrift stores and community spaces
- Franchise locations: Partner-operated cafes

### 7. Franchise Program

**Features:**
- Franchise application system
- Application review workflow
- Agreement management
- Training and support
- Brand guidelines
- Menu standardization
- Quality control
- Royalty tracking

**Franchise Benefits:**
- Established brand and business model
- Training and operational support
- Marketing materials
- Technology platform
- Supply chain access
- Community of franchisees

---

## Database Schema

The cafe system uses 11 database tables:

### Core Tables

1. **cafe_locations**: Physical cafe locations
2. **menu_items**: Food and beverage items
3. **recipes**: Recipe library
4. **cafe_orders**: Customer orders
5. **cooking_classes**: Class schedule
6. **class_registrations**: Student registrations
7. **meal_subscriptions**: Subscription plans
8. **subscription_deliveries**: Delivery tracking
9. **franchises**: Franchise applications
10. **nutrition_logs**: User nutrition tracking
11. **health_metrics**: User health data

See `/home/ubuntu/sakshi/drizzle/schema-cafe.ts` for complete schema definitions.

---

## API Routes

All cafe routes are organized under the `cafe` namespace:

### Menu Routes (`/api/trpc/cafe.menu.*`)

- `getMenuItems`: List menu items with filtering
- `getMenuItem`: Get single item details
- `createMenuItem`: Add new menu item (admin)
- `updateMenuItem`: Update menu item (admin)
- `deleteMenuItem`: Remove menu item (admin)
- `getCategories`: List available categories

### Order Routes (`/api/trpc/cafe.orders.*`)

- `createOrder`: Place new order
- `getMyOrders`: User's order history
- `getOrder`: Get order details
- `updateOrderStatus`: Update status (staff)
- `cancelOrder`: Cancel order
- `getAllOrders`: Admin order management

### Recipe Routes (`/api/trpc/cafe.recipes.*`)

- `getRecipes`: Browse recipes
- `getRecipe`: Get recipe details
- `submitRecipe`: Submit new recipe
- `updateRecipe`: Edit recipe
- `approveRecipe`: Approve submission (admin)
- `rateRecipe`: Rate and review
- `getMyRecipes`: User's recipes
- `getPendingRecipes`: Admin review queue

### Class Routes (`/api/trpc/cafe.classes.*`)

- `getUpcomingClasses`: Browse classes
- `getClass`: Class details
- `createClass`: Schedule class (admin)
- `registerForClass`: Student registration
- `getMyRegistrations`: User's classes
- `cancelRegistration`: Cancel registration
- `updateAttendance`: Mark attendance (instructor)

### Subscription Routes (`/api/trpc/cafe.subscriptions.*`)

- `createSubscription`: Start subscription
- `getMySubscriptions`: User's subscriptions
- `getSubscription`: Subscription details
- `updateSubscription`: Modify subscription
- `pauseSubscription`: Pause deliveries
- `resumeSubscription`: Resume deliveries
- `cancelSubscription`: Cancel subscription
- `getSubscriptionDeliveries`: Delivery history
- `skipNextDelivery`: Skip delivery

### Location Routes (`/api/trpc/cafe.locations.*`)

- `getLocations`: List all locations
- `getLocation`: Location details
- `findNearestLocations`: Distance-based search
- `createLocation`: Add location (admin)
- `updateLocation`: Update location (admin)
- `getCities`: List cities with cafes

### Franchise Routes (`/api/trpc/cafe.franchises.*`)

- `applyForFranchise`: Submit application
- `getApplications`: Admin review (admin)
- `updateApplicationStatus`: Approve/reject (admin)
- `signAgreement`: Finalize agreement (admin)

### Health Routes (`/api/trpc/cafe.health.*`)

- `logNutrition`: Log food intake
- `getNutritionLogs`: View logs
- `getDailyNutritionSummary`: Daily totals
- `logHealthMetrics`: Track health data
- `getHealthMetrics`: View metrics
- `getHealthTrends`: Trend analysis
- `deleteNutritionLog`: Remove log

---

## Frontend Components

### React Components

Located in `/home/ubuntu/sakshi/components/cafe/`:

1. **MenuCard.tsx**: Display menu item with triple pricing
2. **RecipeCard.tsx**: Recipe preview card
3. **ClassCard.tsx**: Cooking class card with registration

### Pages (To Be Created)

Recommended page structure:

```
/cafe
  /menu - Browse menu
  /menu/[id] - Menu item details
  /recipes - Recipe library
  /recipes/[id] - Recipe details
  /recipes/submit - Submit recipe
  /classes - Cooking classes
  /classes/[id] - Class details
  /subscriptions - Meal subscriptions
  /subscriptions/new - Create subscription
  /subscriptions/[id] - Manage subscription
  /orders - Order history
  /orders/[id] - Order details
  /health - Health tracking dashboard
  /locations - Find cafes
  /franchise - Franchise information
```

---

## Integration with Existing Platform

### 1. User Authentication

- Uses existing authentication system
- User profiles extended with cafe preferences
- Order history linked to user account

### 2. Payment Integration

- Integrates with existing payment gateway
- Supports Seva Token payments
- Triple pricing system consistency

### 3. Admin Dashboard

- Cafe management section in admin panel
- Menu management
- Order fulfillment
- Class scheduling
- Franchise applications
- Analytics and reporting

### 4. Seva Token Economy

**Earning Tokens:**
- Meditation sessions: 10 tokens per session
- Volunteering at cafe: 50 tokens per hour
- Recipe contributions: 25 tokens per approved recipe
- Class attendance: 20 tokens per class

**Using Tokens:**
- 1 token = ₹1 discount on meals
- 100 tokens = Free community-tier meal
- 500 tokens = Free cooking class
- 1000 tokens = Month of breakfast subscription

### 5. Accessibility Features

- WCAG AA compliance maintained
- Screen reader support
- Keyboard navigation
- High contrast mode
- Text scaling

---

## Satvic Movement Integration

### Key Concepts Implemented

1. **Sunlight as Vitamin D Source**
   - Outdoor seating at cafes
   - Morning classes scheduled for sunlight exposure
   - Educational content about sunlight benefits

2. **Coconut as Superfood**
   - Featured in multiple menu items
   - Coconut water, coconut milk, coconut oil
   - Recipes highlighting coconut uses

3. **Wet Pack Therapy**
   - Educational workshops
   - Demonstration videos in recipe library
   - Integration with health tracking

4. **Enema for Detox**
   - Educational content (not services)
   - Workshops on natural detox methods
   - Health tracking for detox programs

5. **16-Hour Fasting**
   - Meal timing recommendations
   - Fasting-friendly menu options
   - Health tracking integration
   - Educational resources

6. **Juice Fasting**
   - Fresh juice menu
   - Juice cleanse programs
   - Guided fasting support
   - Health monitoring

7. **Seasonal & Local Eating**
   - Seasonal menu rotation
   - Local sourcing highlighted
   - Farmers market partnerships
   - Educational content on seasonal foods

8. **Mindful Eating**
   - Quiet dining spaces
   - Gratitude practices before meals
   - Eating meditation guides
   - Slow food movement

### Educational Content

- Blog posts on Satvic principles
- Video tutorials
- Cooking class curriculum
- Recipe descriptions with health benefits
- Seasonal eating guides
- Ayurvedic food combining

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [x] Database schema design
- [x] API routes implementation
- [x] Core components creation
- [ ] Database migration
- [ ] API testing
- [ ] Component integration

### Phase 2: Core Features (Weeks 3-4)

- [ ] Menu browsing and ordering
- [ ] Recipe library
- [ ] User dashboard
- [ ] Order management
- [ ] Payment integration
- [ ] Email notifications

### Phase 3: Advanced Features (Weeks 5-6)

- [ ] Cooking classes
- [ ] Meal subscriptions
- [ ] Health tracking
- [ ] Location finder
- [ ] Mobile responsiveness
- [ ] Performance optimization

### Phase 4: Admin & Operations (Weeks 7-8)

- [ ] Admin dashboard
- [ ] Menu management
- [ ] Order fulfillment system
- [ ] Class scheduling
- [ ] Analytics and reporting
- [ ] Franchise portal

### Phase 5: Launch Preparation (Weeks 9-10)

- [ ] User acceptance testing
- [ ] Content creation (recipes, classes)
- [ ] Marketing materials
- [ ] Staff training
- [ ] Soft launch
- [ ] Feedback collection

### Phase 6: Public Launch (Week 11+)

- [ ] Public announcement
- [ ] Marketing campaign
- [ ] Monitor and optimize
- [ ] Feature enhancements
- [ ] Scale operations

---

## Business Model

### Revenue Streams

1. **Food Sales**: Primary revenue from menu items
2. **Cooking Classes**: Class fees (triple pricing)
3. **Meal Subscriptions**: Recurring revenue
4. **Franchise Fees**: License fees and royalties
5. **Catering**: Corporate and event catering
6. **Product Sales**: Branded products (spices, utensils, books)

### Pricing Strategy

**Triple Pricing Tiers:**
- **Community**: Cost recovery (40% of fair price)
- **Fair**: True cost + fair margin (base price)
- **Supporter**: Premium pricing (150% of fair price)

**Target Distribution:**
- 30% Community tier (subsidized)
- 50% Fair tier (sustainable)
- 20% Supporter tier (cross-subsidy)

### Cost Structure

- **Food Costs**: 30-35% of revenue
- **Labor**: 25-30%
- **Rent & Utilities**: 10-15%
- **Marketing**: 5-10%
- **Technology**: 5%
- **Other Operating**: 10%
- **Profit Margin**: 10-15%

### Social Impact Metrics

- Meals served at community pricing
- Seva tokens redeemed
- Cooking classes conducted
- Health improvements tracked
- Women employed
- Waste diverted from landfills
- Local farmers supported

---

## Franchise Opportunities

### Franchise Model

**Investment Required:**
- Franchise Fee: ₹5,00,000 - ₹10,00,000
- Setup Costs: ₹15,00,000 - ₹25,00,000
- Working Capital: ₹5,00,000
- Total: ₹25,00,000 - ₹40,00,000

**Ongoing Fees:**
- Royalty: 5% of gross revenue
- Marketing Fund: 2% of gross revenue
- Technology Fee: ₹10,000/month

**Support Provided:**
- Site selection assistance
- Interior design and setup
- Menu and recipes
- Training program (2 weeks)
- Technology platform
- Marketing materials
- Ongoing operational support

**Ideal Franchisee:**
- Alignment with Satvic and Sakshi values
- Restaurant or hospitality experience (preferred)
- Financial capacity
- Commitment to community service
- Local market knowledge

### Application Process

1. **Initial Application**: Online form submission
2. **Review**: Team evaluates application
3. **Interview**: Video or in-person meeting
4. **Site Visit**: Visit existing cafe
5. **Approval**: Franchise committee decision
6. **Agreement**: Legal contract signing
7. **Training**: 2-week intensive training
8. **Setup**: 2-3 months setup period
9. **Launch**: Grand opening support
10. **Ongoing**: Regular check-ins and support

---

## Next Steps

### For Development Team

1. Run database migrations to create cafe tables
2. Integrate cafe router into main tRPC router
3. Create cafe pages using Next.js
4. Test API endpoints thoroughly
5. Implement payment integration
6. Set up email notifications
7. Create admin interfaces
8. Conduct user testing

### For Content Team

1. Create initial menu items (50-100 items)
2. Write and photograph recipes (100+ recipes)
3. Schedule first cooking classes
4. Create educational content
5. Develop marketing materials
6. Write franchise documentation

### For Operations Team

1. Source suppliers for ingredients
2. Hire and train cafe staff
3. Set up kitchen operations
4. Establish quality control processes
5. Create standard operating procedures
6. Plan launch events

---

## Conclusion

The Sakshi Cafe represents a holistic integration of conscious commerce, Satvic living, and community empowerment. By combining the triple pricing system, Seva Token economy, and Satvic Movement principles, the cafe creates a sustainable model for healthy, accessible, and spiritually-aligned food service.

This implementation provides the technical foundation for a transformative food experience that nourishes body, mind, and spirit while supporting the broader Sakshi Center vision of conscious living and social impact.

---

**Document Version**: 1.0  
**Last Updated**: November 9, 2025  
**Maintained By**: Sakshi Platform Development Team
