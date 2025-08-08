#!/bin/bash

# Test script to demonstrate username replacement
echo "🎭 Testing Username Replacement System"
echo "====================================="

# Simulate a GitHub username
TEST_USERNAME="divyarajsparrowgenie"

echo "Original README with placeholders:"
echo "----------------------------------"
grep -n "{{USERNAME}}" README.md | head -3

echo ""
echo "Replacing {{USERNAME}} with $TEST_USERNAME..."
echo ""

# Create a test copy
cp README.md README_test.md

# Replace username placeholders (macOS compatible)
sed -i '' "s/{{USERNAME}}/$TEST_USERNAME/g" README_test.md

echo "Updated README with actual username:"
echo "------------------------------------"
grep -n "$TEST_USERNAME" README_test.md | head -3

echo ""
echo "🎪 Test completed! The GitHub Actions will do this automatically when triggered."
echo "To trigger the workflow:"
echo "1. Star your repository"
echo "2. Fork your repository" 
echo "3. Watch your repository"
echo "4. Or manually trigger from GitHub Actions tab" 