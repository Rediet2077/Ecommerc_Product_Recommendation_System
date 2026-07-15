import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX } from 'react-icons/fi'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'

const SORT_OPTIONS = [
  { label: 'Featured', value: 'created_at-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('created_at-desc')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    categoryId: searchParams.get('category_id') ? parseInt(searchParams.get('category_id')) : null,
    minPrice: null, maxPrice: null, minRating: null,
  })
  const limit = 12

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data))
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [page, sortBy, filters, searchParams])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const [sortField, sortOrder] = sortBy.split('-')
      const params = new URLSearchParams({
        skip: (page - 1) * limit,
        limit,
        sort_by: sortField,
        order: sortOrder,
      })
      if (filters.categoryId) params.append('category_id', filters.categoryId)
      if (filters.minPrice != null) params.append('min_price', filters.minPrice)
      if (filters.maxPrice != null) params.append('max_price', filters.maxPrice)
      const q = searchParams.get('q')
      if (q) params.append('search', q)
      const res = await api.get(`/products?${params}`)
      setProducts(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch {}
    setLoading(false)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex gap-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>
            <Filters categories={categories} filters={filters} onChange={(f) => { setFilters(f); setPage(1) }} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {searchParams.get('q') ? `Search: "${searchParams.get('q')}"` : 'All Products'}
              </h1>
              <p className="text-sm text-gray-500">{total} results found</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(true)} className="md:hidden flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2">
                <FiFilter size={14} /> Filters
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden md:block">Sort by:</span>
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1) }} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(12).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)}><FiX /></button>
            </div>
            <Filters categories={categories} filters={filters} onChange={(f) => { setFilters(f); setPage(1); setShowFilters(false) }} />
          </div>
        </div>
      )}
    </div>
  )
}
