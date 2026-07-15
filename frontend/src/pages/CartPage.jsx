import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { items, fetchCart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return }
    fetchCart()
  }, [])

  const subtotal = getTotalPrice()
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + shipping

  if (!isAuthenticated()) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Your Cart ({getTotalItems()} {getTotalItems() === 1 ? 'Item' : 'Items'})
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 rounded-xl px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-1 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Product */}
                  <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                    <Link to={`/products/${item.product_id}`}>
                      <img
                        src={item.product.image_url || `https://via.placeholder.com/80`}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-50"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80' }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product_id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-400">{item.product.brand}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <span className="text-sm font-semibold text-gray-900">Birr {item.product.price?.toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-5 md:col-span-3 flex items-center justify-center">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 font-bold text-sm">−</button>
                      <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 font-bold text-sm">+</button>
                    </div>
                  </div>

                  {/* Total + Delete */}
                  <div className="col-span-3 md:col-span-1 flex items-center justify-end gap-2">
                    <span className="text-sm font-bold text-gray-900 hidden md:block">Birr {(item.product.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium text-gray-900">Birr {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-gray-900'}>
                    {shipping === 0 ? 'Free' : `Birr ${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">🎉 You qualify for free shipping!</p>
                )}
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Free shipping on orders over Birr 500</p>
                )}
                <hr className="border-gray-100" />
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>Birr {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mt-5 transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="block text-center text-sm text-blue-600 hover:underline mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
