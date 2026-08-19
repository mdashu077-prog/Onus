import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyApplications } from '../services/api'

export default function MyApplications() {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadApplications() {
      const token = localStorage.getItem('onus_token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setError('')

        const data = await getMyApplications()

        setApplications(
          Array.isArray(data) ? data : []
        )
      } catch (err) {
        console.error(
          'Failed to load applications:',
          err
        )

        setError(
          err.message ||
            'Failed to load your applications.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [navigate])

  return (
    <section className="bg-bg min-h-screen py-14">

      <div className="container-center max-w-5xl">

        {/* BACK */}

        <Link
          to="/employee"
          className="mb-6 inline-block text-sm font-semibold text-primary hover:underline"
        >
          ← Back to Dashboard
        </Link>

        {/* HEADER */}

        <div
          className="
            rounded-[2rem]
            border
            border-slate-200
            bg-white
            p-8
            shadow-[0_30px_60px_rgba(15,23,42,0.08)]
          "
        >

          <p className="text-sm uppercase tracking-[0.28em] text-primary">
            Job Seeker
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-secondary">
            My Applications
          </h1>

          <p className="mt-2 text-slate-500">
            Track the jobs you have applied for.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div
            className="
              mt-6
              rounded-[2rem]
              border
              border-slate-200
              bg-white
              p-8
              shadow-[0_30px_60px_rgba(15,23,42,0.08)]
            "
          >
            <p className="text-slate-600">
              Loading your applications...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div
            className="
              mt-6
              rounded-[2rem]
              border
              border-red-200
              bg-red-50
              p-8
            "
          >
            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="
                mt-4
                rounded-full
                bg-primary
                px-5
                py-2
                text-sm
                font-semibold
                text-white
                hover:bg-blue-600
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          applications.length === 0 && (
            <div
              className="
                mt-6
                rounded-[2rem]
                border
                border-slate-200
                bg-white
                p-10
                text-center
                shadow-[0_30px_60px_rgba(15,23,42,0.08)]
              "
            >

              <h2 className="text-xl font-semibold text-secondary">
                No applications yet
              </h2>

              <p className="mt-2 text-slate-500">
                You haven't applied for any jobs yet.
              </p>

              <Link
                to="/jobs"
                className="
                  mt-6
                  inline-block
                  rounded-full
                  bg-primary
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-blue-600
                "
              >
                Browse Jobs
              </Link>

            </div>
          )}

        {/* APPLICATION LIST */}

        {!loading &&
          !error &&
          applications.length > 0 && (
            <div className="mt-6 space-y-5">

              {applications.map(
                (application, index) => {

                  const job =
                    application?.job || {}

                  const jobId =
                    job?.id ||
                    application?.jobId

                  const jobTitle =
                    job?.title ||
                    application?.jobTitle ||
                    'Job Application'

                  const company =
                    job?.company ||
                    application?.company ||
                    'Company not available'

                  const location =
                    job?.location ||
                    application?.location ||
                    'Location not specified'

                  const status =
                    application?.status ||
                    'Applied'

                  const appliedDate =
                    application?.createdAt ||
                    application?.appliedAt

                  return (
                    <div
                      key={
                        application?.id ||
                        `${jobId}-${index}`
                      }
                      className="
                        rounded-[2rem]
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-[0_20px_50px_rgba(15,23,42,0.06)]
                      "
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                        {/* JOB INFO */}

                        <div>

                          <p className="text-xs uppercase tracking-[0.2em] text-primary">
                            Application
                          </p>

                          <h2 className="mt-2 text-xl font-semibold text-secondary">
                            {jobTitle}
                          </h2>

                          <p className="mt-1 text-slate-600">
                            {company}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {location}
                          </p>

                          {appliedDate && (
                            <p className="mt-2 text-xs text-slate-400">
                              Applied:{' '}
                              {formatDate(
                                appliedDate
                              )}
                            </p>
                          )}

                        </div>

                        {/* STATUS */}

                        <div className="flex flex-col items-start gap-3 md:items-end">

                          <span
                            className={`
                              rounded-full
                              px-4
                              py-2
                              text-xs
                              font-semibold
                              ${
                                status
                                  .toLowerCase()
                                  .includes('reject')
                                  ? 'bg-red-100 text-red-700'
                                  : status
                                      .toLowerCase()
                                      .includes('select')
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                              }
                            `}
                          >
                            {status}
                          </span>

                          {jobId && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/jobs/${jobId}`
                                )
                              }
                              className="
                                rounded-full
                                border
                                border-primary
                                px-5
                                py-2
                                text-sm
                                font-semibold
                                text-primary
                                hover:bg-blue-50
                              "
                            >
                              View Job
                            </button>
                          )}

                        </div>

                      </div>

                    </div>
                  )
                }
              )}

            </div>
          )}

      </div>

    </section>
  )
}


/* =====================================================
   DATE FORMATTER
===================================================== */

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  } catch {
    return value
  }
}