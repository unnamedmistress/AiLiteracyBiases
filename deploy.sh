#!/bin/bash

# GitHub Repository Setup Script
# Run this after creating the repository on GitHub

echo "========================================"
echo "GitHub Repository Push Script"
echo "========================================"
echo ""
echo "1. First, open your browser and go to:"
echo "   https://github.com/new"
echo ""
echo "2. Fill in the form:"
echo "   - Repository name: AIlteracyBias"
echo "   - Description: 🤖💥 Interactive AI Literacy Game - Learn to spot AI's bad habits before they trick you!"
echo "   - Public (selected)"
echo "   - DO NOT check 'Add a README file'"
echo "   - Click 'Create repository'"
echo ""
echo "3. After creating the repo, GitHub will show you a URL like:"
echo "   https://github.com/YOUR_USERNAME/AIlteracyBias.git"
echo ""
read -p "Press Enter after you've created the repository on GitHub..."
echo ""
read -p "Enter your GitHub username: " username
echo ""

# Add remote
git remote add origin "https://github.com/$username/AIlteracyBias.git"

# Push to GitHub
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "========================================"
echo "✅ Repository pushed successfully!"
echo "========================================"
echo ""
echo "🚀 Next: Enable GitHub Pages for deployment"
echo ""
echo "1. Go to: https://github.com/$username/AIlteracyBias/settings/pages"
echo "2. Under 'Source', select:"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "3. Click 'Save'"
echo ""
echo "Your site will be live at:"
echo "https://$username.github.io/AIlteracyBias/"
echo ""
echo "It may take 1-2 minutes to deploy."
echo "========================================"
