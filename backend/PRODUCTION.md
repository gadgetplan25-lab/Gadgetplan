# 🚀 CARA RUN BACKEND PRODUCTION

## 📋 Prerequisites

1. **Node.js** installed (v18+)
2. **MySQL** running
3. **Environment variables** configured

---

## 🔧 SETUP ENVIRONMENT VARIABLES

### **1. Copy .env.example ke .env:**

```bash
cp .env.example .env
```

### **2. Edit .env dan isi semua variable:**

```env
# === DATABASE ===
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=toko_online

# === JWT & SECURITY ===
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-characters

# === EMAIL (OTP) ===
EMAIL=youremail@gmail.com
EMAIL_PASS=your-gmail-app-password

# === RAJAONGKIR (Ongkir) ===
RAJAONGKIR_API_KEY=your-rajaongkir-api-key
SHOP_CITY_ID=455

# === FRONTEND ===
FRONTEND_URL=http://localhost:3000

# === ENVIRONMENT ===
NODE_ENV=production
PORT=4000
```

---

## 🏃 CARA RUN

### **OPSI 1: Development Mode** (Recommended untuk testing)

```bash
cd backend
npm run dev
```

**Fitur:**
- ✅ Auto-restart saat file berubah (nodemon)
- ✅ Detailed error messages
- ✅ Console logs aktif
- ✅ CORS lebih permisif

---

### **OPSI 2: Production Mode** (Localhost)

```bash
cd backend
npm run prod
```

**Fitur:**
- ✅ Optimized untuk performa
- ✅ Error messages minimal (security)
- ✅ Console logs terbatas
- ✅ CORS strict

---

### **OPSI 3: Standard Start** (Default)

```bash
cd backend
npm start
```

**Catatan:** Ini akan menggunakan NODE_ENV dari .env file

---

## 🔍 PERBEDAAN MODE

| Feature | Development | Production |
|---------|-------------|------------|
| **Auto-restart** | ✅ Yes (nodemon) | ❌ No |
| **Error details** | ✅ Full stack trace | ⚠️ Minimal |
| **Console logs** | ✅ All logs | ⚠️ Error/Warn only |
| **CORS** | ✅ Permissive | ⚠️ Strict |
| **Performance** | ⚠️ Slower | ✅ Faster |
| **Security** | ⚠️ Less secure | ✅ More secure |

---

## 🌐 DEPLOY PRODUCTION (Cloud)

### **Untuk Railway/Render/VPS:**

1. **Set environment variables** di platform
2. **Build command:** `npm install`
3. **Start command:** `npm start`
4. **NODE_ENV:** `production` (set di environment variables)

---

## ✅ CHECKLIST SEBELUM RUN PRODUCTION

- [ ] Database sudah dibuat
- [ ] Semua environment variables sudah diisi
- [ ] JWT_SECRET minimal 32 karakter
- [ ] Email App Password sudah didapat
- [ ] RajaOngkir API Key valid
- [ ] FRONTEND_URL sesuai dengan URL frontend

---

## 🐛 TROUBLESHOOTING

### **Error: Missing environment variables**

```bash
# Pastikan .env file ada dan terisi lengkap
cat .env
```

### **Error: Database connection failed**

```bash
# Cek MySQL running
# Windows:
services.msc

# Cek credentials di .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
```

### **Error: Port already in use**

```bash
# Ganti PORT di .env
PORT=5000
```

---

## 📝 LOGS

### **Development:**
```
✅ All logs visible
📝 Detailed error messages
🔍 SQL queries logged
```

### **Production:**
```
⚠️ Only errors and warnings
🔒 Minimal error details
🚫 No SQL queries logged
```

---

## 🎯 RECOMMENDED WORKFLOW

1. **Development:** `npm run dev`
2. **Testing Production:** `npm run prod` (localhost)
3. **Deploy:** Push to Railway/Render/VPS

---

## 💡 TIPS

1. **Jangan commit .env** ke Git!
2. **Generate JWT_SECRET** dengan:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Test production mode** sebelum deploy
4. **Backup database** sebelum deploy production

---

## 🚀 QUICK START

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Setup .env
cp .env.example .env
# Edit .env dengan text editor

# 3. Run development
npm run dev

# 4. Test production (optional)
npm run prod
```

---

**Selesai!** Backend siap run di production mode! 🎉
