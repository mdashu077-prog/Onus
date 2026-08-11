import { useMemo, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { loginUser } from '../services/api'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('job-seeker')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const selectedRole = useMemo(() => {
    return location.search.includes('recruiter') ? 'recruiter' : role
  }, [location.search, role])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginUser({
        email,
        password,
        role: selectedRole === 'recruiter' ? 'recruiter' : 'job-seeker',
      })

      onLogin?.(response)
      navigate(selectedRole === 'recruiter' ? '/employer' : '/employee')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center py-12">
      <div className="container-center grid gap-8 md:grid-cols-2 items-center">
        <div className="hidden md:flex flex-col justify-center gap-6">
          <div className="rounded-3xl bg-[#EAF4FF] border border-blue-200 p-8 max-w-md">
            <h3 className="text-3xl font-semibold text-[#2563EB] mb-4">Find your dream job</h3>
            <p className="text-slate-700">Discover opportunities from top companies and connect with recruiters.</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="card w-full max-w-md p-8">
            <p className="text-xs tracking-widest text-slate-400 mb-2">LOGIN</p>
            <p className="text-sm text-slate-400 mb-6">Login to continue your application journey.</p>

            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setRole('job-seeker')} className={`rounded-full border px-4 py-2 text-sm font-semibold ${role === 'job-seeker' ? 'border-primary bg-primary text-white' : 'border-slate-300 text-slate-600'}`}>
                I&apos;m a Job Seeker
              </button>
              <button type="button" onClick={() => setRole('recruiter')} className={`rounded-full border px-4 py-2 text-sm font-semibold ${role === 'recruiter' ? 'border-primary bg-primary text-white' : 'border-slate-300 text-slate-600'}`}>
                I&apos;m a Recruiter
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email</label>
                <input
                  type="text"
                  placeholder="you@example.com"
                  className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-full px-6 py-3 outline-none border border-slate-700 shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-full px-6 py-3 outline-none border border-slate-700 shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-sm text-blue-200">{showPassword ? 'HIDE' : 'SHOW'}</button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-slate-600 hover:underline">Forgot Password?</Link>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              <button className="w-full bg-[#2563EB] text-white py-3 rounded-full text-lg font-semibold tracking-wider shadow-inner transition-colors duration-200 hover:bg-[#60A5FA] disabled:opacity-60" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <p className="text-center text-sm text-slate-500">New here?
                <Link to="/register" className="text-blue-600 ml-1">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
