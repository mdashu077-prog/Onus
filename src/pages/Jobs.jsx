import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard'
import { getJobs } from '../services/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <section className="bg-bg">
      <div className="container-center py-12">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">
              Available roles
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-secondary">
              Latest job openings
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-primary"
            >
              Full time
            </button>

            <button
              type="button"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-primary"
            >
              Remote
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-slate-600">
              Loading jobs...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* NO JOBS */}
        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-slate-600">
              No jobs posted yet.
            </p>
          </div>
        )}

        {/* JOBS */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}