import React from 'react'
import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import RecommendationSection from '../components/RecommendationSection'

export default function WishlistPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiHeart className="text-red-500" /> Wishlist
      </h1>
      <div className="text-center py-12 mb-8">
        <FiHeart className="mx-auto text-gray-200 mb-4" size={64} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save your favorite products here.</p>
        <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
          Browse Products
        </Link>
      </div>
      <RecommendationSection />
    </div>
  )
}
