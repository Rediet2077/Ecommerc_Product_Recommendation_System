import React from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <AiFillStar key={s} size={11} className={s <= Math.round(rating || 0) ? 'text-amber-400' : 'text-gray-200'} />
      ))}
      {count !== undefined && <span className="text-xs text-gray-400 ml-0.5">({count})</span>}
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    await addToCart(product.id)
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <Link to={`/products/${product.id}`} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image_url || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}` }}
        />
        {discount && discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <FiHeart size={13} className="text-gray-400 hover:text-red-500" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs text-blue-600 font-medium mb-0.5">{product.brand}</p>
        )}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug flex-1">{product.name}</h3>

        <div className="mt-1.5 mb-2">
          <StarRating rating={product.avg_rating} count={product.rating_count} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-gray-900">Birr {product.price?.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">Birr {product.original_price?.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <FiShoppingCart size={13} />
          </button>
        </div>
      </div>
    </Link>
  )
}

export { StarRating }
