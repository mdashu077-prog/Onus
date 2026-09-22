import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getMyApplications } from '../services/api'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://onus-backend-u9zs.onrender.com'

export default function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [checkingApplication, setCheckingApplication] =
    useState(false)

  const [alreadyApplied, setAlreadyApplied] =
    useState(false)

  const [successMessage, setSuccessMessage] =
    useState('')

  const [isSaved, setIsSaved] =
    useState(false)

  const effectiveStatus = (() => {
    if (job?.status === 'CLOSED') return 'CLOSED'
    if (job?.status === 'EXPIRED') return 'EXPIRED'
    if (job?.permanent === true || !job?.expiresAt) return 'ACTIVE'
    if (new Date(job.expiresAt).getTime() < Date.now()) return 'EXPIRED'
    return 'ACTIVE'
  })()

  const isJobActive = effectiveStatus === 'ACTIVE'
  const isPermanent = job?.permanent === true || (!job?.expiresAt && job?.status !== 'EXPIRED' && job?.status !== 'CLOSED')

  // =====================================================
  // LOAD JOB DETAILS
  // =====================================================

  useEffect(() => {
    async function loadJob() {
      if (!jobId) {
        setError('Job ID is missing')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${BASE_URL}/api/jobs/${jobId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          }
        )

        const text = await response.text()

        let data = null

        if (text) {
          try {
            data = JSON.parse(text)
          } catch {
            data = null
          }
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Failed to load job (${response.status})`
          )
        }

        setJob(data)
      } catch (err) {
        console.error('Failed to load job:', err)

        setError(
          err.message ||
            'Failed to load job details'
        )
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [jobId])

  // =====================================================
  // CHECK APPLICATION
  // =====================================================

  useEffect(() => {
    async function checkAlreadyApplied() {
      const token =
        localStorage.getItem('onus_token')

      if (!token || !jobId) {
        setAlreadyApplied(false)
        return
      }

      try {
        setCheckingApplication(true)

        const applications =
          await getMyApplications()

        const applied =
          Array.isArray(applications) &&
          applications.some(
            (application) =>
              String(application?.job?.id) ===
              String(jobId)
          )

        setAlreadyApplied(applied)
      } catch (err) {
        console.error(
          'Failed to check application status:',
          err
        )

        setAlreadyApplied(false)
      } finally {
        setCheckingApplication(false)
      }
    }

    checkAlreadyApplied()
  }, [jobId])

  // =====================================================
  // CHECK SAVED JOB
  // =====================================================

  useEffect(() => {
    if (!jobId) return

    try {
      const savedJobs =
        JSON.parse(
          localStorage.getItem(
            'onus_saved_jobs'
          ) || '[]'
        )

      const saved =
        Array.isArray(savedJobs) &&
        savedJobs.some(
          (savedJob) =>
            String(savedJob.id) ===
            String(jobId)
        )

      setIsSaved(saved)
    } catch (err) {
      console.error(
        'Failed to check saved job:',
        err
      )

      setIsSaved(false)
    }
  }, [jobId])

  // =====================================================
  // APPLY
  // =====================================================

  function handleApplyClick() {
    const token =
      localStorage.getItem('onus_token')

    if (!token) {
      navigate('/login', {
        state: {
          from: `/jobs/${jobId}`,
        },
      })

      return
    }

    if (alreadyApplied) return

    setSuccessMessage('')
    navigate(`/jobs/${jobId}/apply`)
  }

  // =====================================================
  // SAVE JOB
  // =====================================================

  function handleSave() {
    if (!job) return

    try {
      const savedJobs =
        JSON.parse(
          localStorage.getItem(
            'onus_saved_jobs'
          ) || '[]'
        )

      const alreadySaved =
        savedJobs.some(
          (savedJob) =>
            String(savedJob.id) ===
            String(job.id)
        )

      if (alreadySaved) {
        const updatedJobs =
          savedJobs.filter(
            (savedJob) =>
              String(savedJob.id) !==
              String(job.id)
          )

        localStorage.setItem(
          'onus_saved_jobs',
          JSON.stringify(updatedJobs)
        )

        setIsSaved(false)

        window.dispatchEvent(
          new Event('savedJobsUpdated')
        )

        return
      }

      const updatedJobs = [
        ...savedJobs,
        job,
      ]

      localStorage.setItem(
        'onus_saved_jobs',
        JSON.stringify(updatedJobs)
      )

      setIsSaved(true)

      window.dispatchEvent(
        new Event('savedJobsUpdated')
      )
    } catch (err) {
      console.error(
        'Failed to save job:',
        err
      )
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="bg-bg min-h-screen py-16">
        <div className="container-center">
          <p className="text-slate-600">
            Loading job details...
          </p>
        </div>
      </section>
    )
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="bg-bg min-h-screen py-16">
        <div className="container-center max-w-5xl">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 text-sm font-semibold text-primary hover:underline"
          >
            ← Back to jobs
          </button>

          <div className="rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-red-600">
              {error}
            </p>
          </div>

        </div>
      </section>
    )
  }

  // =====================================================
  // JOB NOT FOUND
  // =====================================================

  if (!job) {
    return (
      <section className="bg-bg min-h-screen py-16">
        <div className="container-center">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 text-sm font-semibold text-primary hover:underline"
          >
            ← Back to jobs
          </button>

          <p className="text-slate-600">
            Job not found.
          </p>

        </div>
      </section>
    )
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="bg-bg min-h-screen py-16">

      <div className="container-center max-w-5xl">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-semibold text-primary hover:underline"
        >
          ← Back to jobs
        </button>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">

          {/* JOB DETAILS */}

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">

            <p className="text-sm uppercase tracking-[0.28em] text-primary">
              Job Details
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-secondary">
              {job.title}
            </h1>

            <p className="mt-2 text-lg text-slate-600">
              {job.company}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.2em]">
              <span className={`rounded-full px-3 py-1.5 ${isJobActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {effectiveStatus === 'CLOSED' ? 'Closed' : effectiveStatus === 'EXPIRED' ? 'Vacancy Expired' : isPermanent ? 'Permanent vacancy' : 'Active'}
              </span>
              {!job?.permanent && job?.expiresAt && (
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">
                  Valid until {new Date(job.expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Posted by
              </p>

              {job?.recruiter?.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(`/recruiters/${job.recruiter.id}`)}
                    className="mt-2 text-left text-lg font-semibold text-primary hover:underline"
                  >
                    {job.recruiter.name || job.recruiterEmail || 'Recruiter'}
                  </button>

                  <p className="mt-1 text-sm text-slate-600">
                    {job.recruiter.company || job.company || 'Company information unavailable'}
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate(`/recruiters/${job.recruiter.id}`)}
                    className="mt-3 inline-flex items-center rounded-full border border-primary bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
                  >
                    View Recruiter Profile →
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-2 text-lg font-semibold text-slate-700">
                    {job.company || 'Company information unavailable'}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Recruiter profile is no longer available.
                  </p>
                </>
              )}
            </div>

            <p className="mt-5 whitespace-pre-line text-slate-700">
              {job.description ||
                'No description available.'}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Salary
                </p>

                <p className="mt-1 font-semibold text-secondary">
                  {job.salary ||
                    'Not specified'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-secondary">
                  {job.location ||
                    'Not specified'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Job Type
                </p>

                <p className="mt-1 font-semibold text-secondary">
                  {job.jobType ||
                    'Full-time'}
                </p>
              </div>

            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">

              {!isJobActive ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500 shadow-sm"
                >
                  {effectiveStatus === 'EXPIRED' ? 'Vacancy Expired' : 'Apply unavailable'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  disabled={alreadyApplied || checkingApplication}
                  className={`inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-out hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    alreadyApplied
                      ? 'cursor-not-allowed bg-green-600 shadow-sm'
                      : checkingApplication
                        ? 'cursor-wait bg-slate-400 shadow-sm'
                        : ''
                  }`}
                >
                  {alreadyApplied
                    ? 'Already Applied'
                    : checkingApplication
                      ? 'Checking...'
                      : 'Apply Now'}
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold opacity-100 visible transition-all duration-200 ease-out ${
                  isSaved
                    ? 'border border-green-600 bg-green-50 text-green-700 shadow-sm'
                    : 'border border-primary bg-white text-primary shadow-sm hover:bg-primary/10'
                }`}
              >
                {isSaved
                  ? '✓ Saved'
                  : 'Save Job'}
              </button>

            </div>

            {successMessage && (
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-700">
                  {successMessage}
                </p>
              </div>
            )}

          </div>

          {/* COMPANY DETAILS */}

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">

            <h2 className="text-xl font-semibold text-secondary">
              Company Details
            </h2>

            <p className="mt-4 text-slate-700">
              {job.company ||
                'This company'}{' '}
              is offering this job opportunity.
            </p>

            <div className="mt-6 space-y-4 text-sm text-slate-600">

              <p>
                <span className="font-semibold text-secondary">
                  Company:
                </span>{' '}
                {job.company ||
                  'Not specified'}
              </p>

              <p>
                <span className="font-semibold text-secondary">
                  Recruiter:
                </span>{' '}
                {job.recruiter?.name || 'Profile unavailable'}
              </p>

              <p>
                <span className="font-semibold text-secondary">
                  Location:
                </span>{' '}
                {job.location ||
                  'Not specified'}
              </p>

              <p>
                <span className="font-semibold text-secondary">
                  Hiring Type:
                </span>{' '}
                {job.jobType ||
                  'Full-time'}
              </p>

              <p>
                <span className="font-semibold text-secondary">
                  Salary:
                </span>{' '}
                {job.salary ||
                  'Not specified'}
              </p>

              <p>
                <span className="font-semibold text-secondary">
                  Status:
                </span>{' '}
                {effectiveStatus === 'CLOSED' ? 'Closed' : effectiveStatus === 'EXPIRED' ? 'Vacancy Expired' : isPermanent ? 'Permanent vacancy' : 'Active'}
              </p>

              <p>
                <span className="font-semibold text-secondary">
                  Validity:
                </span>{' '}
                {job?.permanent || !job?.expiresAt ? 'Permanent vacancy' : new Date(job.expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

            </div>

          </aside>

        </div>

      </div>

    </section>
  )
}