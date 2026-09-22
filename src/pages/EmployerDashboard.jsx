import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  CalendarDays,
  ArrowRight,
  Plus,
  FileText,
  Building2,
  Search,
  CheckCircle2,
  UserRound,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'

import { protectedRequest } from '../services/api'


// =====================================================
// HELPERS
// =====================================================

function parseResponse(response, fallback = []) {
  if (Array.isArray(response)) {
    return response
  }

  if (response && typeof response === 'object') {
    if (Array.isArray(response.data)) {
      return response.data
    }

    if (Array.isArray(response.content)) {
      return response.content
    }

    if (Array.isArray(response.applications)) {
      return response.applications
    }
  }

  if (typeof response === 'string') {
    try {
      const parsed = JSON.parse(response)

      if (Array.isArray(parsed)) {
        return parsed
      }

      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.data)) {
          return parsed.data
        }

        if (Array.isArray(parsed.content)) {
          return parsed.content
        }

        if (Array.isArray(parsed.applications)) {
          return parsed.applications
        }
      }
    } catch {
      return fallback
    }
  }

  return fallback
}


function getApplicationJob(application) {
  return (
    application?.job ||
    application?.jobDetails ||
    application?.position ||
    null
  )
}


function getCandidateName(application) {
  return (
    application?.fullName ||
    application?.candidateName ||
    application?.name ||
    application?.user?.name ||
    'Candidate'
  )
}


function getCandidateExperience(application) {
  return (
    application?.experience ||
    application?.yearsOfExperience ||
    application?.user?.experience ||
    'Not specified'
  )
}


function getApplicationStatus(application) {
  const status =
    application?.status ||
    application?.applicationStatus ||
    'APPLIED'

  return String(status).toUpperCase()
}


function getJobTitle(application) {
  const job = getApplicationJob(application)

  return (
    job?.title ||
    application?.jobTitle ||
    application?.positionTitle ||
    'Position'
  )
}


function getApplicationDate(application) {
  return (
    application?.createdAt ||
    application?.appliedAt ||
    application?.applicationDate ||
    null
  )
}


function formatDate(value) {
  if (!value) {
    return 'Recently'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}


function getStatusClasses(status) {
  switch (status) {
    case 'SHORTLISTED':
      return 'bg-green-50 text-green-700 border-green-200'

    case 'INTERVIEW':
    case 'INTERVIEW_SCHEDULED':
      return 'bg-purple-50 text-purple-700 border-purple-200'

    case 'SELECTED':
    case 'HIRED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'

    case 'REJECTED':
      return 'bg-red-50 text-red-700 border-red-200'

    case 'SCREENING':
      return 'bg-amber-50 text-amber-700 border-amber-200'

    default:
      return 'bg-blue-50 text-blue-700 border-blue-200'
  }
}


function getStatusLabel(status) {
  switch (status) {
    case 'INTERVIEW_SCHEDULED':
      return 'Interview'

    case 'SHORTLISTED':
      return 'Shortlisted'

    case 'SELECTED':
      return 'Selected'

    case 'HIRED':
      return 'Hired'

    case 'REJECTED':
      return 'Rejected'

    case 'SCREENING':
      return 'Screening'

    default:
      return 'Applied'
  }
}


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function EmployerDashboard({
  auth,
  page = 'dashboard',
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const postTypeFromUrl = String(
    searchParams.get('type') || ''
  ).toUpperCase()

  const isPostOpportunity =
    page === 'dashboard' &&
    (postTypeFromUrl === 'JOB' ||
      postTypeFromUrl === 'INTERNSHIP')

  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])

  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingApplications, setLoadingApplications] =
    useState(true)

  const [jobsError, setJobsError] = useState('')
  const [applicationsError, setApplicationsError] =
    useState('')

  const [searchTerm, setSearchTerm] = useState('')

  // =====================================================
  // POST OPPORTUNITY FORM
  // =====================================================

  const [postForm, setPostForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'Full time',
    experienceLevel: 'GENERAL',
    stipend: '',
    internshipType: 'Full-time Internship',
    duration: '',
    workMode: 'On-site',
    description: '',
  })

  const [posting, setPosting] = useState(false)

  // =====================================================
  // POST JOB / INTERNSHIP
  // =====================================================

  async function handlePostOpportunity(event) {
    event.preventDefault()

    const isInternship = postTypeFromUrl === 'INTERNSHIP'

    if (!postForm.title.trim()) {
      alert(isInternship ? 'Please enter internship title' : 'Please enter job title')
      return
    }

    if (!postForm.company.trim()) {
      alert('Please enter company name')
      return
    }

    if (!postForm.location.trim()) {
      alert('Please enter location')
      return
    }

    if (!isInternship && !postForm.salary.trim()) {
      alert('Please enter salary')
      return
    }

    if (isInternship && !postForm.stipend.trim()) {
      alert('Please enter stipend')
      return
    }

    try {
      setPosting(true)

      const jobData = {
        title: postForm.title.trim(),
        company: postForm.company.trim(),
        location: postForm.location.trim(),
        salary: isInternship
          ? postForm.stipend.trim()
          : postForm.salary.trim(),
        jobType: isInternship
          ? postForm.internshipType
          : postForm.jobType,
        experienceLevel: isInternship ? 'INTERNSHIP' : (postForm.experienceLevel || 'GENERAL'),
        description: postForm.description.trim(),
        type: isInternship ? 'INTERNSHIP' : 'JOB',
      }

      await protectedRequest('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      })

      alert(
        isInternship
          ? 'Internship posted successfully!'
          : 'Job posted successfully!'
      )

      setPostForm({
        title: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'Full time',
        experienceLevel: 'GENERAL',
        stipend: '',
        internshipType: 'Full-time Internship',
        duration: '',
        workMode: 'On-site',
        description: '',
      })

      await loadMyJobs()
      navigate('/employer/posted-jobs')
    } catch (error) {
      console.error('POST OPPORTUNITY ERROR:', error)
      alert(error?.message || 'Failed to post opportunity')
    } finally {
      setPosting(false)
    }
  }


  // =====================================================
  // LOAD MY JOBS
  // =====================================================

  async function loadMyJobs() {
    try {
      setLoadingJobs(true)
      setJobsError('')

      const response = await protectedRequest(
        '/api/jobs/my',
        {
          method: 'GET',
        }
      )

      const data = parseResponse(response, [])

      setJobs(data)
    } catch (error) {
      console.error(
        'EMPLOYER DASHBOARD - LOAD JOBS ERROR:',
        error
      )

      setJobs([])

      setJobsError(
        error?.message ||
          'Unable to load your posted jobs.'
      )
    } finally {
      setLoadingJobs(false)
    }
  }


  // =====================================================
  // LOAD RECRUITER APPLICATIONS
  // =====================================================

  async function loadApplications() {
    try {
      setLoadingApplications(true)
      setApplicationsError('')

      const response = await protectedRequest(
        '/api/applications/recruiter',
        {
          method: 'GET',
        }
      )

      const data = parseResponse(response, [])

      setApplications(data)
    } catch (error) {
      console.error(
        'EMPLOYER DASHBOARD - LOAD APPLICATIONS ERROR:',
        error
      )

      setApplications([])

      setApplicationsError(
        error?.message ||
          'Unable to load recruiter applications.'
      )
    } finally {
      setLoadingApplications(false)
    }
  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadMyJobs()
    loadApplications()
  }, [])


  // =====================================================
  // REFRESH
  // =====================================================

  async function handleRefresh() {
    await Promise.all([
      loadMyJobs(),
      loadApplications(),
    ])
  }


  // =====================================================
  // CALCULATED DATA
  // =====================================================

  const activeJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = String(
        job?.status || 'ACTIVE'
      ).toUpperCase()

      return (
        status !== 'CLOSED' &&
        status !== 'INACTIVE' &&
        status !== 'EXPIRED'
      )
    })
  }, [jobs])


  const shortlistedApplications = useMemo(() => {
    return applications.filter((application) => {
      const status =
        getApplicationStatus(application)

      return (
        status === 'SHORTLISTED' ||
        status === 'INTERVIEW' ||
        status === 'INTERVIEW_SCHEDULED' ||
        status === 'SELECTED' ||
        status === 'HIRED'
      )
    })
  }, [applications])


  const interviewApplications = useMemo(() => {
    return applications.filter((application) => {
      const status =
        getApplicationStatus(application)

      return (
        status === 'INTERVIEW' ||
        status === 'INTERVIEW_SCHEDULED'
      )
    })
  }, [applications])


  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const dateA = new Date(
          getApplicationDate(a) || 0
        ).getTime()

        const dateB = new Date(
          getApplicationDate(b) || 0
        ).getTime()

        return dateB - dateA
      })
      .slice(0, 5)
  }, [applications])


  const filteredJobs = useMemo(() => {
    const value = searchTerm
      .trim()
      .toLowerCase()

    if (!value) {
      return jobs
    }

    return jobs.filter((job) => {
      return (
        String(job?.title || '')
          .toLowerCase()
          .includes(value) ||
        String(job?.company || '')
          .toLowerCase()
          .includes(value) ||
        String(job?.location || '')
          .toLowerCase()
          .includes(value)
      )
    })
  }, [jobs, searchTerm])


  // =====================================================
  // POST OPPORTUNITY PAGE
  // =====================================================

  if (isPostOpportunity) {
    const isInternship = postTypeFromUrl === 'INTERNSHIP'

    return (
      <section className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate('/employer')}
              className="mb-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </button>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Recruiter
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {isInternship ? 'Post an Internship' : 'Post a Job'}
            </h1>

            <p className="mt-2 text-slate-500">
              {isInternship
                ? 'Create an internship opportunity for students and freshers.'
                : 'Create a new job opportunity and find the right candidate.'}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handlePostOpportunity} className="grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {isInternship ? 'Internship Title' : 'Job Title'}
                </label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(event) =>
                    setPostForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder={isInternship ? 'e.g. Software Development Intern' : 'e.g. Java Developer'}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company
                </label>
                <input
                  type="text"
                  value={postForm.company}
                  onChange={(event) =>
                    setPostForm((prev) => ({ ...prev, company: event.target.value }))
                  }
                  placeholder="Company name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  value={postForm.location}
                  onChange={(event) =>
                    setPostForm((prev) => ({ ...prev, location: event.target.value }))
                  }
                  placeholder="Delhi / Mumbai / Remote"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {!isInternship ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Salary
                    </label>
                    <input
                      type="text"
                      value={postForm.salary}
                      onChange={(event) =>
                        setPostForm((prev) => ({ ...prev, salary: event.target.value }))
                      }
                      placeholder="e.g. ₹5 LPA"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Job Type
                    </label>
                    <select
                      value={postForm.jobType}
                      onChange={(event) =>
                        setPostForm((prev) => ({ ...prev, jobType: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="Full time">Full time</option>
                      <option value="Part time">Part time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Job Category
                    </label>
                    <select
                      value={postForm.experienceLevel}
                      onChange={(event) =>
                        setPostForm((prev) => ({ ...prev, experienceLevel: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="GENERAL">General Job</option>
                      <option value="FRESHER">Fresher</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Stipend
                    </label>
                    <input
                      type="text"
                      value={postForm.stipend}
                      onChange={(event) =>
                        setPostForm((prev) => ({ ...prev, stipend: event.target.value }))
                      }
                      placeholder="e.g. ₹15,000 / month"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Internship Type
                    </label>
                    <select
                      value={postForm.internshipType}
                      onChange={(event) =>
                        setPostForm((prev) => ({ ...prev, internshipType: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="Full-time Internship">Full-time Internship</option>
                      <option value="Part-time Internship">Part-time Internship</option>
                      <option value="Summer Internship">Summer Internship</option>
                      <option value="Winter Internship">Winter Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={postForm.duration}
                      onChange={(event) =>
                        setPostForm((prev) => ({ ...prev, duration: event.target.value }))
                      }
                      placeholder="e.g. 3 Months"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Work Mode
                    </label>
                    <select
                      value={postForm.workMode}
                      onChange={(event) =>
                        setPostForm((prev) => ({ ...prev, workMode: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={7}
                  value={postForm.description}
                  onChange={(event) =>
                    setPostForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder={
                    isInternship
                      ? 'Describe the internship, responsibilities, required skills and learning opportunities...'
                      : 'Describe the role, responsibilities, required skills and qualifications...'
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={posting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {posting
                    ? 'Publishing...'
                    : isInternship
                      ? 'Post Internship'
                      : 'Post Job'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/employer')}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }


  // =====================================================
  // DASHBOARD HOME
  // =====================================================

  if (page === 'dashboard') {
    return (
      <section className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* =================================================
              WELCOME HEADER
          ================================================= */}

          <section className="overflow-hidden rounded-[2rem] bg-[#0f172a] shadow-[0_25px_70px_rgba(15,23,42,0.16)]">

            <div className="relative px-6 py-8 sm:px-8 lg:px-10">

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                    Recruiter Dashboard
                  </p>

                  <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                    Welcome back,{' '}
                    {auth?.name || 'Recruiter'} 👋
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                    {applications.length}{' '}
                    application
                    {applications.length === 1
                      ? ''
                      : 's'} received
                    {' | '}
                    {interviewApplications.length}{' '}
                    interview
                    {interviewApplications.length === 1
                      ? ''
                      : 's'} scheduled
                  </p>

                </div>


                <div className="flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/employer/posted-jobs'
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    <BriefcaseBusiness className="h-4 w-4" />
                    View Jobs
                  </button>


                  {/* FIXED: ACTUAL POST JOB FORM */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/employer?type=JOB'
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Post Job
                  </button>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              RECRUITER OVERVIEW
          ================================================= */}

          <section className="mt-8">

            <div className="mb-5">

              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
                Recruiter Overview
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Your hiring activity
              </h2>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* JOBS */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Jobs
                  </span>

                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {loadingJobs ? '—' : jobs.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Total posted opportunities
                </p>

              </div>


              {/* ACTIVE */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Active
                  </span>

                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {loadingJobs
                    ? '—'
                    : activeJobs.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Currently active posts
                </p>

              </div>


              {/* APPLICATIONS */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Applications
                  </span>

                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {loadingApplications
                    ? '—'
                    : applications.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Applications received
                </p>

              </div>


              {/* SHORTLISTED */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                    <UserCheck className="h-6 w-6 text-orange-600" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Shortlisted
                  </span>

                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {loadingApplications
                    ? '—'
                    : shortlistedApplications.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Candidates moved forward
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              RECENT APPLICATIONS
          ================================================= */}

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Applications
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Recent Applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest candidates who applied to your jobs.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employer/applicants'
                  )
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>


            {loadingApplications ? (

              <div className="p-10 text-center text-sm text-slate-500">
                Loading applications...
              </div>

            ) : applicationsError ? (

              <div className="p-8">

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                  <p className="font-semibold text-red-700">
                    Unable to load applications
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {applicationsError}
                  </p>

                  <button
                    type="button"
                    onClick={loadApplications}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>

                </div>

              </div>

            ) : recentApplications.length === 0 ? (

              <div className="p-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Users className="h-7 w-7 text-slate-400" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  No applications yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Applications from candidates will appear here when they apply to your posted jobs.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[760px]">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Candidate
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Position
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Experience
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {recentApplications.map(
                      (application, index) => {

                        const status =
                          getApplicationStatus(
                            application
                          )

                        return (
                          <tr
                            key={
                              application?.id ||
                              `${getCandidateName(
                                application
                              )}-${index}`
                            }
                            className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                          >

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                                  <UserRound className="h-5 w-5 text-blue-600" />
                                </div>

                                <div className="min-w-0">

                                  <p className="truncate font-semibold text-slate-900">
                                    {getCandidateName(
                                      application
                                    )}
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    {formatDate(
                                      getApplicationDate(
                                        application
                                      )
                                    )}
                                  </p>

                                </div>

                              </div>

                            </td>


                            <td className="px-6 py-5">

                              <p className="font-medium text-slate-800">
                                {getJobTitle(
                                  application
                                )}
                              </p>

                            </td>


                            <td className="px-6 py-5 text-sm text-slate-600">
                              {getCandidateExperience(
                                application
                              )}
                            </td>


                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                  status
                                )}`}
                              >
                                {getStatusLabel(
                                  status
                                )}
                              </span>

                            </td>


                            <td className="px-6 py-5">

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    '/employer/applicants'
                                  )
                                }
                                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                              >
                                View
                                <ChevronRight className="h-4 w-4" />
                              </button>

                            </td>

                          </tr>
                        )
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          {/* =================================================
              YOUR JOBS
          ================================================= */}

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Your Jobs
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Your Jobs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor the opportunities you have posted.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employer/posted-jobs'
                  )
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View All Jobs
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>


            {loadingJobs ? (

              <div className="p-10 text-center text-sm text-slate-500">
                Loading your jobs...
              </div>

            ) : jobsError ? (

              <div className="p-8">

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                  <p className="font-semibold text-red-700">
                    Unable to load your jobs
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {jobsError}
                  </p>

                  <button
                    type="button"
                    onClick={loadMyJobs}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>

                </div>

              </div>

            ) : jobs.length === 0 ? (

              <div className="p-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <BriefcaseBusiness className="h-7 w-7 text-slate-400" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  No jobs posted yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Create your first job or internship opportunity.
                </p>


                {/* FIXED */}
                <div className="mt-5 flex flex-wrap justify-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/employer?type=JOB'
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <BriefcaseBusiness className="h-4 w-4" />
                    Post a Job
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/employer?type=INTERNSHIP'
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                  >
                    <FileText className="h-4 w-4" />
                    Post an Internship
                  </button>

                </div>

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {jobs.slice(0, 5).map((job) => {

                  const applicationCount =
                    applications.filter(
                      (application) => {

                        const applicationJob =
                          getApplicationJob(
                            application
                          )

                        return (
                          String(
                            applicationJob?.id
                          ) ===
                          String(job?.id)
                        )
                      }
                    ).length


                  {/* IMPORTANT:
                      Internship is checked using job.type
                      NOT job.jobType
                  */}

                  const isInternship =
                    String(
                      job?.type || ''
                    ).toUpperCase() ===
                    'INTERNSHIP'


                  const status = String(
                    job?.status || 'ACTIVE'
                  ).toUpperCase()


                  const isActive =
                    status !== 'CLOSED' &&
                    status !== 'INACTIVE' &&
                    status !== 'EXPIRED'


                  return (
                    <div
                      key={job.id}
                      className="flex flex-col gap-5 p-6 transition hover:bg-slate-50/70 md:flex-row md:items-center md:justify-between"
                    >

                      <div className="flex min-w-0 items-start gap-4">

                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                            isInternship
                              ? 'bg-purple-50'
                              : 'bg-blue-50'
                          }`}
                        >

                          {isInternship ? (
                            <FileText className="h-6 w-6 text-purple-600" />
                          ) : (
                            <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
                          )}

                        </div>


                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="truncate text-lg font-bold text-slate-900">
                              {job?.title ||
                                'Untitled Position'}
                            </h3>


                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isActive
                                ? 'Active'
                                : status}
                            </span>


                            {/* INTERNSHIP / JOB BADGE */}

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                                isInternship
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {isInternship
                                ? 'Internship'
                                : 'Job'}
                            </span>

                          </div>


                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {job?.company ||
                              'Company'}
                          </p>


                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">

                            {job?.location && (
                              <span className="rounded-lg bg-slate-50 px-2.5 py-1">
                                📍 {job.location}
                              </span>
                            )}


                            {job?.jobType && (
                              <span className="rounded-lg bg-slate-50 px-2.5 py-1">
                                {job.jobType}
                              </span>
                            )}


                            {job?.salary && (
                              <span className="rounded-lg bg-slate-50 px-2.5 py-1">
                                ₹ {job.salary}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>


                      <div className="flex shrink-0 items-center gap-5">

                        <div className="text-right">

                          <p className="text-lg font-bold text-slate-900">
                            {applicationCount}
                          </p>

                          <p className="text-xs text-slate-500">
                            Applications
                          </p>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              '/employer/edit-jobs'
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Manage
                          <ArrowRight className="h-4 w-4" />
                        </button>

                      </div>

                    </div>
                  )
                })}

              </div>

            )}

          </section>


          {/* =================================================
              HIRING PIPELINE
          ================================================= */}

          <section className="mt-10 rounded-[2rem] bg-[#0f172a] p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:p-8">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Hiring Pipeline
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Track your hiring journey
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Move candidates through each stage of your recruitment process.
              </p>

            </div>


            <div className="mt-8 grid gap-3 md:grid-cols-5">

              {[
                {
                  label: 'Applied',
                  icon: Users,
                  count: applications.filter(
                    (application) =>
                      getApplicationStatus(
                        application
                      ) === 'APPLIED'
                  ).length,
                },

                {
                  label: 'Screening',
                  icon: Search,
                  count: applications.filter(
                    (application) =>
                      getApplicationStatus(
                        application
                      ) === 'SCREENING'
                  ).length,
                },

                {
                  label: 'Shortlisted',
                  icon: UserCheck,
                  count: applications.filter(
                    (application) =>
                      getApplicationStatus(
                        application
                      ) === 'SHORTLISTED'
                  ).length,
                },

                {
                  label: 'Interview',
                  icon: CalendarDays,
                  count: interviewApplications.length,
                },

                {
                  label: 'Selected',
                  icon: CheckCircle2,
                  count: applications.filter(
                    (application) => {

                      const status =
                        getApplicationStatus(
                          application
                        )

                      return (
                        status === 'SELECTED' ||
                        status === 'HIRED'
                      )
                    }
                  ).length,
                },

              ].map((stage, index) => {

                const Icon = stage.icon

                return (
                  <div
                    key={stage.label}
                    className="relative rounded-2xl border border-white/10 bg-white/5 p-5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

                        <Icon className="h-5 w-5 text-blue-300" />

                      </div>

                      <span className="text-2xl font-bold text-white">
                        {stage.count}
                      </span>

                    </div>


                    <p className="mt-4 text-sm font-semibold text-white">
                      {stage.label}
                    </p>


                    {index < 4 && (
                      <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-500 md:block" />
                    )}

                  </div>
                )
              })}

            </div>

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mt-10 pb-8">

            <div className="mb-5">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Quick Actions
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Manage your recruitment
              </h2>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* POST JOB */}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employer?type=JOB'
                  )
                }
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  Post a Job
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Create a new job opening and find the right candidate.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Post Job
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>

              </button>


              {/* POST INTERNSHIP */}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employer?type=INTERNSHIP'
                  )
                }
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  Post an Internship
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Create an internship opportunity for students and freshers.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-600">
                  Post Internship
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>

              </button>


              {/* MANAGE POSTS */}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employer/edit-jobs'
                  )
                }
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                  <BriefcaseBusiness className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  Manage Posts
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Edit or delete your existing job and internship posts.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                  Manage
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>

              </button>


              {/* APPLICANTS */}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employer/applicants'
                  )
                }
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  Applicants
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review candidates who applied to your opportunities.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View Applicants
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>

              </button>

            </div>

          </section>


          {/* =================================================
              SIMPLE PROCESS
          ================================================= */}

          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

              <div className="mb-10 text-center">

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  SIMPLE PROCESS
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Hiring made simple
                </h2>

                <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-500">
                  From creating an opportunity to finding the right candidate,
                  ONUS keeps your hiring journey simple.
                </p>

              </div>


              <div className="grid gap-6 lg:grid-cols-3">

                {/* 01 */}

                <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
                    01
                  </div>

                  <h3 className="mt-8 text-xl font-bold text-slate-900">
                    Create Opportunity
                  </h3>

                  <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-500">
                    Publish your job or internship with the details candidates need.
                  </p>

                </div>


                {/* 02 */}

                <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-2xl font-bold text-purple-600">
                    02
                  </div>

                  <h3 className="mt-8 text-xl font-bold text-slate-900">
                    Connect With Talent
                  </h3>

                  <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-500">
                    Discover and interact with candidates interested in your opportunities.
                  </p>

                </div>


                {/* 03 */}

                <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-2xl font-bold text-green-600">
                    03
                  </div>

                  <h3 className="mt-8 text-xl font-bold text-slate-900">
                    Grow Your Team
                  </h3>

                  <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-500">
                    Find the right people and build a stronger organisation.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

      </section>
    )
  }


  // =====================================================
  // POSTED JOBS PAGE
  // =====================================================

  if (page === 'posted-jobs') {
    return (
      <section className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Recruiter
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Posted Jobs
              </h1>

              <p className="mt-2 text-slate-500">
                All jobs and internships posted by your account.
              </p>

            </div>


            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employer?type=JOB'
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                Post a Job
              </button>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employer?type=INTERNSHIP'
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                <FileText className="h-4 w-4" />
                Post Internship
              </button>

            </div>

          </div>


          <div className="mb-6 flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search your jobs..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500"
              />

            </div>

          </div>


          {loadingJobs ? (

            <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">
              Loading your posted jobs...
            </div>

          ) : jobsError ? (

            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

              <p className="font-semibold text-red-700">
                {jobsError}
              </p>

              <button
                type="button"
                onClick={loadMyJobs}
                className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Try Again
              </button>

            </div>

          ) : filteredJobs.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <BriefcaseBusiness className="mx-auto h-12 w-12 text-slate-300" />

              <h2 className="mt-4 text-xl font-bold text-slate-800">
                No jobs found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                You haven't posted any matching opportunities.
              </p>

            </div>

          ) : (

            <div className="grid gap-5">

              {filteredJobs.map((job) => {

                const applicationCount =
                  applications.filter(
                    (application) => {

                      const applicationJob =
                        getApplicationJob(
                          application
                        )

                      return (
                        String(
                          applicationJob?.id
                        ) ===
                        String(job?.id)
                      )
                    }
                  ).length


                const isInternship =
                  String(
                    job?.type || ''
                  ).toUpperCase() ===
                  'INTERNSHIP'


                return (
                  <article
                    key={job.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex min-w-0 items-start gap-4">

                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                            isInternship
                              ? 'bg-purple-50'
                              : 'bg-blue-50'
                          }`}
                        >

                          {isInternship ? (
                            <FileText className="h-7 w-7 text-purple-600" />
                          ) : (
                            <BriefcaseBusiness className="h-7 w-7 text-blue-600" />
                          )}

                        </div>


                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="text-xl font-bold text-slate-900">
                              {job?.title}
                            </h2>


                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                              Active
                            </span>


                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                isInternship
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {isInternship
                                ? 'INTERNSHIP'
                                : 'JOB'}
                            </span>

                          </div>


                          <p className="mt-2 font-medium text-slate-600">
                            {job?.company}
                          </p>


                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">

                            {job?.location && (
                              <span>
                                📍 {job.location}
                              </span>
                            )}

                            {job?.jobType && (
                              <span>
                                • {job.jobType}
                              </span>
                            )}

                            {job?.salary && (
                              <span>
                                • ₹ {job.salary}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>


                      <div className="flex shrink-0 items-center gap-3">

                        <div className="text-center">

                          <p className="text-2xl font-bold text-slate-900">
                            {applicationCount}
                          </p>

                          <p className="text-xs text-slate-500">
                            Applications
                          </p>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              '/employer/applicants'
                            )
                          }
                          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Applicants
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              '/employer/edit-jobs'
                            )
                          }
                          className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Manage
                        </button>

                      </div>

                    </div>


                    {job?.description && (
                      <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
                        {job.description}
                      </p>
                    )}

                  </article>
                )
              })}

            </div>

          )}

        </div>

      </section>
    )
  }


  // =====================================================
  // APPLICANTS PAGE
  // =====================================================

  if (page === 'applicants') {
    return (
      <section className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Recruiter
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Applicants
            </h1>

            <p className="mt-2 text-slate-500">
              Candidates who applied to your posted jobs.
            </p>

          </div>


          <div className="mb-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Total Applications
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {applications.length}
              </p>

            </div>


            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Shortlisted
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {shortlistedApplications.length}
              </p>

            </div>


            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Interviews
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {interviewApplications.length}
              </p>

            </div>

          </div>


          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">

            {loadingApplications ? (

              <div className="p-12 text-center text-slate-500">
                Loading applicants...
              </div>

            ) : applicationsError ? (

              <div className="p-8">

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                  <p className="font-semibold text-red-700">
                    {applicationsError}
                  </p>

                  <button
                    type="button"
                    onClick={loadApplications}
                    className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Try Again
                  </button>

                </div>

              </div>

            ) : applications.length === 0 ? (

              <div className="p-12 text-center">

                <Users className="mx-auto h-12 w-12 text-slate-300" />

                <h2 className="mt-4 text-xl font-bold text-slate-800">
                  No applicants yet
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Candidates will appear here after applying to your jobs.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50 text-left">

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Candidate
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Position
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Experience
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Applied
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {applications.map(
                      (application, index) => {

                        const status =
                          getApplicationStatus(
                            application
                          )

                        return (
                          <tr
                            key={
                              application?.id ||
                              index
                            }
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                          >

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                  <UserRound className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                  <p className="font-semibold text-slate-900">
                                    {getCandidateName(
                                      application
                                    )}
                                  </p>

                                  {application?.email && (
                                    <p className="text-xs text-slate-500">
                                      {application.email}
                                    </p>
                                  )}

                                </div>

                              </div>

                            </td>


                            <td className="px-6 py-5 font-medium text-slate-700">
                              {getJobTitle(
                                application
                              )}
                            </td>


                            <td className="px-6 py-5 text-sm text-slate-600">
                              {getCandidateExperience(
                                application
                              )}
                            </td>


                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                  status
                                )}`}
                              >
                                {getStatusLabel(
                                  status
                                )}
                              </span>

                            </td>


                            <td className="px-6 py-5 text-sm text-slate-500">
                              {formatDate(
                                getApplicationDate(
                                  application
                                )
                              )}
                            </td>

                          </tr>
                        )
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </section>
    )
  }


  // =====================================================
  // COMPANY PROFILE PAGE
  // =====================================================

  if (page === 'company-profile') {
    return (
      <section className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Recruiter
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Company Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Your recruiter account information.
            </p>

          </div>


          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-5 border-b border-slate-100 pb-7">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {auth?.name || 'Recruiter'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Recruiter Account
                </p>

              </div>

            </div>


            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recruiter Name
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {auth?.name || 'Not available'}
                </p>

              </div>


              <div className="rounded-2xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {auth?.email || 'Not available'}
                </p>

              </div>


              <div className="rounded-2xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Role
                </p>

                <p className="mt-2 font-semibold capitalize text-slate-800">
                  {auth?.role || 'Recruiter'}
                </p>

              </div>


              <div className="rounded-2xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Posted Opportunities
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {jobs.length}
                </p>

              </div>

            </div>


            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex gap-3">

                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>

                  <p className="font-semibold text-blue-900">
                    Company profile information
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    Your current recruiter account details are shown above. Full company profile fields can be connected to a dedicated company-profile database API when those backend fields are available.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
    )
  }


  // =====================================================
  // FALLBACK
  // =====================================================

  return (
    <section className="min-h-screen bg-slate-50 p-10">

      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">

        <h1 className="text-2xl font-bold text-slate-900">
          Recruiter Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Page not found.
        </p>

      </div>

    </section>
  )
}