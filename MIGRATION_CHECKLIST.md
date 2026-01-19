# ✅ VPS Deployment Checklist - GadgetPlan

## 🎯 Quick Reference untuk Deployment

### 📋 Pre-Deployment (Lakukan di Local)

- [ ] **Commit semua perubahan**
  ```bash
  git add .
  git commit -m "feat: add product variants & trade-in system"
  git push origin main
  ```

- [ ] **Pastikan semua migration files ada**
  ```
  ✅ database/migrations/create_product_variants.sql
  ✅ database/migrations/add_variant_to_cartitems.sql
  ✅ database/migrations/add_variant_to_orderitems.sql
  ✅ database/migrations/add_shipping_to_orders.sql
  ✅ database/migrations/add_missing_fields_to_orders.sql
  ```

- [ ] **Test di local dulu**
  ```bash
  cd backend
  node deploy-migrations.js
  npm run dev
  ```

---

### 🚀 Deployment di VPS

#### **Option A: Automated (Recommended)**

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Masuk ke project folder
cd /path/to/project

# Jalankan deployment script
chmod +x backend/vps-deploy.sh
./backend/vps-deploy.sh
```

#### **Option B: Manual Step-by-Step**

```bash
# 1. Backup database
mysqldump -u root -p toko_online > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 4. Run migrations
cd backend
node deploy-migrations.js

# 5. Build frontend
cd ../frontend
npm run build

# 6. Restart services
pm2 restart backend
pm2 restart frontend

# 7. Check status
pm2 status
pm2 logs --lines 50
```

---

### 🔍 Post-Deployment Verification

- [ ] **Check PM2 Status**
  ```bash
  pm2 status
  # Pastikan backend & frontend status: online
  ```

- [ ] **Check Backend Logs**
  ```bash
  pm2 logs backend --lines 50
  # Pastikan tidak ada error
  ```

- [ ] **Check Frontend Logs**
  ```bash
  pm2 logs frontend --lines 50
  # Pastikan build success
  ```

- [ ] **Test Database Migration**
  ```sql
  mysql -u root -p
  USE toko_online;
  
  -- Cek tabel baru
  SHOW TABLES LIKE 'product_variants';
  SHOW TABLES LIKE 'trade_in%';
  
  -- Cek struktur
  DESCRIBE product_variants;
  DESCRIBE cartitems;
  DESCRIBE orderitems;
  DESCRIBE orders;
  ```

- [ ] **Test API Endpoints**
  ```bash
  # Health check
  curl https://api.your-domain.com/health
  
  # Products API
  curl https://api.your-domain.com/api/products
  
  # Variants API (jika ada)
  curl https://api.your-domain.com/api/products/1/variants
  ```

- [ ] **Test Frontend**
  ```bash
  # Homepage
  curl https://your-domain.com
  
  # Products page
  curl https://your-domain.com/products
  
  # Cart page
  curl https://your-domain.com/cart
  ```

- [ ] **Test di Browser**
  - [ ] Homepage load dengan benar
  - [ ] Product page menampilkan variants
  - [ ] Add to cart dengan variant selection
  - [ ] Checkout flow berjalan
  - [ ] Dashboard accessible
  - [ ] Trade-in calculator (jika ada)

---

### 🚨 Troubleshooting

#### **Problem: Migration Failed**

```bash
# Check error
pm2 logs backend --lines 100

# Manual run migration
cd backend
node deploy-migrations.js

# Jika masih error, rollback
mysql -u root -p toko_online < backup_YYYYMMDD_HHMMSS.sql
```

#### **Problem: Backend Won't Start**

```bash
# Check logs
pm2 logs backend --err --lines 50

# Check .env file
cat backend/.env

# Restart dengan force
pm2 delete backend
pm2 start backend/src/server.js --name backend
```

#### **Problem: Frontend Build Failed**

```bash
# Check Node version
node -v  # Should be >= 18

# Clear cache & rebuild
cd frontend
rm -rf .next node_modules
npm install
npm run build

# Restart
pm2 restart frontend
```

#### **Problem: Database Connection Error**

```bash
# Check MySQL running
systemctl status mysql

# Check credentials
mysql -u root -p

# Check .env
cat backend/.env | grep DB_
```

---

### 📊 Database Changes Summary

| Migration File | Tabel | Perubahan | Critical? |
|----------------|-------|-----------|-----------|
| `create_product_variants.sql` | `product_variants` | CREATE TABLE | ✅ YES |
| `add_variant_to_cartitems.sql` | `cartitems` | ADD COLUMN `variant_id` | ✅ YES |
| `add_variant_to_orderitems.sql` | `orderitems` | ADD COLUMN `variant_id` | ✅ YES |
| `add_shipping_to_orders.sql` | `orders` | ADD COLUMNS shipping | ⚠️ MEDIUM |
| `add_missing_fields_to_orders.sql` | `orders` | ADD COLUMN `payment_method` | ⚠️ MEDIUM |

---

### 🔄 Rollback Plan

Jika deployment gagal total:

```bash
# 1. Stop services
pm2 stop all

# 2. Restore database
mysql -u root -p toko_online < backup_YYYYMMDD_HHMMSS.sql

# 3. Revert code
git reset --hard HEAD~1

# 4. Restart old version
pm2 restart all

# 5. Verify
pm2 status
curl https://your-domain.com
```

---

### 📞 Emergency Contacts

- **Database Issues**: Check `/var/log/mysql/error.log`
- **Backend Issues**: `pm2 logs backend --err`
- **Frontend Issues**: `pm2 logs frontend --err`
- **Nginx Issues**: `sudo tail -f /var/log/nginx/error.log`

---

### ✅ Final Checklist

- [ ] Database backup created
- [ ] All migrations successful
- [ ] Backend running (pm2 status)
- [ ] Frontend running (pm2 status)
- [ ] Website accessible
- [ ] No errors in logs
- [ ] Product variants working
- [ ] Cart functionality working
- [ ] Checkout flow working
- [ ] SSL certificate valid
- [ ] Performance acceptable (< 3s load time)

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Backup File:** _____________  
**Status:** ⬜ Success  ⬜ Failed  ⬜ Partial

---

## 📝 Notes

Catatan tambahan selama deployment:

```
[Tulis catatan di sini]
```
