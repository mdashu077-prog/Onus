import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, User, Bell, MoreVertical } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Latest Jobs' },
  { to: '/fresher', label: 'Fresher Jobs' },
  { to: '/internships', label: 'Internships' },
  { to: '/companies', label: 'Companies' },
  { to: '/recruiters', label: 'Recruiters' },
  { to: '/referral-earn', label: 'Referral & Earn' },
]

export default function Navbar({ auth, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const headerRef = useRef(null)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)
  const mobileProfileRef = useRef(null)
  const moreRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(event.target)
      ) {
        setProfileOpen(false)
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    onLogout?.()
    setProfileOpen(false)
    setMoreOpen(false)
    navigate('/')
  }

  function closeAllMenus() {
    setMenuOpen(false)
    setNotificationsOpen(false)
    setProfileOpen(false)
    setMoreOpen(false)
  }

  return (
    <header className="border-b border-transparent bg-[#2563EB] shadow-sm">
      <div ref={headerRef} className="container-center">
        <div className="hidden h-20 items-center justify-between gap-4 px-4 lg:flex">
          <div className="flex min-w-0 items-center">
            <NavLink to="/" className="flex items-center text-white">
              <img
                src="/onus-logo.png"
                alt="ONUS logo"
                className="h-20 w-20 object-contain"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/favicon.svg' }}
              />
            </NavLink>
          </div>

          <nav className="flex flex-1 items-center justify-center gap-4">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-md px-2.5 py-2 text-sm font-medium whitespace-nowrap transition ${isActive ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={notificationsRef} className="relative">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Notifications" onClick={() => { setNotificationsOpen((prev) => !prev); setProfileOpen(false); setMoreOpen(false) }}>
                <Bell className="h-5 w-5" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  <div className="flex items-center justify-between px-2 py-1">
                    <p className="text-sm font-semibold text-secondary">Notifications</p>
                    <button type="button" onClick={() => setNotificationsOpen(false)} className="text-xs font-medium text-primary">Close</button>
                  </div>
                  <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                    No new notifications
                  </div>
                  <button type="button" className="mt-3 w-full rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                    View all notifications
                  </button>
                </div>
              )}
            </div>

            <div ref={profileRef} className="relative">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Profile menu" onClick={() => { setProfileOpen((prev) => !prev); setNotificationsOpen(false); setMoreOpen(false) }}>
                <User className="h-5 w-5" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {!auth ? (
                    <>
                      <Link to="/login" onClick={closeAllMenus} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Login</Link>
                      <Link to="/register" onClick={closeAllMenus} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Create Account</Link>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => { closeAllMenus(); navigate('/profile') }} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">My Profile</button>
                      <button type="button" onClick={() => { closeAllMenus(); navigate(auth.role === 'recruiter' ? '/employer' : '/employee') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">My Applications</button>
                      <button type="button" onClick={() => { closeAllMenus(); navigate('/jobs') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Saved Jobs</button>
                      <button type="button" onClick={() => { closeAllMenus(); navigate('/settings') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Settings</button>
                      <button type="button" onClick={handleLogout} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50">Logout</button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div ref={moreRef} className="relative">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="More options" onClick={() => { setMoreOpen((prev) => !prev); setNotificationsOpen(false); setProfileOpen(false) }}>
                <MoreVertical className="h-5 w-5" />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button type="button" onClick={() => { closeAllMenus(); navigate('/about') }} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">About ONUS</button>
                  <button type="button" onClick={() => { closeAllMenus(); navigate('/contact') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Contact</button>
                  <button type="button" onClick={() => { closeAllMenus(); navigate('/about') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Help & Support</button>
                  <button type="button" onClick={() => { closeAllMenus(); navigate('/privacy') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Privacy Policy</button>
                  <button type="button" onClick={() => { closeAllMenus(); navigate('/terms') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Terms & Conditions</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex h-16 items-center justify-between gap-3 px-3 sm:h-20 sm:px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </button>

            <NavLink to="/" className="flex items-center text-white">
              <img
                src="/onus-logo.png"
                alt="ONUS logo"
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/favicon.svg' }}
              />
            </NavLink>
          </div>

          <div ref={mobileProfileRef} className="relative">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Profile menu" onClick={() => { setProfileOpen((prev) => !prev); setMenuOpen(false) }}>
              <User className="h-5 w-5" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                {!auth ? (
                  <>
                    <Link to="/login" onClick={closeAllMenus} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Login</Link>
                    <Link to="/register" onClick={closeAllMenus} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Create Account</Link>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => { closeAllMenus(); navigate('/profile') }} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">My Profile</button>
                    <button type="button" onClick={() => { closeAllMenus(); navigate(auth.role === 'recruiter' ? '/employer' : '/employee') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">My Applications</button>
                    <button type="button" onClick={() => { closeAllMenus(); navigate('/settings') }} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">Settings</button>
                    <button type="button" onClick={handleLogout} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50">Logout</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/20 bg-[#2563EB] px-3 py-3 lg:hidden">
            <div className="container-center flex flex-col gap-2 rounded-2xl bg-white/10 p-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `rounded-xl px-3 py-3 text-sm font-medium text-white transition ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                  {item.label}
                </NavLink>
              ))}
              {!auth ? (
                <>
                  <NavLink to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10">Login</NavLink>
                  <NavLink to="/register" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10">Sign Up</NavLink>
                </>
              ) : (
                <>
                  <NavLink to={auth.role === 'recruiter' ? '/employer' : '/employee'} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10">Dashboard</NavLink>
                  <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10">Profile</NavLink>
                  <NavLink to="/settings" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10">Settings</NavLink>
                  <button type="button" onClick={handleLogout} className="rounded-xl px-3 py-3 text-left text-sm font-medium text-white transition hover:bg-white/10">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
