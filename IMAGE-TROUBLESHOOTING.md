# 🖼️ IMAGE LOADING TROUBLESHOOTING

## 🔍 DIAGNOSIS

Gambar tidak muncul bisa disebabkan oleh:

1. ❌ **Path gambar salah**
2. ❌ **CORS blocked**
3. ❌ **File tidak ada di server**
4. ❌ **Nginx tidak serve static files**

---

## 🧪 TESTING

### **Test 1: Cek Response API**

```bash
curl http://localhost:8080/api/user/products | jq '.[0].ProductImages'
```

**Expected:**
```json
[
  {
    "id": 1,
    "image_url": "iphone-13-pro-max.jpg"
  }
]
```

---

### **Test 2: Cek File Exists**

```bash
# Check if file exists
ls -la backend/public/products/

# Should show image files
```

---

### **Test 3: Akses Gambar Langsung**

**Browser:**
```
http://localhost:8080/public/products/iphone-13-pro-max.jpg
```

**Expected:** Gambar muncul

**If 404:** File tidak ada atau path salah

---

## 🔧 FIX: Serve Static Files

### **Backend: `src/index.js`**

Pastikan ada ini:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use('/public', express.static(path.join(__dirname, '../public')));
```

---

## 🔧 FIX: CORS Headers

### **Backend: `src/index.js`**

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://gadgetplan.id',
    'https://www.gadgetplan.id'
  ],
  credentials: true
}));
```

---

## 🔧 FIX: Nginx Configuration (Production)

```nginx
server {
    listen 443 ssl http2;
    server_name api.gadgetplan.id;

    # Serve static files
    location /public/ {
        alias /home/user/gadgetplan/Gadgetplan/backend/public/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
    }

    # Proxy API requests
    location / {
        proxy_pass http://localhost:8080;
        # ... other proxy settings
    }
}
```

---

## 🔧 FIX: Frontend Image Component

### **Use Next.js Image with unoptimized**

```javascript
<Image
  src={getProductImageUrl(product.ProductImages[0].image_url)}
  alt={product.name}
  fill
  unoptimized // Add this for external images
  className="object-contain"
/>
```

---

## 🔧 FIX: next.config.mjs

```javascript
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/public/**',
            },
            {
                protocol: 'https',
                hostname: 'api.gadgetplan.id',
                pathname: '/public/**',
            },
        ],
    },
};
```

---

## 📋 CHECKLIST

- [ ] Backend serve static files (`app.use('/public', ...)`)
- [ ] CORS configured properly
- [ ] Files exist in `backend/public/products/`
- [ ] Can access image directly via browser
- [ ] Next.js image config allows remote patterns
- [ ] Frontend uses correct `getProductImageUrl()`

---

## 💡 QUICK FIX

**If images still not loading, add `unoptimized` prop:**

```javascript
<Image
  src={getProductImageUrl(product.ProductImages[0].image_url)}
  alt={product.name}
  fill
  unoptimized
  className="object-contain"
/>
```

This bypasses Next.js image optimization and loads images directly.

---

**Test sekarang!** 🚀
