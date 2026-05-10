@echo off
title TUI-Store - React 3D Pencatatan Keuangan
cd /d "%~dp0"

echo ========================================
echo       TUI-STORE - PENCATATAN KEUANGAN
echo        Vite + React + Three.js
echo ========================================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan!
    echo Download: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detected
echo.
echo Menginstall dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Gagal install dependencies
    pause
    exit /b 1
)

echo.
echo Menjalankan server...
echo.
start "" http://localhost:5173
call npm run dev

pause
