import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ auth, requiredRole, children }) {
  if (!auth) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to={auth.role === 'recruiter' ? '/employer' : '/employee'} replace />
  }

  return children
}
