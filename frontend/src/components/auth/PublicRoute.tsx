import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../../api/http'

export default function PublicRoute() {
  return isAuthenticated() ? <Navigate to="/" replace /> : <Outlet />
}