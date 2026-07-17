# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies into a dedicated prefix
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY app/ ./app/

# Persistent volume mount-point for the SQLite database file
VOLUME ["/app/data"]

# Expose FastAPI port
EXPOSE 8000

# Environment defaults (can be overridden via docker-compose or env file)
ENV DATABASE_URL="sqlite:////app/data/ecommerce.db" \
    SECRET_KEY="change-me-in-production" \
    ALGORITHM="HS256" \
    ACCESS_TOKEN_EXPIRE_MINUTES="10080" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
