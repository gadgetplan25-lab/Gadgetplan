# 🏥 HEALTH CHECK API DOCUMENTATION

## 📋 ENDPOINTS

### **1. Health Check** (Public)

**Endpoint:** `GET /api/health`

**Description:** Check backend health status and database connection

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-04T09:30:00.000Z",
  "uptime": 3600.5,
  "environment": "production",
  "database": {
    "status": "connected",
    "host": "localhost",
    "name": "toko_online"
  },
  "server": {
    "nodeVersion": "v18.19.1",
    "platform": "linux",
    "memory": {
      "total": "50 MB",
      "used": "35 MB"
    }
  }
}
```

**Test:**
```bash
# Local
curl http://localhost:4000/api/health

# VPS
curl https://api.yourdomain.com/api/health

# With jq (pretty print)
curl http://localhost:4000/api/health | jq
```

---

### **2. Ping** (Public)

**Endpoint:** `GET /api/ping`

**Description:** Simple ping endpoint for quick availability check

**Response:**
```json
{
  "message": "pong",
  "timestamp": "2026-01-04T09:30:00.000Z"
}
```

**Test:**
```bash
curl http://localhost:4000/api/ping
```

---

### **3. System Info** (Admin Only)

**Endpoint:** `GET /api/system`

**Description:** Detailed system information (requires admin authentication)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-04T09:30:00.000Z",
  "server": {
    "nodeVersion": "v18.19.1",
    "platform": "linux",
    "arch": "x64",
    "uptime": "3600 seconds",
    "pid": 12345
  },
  "database": {
    "type": "MySQL",
    "version": "8.0.35",
    "host": "localhost",
    "name": "toko_online"
  },
  "memory": {
    "rss": "120 MB",
    "heapTotal": "50 MB",
    "heapUsed": "35 MB",
    "external": "2 MB"
  },
  "environment": {
    "nodeEnv": "production",
    "port": "4000"
  }
}
```

**Test:**
```bash
# Get admin token first
TOKEN=$(curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gadgetplan.com","password":"admin123"}' \
  | jq -r '.token')

# Call system info
curl http://localhost:4000/api/system \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🧪 TESTING SCENARIOS

### **Scenario 1: Basic Health Check**

```bash
# Test if backend is running
curl -f http://localhost:4000/api/health || echo "Backend is down!"
```

**Expected:** Status 200, JSON response

---

### **Scenario 2: Database Connection Test**

```bash
# Check database status
curl http://localhost:4000/api/health | jq '.database.status'
```

**Expected:** `"connected"`

---

### **Scenario 3: Uptime Monitoring**

```bash
# Check how long server has been running
curl http://localhost:4000/api/health | jq '.uptime'
```

**Expected:** Number in seconds

---

### **Scenario 4: Memory Usage**

```bash
# Check memory usage
curl http://localhost:4000/api/health | jq '.server.memory'
```

**Expected:**
```json
{
  "total": "50 MB",
  "used": "35 MB"
}
```

---

## 🔧 INTEGRATION WITH MONITORING TOOLS

### **1. PM2 Ecosystem**

Add to `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'backend-api',
    script: 'src/index.js',
    health_check: {
      url: 'http://localhost:4000/api/health',
      interval: 30000, // 30 seconds
      timeout: 5000,
    }
  }]
}
```

---

### **2. Uptime Kuma**

1. Add new monitor
2. Monitor Type: HTTP(s)
3. URL: `https://api.yourdomain.com/api/health`
4. Heartbeat Interval: 60 seconds
5. Accepted Status Codes: 200

---

### **3. Cron Job Health Check**

```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:4000/api/health || echo "Backend down!" | mail -s "Backend Alert" admin@yourdomain.com
```

---

### **4. Docker Health Check**

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1
```

---

## 📊 RESPONSE STATUS CODES

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| **200** | OK | Backend healthy, database connected |
| **503** | Service Unavailable | Backend running but database disconnected |
| **500** | Internal Server Error | Unexpected error |
| **401** | Unauthorized | Admin endpoint without valid token |

---

## 🚨 ERROR RESPONSES

### **Database Disconnected:**

```json
{
  "status": "unhealthy",
  "timestamp": "2026-01-04T09:30:00.000Z",
  "error": "Connection refused",
  "database": {
    "status": "disconnected"
  }
}
```

**Status Code:** 503

---

## 💡 USE CASES

### **1. Deployment Verification**

```bash
# After deployment, check if backend is healthy
curl -f https://api.yourdomain.com/api/health && echo "✅ Deployment successful!"
```

### **2. Load Balancer Health Check**

Configure load balancer to check `/api/health` endpoint

### **3. CI/CD Pipeline**

```yaml
# .github/workflows/deploy.yml
- name: Health Check
  run: |
    sleep 10
    curl -f https://api.yourdomain.com/api/health
```

### **4. Monitoring Dashboard**

Display uptime, memory usage, and database status in real-time

---

## 🔍 TROUBLESHOOTING

### **Health check returns 503:**

```bash
# Check database connection
mysql -u root -p -e "SHOW DATABASES;"

# Check backend logs
pm2 logs backend-api
```

### **Health check timeout:**

```bash
# Check if backend is running
pm2 status

# Check port
sudo lsof -i :4000
```

---

## 📝 QUICK REFERENCE

```bash
# Health check
curl http://localhost:4000/api/health

# Ping
curl http://localhost:4000/api/ping

# System info (admin)
curl http://localhost:4000/api/system \
  -H "Authorization: Bearer <token>"

# Pretty print
curl http://localhost:4000/api/health | jq

# Check status only
curl -s http://localhost:4000/api/health | jq -r '.status'

# Check database status
curl -s http://localhost:4000/api/health | jq -r '.database.status'
```

---

**Endpoints ready for testing and monitoring!** 🎉
