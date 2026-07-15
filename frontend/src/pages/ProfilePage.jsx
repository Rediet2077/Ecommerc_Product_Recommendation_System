import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiEdit2, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import useAuthStore from '../store/useAuthStore'
import toast from 'react-hot-toast'

const sidebarItems = [
  { icon: FiUser, label: 'My Profile', key: 'profile' },
  { icon: FiShoppingBag, label: 'Orders', key: 'orders', link: '/orders' },
  { icon: FiHeart, label: 'Wishlist', key: 'wishlist', link: '/wishlist' },
  { icon: FiMapPin, label: 'Addresses', key: 'addresses' },
  { icon: FiSettings, label: 'Settings', key: 'settings' },
  { icon: FiLogOut, label: 'Logout', key: 'logout' },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '+1 234 456 7890' })

  if (!user) { navigate('/login'); return null }

  const handleSave = () => {
    toast.success('Profile updated!')
    setEditing(false)
  }

  const handleSidebarClick = (item) => {
    if (item.key === 'logout') {
      logout()
      navigate('/')
      return
    }
    if (item.link) {
      navigate(item.link)
      return
    }
    setActiveTab(item.key)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Avatar */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">{user.name[0].toUpperCase()}</span>
              </div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-blue-100">{user.email}</p>
            </div>

            <nav className="py-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    activeTab === item.key
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : item.key === 'logout'
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {activeTab === 'profile' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
                  <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    <FiEdit2 size={13} /> {editing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-1 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
                      <span className="text-3xl font-bold text-white">{user.name[0].toUpperCase()}</span>
                    </div>
                    {editing && (
                      <button className="text-xs text-blue-600 hover:underline">Change Photo</button>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Personal Information</h3>
                    {editing ? (
                      <div className="space-y-3">
                        {[['name', 'Full Name', FiUser], ['email', 'Email', FiMail], ['phone', 'Phone', FiPhone]].map(([key, label, Icon]) => (
                          <div key={key}>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                              <input
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        ))}
                        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <dl className="space-y-3">
                        {[['Name', user.name], ['Email', user.email], ['Phone', form.phone], ['Member since', new Date(user.created_at).toLocaleDateString()]].map(([label, value]) => (
                          <div key={label} className="flex items-start gap-3">
                            <dt className="text-sm text-gray-500 w-28 flex-shrink-0">{label}</dt>
                            <dd className="text-sm font-medium text-gray-900">{value}</dd>
                          </div>
                        ))}
                        {user.is_admin && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="badge bg-purple-100 text-purple-700">Admin</span>
                            <Link to="/admin" className="text-xs text-purple-600 hover:underline">Go to Dashboard</Link>
                          </div>
                        )}
                      </dl>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
