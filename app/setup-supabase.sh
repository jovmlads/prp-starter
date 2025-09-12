#!/bin/bash

# Supabase Setup Helper Script
# This script helps you set up the environment file for your Next.js app

echo "🚀 Trading Dashboard - Supabase Setup Helper"
echo "=============================================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    echo "   Current contents:"
    cat .env.local
    echo ""
    read -p "   Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   Setup cancelled."
        exit 1
    fi
fi

# Copy example file
if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
else
    echo "❌ .env.example not found. Creating basic template..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EOF
fi

echo ""
echo "📝 Now you need to update .env.local with your Supabase credentials:"
echo ""
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Create a new project (if you haven't already)"
echo "3. Go to Settings > API"
echo "4. Copy the Project URL and anon key"
echo "5. Edit .env.local and replace the placeholder values"
echo ""
echo "📋 Your .env.local file is ready to edit:"
echo "   $(pwd)/.env.local"
echo ""

# Check if database schema exists
if [ -f "database/schema.sql" ]; then
    echo "📊 Database schema found at: database/schema.sql"
    echo "   Don't forget to run this in your Supabase SQL Editor!"
else
    echo "⚠️  Database schema not found. Make sure to run the schema in Supabase."
fi

echo ""
echo "🔗 Quick Links:"
echo "   Supabase Dashboard: https://supabase.com/dashboard"
echo "   Project Documentation: README.md"
echo "   Detailed Setup Guide: SUPABASE_SETUP.md"
echo ""
echo "⚡ Once configured, run: npm run dev"
echo ""
