# 🌐 SUBDOMAIN SETUP GUIDE

## 📋 ARSITEKTUR

```
Frontend: https://gadgetplan.id (Vercel)
Backend:  https://api.gadgetplan.id (VPS)
```

**TIDAK PAKAI PORT di URL!**
- ❌ `https://gadgetplan.id:4000`
- ✅ `https://api.gadgetplan.id`

---

## 🔧 SETUP SUBDOMAIN (VPS)

### **Step 1: DNS Configuration**

Login ke DNS provider (Cloudflare/Namecheap/etc):

```
Type: A Record
Name: api
Value: <VPS_IP_ADDRESS>
TTL: Auto
```

**Contoh:**
```
api.gadgetplan.id → 103.175.219.41
```

**Test DNS:**
```bash
ping api.gadgetplan.id
nslookup api.gadgetplan.id
```

---

### **Step 2: Nginx Configuration**

**File:** `/etc/nginx/sites-available/backend`

```nginx
# HTTP (redirect to HTTPS)
server {
    listen 80;
    server_name api.gadgetplan.id;

    # Allow .well-known for SSL verification
    location /.well-known/ {
        root /var/www/html;
        try_files $uri $uri/ =404;
    }

    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name api.gadgetplan.id;

    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.gadgetplan.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.gadgetplan.id/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy to Backend (port 8080)
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Cache
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint (no auth)
    location /api/health {
        proxy_pass http://localhost:8080/api/health;
        access_log off;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### **Step 3: SSL Certificate (Let's Encrypt)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.gadgetplan.id

# Test auto-renewal
sudo certbot renew --dry-run
```

**Auto-renewal (cron):**
```bash
sudo crontab -e

# Add:
0 0 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

### **Step 4: Backend Configuration**

**File:** `backend/.env`

```env
# Server
PORT=8080
NODE_ENV=production

# Frontend URL (Vercel)
FRONTEND_URL=https://gadgetplan.id

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=toko_online

# ... other env vars
```

**Start backend:**
```bash
cd ~/gadgetplan/Gadgetplan/backend
pm2 start src/index.js --name backend-api
pm2 save
```

---

### **Step 5: Frontend Configuration (Vercel)**

**Environment Variables di Vercel:**

```
NEXT_PUBLIC_API_URL=https://api.gadgetplan.id
```

**Deploy:**
```bash
git push origin main
# Vercel auto-deploy
```

---

## 🧪 TESTING

### **Test 1: DNS Resolution**

```bash
ping api.gadgetplan.id
# Should return VPS IP
```

---

### **Test 2: SSL Certificate**

```bash
curl -I https://api.gadgetplan.id/api/health
# Should return 200 OK with HTTPS
```

---

### **Test 3: API Endpoint**

```bash
# Health check
curl https://api.gadgetplan.id/api/health

# Expected:
{
  "status": "healthy",
  "database": {
    "status": "connected"
  }
}
```

---

### **Test 4: Frontend to Backend**

```bash
# From browser console (gadgetplan.id)
fetch('https://api.gadgetplan.id/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 🔒 CORS CONFIGURATION

**Backend:** `src/index.js`

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://gadgetplan.id',
    'https://www.gadgetplan.id',
    'http://localhost:3000', // Development
  ],
  credentials: true,
}));
```

---

## 🚨 TROUBLESHOOTING

### **Error: "DNS not resolving"**

```bash
# Check DNS propagation
nslookup api.gadgetplan.id

# Wait 5-10 minutes for DNS propagation
```

---

### **Error: "502 Bad Gateway"**

```bash
# Check backend running
pm2 status

# Check port
sudo lsof -i :8080

# Check logs
pm2 logs backend-api
```

---

### **Error: "SSL certificate error"**

```bash
# Check certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew

# Reload nginx
sudo systemctl reload nginx
```

---

### **Error: "CORS blocked"**

**Check:**
1. CORS origin includes `https://gadgetplan.id`
2. Credentials enabled
3. Headers allowed

**Fix:**
```javascript
app.use(cors({
  origin: 'https://gadgetplan.id',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 📋 CHECKLIST

- [ ] DNS A record created (`api.gadgetplan.id`)
- [ ] DNS propagated (test with `ping`)
- [ ] Nginx configured
- [ ] SSL certificate obtained
- [ ] Backend running on port 8080
- [ ] Frontend env var updated (`NEXT_PUBLIC_API_URL`)
- [ ] CORS configured
- [ ] Test API endpoint
- [ ] Test frontend to backend connection

---

## 💡 BEST PRACTICES

1. **Always use HTTPS** in production
2. **No port in URL** - use subdomain
3. **Enable CORS** properly
4. **Monitor SSL expiry** (auto-renewal)
5. **Use PM2** for backend process management
6. **Setup health check** monitoring

---

## 🔗 URL STRUCTURE

```
Frontend:
  - https://gadgetplan.id
  - https://www.gadgetplan.id

Backend API:
  - https://api.gadgetplan.id/api/health
  - https://api.gadgetplan.id/api/auth/login
  - https://api.gadgetplan.id/api/user/products
```

**NO PORT NUMBERS IN PRODUCTION!** ✅

---

**Subdomain setup complete!** 🎉
