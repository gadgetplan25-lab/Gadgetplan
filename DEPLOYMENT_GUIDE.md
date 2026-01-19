# 🚀 VPS Deployment Guide - GadgetPlan E-Commerce

## 📋 Pre-Deployment Checklist

### 1. **Database Migrations yang Harus Dijalankan**

Berikut adalah migration files yang perlu dijalankan di VPS (urutan penting):

```bash
1. create_product_variants.sql       # Tabel product variants
2. add_variant_to_cartitems.sql      # Update cart items
3. add_variant_to_orderitems.sql     # Update order items
4. add_shipping_to_orders.sql        # Shipping & payment info
5. add_missing_fields_to_orders.sql  # Additional order fields
```

### 2. **Environment Variables (.env)**

Pastikan file `.env` di VPS sudah dikonfigurasi:

#### **Backend (.env)**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=toko_online

# Server Configuration
NODE_ENV=production
PORT=8080

# JWT Secrets
JWT_SECRET=your_jwt_secret_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars
SESSION_SECRET=your_session_secret

# Email Configuration
EMAIL=gadgetplan25@gmail.com
EMAIL_PASS=your_email_app_password

# Frontend URL
FRONTEND_URL=https://your-domain.com
ORIGIN=https://your-domain.com
```

#### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

---

## 🗄️ Database Migration Steps

### **Option 1: Automated Script (Recommended)**

```bash
# Di VPS, masuk ke folder backend
cd /path/to/backend

# Jalankan migration script
node deploy-migrations.js
```

Script ini akan:
- ✅ Menjalankan semua migration secara berurutan
- ✅ Skip migration yang sudah pernah dijalankan
- ✅ Menampilkan error jika ada yang gagal
- ✅ Rollback-safe (tidak akan corrupt database)

### **Option 2: Manual Migration**

Jika ingin manual, jalankan satu per satu:

```bash
# 1. Product Variants
node run-migration.js

# 2. Cart Items Variant
node run-cart-migration.js

# 3. Order Items Variant
node run-orderitem-migration.js

# 4. Shipping Info
node run-shipping-migration.js

# 5. Trade-In System (Optional)
node run-tradein-template-migration.js
```

### **Option 3: Direct MySQL**

Jika akses langsung ke MySQL:

```bash
mysql -u root -p toko_online < database/migrations/create_product_variants.sql
mysql -u root -p toko_online < database/migrations/add_variant_to_cartitems.sql
mysql -u root -p toko_online < database/migrations/add_variant_to_orderitems.sql
mysql -u root -p toko_online < database/migrations/add_shipping_to_orders.sql
mysql -u root -p toko_online < database/migrations/add_missing_fields_to_orders.sql
```

---

## 📦 Deployment Steps

### **1. Backup Database (PENTING!)**

```bash
# Backup database sebelum migration
mysqldump -u root -p toko_online > backup_$(date +%Y%m%d_%H%M%S).sql
```

### **2. Update Code di VPS**

```bash
# Pull latest code
git pull origin main

# Install dependencies (jika ada perubahan)
cd backend && npm install
cd ../frontend && npm install
```

### **3. Run Database Migrations**

```bash
cd backend
node deploy-migrations.js
```

### **4. Restart Services**

```bash
# Restart backend
pm2 restart backend

# Rebuild & restart frontend
cd ../frontend
npm run build
pm2 restart frontend
```

### **5. Verify Deployment**

```bash
# Check backend status
pm2 status
pm2 logs backend --lines 50

# Check frontend status
pm2 logs frontend --lines 50

# Test API
curl https://api.your-domain.com/health

# Test frontend
curl https://your-domain.com
```

---

## 🔍 Verification Checklist

Setelah deployment, pastikan:

- [ ] **Database migrations berhasil** - Cek tabel baru ada
- [ ] **Backend API running** - Test endpoint `/api/products`
- [ ] **Frontend accessible** - Buka website di browser
- [ ] **Product variants working** - Cek halaman produk
- [ ] **Cart functionality** - Test add to cart dengan variant
- [ ] **Order placement** - Test checkout flow
- [ ] **Trade-in calculator** - Test jika digunakan

### **SQL Query untuk Verifikasi:**

```sql
-- Cek tabel product_variants ada
SHOW TABLES LIKE 'product_variants';

-- Cek struktur tabel
DESCRIBE product_variants;
DESCRIBE cartitems;
DESCRIBE orderitems;
DESCRIBE orders;

-- Cek data trade-in (jika ada)
SELECT COUNT(*) FROM trade_in_templates;
SELECT COUNT(*) FROM trade_in_phones;
```

---

## 🚨 Troubleshooting

### **Migration Error: "Table already exists"**
✅ **Normal** - Migration sudah pernah dijalankan, skip saja.

### **Migration Error: "Column already exists"**
✅ **Normal** - Column sudah ada, skip saja.

### **Error: "Cannot add foreign key constraint"**
❌ **Action needed:**
1. Cek apakah parent table sudah ada
2. Cek apakah data type match
3. Jalankan migration parent table dulu

### **Backend tidak bisa connect ke database**
❌ **Check:**
1. `.env` file sudah benar
2. MySQL service running: `systemctl status mysql`
3. Database user punya permission
4. Firewall tidak block port 3306

### **Frontend tidak bisa connect ke backend**
❌ **Check:**
1. `NEXT_PUBLIC_API_URL` di `.env.local` benar
2. CORS settings di backend
3. SSL certificate valid (jika HTTPS)
4. Firewall tidak block port 8080

---

## 📊 Database Schema Changes Summary

| Tabel | Perubahan | Impact |
|-------|-----------|--------|
| `product_variants` | **NEW** - Tabel baru untuk varian produk | HIGH |
| `cartitems` | **ADD** - Column `variant_id` | HIGH |
| `orderitems` | **ADD** - Column `variant_id` | HIGH |
| `orders` | **ADD** - Columns `payment_method`, `shipping_cost`, `shipping_detail` | MEDIUM |
| `trade_in_templates` | **NEW** - Template pricing trade-in | LOW (Optional) |
| `trade_in_phones` | **NEW** - Data iPhone trade-in | LOW (Optional) |

---

## 🔄 Rollback Plan (Jika Diperlukan)

Jika deployment gagal dan perlu rollback:

```bash
# 1. Restore database backup
mysql -u root -p toko_online < backup_YYYYMMDD_HHMMSS.sql

# 2. Revert code
git reset --hard HEAD~1
git push -f origin main

# 3. Restart services
pm2 restart all
```

---

## 📞 Support

Jika ada masalah saat deployment:
1. Check logs: `pm2 logs`
2. Check database: `mysql -u root -p`
3. Check migration status: `node deploy-migrations.js`

---

## ✅ Post-Deployment Tasks

Setelah deployment sukses:

1. **Update dokumentasi API** (jika ada endpoint baru)
2. **Inform team** tentang fitur baru (product variants)
3. **Monitor logs** selama 24 jam pertama
4. **Test critical flows** (checkout, payment, order)
5. **Update Google Search Console** (jika ada perubahan sitemap)

---

**Last Updated:** 2026-01-19  
**Version:** 1.0.0  
**Database Schema Version:** 5 migrations
