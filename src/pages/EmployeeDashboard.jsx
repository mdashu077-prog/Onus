import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  Gift,
  LayoutDashboard,
  MessageCircle,
  Search,
  Settings,
  Sparkles,
  Upload,
  UserRound,
  Users,
  X,
} from 'lucide-react'

import {
  getMyApplications,
  protectedRequest,
} from '../services/api'
import { jobSeekerNavItems } from '../config/navigation'

// ============================================================
// API
// ============================================================

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:9090'

// ============================================================
// SIDEBAR MENU
// ============================================================

const menuItems = [
  {
    label: 'Dashboard',
    path: '/employee',
    icon: LayoutDashboard,
  },
  {
    label: 'Find Jobs',
    path: '/jobs',
    icon: Search,
  },
  {
    label: 'My Applications',
    path: '/applications',
    icon: FileText,
  },
  {
    label: 'Saved Jobs',
    path: '/saved-jobs',
    icon: Bookmark,
  },
  {
    label: 'Interviews',
    path: '/applications',
    icon: CalendarDays,
  },
  {
    label: 'Resume',
    path: '/resume',
    icon: Upload,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: UserRound,
  },
]

// ============================================================
// APPLICATION PIPELINE
// ============================================================

const pipeline = [
  {
    key: 'APPLIED',
    label: 'Applied',
    icon: FileText,
  },
  {
    key: 'SCREENING',
    label: 'Screening',
    icon: Search,
  },
  {
    key: 'SHORTLISTED',
    label: 'Shortlisted',
    icon: CheckCircle2,
  },
  {
    key: 'INTERVIEW',
    label: 'Interview',
    icon: CalendarDays,
  },
  {
    key: 'SELECTED',
    label: 'Selected',
    icon: Gift,
  },
]

// ============================================================
// HELPERS
// ============================================================

const parse = (value, fallback = []) => {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value) ?? fallback
    } catch {
      return fallback
    }
  }

  return value ?? fallback
}

const badgeText = (count) => {
  const value = Number(count || 0)

  return value > 9
    ? '9+'
    : String(value)
}

const dateText = (value) => {
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

const statusLabel = (status) => {
  const value = String(
    status || 'APPLIED'
  ).toUpperCase()

  if (value === 'APPLIED') {
    return 'Applied'
  }

  return (
    value.charAt(0) +
    value.slice(1).toLowerCase()
  )
}

const statusClass = (status) => {
  switch (
    String(status || 'APPLIED').toUpperCase()
  ) {
    case 'SCREENING':
      return 'bg-amber-50 text-amber-700 border-amber-100'

    case 'SHORTLISTED':
      return 'bg-purple-50 text-purple-700 border-purple-100'

    case 'INTERVIEW':
      return 'bg-orange-50 text-orange-700 border-orange-100'

    case 'SELECTED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100'

    case 'REJECTED':
      return 'bg-red-50 text-red-700 border-red-100'

    default:
      return 'bg-blue-50 text-blue-700 border-blue-100'
  }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function EmployeeDashboard({ auth }) {
  const location = useLocation()

  // ==========================================================
  // SIDEBAR
  // ==========================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  // ==========================================================
  // DATA STATE
  // ==========================================================

  const [applications, setApplications] =
    useState([])

  const [savedJobCount, setSavedJobCount] =
    useState(0)

  const [resumeViews, setResumeViews] =
    useState(0)

  const [unreadMessages, setUnreadMessages] =
    useState(0)

  const [jobs, setJobs] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [type, setType] =
    useState('ALL')

  const [jobLocation, setJobLocation] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false)

  const [
    seenNotifications,
    setSeenNotifications,
  ] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          'onus_seen_notifications'
        ) || '[]'
      )
    } catch {
      return []
    }
  })

  // ==========================================================
  // LOAD APPLICATIONS + MESSAGES
  // ==========================================================

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          applicationsResult,
          messagesResult,
        ] = await Promise.allSettled([
          getMyApplications(),

          protectedRequest(
            '/api/messages/unread-count',
            {
              method: 'GET',
            }
          ),
        ])

        if (
          applicationsResult.status ===
          'fulfilled'
        ) {
          setApplications(
            parse(
              applicationsResult.value,
              []
            )
          )
        } else {
          setApplications([])
        }

        if (
          messagesResult.status ===
          'fulfilled'
        ) {
          const data = parse(
            messagesResult.value,
            {}
          )

          setUnreadMessages(
            Number(data?.count || 0)
          )
        } else {
          setUnreadMessages(0)
        }
      } catch (error) {
        console.error(
          'Dashboard load failed:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    const token =
      localStorage.getItem('onus_token')

    if (token) {
      loadDashboardData()
    } else {
      setLoading(false)
    }
  }, [])

  // ==========================================================
  // SAVED JOBS
  // ==========================================================

  useEffect(() => {
    function loadSavedJobs() {
      try {
        const saved =
          JSON.parse(
            localStorage.getItem(
              'onus_saved_jobs'
            ) || '[]'
          )

        setSavedJobCount(
          Array.isArray(saved)
            ? saved.length
            : 0
        )
      } catch {
        setSavedJobCount(0)
      }
    }

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

  // ==========================================================
  // RESUME VIEWS
  // ==========================================================

  useEffect(() => {
    const views = Number(
      localStorage.getItem(
        'onus_resume_views'
      ) || 0
    )

    setResumeViews(
      Number.isFinite(views)
        ? views
        : 0
    )
  }, [])

  useEffect(() => {
    function toggleDashboardSidebar(event) {
      if (event.detail?.toggle) {
        setSidebarOpen((value) => !value)
        return
      }

      setSidebarOpen(true)
    }

    window.addEventListener(
      'onus:open-dashboard-sidebar',
      toggleDashboardSidebar
    )

    return () => {
      window.removeEventListener(
        'onus:open-dashboard-sidebar',
        toggleDashboardSidebar
      )
    }
  }, [])

  useEffect(() => {
    if (!sidebarOpen) {
      return undefined
    }

    const isMobile = window.matchMedia(
      '(max-width: 1023px)'
    ).matches
    const previousOverflow = document.body.style.overflow

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
    }

    if (isMobile) {
      document.body.style.overflow = 'hidden'
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      if (isMobile) {
        document.body.style.overflow = previousOverflow
      }

      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [sidebarOpen])

  // ==========================================================
  // LOAD JOBS
  // ==========================================================

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch(
          `${BASE_URL}/api/jobs`
        )

        if (!response.ok) {
          throw new Error(
            `Jobs API failed: ${response.status}`
          )
        }

        const data =
          await response.json()

        setJobs(
          Array.isArray(data)
            ? data
            : []
        )
      } catch (error) {
        console.error(
          'Failed to load jobs:',
          error
        )

        setJobs([])
      }
    }

    loadJobs()
  }, [])

  // ==========================================================
  // APPLICATION COUNTS
  // ==========================================================

  const counts = useMemo(() => {
    const result = {
      APPLIED: 0,
      SCREENING: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      SELECTED: 0,
      REJECTED: 0,
    }

    applications.forEach(
      (application) => {
        const status = String(
          application?.status ||
            'APPLIED'
        ).toUpperCase()

        if (
          result[status] !== undefined
        ) {
          result[status]++
        }
      }
    )

    return result
  }, [applications])

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const notificationUpdates =
    useMemo(() => {
      return applications
        .filter((application) => {
          const status = String(
            application?.status ||
              'APPLIED'
          ).toUpperCase()

          return status !== 'APPLIED'
        })
        .map((application) => {
          const status = String(
            application?.status ||
              'APPLIED'
          ).toUpperCase()

          const id = String(
            application?.id ||
              `${application?.jobId || 'job'}-${status}-${application?.updatedAt || application?.createdAt || ''}`
          )

          const job =
            application?.job || {}

          return {
            id,

            title:
              job?.title ||
              application?.jobTitle ||
              application?.position ||
              'Job Application',

            company:
              job?.company ||
              application?.company ||
              'Company',

            status,

            date:
              application?.updatedAt ||
              application?.createdAt ||
              application?.appliedAt,
          }
        })
        .filter(
          (item) =>
            !seenNotifications.includes(
              item.id
            )
        )
    }, [
      applications,
      seenNotifications,
    ])

  const notificationCount =
    notificationUpdates.length

  const markNotificationsAsSeen =
    () => {
      const ids =
        notificationUpdates.map(
          (item) => item.id
        )

      const updated = [
        ...new Set([
          ...seenNotifications,
          ...ids,
        ]),
      ]

      setSeenNotifications(updated)

      localStorage.setItem(
        'onus_seen_notifications',
        JSON.stringify(updated)
      )

      setNotificationOpen(false)
    }

  // ==========================================================
  // USER
  // ==========================================================

  const userName =
    auth?.name ||
    auth?.user?.name ||
    localStorage.getItem(
      'onus_user_name'
    ) ||
    'there'

  // ==========================================================
  // FILTERED JOBS
  // ==========================================================

  const filteredJobs = useMemo(() => {
    const keyword =
      search.trim().toLowerCase()

    const locationKeyword =
      jobLocation.trim().toLowerCase()

    return jobs
      .filter((job) => {
        if (
          type !== 'ALL' &&
          String(
            job?.type || ''
          ).toUpperCase() !== type
        ) {
          return false
        }

        return true
      })
      .filter((job) => {
        if (!keyword) {
          return true
        }

        const text = [
          job?.title,
          job?.company,
          job?.description,
          job?.skills,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return text.includes(keyword)
      })
      .filter((job) => {
        if (!locationKeyword) {
          return true
        }

        return String(
          job?.location || ''
        )
          .toLowerCase()
          .includes(locationKeyword)
      })
      .slice(0, 6)
  }, [
    jobs,
    search,
    type,
    jobLocation,
  ])

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="relative w-full min-w-0 overflow-x-hidden bg-[#f6f9fd]">

      {/* ======================================================
          MOBILE / DESKTOP SIDEBAR OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-slate-950/30 lg:absolute lg:inset-0 lg:bg-transparent"
        />
      )}

      {/* ======================================================
          SIDEBAR

          IMPORTANT:
          - NOT fixed
          - NOT h-screen
          - NOT top-0 relative to browser
          - It is bounded by this dashboard section
          - Therefore it cannot cover global navbar/footer
      ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          bottom-0
          z-50
          w-[260px]
          border-r
          border-slate-200
          bg-white
          shadow-[10px_0_35px_rgba(15,23,42,0.05)]
          transition-transform
          duration-300
          ease-in-out

          lg:absolute

          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        <div className="flex h-full flex-col">

          {/* ==================================================
              SIDEBAR HEADER
          ================================================== */}

          <div className="flex h-24 shrink-0 items-center justify-between border-b border-slate-100 px-5">

            <Link
              to="/employee"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="flex items-center gap-3"
            >

              {/* <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <BriefcaseBusiness className="h-6 w-6" />
              </div> */}

              <div>
                <p className="text-lg font-black tracking-tight text-slate-900">
                  ONUS
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Career Platform
                </p>
              </div>

            </Link>

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(false)
              }
              aria-label="Close sidebar"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <nav className="min-h-0 flex-1 overflow-y-auto p-4">

            <p className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Menu
            </p>

            <div className="space-y-1">

              <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Explore
              </p>

              {jobSeekerNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={`
                    flex
                    items-center
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition

                    ${
                      location.pathname === item.to
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-3 border-t border-slate-100" />

              <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Dashboard
              </p>

              {menuItems.map((item) => {
                const Icon = item.icon

                const active =
                  location.pathname ===
                  item.path

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      transition

                      ${
                        active
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >

                    <Icon className="h-[18px] w-[18px]" />

                    <span className="flex-1">
                      {item.label}
                    </span>

                    {item.label ===
                      'Saved Jobs' &&
                      savedJobCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                          {badgeText(
                            savedJobCount
                          )}
                        </span>
                      )}

                  </Link>
                )
              })}

            </div>

            <div className="my-5 border-t border-slate-100" />

            {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setNotificationOpen(
                    (value) => !value
                  )
                }
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              >

                <span className="flex items-center gap-3">

                  <Bell className="h-[18px] w-[18px]" />

                  Notifications

                </span>

                {notificationCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {badgeText(
                      notificationCount
                    )}
                  </span>
                )}

              </button>

              {notificationOpen && (
                <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.15)]">

                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                    <div>

                      <p className="text-sm font-bold text-slate-900">
                        Notifications
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {notificationCount > 0
                          ? `${notificationCount} new update${
                              notificationCount ===
                              1
                                ? ''
                                : 's'
                            }`
                          : 'All caught up'}
                      </p>

                    </div>

                    {notificationCount >
                      0 && (
                      <button
                        type="button"
                        onClick={
                          markNotificationsAsSeen
                        }
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}

                  </div>

                  <div className="max-h-[280px] overflow-y-auto">

                    {notificationUpdates.length ===
                    0 ? (
                      <div className="px-4 py-8 text-center">

                        <Bell className="mx-auto h-7 w-7 text-slate-300" />

                        <p className="mt-2 text-xs font-semibold text-slate-600">
                          No new notifications
                        </p>

                      </div>
                    ) : (
                      notificationUpdates.map(
                        (notification) => (
                          <div
                            key={
                              notification.id
                            }
                            className="border-b border-slate-100 px-4 py-3 last:border-b-0"
                          >

                            <div className="flex gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <BriefcaseBusiness className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">

                                <p className="text-xs font-bold text-slate-800">
                                  Application
                                  Update
                                </p>

                                <p className="mt-1 text-[11px] leading-4 text-slate-500">

                                  Your
                                  application
                                  for{' '}

                                  <span className="font-semibold text-slate-700">
                                    {
                                      notification.title
                                    }
                                  </span>{' '}

                                  is now{' '}

                                  <span className="font-semibold text-blue-600">
                                    {statusLabel(
                                      notification.status
                                    )}
                                  </span>
                                  .

                                </p>

                                <p className="mt-1 text-[9px] text-slate-400">
                                  {dateText(
                                    notification.date
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>
                        )
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* ==================================================
                MESSAGES
            ================================================== */}

            <Link
              to="/messages"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="mt-1 flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >

              <span className="flex items-center gap-3">

                <MessageCircle className="h-[18px] w-[18px]" />

                Messages

              </span>

              {unreadMessages > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                  {badgeText(
                    unreadMessages
                  )}
                </span>
              )}

            </Link>

          </nav>

          {/* ==================================================
              SETTINGS
          ================================================== */}

          <div className="shrink-0 border-t border-slate-100 bg-white p-4">

            <Link
              to="/settings"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >

              <Settings className="h-[18px] w-[18px]" />

              Settings

            </Link>

          </div>

        </div>
      </aside>

      {/* ======================================================
          MAIN CONTENT

          Sidebar open:
          desktop -> 260px space reserved

          Sidebar closed:
          desktop -> full width

          Mobile:
          sidebar overlays content as drawer
      ====================================================== */}

      <div
        className={`
          relative
          min-w-0
          w-full
          transition-[padding]
          duration-300
          ease-in-out

          ${
            sidebarOpen
              ? 'lg:pl-[260px]'
              : 'lg:pl-0'
          }
        `}
      >

        {/* ==================================================
            DASHBOARD MAIN
        ================================================== */}

        <main className="relative mx-auto w-full max-w-[1500px] overflow-x-hidden px-4 pb-12 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">

          {/* ==================================================
              WELCOME + PIPELINE
          ================================================== */}

          <section className="relative grid w-full gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">

            {/* WELCOME */}

            <div className="relative min-w-0 overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-[#e8f4ff] via-[#eef3ff] to-[#f8edff] p-6 shadow-[0_18px_50px_rgba(59,92,150,0.08)] sm:p-8">

              <div className="relative z-10">

                <div className="mb-4">

                  <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 shadow-sm">
                    Job Seeker Dashboard
                  </span>

                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px]">
                  Hi, {userName}!
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  Great to see you again.
                  Let's find the right
                  opportunity and take
                  your next career step.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    <Search className="h-4 w-4" />
                    Find Jobs
                  </Link>

                  <Link
                    to="/applications"
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-white"
                  >
                    <FileText className="h-4 w-4" />
                    My Applications
                  </Link>

                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">

                  <span className="flex items-center gap-1.5">

                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    {applications.length}{' '}
                    applications

                  </span>

                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                  <span className="flex items-center gap-1.5">

                    <CalendarDays className="h-4 w-4 text-purple-500" />

                    {counts.INTERVIEW}{' '}
                    interview
                    {counts.INTERVIEW ===
                    1
                      ? ''
                      : 's'}

                  </span>

                </div>

              </div>

            </div>

            {/* PIPELINE */}

            <div className="relative min-w-0 rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_20px_55px_rgba(15,23,42,0.12)] sm:p-6">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-300">
                    Application Pipeline
                  </p>

                  <h2 className="mt-1 text-lg font-bold sm:text-xl">
                    Track your journey
                  </h2>

                </div>

                <Link
                  to="/applications"
                  className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  View all
                </Link>

              </div>

              <div className="mt-4 space-y-2">

                {pipeline.map(
                  (stage) => {
                    const Icon =
                      stage.icon

                    const count =
                      counts[
                        stage.key
                      ]

                    return (
                      <Link
                        key={
                          stage.key
                        }
                        to="/applications"
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5 transition hover:border-blue-400/30 hover:bg-white/[0.08]"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-blue-300">
                          <Icon className="h-4 w-4" />
                        </div>

                        <span className="flex-1 truncate text-xs font-semibold text-slate-300">
                          {stage.label}
                        </span>

                        <span className="text-lg font-bold text-white">
                          {count}
                        </span>

                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />

                      </Link>
                    )
                  }
                )}

              </div>

            </div>

          </section>

          {/* ==================================================
              STATS
          ================================================== */}

          <section className="relative mt-5 grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <Link
              to="/applications"
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-100"
            >

              <div className="flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                  Applications
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="h-4 w-4" />
                </span>

              </div>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {applications.length}
              </p>

              <p className="mt-1 text-[11px] font-semibold text-blue-600">
                View applications →
              </p>

            </Link>

            <Link
              to="/saved-jobs"
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-100"
            >

              <div className="flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                  Saved Jobs
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Bookmark className="h-4 w-4" />
                </span>

              </div>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {savedJobCount}
              </p>

              <p className="mt-1 text-[11px] font-semibold text-amber-600">
                View saved jobs →
              </p>

            </Link>

            <Link
              to="/resume"
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-100"
            >

              <div className="flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                  Resume Views
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Users className="h-4 w-4" />
                </span>

              </div>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {resumeViews}
              </p>

              <p className="mt-1 text-[11px] font-semibold text-purple-600">
                Resume analytics →
              </p>

            </Link>

            <Link
              to="/applications"
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-100"
            >

              <div className="flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                  Interviews
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <CalendarDays className="h-4 w-4" />
                </span>

              </div>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {counts.INTERVIEW}
              </p>

              <p className="mt-1 text-[11px] font-semibold text-orange-600">
                View scheduled →
              </p>

            </Link>

          </section>

          {/* ==================================================
              PROFILE + QUICK ACTIONS
          ================================================== */}

          <section className="relative mt-5 grid w-full gap-5 lg:grid-cols-2">

            {/* PROFILE */}

            <div className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                    Profile
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Profile Strength
                  </h2>

                </div>

                <Sparkles className="h-5 w-5 text-blue-500" />

              </div>

              <div className="mt-5 flex items-center gap-4">

                <div className="relative h-20 w-20 shrink-0">

                  <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full -rotate-90"
                  >

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e9eef5"
                      strokeWidth="9"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray="251"
                      strokeDashoffset="62.75"
                    />

                  </svg>

                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
                    75%
                  </span>

                </div>

                <div>

                  <p className="font-bold text-emerald-600">
                    Good!
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Complete your profile
                    to improve your
                    chances of getting
                    noticed.
                  </p>

                </div>

              </div>

              <Link
                to="/profile"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
              >
                Improve Profile
                <ChevronRight className="h-4 w-4" />
              </Link>

            </div>

            {/* QUICK ACTIONS */}

            <div className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                    Shortcuts
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Quick Actions
                  </h2>

                </div>

                <Sparkles className="h-5 w-5 text-slate-300" />

              </div>

              <div className="mt-3 grid gap-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">

                <Link
                  to="/resume"
                  className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-3 text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                >

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Upload className="h-4 w-4" />
                  </span>

                  <span className="flex-1 font-medium">
                    Upload Resume
                  </span>

                </Link>

                <Link
                  to="/profile"
                  className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-3 text-sm text-slate-600 transition hover:bg-purple-50 hover:text-purple-600"
                >

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <UserRound className="h-4 w-4" />
                  </span>

                  <span className="flex-1 font-medium">
                    Edit Profile
                  </span>

                </Link>

                <Link
                  to="/jobs"
                  className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-3 text-sm text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600"
                >

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Bell className="h-4 w-4" />
                  </span>

                  <span className="flex-1 font-medium">
                    Job Alerts
                  </span>

                </Link>

              </div>

            </div>

          </section>

          {/* ==================================================
              REFERRAL
          ================================================== */}

          <section className="relative mt-5 w-full overflow-hidden rounded-[24px] bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-6 text-white shadow-[0_18px_50px_rgba(37,99,235,0.18)] sm:p-7">

            <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 right-40 h-44 w-44 rounded-full bg-white/5" />

            <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <Gift className="h-5 w-5 text-blue-100" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100">
                    Referral & Earn
                  </span>

                </div>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  Refer a friend & earn
                  rewards!
                </h2>

                <p className="mt-1 max-w-xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Help your friends discover
                  great opportunities on
                  ONUS.
                </p>

              </div>

              <Link
                to="/referral"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-blue-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Refer Now
                <ChevronRight className="h-4 w-4" />
              </Link>

            </div>

          </section>

          {/* ==================================================
              JOB SEARCH
          ================================================== */}

          <section className="relative mt-5 w-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-7">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                Discover
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                Find your next opportunity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search jobs by keyword,
                type and location.
              </p>

            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1.4fr_0.7fr_0.7fr_auto]">

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Job title, skills or company"
                className="h-12 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value
                  )
                }
                className="h-12 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              >

                <option value="ALL">
                  All Types
                </option>

                <option value="FULL-TIME">
                  Full-time
                </option>

                <option value="PART-TIME">
                  Part-time
                </option>

                <option value="INTERNSHIP">
                  Internship
                </option>

              </select>

              <input
                value={jobLocation}
                onChange={(event) =>
                  setJobLocation(
                    event.target.value
                  )
                }
                placeholder="Location"
                className="h-12 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              <Link
                to="/jobs"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <Filter className="h-4 w-4" />
                Search
              </Link>

            </div>

            {/* SEARCH RESULTS */}

            <div className="relative mt-5 grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3">

              {filteredJobs.length ===
              0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center md:col-span-2 xl:col-span-3">

                  <Search className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No jobs match your
                    search
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Try another keyword
                    or location.
                  </p>

                </div>
              ) : (
                filteredJobs.map(
                  (job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="group relative min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="truncate text-sm font-bold text-slate-900">
                            {job.title ||
                              'Untitled job'}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {job.company ||
                              'Company'}
                          </p>

                        </div>

                        <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase text-blue-600">
                          {String(
                            job.type ||
                              'JOB'
                          ).toLowerCase()}
                        </span>

                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {job.location && (
                          <span className="flex max-w-full items-center gap-1 truncate rounded-full bg-white px-2.5 py-1 text-[10px] text-slate-500">
                            <span>📍</span>
                            {job.location}
                          </span>
                        )}

                        {job.jobType && (
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] text-slate-500">
                            {job.jobType}
                          </span>
                        )}

                        {job.salary && (
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                            ₹ {job.salary}
                          </span>
                        )}

                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        <span className="text-[10px] font-bold text-blue-600">
                          View opportunity
                        </span>

                        <ChevronRight className="h-4 w-4 text-blue-500 transition group-hover:translate-x-1" />

                      </div>

                    </Link>
                  )
                )
              )}

            </div>

          </section>

          {/* ==================================================
              RECENT APPLICATIONS
          ================================================== */}

          <section className="relative mt-5 w-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-7">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  Applications
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  Recent applications
                </h2>

              </div>

              <Link
                to="/applications"
                className="flex shrink-0 items-center gap-1 text-xs font-bold text-blue-600"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>

            </div>

            <div className="relative mt-5 flex w-full flex-col gap-3">

              {applications
                .slice(0, 4)
                .map(
                  (application) => {

                    const job =
                      application?.job ||
                      {}

                    const status =
                      String(
                        application?.status ||
                          'APPLIED'
                      ).toUpperCase()

                    const jobId =
                      application?.job
                        ?.id ||
                      application?.jobId

                    return (
                      <div
                        key={
                          application.id
                        }
                        className="relative flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white font-bold text-blue-600 shadow-sm">

                            {String(
                              job?.company ||
                                job?.title ||
                                'J'
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-sm font-bold text-slate-900">

                              {job.title ||
                                application?.jobTitle ||
                                application?.position ||
                                'Job opportunity'}

                            </h3>

                            <p className="mt-1 truncate text-xs text-slate-500">

                              {job.company ||
                                application?.company ||
                                'Company'}

                            </p>

                            <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">

                              <Clock3 className="h-3 w-3" />

                              Applied{' '}

                              {dateText(
                                application?.appliedAt ||
                                  application?.createdAt
                              )}

                            </p>

                          </div>

                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">

                          <span
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${statusClass(
                              status
                            )}`}
                          >
                            {statusLabel(
                              status
                            )}
                          </span>

                          {jobId && (
                            <Link
                              to={`/jobs/${jobId}`}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              View job
                            </Link>
                          )}

                        </div>

                      </div>
                    )
                  }
                )}

              {applications.length ===
                0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">

                  <FileText className="mx-auto h-9 w-9 text-slate-300" />

                  <p className="mt-3 text-sm font-bold text-slate-700">
                    No applications yet
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Search for a job and
                    submit your first
                    application.
                  </p>

                  <Link
                    to="/jobs"
                    className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white"
                  >
                    Find Jobs
                  </Link>

                </div>
              )}

            </div>

          </section>

        </main>

      </div>

    </section>
  )
}