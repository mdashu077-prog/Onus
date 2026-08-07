import { NavLink } from 'react-router-dom'
import { User, MoreVertical } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="bg-[#2563EB] border-b border-transparent shadow-sm h-20">
      <div className="container-center relative flex h-full items-center justify-between">
        {/* Left: logo */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center text-white">
            <img
              src="/onus-logo.png"
              alt="ONUS logo"
              className="h-20 w-20 object-contain"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/favicon.svg' }}
            />
          </NavLink>
        </div>

        {/* Center: nav - centered absolutely on wide screens */}
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8 text-sm font-medium text-white whitespace-nowrap flex-nowrap">
            <NavLink to="/" className={({ isActive }) => `px-3 py-2 rounded-md transition whitespace-nowrap ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : 'hover:text-slate-300 hover:bg-transparent'}`}>Home</NavLink>
            <NavLink to="/jobs" className={({ isActive }) => `px-3 py-2 rounded-md transition whitespace-nowrap ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : 'hover:text-slate-300 hover:bg-transparent'}`}>Latest Jobs</NavLink>
            <NavLink to="/fresher" className={({ isActive }) => `px-3 py-2 rounded-md transition whitespace-nowrap ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : 'hover:text-slate-300 hover:bg-transparent'}`}>Fresher Jobs</NavLink>
            <NavLink to="/internships" className={({ isActive }) => `px-3 py-2 rounded-md transition whitespace-nowrap ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : 'hover:text-slate-300 hover:bg-transparent'}`}>Internships</NavLink>
            <NavLink to="/companies" className={({ isActive }) => `px-3 py-2 rounded-md transition whitespace-nowrap ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : 'hover:text-slate-300 hover:bg-transparent'}`}>Companies</NavLink>
            <NavLink to="/recruiters" className={({ isActive }) => `px-3 py-2 rounded-md transition whitespace-nowrap ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : 'hover:text-slate-300 hover:bg-transparent'}`}>Recruiters</NavLink>
        </nav>

        {/* Right: profile and more actions */}
        <div className="flex items-center gap-3">
          <button type="button" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <User className="h-5 w-5" />
          </button>
          <button type="button" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
