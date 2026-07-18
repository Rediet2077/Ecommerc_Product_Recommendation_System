#!/bin/bash
set -e

echo "=== Startup diagnostics ==="
echo "Python: $(python --version)"
echo "Working dir: $(pwd)"
echo "PYTHONPATH: $PYTHONPATH"
echo "DATABASE_URL: $DATABASE_URL"
echo "PORT: $PORT"
echo "PATH: $PATH"

echo ""
echo "=== Checking uvicorn ==="
which uvicorn && echo "uvicorn found at: $(which uvicorn)" || echo "uvicorn NOT found in PATH"
python -m uvicorn --version && echo "python -m uvicorn works" || echo "python -m uvicorn FAILED"

echo ""
echo "=== Checking Python imports ==="
python -c "import fastapi; print('fastapi ok:', fastapi.__version__)" || echo "fastapi FAILED"
python -c "import uvicorn; print('uvicorn ok:', uvicorn.__version__)" || echo "uvicorn FAILED"
python -c "import sqlalchemy; print('sqlalchemy ok:', sqlalchemy.__version__)" || echo "sqlalchemy FAILED"
python -c "import sklearn; print('sklearn ok:', sklearn.__version__)" || echo "sklearn FAILED"
python -c "import numpy; print('numpy ok:', numpy.__version__)" || echo "numpy FAILED"
python -c "import pandas; print('pandas ok')" || echo "pandas FAILED"

echo ""
echo "=== Checking app imports ==="
python -c "from app.main import app; print('app import ok')" || echo "app import FAILED"

echo ""
echo "=== Starting uvicorn via python -m ==="
exec python -m uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
