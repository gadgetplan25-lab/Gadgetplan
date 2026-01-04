# Database Migration Script
# Automatically migrate database for GadgetPlan project

Write-Host "🗄️  DATABASE MIGRATION SCRIPT" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Configuration
$DB_NAME = "toko_online"
$DB_USER = "root"
$SQL_FILES = @(
    "..\db_gadgedPlan.sql",
    "add-blog-tables.sql",
    "create-wishlists-table.sql",
    "create-new-tables.sql",
    "database-indexes.sql"
)

# Ask for MySQL password
$DB_PASSWORD = Read-Host "Enter MySQL password for user '$DB_USER'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host "`n📋 Step 1: Checking MySQL connection..." -ForegroundColor Yellow

# Test MySQL connection
$testQuery = "SELECT VERSION();"
$testCmd = "mysql -u $DB_USER -p$PlainPassword -e `"$testQuery`" 2>&1"
$testResult = Invoke-Expression $testCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Cannot connect to MySQL!" -ForegroundColor Red
    Write-Host "   Please check:" -ForegroundColor Red
    Write-Host "   1. MySQL server is running" -ForegroundColor Red
    Write-Host "   2. Username and password are correct" -ForegroundColor Red
    exit 1
}

Write-Host "✅ MySQL connection successful!" -ForegroundColor Green
Write-Host "   Version: $testResult`n" -ForegroundColor Gray

# Create database
Write-Host "📋 Step 2: Creating database '$DB_NAME'..." -ForegroundColor Yellow

$createDbQuery = "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$createCmd = "mysql -u $DB_USER -p$PlainPassword -e `"$createDbQuery`" 2>&1"
Invoke-Expression $createCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database '$DB_NAME' created successfully!`n" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Database might already exist (this is OK)`n" -ForegroundColor Yellow
}

# Import SQL files
Write-Host "📋 Step 3: Importing SQL files..." -ForegroundColor Yellow

$successCount = 0
$failCount = 0

foreach ($sqlFile in $SQL_FILES) {
    if (Test-Path $sqlFile) {
        Write-Host "   Importing: $sqlFile" -ForegroundColor Cyan
        
        $importCmd = "mysql -u $DB_USER -p$PlainPassword $DB_NAME < `"$sqlFile`" 2>&1"
        $importResult = Invoke-Expression $importCmd
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Success!" -ForegroundColor Green
            $successCount++
        }
        else {
            Write-Host "   ⚠️  Warning: $importResult" -ForegroundColor Yellow
            $failCount++
        }
    }
    else {
        Write-Host "   ⚠️  File not found: $sqlFile (skipping)" -ForegroundColor Yellow
    }
}

Write-Host "`n📊 Import Summary:" -ForegroundColor Cyan
Write-Host "   Success: $successCount files" -ForegroundColor Green
Write-Host "   Failed/Skipped: $failCount files`n" -ForegroundColor Yellow

# Verify tables
Write-Host "📋 Step 4: Verifying database tables..." -ForegroundColor Yellow

$showTablesQuery = "SHOW TABLES;"
$showTablesCmd = "mysql -u $DB_USER -p$PlainPassword $DB_NAME -e `"$showTablesQuery`" 2>&1"
$tables = Invoke-Expression $showTablesCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database tables:" -ForegroundColor Green
    Write-Host $tables -ForegroundColor Gray
}
else {
    Write-Host "❌ Error verifying tables!" -ForegroundColor Red
}

# Count records
Write-Host "`n📋 Step 5: Counting records..." -ForegroundColor Yellow

$countQuery = @"
SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM products) as products,
    (SELECT COUNT(*) FROM categories) as categories,
    (SELECT COUNT(*) FROM orders) as orders;
"@

$countCmd = "mysql -u $DB_USER -p$PlainPassword $DB_NAME -e `"$countQuery`" 2>&1"
$counts = Invoke-Expression $countCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Record counts:" -ForegroundColor Green
    Write-Host $counts -ForegroundColor Gray
}

# Final message
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✅ MIGRATION COMPLETED!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Update backend/.env with database credentials" -ForegroundColor White
Write-Host "   2. Run: cd backend && npm run dev" -ForegroundColor White
Write-Host "   3. Test backend connection`n" -ForegroundColor White

Write-Host "🔑 Default admin account:" -ForegroundColor Yellow
Write-Host "   Email: admin@gadgetplan.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host "   ⚠️  Change password after first login!`n" -ForegroundColor Red

# Clear password from memory
$PlainPassword = $null
[System.GC]::Collect()
