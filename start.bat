@echo off
title Tax Sathi App

echo 🏢 Tax Sathi - Complete Tax Management Solution
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm (comes with Node.js)
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo ✅ npm is installed
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

echo 🚀 Starting Tax Sathi App...
echo 📱 The app will open in your browser automatically
echo 🌐 If not, visit: http://localhost:5173
echo.
echo Features available:
echo   • Tax Calculator with AI insights
echo   • Dashboard with analytics
echo   • Client Management
echo   • ITR Filing tools
echo   • Compliance Calendar
echo   • Task Management
echo   • And much more...
echo.
echo 📝 Note: App is running in demo mode with sample data
echo 🔧 To stop the app, press Ctrl+C
echo.
echo Starting in 3 seconds...
timeout /t 3 /nobreak >nul

REM Start the development server
npm run dev

pause