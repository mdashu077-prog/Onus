import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/api'

const tabs = [
  { id: 'login', label: 'LOGIN' },
  { id: 'register', label: 'REGISTRATION / SIGN UP' },
  { id: 'referral', label: 'REFERRAL & EARN' },
]

export default function Auth({ auth, onLogin }) {
  const location = useLocation()
  const navigate = useNavigate()
  const initialTab = useMemo(() => {
    if (location.pathname.includes('/register')) return 'register'
    if (location.pathname.includes('/referral-earn')) return 'referral'
    return 'login'
  }, [location.pathname])

  const [activeTab, setActiveTab] = useState(initialTab)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginRole, setLoginRole] = useState('job-seeker')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerRole, setRegisterRole] = useState('job-seeker')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (auth) {
      navigate(auth.role === 'recruiter' ? '/employer' : '/employee')
    }
  }, [auth, navigate])

  async function handleLoginSubmit(event) {
    event.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      const response = await loginUser({
        email: loginEmail,
        password: loginPassword,
        role: loginRole,
      })
      onLogin?.(response)
      navigate(loginRole === 'recruiter' ? '/employer' : '/employee')
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault()
    setRegisterError('')
    setRegisterLoading(true)

    try {
      const response = await registerUser({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
      })
      onLogin?.(response)
      navigate(registerRole === 'recruiter' ? '/employer' : '/employee')
    } catch (error) {
      setRegisterError(error.message)
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <section className="bg-bg min-h-screen py-12">
      <div className="container-center max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-[#0d1788f2] p-1 shadow-[0_35px_80px_rgba(15,23,42,0.24)] backdrop-blur-xl">
          <div className="rounded-[1.9rem] bg-slate-950/90 p-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/90">ONUS Authentication</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Access jobs, referrals, and recruiter opportunities.</h1>
              <p className="mt-4 text-slate-300/90 leading-8">
                Choose how you want to continue with ONUS. Login, register, or explore referral rewards from a single polished experience.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-slate-900/80 p-2 shadow-inner">
              <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] bg-slate-950/80 p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-[1.25rem] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] transition ${
                      activeTab === tab.id
                        ? 'bg-[#2563EB] text-white shadow-[0_10px_20px_rgba(37,99,235,0.35)]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-slate-950/95 p-8 shadow-[0_30px_60px_rgba(15,23,42,0.16)]">
              {activeTab === 'login' && (
                <div>
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Login</p>
                      <h2 className="mt-3 text-3xl font-semibold text-white">Sign in to your ONUS account</h2>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setLoginRole('job-seeker')}
                      className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                        loginRole === 'job-seeker'
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-700 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      I&apos;m a Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('recruiter')}
                      className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                        loginRole === 'recruiter'
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-700 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      I&apos;m a Recruiter
                    </button>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(event) => setLoginEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-6 py-4 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(event) => setLoginPassword(event.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-6 py-4 pr-24 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 transition hover:text-white"
                        >
                          {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-300">
                      <label className="inline-flex items-center gap-2 text-slate-300">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-primary focus:ring-primary"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-slate-300 transition hover:text-white"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {loginError && <p className="text-sm text-red-400">{loginError}</p>}
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full rounded-full bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loginLoading ? 'Signing in…' : 'Sign in'}
                    </button>

                    <button
                      type="button"
                      className="mt-2 flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                        <span className="text-sm font-bold text-[#4285F4]">G</span>
                      </span>
                      Continue with Google
                    </button>

                    <p className="text-center text-sm text-slate-400">
                      New here?{' '}
                      <button type="button" onClick={() => setActiveTab('register')} className="font-semibold text-white transition hover:text-primary">
                        Sign Up
                      </button>
                    </p>
                  </form>
                </div>
              )}

              {activeTab === 'register' && (
                <div>
                  <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Registration</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">Create your ONUS account</h2>
                    <p className="mt-3 text-slate-300/90">Register as a job seeker or recruiter and start exploring new opportunities.</p>
                  </div>

                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setRegisterRole('job-seeker')}
                      className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                        registerRole === 'job-seeker'
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-700 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      Register as Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('recruiter')}
                      className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                        registerRole === 'recruiter'
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-700 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      Register as Recruiter
                    </button>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={registerName}
                        onChange={(event) => setRegisterName(event.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-6 py-4 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(event) => setRegisterEmail(event.target.value)}
                        placeholder="your@email.com"
                        className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-6 py-4 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={registerPassword}
                          onChange={(event) => setRegisterPassword(event.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-6 py-4 pr-24 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 transition hover:text-white"
                        >
                          {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                      </div>
                    </div>

                    {registerError && <p className="text-sm text-red-400">{registerError}</p>}
                    <button
                      type="submit"
                      disabled={registerLoading}
                      className="w-full rounded-full bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {registerLoading ? 'Creating account…' : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-slate-400">
                      Already have an account?{' '}
                      <button type="button" onClick={() => setActiveTab('login')} className="font-semibold text-white transition hover:text-primary">
                        Sign in
                      </button>
                    </p>
                  </form>
                </div>
              )}

              {activeTab === 'referral' && (
                <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Referral & Earn</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">Invite friends and earn rewards</h2>
                    <p className="mt-4 text-slate-300/90 leading-7">
                      Share your referral link with colleagues and candidates. Every successful sign up earns you rewards and helps grow the ONUS community.
                    </p>
                    <div className="mt-8 space-y-4">
                      <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
                        <p className="font-semibold text-white">1. Share your link</p>
                        <p className="mt-2 text-slate-300">Send your referral URL through chat, email, or social media.</p>
                      </div>
                      <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
                        <p className="font-semibold text-white">2. They register</p>
                        <p className="mt-2 text-slate-300">Their sign up counts you as the referrer automatically.</p>
                      </div>
                      <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
                        <p className="font-semibold text-white">3. Earn rewards</p>
                        <p className="mt-2 text-slate-300">Collect bonus credits when referrals become active users.</p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                      >
                        Create Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        Login
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[1.5rem] bg-white/5 p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-primary">Referral Insights</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-3xl bg-slate-950/70 p-4 text-center">
                          <p className="text-sm text-slate-400">Invites Sent</p>
                          <p className="mt-3 text-2xl font-semibold text-white">12</p>
                        </div>
                        <div className="rounded-3xl bg-slate-950/70 p-4 text-center">
                          <p className="text-sm text-slate-400">Signups</p>
                          <p className="mt-3 text-2xl font-semibold text-white">7</p>
                        </div>
                        <div className="rounded-3xl bg-slate-950/70 p-4 text-center">
                          <p className="text-sm text-slate-400">Rewards</p>
                          <p className="mt-3 text-2xl font-semibold text-white">₹1,850</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/5 p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-primary">Why refer?</p>
                      <ul className="mt-4 space-y-3 text-slate-300">
                        <li className="flex gap-3">
                          <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                          <span>Boost your earnings while helping others find jobs.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                          <span>Share career opportunities with your network.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                          <span>Track progress from one polished dashboard.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
