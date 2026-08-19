import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ApplicationForm from '../components/ApplicationForm'
import { getMyApplications } from '../services/api'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:9090'

export default function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [checkingApplication, setCheckingApplication] =
    useState(false)

  const [showApplicationForm, setShowApplicationForm] =
    useState(false)

  const [alreadyApplied, setAlreadyApplied] =
    useState(false)

  const [successMessage, setSuccessMessage] =
    useState('')
  const [isSaved, setIsSaved] = useState(false)

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
          `${BASE_URL}/api/jobs/${jobId}`
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
          const message =
            typeof data === 'object' &&
            data?.message
              ? data.message
              : text ||
                `Failed to load job (${response.status})`

          throw new Error(message)
        }

        setJob(data)
      } catch (err) {
        console.error(
          'Failed to load job:',
          err
        )

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
  // CHECK WHETHER USER ALREADY APPLIED
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
          applications.some((application) => {
            return (
              String(application?.job?.id) ===
              String(jobId)
            )
          })

        setAlreadyApplied(applied)
      } catch (err) {
        console.error(
          'Failed to check application status:',
          err
        )

        // Application status check fail hone par
        // Apply button ko unnecessarily disable nahi karenge.
        setAlreadyApplied(false)
      } finally {
        setCheckingApplication(false)
      }
    }

    checkAlreadyApplied()
  }, [jobId])

// =====================================================
// CHECK WHETHER JOB IS SAVED
// =====================================================

useEffect(() => {
  if (!jobId) return

  try {
    const savedJobs = JSON.parse(
      localStorage.getItem('onus_saved_jobs') || '[]'
    )

    const saved = Array.isArray(savedJobs)
      && savedJobs.some(
        (savedJob) =>
          String(savedJob.id) === String(jobId)
      )

    setIsSaved(saved)
  } catch (error) {
    console.error(
      'Failed to check saved job:',
      error
    )

    setIsSaved(false)
  }
}, [jobId])

  // =====================================================
  // APPLY BUTTON
  // =====================================================

  function handleApplyClick() {
    const token =
      localStorage.getItem('onus_token')

    // User logged out hai
    if (!token) {
      navigate('/login', {
        state: {
          from: `/jobs/${jobId}`,
        },
      })

      return
    }

    // Already applied
    if (alreadyApplied) {
      return
    }

    setSuccessMessage('')
    setShowApplicationForm(true)
  }

  // =====================================================
  // APPLICATION SUCCESS
  // =====================================================

  function handleApplicationSuccess() {
    setShowApplicationForm(false)
    setAlreadyApplied(true)

    setSuccessMessage(
      'Application submitted successfully! A confirmation email has been sent to your registered email address.'
    )
  }

  // =====================================================
  // APPLICATION CANCEL
  // =====================================================

  function handleApplicationCancel() {
    setShowApplicationForm(false)
  }

  // =====================================================
  // SAVE JOB
  // =====================================================

function handleSave() {
  try {
    const savedJobs = JSON.parse(
      localStorage.getItem('onus_saved_jobs') || '[]'
    )

    const alreadySaved = savedJobs.some(
      (savedJob) =>
        String(savedJob.id) === String(job.id)
    )

    if (alreadySaved) {
      const updatedJobs = savedJobs.filter(
        (savedJob) =>
          String(savedJob.id) !== String(job.id)
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

  } catch (error) {
    console.error(
      'Failed to save job:',
      error
    )
  }
}

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="bg-bg py-16">
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
      <section className="bg-bg py-16">
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
      <section className="bg-bg py-16">
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
    <section className="bg-bg py-16">
      <div className="container-center max-w-5xl">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-semibold text-primary hover:underline"
        >
          ← Back to jobs
        </button>

        {/* =================================================
            JOB + COMPANY DETAILS
        ================================================= */}

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">

          {/* =================================================
              JOB DETAILS CARD
          ================================================= */}

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

            <p className="mt-5 whitespace-pre-line text-slate-700">
              {job.description ||
                'No description available.'}
            </p>

            {/* =================================================
                JOB INFORMATION
            ================================================= */}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              {/* SALARY */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-sm text-slate-500">
                  Salary
                </p>

                <p className="mt-1 font-semibold text-secondary">
                  {job.salary ||
                    'Not specified'}
                </p>

              </div>

              {/* LOCATION */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-sm text-slate-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-secondary">
                  {job.location ||
                    'Not specified'}
                </p>

              </div>

              {/* JOB TYPE */}

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

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="mt-8 flex flex-wrap gap-3">

              {/* APPLY */}

              <button
                type="button"
                onClick={handleApplyClick}
                disabled={
                  alreadyApplied ||
                  checkingApplication
                }
                className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                  alreadyApplied
                    ? 'cursor-not-allowed bg-green-600'
                    : checkingApplication
                      ? 'cursor-wait bg-slate-400'
                      : 'bg-primary hover:bg-blue-600'
                }`}
              >
                {alreadyApplied
                  ? 'Already Applied'
                  : checkingApplication
                    ? 'Checking...'
                    : 'Apply Now'}
              </button>

              {/* SAVE */}

              <button
                 type="button"
                   onClick={handleSave}
                   className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                    isSaved
                        ? 'border border-green-600 bg-green-50 text-green-700'
                        : 'border border-primary text-primary hover:bg-primary/10'
                 }`}
                >
                {isSaved ? '✓ Saved' : 'Save Job'}
              </button>

            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {successMessage && (
              
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">

                <p className="text-sm font-semibold text-green-700">
                  {successMessage}
                  
                </p>

              </div>
            )}

          </div>

          {/* =================================================
              COMPANY DETAILS
          ================================================= */}

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

              {/* COMPANY */}

              <p>
                <span className="font-semibold text-secondary">
                  Company:
                </span>{' '}
                {job.company ||
                  'Not specified'}
              </p>

              {/* LOCATION */}

              <p>
                <span className="font-semibold text-secondary">
                  Location:
                </span>{' '}
                {job.location ||
                  'Not specified'}
              </p>

              {/* JOB TYPE */}

              <p>
                <span className="font-semibold text-secondary">
                  Hiring Type:
                </span>{' '}
                {job.jobType ||
                  'Full-time'}
              </p>

              {/* SALARY */}

              <p>
                <span className="font-semibold text-secondary">
                  Salary:
                </span>{' '}
                {job.salary ||
                  'Not specified'}
              </p>

            </div>

          </aside>

        </div>

        {/* =================================================
            APPLICATION FORM
        ================================================= */}

        {showApplicationForm && (
          <div className="mt-8">

            <ApplicationForm
              jobId={jobId}
              onSuccess={
                handleApplicationSuccess
              }
              onCancel={
                handleApplicationCancel
              }
            />

          </div>
        )}

      </div>
    </section>
  )
}