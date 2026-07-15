import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import api from '../api/axios'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'
import toast from 'react-hot-toast'

const steps = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { items, fetchCart, getTotalPrice, clearCart } = useCartStore()
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '', city: '', state: '', zip: '', phone: '',
    cardNumber: '', expiry: '', cvv: '',
  })

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return }
    fetchCart()
  }, [])

  const subtotal = getTotalPrice()
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + shipping

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleNext = (e) => {
    e.preventDefault()
    if (step < steps.length - 1) setStep(step + 1)
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const address = `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.state} ${form.zip}, Phone: ${form.phone}`
      await api.post('/orders', { shipping_address: address })
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order')
    }
    setPlacing(false)
  }

  if (!isAuthenticated()) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < step ? <FiCheck size={12} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Area */}
        <div className="lg:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <form onSubmit={handleNext} className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([name, label]) => (
                  <div key={name}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
                    <input name={name} value={form[name]} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} required placeholder="Bole Road, Addis Ababa" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                {[['city', 'City'], ['state', 'Sub-city'], ['zip', 'Woreda'], ['phone', 'Phone Number']].map(([name, label]) => (
                  <div key={name}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
                    <input name={name} value={form[name]} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <button type="submit" className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
                Continue to Payment
              </button>
            </form>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <form onSubmit={handleNext} className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Card Number</label>
                  <input name="cardNumber" value={form.cardNumber} onChange={handleChange} required placeholder="1234 5678 9012 3456" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry</label>
                    <input name="expiry" value={form.expiry} onChange={handleChange} required placeholder="MM/YY" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">CVV</label>
                    <input name="cvv" value={form.cvv} onChange={handleChange} required placeholder="•••" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button type="button" onClick={() => setStep(0)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
                  Review Order
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Review Order</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.product.image_url || 'https://via.placeholder.com/60'} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold">Birr {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm space-y-2">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Birr {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Birr ${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base"><span>Total</span><span>Birr {total.toFixed(2)}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button onClick={handlePlaceOrder} disabled={placing} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60">
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <img src={item.product.image_url || 'https://via.placeholder.com/48'} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg" onError={(e) => { e.target.src = 'https://via.placeholder.com/48' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold">Birr {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr className="border-gray-100" />
              <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span>Birr {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs text-gray-500"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Birr ${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-bold text-gray-900"><span>Total</span><span>Birr {total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
