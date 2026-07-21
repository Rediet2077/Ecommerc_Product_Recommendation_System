import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiHeart, FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import api from '../api/axios'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'
import ProductCard from '../components/ProductCard'
import { PageLoader } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <AiFillStar key={s} size={14} className={s <= Math.round(rating||0) ? 'text-amber-400' : 'text-gray-200'} />
      ))}
      {count !== undefined && <span className="text-sm text-gray-500 ml-1">({count} reviews)</span>}
    </div>
  )
}

function RatingInput({ onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [review, setReview] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) { toast.error('Please select a rating'); return }
    onSubmit({ rating, review })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 mt-4">
      <h4 className="font-semibold text-gray-900 mb-3">Write a Review</h4>
      <div className="flex gap-1 mb-3">
        {[1,2,3,4,5].map((s) => (
          <button key={s} type="button" onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
            <AiFillStar size={24} className={s <= (hover || rating) ? 'text-amber-400' : 'text-gray-300'} />
          </button>
        ))}
      </div>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Share your experience..." rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Submit Review</button>
    </form>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [product, setProduct] = useState(null)
  const [ratings, setRatings] = useState([])
  const [related, setRelated] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImg, setSelectedImg] = useState(0)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const [prodRes, ratingsRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/ratings/${id}`)
      ])
      setProduct(prodRes.data)
      setRatings(ratingsRes.data)
      if (prodRes.data.category_id) {
        const relRes = await api.get(`/products?category_id=${prodRes.data.category_id}&limit=5`)
        setRelated(relRes.data.items.filter((p) => p.id !== parseInt(id)).slice(0, 4))
      }
    } catch { navigate('/404') }
    setLoading(false)
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated()) { navigate('/login'); return }
    setAdding(true)
    await addToCart(product.id, quantity)
    setAdding(false)
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated()) { navigate('/login'); return }
    await addToCart(product.id, quantity)
    navigate('/cart')
  }

  const handleRating = async (data) => {
    if (!isAuthenticated()) { navigate('/login'); return }
    try {
      await api.post('/ratings', { product_id: parseInt(id), ...data })
      toast.success('Review submitted!')
      const res = await api.get(`/ratings/${id}`)
      setRatings(res.data)
      const prodRes = await api.get(`/products/${id}`)
      setProduct(prodRes.data)
    } catch { toast.error('Failed to submit review') }
  }

  if (loading) return <PageLoader />
  if (!product) return null

  const images = [product.image_url, product.image_url, product.image_url].filter(Boolean)
  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        {product.category && <><span>/</span><Link to={`/products?category_id=${product.category_id}`} className="hover:text-blue-600">{product.category.name}</Link></>}
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square mb-3 relative group">
            <img src={images[selectedImg] || ''} alt={product.name} className="w-full h-full object-contain p-4" onError={(e) => { e.target.src = `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}` }} />
            {discount && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>}
          </div>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImg ? 'border-blue-500' : 'border-gray-200'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://via.placeholder.com/80?text=Img` }} />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.brand && <p className="text-sm text-blue-600 font-semibold mb-1">{product.brand}</p>}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.avg_rating} count={product.rating_count} />
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">Birr {product.price?.toFixed(2)}</span>
            {product.original_price && <span className="text-lg text-gray-400 line-through">Birr {product.original_price?.toFixed(2)}</span>}
            {discount && <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Save {discount}%</span>}
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.description}</p>
          )}

          <div className="flex flex-wrap gap-2 text-xs mb-5">
            {['Noise Cancellation', 'Slim Battery Life', 'Bluetooth 5.2', 'Downloadable'].map((f) => (
              <span key={f} className="flex items-center gap-1 text-gray-600"><span className="text-blue-500">✓</span> {f}</span>
            ))}
          </div>

          {/* Color options */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-2">Color: <span className="font-normal text-gray-500">Black</span></p>
            <div className="flex gap-2">
              {['#1f2937', '#1e40af', '#991b1b'].map((c) => (
                <button key={c} className="w-7 h-7 rounded-full border-2 border-white ring-1 ring-gray-300 hover:ring-blue-500 transition-all" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold">−</button>
              <span className="px-4 py-2 text-sm font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold">+</button>
            </div>
            <span className="text-xs text-gray-400">{product.stock} in stock</span>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={adding} className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-60">
              <FiShoppingCart size={16} />
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      Reviews
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        {ratings.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">{r.user?.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.user?.name || 'User'}</p>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => <AiFillStar key={s} size={11} className={s<=r.rating?'text-amber-400':'text-gray-200'} />)}</div>
                  </div>
                </div>
                {r.review && <p className="text-sm text-gray-600">{r.review}</p>}
              </div>
            ))}
          </div>
        )}
        {isAuthenticated() && <RatingInput onSubmit={handleRating} />}
      </div>

      {/* Recommended Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
