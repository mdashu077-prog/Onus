import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({
  auth,
  requiredRole,
  children,
}) {
  const location = useLocation()
  const role = auth?.role?.toLowerCase()
  const isValidAuth =
    role === 'job-seeker' ||
    role === 'recruiter' ||
    role === 'admin'

  if (!isValidAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  if (
    requiredRole &&
    role !== requiredRole
  ) {
    if (role === 'recruiter') {
      return (
        <Navigate
          to="/employer"
          replace
        />
      )
    }

    if (role === 'job-seeker') {
      return (
        <Navigate
          to="/employee"
          replace
        />
      )
    }

    if (role === 'admin') {
      return (
        <Navigate
          to="/admin"
          replace
        />
      )
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}