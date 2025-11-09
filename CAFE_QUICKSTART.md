# Sakshi Cafe - Quick Start Guide

## For Developers

This guide will get you up and running with Sakshi Cafe in under 10 minutes.

---

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- MySQL 8.0+ running
- Git repository cloned

---

## Quick Setup (3 Steps)

### Step 1: Configure Environment

Create `.env` file in project root:

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/sakshi"

# Server
NODE_ENV=development
PORT=5000

# Add other required environment variables
```

### Step 2: Run Deployment Script

```bash
cd /path/to/sakshi
./deploy-cafe.sh
```

This script will:
- Install dependencies
- Run database migration
- Seed sample data
- Build the application

### Step 3: Start Development Server

```bash
# Start backend
cd server
pnpm dev

# In another terminal, start frontend
cd client
pnpm dev
```

---

## Access the Cafe

Once running, visit:

- **Menu**: http://localhost:5173/cafe/menu
- **Recipes**: http://localhost:5173/cafe/recipes
- **Classes**: http://localhost:5173/cafe/classes
- **Dashboard**: http://localhost:5173/cafe/dashboard
- **Admin**: http://localhost:5173/admin/cafe

---

## Manual Setup (If Script Fails)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Migration

```bash
pnpm drizzle-kit push
```

### 3. Seed Data

```bash
npx ts-node server/db/seed-cafe.ts
```

### 4. Build

```bash
pnpm build
```

---

## Verify Installation

### Check Database Tables

```sql
SHOW TABLES LIKE '%cafe%';
SHOW TABLES LIKE '%recipe%';
SHOW TABLES LIKE '%class%';
```

Expected tables:
- cafe_locations
- sakshi_menu_items
- recipes
- sakshi_cafe_orders
- cooking_classes
- class_registrations
- meal_subscriptions
- subscription_deliveries
- franchises
- nutrition_logs
- health_metrics

### Check Seed Data

```sql
SELECT COUNT(*) FROM cafe_locations;  -- Should be 2
SELECT COUNT(*) FROM sakshi_menu_items;  -- Should be 10
SELECT COUNT(*) FROM recipes;  -- Should be 3
SELECT COUNT(*) FROM cooking_classes;  -- Should be 3
```

### Test API Endpoints

```bash
# Get menu items
curl http://localhost:5000/api/trpc/cafe.menu.getMenuItems

# Get recipes
curl http://localhost:5000/api/trpc/cafe.recipes.getRecipes

# Get classes
curl http://localhost:5000/api/trpc/cafe.classes.getUpcomingClasses
```

---

## Common Issues

### Issue: Database connection failed

**Solution**: Check DATABASE_URL in .env file
```bash
# Test MySQL connection
mysql -u user -p -e "SELECT 1"
```

### Issue: Migration fails

**Solution**: Ensure database exists
```bash
mysql -u user -p -e "CREATE DATABASE IF NOT EXISTS sakshi"
```

### Issue: Seed script fails

**Solution**: Run migration first
```bash
pnpm drizzle-kit push
npx ts-node server/db/seed-cafe.ts
```

### Issue: Routes not found

**Solution**: Check App.tsx has cafe routes imported
```typescript
import CafeMenu from "./pages/cafe/Menu";
// ... other imports
```

### Issue: TypeScript errors

**Solution**: Some existing errors are unrelated to cafe
```bash
# Check cafe-specific files only
pnpm tsc --noEmit | grep cafe
```

---

## Development Workflow

### 1. Make Changes

Edit files in:
- `server/routes/cafe/` - API routes
- `client/src/pages/cafe/` - Frontend pages
- `drizzle/schema-cafe.ts` - Database schema

### 2. Test Changes

```bash
# Backend hot reload
cd server && pnpm dev

# Frontend hot reload
cd client && pnpm dev
```

### 3. Commit Changes

```bash
git add .
git commit -m "feat: your changes"
git push origin master
```

---

## Testing

### Unit Tests (if available)

```bash
pnpm test
```

### Manual Testing Checklist

- [ ] Browse menu page
- [ ] Search and filter menu items
- [ ] View menu item details
- [ ] Browse recipes
- [ ] View recipe details
- [ ] Browse cooking classes
- [ ] View class details
- [ ] Access user dashboard (requires login)
- [ ] Access admin dashboard (requires admin role)

---

## Production Deployment

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Environment Variables

Ensure these are set in production:

```bash
NODE_ENV=production
DATABASE_URL=<production-database-url>
PORT=5000
# Add all other required variables
```

---

## Useful Commands

```bash
# Install dependencies
pnpm install

# Run database migration
pnpm drizzle-kit push

# Generate migration file
pnpm drizzle-kit generate

# Seed database
npx ts-node server/db/seed-cafe.ts

# Build application
pnpm build

# Start development
pnpm dev

# Start production
pnpm start

# Run tests
pnpm test

# Type check
pnpm tsc --noEmit

# Lint
pnpm lint
```

---

## File Structure

```
sakshi/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── cafe/
│       │   │   ├── Menu.tsx
│       │   │   ├── Recipes.tsx
│       │   │   ├── Classes.tsx
│       │   │   └── Dashboard.tsx
│       │   └── admin/
│       │       └── cafe/
│       │           └── CafeAdmin.tsx
│       └── components/
│           └── cafe/
│               ├── MenuCard.tsx
│               ├── RecipeCard.tsx
│               └── ClassCard.tsx
├── server/
│   ├── routes/
│   │   └── cafe/
│   │       ├── index.ts
│   │       ├── menu.ts
│   │       ├── orders.ts
│   │       ├── recipes.ts
│   │       ├── classes.ts
│   │       ├── subscriptions.ts
│   │       ├── locations.ts
│   │       └── health.ts
│   └── db/
│       └── seed-cafe.ts
├── drizzle/
│   ├── schema-cafe.ts
│   └── 0005_abandoned_wendell_rand.sql
├── deploy-cafe.sh
└── CAFE_*.md (documentation)
```

---

## Next Steps

After successful setup:

1. **Explore the code** - Understand the architecture
2. **Customize content** - Add your own menu items, recipes, classes
3. **Add features** - Payment integration, email notifications, image upload
4. **Test thoroughly** - Ensure everything works as expected
5. **Deploy** - Push to staging/production

---

## Resources

- [Full Implementation Guide](./SAKSHI_CAFE_GUIDE.md)
- [User Guide](./CAFE_USER_GUIDE.md)
- [Testing Guide](./CAFE_TESTING_GUIDE.md)
- [Deployment Checklist](./CAFE_DEPLOYMENT_CHECKLIST.md)
- [GitHub Repository](https://github.com/projectai397/sakshi-platform)

---

## Support

**Issues?** Check the [Testing Guide](./CAFE_TESTING_GUIDE.md) troubleshooting section.

**Questions?** Open an issue on GitHub.

---

**Happy Coding! 🌿**

*Last updated: November 9, 2025*
