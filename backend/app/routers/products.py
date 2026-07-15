from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional, List
from ..database import get_db
from ..models import Product, Rating, Category
from ..schemas import ProductCreate, ProductUpdate, ProductOut
from ..auth import get_current_admin, get_optional_user

router = APIRouter(tags=["Products"])

def enrich_product(product: Product, db: Session) -> dict:
    avg = db.query(func.avg(Rating.rating)).filter(Rating.product_id == product.id).scalar()
    count = db.query(func.count(Rating.id)).filter(Rating.product_id == product.id).scalar()
    d = {c.name: getattr(product, c.name) for c in product.__table__.columns}
    d["category"] = {"id": product.category.id, "name": product.category.name} if product.category else None
    d["avg_rating"] = round(avg, 1) if avg else None
    d["rating_count"] = count or 0
    return d

@router.get("/products", response_model=dict)
def get_products(
    skip: int = 0,
    limit: int = 12,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    min_rating: Optional[float] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Product)
    if search:
        q = q.filter(or_(Product.name.ilike(f"%{search}%"), Product.brand.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%")))
    if category_id:
        q = q.filter(Product.category_id == category_id)
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)

    total = q.count()

    if sort_by == "price":
        q = q.order_by(Product.price.desc() if order == "desc" else Product.price.asc())
    elif sort_by == "name":
        q = q.order_by(Product.name.desc() if order == "desc" else Product.name.asc())
    else:
        q = q.order_by(Product.created_at.desc())

    products = q.offset(skip).limit(limit).all()
    items = [enrich_product(p, db) for p in products]
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.get("/products/{product_id}", response_model=dict)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return enrich_product(product, db)

@router.post("/products", response_model=ProductOut)
def create_product(data: ProductCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}
