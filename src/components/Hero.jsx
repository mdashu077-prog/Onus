import { ArrowRight, Sparkles, MapPin } from 'lucide-react'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'

const heroStats = [
  { value: '10,000+', label: 'Jobs' },
  { value: '500+', label: 'Companies' },
  { value: '50,000+', label: 'Candidates' },
]

export default function Hero() {
  return (
    <section className="bg-bg py-20 lg:py-28">
      <div className="container-center">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          {/* Left: Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> Trending Jobs
            </span>
            <h1 className="mt-8 text-5xl font-bold leading-tight text-black md:text-6xl lg:text-7xl">
              Find Your Dream Job
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Discover jobs, internships and freelance opportunities from top companies across India.
            </p>

            {/* Stats Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-600 bg-slate-800/40 p-6 text-center backdrop-blur-sm">
                  <p className="text-3xl font-bold text-primary">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Search Section */}
            <div className="mt-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 p-8 backdrop-blur-md shadow-lg">
              <p className="text-sm font-semibold text-black uppercase tracking-wide">Quick Search</p>
              <SearchBar />
              <div className="mt-6">
                <button className="inline-flex items-center h-11 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-[#60A5FA]">
                  <span>Search Jobs</span>
                  <ArrowRight className="ml-3 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Login Card */}
          <aside className="relative">
            <div className="absolute -right-6 top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="card relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Login</p>
                <h2 className="mt-4 text-3xl font-semibold">Welcome back</h2>
                <p className="mt-3 text-sm text-slate-300">Login to continue your application journey.</p>
              </div>
              <form className="space-y-4">
                <label className="block text-sm text-slate-300">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none ring-1 ring-slate-800 transition focus:ring-primary" />
                <label className="block text-sm text-slate-300">Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none ring-1 ring-slate-800 transition focus:ring-primary" />
                <button type="button" className="w-full rounded-full bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#60A5FA]">Login</button>
              </form>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <Link to="/forgot" className="hover:text-white">Forgot Password?</Link>
                <span>OR</span>
              </div>
              <button className="mt-4 w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Continue with Google
              </button>
              <div className="mt-6 text-center text-sm text-slate-400">
                New here?{' '}
                <Link to="/register" className="font-semibold text-white hover:text-primary">Create Account</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
