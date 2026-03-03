#!/bin/bash
# Run this script in Terminal to push the project to GitHub.
# Usage: cd /Users/tuna/ebay-mod-tool-germany && bash push-to-github.sh

set -e
cd "$(dirname "$0")"

# Remove partial .git if present (from failed init)
rm -rf .git

# Create repo and push
git init
git add .
git commit -m "Initial commit: eBay Community Moderation Tool Deutschland"
git remote add origin https://github.com/ign-tunayilmaz/eBayDE.git
git branch -M main
git push -u origin main

echo "Done! Your code is at https://github.com/ign-tunayilmaz/eBayDE"
