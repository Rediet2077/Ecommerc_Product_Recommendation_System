import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiPlus, FiEdit2, FiTrash2, FiLogOut } from 'react-icons/fi'
import { MdStorefront, MdDashboard, MdCategory } from 'react-icons/md'
import api from '../api/axios'
import useAuthStore from '../store/useAuthStore'
import { PageLoader } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuthStore()
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({ name: '', brand: '', price: '', original_price: '', description: '', image_url: '', stock: '', category_id: '' })

  useEffect(() => {
    if (!user || !isAdmin()) { navigate('/login'); return }
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, prodRes, ordersRes, catRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/products?limit=50'),
        api.get('/admin/orders'),
        api.get('/categories'),
      ])
      setStats(statsRes.data)
      setProducts(prodRes.data.items || [])
      setOrders(ordersRes.data || [])
      setCategories(catRes.data || [])
    } catch {}
    setLoading(false)
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    try {
      const data = { ...productForm, price: parseFloat(productForm.price), stock: parseInt(productForm.stock), original_price: productForm.original_price ? parseFloat(productForm.original_price) : null, category_id: productForm.category_id ? parseInt(productForm.category_id) : null }
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data)
        toast.success('Product updated')
      } else {
        await api.post('/products', data)
        toast.success('Product created')
      }
      setShowProductModal(false)
      setEditingProduct(null)
      setProductForm({ name: '', brand: '', price: '', original_price: '', description: '', image_url: '', stock: '', category_id: '' })
      fetchData()
    } catch (err) { toast.error(err.response?.data?.detail || 'Error saving product') }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchData()
    } catch { toast.error('Failed to delete') }
  }

  const handleEditProduct = (p) => {
    setEditingProduct(p)
    setProductForm({ name: p.name, brand: p.brand || '', price: p.price, original_price: p.original_price || '', description: p.description || '', image_url: p.image_url || '', stock: p.stock, category_id: p.category_id || '' })
    setShowProductModal(true)
  }

  if (loading) return <PageLoader />
  if (!user || !isAdmin()) return null

  const navItems = [
    { key: 'dashboard', icon: MdDashboard, label: 'Dashboard' },
    { key: 'products', icon: FiShoppingBag, label: 'Products' },
    { key: 'categories', icon: MdCategory, label: 'Categories' },
    { key: 'orders', icon: FiPackage, label: 'Orders' },
    { key: 'users', icon: FiUsers, label: 'Users' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdStorefront className="text-white" />
            </div>
            <span className="font-bold text-gray-900">ShopEase</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${tab === item.key ? 'text-blue-600 bg-blue-50 font-semibold border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={() => { logout(); navigate('/') }} className="w-full flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard icon={FiUsers} label="Total Users" value={stats?.total_users || 0} color="bg-blue-500" />
              <StatCard icon={FiShoppingBag} label="Total Products" value={stats?.total_products || 0} color="bg-purple-500" />
              <StatCard icon={FiPackage} label="Total Orders" value={stats?.total_orders || 0} color="bg-green-500" />
              <StatCard icon={FiDollarSign} label="Total Revenue" value={`Birr ${(stats?.total_revenue || 0).toFixed(0)}`} color="bg-orange-500" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Recent Orders</h2>
                <button onClick={() => setTab('orders')} className="text-sm text-blue-600 hover:underline">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Order ID', 'Customer', 'Date', 'Amount', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{String(order.id).padStart(4, '0')}</td>
                        <td className="px-4 py-3 text-gray-600">User #{order.user_id}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(order.order_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-semibold">Birr {order.total_price?.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', brand: '', price: '', original_price: '', description: '', image_url: '', stock: '', category_id: '' }); setShowProductModal(true) }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <FiPlus size={14} /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>{['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><img src={p.image_url || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 object-cover rounded-lg" onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }} /></td>
                        <td className="px-4 py-3 font-medium max-w-xs truncate">{p.name}</td>
                        <td className="px-4 py-3 text-gray-500">{p.category?.name || '-'}</td>
                        <td className="px-4 py-3 font-semibold">Birr {p.price?.toFixed(2)}</td>
                        <td className="px-4 py-3"><span className={`badge ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.stock}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleEditProduct(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit2 size={13} /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h1>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>{['Order ID', 'User', 'Date', 'Amount', 'Status'].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{String(o.id).padStart(4, '0')}</td>
                        <td className="px-4 py-3 text-gray-600">User #{o.user_id}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(o.order_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-semibold">Birr {o.total_price?.toFixed(2)}</td>
                        <td className="px-4 py-3"><span className={`badge ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {tab === 'categories' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>{['ID', 'Name', 'Email', 'Admin', 'Joined'].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
                </thead>
              </table>
              <p className="text-center text-gray-400 py-8 text-sm">Loading users...</p>
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-5">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              {[['name','Name','text',true],['brand','Brand','text',false],['price','Price','number',true],['original_price','Original Price','number',false],['stock','Stock','number',true],['image_url','Image URL','url',false]].map(([key,label,type,req]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                  <input type={type} value={productForm[key]} onChange={(e) => setProductForm({...productForm,[key]:e.target.value})} required={req} step={type==='number'?'0.01':undefined} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
                <select value={productForm.category_id} onChange={(e) => setProductForm({...productForm, category_id: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">{editingProduct ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
