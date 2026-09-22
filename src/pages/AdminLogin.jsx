import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'

import { loginUser } from '../services/api'

const decodeJwtRole = (token) => {
  if (!token) {
    return null
  }

  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded?.role || null
  } catch {
    return null
  }
}

export default function AdminLogin({ auth, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (auth) {
      navigate(auth.role === 'admin' ? '/admin' : auth.role === 'recruiter' ? '/employer' : '/employee', { replace: true })
    }
  }, [auth, navigate])

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
        role: 'admin',
      })

      const decodedRole = decodeJwtRole(response.token)

      if (!decodedRole || decodedRole.toLowerCase() !== 'admin') {
        throw new Error('Access denied. Admin privileges are required.')
      }

      localStorage.setItem('onus_token', response.token)

      onLogin?.({
        email: email.trim().toLowerCase(),
        role: 'admin',
        token: response.token,
      })

      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err?.message || 'Admin login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.09)]">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>
        </div>

        <div className="mb-7 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Private Access</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-900">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-500">Use the platform administrator credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@onus.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-200"
          >
            {loading ? 'Signing In…' : 'Access Admin Dashboard'}
          </button>
        </form>
      </div>
    </section>
  )
}
