@echo off
echo ====================================
echo    Portfolio Website - VS Code
echo ====================================
echo.

echo Checking if .env file exists...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and fill in DATABASE_URL
    echo.
    pause
    exit /b 1
)

echo Starting portfolio website...
echo Open browser: http://localhost:5000
echo Admin panel: http://localhost:5000/admin
echo.
echo Press Ctrl+C to stop server
echo.

npm run dev
pause
