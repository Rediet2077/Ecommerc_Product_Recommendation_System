from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .seed import seed_database

from .routers import (
    auth,
    products,
    categories,
    cart,
    orders,
    ratings,
    admin,
    recommendations
)


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ShopEase API",
    version="1.0.0"
)


# CORS configuration
# Read allowed origins from env so production URLs can be injected without code changes
import os

_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
_extra_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

_default_origins = [
    "http://localhost:5173",   # Vite dev server
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://localhost:80",
    "http://localhost",
    # Vercel deployments
    "https://ecommerc-product-recommendation-sys.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_default_origins + _extra_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(ratings.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")


# Run database seed when server starts
@app.on_event("startup")
def startup_event():
    seed_database()


@app.get("/")
def root():
    return {
        "message": "ShopEase API is running",
        "docs": "/docs"
    }