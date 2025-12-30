# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan project GadgetPlan E-Commerce dalam 5 menit!

## ⚡ Prerequisites

Pastikan sudah terinstall:
- Node.js (v18+)
- MySQL (v8.0+)
- Git

## 📦 Instalasi Cepat

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan text editor favorit Anda
# Minimal yang harus diisi:
# - DB_NAME, DB_USER, DB_PASSWORD
# - JWT_SECRET, REFRESH_TOKEN_SECRET
```

### 3. Setup Database

```bash
# Buat database
mysql -u root -p -e "CREATE DATABASE gadgetplan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import schema
mysql -u root -p gadgetplan_db < ../db_gadgedPlan.sql
```

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env
# NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 5. Jalankan Aplikasi

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Admin Panel**: http://localhost:3000/dashboard

**Default Admin Login:**
- Email: `admin@gadgetplan.com`
- Password: `admin123`

## 🎯 Fitur yang Bisa Langsung Dicoba

### Customer Side
1. **Browse Products** - Lihat katalog produk
2. **Add to Cart** - Tambahkan produk ke keranjang
3. **Wishlist** - Simpan produk favorit
4. **Register/Login** - Buat akun baru
5. **Checkout** - Proses pembelian (perlu setup Xendit)

### Admin Panel
1. **Dashboard** - Lihat statistik penjualan
2. **Manage Products** - Tambah/edit/hapus produk
3. **Manage Orders** - Kelola pesanan
4. **Manage Users** - Kelola customer
5. **Manage Bookings** - Kelola booking service

## 🔧 Konfigurasi Opsional

### Payment Gateway (Xendit)

1. Daftar di [Xendit](https://dashboard.xendit.co/register)
2. Dapatkan API Key dari dashboard
3. Tambahkan ke `backend/.env`:
```env
XENDIT_SECRET_KEY=xnd_development_your_key_here
```

### WhatsApp Bot (Fonnte)

1. Daftar di [Fonnte](https://fonnte.com)
2. Dapatkan API Token
3. Tambahkan ke `backend/.env`:
```env
FONNTE_TOKEN=your_token_here
WA_ADMIN_NUMBER=6281234567890
```

### Email (Gmail)

1. Buat App Password di Google Account
2. Tambahkan ke `backend/.env`:
```env
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Shipping (RajaOngkir)

1. Daftar di [RajaOngkir](https://rajaongkir.com)
2. Dapatkan API Key
3. Tambahkan ke `backend/.env`:
```env
RAJAONGKIR_API_KEY=your_key_here
SHOP_CITY_ID=152
```

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
```bash
# Cek MySQL service
# Windows:
net start MySQL80

# Cek credentials di .env
# Pastikan DB_USER, DB_PASSWORD, DB_NAME benar
```

### Port sudah digunakan
```bash
# Ubah port di backend/.env
PORT=5000

# Atau kill process yang menggunakan port
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Frontend error "Cannot connect to API"
```bash
# Pastikan backend sudah running
# Cek NEXT_PUBLIC_API_URL di frontend/.env
# Pastikan sesuai dengan PORT backend
```

### Database error "Table doesn't exist"
```bash
# Import ulang database
mysql -u root -p gadgetplan_db < db_gadgedPlan.sql
```

## 📚 Dokumentasi Lengkap

- **README.md** - Dokumentasi utama
- **DATABASE.md** - Setup database detail
- **PUSH_CHECKLIST.md** - Checklist push ke repository
- **backend/.env.example** - Konfigurasi backend
- **frontend/.env.example** - Konfigurasi frontend

## 🎉 Selesai!

Aplikasi sekarang sudah berjalan! Silakan explore fitur-fiturnya.

Untuk development lebih lanjut, lihat dokumentasi lengkap di README.md

---

**Need Help?** Buka issue di GitHub atau hubungi tim development.
