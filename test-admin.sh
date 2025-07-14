#!/bin/bash

echo "=== Test Admin Login Script ==="
echo ""

# Test 1: Check if admin exists
echo "🔍 Checking if admin exists..."
curl -s -X GET "http://localhost:5000/api/auth/check-first-admin" \
  -H "Content-Type: application/json" | echo

echo ""
echo ""

# Test 2: Try admin login
echo "🔐 Testing admin login..."
curl -s -X POST "http://localhost:5000/api/auth/admin-login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "admin123"
  }' | echo

echo ""
echo ""

# Test 3: Health check
echo "💗 Health check..."
curl -s -X GET "http://localhost:5000/api/health-check" \
  -H "Content-Type: application/json" | echo

echo ""
echo ""
echo "=== Test completed ==="
