import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40vh' }}>
        <span>Carregando...</span>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
