import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * allowedTypes: array of user types allowed, e.g. ['venture', 'funder']
 * adminOnly: restrict access to only the email specified in VITE_ADMIN_EMAIL
 * If omitted, any authenticated user can access.
 */
export default function PrivateRoute({ allowedTypes, adminOnly }) {
  const { user, userType } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly) {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (user.email !== adminEmail) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (allowedTypes && userType && !allowedTypes.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
