# Comprehensive Dead Code Removal Script

Write-Host ""
Write-Host "🧹 CLEANING DEAD CODE..." -ForegroundColor Cyan

$rootPath = "c:\Kerja\project ecommerce\project ecommerce\frontend"

# File 1: categorie/page.js - Remove lines 1-227
$file1 = Join-Path $rootPath "src\app\dashboard\categorie\page.js"
if (Test-Path $file1) {
    Write-Host ""
    Write-Host "Processing: categorie/page.js" -ForegroundColor Yellow
    $lines = Get-Content $file1
    $newLines = $lines | Select-Object -Skip 227
    $newContent = $newLines -join "`r`n"
    Set-Content -Path $file1 -Value $newContent -NoNewline
    Write-Host "  ✓ Removed 227 lines of dead code" -ForegroundColor Green
}

# File 2: ProductForm.js - Remove lines 1-156
$file2 = Join-Path $rootPath "src\app\dashboard\product\ProductForm.js"
if (Test-Path $file2) {
    Write-Host ""
    Write-Host "Processing: ProductForm.js" -ForegroundColor Yellow
    $lines = Get-Content $file2
    $newLines = $lines | Select-Object -Skip 156
    $newContent = $newLines -join "`r`n"
    Set-Content -Path $file2 -Value $newContent -NoNewline
    Write-Host "  ✓ Removed 156 lines of dead code" -ForegroundColor Green
}

# File 3: ProductCard.js - Remove commented console.error
$file3 = Join-Path $rootPath "src\app\dashboard\product\ProductCard.js"
if (Test-Path $file3) {
    Write-Host ""
    Write-Host "Processing: ProductCard.js" -ForegroundColor Yellow
    $content = Get-Content $file3 -Raw
    $newContent = $content -replace '(?m)^\s*//\s*console\.error.*$', ''
    Set-Content -Path $file3 -Value $newContent -NoNewline
    Write-Host "  ✓ Removed commented console.error" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ CLEANUP COMPLETE!" -ForegroundColor Cyan
Write-Host ""
