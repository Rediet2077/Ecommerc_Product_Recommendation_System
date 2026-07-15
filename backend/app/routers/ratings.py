from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Rating, Product
from ..schemas import RatingCreate, RatingOut
from ..auth import get_current_user

router = APIRouter(tags=["Ratings"])

@router.post("/ratings", response_model=RatingOut)
def create_rating(data: RatingCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    existing = db.query(Rating).filter(Rating.user_id == current_user.id, Rating.product_id == data.product_id).first()
    if existing:
        existing.rating = data.rating
        existing.review = data.review
        db.commit()
        db.refresh(existing)
        return existing
    rating = Rating(user_id=current_user.id, product_id=data.product_id, rating=data.rating, review=data.review)
    db.add(rating)
    db.commit()
    db.refresh(rating)
    return rating

@router.get("/ratings/{product_id}", response_model=List[RatingOut])
def get_ratings(product_id: int, db: Session = Depends(get_db)):
    return db.query(Rating).filter(Rating.product_id == product_id).order_by(Rating.created_at.desc()).all()
