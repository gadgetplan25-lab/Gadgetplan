# 🐧 VPS DEPLOYMENT TROUBLESHOOTING

## ❌ Error: Cannot find module './OrderItem'

### **Masalah:**
```
Error: Cannot find module './OrderItem'
```

### **Penyebab:**
- **Windows:** Case-insensitive (tidak peduli huruf besar/kecil)
  - `require("./OrderItem")` = `require("./orderItem")` ✅ Sama saja
  
- **Linux/VPS:** Case-sensitive (peduli huruf besar/kecil)
  - `require("./OrderItem")` ≠ `require("./orderItem")` ❌ Beda!

### **Solusi:**
File imports harus **EXACT MATCH** dengan nama file asli:

```javascript
// ❌ SALAH (Windows OK, Linux ERROR):
const OrderItem = require("./OrderItem");  // File: orderItem.js
const Payment = require("./Payment");      // File: payment.js
const Wishlist = require("./Wishlist");    // File: wishlist.js

// ✅ BENAR (Windows & Linux OK):
const OrderItem = require("./orderItem");  // File: orderItem.js
const Payment = require("./payment");      // File: payment.js
const Wishlist = require("./wishlist");    // File: wishlist.js
```

### **File yang Sudah Diperbaiki:**
- `backend/src/models/index.js` ✅

---

## 🔧 CARA DEPLOY KE VPS

### **1. Clone Repository**

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Clone repo
git clone https://github.com/yourusername/Gadgetplan.git
cd Gadgetplan/backend
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Setup Environment Variables**

```bash
# Copy .env.example
cp .env.example .env

# Edit .env
nano .env
```

**Isi .env:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_vps_mysql_password
DB_NAME=toko_online

JWT_SECRET=your-jwt-secret
REFRESH_TOKEN_SECRET=your-refresh-secret

EMAIL=youremail@gmail.com
EMAIL_PASS=your-app-password

RAJAONGKIR_API_KEY=your-api-key
SHOP_CITY_ID=455

FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
PORT=4000
```

### **4. Setup Database**

```bash
# Login MySQL
mysql -u root -p

# Buat database
CREATE DATABASE toko_online CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Import SQL
mysql -u root -p toko_online < ../db_gadgedPlan.sql
```

### **5. Install PM2 (Process Manager)**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend
pm2 start src/index.js --name backend-api

# Auto-start on reboot
pm2 startup
pm2 save
```

### **6. Setup Nginx (Reverse Proxy)**

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/backend
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **7. Setup SSL (HTTPS)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
```

---

## ✅ VERIFIKASI DEPLOYMENT

```bash
# Cek PM2 status
pm2 status

# Cek logs
pm2 logs backend-api

# Cek Nginx
sudo systemctl status nginx

# Test API
curl http://localhost:4000
```

---

## 🚨 COMMON ERRORS & FIXES

### **Error: "Cannot find module"**
```bash
# Pastikan semua dependencies terinstall
npm install

# Cek file case-sensitive
ls -la src/models/
```

### **Error: "Database connection failed"**
```bash
# Cek MySQL running
sudo systemctl status mysql

# Cek credentials di .env
cat .env | grep DB_
```

### **Error: "Port already in use"**
```bash
# Cek port 4000
sudo lsof -i :4000

# Kill process
sudo kill -9 <PID>

# Atau ganti PORT di .env
```

### **Error: "Permission denied"**
```bash
# Fix permissions
sudo chown -R $USER:$USER ~/gadgetplan

# Fix node_modules
rm -rf node_modules
npm install
```

---

## 📝 PM2 COMMANDS

```bash
# Start
pm2 start src/index.js --name backend-api

# Stop
pm2 stop backend-api

# Restart
pm2 restart backend-api

# Delete
pm2 delete backend-api

# Logs
pm2 logs backend-api

# Monitor
pm2 monit

# List all
pm2 list
```

---

## 🔄 UPDATE CODE DI VPS

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Masuk ke folder
cd ~/gadgetplan/Gadgetplan/backend

# Pull latest code
git pull origin main

# Install dependencies (jika ada yang baru)
npm install

# Restart PM2
pm2 restart backend-api

# Cek logs
pm2 logs backend-api --lines 50
```

---

## 💡 TIPS

1. **Selalu test di local** sebelum push ke VPS
2. **Gunakan PM2** untuk auto-restart
3. **Setup SSL** untuk keamanan
4. **Backup database** secara berkala
5. **Monitor logs** dengan PM2

---

**Selesai!** Backend siap di VPS! 🎉
