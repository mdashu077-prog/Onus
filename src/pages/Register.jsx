import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [role, setRole] = useState('employee')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    alert(`Registered ${name} as ${role}`)
    navigate('/login')
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
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="employee">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input type="checkbox" className="rounded border-slate-300" required />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms & Conditions</a>
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-white font-semibold transition hover:bg-blue-700 active:scale-95 mt-4"
            >
              Create Account
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="text-sm text-slate-500">OR</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          <button className="w-full py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold transition hover:bg-slate-50 flex items-center justify-center gap-2">
            <span>🔵</span> Sign up with Google
          </button>

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

