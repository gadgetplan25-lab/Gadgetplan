# 🏗️ FRONTEND BUILD GUIDE (VPS)

## 🚀 BUILD COMMAND

### **Opsi 1: Build dengan Backend Running** (Recommended)

```bash
# 1. Pastikan backend running
pm2 status backend-api

# 2. Build frontend
cd ~/gadgetplan/Gadgetplan/frontend
npm run build
```

---

### **Opsi 2: Build tanpa Backend** (Skip API Fetch)

```bash
cd ~/gadgetplan/Gadgetplan/frontend
SKIP_API_FETCH=true npm run build
```

**Kapan pakai ini?**
- Backend belum jalan
- API tidak bisa diakses saat build
- Build di CI/CD tanpa backend

---

## ⚙️ ENVIRONMENT VARIABLES

### **File: `.env` atau `.env.production`**

```env
# API URL (harus bisa diakses saat build jika tidak pakai SKIP_API_FETCH)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Atau pakai domain
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 🔧 BUILD PROCESS

### **What Happens During Build:**

1. ✅ Next.js compiles pages
2. ✅ Fetches data from API (homepage products)
3. ✅ Generates static pages
4. ✅ Optimizes images
5. ✅ Minifies JavaScript/CSS

### **Build Output:**

```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB          95 kB
├ ○ /api/health                          0 B             0 B
├ ○ /products                            8.1 kB         102 kB
└ ○ /dashboard                           12 kB          110 kB

○  (Static)  prerendered as static content
```

---

## 🚨 TROUBLESHOOTING

### **Error: "Failed to fetch products"**

**Penyebab:**
- Backend tidak running
- API URL salah
- Network timeout

**Solusi:**

```bash
# 1. Cek backend running
pm2 status

# 2. Test API
curl http://localhost:4000/api/health

# 3. Build dengan skip API
SKIP_API_FETCH=true npm run build
```

---

### **Error: "ECONNREFUSED"**

**Penyebab:**
- Backend tidak bisa diakses dari build process

**Solusi:**

```bash
# Pastikan backend running di port yang benar
pm2 logs backend-api

# Atau skip API fetch
SKIP_API_FETCH=true npm run build
```

---

### **Error: "Module not found: lucide-react"**

**Penyebab:**
- Dependencies tidak terinstall

**Solusi:**

```bash
rm -rf node_modules .next
npm install
npm run build
```

---

## 📋 BUILD CHECKLIST

- [ ] Backend running (atau pakai SKIP_API_FETCH)
- [ ] `.env` file configured
- [ ] `node_modules` installed
- [ ] No TypeScript errors
- [ ] No ESLint errors

---

## 🎯 PRODUCTION BUILD STEPS

### **Full Deployment:**

```bash
# 1. Pull latest code
cd ~/gadgetplan/Gadgetplan/frontend
git pull origin main

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Start with PM2
pm2 start npm --name frontend -- start
pm2 save
```

---

### **Or use ecosystem.config.js:**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/gadgetplan/gadgetplan/Gadgetplan/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    }
  ]
}
```

```bash
pm2 start ecosystem.config.js
```

---

## 🔄 UPDATE DEPLOYMENT

```bash
# 1. Stop frontend
pm2 stop frontend

# 2. Pull & build
cd ~/gadgetplan/Gadgetplan/frontend
git pull origin main
npm install
npm run build

# 3. Restart
pm2 restart frontend
pm2 logs frontend --lines 50
```

---

## 💡 TIPS

### **1. Faster Builds:**

```bash
# Use turbo
npm run build -- --turbo

# Skip type checking (faster but risky)
npm run build -- --no-lint
```

### **2. Build Cache:**

```bash
# Clear cache if build fails
rm -rf .next
npm run build
```

### **3. Analyze Bundle:**

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze
ANALYZE=true npm run build
```

---

## 📊 BUILD OPTIMIZATION

### **Current Optimizations:**

1. ✅ Turbopack (faster builds)
2. ✅ Image optimization (WebP/AVIF)
3. ✅ CSS optimization
4. ✅ Tree shaking
5. ✅ Code splitting
6. ✅ Minification

### **Build Time:**

- **Development:** ~10-15 seconds
- **Production:** ~30-60 seconds
- **Full rebuild:** ~2-3 minutes

---

## ✅ VERIFICATION

```bash
# Check build output
ls -lh .next/

# Check static pages
ls -lh .next/server/app/

# Test locally
npm start
curl http://localhost:3000
```

---

**Build process optimized for VPS deployment!** 🎉
