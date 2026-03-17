import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) navigate('/dashboard');
      else setError(res.error || 'Credenciales incorrectas');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - blue gradient (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-[#2563EB] via-[#1E40AF] to-[#1e3a8a] p-12 text-white">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-sm font-bold backdrop-blur-sm">PL</div>
            <span className="text-xl font-bold">PymeLaboral</span>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Gestión laboral<br />simple y legal</h2>
          <p className="mt-4 max-w-sm text-base text-blue-100">
            Liquidaciones, contratos, cotizaciones y cumplimiento normativo para PYMEs chilenas. Todo en un solo lugar.
          </p>
          <div className="mt-8 space-y-3">
            {['Cálculos 100% precisos', 'Normativa 2026 actualizada', 'Asistente IA incluido'].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-blue-100">
                <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-blue-200">© 2026 PymeLaboral</p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full items-center justify-center px-4 py-12 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB] text-lg font-bold text-white">PL</div>
            <h1 className="text-xl font-bold text-gray-900">PymeLaboral</h1>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
            <p className="mt-1 text-sm text-gray-500">Ingresa tus credenciales para acceder</p>
          </div>
          <div className="lg:hidden mb-6">
            <h2 className="text-lg font-semibold text-gray-900 text-center">Iniciar sesión</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                placeholder="tu@empresa.cl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-sm font-semibold text-white shadow-sm hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Ingresar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="font-medium text-[#2563EB] hover:underline">Regístrate gratis</Link>
            </p>
            <Link to="/" className="mt-2 inline-block text-sm text-gray-400 hover:text-gray-600">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
