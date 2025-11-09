/**
 * Business Operations Schema
 * Inventory Management, Staff Scheduling, Supplier Management
 */

import { mysqlTable, int, varchar, decimal, datetime, boolean, text, timestamp } from 'drizzle-orm/mysql-core';

// ==================== INVENTORY MANAGEMENT ====================

/**
 * Inventory Items - Track all ingredients and supplies
 */
export const inventoryItems = mysqlTable('inventory_items', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(), // 'ingredient', 'packaging', 'supplies'
  unit: varchar('unit', { length: 50 }).notNull(), // 'kg', 'liter', 'piece', etc.
  currentStock: decimal('current_stock', { precision: 10, scale: 2 }).notNull().default('0'),
  minStock: decimal('min_stock', { precision: 10, scale: 2 }).notNull(), // Reorder threshold
  maxStock: decimal('max_stock', { precision: 10, scale: 2 }).notNull(), // Maximum capacity
  costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }).notNull(),
  supplierId: int('supplier_id'),
  location: varchar('location', { length: 100 }), // Storage location in cafe
  expiryTracking: boolean('expiry_tracking').default(false),
  isOrganic: boolean('is_organic').default(false),
  isLocal: boolean('is_local').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Stock Movements - Track all inventory changes
 */
export const stockMovements = mysqlTable('stock_movements', {
  id: int('id').primaryKey().autoincrement(),
  itemId: int('item_id').notNull(),
  movementType: varchar('movement_type', { length: 50 }).notNull(), // 'purchase', 'usage', 'waste', 'adjustment'
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
  reason: varchar('reason', { length: 255 }),
  referenceType: varchar('reference_type', { length: 50 }), // 'order', 'purchase', 'waste_log'
  referenceId: int('reference_id'),
  performedBy: int('performed_by'), // User ID
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Purchase Orders - Orders from suppliers
 */
export const purchaseOrders = mysqlTable('purchase_orders', {
  id: int('id').primaryKey().autoincrement(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  supplierId: int('supplier_id').notNull(),
  locationId: int('location_id').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // 'draft', 'sent', 'confirmed', 'received', 'cancelled'
  orderDate: datetime('order_date').notNull(),
  expectedDelivery: datetime('expected_delivery'),
  actualDelivery: datetime('actual_delivery'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  notes: text('notes'),
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Purchase Order Items - Line items in purchase orders
 */
export const purchaseOrderItems = mysqlTable('purchase_order_items', {
  id: int('id').primaryKey().autoincrement(),
  purchaseOrderId: int('purchase_order_id').notNull(),
  itemId: int('item_id').notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  receivedQuantity: decimal('received_quantity', { precision: 10, scale: 2 }).default('0'),
  notes: text('notes'),
});

/**
 * Suppliers - Vendor management
 */
export const suppliers = mysqlTable('suppliers', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  gstNumber: varchar('gst_number', { length: 50 }),
  paymentTerms: varchar('payment_terms', { length: 100 }), // '30 days', 'COD', etc.
  isOrganic: boolean('is_organic').default(false),
  isLocal: boolean('is_local').default(false),
  rating: int('rating').default(0), // 1-5 stars
  status: varchar('status', { length: 50 }).default('active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Waste Logs - Track food waste for sustainability
 */
export const wasteLogs = mysqlTable('waste_logs', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  itemId: int('item_id'),
  itemName: varchar('item_name', { length: 255 }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  wasteType: varchar('waste_type', { length: 50 }).notNull(), // 'spoilage', 'preparation', 'customer_leftover', 'expired'
  reason: text('reason'),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  loggedBy: int('logged_by'),
  loggedAt: timestamp('logged_at').defaultNow(),
});

// ==================== STAFF MANAGEMENT ====================

/**
 * Staff Members - Employee records
 */
export const staffMembers = mysqlTable('staff_members', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id'), // Link to users table
  employeeId: varchar('employee_id', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 100 }).notNull(), // 'chef', 'server', 'manager', 'cashier'
  department: varchar('department', { length: 100 }), // 'kitchen', 'service', 'admin'
  locationId: int('location_id').notNull(),
  hireDate: datetime('hire_date').notNull(),
  terminationDate: datetime('termination_date'),
  employmentType: varchar('employment_type', { length: 50 }).notNull(), // 'full-time', 'part-time', 'contract'
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  monthlySalary: decimal('monthly_salary', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).default('active'), // 'active', 'on_leave', 'terminated'
  emergencyContact: varchar('emergency_contact', { length: 255 }),
  emergencyPhone: varchar('emergency_phone', { length: 20 }),
  address: text('address'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Staff Schedules - Work schedules and shifts
 */
export const staffSchedules = mysqlTable('staff_schedules', {
  id: int('id').primaryKey().autoincrement(),
  staffId: int('staff_id').notNull(),
  locationId: int('location_id').notNull(),
  shiftDate: datetime('shift_date').notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(), // '09:00'
  endTime: varchar('end_time', { length: 10 }).notNull(), // '17:00'
  shiftType: varchar('shift_type', { length: 50 }).notNull(), // 'morning', 'afternoon', 'evening', 'night'
  role: varchar('role', { length: 100 }), // Role for this specific shift
  status: varchar('status', { length: 50 }).default('scheduled'), // 'scheduled', 'completed', 'no_show', 'cancelled'
  notes: text('notes'),
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Time Logs - Clock in/out tracking
 */
export const timeLogs = mysqlTable('time_logs', {
  id: int('id').primaryKey().autoincrement(),
  staffId: int('staff_id').notNull(),
  scheduleId: int('schedule_id'),
  locationId: int('location_id').notNull(),
  clockIn: datetime('clock_in').notNull(),
  clockOut: datetime('clock_out'),
  breakDuration: int('break_duration').default(0), // Minutes
  totalHours: decimal('total_hours', { precision: 5, scale: 2 }),
  overtimeHours: decimal('overtime_hours', { precision: 5, scale: 2 }).default('0'),
  notes: text('notes'),
  approvedBy: int('approved_by'),
  approvedAt: datetime('approved_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Leave Requests - Staff time off requests
 */
export const leaveRequests = mysqlTable('leave_requests', {
  id: int('id').primaryKey().autoincrement(),
  staffId: int('staff_id').notNull(),
  leaveType: varchar('leave_type', { length: 50 }).notNull(), // 'sick', 'vacation', 'personal', 'emergency'
  startDate: datetime('start_date').notNull(),
  endDate: datetime('end_date').notNull(),
  totalDays: decimal('total_days', { precision: 5, scale: 2 }).notNull(),
  reason: text('reason'),
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'approved', 'rejected'
  reviewedBy: int('reviewed_by'),
  reviewedAt: datetime('reviewed_at'),
  reviewNotes: text('review_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Staff Performance - Performance reviews and metrics
 */
export const staffPerformance = mysqlTable('staff_performance', {
  id: int('id').primaryKey().autoincrement(),
  staffId: int('staff_id').notNull(),
  reviewPeriod: varchar('review_period', { length: 50 }).notNull(), // '2025-Q1', '2025-Jan'
  reviewDate: datetime('review_date').notNull(),
  reviewedBy: int('reviewed_by').notNull(),
  punctuality: int('punctuality'), // 1-5 rating
  quality: int('quality'), // 1-5 rating
  teamwork: int('teamwork'), // 1-5 rating
  customerService: int('customer_service'), // 1-5 rating
  overallRating: decimal('overall_rating', { precision: 3, scale: 2 }),
  strengths: text('strengths'),
  areasForImprovement: text('areas_for_improvement'),
  goals: text('goals'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==================== PRODUCTION & KITCHEN ====================

/**
 * Production Batches - Track food preparation batches
 */
export const productionBatches = mysqlTable('production_batches', {
  id: int('id').primaryKey().autoincrement(),
  menuItemId: int('menu_item_id').notNull(),
  locationId: int('location_id').notNull(),
  batchNumber: varchar('batch_number', { length: 50 }).notNull().unique(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  productionDate: datetime('production_date').notNull(),
  expiryDate: datetime('expiry_date'),
  preparedBy: int('prepared_by'),
  status: varchar('status', { length: 50 }).default('in_progress'), // 'in_progress', 'completed', 'wasted'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Recipe Ingredients - Ingredients used in recipes (for costing)
 */
export const recipeIngredients = mysqlTable('recipe_ingredients', {
  id: int('id').primaryKey().autoincrement(),
  menuItemId: int('menu_item_id').notNull(),
  inventoryItemId: int('inventory_item_id').notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  notes: text('notes'),
});

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type StockMovement = typeof stockMovements.$inferSelect;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type WasteLog = typeof wasteLogs.$inferSelect;
export type StaffMember = typeof staffMembers.$inferSelect;
export type StaffSchedule = typeof staffSchedules.$inferSelect;
export type TimeLog = typeof timeLogs.$inferSelect;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type ProductionBatch = typeof productionBatches.$inferSelect;
