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
import { guestNavItems } from '../config/navigation'

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

const jobSeekerSidebarItems = [
  { to: '/employee', label: 'Dashboard' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/applications', label: 'Applications' },
  { to: '/saved-jobs', label: 'Saved Jobs' },
  { to: '/resume', label: 'Resume' },
  { to: '/messages', label: 'Messages' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
  { to: '/referral-earn', label: 'Referral & Earn' },
]

const recruiterSidebarItems = [
  { type: 'link', to: '/employer', label: 'Dashboard' },
  ...recruiterNavItems.filter((item) => item.id || item.to === '/recruiters'),
  { type: 'link', to: '/messages', label: 'Messages' },
  { type: 'link', to: '/profile', label: 'Profile' },
  { type: 'link', to: '/settings', label: 'Settings' },
  { type: 'link', to: '/referral-earn', label: 'Referral & Earn', icon: Gift },
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
  const menuRef = useRef(null)
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

  const isAuthenticated =
    auth?.role?.toLowerCase() === 'job-seeker' ||
    auth?.role?.toLowerCase() === 'recruiter'

  const navItems = !isAuthenticated
    ? []
    : isRecruiter
      ? recruiterNavItems
      : guestNavItems

  const sidebarNavItems = isRecruiter
    ? recruiterSidebarItems
    : isAuthenticated
      ? jobSeekerSidebarItems
      : guestNavItems

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

      const clickedInsideHeader =
        headerRef.current?.contains(event.target)

      const clickedInsideMenu =
        menuRef.current?.contains(event.target)

      const clickedOverlay =
        event.target instanceof Element &&
        event.target.closest('[data-nav-menu-overlay]')

      if (
        !clickedInsideHeader &&
        !clickedInsideMenu &&
        !clickedOverlay
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

  const headerClasses =
    'sticky top-0 z-50 border-b border-blue-500 bg-[#2563EB] text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)]'

  const iconBtnClasses =
    'flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:text-white'

  const navLinkClasses =
    'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white'

  const activeNavClasses =
    'bg-white/15 text-white ring-1 ring-white/20'

  return (
    <header className={headerClasses}>

      <div
        ref={headerRef}
        className="container-center"
      >

        {/* =================================================
            DESKTOP NAVBAR
        ================================================= */}

        <div className="hidden h-20 items-center justify-between gap-4 px-4 lg:flex">

          {isAuthenticated && (
          <button
            type="button"
            aria-label={
              menuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            onClick={(event) => {
              if (location.pathname === '/employee' && isAuthenticated && !isRecruiter) {
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
            className={iconBtnClasses}
          >
            <Menu className="h-5 w-5" />
          </button>
          )}

          {/* =================================================
              LOGO
          ================================================= */}

          <NavLink
            to="/"
            onClick={closeAll}
            className="flex items-center gap-2"
          >
            <img
              src="/onus-logo.png"
              alt="ONUS logo"
              className="h-16 w-16 object-contain"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src =
                  '/favicon.svg'
              }}
            />
            {!isAuthenticated && (
              <span className="hidden leading-tight sm:block">
                <span className="block text-base font-black tracking-[0.08em] text-white">ONUS</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-100">Career Platform</span>
              </span>
            )}
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
                  className={`${navLinkClasses} ${
                    location.pathname === (item.to || '')
                      ? activeNavClasses
                      : ''
                  }`}
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

            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link to="/login" onClick={closeAll} className="rounded-full px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                  Sign In
                </Link>
                <Link to="/register" onClick={closeAll} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600">
                  Create Account
                </Link>
              </div>
            )}

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            {isAuthenticated && (
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
                className={iconBtnClasses}
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
            )}

            {/* =================================================
                MESSAGE ICON
            ================================================= */}

            {isAuthenticated && (
            <button
              type="button"
              aria-label="Messages"
              onClick={messages}
              className={`${iconBtnClasses} relative`}
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
            )}

            {/* =================================================
                PROFILE
            ================================================= */}

            {isAuthenticated && (
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
                className={iconBtnClasses}
              >
                <User className="h-5 w-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                  {!isAuthenticated ? (
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
            )}

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

            {isAuthenticated && (
            <button
              type="button"
              aria-label={
                menuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={menuOpen}
              onClick={(event) => {
                event?.preventDefault?.()
                event?.stopPropagation?.()

                if (location.pathname === '/employee' && isAuthenticated && !isRecruiter) {
                  window.dispatchEvent(
                    new CustomEvent('onus:open-dashboard-sidebar', {
                      detail: { toggle: true },
                    })
                  )
                  setMenuOpen(false)
                  setProfileOpen(false)
                  setNotificationsOpen(false)
                  return
                }

                setMenuOpen((value) => !value)
                setProfileOpen(false)
                setNotificationsOpen(false)
              }}
              className={iconBtnClasses}
            >
              <Menu className="h-5 w-5" />
            </button>
            )}

            <NavLink
              to="/"
              onClick={closeAll}
              className="flex items-center gap-2"
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
              {!isAuthenticated && (
                <span className="leading-tight">
                  <span className="block text-sm font-black tracking-[0.08em] text-white">ONUS</span>
                  <span className="block text-[8px] font-semibold uppercase tracking-[0.16em] text-blue-100">Career Platform</span>
                </span>
              )}
            </NavLink>

          </div>

          {/* =================================================
              MOBILE RIGHT
          ================================================= */}

          <div className="flex items-center gap-2">

            {/* MOBILE NOTIFICATIONS */}

            {isAuthenticated && (
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
              className={iconBtnClasses}
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
            )}

            {/* MOBILE MESSAGES */}

            {isAuthenticated && (
            <button
              type="button"
              aria-label="Messages"
              onClick={messages}
              className={iconBtnClasses}
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
            )}

            {/* MOBILE PROFILE */}

            {isAuthenticated && (
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
                className={iconBtnClasses}
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
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-1">
                <Link to="/login" onClick={closeAll} className="rounded-full px-2 py-2 text-xs font-semibold text-white transition hover:bg-white/10">
                  Sign In
                </Link>
                <Link to="/register" onClick={closeAll} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600">
                  Create Account
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {isAuthenticated && menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              data-nav-menu-overlay
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-30 bg-slate-950/30"
            />

            <aside
              ref={menuRef}
              data-nav-menu-root
              className="fixed bottom-0 left-0 top-16 z-40 w-[min(86vw,320px)] overflow-y-auto border-r border-blue-700 bg-[#1d4ed8] text-white shadow-[10px_0_35px_rgba(15,23,42,0.2)] sm:top-20 lg:top-20 lg:w-[320px]"
            >
              <div className="flex h-24 shrink-0 items-center justify-between border-b border-white/15 px-5">
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
                    <p className="text-lg font-black tracking-tight text-white">
                      ONUS
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-100">
                      Career Platform
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg p-2 text-blue-100 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto p-4">
                <p className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-100">
                  Menu
                </p>

                <div className="space-y-1">
                  <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-100">
                    Explore
                  </p>

                  {sidebarNavItems.map((item) => (
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
                            ? 'bg-white/15 text-white'
                            : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ))}

                </div>
              </nav>
            </aside>
          </>
        )}

      </div>
    </header>
  )
}