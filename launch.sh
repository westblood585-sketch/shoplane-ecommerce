#!/bin/bash

echo "🚀 MyShop Launch Script"
echo "======================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node version
echo -e "${BLUE}Checking Node version...${NC}"
NODE_VERSION=$(node -v)
echo "Node version: $NODE_VERSION"

# Check if .env files exist
echo -e "${BLUE}Checking environment files...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ Backend .env found${NC}"
else
    echo -e "${RED}✗ Backend .env missing!${NC}"
    exit 1
fi

if [ -f "frontend/.env.production" ]; then
    echo -e "${GREEN}✓ Frontend .env.production found${NC}"
else
    echo -e "${RED}✗ Frontend .env.production missing!${NC}"
    exit 1
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
cd backend && npm install --production
cd ../frontend && npm install

# Build frontend
echo -e "${BLUE}Building frontend...${NC}"
npm run build

# Run tests
echo -e "${BLUE}Running tests...${NC}"
cd ../backend && npm test

# Deploy backend
echo -e "${BLUE}Deploying backend to Railway...${NC}"
railway up

# Deploy frontend
echo -e "${BLUE}Deploying frontend to Vercel...${NC}"
cd ../frontend && vercel --prod

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Backend URL: https://myshop-backend.railway.app"
echo "Frontend URL: https://myshop.vercel.app"
echo ""
echo "Next steps:"
echo "1. Test the live site"
echo "2. Configure domain (optional)"
echo "3. Setup SSL certificate"
echo "4. Monitor uptime"
echo ""
echo -e "${GREEN}🎉 Your e-commerce platform is LIVE! 🎉${NC}"
