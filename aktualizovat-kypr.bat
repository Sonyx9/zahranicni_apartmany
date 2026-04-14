@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Stahuji nemovitosti z feedu Kypru...
node scripts\fetch-featured-property.mjs
if %ERRORLEVEL% equ 0 (
  echo.
  echo Hotovo. Soubor src\data\featured-property.json byl aktualizován.
) else (
  echo.
  echo Chyba při stahování. Zkontrolujte připojení k internetu a zda je nainstalovaný Node.js.
)
pause
