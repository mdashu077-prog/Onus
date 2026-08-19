import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMyApplications } from '../services/api'

const menuItems = [
  {
    label: 'Dashboard',
    path: '/employee',
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

export default function EmployeeDashboard({ auth }) {
  const location = useLocation()

  const [applicationCount, setApplicationCount] = useState(0)
  const [savedJobCount, setSavedJobCount] = useState(0)
  const [resumeViews, setResumeViews] = useState(0)

  const [loading, setLoading] = useState(true)

  // =====================================================
  // LOAD APPLICATION COUNT
  // =====================================================

  useEffect(() => {
    async function loadApplications() {
      try {
        const applications =
          await getMyApplications()

        setApplicationCount(
          Array.isArray(applications)
            ? applications.length
            : 0
        )
      } catch (error) {
        console.error(
          'Failed to load applications:',
          error
        )

        setApplicationCount(0)
      } finally {
        setLoading(false)
      }
    }

    const token =
      localStorage.getItem('onus_token')

    if (token) {
      loadApplications()
    } else {
      setLoading(false)
    }
  }, [])

  // =====================================================
  // LOAD SAVED JOB COUNT
  // =====================================================

  useEffect(() => {
    function loadSavedJobs() {
      try {
        const savedJobs =
          JSON.parse(
            localStorage.getItem(
              'onus_saved_jobs'
            ) || '[]'
          )

        setSavedJobCount(
          Array.isArray(savedJobs)
            ? savedJobs.length
            : 0
        )
      } catch (error) {
        console.error(
          'Failed to load saved jobs:',
          error
        )

        setSavedJobCount(0)
      }
    }

    loadSavedJobs()

    // Agar Saved Jobs page se change ho
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

  // =====================================================
  // RESUME VIEWS
  // =====================================================

  useEffect(() => {
    /*
     * Abhi backend mein resume-view tracking
     * ka endpoint/field nahi diya gaya hai.
     *
     * Isliye fake 24 nahi dikhayenge.
     *
     * Agar local value available hai to use karo.
     * Otherwise 0.
     */

    const views =
      Number(
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

  return (
    <section className="bg-bg py-14 min-h-screen">

      <div className="container-center">

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          {/* =====================================================
              LEFT SIDEBAR
          ====================================================== */}

          <aside
            className="
              rounded-[2rem]
              border
              border-slate-200
              bg-white
              p-6
              shadow-[0_30px_60px_rgba(15,23,42,0.08)]
            "
          >

            <p className="text-sm uppercase tracking-[0.28em] text-primary">
              Job Seeker Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-secondary">
              Welcome back, {auth?.name || 'there'}!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your applications, saved jobs,
              resume and profile.
            </p>

            {/* MENU */}

            <div className="mt-8 space-y-3">

              {menuItems.map((item) => {

                const isActive =
                  location.pathname ===
                  item.path

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`
                      block
                      rounded-2xl
                      border
                      px-4
                      py-3
                      text-sm
                      font-medium
                      transition
                      ${
                        isActive
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-primary hover:bg-blue-50 hover:text-primary'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                )
              })}

            </div>

          </aside>


          {/* =====================================================
              RIGHT CONTENT
          ====================================================== */}

          <div className="space-y-6">

            {/* =====================================================
                ACTIVITY
            ====================================================== */}

            <div
              className="
                rounded-[2rem]
                border
                border-slate-200
                bg-white
                p-8
                shadow-[0_30px_60px_rgba(15,23,42,0.08)]
              "
            >

              <h2 className="text-2xl font-semibold text-secondary">
                Your activity
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">

                {/* APPLICATIONS */}

                <Link
                  to="/applications"
                  className="
                    rounded-2xl
                    bg-primary/10
                    p-5
                    transition
                    hover:bg-primary/20
                  "
                >

                  <p className="text-sm text-slate-500">
                    Applications
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-secondary">

                    {loading
                      ? '...'
                      : applicationCount}

                  </p>

                  <p className="mt-1 text-xs text-primary">
                    View applications →
                  </p>

                </Link>


                {/* SAVED JOBS */}

                <Link
                  to="/saved-jobs"
                  className="
                    rounded-2xl
                    bg-primary/10
                    p-5
                    transition
                    hover:bg-primary/20
                  "
                >

                  <p className="text-sm text-slate-500">
                    Saved Jobs
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-secondary">
                    {savedJobCount}
                  </p>

                  <p className="mt-1 text-xs text-primary">
                    View saved jobs →
                  </p>

                </Link>


                {/* RESUME VIEWS */}

                <Link
                  to="/resume"
                  className="
                    rounded-2xl
                    bg-primary/10
                    p-5
                    transition
                    hover:bg-primary/20
                  "
                >

                  <p className="text-sm text-slate-500">
                    Resume Views
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-secondary">
                    {resumeViews}
                  </p>

                  <p className="mt-1 text-xs text-primary">
                    Manage resume →
                  </p>

                </Link>

              </div>

            </div>


            {/* =====================================================
                QUICK ACTIONS
            ====================================================== */}

            <div
              className="
                rounded-[2rem]
                border
                border-slate-200
                bg-white
                p-8
                shadow-[0_30px_60px_rgba(15,23,42,0.08)]
              "
            >

              <h2 className="text-xl font-semibold text-secondary">
                Quick actions
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <Link
                  to="/applications"
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-sm
                    font-semibold
                    text-secondary
                    hover:border-primary
                    hover:bg-blue-50
                  "
                >
                  View Applications
                </Link>

                <Link
                  to="/saved-jobs"
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-sm
                    font-semibold
                    text-secondary
                    hover:border-primary
                    hover:bg-blue-50
                  "
                >
                  Saved Jobs
                </Link>

                <Link
                  to="/resume"
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-sm
                    font-semibold
                    text-secondary
                    hover:border-primary
                    hover:bg-blue-50
                  "
                >
                  Manage Resume
                </Link>

              </div>

            </div>


            {/* =====================================================
                RECOMMENDED JOBS
            ====================================================== */}

            <div
              className="
                rounded-[2rem]
                border
                border-slate-200
                bg-white
                p-8
                shadow-[0_30px_60px_rgba(15,23,42,0.08)]
              "
            >

              <h3 className="text-xl font-semibold text-secondary">
                Recommended for you
              </h3>

              <div className="mt-4 space-y-3">

                <Link
                  to="/jobs"
                  className="
                    block
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    transition
                    hover:border-primary
                    hover:bg-blue-50
                  "
                >
                  Frontend Developer at Google
                </Link>

                <Link
                  to="/jobs"
                  className="
                    block
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    transition
                    hover:border-primary
                    hover:bg-blue-50
                  "
                >
                  Product Designer at Microsoft
                </Link>

                <Link
                  to="/jobs"
                  className="
                    mt-4
                    inline-block
                    text-sm
                    font-semibold
                    text-primary
                    hover:underline
                  "
                >
                  Browse all jobs →
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}