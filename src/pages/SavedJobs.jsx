import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  function loadSavedJobs() {
    try {
      const saved = JSON.parse(
        localStorage.getItem('onus_saved_jobs') || '[]'
      )

      setSavedJobs(
        Array.isArray(saved) ? saved : []
      )
    } catch (error) {
      console.error(
        'Failed to load saved jobs:',
        error
      )

      setSavedJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedJobs()

    window.addEventListener(
      'savedJobsUpdated',
      loadSavedJobs
    )

    window.addEventListener(
      'storage',
      loadSavedJobs
    )

    return () => {
      window.removeEventListener(
        'savedJobsUpdated',
        loadSavedJobs
      )

      window.removeEventListener(
        'storage',
        loadSavedJobs
      )
    }
  }, [])

  function removeSavedJob(jobId) {
    const updatedJobs = savedJobs.filter(
      (job) =>
        String(job.id) !== String(jobId)
    )

    setSavedJobs(updatedJobs)

    localStorage.setItem(
      'onus_saved_jobs',
      JSON.stringify(updatedJobs)
    )

    window.dispatchEvent(
      new Event('savedJobsUpdated')
    )
  }

  if (loading) {
    return (
      <section className="bg-bg py-16 min-h-screen">
        <div className="container-center">
          <p className="text-slate-600">
            Loading saved jobs...
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-bg py-14 min-h-screen">
      <div className="container-center max-w-5xl">

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">
            Job Seeker
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-secondary">
            Saved Jobs
          </h1>

          <p className="mt-2 text-slate-600">
            Jobs you have saved for later.
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_30px_60px_rgba(15,23,42,0.08)]">

            <h2 className="text-xl font-semibold text-secondary">
              No saved jobs
            </h2>

            <p className="mt-2 text-slate-500">
              You have not saved any jobs yet.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Browse Jobs
            </Link>

          </div>
        ) : (
          <div className="space-y-5">

            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
              >

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h2 className="text-xl font-semibold text-secondary">
                      {job.title || 'Untitled Job'}
                    </h2>

                    <p className="mt-1 text-slate-600">
                      {job.company || 'Company not specified'}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">

                      {job.location && (
                        <span>
                          📍 {job.location}
                        </span>
                      )}

                      {job.salary && (
                        <span>
                          • {job.salary}
                        </span>
                      )}

                      {job.jobType && (
                        <span>
                          • {job.jobType}
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <Link
                      to={`/jobs/${job.id}`}
                      className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
                    >
                      View Job
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        removeSavedJob(job.id)
                      }
                      className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  )
}