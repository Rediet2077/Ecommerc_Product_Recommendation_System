from fastapi import APIRouter, HTTPException

from ML.recommendation import recommend_products


router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"]
)


@router.get("/{product_id}")
def get_recommendations(product_id: int):

    try:

        recommendations = recommend_products(
            product_id
        )

        return recommendations

    except Exception:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )