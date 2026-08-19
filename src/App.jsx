import './App.css'
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Jobs from './pages/Jobs'
import FresherJobs from './pages/FresherJobs'
import Internships from './pages/Internships'
import Companies from './pages/Companies'
import Recruiters from './pages/Recruiters'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import EmployeeDashboard from './pages/EmployeeDashboard'
import EmployerDashboard from './pages/EmployerDashboard'
import JobDetails from './pages/JobDetails'
import CompanyProfile from './pages/CompanyProfile'
import RecruiterProfile from './pages/RecruiterProfile'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import InfoPage from './pages/InfoPage'
import ReferralEarn from './pages/ReferralEarn'
import MyApplications from './pages/MyApplications'
import SavedJobs from './pages/SavedJobs'
import Resume from './pages/Resume'

function App() {
  const [auth, setAuth] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const saved = window.localStorage.getItem('onus-auth')

    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      window.localStorage.removeItem('onus-auth')
      return null
    }
  })

  useEffect(() => {
    if (auth) {
      window.localStorage.setItem(
        'onus-auth',
        JSON.stringify(auth)
      )
    } else {
      window.localStorage.removeItem('onus-auth')
    }
  }, [auth])

  function handleLogin(user) {
    setAuth(user)
  }

  function handleLogout() {
    setAuth(null)
    window.localStorage.removeItem('onus_token')
  }

  return (
    <BrowserRouter>
      <Navbar
        auth={auth}
        onLogout={handleLogout}
      />

      <main className="min-h-screen">
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              auth ? (
                <Navigate
                  to={
                    auth.role === 'recruiter'
                      ? '/employer'
                      : '/employee'
                  }
                  replace
                />
              ) : (
                <Home />
              )
            }
          />

          {/* PUBLIC ROUTES */}
          <Route
            path="/jobs"
            element={<Jobs />}
          />

          <Route
            path="/jobs/:jobId"
            element={<JobDetails />}
          />

          <Route
            path="/fresher"
            element={<FresherJobs />}
          />

          <Route
            path="/internships"
            element={<Internships />}
          />

          <Route
            path="/companies"
            element={<Companies />}
          />

          <Route
            path="/companies/:companySlug"
            element={<CompanyProfile />}
          />

          <Route
            path="/recruiters"
            element={<Recruiters />}
          />

          <Route
            path="/recruiters/:recruiterSlug"
            element={<RecruiterProfile />}
          />

          <Route
            path="/login"
            element={
              <Login
                auth={auth}
                onLogin={handleLogin}
              />
            }
          />

          <Route
            path="/register"
            element={
              <Register
                auth={auth}
                onLogin={handleLogin}
              />
            }
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* JOB SEEKER DASHBOARD */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="job-seeker"
              >
                <EmployeeDashboard auth={auth} />
              </ProtectedRoute>
            }
          />

          {/* RECRUITER DASHBOARD */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="recruiter"
              >
                <EmployerDashboard auth={auth} />
              </ProtectedRoute>
            }
          />

          {/* MY APPLICATIONS */}
          <Route
             path="/applications"
              element={
               <ProtectedRoute auth={auth}
               requiredRole="job-seeker"
               >
            <MyApplications />
             </ProtectedRoute>
            }
          />

          {/* SAVED JOBS */}
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

         {/* RESUME */}
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
              
          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute auth={auth}>
                <Profile auth={auth} />
              </ProtectedRoute>
            }
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute auth={auth}>
                <Settings auth={auth} />
              </ProtectedRoute>
            }
          />

          {/* REFERRAL */}
          <Route
            path="/referral-earn"
            element={
              <ReferralEarn auth={auth} />
            }
          />

          {/* INFO PAGES */}
          <Route
            path="/about"
            element={
              <InfoPage title="About" />
            }
          />

          <Route
            path="/contact"
            element={
              <InfoPage title="Contact" />
            }
          />

          <Route
            path="/privacy"
            element={
              <InfoPage title="Privacy Policy" />
            }
          />

          <Route
            path="/terms"
            element={
              <InfoPage title="Terms & Conditions" />
            }
          />

          {/* UNKNOWN ROUTE */}
          <Route
            path="*"
            element={
              <Navigate to="/" replace />
            }
          />

        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App