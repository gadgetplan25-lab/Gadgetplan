# ⚠️ PENTING! INSTRUKSI VPS DEPLOYMENT

## 🚨 ERROR YANG MUNCUL:

```
Error [ERR_REQUIRE_ESM]: require() of ES Module uuid
```

## ✅ SOLUSI:

Package `uuid` sudah di-downgrade dari v13 ke v9 di GitHub.
**TAPI** di VPS masih pakai versi lama!

---

## 🔧 LANGKAH PERBAIKAN DI VPS:

### **STEP 1: Hapus node_modules Lama**

```bash
cd ~/gadgetplan/Gadgetplan/backend
rm -rf node_modules
rm package-lock.json
```

### **STEP 2: Pull Latest Code**

```bash
git pull origin main
```

### **STEP 3: Install Dependencies Fresh**

```bash
npm install
```

**PENTING:** Ini akan install uuid v9, bukan v13!

### **STEP 4: Verify UUID Version**

```bash
npm list uuid
```

**Expected output:**
```
backend@1.0.0
└── uuid@9.0.1
```

### **STEP 5: Restart Backend**

```bash
pm2 restart backend-api
```

### **STEP 6: Cek Logs**

```bash
pm2 logs backend-api --lines 50
```

**Expected output:**
```
✅ Database connection successful
🚀 Server running on port 4000
```

---

## 📋 FULL COMMAND (Copy-Paste Ini):

```bash
cd ~/gadgetplan/Gadgetplan/backend && \
rm -rf node_modules && \
rm package-lock.json && \
git pull origin main && \
npm install && \
npm list uuid && \
pm2 restart backend-api && \
pm2 logs backend-api --lines 50
```

---

## ✅ VERIFICATION:

Setelah restart, backend harus:
- ✅ Tidak ada error "ERR_REQUIRE_ESM"
- ✅ Database connected
- ✅ Server running
- ✅ UUID version 9.0.1

---

## 🚨 JIKA MASIH ERROR:

### **Cek UUID Version:**
```bash
npm list uuid
```

Jika masih v13, hapus cache npm:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Cek package.json:**
```bash
cat package.json | grep uuid
```

Harus: `"uuid": "^9.0.1"`

---

## 💡 PENJELASAN:

**Kenapa error?**
- UUID v13 adalah ES Module (pakai `import`)
- Kode kita pakai CommonJS (pakai `require`)
- Node.js v18 tidak bisa `require()` ES Module

**Solusi:**
- Downgrade ke UUID v9 (support CommonJS)
- Atau ubah semua kode ke ES Module (ribet)

**Pilihan:** Downgrade UUID v9 ✅

---

**JALANKAN COMMAND DI ATAS DI VPS SEKARANG!** 🚀
