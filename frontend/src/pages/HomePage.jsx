import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiArrowRight, FiTruck, FiShield, FiStar, FiCreditCard } from 'react-icons/fi'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

const categoryIcons = {
  Electronics: '💻', Fashion: '👗', Home: '🏠', Beauty: '💄',
  Sports: '⚽', Books: '📚', Toys: '🧸', More: '📦',
}

const heroBanners = [
  { id: 1, gradient: 'from-slate-900 via-blue-950 to-slate-800', title: 'Discover Best Products For You', sub: 'Find amazing products with the best prices', btn: 'Shop Now', link: '/products', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80' },
  { id: 2, gradient: 'from-purple-900 via-purple-800 to-indigo-900', title: 'New Arrivals Every Week', sub: 'Stay ahead with the latest trends', btn: 'Explore', link: '/products', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [bannerIdx, setBannerIdx] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=8&sort_by=created_at'),
          api.get('/categories')
        ])
        setProducts(prodRes.data.items || [])
        setCategories(catRes.data || [])
      } catch {}
      setLoading(false)
    }
    fetchData()
    const interval = setInterval(() => setBannerIdx((i) => (i + 1) % heroBanners.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  const banner = heroBanners[bannerIdx]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className={`bg-gradient-to-r ${banner.gradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">{banner.title}</h1>
              <p className="text-blue-200 text-sm mb-6">{banner.sub}</p>
              <form onSubmit={handleSearch} className="flex gap-2 max-w-md mb-6">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  Search
                </button>
              </form>
              <Link to={banner.link} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
                {banner.btn} <FiArrowRight />
              </Link>
            </div>
            <div className="hidden md:block flex-shrink-0">
              <img src={banner.image} alt="Hero" className="w-72 h-52 object-cover rounded-2xl opacity-90" onError={(e) => e.target.style.display = 'none'} />
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-4 gap-4 mt-10 pt-6 border-t border-white/10">
            {[
              { icon: FiTruck, title: 'Free Shipping', sub: 'On orders over $50' },
              { icon: FiStar, title: 'Best Quality', sub: 'Top-rated products' },
              { icon: FiShield, title: 'Best Offers', sub: 'Exclusive deals daily' },
              { icon: FiCreditCard, title: 'Secure Payment', sub: '100% secure checkout' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="text-center hidden md:block">
                <Icon className="mx-auto text-blue-300 mb-1" size={20} />
                <p className="text-xs font-semibold text-white">{title}</p>
                <p className="text-xs text-blue-300">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-4">
          {heroBanners.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === bannerIdx ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Categories */}
        <section className="py-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
            <Link to="/categories" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <FiArrowRight size={12} /></Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {(categories.length ? categories : Array(8).fill(null)).map((cat, i) => (
              <Link
                key={cat?.id || i}
                to={cat ? `/products?category_id=${cat.id}` : '#'}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-100 transition-colors">
                  {cat ? (categoryIcons[cat.name] || '📦') : <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {cat?.name || <div className="w-12 h-2 bg-gray-200 rounded animate-pulse" />}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="pb-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <FiArrowRight size={12} /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(8).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>


      </div>
    </div>
  )
}
