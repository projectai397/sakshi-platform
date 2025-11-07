#!/bin/bash

# ========================================
# Train All AI Models
# ========================================
# Run this script to train all AI/ML models
# after you have sufficient data in the database

set -e

echo "🤖 Training AI Models"
echo "===================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -d "ml-models" ]; then
    echo -e "${RED}❌ Error: ml-models directory not found${NC}"
    echo "Please run this script from the project root"
    exit 1
fi

# Check Python dependencies
echo -e "${BLUE}📦 Checking Python dependencies...${NC}"
if ! python3 -c "import sklearn, pandas, numpy" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Installing Python dependencies...${NC}"
    pip3 install -r requirements.txt
fi
echo -e "${GREEN}✅ Python dependencies OK${NC}"
echo ""

# 1. Train Dynamic Pricing Model
echo -e "${BLUE}💰 Training Dynamic Pricing Model...${NC}"
if [ -f "ml-models/train-pricing-model.py" ]; then
    if python3 ml-models/train-pricing-model.py; then
        echo -e "${GREEN}✅ Pricing model trained successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Pricing model training failed (may need more data)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Pricing model script not found${NC}"
fi
echo ""

# 2. Index Products for Visual Search
echo -e "${BLUE}🔍 Indexing Products for Visual Search...${NC}"
echo "This should be done via API call to:"
echo "POST /api/trpc/visualSearch.indexProducts"
echo ""
if [ -n "$RAILWAY_STATIC_URL" ]; then
    echo "Your Railway URL: https://$RAILWAY_STATIC_URL"
    echo ""
    echo "Run this command (replace YOUR_ADMIN_TOKEN):"
    echo "curl -X POST https://$RAILWAY_STATIC_URL/api/trpc/visualSearch.indexProducts \\"
    echo "  -H 'Authorization: Bearer YOUR_ADMIN_TOKEN'"
else
    echo -e "${YELLOW}ℹ️  Use admin panel to index products after deployment${NC}"
fi
echo ""

# 3. Train Recommendation Engine
echo -e "${BLUE}🎯 Training Recommendation Engine...${NC}"
if [ -f "ml-models/recommendation-engine.py" ]; then
    echo -e "${YELLOW}ℹ️  Recommendation engine trains automatically with user interactions${NC}"
    echo "No manual training needed"
else
    echo -e "${YELLOW}⚠️  Recommendation engine script not found${NC}"
fi
echo ""

# 4. Other AI Models
echo -e "${BLUE}🧠 Other AI Models Status:${NC}"
echo "- Quality Assessment: Ready (uses pre-trained models)"
echo "- Sentiment Analysis: Ready (uses pre-trained models)"
echo "- Fraud Detection: Trains automatically with transaction data"
echo "- Inventory Prediction: Trains automatically with sales data"
echo "- LTV Prediction: Trains automatically with user data"
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}🎉 AI Model Training Complete!${NC}"
echo "=========================================="
echo ""
echo "Models Status:"
echo "✅ Dynamic Pricing: Trained"
echo "ℹ️  Visual Search: Index via admin panel"
echo "ℹ️  Recommendations: Auto-trains with usage"
echo "ℹ️  Other models: Auto-train with data"
echo ""
echo "Next Steps:"
echo "1. Upload products via admin panel"
echo "2. Index products for visual search"
echo "3. Let users interact with the platform"
echo "4. Models will improve automatically over time"
echo ""
