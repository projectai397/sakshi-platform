# Sakshi Platform - Business Operations Guide

**Date**: November 9, 2025  
**Purpose**: Comprehensive guide for inventory management, staff scheduling, and operational efficiency

---

## Overview

The Business Operations system provides complete tools for managing:
- **Inventory Management** - Track ingredients, supplies, and stock levels
- **Staff Management** - Employee records, scheduling, and performance
- **Supplier Management** - Vendor relationships and purchase orders
- **Production Tracking** - Food preparation batches and costing
- **Waste Management** - Track and reduce food waste

---

## Database Schema

### Inventory Management (8 Tables)

**1. inventory_items** - Master list of all inventory
- Tracks current stock, min/max levels
- Cost per unit for accurate costing
- Organic and local sourcing flags
- Expiry tracking for perishables

**2. stock_movements** - All inventory transactions
- Purchase, usage, waste, adjustments
- Links to orders and production batches
- Complete audit trail

**3. purchase_orders** - Orders from suppliers
- Draft → Sent → Confirmed → Received workflow
- Payment tracking
- Expected vs actual delivery dates

**4. purchase_order_items** - Line items in POs
- Quantity ordered vs received
- Unit pricing and totals

**5. suppliers** - Vendor management
- Contact information
- Payment terms
- Organic/local certification
- Performance ratings

**6. waste_logs** - Food waste tracking
- Categorized by type (spoilage, prep, customer leftover)
- Cost estimation
- Sustainability metrics

**7. production_batches** - Food prep tracking
- Batch numbers for traceability
- Expiry dates
- Prepared by staff member

**8. recipe_ingredients** - Recipe costing
- Links menu items to inventory
- Calculates food cost per dish

### Staff Management (5 Tables)

**1. staff_members** - Employee records
- Personal information
- Role and department
- Employment type and compensation
- Emergency contacts

**2. staff_schedules** - Work schedules
- Shift assignments
- Start/end times
- Shift types (morning, afternoon, evening)

**3. time_logs** - Clock in/out tracking
- Actual hours worked
- Break duration
- Overtime calculation
- Approval workflow

**4. leave_requests** - Time off management
- Leave type (sick, vacation, personal)
- Approval workflow
- Balance tracking

**5. staff_performance** - Performance reviews
- Quarterly or monthly reviews
- Multiple rating categories
- Goals and feedback

---

## Key Features

### 1. Automated Reordering

**Low Stock Alerts**:
```typescript
// Check items below minimum stock
SELECT * FROM inventory_items 
WHERE current_stock < min_stock
ORDER BY (current_stock / min_stock) ASC;
```

**Auto-Generate Purchase Orders**:
- System suggests PO when stock hits reorder point
- Calculates optimal order quantity
- Selects preferred supplier automatically

### 2. Real-Time Stock Tracking

**Stock Updates**:
- Automatic deduction when orders placed
- Batch updates when deliveries received
- Waste logging reduces stock

**Stock Valuation**:
```typescript
// Calculate total inventory value
SELECT SUM(current_stock * cost_per_unit) as total_value
FROM inventory_items;
```

### 3. Food Cost Analysis

**Recipe Costing**:
```typescript
// Calculate cost of a menu item
SELECT 
  mi.name,
  SUM(ri.quantity * ii.cost_per_unit) as total_cost
FROM sakshi_menu_items mi
JOIN recipe_ingredients ri ON mi.id = ri.menu_item_id
JOIN inventory_items ii ON ri.inventory_item_id = ii.id
WHERE mi.id = ?
GROUP BY mi.id;
```

**Profit Margin Calculation**:
```
Food Cost = Sum of ingredient costs
Selling Price = Community/Fair/Supporter tier price
Profit Margin = (Selling Price - Food Cost) / Selling Price * 100
```

### 4. Waste Reduction

**Waste Tracking**:
- Log all waste with reason
- Calculate waste percentage
- Identify patterns

**Waste Metrics**:
```typescript
// Weekly waste report
SELECT 
  DATE(logged_at) as date,
  waste_type,
  SUM(quantity) as total_quantity,
  SUM(estimated_cost) as total_cost
FROM waste_logs
WHERE logged_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(logged_at), waste_type;
```

**Target**: < 5% food waste

### 5. Staff Scheduling

**Shift Planning**:
- Create weekly schedules
- Assign roles per shift
- Ensure adequate coverage

**Labor Cost Tracking**:
```typescript
// Calculate labor cost for a period
SELECT 
  SUM(tl.total_hours * sm.hourly_rate) as total_labor_cost
FROM time_logs tl
JOIN staff_members sm ON tl.staff_id = sm.id
WHERE tl.clock_in >= ? AND tl.clock_in < ?;
```

### 6. Performance Management

**Key Metrics**:
- Punctuality (on-time arrival rate)
- Quality (customer feedback, order accuracy)
- Teamwork (peer reviews)
- Customer service (ratings)

**Review Cycle**:
- Monthly check-ins
- Quarterly formal reviews
- Annual performance summary

---

## Workflows

### Purchase Order Workflow

1. **Check Stock Levels**
   - System identifies low stock items
   - Generates suggested PO

2. **Create Purchase Order**
   - Select supplier
   - Add items and quantities
   - Review pricing
   - Save as draft

3. **Approve and Send**
   - Manager reviews and approves
   - System sends PO to supplier (email)
   - Status: Draft → Sent

4. **Receive Delivery**
   - Check items against PO
   - Log received quantities
   - Update inventory
   - Status: Sent → Received

5. **Process Payment**
   - Verify invoice
   - Process payment
   - Update payment status

### Staff Shift Workflow

1. **Create Schedule**
   - Manager creates weekly schedule
   - Assigns staff to shifts
   - Publishes schedule

2. **Clock In**
   - Staff clocks in at start of shift
   - System records time

3. **Clock Out**
   - Staff clocks out at end
   - System calculates hours
   - Accounts for breaks

4. **Approval**
   - Manager reviews time logs
   - Approves hours
   - Flags discrepancies

5. **Payroll**
   - Export approved hours
   - Calculate wages
   - Process payment

### Waste Logging Workflow

1. **Identify Waste**
   - Staff identifies wasted food/supplies

2. **Log Waste**
   - Enter item, quantity, reason
   - Estimate cost
   - Submit log

3. **Update Inventory**
   - System deducts from stock
   - Records as waste movement

4. **Analysis**
   - Weekly waste reports
   - Identify patterns
   - Implement improvements

---

## API Endpoints

### Inventory Management

```typescript
// Get all inventory items
GET /api/trpc/operations.inventory.list

// Get item details
GET /api/trpc/operations.inventory.get?id=123

// Update stock level
POST /api/trpc/operations.inventory.updateStock
{
  itemId: 123,
  quantity: 50,
  movementType: "purchase",
  notes: "Weekly delivery"
}

// Get low stock items
GET /api/trpc/operations.inventory.lowStock

// Get stock movements
GET /api/trpc/operations.inventory.movements?itemId=123
```

### Purchase Orders

```typescript
// Create purchase order
POST /api/trpc/operations.purchaseOrders.create
{
  supplierId: 5,
  locationId: 1,
  items: [
    { itemId: 10, quantity: 50, unitPrice: 25 },
    { itemId: 15, quantity: 30, unitPrice: 40 }
  ]
}

// Receive delivery
POST /api/trpc/operations.purchaseOrders.receive
{
  orderId: 123,
  items: [
    { itemId: 10, receivedQuantity: 48 }, // Partial delivery
    { itemId: 15, receivedQuantity: 30 }
  ]
}

// Get pending orders
GET /api/trpc/operations.purchaseOrders.pending
```

### Staff Management

```typescript
// Create staff schedule
POST /api/trpc/operations.staff.createSchedule
{
  staffId: 10,
  shiftDate: "2025-11-10",
  startTime: "09:00",
  endTime: "17:00",
  shiftType: "morning"
}

// Clock in
POST /api/trpc/operations.staff.clockIn
{
  staffId: 10,
  scheduleId: 456
}

// Clock out
POST /api/trpc/operations.staff.clockOut
{
  timeLogId: 789
}

// Request leave
POST /api/trpc/operations.staff.requestLeave
{
  staffId: 10,
  leaveType: "vacation",
  startDate: "2025-12-20",
  endDate: "2025-12-27",
  reason: "Family vacation"
}
```

### Waste Management

```typescript
// Log waste
POST /api/trpc/operations.waste.log
{
  locationId: 1,
  itemId: 25,
  quantity: 2.5,
  unit: "kg",
  wasteType: "spoilage",
  reason: "Expired vegetables"
}

// Get waste report
GET /api/trpc/operations.waste.report?startDate=2025-11-01&endDate=2025-11-07
```

---

## Dashboard Components

### Inventory Dashboard

**Key Metrics**:
- Total inventory value
- Low stock items count
- Pending purchase orders
- This month's purchases

**Charts**:
- Stock levels by category
- Purchase trends (last 6 months)
- Waste percentage by type
- Supplier performance

### Staff Dashboard

**Key Metrics**:
- Active staff count
- This week's labor hours
- Pending leave requests
- Overtime hours

**Charts**:
- Attendance rate
- Labor cost trends
- Performance ratings distribution
- Shift coverage heatmap

### Operations Dashboard

**Key Metrics**:
- Food cost percentage
- Waste percentage
- Labor cost percentage
- Profit margin

**Charts**:
- Cost breakdown (food, labor, overhead)
- Efficiency trends
- Production vs sales
- Supplier spending

---

## Reports

### Daily Reports

**1. Stock Movement Report**
- All stock changes today
- Purchases, usage, waste
- Current stock levels

**2. Staff Attendance Report**
- Who's working today
- Clock in/out times
- No-shows and late arrivals

**3. Waste Log Report**
- All waste logged today
- Total cost of waste
- Waste by type

### Weekly Reports

**1. Inventory Summary**
- Stock levels by category
- Items below minimum
- Suggested reorders
- Inventory value

**2. Labor Summary**
- Total hours worked
- Labor cost
- Overtime hours
- Attendance rate

**3. Waste Analysis**
- Total waste this week
- Waste percentage
- Cost of waste
- Trends and patterns

### Monthly Reports

**1. Financial Summary**
- Total revenue
- Food cost
- Labor cost
- Profit margin

**2. Supplier Performance**
- On-time delivery rate
- Quality issues
- Pricing trends
- Top suppliers

**3. Staff Performance**
- Individual performance scores
- Team productivity
- Training needs
- Recognition

---

## Best Practices

### Inventory Management

1. **Daily Stock Checks**
   - Check critical items daily
   - Update stock levels
   - Flag discrepancies

2. **FIFO (First In, First Out)**
   - Use oldest stock first
   - Prevent spoilage
   - Reduce waste

3. **Regular Audits**
   - Monthly physical count
   - Compare with system
   - Investigate variances

4. **Supplier Relationships**
   - Maintain good communication
   - Negotiate better terms
   - Diversify suppliers

### Staff Management

1. **Fair Scheduling**
   - Publish schedules in advance
   - Consider preferences
   - Ensure adequate rest

2. **Clear Communication**
   - Regular team meetings
   - Open door policy
   - Feedback culture

3. **Training & Development**
   - Onboarding program
   - Ongoing training
   - Career progression

4. **Recognition**
   - Acknowledge good work
   - Employee of the month
   - Performance bonuses

### Waste Reduction

1. **Accurate Forecasting**
   - Predict demand
   - Order appropriately
   - Avoid over-production

2. **Proper Storage**
   - Correct temperatures
   - Proper containers
   - Clear labeling

3. **Creative Use**
   - Use trimmings in stocks
   - Repurpose leftovers
   - Compost organic waste

4. **Staff Training**
   - Proper portioning
   - Careful handling
   - Waste awareness

---

## Integration with Other Systems

### Point of Sale (POS)

- Orders automatically deduct from inventory
- Real-time stock updates
- Sales data for forecasting

### Accounting

- Purchase orders sync to accounts payable
- Payroll integration
- Financial reporting

### Menu Planning

- Recipe costing informs menu prices
- Seasonal ingredient availability
- Profitability analysis

---

## Mobile App Features

### For Staff

- Clock in/out via mobile
- View schedule
- Request shift swaps
- Submit leave requests
- View pay stubs

### For Managers

- Approve time logs
- Review inventory alerts
- Approve purchase orders
- Monitor real-time operations

---

## Security & Permissions

**Role-Based Access**:

- **Admin**: Full access to all features
- **Manager**: Inventory, staff, reports
- **Staff**: Clock in/out, view schedule
- **Kitchen**: Inventory usage, production batches
- **Cashier**: POS, basic inventory view

**Audit Trail**:
- All changes logged
- User attribution
- Timestamp tracking

---

## Performance Targets

**Inventory**:
- Stock accuracy: > 98%
- Stockout rate: < 2%
- Inventory turnover: 12-15 times/year

**Labor**:
- Labor cost: 25-30% of revenue
- Attendance rate: > 95%
- Overtime: < 5% of total hours

**Waste**:
- Food waste: < 5% of purchases
- Waste cost: < 3% of food cost

**Operations**:
- Food cost: 25-30% of revenue
- Prime cost (food + labor): 55-60%
- Profit margin: 10-15%

---

## Troubleshooting

**Issue**: Stock levels don't match physical count

**Solutions**:
1. Conduct physical audit
2. Review recent movements
3. Check for unlogged usage
4. Adjust inventory with notes

**Issue**: High food waste

**Solutions**:
1. Review waste logs for patterns
2. Improve demand forecasting
3. Train staff on portioning
4. Implement FIFO strictly

**Issue**: Labor cost too high

**Solutions**:
1. Optimize scheduling
2. Cross-train staff
3. Review overtime policies
4. Improve efficiency

---

## Future Enhancements

1. **Predictive Analytics**
   - AI-powered demand forecasting
   - Automatic reorder suggestions
   - Waste prediction

2. **IoT Integration**
   - Smart scales for inventory
   - Temperature monitoring
   - Automated stock tracking

3. **Supplier Portal**
   - Online ordering
   - Real-time inventory sync
   - Automated invoicing

4. **Mobile Inventory**
   - Barcode scanning
   - Quick stock updates
   - Photo documentation

---

**Efficient operations create sustainable impact!** 📊🌿

*Last updated: November 9, 2025*
