import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  LogOut,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'

import { deleteAdminUser, protectedRequest } from '../services/api'

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'recruiters', label: 'Recruiters', icon: ShieldCheck },
  { key: 'job-seekers', label: 'Job Seekers', icon: Users },
  { key: 'jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { key: 'applications', label: 'Applications', icon: FileText },
  { key: 'companies', label: 'Companies', icon: Building2 },
  { key: 'settings', label: 'Settings', icon: Settings },
]

const formatDate = (value) => {
  if (!value) {
    return '—'
  }

  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

const normalizeRole = (value) => {
  if (!value) {
    return 'unknown'
  }

  return String(value).trim().toLowerCase()
}

const getStatusTone = (status) => {
  const normalized = String(status || '').trim().toLowerCase()

  if (['accepted', 'hired', 'approved'].includes(normalized)) {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  }

  if (['rejected', 'declined'].includes(normalized)) {
    return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
  }

  if (['interview', 'shortlisted'].includes(normalized)) {
    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  }

  return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
}

export default function AdminDashboard({ auth, onLogout }) {
  const [selectedSection, setSelectedSection] = useState('dashboard')
  const [dashboard, setDashboard] = useState({
    stats: {
      totalUsers: 0,
      totalRecruiters: 0,
      totalJobSeekers: 0,
      totalJobs: 0,
      totalApplications: 0,
    },
    users: [],
    recruiters: [],
    jobSeekers: [],
    jobs: [],
    applications: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [deletingUserId, setDeletingUserId] = useState(null)
  const navigate = useNavigate()

  const refreshDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await protectedRequest('/api/admin/dashboard')

      setDashboard({
        stats: data?.stats || {
          totalUsers: 0,
          totalRecruiters: 0,
          totalJobSeekers: 0,
          totalJobs: 0,
          totalApplications: 0,
        },
        users: Array.isArray(data?.users) ? data.users : [],
        recruiters: Array.isArray(data?.recruiters) ? data.recruiters : [],
        jobSeekers: Array.isArray(data?.jobSeekers) ? data.jobSeekers : [],
        jobs: Array.isArray(data?.jobs) ? data.jobs : [],
        applications: Array.isArray(data?.applications) ? data.applications : [],
      })
    } catch (err) {
      const message =
        err?.message === 'Access denied. Admin privileges are required.'
          ? 'Access denied. Admin privileges are required.'
          : err?.message || 'Unable to load admin dashboard.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth || normalizeRole(auth.role) !== 'admin') {
      navigate('/login', { replace: true })
      return
    }

    refreshDashboard()
  }, [auth, navigate])

  const statsCards = useMemo(
    () => [
      {
        label: 'Total Users',
        value: dashboard.stats.totalUsers,
        detail: 'Platform members',
        icon: Users,
      },
      {
        label: 'Total Recruiters',
        value: dashboard.stats.totalRecruiters,
        detail: 'Hiring accounts',
        icon: ShieldCheck,
      },
      {
        label: 'Total Job Seekers',
        value: dashboard.stats.totalJobSeekers,
        detail: 'Active candidates',
        icon: Users,
      },
      {
        label: 'Total Jobs',
        value: dashboard.stats.totalJobs,
        detail: 'Live postings',
        icon: BriefcaseBusiness,
      },
      {
        label: 'Total Applications',
        value: dashboard.stats.totalApplications,
        detail: 'Submitted applications',
        icon: FileText,
      },
    ],
    [dashboard.stats]
  )

  const companyList = useMemo(() => {
    const names = new Set()

    dashboard.jobs.forEach((job) => {
      if (job?.company) {
        names.add(job.company)
      }
    })

    return [...names].map((company) => ({
      name: company,
      jobs: dashboard.jobs.filter((job) => job.company === company).length,
    }))
  }, [dashboard.jobs])

  async function handleDeleteUser(id, userName, email) {
    if (!id) {
      return
    }

    if (email && email.toLowerCase() === auth?.email?.toLowerCase()) {
      setError('Admin cannot delete their own account.')
      setSuccessMessage('')
      return
    }

    const userLabel = userName || email || 'this user'
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userLabel}?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccessMessage('')
      setDeletingUserId(id)
      const response = await deleteAdminUser(id)
      setSuccessMessage(response?.message || 'User deleted successfully.')
      await refreshDashboard()
    } catch (err) {
      setError(err?.message || 'Unable to delete this user.')
    } finally {
      setDeletingUserId(null)
    }
  }

  async function handleDeleteJob(id) {
    if (!id) {
      return
    }

    const confirmed = window.confirm('Delete this job listing?')
    if (!confirmed) {
      return
    }

    try {
      setError('')
      await protectedRequest(`/api/admin/jobs/${id}`, { method: 'DELETE' })
      await refreshDashboard()
    } catch (err) {
      setError(err?.message || 'Unable to delete this job.')
    }
  }

  const renderSectionContent = () => {
    if (selectedSection === 'users') {
      return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Created At</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-medium text-slate-900">{user.name || 'Unnamed User'}</td>
                    <td className="px-5 py-4">{user.email}</td>
                    <td className="px-5 py-4 capitalize">{normalizeRole(user.role)}</td>
                    <td className="px-5 py-4">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                        disabled={
                          deletingUserId === user.id ||
                          user.email?.toLowerCase() === auth?.email?.toLowerCase()
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingUserId === user.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (selectedSection === 'recruiters') {
      return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Recruiters</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Created At</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recruiters.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-5 py-4">{user.email}</td>
                    <td className="px-5 py-4">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
                        Recruiter
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (selectedSection === 'job-seekers') {
      return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Job Seekers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Created At</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.jobSeekers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-5 py-4">{user.email}</td>
                    <td className="px-5 py-4">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (selectedSection === 'jobs') {
      return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Jobs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Job Title</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Job Type</th>
                  <th className="px-5 py-3">Recruiter</th>
                  <th className="px-5 py-3">Created At</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.jobs.map((job) => (
                  <tr key={job.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-medium text-slate-900">{job.title}</td>
                    <td className="px-5 py-4">{job.company || '—'}</td>
                    <td className="px-5 py-4">{job.location || '—'}</td>
                    <td className="px-5 py-4 capitalize">{job.type || '—'}</td>
                    <td className="px-5 py-4">{job.recruiterName || job.company || '—'}</td>
                    <td className="px-5 py-4">{formatDate(job.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (selectedSection === 'applications') {
      return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Applications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">Job</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Applied At</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.applications.map((application) => (
                  <tr key={application.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-medium text-slate-900">{application.candidateName || 'Unknown Candidate'}</td>
                    <td className="px-5 py-4">{application.jobTitle || '—'}</td>
                    <td className="px-5 py-4">{application.company || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusTone(application.status)}`}>
                        {application.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">{formatDate(application.appliedAt || application.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (selectedSection === 'companies') {
      return (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companyList.map((company) => (
            <div key={company.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Company</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{company.name}</h3>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                  {company.jobs} jobs
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (selectedSection === 'settings') {
      return (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Platform</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">ONUS administration</h3>
            <p className="mt-3 text-sm text-slate-600">
              Monitor hiring activity, manage users, and keep the platform secure from a single place.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Access</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Admin session</h3>
            <p className="mt-3 text-sm text-slate-600">
              Signed in as <span className="font-semibold text-slate-900">{auth?.email}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                onLogout?.()
                navigate('/login', { replace: true })
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {statsCards.map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-900">{value}</h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">{detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recent users</h3>
            <div className="mt-4 space-y-3">
              {dashboard.users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="font-medium text-slate-900">{user.name || 'Unnamed User'}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200 capitalize">
                    {normalizeRole(user.role)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Latest applications</h3>
            <div className="mt-4 space-y-3">
              {dashboard.applications.slice(0, 5).map((application) => (
                <div key={application.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="font-medium text-slate-900">{application.candidateName || 'Candidate'}</p>
                    <p className="text-xs text-slate-500">{application.jobTitle || 'Job application'}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusTone(application.status)}`}>
                    {application.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 xl:px-8">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Admin</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">ONUS</h2>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {sidebarItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedSection(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  selectedSection === key
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-8 border-t border-slate-200 pt-5">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Admin Profile</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{auth?.name || auth?.email || 'Admin'}</p>
              <p className="text-xs text-slate-500">{auth?.email}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onLogout?.()
                navigate('/login', { replace: true })
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Admin Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-slate-900">Manage the ONUS career platform</h1>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              System online
            </span>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {loading ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Loading admin data...
            </div>
          ) : (
            renderSectionContent()
          )}
        </main>
      </div>
    </div>
  )
}
