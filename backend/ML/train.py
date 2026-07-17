import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

from data_loader import load_products


# Load products
products = load_products()


# Create product text feature
products["product_text"] = (
    products["name"].fillna("") + " " +
    products["brand"].fillna("") + " " +
    products["category"].fillna("") + " " +
    products["description"].fillna("")
)


print(products[[
    "name",
    "product_text"
]].head())


# Create TF-IDF model
vectorizer = TfidfVectorizer(
    stop_words="english"
)


product_vectors = vectorizer.fit_transform(
    products["product_text"]
)


print("\nVector shape:")
print(product_vectors.shape)


# Save model files

joblib.dump(
    vectorizer,
    "ML/vectorizer.pkl"
)

joblib.dump(
    product_vectors,
    "ML/product_vectors.pkl"
)

joblib.dump(
    products,
    "ML/products.pkl"
)


print("\nTraining completed!")