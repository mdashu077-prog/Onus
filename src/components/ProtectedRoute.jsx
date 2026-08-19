import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({
  auth,
  requiredRole,
  children,
}) {
  const location = useLocation()

  // User logged in nahi hai
  if (!auth) {
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
    auth.role !== requiredRole
  ) {
    // Recruiter ko recruiter dashboard
    if (auth.role === 'recruiter') {
      return (
        <Navigate
          to="/employer"
          replace
        />
      )
    }

    // Job seeker ko employee dashboard
    if (auth.role === 'job-seeker') {
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