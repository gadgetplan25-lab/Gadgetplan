# ✅ VPS DEPLOYMENT CHECKLIST

## 🔍 PRE-DEPLOYMENT CHECK

### **1. Case-Sensitive Files** ✅ FIXED
- [x] All model files lowercase
- [x] All controller files lowercase  
- [x] All route files lowercase
- [x] All imports match exact filenames

**Files Fixed:**
- `Wishlist.js` → `wishlist.js`
- `ProductReview.js` → `productReview.js`
- `OrderItem` import → `orderItem`
- `Payment` import → `payment`

---

## 📋 DEPLOYMENT STEPS

### **Step 1: Pull Latest Code di VPS**

```bash
cd ~/gadgetplan/Gadgetplan/backend
git pull origin main
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Restart Backend**

```bash
# Jika pakai PM2:
pm2 restart backend-api

# Jika manual:
npm start
```

### **Step 4: Cek Logs**

```bash
# PM2:
pm2 logs backend-api --lines 50

# Manual:
# Lihat output di terminal
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] `git pull` berhasil tanpa conflict
- [ ] `npm install` selesai tanpa error
- [ ] Backend start tanpa error "Cannot find module"
- [ ] Database connection successful
- [ ] Server running di port yang benar
- [ ] API endpoint bisa diakses

---

## 🧪 TEST API

```bash
# Test health check
curl http://localhost:4000

# Test dengan domain (jika sudah setup)
curl https://api.yourdomain.com
```

---

## 🚨 JIKA MASIH ERROR

### **Error: "Cannot find module"**

```bash
# Cek file ada
ls -la src/models/

# Cek case-sensitive
ls -la src/models/ | grep -i wishlist

# Jika file tidak ada, pull ulang
git fetch --all
git reset --hard origin/main
npm install
```

### **Error: "Database connection failed"**

```bash
# Cek MySQL running
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SHOW DATABASES;"

# Cek .env
cat .env | grep DB_
```

### **Error: "Port already in use"**

```bash
# Cek port
sudo lsof -i :4000

# Kill process
sudo kill -9 <PID>

# Atau ganti port di .env
```

---

## 📝 POST-DEPLOYMENT

### **Monitor Logs**

```bash
# Real-time logs
pm2 logs backend-api

# Last 100 lines
pm2 logs backend-api --lines 100

# Error logs only
pm2 logs backend-api --err
```

### **Check Status**

```bash
# PM2 status
pm2 status

# System resources
pm2 monit

# Detailed info
pm2 info backend-api
```

---

## 🔄 ROLLBACK (Jika Perlu)

```bash
# Lihat commit history
git log --oneline -5

# Rollback ke commit sebelumnya
git reset --hard <commit-hash>

# Restart
pm2 restart backend-api
```

---

## 💡 TIPS

1. **Selalu backup** sebelum deploy
2. **Test di local** dulu
3. **Monitor logs** setelah deploy
4. **Siapkan rollback plan**
5. **Dokumentasi** setiap perubahan

---

## 📞 EMERGENCY CONTACTS

- **VPS Provider Support:** [Link]
- **Database Backup:** [Location]
- **Rollback Commit:** [Hash]

---

**Last Updated:** 2026-01-04
**Status:** ✅ Ready for deployment
