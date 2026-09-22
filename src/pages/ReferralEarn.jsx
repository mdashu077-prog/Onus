import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyReferralStats } from '../services/api'

export default function ReferralEarn({ auth }) {
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    referralCode: '',
    friendsReferred: 0,
    successfulSignups: 0,
    rewardsEarned: 0,
    rewardsEarnedDisplay: '₹0.00',
    history: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReferralStats() {
      if (!auth) {
        setLoading(false)
        return
      }

      try {
        const data = await getMyReferralStats()
        setStats({
          referralCode: data.referralCode || '',
          friendsReferred: Number(data.friendsReferred || 0),
          successfulSignups: Number(data.successfulSignups || 0),
          rewardsEarned: Number(data.rewardsEarned || 0),
          rewardsEarnedDisplay: data.rewardsEarnedDisplay || '₹0.00',
          history: Array.isArray(data.history) ? data.history : [],
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadReferralStats()
  }, [auth])

  const referralCode = useMemo(() => {
    if (stats.referralCode) return stats.referralCode
    if (!auth?.email) return 'ONUS-START'
    return auth.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 10) || 'ONUS-START'
  }, [auth?.email, stats.referralCode])

  const referralLink = useMemo(() => {
    return `${window.location.origin || 'http://localhost:5173'}/register?ref=${referralCode}`
  }, [referralCode])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  function handleShare(type) {
    const text = `Join ONUS and explore jobs and career opportunities. Register using my referral link: ${referralLink}`

    if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
      return
    }

    if (type === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent('Join ONUS using my referral link')}&body=${encodeURIComponent(text)}`
      return
    }

    if (type === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank', 'noopener,noreferrer')
      return
    }

    if (type === 'native') {
      if (navigator.share) {
        navigator.share({ title: 'ONUS referral', text, url: referralLink }).catch(() => {})
      }
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
                Share ONUS with friends and earn rewards when they register through your referral link.
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
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => handleShare('whatsapp')} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">WhatsApp</button>
                <button type="button" onClick={() => handleShare('email')} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">Email</button>
                <button type="button" onClick={() => handleShare('linkedin')} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">LinkedIn</button>
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button type="button" onClick={() => handleShare('native')} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">Native Share</button>
                )}
              </div>
              <p className="mt-4 text-sm text-slate-500">Referral code: <span className="font-semibold text-slate-700">{referralCode}</span></p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Friends Referred</p>
                <p className="mt-2 text-2xl font-semibold text-secondary">{loading ? 0 : stats.friendsReferred}</p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Successful Signups</p>
                <p className="mt-2 text-2xl font-semibold text-secondary">{loading ? 0 : stats.successfulSignups}</p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Rewards Earned</p>
                <p className="mt-2 text-2xl font-semibold text-secondary">{loading ? '₹0.00' : stats.rewardsEarnedDisplay}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-xl font-semibold text-secondary">Referral history</h2>
            <div className="mt-5 space-y-3">
              {stats.history.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  No successful referrals yet. Use your link to get started.
                </div>
              ) : (
                stats.history.map((entry) => (
                  <div key={entry.id || entry.referralCode || entry.referredUser?.email || Math.random()} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div>
                      <p className="font-semibold text-secondary">{entry.referredUser?.email || 'New referral'}</p>
                      <p className="text-sm text-slate-500">{entry.status || 'SUCCESSFUL'}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">+₹{Number(entry.rewardAmount || 50).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
