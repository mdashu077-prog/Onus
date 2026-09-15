import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({
  auth,
  requiredRole,
  children,
}) {
  const location = useLocation()
  const role = auth?.role?.toLowerCase()
  const isValidAuth =
    role === 'job-seeker' || role === 'recruiter'

  // User logged in nahi hai
  if (!isValidAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // Required role check
  if (
    requiredRole &&
    role !== requiredRole
  ) {
    // Recruiter ko recruiter dashboard
    if (role === 'recruiter') {
      return (
        <Navigate
          to="/employer"
          replace
        />
      )
    }

    // Job seeker ko employee dashboard
    if (role === 'job-seeker') {
      return (
        <Navigate
          to="/employee"
          replace
        />
      )
    }

    // Unknown role
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  // Authentication + role dono correct
  return children
}