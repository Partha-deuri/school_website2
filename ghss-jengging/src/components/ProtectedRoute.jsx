import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Check if our secure JWT token exists in the browser's local storage
  const token = localStorage.getItem('adminToken');

  // If they have a token, render the child routes (<Outlet />).
  // If not, instantly redirect them back to the login page.
  return token ? <Outlet /> : <Navigate to="/admin-login" replace />;
}