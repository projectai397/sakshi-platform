// Sakshi Platform - Database Seed Script
// This script populates the database with sample data for development and testing

import { db } from '../server/db';
import { 
  users, 
  products, 
  categories, 
  orders, 
  orderItems,
  sevaWallets,
  sevaTransactions,
  cafes,
  retreats,
  volunteers
} from '../server/db/schema';

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(sevaTransactions);
    await db.delete(sevaWallets);
    await db.delete(products);
    await db.delete(categories);
    await db.delete(volunteers);
    await db.delete(retreats);
    await db.delete(cafes);
    await db.delete(users);
    console.log('✓ Existing data cleared\n');

    // Seed Categories
    console.log('Seeding categories...');
    const categoryData = [
      { name: 'Clothing', description: 'Pre-loved clothing items', slug: 'clothing' },
      { name: 'Books', description: 'Second-hand books', slug: 'books' },
      { name: 'Electronics', description: 'Refurbished electronics', slug: 'electronics' },
      { name: 'Home & Garden', description: 'Home and garden items', slug: 'home-garden' },
      { name: 'Toys & Games', description: 'Children\'s toys and games', slug: 'toys-games' },
      { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', slug: 'sports-outdoors' },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✓ Seeded ${insertedCategories.length} categories\n`);

    // Seed Users
    console.log('Seeding users...');
    const userData = [
      {
        name: 'Admin User',
        email: 'admin@sakshi.org',
        role: 'admin',
        avatar: '/images/avatars/admin.jpg'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        role: 'user',
        avatar: '/images/avatars/user1.jpg'
      },
      {
        name: 'Raj Kumar',
        email: 'raj@example.com',
        role: 'user',
        avatar: '/images/avatars/user2.jpg'
      },
      {
        name: 'Anita Patel',
        email: 'anita@example.com',
        role: 'volunteer',
        avatar: '/images/avatars/user3.jpg'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        role: 'user',
        avatar: '/images/avatars/user4.jpg'
      }
    ];

    const insertedUsers = await db.insert(users).values(userData).returning();
    console.log(`✓ Seeded ${insertedUsers.length} users\n`);

    // Seed Seva Wallets for all users
    console.log('Seeding seva wallets...');
    const walletData = insertedUsers.map((user, index) => ({
      userId: user.id,
      balance: [100, 50, 75, 120, 30][index], // Different balances
      totalEarned: [200, 100, 150, 250, 50][index],
      totalSpent: [100, 50, 75, 130, 20][index]
    }));

    await db.insert(sevaWallets).values(walletData);
    console.log(`✓ Seeded ${walletData.length} seva wallets\n`);

    // Seed Products
    console.log('Seeding products...');
    const productData = [
      // Clothing
      {
        name: 'Vintage Denim Jacket',
        description: 'Classic denim jacket in excellent condition. Perfect for layering.',
        price: 799,
        sevaPrice: 80,
        categoryId: insertedCategories[0].id,
        condition: 'good',
        imageUrl: '/images/products/denim-jacket.jpg',
        stock: 1,
        isAvailable: true
      },
      {
        name: 'Cotton Kurta Set',
        description: 'Traditional cotton kurta with palazzo pants. Gently used.',
        price: 599,
        sevaPrice: 60,
        categoryId: insertedCategories[0].id,
        condition: 'excellent',
        imageUrl: '/images/products/kurta-set.jpg',
        stock: 1,
        isAvailable: true
      },
      {
        name: 'Wool Sweater',
        description: 'Cozy wool sweater, hand-knitted. Minor pilling.',
        price: 499,
        sevaPrice: 50,
        categoryId: insertedCategories[0].id,
        condition: 'fair',
        imageUrl: '/images/products/wool-sweater.jpg',
        stock: 1,
        isAvailable: true
      },
      
      // Books
      {
        name: 'The Alchemist by Paulo Coelho',
        description: 'Inspiring novel about following your dreams. Good condition.',
        price: 199,
        sevaPrice: 20,
        categoryId: insertedCategories[1].id,
        condition: 'good',
        imageUrl: '/images/products/alchemist.jpg',
        stock: 2,
        isAvailable: true
      },
      {
        name: 'Yoga Sutras of Patanjali',
        description: 'Ancient wisdom on yoga and meditation. Excellent condition.',
        price: 299,
        sevaPrice: 30,
        categoryId: insertedCategories[1].id,
        condition: 'excellent',
        imageUrl: '/images/products/yoga-sutras.jpg',
        stock: 1,
        isAvailable: true
      },
      
      // Electronics
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with good sound quality. Tested and working.',
        price: 1299,
        sevaPrice: 130,
        categoryId: insertedCategories[2].id,
        condition: 'good',
        imageUrl: '/images/products/bluetooth-speaker.jpg',
        stock: 1,
        isAvailable: true
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse. Batteries included.',
        price: 399,
        sevaPrice: 40,
        categoryId: insertedCategories[2].id,
        condition: 'excellent',
        imageUrl: '/images/products/wireless-mouse.jpg',
        stock: 3,
        isAvailable: true
      },
      
      // Home & Garden
      {
        name: 'Ceramic Planter Set',
        description: 'Set of 3 handmade ceramic planters. Minor chips.',
        price: 699,
        sevaPrice: 70,
        categoryId: insertedCategories[3].id,
        condition: 'good',
        imageUrl: '/images/products/ceramic-planters.jpg',
        stock: 1,
        isAvailable: true
      },
      {
        name: 'Meditation Cushion',
        description: 'Comfortable meditation cushion filled with buckwheat hulls.',
        price: 899,
        sevaPrice: 90,
        categoryId: insertedCategories[3].id,
        condition: 'excellent',
        imageUrl: '/images/products/meditation-cushion.jpg',
        stock: 2,
        isAvailable: true
      },
      
      // Toys & Games
      {
        name: 'Wooden Puzzle Set',
        description: 'Educational wooden puzzles for children. All pieces included.',
        price: 449,
        sevaPrice: 45,
        categoryId: insertedCategories[4].id,
        condition: 'good',
        imageUrl: '/images/products/wooden-puzzle.jpg',
        stock: 1,
        isAvailable: true
      },
      
      // Sports & Outdoors
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with carrying strap. Lightly used.',
        price: 599,
        sevaPrice: 60,
        categoryId: insertedCategories[5].id,
        condition: 'excellent',
        imageUrl: '/images/products/yoga-mat.jpg',
        stock: 4,
        isAvailable: true
      },
      {
        name: 'Hiking Backpack',
        description: '30L hiking backpack with multiple compartments. Great condition.',
        price: 1499,
        sevaPrice: 150,
        categoryId: insertedCategories[5].id,
        condition: 'excellent',
        imageUrl: '/images/products/hiking-backpack.jpg',
        stock: 1,
        isAvailable: true
      }
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`✓ Seeded ${insertedProducts.length} products\n`);

    // Seed Cafes
    console.log('Seeding cafes...');
    const cafeData = [
      {
        name: 'Isha Café - Coimbatore',
        location: 'Isha Yoga Center, Coimbatore, Tamil Nadu',
        description: 'Main café at the Isha Yoga Center serving organic food and beverages.',
        latitude: 11.0004,
        longitude: 76.9214,
        imageUrl: '/images/cafes/isha-coimbatore.jpg',
        isActive: true
      },
      {
        name: 'Isha Café - Bengaluru',
        location: 'Isha Yoga Center, Bengaluru, Karnataka',
        description: 'Peaceful café space for volunteers and visitors.',
        latitude: 12.9716,
        longitude: 77.5946,
        imageUrl: '/images/cafes/isha-bengaluru.jpg',
        isActive: true
      },
      {
        name: 'Isha Café - Delhi',
        location: 'Isha Yoga Center, New Delhi',
        description: 'Serene café offering healthy meals and snacks.',
        latitude: 28.7041,
        longitude: 77.1025,
        imageUrl: '/images/cafes/isha-delhi.jpg',
        isActive: true
      }
    ];

    const insertedCafes = await db.insert(cafes).values(cafeData).returning();
    console.log(`✓ Seeded ${insertedCafes.length} cafes\n`);

    // Seed Retreats
    console.log('Seeding retreats...');
    const retreatData = [
      {
        name: 'Inner Engineering Retreat',
        description: '7-day intensive program for self-transformation and inner growth.',
        location: 'Isha Yoga Center, Coimbatore',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-07'),
        price: 15000,
        sevaPrice: 1500,
        capacity: 50,
        enrolled: 23,
        imageUrl: '/images/retreats/inner-engineering.jpg',
        isActive: true
      },
      {
        name: 'Silent Retreat',
        description: '3-day silent meditation retreat in the mountains.',
        location: 'Isha Yoga Center, Himalayas',
        startDate: new Date('2025-11-15'),
        endDate: new Date('2025-11-17'),
        price: 8000,
        sevaPrice: 800,
        capacity: 30,
        enrolled: 18,
        imageUrl: '/images/retreats/silent-retreat.jpg',
        isActive: true
      },
      {
        name: 'Yoga & Meditation Weekend',
        description: '2-day weekend program for beginners and experienced practitioners.',
        location: 'Isha Yoga Center, Bengaluru',
        startDate: new Date('2025-11-20'),
        endDate: new Date('2025-11-21'),
        price: 5000,
        sevaPrice: 500,
        capacity: 40,
        enrolled: 35,
        imageUrl: '/images/retreats/yoga-weekend.jpg',
        isActive: true
      }
    ];

    const insertedRetreats = await db.insert(retreats).values(retreatData).returning();
    console.log(`✓ Seeded ${insertedRetreats.length} retreats\n`);

    // Seed Sample Orders
    console.log('Seeding orders...');
    const orderData = [
      {
        userId: insertedUsers[1].id,
        orderNumber: 'ORD-2024-001',
        total: 1598,
        paymentMethod: 'money',
        status: 'completed',
        createdAt: new Date('2024-10-15')
      },
      {
        userId: insertedUsers[2].id,
        orderNumber: 'ORD-2024-002',
        total: 0,
        sevaTokensUsed: 110,
        paymentMethod: 'seva',
        status: 'completed',
        createdAt: new Date('2024-10-20')
      },
      {
        userId: insertedUsers[4].id,
        orderNumber: 'ORD-2024-003',
        total: 899,
        paymentMethod: 'money',
        status: 'pending',
        createdAt: new Date('2024-11-01')
      }
    ];

    const insertedOrders = await db.insert(orders).values(orderData).returning();
    console.log(`✓ Seeded ${insertedOrders.length} orders\n`);

    // Seed Order Items
    console.log('Seeding order items...');
    const orderItemsData = [
      // Order 1 items
      {
        orderId: insertedOrders[0].id,
        productId: insertedProducts[0].id,
        quantity: 1,
        price: 799
      },
      {
        orderId: insertedOrders[0].id,
        productId: insertedProducts[1].id,
        quantity: 1,
        price: 599
      },
      {
        orderId: insertedOrders[0].id,
        productId: insertedProducts[3].id,
        quantity: 1,
        price: 199
      },
      // Order 2 items
      {
        orderId: insertedOrders[1].id,
        productId: insertedProducts[5].id,
        quantity: 1,
        price: 0,
        sevaPrice: 130
      },
      // Order 3 items
      {
        orderId: insertedOrders[2].id,
        productId: insertedProducts[8].id,
        quantity: 1,
        price: 899
      }
    ];

    await db.insert(orderItems).values(orderItemsData);
    console.log(`✓ Seeded ${orderItemsData.length} order items\n`);

    // Seed Seva Transactions
    console.log('Seeding seva transactions...');
    const transactionData = [
      {
        userId: insertedUsers[1].id,
        amount: 50,
        type: 'earned',
        source: 'donation',
        description: 'Donated clothing items',
        createdAt: new Date('2024-10-01')
      },
      {
        userId: insertedUsers[1].id,
        amount: 50,
        type: 'earned',
        source: 'volunteering',
        description: 'Volunteered at repair café',
        createdAt: new Date('2024-10-10')
      },
      {
        userId: insertedUsers[2].id,
        amount: 100,
        type: 'earned',
        source: 'referral',
        description: 'Referred a friend',
        createdAt: new Date('2024-10-15')
      },
      {
        userId: insertedUsers[2].id,
        amount: 110,
        type: 'spent',
        source: 'purchase',
        description: 'Purchased Bluetooth Speaker',
        relatedOrderId: insertedOrders[1].id,
        createdAt: new Date('2024-10-20')
      },
      {
        userId: insertedUsers[3].id,
        amount: 120,
        type: 'earned',
        source: 'volunteering',
        description: 'Monthly volunteering',
        createdAt: new Date('2024-10-25')
      }
    ];

    await db.insert(sevaTransactions).values(transactionData);
    console.log(`✓ Seeded ${transactionData.length} seva transactions\n`);

    // Seed Volunteers
    console.log('Seeding volunteers...');
    const volunteerData = [
      {
        userId: insertedUsers[3].id,
        skills: 'Teaching, Event Management',
        availability: 'Weekends',
        hoursContributed: 48,
        status: 'active'
      },
      {
        userId: insertedUsers[4].id,
        skills: 'Gardening, Cooking',
        availability: 'Flexible',
        hoursContributed: 12,
        status: 'active'
      }
    ];

    await db.insert(volunteers).values(volunteerData);
    console.log(`✓ Seeded ${volunteerData.length} volunteers\n`);

    console.log('✅ Database seeding completed successfully!\n');
    console.log('Summary:');
    console.log(`  - ${insertedCategories.length} categories`);
    console.log(`  - ${insertedUsers.length} users`);
    console.log(`  - ${walletData.length} seva wallets`);
    console.log(`  - ${insertedProducts.length} products`);
    console.log(`  - ${insertedCafes.length} cafes`);
    console.log(`  - ${insertedRetreats.length} retreats`);
    console.log(`  - ${insertedOrders.length} orders`);
    console.log(`  - ${orderItemsData.length} order items`);
    console.log(`  - ${transactionData.length} seva transactions`);
    console.log(`  - ${volunteerData.length} volunteers`);
    console.log('\n🎉 Ready to start development!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
