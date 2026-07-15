import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import api from '../api/axios'
import useAuthStore from '../store/useAuthStore'
import { PageLoader } from '../components/LoadingSpinner'

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return }
    api.get('/orders').then((r) => setOrders(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />
  if (!isAuthenticated()) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
          <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div
                className="flex flex-wrap items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors gap-3"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Order #{String(order.id).padStart(4, '0')}</p>
                    <p className="text-xs text-gray-500">{new Date(order.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900">Birr {order.total_price?.toFixed(2)}</span>
                  {expanded === order.id ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                </div>
              </div>

              {/* Order Items */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 p-4">
                  <div className="space-y-3 mb-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.product?.image_url || 'https://via.placeholder.com/60'}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/60' }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.product?.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × Birr {item.price?.toFixed(2)}</p>
                        </div>
                        <span className="text-sm font-bold">Birr {(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.shipping_address && (
                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                      <p className="font-semibold mb-1">Shipping Address</p>
                      <p>{order.shipping_address}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-900">Total: Birr {order.total_price?.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
