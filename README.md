# ShopEase - E-commerce Product Recommendation System

## Stack
- **Frontend**: React + Vite + Tailwind CSS + Zustand
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Auth**: JWT Tokens

## Quick Start

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:8000  
API Docs: http://localhost:8000/docs

## Demo Accounts
| Role  | Email                   | Password    |
|-------|-------------------------|-------------|
| Admin | admin@shopease.com      | admin123    |
| User  | john@example.com        | pass1234    |

## Pages
- `/` - Home with hero banner, categories, featured products
- `/products` - All products with filters and sorting
- `/products/:id` - Product detail with reviews and ratings
- `/categories` - Browse all categories
- `/search?q=...` - Search results
- `/cart` - Shopping cart
- `/checkout` - Multi-step checkout
- `/orders` - Order history
- `/profile` - User profile
- `/admin` - Admin dashboard (admin only)
- `/login` - Login
- `/register` - Register

## API Endpoints
- `POST /api/register` - Register
- `POST /api/login` - Login
- `GET /api/products` - List products (search, filter, sort, paginate)
- `GET /api/products/:id` - Product detail
- `POST /api/products` - Create product (admin)
- `GET /api/categories` - Categories
- `GET/POST/DELETE /api/cart` - Cart management
- `GET/POST /api/orders` - Orders
- `GET/POST /api/ratings/:id` - Ratings
- `GET /api/admin/stats` - Admin stats
