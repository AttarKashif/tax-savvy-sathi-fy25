#!/bin/bash

# Tax Sathi App Startup Script
# This script helps you get the Tax Sathi app up and running quickly

echo "🏢 Tax Sathi - Complete Tax Management Solution"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm (comes with Node.js)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting Tax Sathi App..."
echo "📱 The app will open in your browser automatically"
echo "🌐 If not, visit: http://localhost:5173"
echo ""
echo "Features available:"
echo "  • Tax Calculator with AI insights"
echo "  • Dashboard with analytics"
echo "  • Client Management"
echo "  • ITR Filing tools"
echo "  • Compliance Calendar"
echo "  • Task Management"
echo "  • And much more..."
echo ""
echo "📝 Note: App is running in demo mode with sample data"
echo "🔧 To stop the app, press Ctrl+C"
echo ""
echo "Starting in 3 seconds..."
sleep 3

# Start the development server
npm run dev