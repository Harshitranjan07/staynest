import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ hostOnly = false }) {
  const { user, isHost } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (hostOnly && !isHost) return <Navigate to="/" replace />;
  return <Outlet />;
}
