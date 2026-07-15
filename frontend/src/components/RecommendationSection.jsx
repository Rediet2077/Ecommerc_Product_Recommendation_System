import React from 'react'
import { FiGift } from 'react-icons/fi'

export default function RecommendationSection() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <FiGift className="text-purple-600 text-2xl" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Recommendations Coming Soon!</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
        We are working hard to bring you personalized product recommendations based on your preferences.
      </p>
      <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
        Stay Tuned
      </button>
    </div>
  )
}
