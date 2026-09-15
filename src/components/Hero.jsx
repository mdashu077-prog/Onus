import { ArrowRight, Search, ShieldCheck, Sparkles, TrendingUp, UserRound, UsersRound } from 'lucide-react'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'

const heroStats = [
  { value: '10,000+', label: 'Jobs', to: '/jobs' },
  { value: '500+', label: 'Companies', to: '/companies' },
  { value: '50,000+', label: 'Candidates', to: '/recruiters' },
]

export default function Hero({ auth = null }) {
  const isAuthenticated = !!auth

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-8 sm:py-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-100/80 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl" />
      </div>

      <div className="container-center relative z-10 px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 sm:px-4">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by job seekers & recruiters
            </span>

            <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.055em] text-slate-900 sm:text-5xl lg:text-[4.5rem]">
              Find Your
              <span className="mt-2 block text-[#2563EB]">Dream Job</span>
            </h1>

            <p className="mt-5 max-w-[550px] text-base leading-7 text-[#475569] sm:text-lg sm:leading-[1.6]">
              Discover jobs, internships and growth opportunities from leading companies — all in one place.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={isAuthenticated ? '/jobs' : '/login'}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8] hover:shadow-[0_16px_30px_rgba(37,99,235,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                {isAuthenticated ? 'Explore Jobs' : 'Sign In'}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                {isAuthenticated ? 'Post a Job' : 'Create Account'}
              </Link>
            </div>

            {isAuthenticated && (
            <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Quick Search</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">Find the right opportunity</p>
                </div>
                <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                  <Search className="h-4 w-4" />
                </div>
              </div>

              <SearchBar />

              <div className="mt-4 flex justify-end">
                <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Search Jobs
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            )}

            {isAuthenticated && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroStats.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_16px_30px_rgba(37,99,235,0.08)]"
                >
                  <p className="text-2xl font-black tracking-[-0.04em] text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </Link>
              ))}
            </div>
            )}
          </div>

          <div className="relative lg:pt-2">
            <div className="absolute -right-6 top-10 h-28 w-28 rounded-full bg-blue-200/70 blur-3xl" />
            <div className="relative rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_22px_55px_rgba(15,23,42,0.09)] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">Welcome to ONUS</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-[2.15rem]">Start Your Journey</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Choose how you want to continue with ONUS.</p>

              <div className="mt-7 space-y-4">
                <div className="rounded-[22px] border border-blue-100 bg-blue-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-sm"><UserRound className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Job Seeker</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">Find jobs, internships and career opportunities.</p>
                    </div>
                  </div>
                  <Link to="/register?role=job-seeker" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                    Continue as Job Seeker <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-600 p-2.5 text-white shadow-sm"><UsersRound className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Recruiter</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">Post jobs and find talented candidates.</p>
                    </div>
                  </div>
                  <Link to="/register?role=recruiter" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
                    Continue as Recruiter <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 text-sm">
                <span className="text-slate-600">Already have an account?</span>
                <Link to="/login" className="font-semibold text-blue-600 transition hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Sign In <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-950 px-5 py-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.1)] sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-500/20 p-2 text-blue-200"><TrendingUp className="h-5 w-5" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200">Build your future</p>
              <p className="mt-1 text-sm text-slate-200">Find opportunities. Apply with confidence. Grow your career.</p>
            </div>
          </div>
          <Link to={isAuthenticated ? '/jobs' : '/login'} className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-semibold text-white transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">{isAuthenticated ? 'Explore Jobs' : 'Sign in to explore opportunities'} <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-4 text-sm text-slate-600 sm:grid-cols-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
            <span>Secure authentication</span>
          </div>
          <div className="flex items-center gap-2.5">
            <UserRound className="h-4 w-4 shrink-0 text-blue-600" />
            <span>Built for job seekers</span>
          </div>
          <div className="flex items-center gap-2.5">
            <UsersRound className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Made for better hiring</span>
          </div>
        </div>
      </div>
    </section>
  )
}
