from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Cart, Product
from ..schemas import CartItemCreate, CartItemOut
from ..auth import get_current_user

router = APIRouter(tags=["Cart"])

@router.get("/cart", response_model=List[CartItemOut])
def get_cart(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Cart).filter(Cart.user_id == current_user.id).all()

@router.post("/cart", response_model=CartItemOut)
def add_to_cart(data: CartItemCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    existing = db.query(Cart).filter(Cart.user_id == current_user.id, Cart.product_id == data.product_id).first()
    if existing:
        existing.quantity += data.quantity
        db.commit()
        db.refresh(existing)
        return existing
    item = Cart(user_id=current_user.id, product_id=data.product_id, quantity=data.quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/cart/{item_id}", response_model=CartItemOut)
def update_cart_item(item_id: int, quantity: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = db.query(Cart).filter(Cart.id == item_id, Cart.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if quantity <= 0:
        db.delete(item)
        db.commit()
        raise HTTPException(status_code=200, detail="Item removed")
    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return item

@router.delete("/cart/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = db.query(Cart).filter(Cart.id == item_id, Cart.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}

@router.delete("/cart")
def clear_cart(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db.query(Cart).filter(Cart.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
