import { ArrowRight, Sparkles } from 'lucide-react'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'

const heroStats = [
  { value: '10,000+', label: 'Jobs' },
  { value: '500+', label: 'Companies' },
  { value: '50,000+', label: 'Candidates' },
]

export default function Hero() {
  return (
    <section className="bg-bg py-12 sm:py-16 lg:py-24">
      <div className="container-center px-3 sm:px-4">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-2 text-sm font-semibold text-primary sm:px-4">
              <Sparkles className="h-4 w-4" /> Trending Jobs
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl xl:text-7xl">
              Find Your Dream Job
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              Discover jobs, internships and freelance opportunities from top companies across India.
            </p>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-600 bg-slate-800/40 p-4 text-center backdrop-blur-sm sm:p-5">
                  <p className="text-2xl font-bold text-primary sm:text-3xl">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/10 p-4 shadow-lg backdrop-blur-md sm:mt-10 sm:p-6 lg:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-black">Quick Search</p>
              <SearchBar />
              <div className="mt-5 sm:mt-6">
                <button className="inline-flex h-11 items-center rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-[#60A5FA]">
                  <span>Search Jobs</span>
                  <ArrowRight className="ml-3 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <aside className="relative">
            <div className="absolute -right-6 top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="card relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-white shadow-2xl sm:p-8">
              <div className="mb-6 sm:mb-8">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Choose your path</p>
                <h2 className="mt-3 text-2xl font-semibold sm:mt-4 sm:text-3xl">Start your journey</h2>
                <p className="mt-3 text-sm text-slate-300">Pick the role that fits you best and continue to the next step.</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <Link to="/login?role=job-seeker" className="block rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/20 sm:p-5">
                  <p className="text-lg font-semibold sm:text-xl">I&apos;m a Job Seeker</p>
                  <p className="mt-2 text-sm text-slate-300">Apply for jobs, save roles, and track your progress.</p>
                </Link>
                <Link to="/register?role=recruiter" className="block rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/20 sm:p-5">
                  <p className="text-lg font-semibold sm:text-xl">I&apos;m a Recruiter</p>
                  <p className="mt-2 text-sm text-slate-300">Post jobs, review applicants, and grow your hiring team.</p>
                </Link>
                <Link to="/register" className="block rounded-2xl border border-primary/40 bg-primary/15 p-4 transition hover:bg-primary/25 sm:p-5">
                  <p className="text-lg font-semibold text-white sm:text-xl">Referral & Earn</p>
                  <p className="mt-2 text-sm text-slate-200">Invite friends, unlock rewards, and grow together.</p>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
