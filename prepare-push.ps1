# ========================================
# Script Persiapan Push ke Repository Baru
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PERSIAPAN PUSH KE REPOSITORY BARU" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fungsi untuk menampilkan progress
function Show-Step {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Show-Warning {
    param([string]$Message)
    Write-Host "[!!] $Message" -ForegroundColor Yellow
}

function Show-Error {
    param([string]$Message)
    Write-Host "[XX] $Message" -ForegroundColor Red
}

# 1. Cek file .env
Write-Host "1. Memeriksa file sensitif..." -ForegroundColor Cyan

if (Test-Path "backend\.env") {
    Show-Warning "File backend\.env ditemukan (akan diabaikan oleh .gitignore)"
}
else {
    Show-Step "File backend\.env tidak ditemukan (aman)"
}

if (Test-Path "frontend\.env") {
    Show-Warning "File frontend\.env ditemukan (akan diabaikan oleh .gitignore)"
}
else {
    Show-Step "File frontend\.env tidak ditemukan (aman)"
}

# 2. Hapus node_modules
Write-Host ""
Write-Host "2. Membersihkan node_modules..." -ForegroundColor Cyan

if (Test-Path "backend\node_modules") {
    Show-Step "Menghapus backend\node_modules..."
    Remove-Item -Path "backend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Show-Step "Backend node_modules dihapus"
}
else {
    Show-Step "Backend node_modules sudah bersih"
}

if (Test-Path "frontend\node_modules") {
    Show-Step "Menghapus frontend\node_modules..."
    Remove-Item -Path "frontend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Show-Step "Frontend node_modules dihapus"
}
else {
    Show-Step "Frontend node_modules sudah bersih"
}

# 3. Hapus build files
Write-Host ""
Write-Host "3. Membersihkan build files..." -ForegroundColor Cyan

if (Test-Path "frontend\.next") {
    Show-Step "Menghapus frontend\.next..."
    Remove-Item -Path "frontend\.next" -Recurse -Force -ErrorAction SilentlyContinue
    Show-Step "Frontend .next dihapus"
}
else {
    Show-Step "Frontend .next sudah bersih"
}

if (Test-Path "backend\build") {
    Show-Step "Menghapus backend\build..."
    Remove-Item -Path "backend\build" -Recurse -Force -ErrorAction SilentlyContinue
    Show-Step "Backend build dihapus"
}
else {
    Show-Step "Backend build sudah bersih"
}

# 4. Hapus log files
Write-Host ""
Write-Host "4. Membersihkan log files..." -ForegroundColor Cyan

$logFiles = Get-ChildItem -Path . -Filter "*.log" -Recurse -ErrorAction SilentlyContinue
if ($logFiles.Count -gt 0) {
    foreach ($log in $logFiles) {
        Show-Step "Menghapus $($log.Name)..."
        Remove-Item -Path $log.FullName -Force -ErrorAction SilentlyContinue
    }
}
else {
    Show-Step "Tidak ada log files"
}

# 5. Hapus .git lama
Write-Host ""
Write-Host "5. Membersihkan Git history lama..." -ForegroundColor Cyan

$response = Read-Host "Apakah Anda ingin menghapus Git history lama? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    if (Test-Path ".git") {
        Show-Step "Menghapus .git di root..."
        Remove-Item -Path ".git" -Recurse -Force -ErrorAction SilentlyContinue
        Show-Step "Root .git dihapus"
    }
    
    if (Test-Path "frontend\.git") {
        Show-Step "Menghapus frontend\.git..."
        Remove-Item -Path "frontend\.git" -Recurse -Force -ErrorAction SilentlyContinue
        Show-Step "Frontend .git dihapus"
    }
    
    Show-Step "Git history lama berhasil dihapus!"
}
else {
    Show-Warning "Git history lama dipertahankan"
}

# 6. Verifikasi file penting
Write-Host ""
Write-Host "6. Memverifikasi file penting..." -ForegroundColor Cyan

$requiredFiles = @(
    ".gitignore",
    "README.md",
    "LICENSE",
    "PUSH_CHECKLIST.md",
    "backend\.env.example",
    "frontend\.env.example"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Show-Step "$file ada"
    }
    else {
        Show-Error "$file tidak ditemukan!"
    }
}

# 7. Tampilkan ukuran project
Write-Host ""
Write-Host "7. Informasi Project..." -ForegroundColor Cyan

try {
    $totalSize = (Get-ChildItem -Path . -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Ukuran total: $([math]::Round($totalSize, 2)) MB" -ForegroundColor White
    
    $fileCount = (Get-ChildItem -Path . -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
    Write-Host "   Jumlah file: $fileCount" -ForegroundColor White
}
catch {
    Show-Warning "Tidak dapat menghitung ukuran project"
}

# 8. Instruksi selanjutnya
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CLEANUP SELESAI!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Buat repository baru di GitHub" -ForegroundColor White
Write-Host "2. Jalankan perintah berikut:" -ForegroundColor White
Write-Host ""
Write-Host "   git init" -ForegroundColor Cyan
Write-Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m 'Initial commit: GadgetPlan E-Commerce Platform'" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/Anggamy0011/ecommerce.git" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Lihat PUSH_CHECKLIST.md untuk detail lengkap" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
