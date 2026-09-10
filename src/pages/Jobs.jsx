import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import JobCard from '../components/JobCard'
import { getJobs } from '../services/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true)
        setError('')

        const data = await getJobs()
        setJobs(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load jobs:', err)
        setError(err.message || 'Failed to fetch jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return jobs.filter((job) => {
      const jobType = String(job?.jobType || job?.type || '').toUpperCase()
      const matchesType =
        typeFilter === 'ALL' || jobType === typeFilter || jobType.includes(typeFilter)

      const matchesText =
        !keyword ||
        [job?.title, job?.company, job?.location, job?.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(keyword)

      return matchesType && matchesText
    })
  }, [jobs, query, typeFilter])

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="container-center py-10 sm:py-14">
        <div className="mb-6 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.03)] sm:p-7">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Available roles
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Latest job openings
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {['ALL', 'FULL TIME', 'PART TIME', 'REMOTE', 'INTERNSHIP'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTypeFilter(option)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    typeFilter === option
                      ? 'border-primary bg-primary text-white shadow-[0_10px_20px_rgba(37,99,235,0.18)]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {option === 'ALL' ? 'All' : option}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(15,23,42,0.03)]">
            <p className="text-slate-600">Loading jobs...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.03)]">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-8 text-center shadow-[0_12px_30px_rgba(15,23,42,0.03)]">
            <p className="text-lg font-semibold text-slate-900">No jobs match your search.</p>
            <p className="mt-2 text-sm text-slate-500">Try a different keyword or change the filters.</p>
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}