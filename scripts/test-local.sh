#!/bin/bash

# Sakshi Platform - Local Testing Automation Script
# This script sets up and tests the platform locally

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         Sakshi Platform - Local Testing Script               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check Node.js
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Checking Prerequisites"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher (found: $(node -v))"
    exit 1
fi

print_success "Node.js $(node -v) installed"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm not found. Installing..."
    npm install -g pnpm
    print_success "pnpm installed"
else
    print_success "pnpm $(pnpm -v) installed"
fi

# Install dependencies
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Installing Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    pnpm install
    print_success "Dependencies installed"
else
    print_info "Checking for updates..."
    pnpm install
    print_success "Dependencies up to date"
fi

# Check .env file
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Checking Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f ".env" ]; then
    print_warning ".env file not found"
    
    if [ -f ".env.example" ]; then
        print_info "Creating .env from .env.example..."
        cp .env.example .env
        print_success ".env file created"
        print_warning "Please update .env with your configuration"
    else
        print_error ".env.example not found. Creating basic .env..."
        cat > .env << 'EOF'
# Database
DATABASE_URL="file:./dev.db"

# Application
NODE_ENV=development
PORT=3000

# Session
SESSION_SECRET=dev-secret-change-in-production

# OAuth (Optional for local development)
# OAUTH_CLIENT_ID=
# OAUTH_CLIENT_SECRET=
# OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
# OAUTH_ISSUER=https://auth.manus.im
EOF
        print_success "Basic .env created"
    fi
else
    print_success ".env file exists"
fi

# Setup database
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Setting Up Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Pushing database schema..."
pnpm db:push

if [ $? -eq 0 ]; then
    print_success "Database schema created"
else
    print_error "Database schema creation failed"
    exit 1
fi

# Ask about seeding
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Seeding database..."
    pnpm db:seed
    
    if [ $? -eq 0 ]; then
        print_success "Database seeded with sample data"
    else
        print_warning "Database seeding failed or not configured"
    fi
fi

# Build project
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Building Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Building project..."
pnpm build

if [ $? -eq 0 ]; then
    print_success "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# Run tests (if available)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Running Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "\"test\":" package.json; then
    print_info "Running tests..."
    pnpm test || print_warning "Some tests failed"
else
    print_info "No tests configured (skipping)"
fi

# Start development server
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7: Starting Development Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    SETUP COMPLETE! 🎉                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_success "Sakshi Platform is ready for local development!"
echo ""
print_info "Starting development server..."
echo ""
print_info "The server will start at: http://localhost:3000"
print_info "Press Ctrl+C to stop the server"
echo ""
print_info "Test the following features:"
echo "  ✓ Homepage with Adiyogi background"
echo "  ✓ Shop page with product catalog"
echo "  ✓ Animations and hover effects"
echo "  ✓ Dark mode toggle"
echo "  ✓ Responsive design (resize browser)"
echo "  ✓ Shopping cart"
echo "  ✓ Seva wallet"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start dev server
pnpm dev
