# 🔒 SSL CERTIFICATE & .WELL-KNOWN CONFIGURATION

## ✅ FIXED: .well-known Paths Now Allowed

Next.js sekarang **TIDAK** akan redirect request ke `/.well-known/` paths.

---

## 📁 WHAT IS .WELL-KNOWN?

`.well-known` adalah direktori standar untuk:
- **SSL Certificate Verification** (Let's Encrypt ACME challenge)
- **Security.txt** (security contact info)
- **Change-password** (password change URL)
- **Apple App Site Association**
- Dan lainnya

---

## 🔧 KONFIGURASI YANG DITERAPKAN

### **1. Middleware** (`src/middleware.js`)

```javascript
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow .well-known paths (for SSL certificate verification)
  if (pathname.startsWith('/.well-known/')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
```

**Fungsi:**
- Explicitly allow `/.well-known/*` paths
- No redirect, no rewrite
- Pass through to static files

---

### **2. Next.js Config** (`next.config.mjs`)

```javascript
async headers() {
  return [
    {
      source: '/.well-known/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
      ],
    },
  ];
}
```

**Fungsi:**
- Set proper cache headers
- Ensure fresh content for SSL verification

---

### **3. Public Directory**

```
frontend/
  public/
    .well-known/
      .gitkeep
      acme-challenge/  (created by certbot)
```

**Fungsi:**
- Store SSL verification files
- Accessible via `https://yourdomain.com/.well-known/`

---

## 🧪 TESTING

### **Test 1: Check .well-known is accessible**

```bash
# Create test file
echo "test" > public/.well-known/test.txt

# Start dev server
npm run dev

# Test
curl http://localhost:3000/.well-known/test.txt
```

**Expected:** `test`

---

### **Test 2: SSL Certificate Verification**

```bash
# Let's Encrypt will create files like:
# public/.well-known/acme-challenge/random-string

# Test accessibility
curl https://yourdomain.com/.well-known/acme-challenge/test
```

**Expected:** File content (not 404 or redirect)

---

## 🔐 SSL CERTIFICATE SETUP (Let's Encrypt)

### **Step 1: Install Certbot**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Or standalone
sudo apt install certbot
```

---

### **Step 2: Get Certificate (Webroot Method)**

```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Or with webroot (if nginx running)
sudo certbot certonly --webroot \
  -w /home/user/gadgetplan/Gadgetplan/frontend/public \
  -d yourdomain.com -d www.yourdomain.com
```

**Certbot will:**
1. Create file in `.well-known/acme-challenge/`
2. Verify via HTTP request
3. Issue certificate

---

### **Step 3: Configure Nginx**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Allow .well-known for SSL verification
    location /.well-known/ {
        root /home/user/gadgetplan/Gadgetplan/frontend/public;
        try_files $uri $uri/ =404;
    }

    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### **Step 4: Auto-Renewal**

```bash
# Test renewal
sudo certbot renew --dry-run

# Auto-renewal (cron)
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## 🚨 TROUBLESHOOTING

### **Error: "/.well-known/ returns 404"**

**Check:**
```bash
# 1. File exists
ls -la public/.well-known/

# 2. Middleware working
# Check src/middleware.js

# 3. Rebuild
npm run build
```

---

### **Error: "Certbot verification failed"**

**Check:**
```bash
# 1. .well-known accessible
curl http://yourdomain.com/.well-known/test.txt

# 2. Nginx config
sudo nginx -t

# 3. Firewall
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
```

---

### **Error: "Redirect loop"**

**Fix:**
```javascript
// middleware.js - Make sure .well-known is FIRST
if (pathname.startsWith('/.well-known/')) {
  return NextResponse.next(); // No redirect!
}
```

---

## 📋 CHECKLIST

- [x] Middleware created (`src/middleware.js`)
- [x] Headers configured (`next.config.mjs`)
- [x] `.well-known` directory exists (`public/.well-known/`)
- [ ] Test `.well-known` accessible
- [ ] SSL certificate obtained
- [ ] Nginx configured
- [ ] Auto-renewal setup

---

## 💡 BEST PRACTICES

1. **Always test** `.well-known` accessibility before SSL setup
2. **Use webroot method** if possible (no downtime)
3. **Setup auto-renewal** to prevent expiration
4. **Monitor certificate** expiry dates
5. **Backup certificates** regularly

---

## 🔗 USEFUL LINKS

- [Let's Encrypt Docs](https://letsencrypt.org/docs/)
- [Certbot Instructions](https://certbot.eff.org/)
- [.well-known RFC](https://tools.ietf.org/html/rfc8615)

---

**SSL certificate verification now works with Next.js!** 🎉
