import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({
  children,
  message = 'Log in to access this page.',
  redirectTo = '/login',
  requireChapterLead = false,
  requireFoundingMember = false,
}) {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    return <Navigate to={redirectTo} replace state={{ message }} />;
  }

  if (requireFoundingMember && !userData?.foundingMember) {
    return <Navigate to="/" replace state={{ message: 'Unauthorized access.' }} />;
  }

  if (requireChapterLead && !userData?.chapterLead && !userData?.foundingMember) {
    return <Navigate to="/" replace state={{ message: 'Unauthorized access.' }} />;
  }

  return children;
}

export default ProtectedRoute;
