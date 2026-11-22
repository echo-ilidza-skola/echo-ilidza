@echo off
rem Pokreće aplikaciju ECHO Ilidža na ovom računaru i otvara je u pregledniku.
rem Prozor ostaviti otvorenim dok se aplikacija koristi; zatvaranjem prozora aplikacija se gasi.
chcp 65001 >nul
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js nije instaliran. Instalirajte ga s https://nodejs.org ^(verzija LTS^), pa pokrenite ponovo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Prvo pokretanje: instaliram potrebne pakete, to traje minutu-dvije...
  call npm install
)

echo.
echo Pokrećem ECHO Ilidža. Preglednik će se otvoriti sam.
echo Za gašenje zatvorite ovaj prozor ili pritisnite Ctrl+C.
echo.
call npm run dev -- --open
pause
