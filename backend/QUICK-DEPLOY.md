# 🚀 QUICK VPS DEPLOYMENT GUIDE

## ⚡ LANGKAH CEPAT

```bash
# 1. SSH ke VPS
ssh gadgetplan@your-vps-ip

# 2. Masuk ke folder backend
cd ~/gadgetplan/Gadgetplan/backend

# 3. Pull latest code
git pull origin main

# 4. Install/Update dependencies
npm install

# 5. Restart backend
pm2 restart backend-api

# 6. Cek logs
pm2 logs backend-api --lines 50
```

---

## ✅ EXPECTED OUTPUT

```
✅ Database connection successful
   Host: localhost
   Database: toko_online
   Environment: production

🚀 Server running on port 4000
   Mode: production
   URL: http://localhost:4000
   Time: 2026-01-04T...
```

---

## 🔧 FIXES YANG SUDAH DITERAPKAN

### **1. Case-Sensitive Files** ✅
- Wishlist.js → wishlist.js
- ProductReview.js → productReview.js
- All imports lowercase

### **2. SSL Configuration** ✅
- Disabled SSL for localhost
- Enabled SSL only for cloud databases

### **3. UUID Package** ✅
- Downgraded from v13 (ES Module) to v9 (CommonJS)
- Fixes `ERR_REQUIRE_ESM` error

---

## 🚨 TROUBLESHOOTING

### Error: "Cannot find module './wishlist'"
**Status:** ✅ FIXED
**Solution:** File renamed to lowercase

### Error: "Server does not support secure connection"
**Status:** ✅ FIXED
**Solution:** SSL disabled for localhost

### Error: "ERR_REQUIRE_ESM" (uuid)
**Status:** ✅ FIXED
**Solution:** UUID downgraded to v9

---

## 📝 VERIFICATION COMMANDS

```bash
# Cek file models
ls -la src/models/ | grep -E "(wishlist|productReview)"

# Cek uuid version
npm list uuid

# Cek backend running
pm2 status

# Test API
curl http://localhost:4000
```

---

## 💡 TIPS

1. **Selalu `git pull` sebelum restart**
2. **Jalankan `npm install` jika ada perubahan package.json**
3. **Monitor logs** setelah restart
4. **Backup database** sebelum deploy besar

---

**Last Updated:** 2026-01-04
**Status:** ✅ All issues fixed, ready for deployment
