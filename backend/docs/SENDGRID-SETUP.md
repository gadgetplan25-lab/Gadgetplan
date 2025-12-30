# SendGrid Setup Guide (Optional Fallback Email Service)

## Overview
SendGrid digunakan sebagai fallback email service jika Gmail SMTP gagal.

## Setup Instructions

### 1. Create SendGrid Account
1. Sign up di https://sendgrid.com/free
2. Verifikasi email domain Anda
3. Complete sender authentication

### 2. Get API Key
1. Login ke SendGrid Dashboard
2. Go to Settings → API Keys
3. Create API Key dengan permissions:
   - Mail Send: Full Access
4. Copy API Key

### 3. Configure .env
Tambahkan ke file `.env`:
```env
# SendGrid Configuration (Optional - Fallback Email Service)
SENDGRID_API_KEY=SG.xxxxxx.xxxxxx.xxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### 4. Test Configuration
```bash
node test-email.js
```

## How It Works
1. **Primary**: Gmail SMTP (dengan retry mechanism)
2. **Fallback**: SendGrid API (jika Gmail gagal)

## Benefits
- ✅ Higher email deliverability
- ✅ Automatic fallback if Gmail fails
- ✅ Better tracking dengan SendGrid dashboard
- ✅ Email template management

## Production Recommendations
- Selalu konfigurasi SendGrid sebagai backup
- Gunakan verified domain di SendGrid
- Monitor email delivery rates di dashboard

## Troubleshooting
- API Key tidak valid: Generate baru dari dashboard
- Domain tidak verified: Complete domain verification
- From email tidak authorized: Tambahkan ke Sender Identity