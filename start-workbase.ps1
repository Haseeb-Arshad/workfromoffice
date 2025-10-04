# WorkBase Startup Script
# This script starts both the backend and frontend servers

Write-Host "🚀 Starting WorkBase Application..." -ForegroundColor Green
Write-Host ""

# Check if backend dependencies are installed
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Check if frontend dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🖥️  Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\Current Projects\office work\workfromoffice\backend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\Current Projects\office work\workfromoffice'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ WorkBase is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "🖥️  Frontend App: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   • Wait for both servers to fully start (30-60 seconds)" -ForegroundColor Gray
Write-Host "   • Open http://localhost:3000 in your browser" -ForegroundColor Gray
Write-Host "   • Click the AI Assistant icon to test the integration" -ForegroundColor Gray
Write-Host "   • Check the terminal windows for any errors" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Configuration:" -ForegroundColor Yellow
Write-Host "   • Add OpenAI API key to backend/.env for AI features" -ForegroundColor Gray
Write-Host "   • Add Google Calendar credentials for calendar integration" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")