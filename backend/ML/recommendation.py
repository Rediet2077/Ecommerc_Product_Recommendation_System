import os
import joblib
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

_products_path = os.path.join(BASE_DIR, "ML", "products.pkl")
_vectors_path = os.path.join(BASE_DIR, "ML", "product_vectors.pkl")

try:
    products = joblib.load(_products_path)
    product_vectors = joblib.load(_vectors_path)
    _ml_available = True
except Exception as e:
    import warnings
    warnings.warn(f"ML models could not be loaded, recommendations disabled: {e}")
    products = None
    product_vectors = None
    _ml_available = False


def recommend_products(product_id, number=5):

    if not _ml_available:
        return []

    matches = products[
        products["id"] == product_id
    ]

    if matches.empty:
        return []

    product_index = matches.index[0]

    similarity_scores = cosine_similarity(
        product_vectors[product_index],
        product_vectors
    )[0]

    similar_products = sorted(
        enumerate(similarity_scores),
        key=lambda x: x[1],
        reverse=True
    )

    recommendations = []

    for index, score in similar_products[1:number+1]:

        product = products.iloc[index]

        recommendations.append({
            "id": int(product["id"]),
            "name": product["name"],
            "brand": product["brand"],
            "price": float(product["price"]),
            "similarity": round(float(score), 2)
        })

    return recommendations
