#!/usr/bin/env tsx

/**
 * Create Admin User Script
 * Run this after deployment to create an admin user
 */

import { db } from '../server/db';
import { users } from '../server/db/schema';
import * as readline from 'readline';
import * as crypto from 'crypto';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function createAdmin() {
  console.log('🔐 Create Admin User');
  console.log('==================\n');

  try {
    // Get admin details
    const email = await question('Admin email: ');
    const username = await question('Admin username: ');
    const password = await question('Admin password: ');
    const confirmPassword = await question('Confirm password: ');

    // Validate
    if (!email || !username || !password) {
      console.error('❌ All fields are required');
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.error('❌ Passwords do not match');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    // Check if user exists
    const database = await db();
    const existingUser = await database.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    });

    if (existingUser) {
      console.error('❌ User with this email already exists');
      process.exit(1);
    }

    // Create admin user
    const hashedPassword = hashPassword(password);
    
    const [newUser] = await database.insert(users).values({
      email,
      username,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      sevaTokens: 1000, // Give admin some tokens
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('\n✅ Admin user created successfully!');
    console.log('==================');
    console.log(`Email: ${newUser.email}`);
    console.log(`Username: ${newUser.username}`);
    console.log(`Role: ${newUser.role}`);
    console.log(`User ID: ${newUser.id}`);
    console.log('\n🎉 You can now login with these credentials');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run the script
createAdmin();
