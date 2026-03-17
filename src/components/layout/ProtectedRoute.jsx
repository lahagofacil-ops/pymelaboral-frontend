import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#1F4E79' }} />
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin permisos</h2>
          <p className="text-gray-500 mb-4">
            No tienes permisos para acceder a esta seccion.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: '#1F4E79' }}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
