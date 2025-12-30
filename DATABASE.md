# 🗄️ Database Setup Guide

## Informasi Database

- **Database Name**: gadgetplan_db (atau sesuai konfigurasi Anda)
- **Engine**: MySQL 8.0+
- **Charset**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

## 📋 Cara Setup Database

### Opsi 1: Import dari File SQL (Recommended)

#### 1. Buat Database Baru

```sql
CREATE DATABASE gadgetplan_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

#### 2. Import Schema

```bash
# Menggunakan MySQL CLI
mysql -u your_username -p gadgetplan_db < db_gadgedPlan.sql

# Atau menggunakan phpMyAdmin
# 1. Login ke phpMyAdmin
# 2. Pilih database gadgetplan_db
# 3. Klik tab "Import"
# 4. Pilih file db_gadgedPlan.sql
# 5. Klik "Go"
```

### Opsi 2: Menggunakan Sequelize Migrations

```bash
cd backend

# Install dependencies jika belum
npm install

# Jalankan migrations
npx sequelize-cli db:migrate

# (Opsional) Seed data sample
npx sequelize-cli db:seed:all
```

## 📊 Struktur Tabel

### 1. **users** - Data User/Customer
- `id` (PK)
- `name`
- `email` (unique)
- `password` (hashed)
- `phone`
- `role` (customer/admin)
- `isVerified`
- `createdAt`, `updatedAt`

### 2. **products** - Data Produk
- `id` (PK)
- `name`
- `description`
- `price`
- `stock`
- `category_id` (FK)
- `images` (JSON array)
- `specifications` (JSON)
- `createdAt`, `updatedAt`

### 3. **categories** - Kategori Produk
- `id` (PK)
- `name`
- `description`
- `icon`
- `createdAt`, `updatedAt`

### 4. **orders** - Data Pesanan
- `id` (PK)
- `user_id` (FK)
- `total_amount`
- `status` (pending/paid/processing/shipped/delivered/cancelled)
- `payment_method`
- `payment_status`
- `shipping_address` (JSON)
- `createdAt`, `updatedAt`

### 5. **order_items** - Detail Item Pesanan
- `id` (PK)
- `order_id` (FK)
- `product_id` (FK)
- `quantity`
- `price`
- `subtotal`

### 6. **carts** - Keranjang Belanja
- `id` (PK)
- `user_id` (FK)
- `product_id` (FK)
- `quantity`
- `createdAt`, `updatedAt`

### 7. **wishlists** - Daftar Keinginan
- `id` (PK)
- `user_id` (FK)
- `product_id` (FK)
- `createdAt`, `updatedAt`

### 8. **bookings** - Booking Service
- `id` (PK)
- `user_id` (FK)
- `service_id` (FK)
- `technician_id` (FK)
- `booking_date`
- `status` (pending/confirmed/completed/cancelled)
- `notes`
- `createdAt`, `updatedAt`

### 9. **services** - Layanan Service
- `id` (PK)
- `name`
- `description`
- `price`
- `duration` (menit)
- `category` (repair/consultation/trade-in)
- `createdAt`, `updatedAt`

### 10. **technicians** - Data Teknisi
- `id` (PK)
- `name`
- `email`
- `phone`
- `specialization`
- `rating`
- `isAvailable`
- `createdAt`, `updatedAt`

### 11. **blogs** - Artikel Blog
- `id` (PK)
- `title`
- `slug` (unique)
- `content`
- `excerpt`
- `author_id` (FK)
- `category`
- `featured_image`
- `status` (draft/published)
- `createdAt`, `updatedAt`

### 12. **reviews** - Review Produk
- `id` (PK)
- `user_id` (FK)
- `product_id` (FK)
- `rating` (1-5)
- `comment`
- `createdAt`, `updatedAt`

### 13. **refresh_tokens** - Token Refresh JWT
- `id` (PK)
- `user_id` (FK)
- `token`
- `expiresAt`
- `createdAt`

## 🔑 Default Admin Account

Setelah import database, gunakan kredensial berikut untuk login admin:

```
Email: admin@gadgetplan.com
Password: admin123
```

⚠️ **PENTING**: Segera ubah password setelah login pertama kali!

## 🔧 Konfigurasi Backend

Edit file `backend/.env`:

```env
DB_NAME=gadgetplan_db
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

## 📝 Migrations yang Tersedia

Jika menggunakan Sequelize migrations, berikut file migrations yang tersedia:

1. `create-users-table.js`
2. `create-products-table.js`
3. `create-orders-table.js`
4. `create-bookings-table.js`

## 🔍 Verifikasi Database

Setelah setup, verifikasi dengan query berikut:

```sql
-- Cek semua tabel
SHOW TABLES;

-- Cek struktur tabel users
DESCRIBE users;

-- Cek jumlah data
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM orders) as total_orders;
```

## 🚨 Troubleshooting

### Error: "Access denied for user"
```bash
# Pastikan user MySQL memiliki privileges
GRANT ALL PRIVILEGES ON gadgetplan_db.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Unknown database"
```bash
# Buat database terlebih dahulu
CREATE DATABASE gadgetplan_db;
```

### Error: "Table doesn't exist"
```bash
# Import ulang file SQL atau jalankan migrations
mysql -u root -p gadgetplan_db < db_gadgedPlan.sql
```

## 📊 Indexes untuk Performance

Database sudah dilengkapi dengan indexes pada:
- Foreign keys
- Email (unique index)
- Product name (fulltext index)
- Order status
- Booking date

File: `backend/database-indexes.sql`

## 🔄 Backup Database

### Backup Manual
```bash
mysqldump -u your_username -p gadgetplan_db > backup_$(date +%Y%m%d).sql
```

### Restore dari Backup
```bash
mysql -u your_username -p gadgetplan_db < backup_20250101.sql
```

## 📈 Monitoring

Untuk monitoring performa database:

```sql
-- Cek ukuran database
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'gadgetplan_db'
GROUP BY table_schema;

-- Cek tabel terbesar
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'gadgetplan_db'
ORDER BY (data_length + index_length) DESC;
```

---

**Catatan**: Pastikan MySQL server sudah berjalan sebelum menjalankan aplikasi backend.
