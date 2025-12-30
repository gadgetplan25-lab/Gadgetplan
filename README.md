# 🛍️ GadgetPlan E-Commerce Platform

Platform e-commerce modern untuk penjualan produk Apple (iPhone, MacBook, Accessories) dengan fitur lengkap termasuk booking service, AI chatbot WhatsApp, dan payment gateway terintegrasi.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Database Setup](#-database-setup)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Kontribusi](#-kontribusi)

## ✨ Fitur Utama

### Frontend (Customer)
- 🛒 **Shopping Cart & Wishlist** - Keranjang belanja dan daftar keinginan
- 💳 **Payment Gateway** - Integrasi Xendit untuk pembayaran
- 📦 **Order Tracking** - Pelacakan status pesanan real-time
- 🔍 **Product Search & Filter** - Pencarian dan filter produk advanced
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- 👤 **User Profile** - Manajemen profil dan riwayat pesanan
- 🔐 **Authentication** - Login/Register dengan JWT
- 📅 **Service Booking** - Booking layanan service, konsultasi, trade-in
- 💬 **AI Chatbot** - WhatsApp bot dengan AI Gemini
- 📝 **Blog & Articles** - Artikel dan tips produk

### Admin Panel
- 📊 **Dashboard Analytics** - Statistik penjualan dan performa
- 📦 **Order Management** - Kelola pesanan dan status
- 🛍️ **Product Management** - CRUD produk dengan kategori
- 👥 **User Management** - Kelola customer dan admin
- 📅 **Booking Management** - Kelola booking service
- 📝 **Blog Management** - Kelola artikel dan konten
- 🔧 **Service Management** - Kelola layanan dan teknisi
- 📈 **Sales Reports** - Laporan penjualan detail

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: CSS Modules, Vanilla CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Notifications**: SweetAlert2
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Sequelize ORM)
- **Authentication**: JWT (Access & Refresh Tokens)
- **Payment**: Xendit API
- **Email**: Nodemailer
- **WhatsApp**: Fonnte API
- **AI**: Google Gemini API
- **Shipping**: RajaOngkir API
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Prerequisites

Pastikan Anda sudah menginstall:

- **Node.js** >= 18.x
- **npm** atau **yarn**
- **MySQL** >= 8.0
- **Git**

## 🔧 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## ⚙️ Konfigurasi

### 1. Backend Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cd backend
cp .env.example .env
```

Edit file `.env` dan isi dengan konfigurasi Anda:

```env
# Database
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost

# JWT
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key

# Xendit
XENDIT_SECRET_KEY=xnd_development_your_xendit_secret_key

# Email
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# WhatsApp (Fonnte)
FONNTE_TOKEN=your_fonnte_api_token
WA_ADMIN_NUMBER=6281234567890

# RajaOngkir
RAJAONGKIR_API_KEY=your_rajaongkir_api_key
SHOP_CITY_ID=152

# Frontend URL
FRONTEND_URL=http://localhost:3000
ORIGIN=http://localhost:3000
```

### 2. Frontend Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cd frontend
cp .env.example .env
```

Edit file `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🗄️ Database Setup

### 1. Buat Database

```sql
CREATE DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Import Database Schema

```bash
cd backend
mysql -u your_user -p your_database_name < ../db_gadgedPlan.sql
```

### 3. (Optional) Jalankan Migrations

```bash
cd backend
npm run migrate
```

### 4. (Optional) Seed Data

```bash
npm run seed
```

## 🚀 Menjalankan Aplikasi

### Development Mode

#### 1. Jalankan Backend
```bash
cd backend
npm run dev
```
Backend akan berjalan di `http://localhost:4000`

#### 2. Jalankan Frontend
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:3000`

### Production Mode

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

## 📚 API Documentation

API endpoints tersedia di:
- **Base URL**: `http://localhost:4000`
- **Documentation**: Lihat file `backend/docs/API.md` (jika ada)

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

#### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order detail
- `PUT /api/orders/:id/status` - Update order status (Admin)

#### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

## 🌐 Deployment

### Backend (Railway/Heroku/VPS)

1. Set environment variables di platform hosting
2. Pastikan database MySQL sudah setup
3. Deploy dengan:
```bash
git push heroku main
```

### Frontend (Vercel)

1. Connect repository ke Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
3. Deploy otomatis dari main branch

## 🔐 Default Admin Credentials

Setelah setup database, gunakan credentials berikut untuk login admin:

```
Email: admin@gadgetplan.com
Password: admin123
```

⚠️ **PENTING**: Segera ubah password default setelah login pertama kali!

## 📁 Struktur Project

```
ecommerce/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Helper functions
│   │   └── config/          # Configuration files
│   ├── migrations/          # Database migrations
│   ├── public/              # Static files
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages (App Router)
│   │   ├── components/      # React components
│   │   ├── styles/          # CSS files
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── package.json
│
└── README.md
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail.

## 📞 Kontak

- **Email**: support@gadgetplan.com
- **WhatsApp**: +62 852-1611-5357
- **Website**: https://gadgetplan.com

## 🙏 Acknowledgments

- Next.js Team
- Express.js Community
- Xendit Indonesia
- Google Gemini AI
- Dan semua open source contributors

---

**Dibuat dengan ❤️ untuk kemudahan berbelanja produk Apple**
