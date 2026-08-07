import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/fresher" element={<FresherJobs />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/recruiters" element={<Recruiters />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
