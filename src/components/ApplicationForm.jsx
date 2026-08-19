import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applyForJob } from '../services/api'

export default function ApplicationForm({
  jobId,
  onSuccess,
  onCancel,
}) {
  const navigate = useNavigate()

  // =====================================================
  // FORM STATE
  // =====================================================

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    qualification: '',
    experience: '',
    location: '',
    coverLetter: '',
  })

  const [resume, setResume] = useState(null)

  const [submitting, setSubmitting] =
    useState(false)

  const [submitted, setSubmitted] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =====================================================
  // HANDLE RESUME
  // =====================================================

  function handleResumeChange(e) {
    const file = e.target.files?.[0]

    setError('')

    if (!file) {
      setResume(null)
      return
    }

    // ---------------------------------------------------
    // PDF CHECK
    // ---------------------------------------------------

    const isPdf =
      file.type === 'application/pdf' ||
      file.name
        .toLowerCase()
        .endsWith('.pdf')

    if (!isPdf) {
      setResume(null)

      setError(
        'Resume must be a PDF file.'
      )

      e.target.value = ''

      return
    }

    // ---------------------------------------------------
    // FILE SIZE CHECK
    // ---------------------------------------------------

    const maxSize =
      5 * 1024 * 1024

    if (file.size > maxSize) {
      setResume(null)

      setError(
        'Resume size must be less than 5 MB.'
      )

      e.target.value = ''

      return
    }

    setResume(file)
  }

  // =====================================================
  // SUBMIT APPLICATION
  // =====================================================

  async function handleSubmit(e) {
    e.preventDefault()

    // Clear old messages
    setError('')
    setSuccess('')

    // ---------------------------------------------------
    // JWT CHECK
    // ---------------------------------------------------

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

    // ---------------------------------------------------
    // JOB ID CHECK
    // ---------------------------------------------------

    if (!jobId) {
      setError(
        'Job ID is missing.'
      )

      return
    }

    // ---------------------------------------------------
    // RESUME CHECK
    // ---------------------------------------------------

    if (!resume) {
      setError(
        'Please upload your resume in PDF format.'
      )

      return
    }

    try {
      setSubmitting(true)

      // =================================================
      // CREATE FORMDATA
      // =================================================

      const formData =
        new FormData()

      formData.append(
        'fullName',
        form.fullName.trim()
      )

      formData.append(
        'phone',
        form.phone.trim()
      )

      formData.append(
        'qualification',
        form.qualification.trim()
      )

      formData.append(
        'experience',
        form.experience.trim()
      )

      formData.append(
        'location',
        form.location.trim()
      )

      // Cover letter optional hai,
      // lekin empty value bhi safely send kar sakte hain.
      formData.append(
        'coverLetter',
        form.coverLetter.trim()
      )

      formData.append(
        'resume',
        resume
      )

      // =================================================
      // API REQUEST
      // =================================================

      await applyForJob(
        jobId,
        formData
      )

      // =================================================
      // SUCCESS
      // =================================================

      setSubmitted(true)

      setSuccess(
        'Application submitted successfully!'
      )

      // =================================================
      // RESET FORM
      // =================================================

      setForm({
        fullName: '',
        phone: '',
        qualification: '',
        experience: '',
        location: '',
        coverLetter: '',
      })

      setResume(null)

      // =================================================
      // IMPORTANT
      // =================================================
      //
      // Parent ko immediately notify nahi kar rahe.
      //
      // Pehle user ko success message dikhega.
      // 1.5 second baad parent JobDetails ko notify
      // karenge, jisse ApplicationForm close hoga.
      //
      // =================================================

      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)

    } catch (err) {
      console.error(
        'APPLICATION ERROR:',
        err
      )

      setError(
        err.message ||
          'Failed to submit application'
      )

    } finally {
      setSubmitting(false)
    }
  }

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (submitted) {
    return (
      <div className="mt-8 rounded-[2rem] border border-green-200 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">

        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">

          {/* SUCCESS ICON */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">

            <span className="text-3xl text-green-600">
              ✓
            </span>

          </div>

          {/* SUCCESS TITLE */}

          <h2 className="mt-5 text-2xl font-semibold text-green-700">
            Application Submitted!
          </h2>

          {/* SUCCESS MESSAGE */}

          <p className="mt-3 text-sm leading-6 text-green-700">
            {success}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            A confirmation email has been sent to your registered email address.
          </p>

          <p className="mt-4 text-xs text-slate-500">
            Please wait...
          </p>

        </div>

      </div>
    )
  }

  // =====================================================
  // APPLICATION FORM UI
  // =====================================================

  return (
    <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)] sm:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <h2 className="text-2xl font-semibold text-secondary">
          Apply for this job
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Please provide your details and upload your latest resume.
        </p>

      </div>

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* =================================================
            FULL NAME + PHONE
        ================================================= */}

        <div className="grid gap-5 md:grid-cols-2">

          {/* FULL NAME */}

          <label className="block">

            <span className="mb-2 block text-sm font-medium text-slate-600">
              Full Name *
            </span>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              disabled={submitting}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white disabled:opacity-60"
            />

          </label>

          {/* PHONE */}

          <label className="block">

            <span className="mb-2 block text-sm font-medium text-slate-600">
              Phone Number *
            </span>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={submitting}
              placeholder="Enter your phone number"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white disabled:opacity-60"
            />

          </label>

        </div>

        {/* =================================================
            QUALIFICATION + EXPERIENCE
        ================================================= */}

        <div className="grid gap-5 md:grid-cols-2">

          {/* QUALIFICATION */}

          <label className="block">

            <span className="mb-2 block text-sm font-medium text-slate-600">
              Qualification *
            </span>

            <input
              type="text"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              required
              disabled={submitting}
              placeholder="B.Tech, BCA, MBA..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white disabled:opacity-60"
            />

          </label>

          {/* EXPERIENCE */}

          <label className="block">

            <span className="mb-2 block text-sm font-medium text-slate-600">
              Experience *
            </span>

            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
              disabled={submitting}
              placeholder="Fresher / 2 years / 5 years"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white disabled:opacity-60"
            />

          </label>

        </div>

        {/* =================================================
            LOCATION
        ================================================= */}

        <label className="block">

          <span className="mb-2 block text-sm font-medium text-slate-600">
            Current Location *
          </span>

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Mumbai, Delhi, Bangalore..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white disabled:opacity-60"
          />

        </label>

        {/* =================================================
            COVER LETTER
        ================================================= */}

        <label className="block">

          <span className="mb-2 block text-sm font-medium text-slate-600">
            Cover Letter / Message
          </span>

          <textarea
            name="coverLetter"
            value={form.coverLetter}
            onChange={handleChange}
            rows={5}
            disabled={submitting}
            placeholder="Tell the recruiter why you are suitable for this role..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white disabled:opacity-60"
          />

        </label>

        {/* =================================================
            RESUME
        ================================================= */}

        <div>

          <span className="mb-2 block text-sm font-medium text-slate-600">
            Resume / CV *
          </span>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-primary">

            <span className="text-sm font-semibold text-secondary">
              Upload your resume
            </span>

            <span className="mt-1 text-xs text-slate-500">
              PDF only • Maximum 5 MB
            </span>

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleResumeChange}
              disabled={submitting}
              className="mt-4 block w-full text-sm text-slate-600"
              required
            />

          </label>

          {resume && (
            <p className="mt-2 text-sm font-medium text-green-600">
              Selected: {resume.name}
            </p>
          )}

        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="flex flex-wrap gap-3 pt-2">

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={submitting}
            className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
              submitting
                ? 'cursor-not-allowed bg-blue-400'
                : 'bg-primary hover:bg-blue-600'
            }`}
          >
            {submitting
              ? 'Submitting Application...'
              : 'Submit Application'}
          </button>

          {/* CANCEL */}

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  )
}