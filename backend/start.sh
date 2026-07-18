#!/bin/bash
set -e

echo "=== Startup diagnostics ==="
echo "Python: $(python --version)"
echo "Working dir: $(pwd)"
echo "PYTHONPATH: $PYTHONPATH"
echo "DATABASE_URL: $DATABASE_URL"

echo ""
echo "=== Checking uvicorn ==="
which uvicorn || echo "uvicorn NOT found in PATH"
uvicorn --version || echo "uvicorn failed to run"

echo ""
echo "=== Checking Python imports ==="
python -c "import fastapi; print('fastapi ok:', fastapi.__version__)"
python -c "import uvicorn; print('uvicorn ok:', uvicorn.__version__)"
python -c "import sqlalchemy; print('sqlalchemy ok:', sqlalchemy.__version__)"
python -c "import sklearn; print('sklearn ok:', sklearn.__version__)"
python -c "import numpy; print('numpy ok:', numpy.__version__)"
python -c "import pandas; print('pandas ok')"

echo ""
echo "=== Checking app imports ==="
python -c "from app.main import app; print('app import ok')"

echo ""
echo "=== Starting uvicorn ==="
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
