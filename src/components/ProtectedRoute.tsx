import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: boolean;
  children: React.ReactNode;
}

export default function ProtectedRoute({ isAllowed, children }: ProtectedRouteProps) {
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}