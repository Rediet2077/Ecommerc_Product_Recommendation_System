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

# Install runtime system libraries required by numpy/scikit-learn (libgomp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY app/ ./app/
COPY ML/ ./ML/
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose FastAPI port
EXPOSE 8000

# Environment defaults (can be overridden via Render dashboard or docker-compose)
ENV DATABASE_URL="sqlite:///./ecommerce.db" \
    SECRET_KEY="change-me-in-production" \
    ALGORITHM="HS256" \
    ACCESS_TOKEN_EXPIRE_MINUTES="10080" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Use diagnostic start script so failures are visible in logs
CMD ["bash", "./start.sh"]
