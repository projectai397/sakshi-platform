# Sakshi Cafe Testing and Integration Guide

## Overview

This guide provides comprehensive instructions for testing, integrating, and deploying the Sakshi Cafe features into the Sakshi platform.

**Created**: November 9, 2025  
**Status**: Ready for Testing  
**Version**: 1.0

---

## Pre-Deployment Checklist

### Database Setup

- [ ] **Run Database Migration**
  ```bash
  cd /home/ubuntu/sakshi
  pnpm drizzle-kit push
  ```
  This will create all 11 cafe tables in your MySQL database.

- [ ] **Verify Migration**
  ```bash
  # Check that all tables were created
  mysql -u [user] -p [database] -e "SHOW TABLES LIKE '%cafe%';"
  mysql -u [user] -p [database] -e "SHOW TABLES LIKE '%recipe%';"
  mysql -u [user] -p [database] -e "SHOW TABLES LIKE '%class%';"
  ```

- [ ] **Seed Sample Data**
  ```bash
  cd /home/ubuntu/sakshi
  npx ts-node server/db/seed-cafe.ts
  ```
  This will populate:
  - 2 cafe locations
  - 10 menu items
  - 3 recipes
  - 3 cooking classes

### API Testing

- [ ] **Test Menu Endpoints**
  ```bash
  # Get all menu items
  curl http://localhost:5000/api/trpc/cafe.menu.getMenuItems

  # Get menu item by ID
  curl http://localhost:5000/api/trpc/cafe.menu.getMenuItem?input={"id":1}

  # Get categories
  curl http://localhost:5000/api/trpc/cafe.menu.getCategories
  ```

- [ ] **Test Recipe Endpoints**
  ```bash
  # Get all recipes
  curl http://localhost:5000/api/trpc/cafe.recipes.getRecipes

  # Get recipe by ID
  curl http://localhost:5000/api/trpc/cafe.recipes.getRecipe?input={"id":1}
  ```

- [ ] **Test Class Endpoints**
  ```bash
  # Get upcoming classes
  curl http://localhost:5000/api/trpc/cafe.classes.getUpcomingClasses
  ```

- [ ] **Test Location Endpoints**
  ```bash
  # Get all locations
  curl http://localhost:5000/api/trpc/cafe.locations.getLocations

  # Find nearest locations
  curl http://localhost:5000/api/trpc/cafe.locations.findNearestLocations?input={"latitude":12.9716,"longitude":77.5946,"limit":5}
  ```

### Frontend Integration

- [ ] **Add Routes to Router**
  
  Edit your main router file (e.g., `client/src/App.tsx` or router config):
  
  ```tsx
  import CafeMenu from "@/pages/cafe/Menu";
  import Recipes from "@/pages/cafe/Recipes";
  import CookingClasses from "@/pages/cafe/Classes";
  import CafeDashboard from "@/pages/cafe/Dashboard";
  import CafeAdmin from "@/pages/admin/cafe/CafeAdmin";

  // Add routes
  <Route path="/cafe/menu" component={CafeMenu} />
  <Route path="/cafe/recipes" component={Recipes} />
  <Route path="/cafe/classes" component={CookingClasses} />
  <Route path="/cafe/dashboard" component={CafeDashboard} />
  <Route path="/admin/cafe" component={CafeAdmin} />
  ```

- [ ] **Add Navigation Links**
  
  Update your navigation component to include cafe links:
  
  ```tsx
  <Link href="/cafe/menu">Cafe Menu</Link>
  <Link href="/cafe/recipes">Recipes</Link>
  <Link href="/cafe/classes">Classes</Link>
  ```

- [ ] **Verify Component Imports**
  
  Ensure all cafe components are properly exported:
  - `MenuCard` from `@/components/cafe/MenuCard`
  - `RecipeCard` from `@/components/cafe/RecipeCard`
  - `ClassCard` from `@/components/cafe/ClassCard`

### Build and Compile

- [ ] **TypeScript Compilation**
  ```bash
  cd /home/ubuntu/sakshi
  pnpm tsc --noEmit
  ```
  Fix any TypeScript errors before proceeding.

- [ ] **Build Frontend**
  ```bash
  cd /home/ubuntu/sakshi/client
  pnpm build
  ```

- [ ] **Build Backend**
  ```bash
  cd /home/ubuntu/sakshi/server
  pnpm build
  ```

---

## Testing Scenarios

### User Flow Testing

#### 1. Browse Menu
- [ ] Visit `/cafe/menu`
- [ ] Search for menu items
- [ ] Filter by category
- [ ] View item details
- [ ] See triple pricing options
- [ ] Check Ayurvedic properties display

#### 2. Explore Recipes
- [ ] Visit `/cafe/recipes`
- [ ] Browse recipe library
- [ ] Filter by category and difficulty
- [ ] View recipe details
- [ ] Check ingredients and instructions
- [ ] Verify rating display

#### 3. View Cooking Classes
- [ ] Visit `/cafe/classes`
- [ ] Browse upcoming classes
- [ ] Filter by class type (in-person/virtual)
- [ ] View class details
- [ ] Check triple pricing
- [ ] See capacity and availability

#### 4. User Dashboard
- [ ] Login as user
- [ ] Visit `/cafe/dashboard`
- [ ] View orders tab
- [ ] View subscriptions tab
- [ ] View classes tab
- [ ] View health tracking tab

#### 5. Admin Functions
- [ ] Login as admin
- [ ] Visit `/admin/cafe`
- [ ] View overview statistics
- [ ] Navigate through all tabs
- [ ] Verify data display

### API Integration Testing

#### Create Order Flow
```typescript
// Test creating a cafe order
const orderData = {
  orderType: 'delivery',
  cafeLocationId: 1,
  deliveryAddress: '123 Test Street',
  items: [
    {
      menuItemId: 1,
      quantity: 2,
      priceTier: 'fair',
      customizations: 'Extra spicy'
    }
  ],
  specialInstructions: 'Ring doorbell twice'
};

const order = await trpc.cafe.orders.createOrder.mutate(orderData);
```

#### Register for Class
```typescript
// Test class registration
const registration = await trpc.cafe.classes.registerForClass.mutate({
  classId: 1,
  priceTier: 'community'
});
```

#### Submit Recipe
```typescript
// Test recipe submission
const recipe = await trpc.cafe.recipes.submitRecipe.mutate({
  title: 'My Satvic Recipe',
  description: 'A delicious plant-based dish',
  category: 'lunch',
  difficulty: 'easy',
  prepTime: 15,
  cookTime: 30,
  servings: 4,
  ingredients: [
    { name: 'Rice', quantity: '1', unit: 'cup' }
  ],
  instructions: [
    { step: 1, text: 'Cook rice' }
  ]
});
```

### Performance Testing

- [ ] **Page Load Times**
  - Menu page: < 2 seconds
  - Recipe page: < 2 seconds
  - Classes page: < 2 seconds
  - Dashboard: < 3 seconds

- [ ] **API Response Times**
  - Menu items query: < 500ms
  - Recipe query: < 500ms
  - Class query: < 500ms
  - Order creation: < 1s

- [ ] **Database Query Optimization**
  - Check for N+1 queries
  - Verify indexes are used
  - Monitor query execution time

### Security Testing

- [ ] **Authentication**
  - Protected routes require login
  - Admin routes require admin role
  - API endpoints validate user permissions

- [ ] **Input Validation**
  - All form inputs are validated
  - SQL injection prevention
  - XSS prevention

- [ ] **Data Privacy**
  - User data is properly scoped
  - Orders only visible to owner/admin
  - Health data is private

---

## Known Issues and Limitations

### Current Limitations

1. **Payment Integration**: Payment processing for orders and classes is not yet implemented. Will need to integrate with existing payment gateway.

2. **Image Uploads**: Menu items, recipes, and classes reference image URLs but upload functionality needs to be added.

3. **Email Notifications**: Order confirmations, class reminders, and recipe approvals need email integration.

4. **Real-time Updates**: Order status updates and class availability don't update in real-time yet.

5. **Mobile App**: Cafe features are web-only. Mobile app integration pending.

### TypeScript Errors

Some existing TypeScript errors in the project are unrelated to cafe implementation:
- Client-side library imports (react-hot-toast, ethers, workbox)
- Some AI/ML feature type mismatches

These should be fixed separately and don't affect cafe functionality.

---

## Deployment Steps

### Staging Environment

1. **Deploy Database Changes**
   ```bash
   # On staging server
   cd /path/to/sakshi
   pnpm drizzle-kit push
   npx ts-node server/db/seed-cafe.ts
   ```

2. **Deploy Application**
   ```bash
   # Build and deploy
   pnpm build
   pm2 restart sakshi-app
   ```

3. **Verify Deployment**
   - Check all cafe pages load
   - Test API endpoints
   - Verify data displays correctly

### Production Environment

1. **Backup Database**
   ```bash
   mysqldump -u [user] -p [database] > backup_$(date +%Y%m%d).sql
   ```

2. **Run Migration**
   ```bash
   pnpm drizzle-kit push
   ```

3. **Seed Initial Data**
   ```bash
   # Only seed locations and initial menu items
   # Don't seed test data in production
   npx ts-node server/db/seed-cafe.ts
   ```

4. **Deploy Application**
   ```bash
   pnpm build
   pm2 restart sakshi-app
   ```

5. **Post-Deployment Verification**
   - [ ] All pages accessible
   - [ ] API endpoints working
   - [ ] No console errors
   - [ ] Mobile responsive
   - [ ] Performance acceptable

---

## Monitoring and Maintenance

### Metrics to Track

- **Orders**
  - Daily order count
  - Average order value
  - Order completion rate
  - Cancellation rate

- **Classes**
  - Registration count
  - Attendance rate
  - Class satisfaction scores
  - Revenue per class

- **Recipes**
  - Submission rate
  - Approval rate
  - Average rating
  - Most popular recipes

- **Health Tracking**
  - Active users
  - Logging frequency
  - Nutrition trends

### Regular Maintenance

- **Weekly**
  - Review pending recipe submissions
  - Monitor order fulfillment
  - Check class attendance
  - Review user feedback

- **Monthly**
  - Update menu items seasonally
  - Add new recipes
  - Schedule new classes
  - Analyze performance metrics

- **Quarterly**
  - Review pricing tiers
  - Assess franchise applications
  - Update Ayurvedic content
  - Plan new features

---

## Troubleshooting

### Common Issues

**Issue**: Menu items not displaying
- Check database connection
- Verify seed data ran successfully
- Check API endpoint in browser console
- Ensure tRPC router is properly integrated

**Issue**: Orders not creating
- Verify user is authenticated
- Check menu item IDs exist
- Ensure cafe location is active
- Review API error messages

**Issue**: Classes not showing
- Check date/time filters
- Verify isActive flag is true
- Ensure future dates
- Check API response

**Issue**: Images not loading
- Verify image URLs are correct
- Check image paths exist
- Ensure proper permissions
- Consider using placeholder images

---

## Next Steps

### Immediate (Week 1-2)
- [ ] Add payment integration for orders and classes
- [ ] Implement image upload functionality
- [ ] Set up email notifications
- [ ] Add order tracking page
- [ ] Create class detail page
- [ ] Build recipe detail page

### Short-term (Month 1)
- [ ] Implement subscription management
- [ ] Add health metrics visualization
- [ ] Create franchise application form
- [ ] Build admin management interfaces
- [ ] Add review and rating system
- [ ] Implement search improvements

### Medium-term (Month 2-3)
- [ ] Mobile app integration
- [ ] Real-time order updates
- [ ] Advanced analytics dashboard
- [ ] Loyalty program integration
- [ ] Social sharing features
- [ ] Recipe video uploads

### Long-term (Month 4+)
- [ ] Multi-language support
- [ ] Franchise portal
- [ ] Inventory management
- [ ] Staff scheduling
- [ ] Catering module
- [ ] Meal kit delivery

---

## Support and Resources

### Documentation
- [Sakshi Cafe Guide](./SAKSHI_CAFE_GUIDE.md)
- [Satvic Movement Integration Report](./SATVIC_MOVEMENT_INTEGRATION_REPORT.md)
- [Implementation Summary](./CAFE_IMPLEMENTATION_SUMMARY.md)

### API Documentation
- tRPC endpoints: `http://localhost:5000/api/trpc-panel` (if enabled)
- Database schema: `drizzle/schema-cafe.ts`
- API routes: `server/routes/cafe/`

### Contact
For questions or issues:
- GitHub Issues: https://github.com/projectai397/sakshi-platform/issues
- Email: support@sakshicenter.org

---

**Last Updated**: November 9, 2025  
**Version**: 1.0  
**Status**: Ready for Testing
