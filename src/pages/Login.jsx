import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    alert('Logged in as ' + email)
    navigate('/')
  }

  return (
    <section className="min-h-screen flex items-center py-12">
      <div className="container-center grid gap-8 md:grid-cols-2 items-center">
        {/* Left - Illustration / Promo */}
        <div className="hidden md:flex flex-col justify-center gap-6">
          <div className="rounded-3xl bg-[#EAF4FF] border border-blue-200 p-8 max-w-md">
            <h3 className="text-3xl font-semibold text-[#2563EB] mb-4">Find your dream job</h3>
            <p className="text-slate-700">Discover opportunities from top companies and connect with recruiters.</p>
          </div>
        </div>

        {/* Right - Sign-in Card */}
        <div className="w-full flex items-center justify-center">
          <div className="card w-full max-w-md p-8">
            <p className="text-xs tracking-widest text-slate-400 mb-2">LOGIN</p>
            <p className="text-sm text-slate-400 mb-6">Login to continue your application journey.</p>

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

              <button className="w-full bg-[#2563EB] text-white py-3 rounded-full text-lg font-semibold tracking-wider shadow-inner transition-colors duration-200 hover:bg-[#60A5FA]" type="submit">Sign in</button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-200"></div>
                <div className="text-sm text-slate-400">Or</div>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <button type="button" className="w-full border-2 border-slate-300 py-3 rounded-full font-medium">Sign in with other</button>

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
