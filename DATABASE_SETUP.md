# Sakshi Platform - Database Setup Guide

## Overview

This guide explains how to set up and manage the database for the Sakshi platform.

---

## Database Schema

### Core Tables

#### Users
```sql
- id: Primary key
- name: User's full name
- email: Unique email address
- role: 'user' | 'admin' | 'volunteer'
- avatar: Profile picture URL
- createdAt: Account creation timestamp
```

#### Products
```sql
- id: Primary key
- name: Product name
- description: Product description
- price: Price in rupees
- sevaPrice: Price in seva tokens
- categoryId: Foreign key to categories
- condition: 'excellent' | 'good' | 'fair'
- imageUrl: Product image URL
- stock: Available quantity
- isAvailable: Boolean availability flag
```

#### Categories
```sql
- id: Primary key
- name: Category name
- description: Category description
- slug: URL-friendly slug
```

#### Orders
```sql
- id: Primary key
- userId: Foreign key to users
- orderNumber: Unique order identifier
- total: Total amount in rupees
- sevaTokensUsed: Seva tokens spent
- paymentMethod: 'money' | 'seva' | 'free'
- status: 'pending' | 'completed' | 'cancelled'
- createdAt: Order timestamp
```

#### Seva Wallets
```sql
- id: Primary key
- userId: Foreign key to users (unique)
- balance: Current token balance
- totalEarned: Lifetime tokens earned
- totalSpent: Lifetime tokens spent
```

#### Seva Transactions
```sql
- id: Primary key
- userId: Foreign key to users
- amount: Token amount
- type: 'earned' | 'spent'
- source: 'donation' | 'volunteering' | 'purchase' | etc.
- description: Transaction description
- relatedOrderId: Optional order reference
- createdAt: Transaction timestamp
```

---

## Setup Instructions

### 1. Development Setup (SQLite)

**Automatic Setup** (Recommended):

```bash
# Already configured in .env
DATABASE_URL="file:./dev.db"

# Push schema to database
pnpm db:push

# Seed with sample data
pnpm db:seed
```

**Manual Setup**:

```bash
# Create database file
touch dev.db

# Run migrations
pnpm db:push

# Verify tables created
sqlite3 dev.db ".tables"
```

### 2. Production Setup (MySQL/TiDB)

**Step 1: Create Database**

```sql
CREATE DATABASE sakshi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sakshi'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON sakshi_db.* TO 'sakshi'@'%';
FLUSH PRIVILEGES;
```

**Step 2: Configure Connection**

```bash
# Update .env
DATABASE_URL="mysql://sakshi:secure_password@localhost:3306/sakshi_db"
```

**Step 3: Run Migrations**

```bash
pnpm db:push
```

**Step 4: Seed Data (Optional)**

```bash
# For production, seed only essential data
pnpm db:seed:prod
```

---

## Database Commands

### Drizzle ORM Commands

```bash
# Push schema changes to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (GUI)
pnpm db:studio

# Seed database with sample data
pnpm db:seed

# Reset database (drop all tables)
pnpm db:reset
```

### Direct Database Access

**SQLite**:
```bash
sqlite3 dev.db
.tables
.schema users
SELECT * FROM products LIMIT 5;
.quit
```

**MySQL**:
```bash
mysql -u sakshi -p sakshi_db
SHOW TABLES;
DESCRIBE users;
SELECT * FROM products LIMIT 5;
EXIT;
```

---

## Seeding Data

### Sample Data Included

The seed script (`scripts/seed-database.ts`) creates:

- **6 Categories**: Clothing, Books, Electronics, Home & Garden, Toys & Games, Sports & Outdoors
- **5 Users**: 1 admin, 3 regular users, 1 volunteer
- **5 Seva Wallets**: One for each user with varying balances
- **12 Products**: Diverse items across all categories
- **3 Cafes**: Isha cafes in different locations
- **3 Retreats**: Upcoming spiritual retreats
- **3 Orders**: Sample completed and pending orders
- **5 Order Items**: Products in orders
- **5 Seva Transactions**: Earned and spent tokens
- **2 Volunteers**: Active volunteer profiles

### Running the Seed Script

```bash
# Full seed (development)
pnpm db:seed

# Or run directly
pnpm tsx scripts/seed-database.ts
```

### Custom Seeding

Create your own seed script:

```typescript
// scripts/custom-seed.ts
import { db } from '../server/db';
import { products } from '../server/db/schema';

async function customSeed() {
  await db.insert(products).values({
    name: 'My Custom Product',
    description: 'Custom description',
    price: 999,
    sevaPrice: 100,
    // ... other fields
  });
}

customSeed();
```

---

## Database Migrations

### Creating Migrations

```bash
# 1. Modify schema in server/db/schema.ts
# 2. Generate migration
pnpm db:generate

# 3. Review generated migration in drizzle/ folder
# 4. Apply migration
pnpm db:migrate
```

### Example Schema Change

```typescript
// server/db/schema.ts

// Add new column to products table
export const products = mysqlTable('products', {
  // ... existing columns
  featured: boolean('featured').default(false), // NEW
});
```

```bash
# Generate and apply migration
pnpm db:generate
pnpm db:migrate
```

---

## Backup & Restore

### SQLite Backup

```bash
# Backup
cp dev.db dev.db.backup

# Or use SQLite backup command
sqlite3 dev.db ".backup dev.db.backup"

# Restore
cp dev.db.backup dev.db
```

### MySQL Backup

```bash
# Backup
mysqldump -u sakshi -p sakshi_db > backup.sql

# Backup with compression
mysqldump -u sakshi -p sakshi_db | gzip > backup.sql.gz

# Restore
mysql -u sakshi -p sakshi_db < backup.sql

# Restore from compressed
gunzip < backup.sql.gz | mysql -u sakshi -p sakshi_db
```

### Automated Backups

```bash
# Create backup script
cat > scripts/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u sakshi -p$DB_PASSWORD sakshi_db > backups/sakshi_db_$DATE.sql
# Keep only last 7 days
find backups/ -name "*.sql" -mtime +7 -delete
EOF

chmod +x scripts/backup-db.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/scripts/backup-db.sh
```

---

## Database Optimization

### Indexes

```typescript
// Add indexes for frequently queried fields
export const products = mysqlTable('products', {
  // ... columns
}, (table) => ({
  categoryIdx: index('category_idx').on(table.categoryId),
  availabilityIdx: index('availability_idx').on(table.isAvailable),
  priceIdx: index('price_idx').on(table.price),
}));
```

### Query Optimization

```typescript
// Bad: N+1 queries
const orders = await db.query.orders.findMany();
for (const order of orders) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, order.userId)
  });
}

// Good: Use joins
const orders = await db.query.orders.findMany({
  with: {
    user: true,
    items: {
      with: {
        product: true
      }
    }
  }
});
```

### Connection Pooling

```typescript
// server/db/index.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Max connections
  queueLimit: 0
});

export const db = drizzle(poolConnection);
```

---

## Troubleshooting

### Common Issues

#### Connection Refused

**Error**: `ECONNREFUSED`

**Solutions**:
1. Check database is running
2. Verify connection string in `.env`
3. Check firewall rules
4. Test connection manually

#### Table Not Found

**Error**: `Table 'sakshi_db.products' doesn't exist`

**Solutions**:
```bash
# Push schema to database
pnpm db:push

# Or run migrations
pnpm db:migrate
```

#### Permission Denied

**Error**: `Access denied for user 'sakshi'@'localhost'`

**Solutions**:
```sql
GRANT ALL PRIVILEGES ON sakshi_db.* TO 'sakshi'@'%';
FLUSH PRIVILEGES;
```

#### Duplicate Entry

**Error**: `Duplicate entry 'email@example.com' for key 'users.email'`

**Solutions**:
- Ensure unique constraints are respected
- Check for existing data before insert
- Use `ON DUPLICATE KEY UPDATE` for upserts

---

## Database Monitoring

### Query Logging

```typescript
// Enable query logging in development
import { drizzle } from 'drizzle-orm/mysql2';

export const db = drizzle(connection, {
  logger: process.env.NODE_ENV === 'development'
});
```

### Performance Monitoring

```sql
-- MySQL: Show slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow query log
SELECT * FROM mysql.slow_log;
```

### Database Size

```sql
-- MySQL: Check database size
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'sakshi_db'
GROUP BY table_schema;
```

---

## Security Best Practices

### 1. Use Environment Variables

```bash
# Never hardcode credentials
DATABASE_URL="mysql://user:pass@host:3306/db"
```

### 2. Principle of Least Privilege

```sql
-- Create read-only user for analytics
CREATE USER 'sakshi_readonly'@'%' IDENTIFIED BY 'password';
GRANT SELECT ON sakshi_db.* TO 'sakshi_readonly'@'%';
```

### 3. Encrypt Sensitive Data

```typescript
// Encrypt sensitive fields before storing
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
```

### 4. Regular Backups

- Automated daily backups
- Off-site backup storage
- Test restoration regularly

### 5. SQL Injection Prevention

```typescript
// Drizzle ORM automatically prevents SQL injection
// But be careful with raw queries

// Bad:
db.execute(`SELECT * FROM users WHERE email = '${email}'`);

// Good:
db.select().from(users).where(eq(users.email, email));
```

---

## Production Checklist

- [ ] Database created with proper character set
- [ ] User with appropriate permissions created
- [ ] Connection string configured in `.env`
- [ ] Schema pushed/migrated to database
- [ ] Indexes created for performance
- [ ] Backups automated
- [ ] Monitoring set up
- [ ] Connection pooling configured
- [ ] SSL/TLS enabled for connections
- [ ] Firewall rules configured

---

## Next Steps

After database setup:

1. **Verify Data**: Check all tables have data
2. **Test Queries**: Run sample queries
3. **Start Server**: `pnpm dev`
4. **Test Features**: Try creating orders, earning tokens
5. **Monitor Performance**: Check query times

---

*For environment setup, see `ENVIRONMENT_SETUP.md`*  
*For deployment, see `DEPLOYMENT_PLATFORMS.md`*  
*For development, see `QUICK_START.md`*
