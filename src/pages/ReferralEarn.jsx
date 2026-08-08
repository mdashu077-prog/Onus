import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const historyItems = [
  { name: 'Aarav', status: 'Signed up', reward: '+₹250' },
  { name: 'Meera', status: 'Completed profile', reward: '+₹100' },
  { name: 'Rohan', status: 'Applied to 2 jobs', reward: '+₹150' },
]

export default function ReferralEarn({ auth }) {
  const [copied, setCopied] = useState(false)

  const referralCode = useMemo(() => {
    if (!auth?.email) return 'onusjoin'
    return auth.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toUpperCase()
  }, [auth?.email])

  const referralLink = `https://onus.app/join?ref=${referralCode}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  if (!auth) {
    return (
      <section className="bg-bg py-12 sm:py-16 lg:py-20">
        <div className="container-center px-3 sm:px-4">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Referral & Earn</p>
              <h1 className="mt-4 text-3xl font-semibold text-secondary sm:text-4xl">Refer Friends. Earn Rewards.</h1>
              <p className="mt-4 text-base leading-7 text-slate-700">
                Share ONUS with friends and earn exciting rewards every time they join and become active on the platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]">
                  Create Account
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
                  Login
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h2 className="text-xl font-semibold text-secondary">How it works</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-secondary">1. Share your link</p>
                  <p className="mt-1 text-sm text-slate-600">Send your referral link to friends, students, and hiring teams.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-secondary">2. They join ONUS</p>
                  <p className="mt-1 text-sm text-slate-600">When they create an account, you become eligible for referral rewards.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-secondary">3. Earn rewards</p>
                  <p className="mt-1 text-sm text-slate-600">Unlock credits and bonuses as your referrals become active users.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-bg py-12 sm:py-16 lg:py-20">
      <div className="container-center px-3 sm:px-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Your Referral Program</p>
              <h1 className="mt-3 text-3xl font-semibold text-secondary sm:text-4xl">Invite friends and grow your network</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                Share your unique link with friends and earn rewards when they join ONUS and start exploring opportunities.
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {auth?.name || 'Member'} is active
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Your referral link</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input readOnly value={referralLink} className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none" />
                <button onClick={handleCopy} className="rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]">
                  {copied ? 'Copied!' : 'Copy Referral Link'}
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">Share WhatsApp</button>
                <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">Share Email</button>
                <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">Share LinkedIn</button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Friends Referred</p>
                <p className="mt-2 text-2xl font-semibold text-secondary">24</p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Successful Signups</p>
                <p className="mt-2 text-2xl font-semibold text-secondary">12</p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Rewards Earned</p>
                <p className="mt-2 text-2xl font-semibold text-secondary">₹2,400</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-semibold text-secondary">Referral History</h2>
              <div className="mt-5 space-y-3">
                {historyItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div>
                      <p className="font-semibold text-secondary">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.status}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{item.reward}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-semibold text-secondary">How it works</h2>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-secondary">1. Share your URL</p>
                  <p className="mt-1 text-sm text-slate-600">Send your unique link to potential job seekers and recruiters.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-secondary">2. They create an account</p>
                  <p className="mt-1 text-sm text-slate-600">Their signup counts as a successful referral.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-secondary">3. You earn rewards</p>
                  <p className="mt-1 text-sm text-slate-600">Get bonus credits as your network grows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
