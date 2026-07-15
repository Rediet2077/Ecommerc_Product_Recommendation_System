from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

# Auth
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    is_admin: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Category
class CategoryBase(BaseModel):
    name: str

class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# Product
class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    stock: int = 0
    category_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None
    category_id: Optional[int] = None

class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    category: Optional[CategoryOut] = None
    avg_rating: Optional[float] = None
    rating_count: Optional[int] = None

# Cart
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    quantity: int
    product: ProductOut

# Order
class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductOut] = None

class OrderCreate(BaseModel):
    shipping_address: Optional[str] = None

class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    order_date: datetime
    total_price: float
    status: str
    shipping_address: Optional[str] = None
    items: List[OrderItemOut] = []

# Rating
class RatingCreate(BaseModel):
    product_id: int
    rating: float
    review: Optional[str] = None

class RatingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    product_id: int
    rating: float
    review: Optional[str] = None
    created_at: datetime
    user: Optional[UserOut] = None

# Admin stats
class AdminStats(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: float
