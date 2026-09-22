import { Link } from 'react-router-dom'

export default function Footer({ auth }) {
  const isAuthenticated =
    auth?.role?.toLowerCase() === 'job-seeker' ||
    auth?.role?.toLowerCase() === 'recruiter'

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      {isAuthenticated ? (
        <div className="container-center grid gap-8 px-3 py-12 sm:px-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 text-2xl font-black tracking-[-0.05em] text-white">ONUS</div>
            <p className="max-w-sm text-sm leading-6 text-slate-400">Connecting talent with opportunity through smarter hiring and better job matching.</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Company</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <Link to="/about" className="transition hover:text-white">About Us</Link>
              <Link to="/contact" className="transition hover:text-white">Contact</Link>
              <Link to="/about" className="transition hover:text-white">Careers</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">For Job Seekers</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <Link to="/jobs" className="transition hover:text-white">Latest Jobs</Link>
              <Link to="/internships" className="transition hover:text-white">Internships</Link>
              <Link to="/applications" className="transition hover:text-white">Applications</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">For Recruiters</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <Link to="/employer" className="transition hover:text-white">Post Job</Link>
              <Link to="/employer/posted-jobs" className="transition hover:text-white">Posted Jobs</Link>
              <Link to="/employer/applicants" className="transition hover:text-white">Applicants</Link>
              <Link to="/employer/company-profile" className="transition hover:text-white">Company Profile</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-center grid gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1.25fr_0.9fr] md:gap-10 lg:gap-12 lg:py-14">
          <div>
            <div className="text-2xl font-black tracking-[-0.05em] text-white">ONUS</div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">Career Platform for job seekers and recruiters.</p>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-300">Find opportunities.<br />Build careers.<br />Hire talent.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Explore</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-300">
              <Link to="/about" className="transition hover:text-white">About ONUS</Link>
              <Link to="/how-it-works" className="transition hover:text-white">How ONUS Works</Link>
              <Link to="/career-guidance" className="transition hover:text-white">Career Guidance</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Help &amp; Career</p>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 text-sm text-slate-300 sm:grid-cols-1">
              <Link to="/help" className="transition hover:text-white">Help Center</Link>
              <Link to="/resume-tips" className="transition hover:text-white">Resume Tips</Link>
              <Link to="/interview-tips" className="transition hover:text-white">Interview Tips</Link>
              <Link to="/faq" className="transition hover:text-white">FAQ</Link>
              <Link to="/contact" className="transition hover:text-white">Contact Us</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Account</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-300">
              <Link to="/login" className="transition hover:text-white">Sign In</Link>
              <Link to="/register" className="transition hover:text-white">Create Account</Link>
            </div>
            <p className="mt-6 text-xs leading-5 text-slate-500">Built &amp; Designed by Ashraf</p>
          </div>
        </div>
      )}

      <div className="container-center border-t border-slate-800 px-3 py-6 text-sm text-slate-400 sm:px-4">
        © {new Date().getFullYear()} ONUS. All rights reserved.
      </div>
    </footer>
  )
}
