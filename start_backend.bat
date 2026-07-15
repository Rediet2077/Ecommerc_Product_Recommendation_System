@echo off
cd /d "%~dp0backend"
echo Starting ShopEase Backend...
"C:\Users\Redi sha\AppData\Local\Programs\Python\Python313\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
