@echo off
title Friends Form - Local Server
echo.
echo ================================================
echo   Starting Friends Form...
echo ================================================
echo.

cd /d "%~dp0Backend"

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Start the server and open browser
start http://localhost:3000
node server.js
