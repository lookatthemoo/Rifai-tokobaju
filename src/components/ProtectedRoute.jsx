import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();
  if (!loggedIn) return <Navigate to="/" replace />;
  return children;
}
