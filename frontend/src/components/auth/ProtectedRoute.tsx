import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../../api/http'

export default function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />
}