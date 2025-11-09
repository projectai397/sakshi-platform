#!/bin/bash

echo "🌿 Sakshi Cafe Deployment Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
pnpm install --frozen-lockfile
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

echo "🗄️  Step 2: Running database migration..."
pnpm drizzle-kit push
if [ $? -ne 0 ]; then
    echo "⚠️  Database migration failed or was skipped"
    echo "   You may need to run this manually with proper database credentials"
fi
echo ""

echo "🌱 Step 3: Seeding cafe data..."
npx ts-node server/db/seed-cafe.ts
if [ $? -ne 0 ]; then
    echo "⚠️  Seeding failed or was skipped"
    echo "   You may need to run this manually after database is set up"
fi
echo ""

echo "🔨 Step 4: Building application..."
pnpm build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the application: pnpm start"
echo "2. Visit http://localhost:5000/cafe/menu"
echo "3. Test all cafe features"
echo "4. Check admin dashboard at /admin/cafe"
echo ""
echo "🙏 Namaste!"
