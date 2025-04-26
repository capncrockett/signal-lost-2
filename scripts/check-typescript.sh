#!/usr/bin/env bash
set -e

# Check TypeScript errors
echo "Checking for TypeScript errors..."
npx tsc --noEmit

# If we get here, there are no TypeScript errors
echo "✅ No TypeScript errors found!"
echo "Your code is ready for CI. 🚀"
