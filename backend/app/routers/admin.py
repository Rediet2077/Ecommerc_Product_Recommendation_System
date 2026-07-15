from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import User, Product, Order
from ..schemas import AdminStats
from ..auth import get_current_admin

router = APIRouter(tags=["Admin"])

@router.get("/admin/stats", response_model=AdminStats)
def get_stats(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    total_users = db.query(func.count(User.id)).scalar()
    total_products = db.query(func.count(Product.id)).scalar()
    total_orders = db.query(func.count(Order.id)).scalar()
    total_revenue = db.query(func.sum(Order.total_price)).scalar() or 0
    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue
    }

@router.get("/admin/users")
def get_all_users(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(User).all()
