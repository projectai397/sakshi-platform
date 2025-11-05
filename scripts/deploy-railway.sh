#!/bin/bash

# Sakshi Platform - Railway Deployment Automation Script
# This script automates the Railway deployment process

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        Sakshi Platform - Railway Deployment Script           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Railway CLI is installed
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Checking Prerequisites"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v railway &> /dev/null; then
    print_error "Railway CLI not found"
    print_info "Installing Railway CLI..."
    
    # Install Railway CLI
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install railway
    else
        # Linux
        npm install -g @railway/cli
    fi
    
    if command -v railway &> /dev/null; then
        print_success "Railway CLI installed successfully"
    else
        print_error "Failed to install Railway CLI"
        exit 1
    fi
else
    print_success "Railway CLI is installed"
fi

# Check if logged in to Railway
echo ""
print_info "Checking Railway authentication..."

if railway whoami &> /dev/null; then
    print_success "Already logged in to Railway"
else
    print_warning "Not logged in to Railway"
    print_info "Please log in to Railway..."
    railway login
    
    if railway whoami &> /dev/null; then
        print_success "Successfully logged in to Railway"
    else
        print_error "Failed to log in to Railway"
        exit 1
    fi
fi

# Check if Git repository is initialized
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Preparing Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d ".git" ]; then
    print_warning "Git repository not initialized"
    print_info "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Sakshi Platform"
    print_success "Git repository initialized"
else
    print_success "Git repository already initialized"
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_warning "You have uncommitted changes"
    print_info "Committing changes..."
    git add .
    git commit -m "Pre-deployment commit"
    print_success "Changes committed"
fi

# Initialize Railway project
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Setting Up Railway Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "railway.json" ] || [ -f ".railway" ]; then
    print_success "Railway project already linked"
else
    print_info "Creating new Railway project..."
    railway init
    print_success "Railway project created"
fi

# Add MySQL database
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Adding MySQL Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Adding MySQL plugin..."
railway add --plugin mysql

if [ $? -eq 0 ]; then
    print_success "MySQL database added"
else
    print_warning "MySQL might already be added or failed to add"
fi

# Set environment variables
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Setting Environment Variables"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if .env file exists
if [ -f ".env" ]; then
    print_info "Found .env file, setting variables..."
    
    # Read .env and set variables (excluding comments and empty lines)
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ $key =~ ^#.*$ ]] && continue
        [[ -z $key ]] && continue
        
        # Remove quotes from value
        value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
        
        # Set variable in Railway
        railway variables --set "$key=$value" 2>/dev/null || true
    done < .env
    
    print_success "Environment variables set"
else
    print_warning ".env file not found"
    print_info "You'll need to set environment variables manually"
fi

# Deploy to Railway
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Deploying to Railway"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Starting deployment..."
railway up

if [ $? -eq 0 ]; then
    print_success "Deployment successful!"
else
    print_error "Deployment failed"
    exit 1
fi

# Run database migrations
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7: Running Database Migrations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Pushing database schema..."
railway run pnpm db:push

if [ $? -eq 0 ]; then
    print_success "Database schema pushed"
else
    print_warning "Database migration might have failed"
fi

# Seed database (optional)
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Seeding database..."
    railway run pnpm db:seed
    
    if [ $? -eq 0 ]; then
        print_success "Database seeded"
    else
        print_warning "Database seeding might have failed"
    fi
fi

# Get deployment URL
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 8: Getting Deployment Information"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DEPLOYMENT_URL=$(railway domain 2>/dev/null || echo "Not available yet")

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  DEPLOYMENT SUCCESSFUL! 🎉                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_success "Sakshi Platform deployed to Railway!"
echo ""
print_info "Deployment URL: $DEPLOYMENT_URL"
echo ""
print_info "Next steps:"
echo "  1. Visit your Railway dashboard: https://railway.app/dashboard"
echo "  2. Configure custom domain (optional)"
echo "  3. Set up monitoring and alerts"
echo "  4. Test your deployment"
echo ""
print_info "To view logs:"
echo "  railway logs"
echo ""
print_info "To open in browser:"
echo "  railway open"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Deployment complete! 🚀"
echo ""
