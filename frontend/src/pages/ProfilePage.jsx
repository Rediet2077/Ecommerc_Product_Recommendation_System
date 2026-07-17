import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut,
  FiEdit2, FiMapPin, FiPhone, FiMail, FiPlus, FiTrash2,
  FiBell, FiLock, FiEye, FiEyeOff, FiCheck,
} from 'react-icons/fi'
import useAuthStore from '../store/useAuthStore'
import toast from 'react-hot-toast'

const sidebarItems = [
  { icon: FiUser,      label: 'My Profile', key: 'profile' },
  { icon: FiShoppingBag, label: 'Orders',  key: 'orders',   link: '/orders' },
  { icon: FiHeart,     label: 'Wishlist',   key: 'wishlist', link: '/wishlist' },
  { icon: FiMapPin,    label: 'Addresses',  key: 'addresses' },
  { icon: FiSettings,  label: 'Settings',   key: 'settings' },
  { icon: FiLogOut,    label: 'Logout',     key: 'logout' },
]

/* ─── Addresses Tab ─────────────────────────────────────────── */
function AddressesTab() {
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', name: 'John Doe', line1: 'Bole Road, Kirkos Sub-city', city: 'Addis Ababa', phone: '+251 91 234 5678', default: true },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState({ label: 'Home', name: '', line1: '', city: '', phone: '' })

  const handleSave = () => {
    if (!form.name || !form.line1 || !form.city) { toast.error('Please fill all required fields'); return }
    if (editId) {
      setAddresses((prev) => prev.map((a) => a.id === editId ? { ...a, ...form } : a))
      toast.success('Address updated')
    } else {
      setAddresses((prev) => [...prev, { ...form, id: Date.now(), default: prev.length === 0 }])
      toast.success('Address added')
    }
    setShowForm(false)
    setEditId(null)
    setForm({ label: 'Home', name: '', line1: '', city: '', phone: '' })
  }

  const handleEdit = (addr) => {
    setForm({ label: addr.label, name: addr.name, line1: addr.line1, city: addr.city, phone: addr.phone })
    setEditId(addr.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    toast.success('Address removed')
  }

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, default: a.id === id })))
    toast.success('Default address updated')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm({ label: 'Home', name: '', line1: '', city: '', phone: '' }) }}
          className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <FiPlus size={13} /> Add Address
        </button>
      </div>

      {/* Address cards */}
      <div className="space-y-3 mb-5">
        {addresses.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <FiMapPin className="mx-auto mb-2" size={32} />
            <p className="text-sm">No saved addresses yet.</p>
          </div>
        )}
        {addresses.map((addr) => (
          <div key={addr.id} className={`rounded-xl border p-4 relative ${addr.default ? 'border-blue-400 bg-blue-50/40' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{addr.label}</span>
                  {addr.default && <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1"><FiCheck size={10} /> Default</span>}
                </div>
                <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                <p className="text-sm text-gray-600">{addr.line1}</p>
                <p className="text-sm text-gray-600">{addr.city}</p>
                {addr.phone && <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><FiPhone size={11} /> {addr.phone}</p>}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(addr)} className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                  <FiEdit2 size={11} /> Edit
                </button>
                {!addr.default && (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors">
                    Set default
                  </button>
                )}
                <button onClick={() => handleDelete(addr.id)} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                  <FiTrash2 size={11} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">{editId ? 'Edit Address' : 'New Address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Label</label>
              <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {['Home', 'Work', 'Other'].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Recipient name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Street / Area *</label>
              <input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="e.g. Bole Road, Kirkos Sub-city"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">City *</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Addis Ababa"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+251 91 234 5678"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { setShowForm(false); setEditId(null) }}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
              {editId ? 'Save Changes' : 'Add Address'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Settings Tab ──────────────────────────────────────────── */
function SettingsTab({ user }) {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
    newsletter: false,
  })
  const [showPassForm, setShowPassForm]   = useState(false)
  const [passForm, setPassForm]           = useState({ current: '', newPass: '', confirm: '' })
  const [showCurrent, setShowCurrent]     = useState(false)
  const [showNew, setShowNew]             = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleNotifToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success('Notification preference saved')
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (!passForm.current) { toast.error('Enter your current password'); return }
    if (passForm.newPass.length < 6) { toast.error('New password must be at least 6 characters'); return }
    if (passForm.newPass !== passForm.confirm) { toast.error('Passwords do not match'); return }
    toast.success('Password changed successfully!')
    setShowPassForm(false)
    setPassForm({ current: '', newPass: '', confirm: '' })
  }

  const Toggle = ({ checked, onChange }) => (
    <button onClick={onChange} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      {/* Notifications */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FiBell size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Notifications</h3>
        </div>
        <div className="bg-gray-50 rounded-xl divide-y divide-gray-200 overflow-hidden">
          {[
            { key: 'orderUpdates', label: 'Order Updates',     sub: 'Get notified about your order status changes' },
            { key: 'promotions',   label: 'Promotions & Deals', sub: 'Receive alerts for sales and exclusive discounts' },
            { key: 'newArrivals',  label: 'New Arrivals',       sub: 'Be the first to know about new products' },
            { key: 'newsletter',   label: 'Newsletter',          sub: 'Weekly digest of curated products and tips' },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
              <Toggle checked={notifications[key]} onChange={() => handleNotifToggle(key)} />
            </div>
          ))}
        </div>
      </section>

      {/* Password */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FiLock size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Security</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Password</p>
              <p className="text-xs text-gray-500">Change your account password</p>
            </div>
            <button onClick={() => setShowPassForm(!showPassForm)}
              className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
              {showPassForm ? 'Cancel' : 'Change'}
            </button>
          </div>
          {showPassForm && (
            <form onSubmit={handleChangePassword} className="space-y-3 border-t border-gray-200 pt-3">
              {[
                { key: 'current', label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                { key: 'newPass', label: 'New Password',     show: showNew,     toggle: () => setShowNew(!showNew) },
                { key: 'confirm', label: 'Confirm New Password', show: showNew, toggle: () => setShowNew(!showNew) },
              ].map(({ key, label, show, toggle }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                      type={show ? 'text' : 'password'}
                      value={passForm[key]}
                      onChange={(e) => setPassForm({ ...passForm, [key]: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {show ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                Update Password
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FiTrash2 size={16} className="text-red-500" />
          <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider">Danger Zone</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all your data</p>
            </div>
            <button onClick={() => setDeleteConfirm(true)}
              className="text-sm text-red-600 border border-red-300 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
              Delete
            </button>
          </div>
          {deleteConfirm && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-sm text-red-700 font-medium mb-2">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm py-1.5 rounded-lg hover:bg-white transition-colors">
                  Cancel
                </button>
                <button onClick={() => { toast.error('Account deletion disabled in demo'); setDeleteConfirm(false) }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 rounded-lg transition-colors">
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

/* ─── Main Profile Page ─────────────────────────────────────── */
export default function ProfilePage() {
  const navigate  = useNavigate()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [editing,   setEditing]   = useState(false)
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: localStorage.getItem('userPhone') || '',
  })

  if (!user) { navigate('/login'); return null }

  const handleSave = () => {
    if (form.phone) localStorage.setItem('userPhone', form.phone)
    toast.success('Profile updated!')
    setEditing(false)
  }

  const handleSidebarClick = (item) => {
    if (item.key === 'logout')  { logout(); navigate('/'); return }
    if (item.link)              { navigate(item.link); return }
    setActiveTab(item.key)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">{user.name[0].toUpperCase()}</span>
              </div>
              <p className="font-semibold truncate">{user.name}</p>
              <p className="text-xs text-blue-100 truncate">{user.email}</p>
            </div>
            <nav className="py-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    activeTab === item.key
                      ? 'text-blue-600 bg-blue-50 font-semibold border-r-2 border-blue-600'
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

        {/* Content panel */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">

            {/* ── Profile tab ── */}
            {activeTab === 'profile' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
                  <button onClick={() => setEditing(!editing)}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    <FiEdit2 size={13} /> {editing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
                      <span className="text-3xl font-bold text-white">{user.name[0].toUpperCase()}</span>
                    </div>
                    {editing && <button className="text-xs text-blue-600 hover:underline">Change Photo</button>}
                  </div>

                  {/* Info */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personal Information</h3>
                    {editing ? (
                      <div className="space-y-3">
                        {[
                          ['name',  'Full Name', 'text',  FiUser],
                          ['email', 'Email',     'email', FiMail],
                          ['phone', 'Phone',     'tel',   FiPhone],
                        ].map(([key, label, type, Icon]) => (
                          <div key={key}>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                              <input
                                type={type}
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                placeholder={key === 'phone' ? '+251 91 234 5678' : ''}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        ))}
                        <button onClick={handleSave}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <dl className="space-y-3">
                        {[
                          ['Name',          user.name],
                          ['Email',         user.email],
                          ['Phone',         form.phone || '—'],
                          ['Member since',  new Date(user.created_at).toLocaleDateString()],
                        ].map(([label, value]) => (
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

            {/* ── Addresses tab ── */}
            {activeTab === 'addresses' && <AddressesTab />}

            {/* ── Settings tab ── */}
            {activeTab === 'settings' && <SettingsTab user={user} />}

          </div>
        </div>

      </div>
    </div>
  )
}
