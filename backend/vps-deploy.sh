#!/bin/bash
# 🚀 VPS Deployment Script - GadgetPlan
# Quick deployment script untuk VPS Linux

echo "🚀 GadgetPlan VPS Deployment"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Backup Database
echo -e "${YELLOW}📦 Step 1: Backing up database...${NC}"
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u root -p toko_online > "$BACKUP_FILE"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database backed up to: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    exit 1
fi
echo ""

# Step 2: Pull Latest Code
echo -e "${YELLOW}📥 Step 2: Pulling latest code...${NC}"
git pull origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code updated${NC}"
else
    echo -e "${RED}❌ Git pull failed!${NC}"
    exit 1
fi
echo ""

# Step 3: Install Dependencies
echo -e "${YELLOW}📦 Step 3: Installing dependencies...${NC}"
cd backend
npm install
cd ../frontend
npm install
cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Run Database Migrations
echo -e "${YELLOW}🗄️  Step 4: Running database migrations...${NC}"
cd backend
node deploy-migrations.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completed${NC}"
else
    echo -e "${RED}❌ Migration failed!${NC}"
    echo -e "${YELLOW}⚠️  Restoring backup...${NC}"
    mysql -u root -p toko_online < "../$BACKUP_FILE"
    exit 1
fi
cd ..
echo ""

# Step 5: Build Frontend
echo -e "${YELLOW}🏗️  Step 5: Building frontend...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend built${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
cd ..
echo ""

# Step 6: Restart Services
echo -e "${YELLOW}🔄 Step 6: Restarting services...${NC}"
pm2 restart backend
pm2 restart frontend
echo -e "${GREEN}✅ Services restarted${NC}"
echo ""

# Step 7: Verify
echo -e "${YELLOW}🔍 Step 7: Verifying deployment...${NC}"
sleep 3
pm2 status
echo ""

echo -e "${GREEN}=============================="
echo -e "✅ DEPLOYMENT COMPLETED!"
echo -e "==============================${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Check logs: pm2 logs"
echo "   2. Test website: curl https://your-domain.com"
echo "   3. Monitor for 10 minutes"
echo ""
echo -e "${YELLOW}📊 Backup saved:${NC} $BACKUP_FILE"
echo ""
