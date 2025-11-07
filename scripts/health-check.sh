#!/bin/bash

# ========================================
# Sakshi Platform - Health Check Script
# ========================================
# Monitors the health of your deployed application

set -e

# Configuration
DEPLOYMENT_URL="${1:-$RAILWAY_STATIC_URL}"

if [ -z "$DEPLOYMENT_URL" ]; then
    echo "Usage: ./health-check.sh <deployment-url>"
    echo "Example: ./health-check.sh https://sakshi-platform-production.up.railway.app"
    exit 1
fi

# Add https:// if not present
if [[ ! "$DEPLOYMENT_URL" =~ ^https?:// ]]; then
    DEPLOYMENT_URL="https://$DEPLOYMENT_URL"
fi

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🏥 Sakshi Platform - Health Check"
echo "=================================="
echo "URL: $DEPLOYMENT_URL"
echo ""

# Function to check endpoint
check_endpoint() {
    local name="$1"
    local endpoint="$2"
    local expected_status="${3:-200}"
    
    echo -n "Checking $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint" 2>/dev/null || echo "000")
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (HTTP $status)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL (HTTP $status)${NC}"
        return 1
    fi
}

# Function to check response time
check_response_time() {
    local name="$1"
    local endpoint="$2"
    local max_time="${3:-2}"
    
    echo -n "Response time for $name... "
    
    time=$(curl -s -o /dev/null -w "%{time_total}" "$endpoint" 2>/dev/null || echo "999")
    
    # Convert to milliseconds
    time_ms=$(echo "$time * 1000" | bc)
    max_ms=$(echo "$max_time * 1000" | bc)
    
    if (( $(echo "$time < $max_time" | bc -l) )); then
        echo -e "${GREEN}✅ ${time_ms}ms (< ${max_ms}ms)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  ${time_ms}ms (> ${max_ms}ms)${NC}"
        return 1
    fi
}

# Run health checks
echo "1. Basic Connectivity"
echo "---------------------"
check_endpoint "Homepage" "$DEPLOYMENT_URL" 200
check_endpoint "API Health" "$DEPLOYMENT_URL/api/health" 200
echo ""

echo "2. Performance"
echo "---------------------"
check_response_time "Homepage" "$DEPLOYMENT_URL" 3
check_response_time "API" "$DEPLOYMENT_URL/api/health" 1
echo ""

echo "3. Database Connectivity"
echo "---------------------"
if check_endpoint "Database Health" "$DEPLOYMENT_URL/api/health/db" 200; then
    echo -e "${GREEN}✅ Database is connected${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
fi
echo ""

echo "4. Redis Cache"
echo "---------------------"
if check_endpoint "Redis Health" "$DEPLOYMENT_URL/api/health/redis" 200; then
    echo -e "${GREEN}✅ Redis is connected${NC}"
else
    echo -e "${YELLOW}⚠️  Redis connection check unavailable${NC}"
fi
echo ""

echo "5. SSL Certificate"
echo "---------------------"
echo -n "Checking SSL... "
if echo | openssl s_client -servername "${DEPLOYMENT_URL#https://}" -connect "${DEPLOYMENT_URL#https://}:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null > /dev/null; then
    echo -e "${GREEN}✅ SSL certificate is valid${NC}"
    
    # Show expiry date
    expiry=$(echo | openssl s_client -servername "${DEPLOYMENT_URL#https://}" -connect "${DEPLOYMENT_URL#https://}:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    echo "   Expires: $expiry"
else
    echo -e "${YELLOW}⚠️  SSL check unavailable${NC}"
fi
echo ""

# Summary
echo "=================================="
echo -e "${BLUE}Health Check Complete${NC}"
echo "=================================="
echo ""
echo "For continuous monitoring, consider:"
echo "- UptimeRobot: https://uptimerobot.com"
echo "- Pingdom: https://www.pingdom.com"
echo "- Railway Metrics: Check your Railway dashboard"
echo ""
