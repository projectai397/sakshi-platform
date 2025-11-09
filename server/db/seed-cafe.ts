import { getDb } from '../db';
import {
  cafeLocations,
  sakshiMenuItems,
  recipes,
  cookingClasses,
  franchises,
} from '../../drizzle/schema-cafe';

export async function seedCafeData() {
  const db = getDb();

  console.log('🌱 Seeding Sakshi Cafe data...');

  // Seed Cafe Locations
  console.log('📍 Creating cafe locations...');
  const [location1] = await db.insert(cafeLocations).values([
    {
      name: 'Sakshi Cafe - Bangalore Central',
      address: '123 MG Road, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      latitude: '12.9716',
      longitude: '77.5946',
      phone: '+91-80-12345678',
      email: 'bangalore@sakshicafe.org',
      hoursOfOperation: {
        monday: '8:00-21:00',
        tuesday: '8:00-21:00',
        wednesday: '8:00-21:00',
        thursday: '8:00-21:00',
        friday: '8:00-21:00',
        saturday: '8:00-22:00',
        sunday: '8:00-22:00',
      },
      seatingCapacity: 50,
      isActive: true,
    },
    {
      name: 'Sakshi Cafe - Mumbai Andheri',
      address: '456 Linking Road, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400058',
      country: 'India',
      latitude: '19.1136',
      longitude: '72.8697',
      phone: '+91-22-87654321',
      email: 'mumbai@sakshicafe.org',
      hoursOfOperation: {
        monday: '7:00-22:00',
        tuesday: '7:00-22:00',
        wednesday: '7:00-22:00',
        thursday: '7:00-22:00',
        friday: '7:00-23:00',
        saturday: '7:00-23:00',
        sunday: '7:00-22:00',
      },
      seatingCapacity: 60,
      isActive: true,
    },
  ]).returning();

  console.log(`✅ Created ${2} cafe locations`);

  // Seed Menu Items
  console.log('🍽️ Creating menu items...');
  await db.insert(sakshiMenuItems).values([
    // Breakfast Items
    {
      name: 'Sattvic Thali',
      description: 'A complete Ayurvedic breakfast with sprouted moong dal, fresh fruits, nuts, and herbal tea. Balanced for all doshas.',
      category: 'breakfast',
      imageUrl: '/images/menu/sattvic-thali.jpg',
      preparationTime: 15,
      servingSize: '1 plate',
      calories: 450,
      proteinG: '18',
      carbsG: '65',
      fatG: '12',
      fiberG: '15',
      ayurvedicProperties: {
        doshaBalance: 'Balances all three doshas',
        taste: ['sweet', 'astringent', 'bitter'],
        energetics: 'Cooling and grounding',
      },
      allergens: ['nuts'],
      communityPrice: '150',
      fairPrice: '250',
      supporterPrice: '350',
      isAvailable: true,
    },
    {
      name: 'Green Smoothie Bowl',
      description: 'Energizing blend of spinach, banana, mango, chia seeds, topped with fresh berries and coconut flakes.',
      category: 'breakfast',
      imageUrl: '/images/menu/green-smoothie-bowl.jpg',
      preparationTime: 10,
      servingSize: '1 bowl',
      calories: 320,
      proteinG: '8',
      carbsG: '58',
      fatG: '8',
      fiberG: '12',
      ayurvedicProperties: {
        doshaBalance: 'Balances Pitta, may increase Vata',
        taste: ['sweet', 'astringent'],
        energetics: 'Cooling',
      },
      allergens: [],
      communityPrice: '120',
      fairPrice: '200',
      supporterPrice: '280',
      isAvailable: true,
    },
    {
      name: 'Sprouted Moong Salad',
      description: 'Fresh sprouted moong beans with cucumber, tomato, lemon, and Indian spices. High in protein and enzymes.',
      category: 'breakfast',
      imageUrl: '/images/menu/sprouted-moong-salad.jpg',
      preparationTime: 5,
      servingSize: '1 bowl',
      calories: 180,
      proteinG: '12',
      carbsG: '28',
      fatG: '2',
      fiberG: '10',
      ayurvedicProperties: {
        doshaBalance: 'Balances Kapha, good for Pitta',
        taste: ['sweet', 'astringent', 'sour'],
        energetics: 'Cooling and light',
      },
      allergens: [],
      communityPrice: '80',
      fairPrice: '130',
      supporterPrice: '180',
      isAvailable: true,
    },

    // Lunch Items
    {
      name: 'Ayurvedic Khichdi',
      description: 'Healing one-pot meal of rice, moong dal, vegetables, and warming spices. Perfect for digestion.',
      category: 'lunch',
      imageUrl: '/images/menu/ayurvedic-khichdi.jpg',
      preparationTime: 25,
      servingSize: '1 bowl',
      calories: 380,
      proteinG: '14',
      carbsG: '62',
      fatG: '8',
      fiberG: '11',
      ayurvedicProperties: {
        doshaBalance: 'Tri-doshic (balances all)',
        taste: ['sweet', 'salty', 'pungent'],
        energetics: 'Warming and nourishing',
      },
      allergens: [],
      communityPrice: '140',
      fairPrice: '230',
      supporterPrice: '320',
      isAvailable: true,
    },
    {
      name: 'Rainbow Buddha Bowl',
      description: 'Colorful mix of quinoa, roasted vegetables, chickpeas, tahini dressing, and microgreens.',
      category: 'lunch',
      imageUrl: '/images/menu/buddha-bowl.jpg',
      preparationTime: 20,
      servingSize: '1 bowl',
      calories: 520,
      proteinG: '22',
      carbsG: '68',
      fatG: '18',
      fiberG: '16',
      ayurvedicProperties: {
        doshaBalance: 'Good for Kapha, balances Vata',
        taste: ['sweet', 'salty', 'sour', 'pungent'],
        energetics: 'Grounding',
      },
      allergens: ['sesame'],
      communityPrice: '180',
      fairPrice: '300',
      supporterPrice: '420',
      isAvailable: true,
    },

    // Dinner Items
    {
      name: 'Millet Dosa with Sambar',
      description: 'Fermented millet crepe served with vegetable sambar and coconut chutney. Gluten-free and probiotic-rich.',
      category: 'dinner',
      imageUrl: '/images/menu/millet-dosa.jpg',
      preparationTime: 15,
      servingSize: '2 dosas',
      calories: 420,
      proteinG: '16',
      carbsG: '72',
      fatG: '8',
      fiberG: '12',
      ayurvedicProperties: {
        doshaBalance: 'Good for Kapha, balances Pitta',
        taste: ['sweet', 'sour', 'pungent'],
        energetics: 'Warming',
      },
      allergens: [],
      communityPrice: '160',
      fairPrice: '260',
      supporterPrice: '360',
      isAvailable: true,
    },

    // Beverages
    {
      name: 'Golden Milk Latte',
      description: 'Warming turmeric latte with almond milk, cinnamon, ginger, and black pepper. Anti-inflammatory.',
      category: 'beverage',
      imageUrl: '/images/menu/golden-milk.jpg',
      preparationTime: 8,
      servingSize: '1 cup',
      calories: 150,
      proteinG: '4',
      carbsG: '18',
      fatG: '6',
      fiberG: '2',
      ayurvedicProperties: {
        doshaBalance: 'Balances Kapha and Vata',
        taste: ['sweet', 'pungent', 'bitter'],
        energetics: 'Warming',
      },
      allergens: ['nuts'],
      communityPrice: '60',
      fairPrice: '100',
      supporterPrice: '140',
      isAvailable: true,
    },
    {
      name: 'Fresh Coconut Water',
      description: 'Pure, fresh coconut water straight from young coconuts. Naturally hydrating and electrolyte-rich.',
      category: 'beverage',
      imageUrl: '/images/menu/coconut-water.jpg',
      preparationTime: 3,
      servingSize: '1 glass',
      calories: 45,
      proteinG: '2',
      carbsG: '9',
      fatG: '0',
      fiberG: '3',
      ayurvedicProperties: {
        doshaBalance: 'Balances Pitta, good for Vata',
        taste: ['sweet'],
        energetics: 'Cooling',
      },
      allergens: [],
      communityPrice: '40',
      fairPrice: '70',
      supporterPrice: '100',
      isAvailable: true,
    },

    // Snacks
    {
      name: 'Energy Balls',
      description: 'Raw date and nut balls with cacao, coconut, and superfoods. Perfect post-workout snack.',
      category: 'snack',
      imageUrl: '/images/menu/energy-balls.jpg',
      preparationTime: 5,
      servingSize: '3 balls',
      calories: 280,
      proteinG: '8',
      carbsG: '32',
      fatG: '14',
      fiberG: '6',
      ayurvedicProperties: {
        doshaBalance: 'Good for Vata, may increase Kapha',
        taste: ['sweet'],
        energetics: 'Grounding and energizing',
      },
      allergens: ['nuts'],
      communityPrice: '80',
      fairPrice: '130',
      supporterPrice: '180',
      isAvailable: true,
    },

    // Desserts
    {
      name: 'Chia Pudding',
      description: 'Creamy chia seed pudding with almond milk, vanilla, and fresh mango. Rich in omega-3s.',
      category: 'dessert',
      imageUrl: '/images/menu/chia-pudding.jpg',
      preparationTime: 10,
      servingSize: '1 cup',
      calories: 220,
      proteinG: '6',
      carbsG: '28',
      fatG: '10',
      fiberG: '12',
      ayurvedicProperties: {
        doshaBalance: 'Balances Pitta, good for Vata',
        taste: ['sweet'],
        energetics: 'Cooling',
      },
      allergens: ['nuts'],
      communityPrice: '100',
      fairPrice: '160',
      supporterPrice: '220',
      isAvailable: true,
    },
  ]);

  console.log(`✅ Created ${10} menu items`);

  // Seed Recipes
  console.log('📖 Creating recipes...');
  await db.insert(recipes).values([
    {
      title: 'Basic Sprouted Moong Salad',
      description: 'A simple, nutritious salad perfect for beginners. Learn the art of sprouting and combining fresh ingredients.',
      authorId: 1, // Admin user
      category: 'breakfast',
      cuisine: 'Indian',
      difficulty: 'easy',
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      ingredients: [
        { name: 'Sprouted moong beans', quantity: '1', unit: 'cup' },
        { name: 'Cucumber', quantity: '1', unit: 'medium' },
        { name: 'Tomato', quantity: '1', unit: 'medium' },
        { name: 'Lemon juice', quantity: '2', unit: 'tbsp' },
        { name: 'Rock salt', quantity: '1/2', unit: 'tsp' },
        { name: 'Black pepper', quantity: '1/4', unit: 'tsp' },
        { name: 'Fresh coriander', quantity: '2', unit: 'tbsp' },
      ],
      instructions: [
        { step: 1, text: 'Rinse sprouted moong beans thoroughly' },
        { step: 2, text: 'Dice cucumber and tomato into small pieces' },
        { step: 3, text: 'Mix all vegetables in a bowl' },
        { step: 4, text: 'Add lemon juice, salt, and pepper' },
        { step: 5, text: 'Garnish with fresh coriander and serve immediately' },
      ],
      nutritionalInfo: {
        calories: 180,
        protein: 12,
        carbs: 28,
        fat: 2,
        fiber: 10,
      },
      ayurvedicInfo: {
        doshaBalance: 'Balances Kapha, good for Pitta',
        taste: ['sweet', 'astringent', 'sour'],
        season: 'Summer',
      },
      tags: ['raw', 'vegan', 'gluten-free', 'high-protein', 'quick'],
      imageUrl: '/images/recipes/sprouted-moong-salad.jpg',
      isApproved: true,
      ratingAvg: '4.8',
      ratingCount: 24,
    },
    {
      title: 'Healing Ayurvedic Khichdi',
      description: 'Traditional one-pot healing meal used in Ayurvedic cleansing. Easy to digest and deeply nourishing.',
      authorId: 1,
      category: 'lunch',
      cuisine: 'Indian',
      difficulty: 'easy',
      prepTime: 10,
      cookTime: 30,
      servings: 4,
      ingredients: [
        { name: 'Basmati rice', quantity: '1', unit: 'cup' },
        { name: 'Yellow moong dal', quantity: '1/2', unit: 'cup' },
        { name: 'Mixed vegetables', quantity: '2', unit: 'cups' },
        { name: 'Ghee or coconut oil', quantity: '2', unit: 'tbsp' },
        { name: 'Cumin seeds', quantity: '1', unit: 'tsp' },
        { name: 'Turmeric powder', quantity: '1/2', unit: 'tsp' },
        { name: 'Ginger', quantity: '1', unit: 'inch' },
        { name: 'Rock salt', quantity: '1', unit: 'tsp' },
        { name: 'Water', quantity: '5', unit: 'cups' },
      ],
      instructions: [
        { step: 1, text: 'Wash rice and dal together until water runs clear' },
        { step: 2, text: 'Heat ghee in pressure cooker, add cumin seeds' },
        { step: 3, text: 'Add grated ginger, turmeric, and vegetables' },
        { step: 4, text: 'Add rice, dal, salt, and water' },
        { step: 5, text: 'Pressure cook for 3 whistles or cook covered for 25-30 minutes' },
        { step: 6, text: 'Let pressure release naturally, serve warm' },
      ],
      nutritionalInfo: {
        calories: 380,
        protein: 14,
        carbs: 62,
        fat: 8,
        fiber: 11,
      },
      ayurvedicInfo: {
        doshaBalance: 'Tri-doshic (balances all three doshas)',
        taste: ['sweet', 'salty', 'pungent'],
        season: 'All seasons',
      },
      tags: ['ayurvedic', 'healing', 'one-pot', 'gluten-free', 'comfort-food'],
      imageUrl: '/images/recipes/ayurvedic-khichdi.jpg',
      isApproved: true,
      ratingAvg: '4.9',
      ratingCount: 42,
    },
    {
      title: 'Golden Milk (Haldi Doodh)',
      description: 'Ancient Ayurvedic remedy for immunity, inflammation, and restful sleep. A warming bedtime ritual.',
      authorId: 1,
      category: 'beverage',
      cuisine: 'Indian',
      difficulty: 'easy',
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      ingredients: [
        { name: 'Almond milk', quantity: '2', unit: 'cups' },
        { name: 'Turmeric powder', quantity: '1', unit: 'tsp' },
        { name: 'Cinnamon powder', quantity: '1/2', unit: 'tsp' },
        { name: 'Ginger powder', quantity: '1/4', unit: 'tsp' },
        { name: 'Black pepper', quantity: '1/8', unit: 'tsp' },
        { name: 'Coconut oil', quantity: '1', unit: 'tsp' },
        { name: 'Jaggery or dates', quantity: '1', unit: 'tbsp' },
      ],
      instructions: [
        { step: 1, text: 'Heat almond milk in a saucepan on medium heat' },
        { step: 2, text: 'Add turmeric, cinnamon, ginger, and black pepper' },
        { step: 3, text: 'Whisk well to combine all spices' },
        { step: 4, text: 'Add coconut oil and sweetener' },
        { step: 5, text: 'Simmer for 5 minutes, stirring occasionally' },
        { step: 6, text: 'Strain if desired and serve warm' },
      ],
      nutritionalInfo: {
        calories: 150,
        protein: 4,
        carbs: 18,
        fat: 6,
        fiber: 2,
      },
      ayurvedicInfo: {
        doshaBalance: 'Balances Kapha and Vata',
        taste: ['sweet', 'pungent', 'bitter'],
        season: 'Winter, Monsoon',
      },
      tags: ['ayurvedic', 'anti-inflammatory', 'immunity', 'bedtime', 'warming'],
      imageUrl: '/images/recipes/golden-milk.jpg',
      isApproved: true,
      ratingAvg: '4.7',
      ratingCount: 38,
    },
  ]);

  console.log(`✅ Created ${3} recipes`);

  // Seed Cooking Classes
  console.log('📅 Creating cooking classes...');
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const twoWeeks = new Date();
  twoWeeks.setDate(twoWeeks.getDate() + 14);

  await db.insert(cookingClasses).values([
    {
      title: 'Satvic Breakfast Basics',
      description: 'Learn to prepare energizing, plant-based breakfasts that balance your doshas and start your day right.',
      instructorId: 1,
      classType: 'in-person',
      cafeLocationId: location1.id,
      dateTime: nextWeek,
      duration: 120,
      maxParticipants: 12,
      currentParticipants: 0,
      communityPrice: '300',
      fairPrice: '500',
      supporterPrice: '700',
      ingredientsList: 'Moong beans, fruits, nuts, seeds, grains, spices',
      equipmentNeeded: 'Provided at cafe',
      skillLevel: 'Beginner',
      imageUrl: '/images/classes/breakfast-basics.jpg',
      isActive: true,
    },
    {
      title: 'Fermentation Workshop',
      description: 'Master the art of fermentation! Make your own dosa batter, idli, and probiotic-rich foods.',
      instructorId: 1,
      classType: 'in-person',
      cafeLocationId: location1.id,
      dateTime: twoWeeks,
      duration: 180,
      maxParticipants: 10,
      currentParticipants: 0,
      communityPrice: '400',
      fairPrice: '650',
      supporterPrice: '900',
      ingredientsList: 'Rice, lentils, fenugreek seeds, salt',
      equipmentNeeded: 'Provided at cafe',
      skillLevel: 'Intermediate',
      imageUrl: '/images/classes/fermentation.jpg',
      isActive: true,
    },
    {
      title: 'Virtual: Ayurvedic Cooking 101',
      description: 'Online class covering Ayurvedic principles, dosha balancing, and cooking techniques. Join from anywhere!',
      instructorId: 1,
      classType: 'virtual',
      cafeLocationId: null,
      dateTime: nextWeek,
      duration: 90,
      maxParticipants: 50,
      currentParticipants: 0,
      communityPrice: '200',
      fairPrice: '350',
      supporterPrice: '500',
      ingredientsList: 'Shopping list provided before class',
      equipmentNeeded: 'Basic kitchen tools',
      skillLevel: 'Beginner',
      imageUrl: '/images/classes/ayurvedic-101.jpg',
      videoUrl: 'https://zoom.us/j/example',
      isActive: true,
    },
  ]);

  console.log(`✅ Created ${3} cooking classes`);

  console.log('✨ Cafe data seeding completed successfully!');
}

// Run seed if called directly
if (require.main === module) {
  seedCafeData()
    .then(() => {
      console.log('✅ Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
