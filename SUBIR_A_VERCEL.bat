@echo off
setlocal enabledelayedexpansion
title Subir Evaluandonos a GitHub / Vercel

echo ======================================================
echo           SUBIENDO EVALUANDONOS A GITHUB
echo ======================================================
echo.

cd /d "C:\Users\ANDRESAN\Desktop\Evaluandonos"

echo 1. Preparando archivos modificados...
git add index.html src/ style.css sw.js manifest.json package.json vercel.json .gitignore

echo 2. Guardando cambios (commit)...
set "FECHA=%date% %time%"
git commit -m "Actualizacion Evaluandonos - %FECHA%" >nul 2>&1
if %errorlevel% neq 0 (
    echo    (No hay cambios locales pendientes, procediendo a enviar...)
) else (
    echo    Cambios guardados localmente.
)

echo.
echo 3. Enviando a GitHub (Vercel desplegara automaticamente)...
git push origin main
if %errorlevel% neq 0 (
    echo    Intentando en upstream...
    git push upstream main
) else (
    git push upstream main >nul 2>&1
)

echo.
echo ======================================================
echo  LISTO: Cambios enviados a GitHub con exito!
echo  Vercel se actualizara en la nube en unos segundos.
echo ======================================================
echo.
pause
