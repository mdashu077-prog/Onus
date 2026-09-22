import './App.css'

import { useEffect, useState } from 'react'

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom'

// =====================================================
// COMPONENTS
// =====================================================

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ApplicationForm from './components/ApplicationForm'

// =====================================================
// PAGES
// =====================================================

import Home from './pages/Home'
import Jobs from './pages/Jobs'
import EditJobs from './pages/EditJobs'

import Internships from './pages/Internships'
import Companies from './pages/Companies'
import Recruiters from './pages/Recruiters'

import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

import EmployeeDashboard from './pages/EmployeeDashboard'
import EmployerDashboard from './pages/EmployerDashboard'
import AdminDashboard from './pages/AdminDashboard'

// =====================================================
// RECRUITER APPLICANTS PAGE
// =====================================================

import EmployerApplicants from './pages/EmployerApplicants'

// =====================================================
// JOB / COMPANY / RECRUITER PAGES
// =====================================================

import JobDetails from './pages/JobDetails'
import CompanyProfile from './pages/CompanyProfile'
import RecruiterProfile from './pages/RecruiterProfile'

// =====================================================
// USER PAGES
// =====================================================

import Profile from './pages/Profile'
import Settings from './pages/Settings'

// =====================================================
// INFO / MESSAGES
// =====================================================

import InfoPage from './pages/InfoPage'
import Messages from './pages/Messages'

// =====================================================
// OTHER PAGES
// =====================================================

import ReferralEarn from './pages/ReferralEarn'
import MyApplications from './pages/MyApplications'
import SavedJobs from './pages/SavedJobs'
import SavedPosts from './pages/SavedPosts'
import PublicProfile from './pages/PublicProfile'
import Resume from './pages/Resume'

// =====================================================
// =====================================================
// JOB APPLICATION PAGE
// =====================================================

function JobApplicationPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const handleSuccess = () => {
    if (jobId) {
      navigate(`/jobs/${jobId}`)
    }
  }

  const handleCancel = () => {
    if (jobId) {
      navigate(`/jobs/${jobId}`)
    }
  }

  return (
    <section className="bg-bg min-h-screen py-16">
      <div className="container-center max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(`/jobs/${jobId}`)}
          className="mb-6 text-sm font-semibold text-primary hover:underline"
        >
          ← Back to job details
        </button>

        <ApplicationForm
          jobId={jobId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </section>
  )
}

// APP
// =====================================================

function App() {

  // =====================================================
  // AUTH STATE
  // =====================================================

  const [auth, setAuth] = useState(() => {

    if (typeof window === 'undefined') {
      return null
    }

    const saved = window.localStorage.getItem('onus-auth')

    if (!saved) {
      return null
    }

    try {
      const parsed = JSON.parse(saved)
      const token = window.localStorage.getItem('onus_token') || parsed?.token

      return token ? { ...parsed, token } : null
    } catch (error) {

      console.error(
        'Invalid ONUS auth data:',
        error
      )

      window.localStorage.removeItem('onus-auth')
      window.localStorage.removeItem('onus_token')

      return null
    }
  })

  // =====================================================
  // SAVE AUTH
  // =====================================================

  useEffect(() => {

    if (typeof window === 'undefined') {
      return
    }

    if (auth) {
      const storedAuth = {
        ...auth,
        token: auth.token || window.localStorage.getItem('onus_token'),
      }

      window.localStorage.setItem(
        'onus-auth',
        JSON.stringify(storedAuth)
      )

      if (storedAuth.token) {
        window.localStorage.setItem('onus_token', storedAuth.token)
      }
    } else {

      window.localStorage.removeItem('onus-auth')
      window.localStorage.removeItem('onus_token')
    }

  }, [auth])

  // =====================================================
  // LOGIN
  // =====================================================

  function handleLogin(user) {
    const nextAuth = {
      ...user,
      token: user?.token || window.localStorage.getItem('onus_token'),
    }

    setAuth(nextAuth)
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {

    setAuth(null)

    if (typeof window !== 'undefined') {

      window.localStorage.removeItem(
        'onus-auth'
      )

      window.localStorage.removeItem(
        'onus_token'
      )
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleAuthClear = () => {
      setAuth(null)
    }

    window.addEventListener('onus:auth-clear', handleAuthClear)
    return () => {
      window.removeEventListener('onus:auth-clear', handleAuthClear)
    }
  }, [])

  // =====================================================
  // ROLE HELPER
  // =====================================================

  const isRecruiter =
    auth?.role?.toLowerCase() === 'recruiter'

  const isAdmin =
    auth?.role?.toLowerCase() === 'admin'

  const isValidAuth =
    auth?.role?.toLowerCase() === 'job-seeker' ||
    auth?.role?.toLowerCase() === 'recruiter' ||
    auth?.role?.toLowerCase() === 'admin'

  const effectiveAuth = isValidAuth ? auth : null

  // =====================================================
  // RETURN
  // =====================================================

  return (

    <BrowserRouter>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        auth={effectiveAuth}
        onLogout={handleLogout}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="min-h-screen">

        <Routes>

          {/* =================================================
              HOME
          ================================================= */}

          <Route
            path="/"
            element={
              effectiveAuth ? (
                <Navigate
                  to={
                    isAdmin
                      ? '/admin'
                      : isRecruiter
                        ? '/employer'
                        : '/employee'
                  }
                  replace
                />
              ) : (
                <Home auth={effectiveAuth} />
              )
            }
          />

          {/* =================================================
              PUBLIC JOB ROUTES
          ================================================= */}

          <Route
            path="/jobs"
            element={
              <ProtectedRoute auth={auth}>
                <Jobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:jobId"
            element={
              <ProtectedRoute auth={auth}>
                <JobDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:jobId/apply"
            element={
              <ProtectedRoute auth={auth}>
                <JobApplicationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fresher"
            element={
              <Navigate to="/jobs?category=FRESHER" replace />
            }
          />

          <Route
            path="/internships"
            element={
              <ProtectedRoute auth={auth}>
                <Internships />
              </ProtectedRoute>
            }
          />

          <Route
            path="/companies"
            element={
              <ProtectedRoute auth={auth}>
                <Companies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/companies/:companySlug"
            element={
              <ProtectedRoute auth={auth}>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiters"
            element={
              <ProtectedRoute auth={auth}>
                <Recruiters />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiters/:recruiterId"
            element={
              <ProtectedRoute auth={auth}>
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiters/:recruiterSlug"
            element={
              <ProtectedRoute auth={auth}>
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              AUTH
          ================================================= */}

          <Route
            path="/login"
            element={
              <Login
                auth={effectiveAuth}
                onLogin={handleLogin}
              />
            }
          />

          <Route
            path="/admin/login"
            element={
              <AdminLogin
                auth={effectiveAuth}
                onLogin={handleLogin}
              />
            }
          />

          <Route
            path="/register"
            element={
              <Register
                auth={effectiveAuth}
                onLogin={handleLogin}
              />
            }
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* =================================================
              ADMIN DASHBOARD
          ================================================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="admin"
              >
                <AdminDashboard
                  auth={auth}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              JOB SEEKER DASHBOARD
          ================================================= */}

          <Route
            path="/employee"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="job-seeker"
              >
                <EmployeeDashboard
                  auth={auth}
                />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              RECRUITER DASHBOARD
          ================================================= */}

          <Route
            path="/employer"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="recruiter"
              >
                <EmployerDashboard
                  auth={auth}
                  page="dashboard"
                />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              RECRUITER - POSTED JOBS
          ================================================= */}

          <Route
            path="/employer/posted-jobs"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="recruiter"
              >
                <EmployerDashboard
                  auth={auth}
                  page="posted-jobs"
                />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              RECRUITER - EDIT JOBS
          ================================================= */}

          <Route
            path="/employer/edit-jobs"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="recruiter"
              >
                <EditJobs />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              OLD EDIT POSTS URL
          ================================================= */}

          <Route
            path="/employer/edit-posts"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="recruiter"
              >
                <EditJobs />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              RECRUITER - APPLICANTS
          ================================================= */}

          <Route
            path="/employer/applicants"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="recruiter"
              >
                <EmployerApplicants
                  auth={auth}
                />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              RECRUITER - COMPANY PROFILE
          ================================================= */}

          <Route
            path="/employer/company-profile"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="recruiter"
              >
                <EmployerDashboard
                  auth={auth}
                  page="company-profile"
                />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              JOB SEEKER - MY APPLICATIONS
          ================================================= */}

          <Route
            path="/applications"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="job-seeker"
              >
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              JOB SEEKER - SAVED JOBS
          ================================================= */}

          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="job-seeker"
              >
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved-posts"
            element={
              <ProtectedRoute auth={auth}>
                <SavedPosts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:userId"
            element={
              <ProtectedRoute auth={auth}>
                <PublicProfile />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              JOB SEEKER - RESUME
          ================================================= */}

          <Route
            path="/resume"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="job-seeker"
              >
                <Resume />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute auth={auth}>
                <Profile auth={auth} />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              SETTINGS
          ================================================= */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute auth={auth}>
                <Settings auth={auth} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              MESSAGES
              RECRUITER + JOB SEEKER
          ================================================= */}

          <Route
            path="/messages"
            element={
              <ProtectedRoute auth={auth}>
                <Messages auth={auth} />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              REFERRAL & EARN
          ================================================= */}

          <Route
            path="/referral-earn"
            element={
              <ProtectedRoute auth={auth}>
                <ReferralEarn auth={auth} />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ABOUT
          ================================================= */}

          <Route
            path="/about"
            element={
              <InfoPage title="About ONUS" pageKey="about" />
            }
          />

          <Route
            path="/how-it-works"
            element={<InfoPage title="How ONUS Works" pageKey="how-it-works" />}
          />

          <Route
            path="/career-guidance"
            element={<InfoPage title="Career Guidance" pageKey="career-guidance" />}
          />

          <Route
            path="/help"
            element={<InfoPage title="Help Center" pageKey="help" />}
          />

          <Route
            path="/resume-tips"
            element={<InfoPage title="Resume Tips" pageKey="resume-tips" />}
          />

          <Route
            path="/interview-tips"
            element={<InfoPage title="Interview Tips" pageKey="interview-tips" />}
          />

          <Route
            path="/faq"
            element={<InfoPage title="Frequently Asked Questions" pageKey="faq" />}
          />

          {/* =================================================
              CONTACT
          ================================================= */}

          <Route
            path="/contact"
            element={
              <InfoPage title="Contact ONUS" pageKey="contact" />
            }
          />

          {/* =================================================
              PRIVACY
          ================================================= */}

          <Route
            path="/privacy"
            element={
              <InfoPage title="Privacy Policy" />
            }
          />

          {/* =================================================
              TERMS
          ================================================= */}

          <Route
            path="/terms"
            element={
              <InfoPage title="Terms & Conditions" />
            }
          />

          {/* =================================================
              UNKNOWN ROUTE
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer auth={effectiveAuth} />

    </BrowserRouter>
  )
}

export default App