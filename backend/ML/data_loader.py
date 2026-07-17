import sys
import os

# Add backend folder to Python path
sys.path.append(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

import pandas as pd

from app.database import SessionLocal
from app.models import Product


def load_products():

    db = SessionLocal()

    products = db.query(Product).all()

    data = []

    for product in products:

        data.append({
            "id": product.id,
            "name": product.name,
            "brand": product.brand or "",
            "category": (
                product.category.name
                if product.category
                else ""
            ),
            "description": product.description or "",
            "price": product.price
        })

    db.close()

    return pd.DataFrame(data)


if __name__ == "__main__":

    df = load_products()

    print(df.head())

    print("\nTotal products:", len(df))