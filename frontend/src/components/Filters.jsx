import React from 'react'
import { AiFillStar } from 'react-icons/ai'

export default function Filters({ categories, filters, onChange }) {
  const priceRanges = [
    { label: 'Birr 0 - 500', min: 0, max: 500 },
    { label: 'Birr 500 - 2,000', min: 500, max: 2000 },
    { label: 'Birr 2,000 - 5,000', min: 2000, max: 5000 },
    { label: 'Birr 5,000 - 15,000', min: 5000, max: 15000 },
    { label: 'Birr 15,000+', min: 15000, max: null },
  ]

  const ratings = [4, 3, 2, 1]

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Company</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" checked={!filters.categoryId} onChange={() => onChange({ ...filters, categoryId: null })} className="text-blue-600" />
            <span className="text-sm text-gray-600">All</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === cat.id}
                onChange={() => onChange({ ...filters, categoryId: cat.id })}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-600">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => onChange({ ...filters, minPrice: range.min, maxPrice: range.max })}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-600">{range.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="price" checked={filters.minPrice == null && filters.maxPrice == null} onChange={() => onChange({ ...filters, minPrice: null, maxPrice: null })} className="text-blue-600" />
            <span className="text-sm text-gray-600">All Prices</span>
          </label>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating</h3>
        <div className="space-y-2">
          {ratings.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                className="text-blue-600"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <AiFillStar key={s} size={12} className={s <= r ? 'text-amber-400' : 'text-gray-200'} />
                ))}
                <span className="text-xs text-gray-500 ml-1">& Up</span>
              </div>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="rating" checked={!filters.minRating} onChange={() => onChange({ ...filters, minRating: null })} className="text-blue-600" />
            <span className="text-sm text-gray-600">All Ratings</span>
          </label>
        </div>
      </div>
    </div>
  )
}
