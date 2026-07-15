import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { MdStorefront } from 'react-icons/md'
import useAuthStore from '../store/useAuthStore'
import useCartStore from '../store/useCartStore'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore()
  const { items, fetchCart, getTotalItems } = useCartStore()
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated()) fetchCart()
  }, [isAuthenticated()])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const handleLogout = () => {
    logout()
    setUserDropdown(false)
    navigate('/')
  }

  const totalItems = getTotalItems()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdStorefront className="text-white text-lg" />
            </div>
            <span className="font-bold text-lg text-gray-900">ShopEase</span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className={`hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'text-blue-600' : ''}`}>Home</Link>
            <Link to="/products" className={`hover:text-blue-600 transition-colors ${location.pathname === '/products' ? 'text-blue-600' : ''}`}>Products</Link>
            <Link to="/categories" className={`hover:text-blue-600 transition-colors ${location.pathname === '/categories' ? 'text-blue-600' : ''}`}>Categories</Link>
            <Link to="/products?sort=featured" className="hover:text-blue-600 transition-colors">Deals</Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="hidden md:flex p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <FiHeart size={18} />
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <FiShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated() ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <FiChevronDown className="text-gray-400 text-xs" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <Link to="/orders" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                    {isAdmin() && (
                      <Link to="/admin" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium">Admin Dashboard</Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors">Register</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-500 hover:text-blue-600">
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </form>
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 hover:text-blue-600">Products</Link>
            <Link to="/categories" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 hover:text-blue-600">Categories</Link>
            {!isAuthenticated() && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 border border-gray-200 rounded-lg text-sm">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg text-sm">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
