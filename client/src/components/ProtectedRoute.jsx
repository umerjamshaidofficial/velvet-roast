import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  // Show nothing (or a spinner) while we check if the user is logged in
  if (loading) return null; 

  // If there is no user, or they aren't an admin, kick them to home
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;