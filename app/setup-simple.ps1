# Supabase Setup Helper Script for Windows PowerShell

Write-Host "Trading Dashboard - Supabase Setup Helper" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host "WARNING: .env.local already exists!" -ForegroundColor Yellow
    Write-Host "Current contents:" -ForegroundColor Yellow
    Get-Content ".env.local"
    Write-Host ""
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit 1
    }
}

# Copy example file
if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env.local"
    Write-Host "Created .env.local from .env.example" -ForegroundColor Green
} else {
    Write-Host ".env.example not found. Creating basic template..." -ForegroundColor Red
    @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Go to: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Create a new project (if you haven't already)" -ForegroundColor White
Write-Host "3. Go to Settings > API" -ForegroundColor White
Write-Host "4. Copy the Project URL and anon key" -ForegroundColor White
Write-Host "5. Edit .env.local and replace the placeholder values" -ForegroundColor White
Write-Host ""

Write-Host "Your .env.local file location:" -ForegroundColor Cyan
Write-Host "$((Get-Location).Path)\.env.local" -ForegroundColor White
Write-Host ""

# Check if database schema exists
if (Test-Path "database\schema.sql") {
    Write-Host "Database schema found at: database\schema.sql" -ForegroundColor Green
    Write-Host "Don't forget to run this in your Supabase SQL Editor!" -ForegroundColor Yellow
} else {
    Write-Host "Database schema not found. Make sure to run the schema in Supabase." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "QUICK LINKS:" -ForegroundColor Cyan
Write-Host "- Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "- Project Documentation: README.md" -ForegroundColor White
Write-Host "- Detailed Setup Guide: SUPABASE_SETUP.md" -ForegroundColor White
Write-Host ""
Write-Host "Once configured, run: npm run dev" -ForegroundColor Green
Write-Host ""

# Ask if user wants to open .env.local for editing
$openFile = Read-Host "Do you want to open .env.local for editing now? (y/N)"
if ($openFile -eq "y" -or $openFile -eq "Y") {
    if (Get-Command "code" -ErrorAction SilentlyContinue) {
        code .env.local
        Write-Host "Opening .env.local in VS Code..." -ForegroundColor Green
    } elseif (Get-Command "notepad" -ErrorAction SilentlyContinue) {
        notepad .env.local
        Write-Host "Opening .env.local in Notepad..." -ForegroundColor Green
    } else {
        Write-Host "Please manually edit .env.local with your preferred editor." -ForegroundColor Yellow
    }
}
