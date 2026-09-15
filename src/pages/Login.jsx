import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { loginUser } from '../services/api'

export default function Login({ auth, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('job-seeker')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const selectedRole = useMemo(() => {
    return location.search.includes('recruiter')
      ? 'recruiter'
      : role
  }, [location.search, role])

  useEffect(() => {
    if (auth) {
      navigate(
        auth.role === 'recruiter'
          ? '/employer'
          : '/employee'
      )
    }
  }, [auth, navigate])

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const backendRole =
        selectedRole === 'recruiter'
          ? 'recruiter'
          : 'job-seeker'

      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
        role: backendRole,
      })

      localStorage.setItem('onus_token', response.token)

      onLogin?.({
        email: email.trim().toLowerCase(),
        role: selectedRole,
        token: response.token,
      })

      navigate(
        selectedRole === 'recruiter'
          ? '/employer'
          : '/employee'
      )
    } catch (err) {
      setError(
        err?.message ||
          'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const featureList = [
    {
      icon: Search,
      title: 'Search & Discover',
      text: 'Find opportunities from top companies',
    },
    {
      icon: BriefcaseBusiness,
      title: 'Easy Application',
      text: 'Apply to jobs in just a few clicks',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Trusted',
      text: 'Your information stays protected',
    },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-16 h-80 w-80 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute right-0 top-28 h-[26rem] w-[26rem] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-110px)] items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div className="animate-fade-up flex flex-col justify-center">
            <div className="mb-8 flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm ring-1 ring-blue-100">
                <Sparkles className="h-4 w-4" />
              </span>
              Career platform
            </div>

            <div className="max-w-xl">
              <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-slate-900 sm:text-5xl lg:text-[4.1rem]">
                Find Your
                <span className="mt-2 block text-[#2563EB]">
                  Dream Job
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                Discover amazing opportunities from top companies and take the next step in your career with ONUS.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {featureList.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {title}
                    </p>
                    <p className="text-sm text-slate-600">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_24px_60px_rgba(37,99,235,0.08)] backdrop-blur-sm lg:max-w-[560px]">
              <div className="w-full rounded-[22px] bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 shadow-inner ring-1 ring-blue-100/70">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                      Jobs
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      Top opportunities
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    24 live
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ['Frontend Engineer', 'ONUS Technologies', 'Remote'],
                    ['Product Designer', 'CareerNest', 'Hybrid'],
                    ['Data Analyst', 'BluePeak', 'Full Time'],
                  ].map(([title, company, type]) => (
                    <div
                      key={title}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {company}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-up flex items-center justify-center">
            <div className="w-full max-w-[500px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.09)] sm:p-8 lg:p-9">
              <div className="mb-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                  Welcome back 👋
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-900">
                  Login to ONUS
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Enter your credentials to continue your journey.
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => setRole('job-seeker')}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    role === 'job-seeker'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Job Seeker
                </button>

                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    role === 'recruiter'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Recruiter
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <div
                    aria-live="polite"
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-600" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3.5 text-base font-semibold text-white shadow-[0_12px_22px_rgba(37,99,235,0.22)] transition duration-200 hover:bg-[#1d4ed8] hover:shadow-[0_16px_24px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                New here?
                <Link
                  to="/register"
                  className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}