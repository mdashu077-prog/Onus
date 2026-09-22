import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:9090'

export default function Recruiters() {
  const [recruiters, setRecruiters] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecruiters() {
      try {
        const response = await fetch(`${BASE_URL}/api/recruiters`)

        if (!response.ok) {
          throw new Error('Failed to load recruiters')
        }

        const data = await response.json()
        setRecruiters(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch recruiters:', error)
        setRecruiters([])
      } finally {
        setLoading(false)
      }
    }

    loadRecruiters()
  }, [])

  const filteredRecruiters = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return recruiters

    return recruiters.filter((recruiter) =>
      [recruiter.name, recruiter.company, recruiter.designation, recruiter.location, recruiter.bio]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    )
  }, [query, recruiters])

  return (
    <section className="bg-bg min-h-screen">
      <div className="container-center py-12 sm:py-14">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Connect</p>
          <h2 className="mt-3 text-3xl font-semibold text-secondary">Top Recruiters</h2>
          <p className="mt-2 text-slate-600">Meet and connect with active recruiters across the platform.</p>
        </div>

        <div className="mb-8 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search recruiters or companies..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
            Loading recruiters...
          </div>
        ) : filteredRecruiters.length === 0 ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
            No recruiters found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredRecruiters.map((recruiter) => (
              <div key={recruiter.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {recruiter.name?.charAt(0)?.toUpperCase() || 'R'}
                  </div>
                </div>

                <Link to={`/recruiters/${recruiter.id}`} className="block">
                  <h3 className="text-lg font-semibold text-secondary">{recruiter.name || 'Recruiter'}</h3>
                </Link>
                <p className="mt-1 text-sm text-slate-500">{recruiter.company || recruiter.designation || 'Company not specified'}</p>
                <p className="mt-3 text-sm text-slate-700">{recruiter.designation || 'Recruiter'}</p>
                <p className="mt-2 text-sm text-slate-500">{recruiter.location || 'Location not specified'}</p>

                <Link to={`/recruiters/${recruiter.id}`} className="mt-4 block w-full rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-600">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
