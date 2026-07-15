import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const categoryImages = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
  Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
  Home: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  Beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
  Sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
  Books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
  Toys: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  More: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [productCounts, setProductCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories')
        setCategories(catRes.data)
        const counts = {}
        for (const cat of catRes.data) {
          const res = await api.get(`/products?category_id=${cat.id}&limit=1`)
          counts[cat.id] = res.data.total
        }
        setProductCounts(counts)
      } catch {}
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Categories</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category_id=${cat.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video overflow-hidden bg-gray-50">
                <img
                  src={categoryImages[cat.name] || `https://via.placeholder.com/400x200?text=${encodeURIComponent(cat.name)}`}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(cat.name)}` }}
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-500">{productCounts[cat.id] || 0} Products</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
