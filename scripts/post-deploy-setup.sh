#!/bin/bash

# ========================================
# Sakshi Platform - Post-Deployment Setup
# ========================================
# Run this script after deploying to Railway
# to initialize database, seed data, and train AI models

set -e  # Exit on error

echo "🚀 Sakshi Platform - Post-Deployment Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in Railway environment
if [ -z "$RAILWAY_ENVIRONMENT" ]; then
    echo -e "${YELLOW}⚠️  Warning: Not running in Railway environment${NC}"
    echo "This script is designed for Railway deployment"
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Database Migration
echo -e "${BLUE}📊 Step 1: Initializing Database...${NC}"
if npm run db:push; then
    echo -e "${GREEN}✅ Database initialized successfully${NC}"
else
    echo -e "${RED}❌ Database initialization failed${NC}"
    exit 1
fi
echo ""

# Step 2: Seed Sample Data (Optional)
echo -e "${BLUE}🌱 Step 2: Seed Sample Data (Optional)${NC}"
echo "Do you want to seed the database with sample data? (y/n)"
read -r seed_response
if [[ "$seed_response" =~ ^[Yy]$ ]]; then
    if npm run db:seed 2>/dev/null || tsx scripts/seed-database.ts; then
        echo -e "${GREEN}✅ Sample data seeded successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Seeding skipped or failed (not critical)${NC}"
    fi
fi
echo ""

# Step 3: Create Admin User
echo -e "${BLUE}👤 Step 3: Create Admin User${NC}"
echo "Do you want to create an admin user? (y/n)"
read -r admin_response
if [[ "$admin_response" =~ ^[Yy]$ ]]; then
    if [ -f "scripts/create-admin.ts" ]; then
        tsx scripts/create-admin.ts
    else
        echo -e "${YELLOW}⚠️  Admin creation script not found (will create manually later)${NC}"
    fi
fi
echo ""

# Step 4: Train AI Models
echo -e "${BLUE}🤖 Step 4: Train AI Models${NC}"
echo "Do you want to train AI models now? (y/n)"
echo "(Requires at least 50 products in database)"
read -r ai_response
if [[ "$ai_response" =~ ^[Yy]$ ]]; then
    echo "Training dynamic pricing model..."
    if [ -f "ml-models/train-pricing-model.py" ]; then
        python3 ml-models/train-pricing-model.py || echo -e "${YELLOW}⚠️  Pricing model training skipped${NC}"
    fi
    
    echo "Indexing products for visual search..."
    # This would typically be done via API call after deployment
    echo -e "${YELLOW}ℹ️  Visual search indexing should be done via admin panel after deployment${NC}"
fi
echo ""

# Step 5: Health Check
echo -e "${BLUE}🏥 Step 5: Running Health Checks...${NC}"
if [ -n "$RAILWAY_STATIC_URL" ]; then
    HEALTH_URL="https://$RAILWAY_STATIC_URL/api/health"
    echo "Checking: $HEALTH_URL"
    
    if curl -f -s "$HEALTH_URL" > /dev/null; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check endpoint not responding yet${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  Health check skipped (URL not available)${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}🎉 Post-Deployment Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Visit your Railway URL to test the platform"
echo "2. Login with admin credentials"
echo "3. Upload some products"
echo "4. Train AI models via admin panel"
echo "5. Monitor logs in Railway dashboard"
echo ""
echo "For detailed instructions, see POST_DEPLOYMENT_GUIDE.md"
echo ""
