import { useEffect, useRef, useState } from 'react'
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  Menu,
  User,
  Bell,
  MessageCircle,
  BriefcaseBusiness,
  Users,
  Building2,
  Gift,
  Pencil,
  X,
} from 'lucide-react'

import { protectedRequest } from '../services/api'
import { jobSeekerNavItems } from '../config/navigation'

// =====================================================
// RECRUITER NAVIGATION
// =====================================================

const recruiterNavItems = [
  {
    type: 'home',
    to: '/employer',
    label: 'Home',
  },

  {
    type: 'section',
    id: 'posted-jobs',
    label: 'Posted Jobs',
    icon: BriefcaseBusiness,
  },

  {
    type: 'section',
    id: 'manage-jobs',
    label: 'Edit Posts',
    icon: Pencil,
  },

  {
    type: 'section',
    id: 'applicants',
    label: 'Applicants',
    icon: Users,
  },

  {
    type: 'section',
    id: 'company-profile',
    label: 'Company Profile',
    icon: Building2,
  },

  {
    type: 'link',
    to: '/recruiters',
    label: 'Recruiters',
  },

  {
    type: 'link',
    to: '/referral-earn',
    label: 'Referral & Earn',
    icon: Gift,
  },
]

// =====================================================
// BADGE TEXT
// =====================================================

const badgeText = (count) => {
  const value = Number(count || 0)

  return value > 9 ? '9+' : String(value)
}

// =====================================================
// NAVBAR
// =====================================================

export default function Navbar({ auth, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const [unreadMessages, setUnreadMessages] = useState(0)

  const [notificationItems, setNotificationItems] = useState([])
  const [notificationCount, setNotificationCount] = useState(0)

  const badgeRequestInFlight = useRef(false)

  // =====================================================
  // REFS
  // =====================================================

  const headerRef = useRef(null)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)
  const mobileProfileRef = useRef(null)

  // =====================================================
  // ROUTER
  // =====================================================

  const navigate = useNavigate()
  const location = useLocation()

  // =====================================================
  // ROLE
  // =====================================================

  const isRecruiter =
    auth?.role?.toLowerCase() === 'recruiter'

  const jobSeekerRoutes = [
    '/employee',
    '/jobs',
    '/fresher',
    '/internships',
    '/companies',
    '/recruiters',
    '/referral-earn',
    '/applications',
    '/saved-jobs',
    '/resume',
    '/messages',
    '/profile',
    '/settings',
  ]

  const showDashboardMenuButton =
    !!auth &&
    !isRecruiter &&
    jobSeekerRoutes.includes(location.pathname)

  const navItems = isRecruiter
    ? recruiterNavItems
    : jobSeekerNavItems

  const dashboardMenuItems = [
    {
      label: 'Dashboard',
      path: '/employee',
    },
    {
      label: 'Find Jobs',
      path: '/jobs',
    },
    {
      label: 'My Applications',
      path: '/applications',
    },
    {
      label: 'Saved Jobs',
      path: '/saved-jobs',
    },
    {
      label: 'Resume',
      path: '/resume',
    },
    {
      label: 'Profile',
      path: '/profile',
    },
  ]

  // =====================================================
  // LOAD BADGES
  // =====================================================

  async function loadBadges() {
    if (!auth) {
      setUnreadMessages(0)
      setNotificationItems([])
      setNotificationCount(0)
      return
    }

    if (badgeRequestInFlight.current) {
      return
    }

    badgeRequestInFlight.current = true

    try {
      // =================================================
      // UNREAD MESSAGES
      // =================================================

      try {
        const response = await protectedRequest(
          '/api/messages/unread-count',
          {
            method: 'GET',
          }
        )

        let data = response

        if (typeof response === 'string') {
          try {
            data = JSON.parse(response)
          } catch {
            data = {}
          }
        }

        setUnreadMessages(
          Number(data?.count || 0)
        )
      } catch {
        setUnreadMessages(0)
      }

      // =================================================
      // JOB SEEKER NOTIFICATIONS
      // =================================================

      if (!isRecruiter) {
        try {
          const response = await protectedRequest(
            '/api/applications/my',
            {
              method: 'GET',
            }
          )

          let apps = response

          if (typeof response === 'string') {
            try {
              apps = JSON.parse(response)
            } catch {
              apps = []
            }
          }

          const allUpdates = (
            Array.isArray(apps)
              ? apps
              : []
          ).filter(
            (app) =>
              String(
                app?.status || 'APPLIED'
              ).toUpperCase() !== 'APPLIED'
          )

          setNotificationCount(
            allUpdates.length
          )

          const updates = allUpdates
            .slice(0, 5)
            .map((app) => ({
              id: app?.id,

              title:
                app?.job?.title ||
                app?.jobTitle ||
                app?.position ||
                'Application update',

              company:
                app?.job?.company ||
                app?.company ||
                'Company',

              status: String(
                app?.status || 'APPLIED'
              ).toUpperCase(),
            }))

          setNotificationItems(updates)
        } catch {
          setNotificationItems([])
          setNotificationCount(0)
        }
      } else {
        setNotificationItems([])
        setNotificationCount(0)
      }
    } finally {
      badgeRequestInFlight.current = false
    }
  }

  // =====================================================
  // LOAD BADGES ON START + EVERY 30 SECONDS
  // =====================================================

  useEffect(() => {
    loadBadges()

    const timer = window.setInterval(
      loadBadges,
      30000
    )

    return () => {
      window.clearInterval(timer)
    }
  }, [auth, isRecruiter])

  // =====================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    function outside(event) {
      // -----------------------------------------------
      // MOBILE MENU
      // -----------------------------------------------

      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
      }

      // -----------------------------------------------
      // NOTIFICATIONS
      // -----------------------------------------------

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false)
      }

      // -----------------------------------------------
      // PROFILE
      // -----------------------------------------------

      const insideProfile =
        profileRef.current?.contains(event.target) ||
        mobileProfileRef.current?.contains(event.target)

      if (!insideProfile) {
        setProfileOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      outside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        outside
      )
    }
  }, [])

  // =====================================================
  // MOBILE MENU ESCAPE / BODY LOCK
  // =====================================================

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const isMobile = window.matchMedia(
      '(max-width: 1023px)'
    ).matches

    const previousOverflow =
      document.body.style.overflow

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    if (isMobile) {
      document.body.style.overflow = 'hidden'
    }

    document.addEventListener(
      'keydown',
      closeOnEscape
    )

    return () => {
      if (isMobile) {
        document.body.style.overflow =
          previousOverflow
      }

      document.removeEventListener(
        'keydown',
        closeOnEscape
      )
    }
  }, [menuOpen])

  // =====================================================
  // CLOSE ALL MENUS
  // =====================================================

  const closeAll = () => {
    setMenuOpen(false)
    setNotificationsOpen(false)
    setProfileOpen(false)
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    onLogout?.()

    closeAll()

    navigate('/')
  }

  // =====================================================
  // OPEN MESSAGES
  // =====================================================

  const messages = () => {
    closeAll()
    navigate('/messages')
  }

  // =====================================================
  // MENU TOGGLE
  // =====================================================

  const handleMenuToggle = (event) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()

    setMenuOpen((value) => !value)
    setProfileOpen(false)
    setNotificationsOpen(false)
  }

  // =====================================================
  // NAVIGATION CLICK
  // =====================================================

  const navClick = (item) => {
    closeAll()

    if (isRecruiter && item.type === 'home') {
      navigate('/employer')
      return
    }

    if (isRecruiter && item.type === 'section') {
      const recruiterSectionRoutes = {
        'posted-jobs': '/employer/posted-jobs',
        'manage-jobs': '/employer/edit-jobs',
        'applicants': '/employer/applicants',
        'company-profile': '/employer/company-profile',
      }

      navigate(
        recruiterSectionRoutes[item.id] || '/employer'
      )
      return
    }

    navigate(item.to || '/')
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-[#2563EB] text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)]">

      <div
        ref={headerRef}
        className="container-center"
      >

        {/* =================================================
            DESKTOP NAVBAR
        ================================================= */}

        <div className="hidden h-20 items-center justify-between gap-4 px-4 lg:flex">

          <button
            type="button"
            aria-label={
              menuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            onClick={(event) => {
              if (location.pathname === '/employee') {
                event?.preventDefault?.()
                event?.stopPropagation?.()

                window.dispatchEvent(
                  new CustomEvent(
                    'onus:open-dashboard-sidebar',
                    {
                      detail: {
                        toggle: true,
                      },
                    }
                  )
                )

                setMenuOpen(false)
                setProfileOpen(false)
                setNotificationsOpen(false)
                return
              }

              handleMenuToggle(event)
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* =================================================
              LOGO
          ================================================= */}

          <NavLink
            to="/"
            onClick={closeAll}
            className="flex items-center"
          >
            <img
              src="/onus-logo.png"
              alt="ONUS logo"
              className="h-14 w-14 object-contain"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src =
                  '/favicon.svg'
              }}
            />
          </NavLink>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="flex flex-1 items-center justify-center gap-1.5 xl:gap-2">

            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={
                    item.id ||
                    item.to ||
                    item.label
                  }
                  type="button"
                  onClick={() =>
                    navClick(item)
                  }
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-blue-50 transition hover:bg-white/10 hover:text-white"
                >
                  {Icon && (
                    <Icon className="h-4 w-4" />
                  )}

                  {item.label}
                </button>
              )
            })}

          </nav>

          {/* =================================================
              RIGHT SIDE ICONS
          ================================================= */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div
              ref={notificationsRef}
              className="relative"
            >
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  setNotificationsOpen(
                    (value) => !value
                  )

                  setProfileOpen(false)
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
              >
                <Bell className="h-5 w-5" />

                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-500 px-1 py-0.5 text-center text-[9px] font-bold leading-none text-white">
                    {badgeText(
                      notificationCount
                    )}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">

                  <div className="flex items-center justify-between px-2 py-1">

                    <p className="text-sm font-semibold text-secondary">
                      Notifications
                    </p>

                    {notificationCount > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                        {badgeText(
                          notificationCount
                        )}{' '}
                        updates
                      </span>
                    )}

                  </div>

                  {notificationItems.length === 0 ? (
                    <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                      No new notifications
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">

                      {notificationItems.map(
                        (item) => (
                          <Link
                            key={item.id}
                            to="/applications"
                            onClick={() =>
                              setNotificationsOpen(
                                false
                              )
                            }
                            className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 hover:border-primary hover:bg-blue-50"
                          >
                            <p className="text-sm font-semibold text-secondary">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {item.company}
                            </p>

                            <span className="mt-2 inline-flex rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase text-primary">
                              {item.status}
                            </span>
                          </Link>
                        )
                      )}

                    </div>
                  )}

                </div>
              )}
            </div>

            {/* =================================================
                MESSAGE ICON
            ================================================= */}

            <button
              type="button"
              aria-label="Messages"
              onClick={messages}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              <MessageCircle className="h-5 w-5" />

              {unreadMessages > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-500 px-1 py-0.5 text-center text-[9px] font-bold leading-none text-white">
                  {badgeText(
                    unreadMessages
                  )}
                </span>
              )}
            </button>

            {/* =================================================
                PROFILE
            ================================================= */}

            <div
              ref={profileRef}
              className="relative"
            >
              <button
                type="button"
                aria-label="Profile menu"
                onClick={() => {
                  setProfileOpen(
                    (value) => !value
                  )

                  setNotificationsOpen(false)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
              >
                <User className="h-5 w-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                  {!auth ? (
                    <>
                      <Link
                        to="/login"
                        onClick={closeAll}
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Login
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeAll}
                        className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Create Account
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          closeAll()
                          navigate('/profile')
                        }}
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        My Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          closeAll()

                          navigate(
                            isRecruiter
                              ? '/employer'
                              : '/employee'
                          )
                        }}
                        className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Dashboard
                      </button>

                      <button
                        type="button"
                        onClick={messages}
                        className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <span>
                          Messages
                        </span>

                        {unreadMessages > 0 && (
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            {badgeText(
                              unreadMessages
                            )}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          closeAll()
                          navigate('/settings')
                        }}
                        className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Settings
                      </button>

                      <button
                        type="button"
                        onClick={logout}
                        className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>

        {/* =====================================================
            MOBILE NAVBAR
        ===================================================== */}

        <div className="flex h-16 items-center justify-between gap-3 px-3 sm:h-20 sm:px-4 lg:hidden">

          {/* =================================================
              MOBILE LEFT
          ================================================= */}

          <div className="flex items-center gap-2">

            <button
              type="button"
              aria-label={
                menuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={menuOpen}
              onClick={handleMenuToggle}
              className="relative z-[70] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              <Menu className="h-5 w-5" />
            </button>

            <NavLink
              to="/"
              onClick={closeAll}
            >
              <img
                src="/onus-logo.png"
                alt="ONUS logo"
                className="h-12 w-12 object-contain"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src =
                    '/favicon.svg'
                }}
              />
            </NavLink>

          </div>

          {/* =================================================
              MOBILE RIGHT
          ================================================= */}

          <div className="flex items-center gap-2">

            {/* MOBILE NOTIFICATIONS */}

            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setNotificationsOpen(
                  (value) => !value
                )

                setMenuOpen(false)
                setProfileOpen(false)
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              <Bell className="h-5 w-5" />

              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-500 px-1 py-0.5 text-[9px] font-bold text-white">
                  {badgeText(
                    notificationCount
                  )}
                </span>
              )}
            </button>

            {/* MOBILE MESSAGES */}

            <button
              type="button"
              aria-label="Messages"
              onClick={messages}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              <MessageCircle className="h-5 w-5" />

              {unreadMessages > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-500 px-1 py-0.5 text-[9px] font-bold text-white">
                  {badgeText(
                    unreadMessages
                  )}
                </span>
              )}
            </button>

            {/* MOBILE PROFILE */}

            <div
              ref={mobileProfileRef}
              className="relative"
            >
              <button
                type="button"
                aria-label="Profile menu"
                onClick={() => {
                  setProfileOpen(
                    (value) => !value
                  )

                  setMenuOpen(false)
                  setNotificationsOpen(false)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
              >
                <User className="h-5 w-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                  <button
                    type="button"
                    onClick={() => {
                      closeAll()
                      navigate('/profile')
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeAll()

                      navigate(
                        isRecruiter
                          ? '/employer'
                          : '/employee'
                      )
                    }}
                    className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={messages}
                    className="mt-1 flex w-full justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Messages

                    {unreadMessages > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        {badgeText(
                          unreadMessages
                        )}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeAll()
                      navigate('/settings')
                    }}
                    className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/30"
            />

            <aside className="fixed inset-y-0 left-0 z-50 w-[min(86vw,320px)] overflow-y-auto border-r border-slate-200 bg-white shadow-[10px_0_35px_rgba(15,23,42,0.05)] lg:w-[320px]">
              <div className="flex h-24 shrink-0 items-center justify-between border-b border-slate-100 px-5">
                <div className="flex items-center gap-3">
                  <img
                    src="/onus-logo.png"
                    alt="ONUS logo"
                    className="h-11 w-11 object-contain"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = '/favicon.svg'
                    }}
                  />

                  <div>
                    <p className="text-lg font-black tracking-tight text-slate-900">
                      ONUS
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Career Platform
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto p-4">
                <p className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Menu
                </p>

                <div className="space-y-1">
                  <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Explore
                  </p>

                  {navItems.map((item) => (
                    <button
                      key={item.id || item.to || item.label}
                      type="button"
                      onClick={() => {
                        navClick(item)
                        setMenuOpen(false)
                      }}
                      className={`
                        flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-medium transition
                        ${
                          location.pathname === item.to
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ))}

                  {auth && (
                    <>
                      <div className="my-3 border-t border-slate-100" />

                      <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Dashboard
                      </p>

                      {dashboardMenuItems.map((item) => (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => {
                            closeAll()
                            navigate(item.path)
                          }}
                          className={`
                            flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-medium transition
                            ${
                              location.pathname === item.path
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                          `}
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </nav>
            </aside>
          </>
        )}

      </div>
    </header>
  )
}