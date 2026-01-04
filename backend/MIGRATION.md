# 🗄️ CARA MIGRASI DATABASE

## 📋 LANGKAH-LANGKAH MIGRASI DATABASE

### **OPSI 1: Migrasi Manual (Recommended)** ⭐

#### **Step 1: Buat Database Baru**

```sql
CREATE DATABASE toko_online 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

**Cara:**
1. Buka **phpMyAdmin** atau **MySQL Workbench**
2. Klik **New** atau **Create Database**
3. Nama: `toko_online`
4. Charset: `utf8mb4`
5. Collation: `utf8mb4_unicode_ci`
6. Klik **Create**

---

#### **Step 2: Import File SQL**

**Menggunakan phpMyAdmin:**
1. Login ke phpMyAdmin
2. Pilih database `toko_online`
3. Klik tab **Import**
4. Klik **Choose File**
5. Pilih file `db_gadgedPlan.sql` (di root project)
6. Klik **Go**
7. Tunggu sampai selesai

**Menggunakan MySQL CLI:**
```bash
# Windows (PowerShell)
cd "C:\Kerja\project ecommerce\project ecommerce"
mysql -u root -p toko_online < db_gadgedPlan.sql

# Masukkan password MySQL Anda
```

---

#### **Step 3: Jalankan SQL Tambahan (Optional)**

Jika ada tabel yang belum dibuat, jalankan file SQL berikut:

```bash
# 1. Blog tables
mysql -u root -p toko_online < backend/add-blog-tables.sql

# 2. Wishlist table
mysql -u root -p toko_online < backend/create-wishlists-table.sql

# 3. New tables
mysql -u root -p toko_online < backend/create-new-tables.sql

# 4. Indexes (untuk performance)
mysql -u root -p toko_online < backend/database-indexes.sql
```

---

#### **Step 4: Verifikasi Database**

```sql
-- Cek semua tabel
USE toko_online;
SHOW TABLES;

-- Harus ada tabel:
-- users, products, categories, orders, order_items, 
-- carts, wishlists, bookings, services, technicians,
-- blogs, reviews, refresh_tokens, dll
```

---

### **OPSI 2: Migrasi Otomatis (Script)** 🤖

Saya sudah buatkan script PowerShell untuk migrasi otomatis:

```powershell
# Jalankan di PowerShell
cd "C:\Kerja\project ecommerce\project ecommerce\backend"
.\migrate-database.ps1
```

Script ini akan:
1. ✅ Cek koneksi MySQL
2. ✅ Buat database jika belum ada
3. ✅ Import semua file SQL
4. ✅ Verifikasi tabel
5. ✅ Tampilkan hasil

---

## 🔧 KONFIGURASI SETELAH MIGRASI

### **1. Update .env Backend**

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=toko_online
```

### **2. Test Koneksi**

```bash
cd backend
npm run dev
```

**Output yang diharapkan:**
```
🗄️  Connecting to MySQL database...
   ✓ Database connected successfully!
   Host: localhost
   Database: toko_online
```

---

## 📊 STRUKTUR DATABASE

Setelah migrasi, database akan memiliki tabel:

| Tabel | Fungsi |
|-------|--------|
| **users** | Data user/customer |
| **products** | Data produk |
| **ProductImages** | Gambar produk |
| **categories** | Kategori produk |
| **orders** | Data pesanan |
| **order_items** | Detail item pesanan |
| **carts** | Keranjang belanja |
| **wishlists** | Wishlist produk |
| **bookings** | Booking service |
| **services** | Layanan service |
| **technicians** | Data teknisi |
| **blogs** | Artikel blog |
| **reviews** | Review produk |
| **refresh_tokens** | JWT refresh tokens |

---

## 🔑 DEFAULT ADMIN ACCOUNT

Setelah migrasi, gunakan akun ini untuk login:

```
Email: admin@gadgetplan.com
Password: admin123
```

⚠️ **PENTING:** Segera ubah password setelah login pertama!

---

## 🚨 TROUBLESHOOTING

### **Error: "Access denied for user"**

```sql
-- Grant privileges
GRANT ALL PRIVILEGES ON toko_online.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### **Error: "Unknown database 'toko_online'"**

```sql
-- Buat database manual
CREATE DATABASE toko_online;
```

### **Error: "Table already exists"**

```sql
-- Drop database dan buat ulang
DROP DATABASE toko_online;
CREATE DATABASE toko_online;
-- Lalu import ulang
```

### **Error: "Lost connection to MySQL server"**

```sql
-- Increase timeout
SET GLOBAL max_allowed_packet=1073741824;
SET GLOBAL wait_timeout=28800;
```

---

## 📝 BACKUP DATABASE

### **Backup Manual:**

```bash
# Backup database
mysqldump -u root -p toko_online > backup_toko_online_$(date +%Y%m%d).sql

# Backup dengan compress
mysqldump -u root -p toko_online | gzip > backup_toko_online_$(date +%Y%m%d).sql.gz
```

### **Restore dari Backup:**

```bash
# Restore
mysql -u root -p toko_online < backup_toko_online_20250104.sql

# Restore dari compress
gunzip < backup_toko_online_20250104.sql.gz | mysql -u root -p toko_online
```

---

## ✅ CHECKLIST MIGRASI

- [ ] MySQL server running
- [ ] Database `toko_online` dibuat
- [ ] File `db_gadgedPlan.sql` di-import
- [ ] File SQL tambahan di-import (optional)
- [ ] Semua tabel ada (cek dengan `SHOW TABLES`)
- [ ] `.env` backend sudah dikonfigurasi
- [ ] Backend bisa connect ke database
- [ ] Admin account bisa login

---

## 🎯 QUICK START

```bash
# 1. Buat database
mysql -u root -p -e "CREATE DATABASE toko_online CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Import SQL
cd "C:\Kerja\project ecommerce\project ecommerce"
mysql -u root -p toko_online < db_gadgedPlan.sql

# 3. Import tambahan (optional)
mysql -u root -p toko_online < backend/add-blog-tables.sql
mysql -u root -p toko_online < backend/create-wishlists-table.sql
mysql -u root -p toko_online < backend/database-indexes.sql

# 4. Verifikasi
mysql -u root -p toko_online -e "SHOW TABLES;"

# 5. Test backend
cd backend
npm run dev
```

---

**Selesai!** Database siap digunakan! 🎉
