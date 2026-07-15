$python = "C:\Users\Redi sha\AppData\Local\Programs\Python\Python313\python.exe"
Set-Location "$PSScriptRoot\backend"
& $python -m uvicorn app.main:app --reload --port 8000
