import os
import joblib
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)


products = joblib.load(
    os.path.join(BASE_DIR, "ML", "products.pkl")
)

product_vectors = joblib.load(
    os.path.join(BASE_DIR, "ML", "product_vectors.pkl")
)



def recommend_products(product_id, number=5):

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