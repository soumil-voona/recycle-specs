import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({
  children,
  message = 'Log in to access this page.',
  redirectTo = '/login'
}) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to={redirectTo} replace state={{ message }} />;
  }

  return children;
}

export default ProtectedRoute;
