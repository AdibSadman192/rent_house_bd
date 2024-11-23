Write-Host "🔄 Stopping any running Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "🧹 Cleaning node_modules..." -ForegroundColor Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🚀 Starting development server..." -ForegroundColor Green
npm run dev
