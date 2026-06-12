import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ allowedTypes, adminOnly }) {
  const { user, userType } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly) {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (user.email !== adminEmail) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Redirect to profile setup if authenticated but no userType yet (incomplete onboarding)
  if (!adminOnly && !userType && location.pathname !== '/select-role') {
    return <Navigate to="/select-role" replace />;
  }

  if (allowedTypes && userType && !allowedTypes.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
