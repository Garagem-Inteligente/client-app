#!/bin/bash

# Test Firebase Storage Configuration
# This script verifies that Firebase Storage is properly configured

echo "🔍 Testing Firebase Storage Configuration..."
echo ""

# Check if .env has storage bucket
echo "1️⃣ Checking .env configuration..."
if grep -q "VITE_FIREBASE_STORAGE_BUCKET" .env; then
  BUCKET=$(grep "VITE_FIREBASE_STORAGE_BUCKET" .env | cut -d '=' -f2)
  echo "   ✅ Storage bucket configured: $BUCKET"
else
  echo "   ❌ VITE_FIREBASE_STORAGE_BUCKET not found in .env"
  exit 1
fi

echo ""

# Check Firebase SDK config
echo "2️⃣ Checking Firebase SDK configuration..."
firebase apps:sdkconfig web | grep -q "storageBucket"
if [ $? -eq 0 ]; then
  echo "   ✅ Storage bucket in Firebase config"
else
  echo "   ❌ Storage bucket not in Firebase config"
  exit 1
fi

echo ""

# Try to deploy storage rules
echo "3️⃣ Testing Storage rules deployment..."
firebase deploy --only storage 2>&1 | tee /tmp/storage-test.log

if grep -q "Deploy complete" /tmp/storage-test.log; then
  echo "   ✅ Storage rules deployed successfully!"
  echo ""
  echo "🎉 Firebase Storage is configured correctly!"
  exit 0
elif grep -q "has not been set up" /tmp/storage-test.log; then
  echo "   ⚠️  Storage not initialized in Firebase Console"
  echo ""
  echo "📋 Next steps:"
  echo "   1. Go to: https://console.firebase.google.com/project/autocare-platform/storage"
  echo "   2. Click 'Get Started' or 'Começar'"
  echo "   3. Choose location: southamerica-east1 (São Paulo)"
  echo "   4. Run this script again"
  exit 1
else
  echo "   ❌ Unknown error occurred"
  cat /tmp/storage-test.log
  exit 1
fi
