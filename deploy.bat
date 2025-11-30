@echo off
echo ========================================
echo GitHub Repository Setup
echo ========================================
echo.
echo Opening GitHub in your browser...
start https://github.com/new
echo.
echo ========================================
echo INSTRUCTIONS:
echo ========================================
echo 1. In the browser that just opened, fill in:
echo    - Repository name: AIlteracyBias
echo    - Description: Interactive AI Literacy Game
echo    - Select: Public
echo    - DO NOT check "Add a README file"
echo    - Click "Create repository"
echo.
echo 2. After creating, return here and press any key...
pause
echo.
set /p username="Enter your GitHub username: "
echo.
echo Adding remote and pushing to GitHub...
git remote add origin https://github.com/%username%/AIlteracyBias.git
git branch -M main
git push -u origin main
echo.
echo ========================================
echo Repository pushed successfully!
echo ========================================
echo.
echo Now opening GitHub Pages settings...
start https://github.com/%username%/AIlteracyBias/settings/pages
echo.
echo ========================================
echo FINAL STEP - Enable GitHub Pages:
echo ========================================
echo 1. In the browser, under "Source":
echo    - Branch: main
echo    - Folder: / (root)
echo 2. Click "Save"
echo.
echo Your site will be live at:
echo https://%username%.github.io/AIlteracyBias/
echo.
echo (Takes 1-2 minutes to deploy)
echo ========================================
pause
