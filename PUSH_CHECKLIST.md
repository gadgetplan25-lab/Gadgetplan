# 📋 Checklist Push ke Repository Baru

## ✅ Persiapan File

### 1. File Konfigurasi Git
- [x] `.gitignore` - Sudah dibuat di root project
- [x] `.env.example` - Backend (sudah ada)
- [x] `.env.example` - Frontend (sudah dibuat)
- [x] `README.md` - Dokumentasi lengkap (sudah dibuat)
- [x] `LICENSE` - MIT License (sudah dibuat)
- [x] `.gitkeep` - Untuk folder uploads (sudah dibuat)

### 2. File yang HARUS Dihapus/Diabaikan
- [ ] **PENTING**: Pastikan `.env` TIDAK ter-push (sudah ada di .gitignore)
- [ ] **PENTING**: Pastikan `node_modules/` TIDAK ter-push (sudah ada di .gitignore)
- [ ] Hapus folder `.git` lama jika ada di subfolder

## 🔐 Keamanan

### 1. Periksa File Sensitif
- [ ] Cek file `.env` backend - pastikan tidak ter-commit
- [ ] Cek file `.env` frontend - pastikan tidak ter-commit
- [ ] Cek kredensial database di file SQL
- [ ] Cek API keys (Xendit, Fonnte, RajaOngkir, Gemini)
- [ ] Cek JWT secrets

### 2. Bersihkan Data Sensitif dari Database Export
- [ ] Buka `db_gadgedPlan.sql`
- [ ] Hapus/anonymize data user real (email, password, phone)
- [ ] Hapus data order real jika ada
- [ ] Ganti dengan sample data atau kosongkan

### 3. Ganti Kredensial Default
- [ ] Update `.env.example` dengan placeholder yang jelas
- [ ] Pastikan tidak ada hardcoded secrets di kode

## 📦 Cleanup Project

### 1. Hapus File Tidak Perlu
```bash
# Hapus node_modules (akan di-ignore)
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Hapus build files
rm -rf frontend/.next
rm -rf backend/build

# Hapus log files
rm -rf *.log
```

### 2. Hapus Git History Lama (Opsional)
Jika ingin mulai fresh tanpa history lama:
```bash
# Di root project
rm -rf .git
rm -rf frontend/.git
```

## 🚀 Inisialisasi Git Baru

### 1. Buat Repository di GitHub
- [ ] Login ke GitHub
- [ ] Klik "New Repository"
- [ ] Nama: `ecommerce` atau `gadgetplan-ecommerce`
- [ ] Deskripsi: "Modern E-Commerce Platform for Apple Products"
- [ ] **JANGAN** centang "Initialize with README" (kita sudah punya)
- [ ] Pilih Public atau Private
- [ ] Klik "Create Repository"

### 2. Inisialisasi Git Lokal
```bash
# Di root project (c:\Kerja\project ecommerce\project ecommerce)
git init
git add .
git commit -m "Initial commit: GadgetPlan E-Commerce Platform

Features:
- Frontend: Next.js 15 with responsive design
- Backend: Express.js with MySQL
- Payment: Xendit integration
- WhatsApp Bot: AI-powered with Gemini
- Admin Panel: Full dashboard with analytics
- User Features: Cart, Wishlist, Order tracking
- Service Booking: Repair, consultation, trade-in
"
```

### 3. Connect ke Remote Repository
```bash
# Ganti dengan URL repository Anda
git remote add origin https://github.com/yourusername/ecommerce.git

# Atau menggunakan SSH
git remote add origin git@github.com:yourusername/ecommerce.git
```

### 4. Push ke GitHub
```bash
# Push ke main branch
git branch -M main
git push -u origin main
```

## 📝 Dokumentasi Tambahan

### 1. Update README.md
- [ ] Ganti URL repository di README
- [ ] Update contact information
- [ ] Update screenshot (jika ada)
- [ ] Update demo URL (jika ada)

### 2. Buat File Tambahan (Opsional)
- [ ] `CONTRIBUTING.md` - Panduan kontribusi
- [ ] `CHANGELOG.md` - Log perubahan versi
- [ ] `.github/ISSUE_TEMPLATE/` - Template issue
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` - Template PR

## 🔍 Verifikasi Sebelum Push

### 1. Cek Status Git
```bash
git status
```
Pastikan tidak ada file sensitif yang akan di-commit.

### 2. Cek File yang Akan Di-Push
```bash
git ls-files
```
Review daftar file yang akan di-push.

### 3. Test .gitignore
```bash
# Pastikan file ini TIDAK muncul di git status
cat .gitignore
git status --ignored
```

### 4. Cek Ukuran Repository
```bash
# Pastikan tidak ada file besar yang tidak perlu
git count-objects -vH
```

## 🎯 Setelah Push

### 1. Setup GitHub Repository
- [ ] Tambahkan deskripsi repository
- [ ] Tambahkan topics/tags: `ecommerce`, `nextjs`, `express`, `mysql`, `xendit`
- [ ] Setup GitHub Pages (jika perlu)
- [ ] Enable Issues
- [ ] Enable Discussions (opsional)

### 2. Setup Branch Protection (Opsional)
- [ ] Protect main branch
- [ ] Require pull request reviews
- [ ] Require status checks

### 3. Setup Secrets (untuk CI/CD)
Jika menggunakan GitHub Actions:
- [ ] Add `DB_PASSWORD` ke Secrets
- [ ] Add `JWT_SECRET` ke Secrets
- [ ] Add `XENDIT_SECRET_KEY` ke Secrets
- [ ] Add API keys lainnya

### 4. Clone & Test
```bash
# Clone repository baru di lokasi lain untuk test
cd /tmp
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce

# Test instalasi
cd backend && npm install
cd ../frontend && npm install

# Copy .env dari .env.example
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env dengan kredensial Anda
# Lalu test jalankan
```

## ⚠️ PERINGATAN PENTING

### ❌ JANGAN PUSH:
1. File `.env` (backend dan frontend)
2. Folder `node_modules/`
3. Folder `.next/` atau `build/`
4. File dengan kredensial real
5. Database dengan data user real
6. API keys atau secrets
7. File log dengan informasi sensitif

### ✅ HARUS PUSH:
1. Source code (`.js`, `.jsx`, `.css`)
2. File konfigurasi (`.json`, `.config.js`)
3. File `.env.example` (template)
4. Database schema (SQL tanpa data sensitif)
5. README.md dan dokumentasi
6. Public assets (images, icons)

## 📊 Checklist Final

- [ ] Semua file sensitif sudah di-ignore
- [ ] README.md sudah lengkap dan akurat
- [ ] .env.example sudah dibuat untuk backend & frontend
- [ ] Database export sudah dibersihkan dari data sensitif
- [ ] Git history sudah bersih (atau di-reset)
- [ ] Repository GitHub sudah dibuat
- [ ] Git remote sudah di-setup
- [ ] Sudah test push ke repository
- [ ] Clone repository baru dan test instalasi
- [ ] Dokumentasi sudah update dengan URL repository baru

## 🎉 Selesai!

Setelah semua checklist di atas selesai, repository Anda siap untuk:
- Dibagikan ke tim
- Di-deploy ke production
- Dikembangkan lebih lanjut
- Dipublikasikan sebagai portfolio

---

**Catatan**: Jika ada pertanyaan atau masalah, jangan ragu untuk bertanya!
