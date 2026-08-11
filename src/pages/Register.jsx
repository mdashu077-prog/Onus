import { useMemo, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { registerUser } from '../services/api'

export default function Register({ onLogin }) {
  const [role, setRole] = useState('job-seeker')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const selectedRole = useMemo(() => {
    return location.search.includes('recruiter') ? 'recruiter' : role
  }, [location.search, role])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await registerUser({
        name,
        email,
        password,
        role: selectedRole === 'recruiter' ? 'recruiter' : 'job-seeker',
      })

      onLogin?.(user)
      navigate(selectedRole === 'recruiter' ? '/employer' : '/employee')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-bg min-h-screen flex items-center py-12">
      <div className="container-center max-w-md">
        <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-8">
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">Join ONUS</h2>
          <p className="text-slate-600 mb-6">Create your free account today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Join As</label>
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                value={selectedRole}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="job-seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input type="checkbox" className="rounded border-slate-300" required />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms & Conditions</a>
              </span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-200"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-blue-700 font-semibold transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

