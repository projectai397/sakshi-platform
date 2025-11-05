# Sakshi (साक्षी) - Witness Platform

**Sakshi** means "witness" in Sanskrit - a revolutionary NGO platform that witnesses and supports every individual's journey toward dignity, sustainability, and community connection.

## 🌟 Project Overview

Sakshi is a comprehensive full-stack web application built with modern technologies, featuring:

- **Triple Pricing System**: Pay with money (sliding scale), seva tokens (earned through volunteering), or request items free
- **Adiyogi Ghibli-Style Aesthetics**: Beautiful spiritual backgrounds inspired by Adiyogi and Studio Ghibli art across all pages
- **15+ Complete Pages**: Home, Shop, Cafes, Retreats, Meditation, Repair Café, and more
- **Circular Economy Programs**: Thrift store, women's cooperatives, repair cafés, swap events
- **Seva Token Economy**: Earn tokens through volunteering and use them across all Sakshi programs

## 🎨 Design Philosophy

The platform combines the spiritual essence of Adiyogi with the whimsical, nature-inspired aesthetics of Studio Ghibli films. Each page features carefully curated background images that create an immersive, peaceful experience while maintaining excellent readability.

### Background Images by Page

- **Home**: Adiyogi with devotee in traditional attire
- **About**: Meditation at Isha Yoga Centre
- **Shop**: Spiritual seeker at Adiyogi
- **Product Details**: Devotional worship scene
- **Cafes**: Mountain landscape with Adiyogi
- **Repair Café**: Sunset over Adiyogi statue
- **Retreats**: Forest meditation scenes
- **Meditate**: Nature and spiritual landscapes
- And more across all 15+ pages...

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Wouter** for routing
- **tRPC** for type-safe APIs
- **Framer Motion** for animations

### Backend
- **Express 4** server
- **tRPC 11** for API layer
- **MySQL/TiDB** database
- **Drizzle ORM** for database queries
- **S3-compatible storage** for images

### Development Tools
- **Vite 7** for fast builds
- **pnpm** for package management
- **TypeScript 5.9** for type safety
- **ESBuild** for production builds

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🎯 Key Features

### 1. Triple Pricing System
Every item can be purchased through three methods:
- **Sliding Scale**: Pay what you can afford (₹50-₹300 range)
- **Seva Tokens**: Earn through volunteering (1 hour = 1 token)
- **Request Free**: No questions asked, dignity-centered approach

### 2. Seva Token Economy
- Earn tokens through volunteering, repairs, workshops
- Use tokens across all Sakshi programs
- Track balance, history, and expiring tokens
- Complete transparency and audit trail

### 3. Circular Economy Programs
- **Sakshi Cafés**: Women's cooperatives with democratic governance
- **Repair Café**: Fix items, earn tokens, reduce waste
- **Swap Events**: Money-free exchange platform
- **Upcycle Studio**: Creative workshops and materials marketplace
- **Children's Free Zone**: All kids' items always free

### 4. Admin Dashboard
Complete platform management with:
- Product management (CRUD operations)
- User management and role control
- Order tracking and analytics
- Donation processing
- Impact metrics visualization

## 🌍 Environmental Impact

The platform tracks and displays:
- Water saved (2,700 liters per clothing item)
- CO₂ emissions prevented (5.5 kg per item)
- Items diverted from landfills
- Extended product lifecycles

## 🎨 Adiyogi Ghibli Backgrounds

All background images are stored in `/client/public/images/backgrounds/` and applied via custom CSS classes:

- `adiyogi-bg-1` through `adiyogi-bg-4`: Main Adiyogi scenes
- `adiyogi-bg-mountain`: Mountain landscape
- `adiyogi-bg-sunset`: Sunset scenes
- `adiyogi-bg-forest`: Forest meditation
- `adiyogi-bg-nature`: Natural landscapes

Each background uses `background-attachment: fixed` for a parallax effect and includes overlay options for text readability.

## 📱 Pages Structure

```
/                    - Home page with hero and features
/shop                - Product catalog with filters
/product/:slug       - Individual product details
/cafes               - Café cooperative information
/cafe-locations      - All café locations
/repair-cafe         - Repair café events and requests
/retreats            - Spiritual retreat listings
/meditate            - Meditation resources
/circular-economy    - Circular economy overview
/volunteer           - Volunteer opportunities
/donate              - Donation portal
/contact             - Contact form
/faq                 - Frequently asked questions
/profile             - User profile and dashboard
/seva-wallet         - Seva token management
/cart                - Shopping cart
/checkout            - Checkout process
```

## 🔐 Authentication

The platform uses Manus OAuth for secure authentication with:
- Session management
- Role-based access control (admin, user)
- Protected routes for admin features

## 📊 Database Schema

19 interconnected tables including:
- Users, Products, Categories
- Carts, Orders, OrderItems
- SevaWallets, SevaTransactions
- Events, VolunteerShifts
- RepairRequests, Donations
- ImpactMetrics

## 🚀 Deployment

The platform is designed for deployment on:
- Auto-scaling infrastructure
- Global CDN for fast asset delivery
- MySQL/TiDB for database
- S3-compatible storage for images

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📄 License

MIT License - Built with ❤️ by Manus AI

## 🙏 Acknowledgments

- Inspired by Adiyogi and the spiritual teachings of Isha Foundation
- Design aesthetics influenced by Studio Ghibli films
- Built on the principles of dignity, sustainability, and community

---

**Sakshi** - Witnessing every journey, supporting every soul 🌿✨
