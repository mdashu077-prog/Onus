import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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

function App() {
  const [auth, setAuth] = useState(() => {
    if (typeof window === 'undefined') return null
    const saved = window.localStorage.getItem('onus-auth')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (auth) {
      window.localStorage.setItem('onus-auth', JSON.stringify(auth))
    } else {
      window.localStorage.removeItem('onus-auth')
    }
  }, [auth])

  function handleLogin(user) {
    setAuth(user)
  }

  function handleLogout() {
    setAuth(null)
  }

  return (
    <BrowserRouter>
      <Navbar auth={auth} onLogout={handleLogout} />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/fresher" element={<FresherJobs />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:companySlug" element={<CompanyProfile />} />
          <Route path="/recruiters" element={<Recruiters />} />
          <Route path="/recruiters/:recruiterSlug" element={<RecruiterProfile />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/employee" element={auth?.role === 'job-seeker' ? <EmployeeDashboard auth={auth} /> : <Navigate to="/login" replace />} />
          <Route path="/employer" element={auth?.role === 'recruiter' ? <EmployerDashboard auth={auth} /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={auth ? <Profile auth={auth} /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={auth ? <Settings auth={auth} /> : <Navigate to="/login" replace />} />
          <Route path="/referral-earn" element={<ReferralEarn auth={auth} />} />
          <Route path="/about" element={<InfoPage title="About" />} />
          <Route path="/contact" element={<InfoPage title="Contact" />} />
          <Route path="/privacy" element={<InfoPage title="Privacy Policy" />} />
          <Route path="/terms" element={<InfoPage title="Terms & Conditions" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
