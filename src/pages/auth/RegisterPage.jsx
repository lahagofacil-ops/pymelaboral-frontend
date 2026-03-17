import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', empresaNombre: '', empresaRut: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(form);
      if (res.success) navigate('/dashboard');
      else setError(res.error || 'Error al registrar');
    } catch (err) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1F4E79] text-xl font-bold text-white">PL</div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">PymeLaboral</h1>
          <p className="mt-1 text-sm text-gray-500">Crea tu cuenta en minutos</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Registro</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Nombre completo</label>
              <input type="text" value={form.nombre} onChange={set('nombre')} className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/20" required />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Email</label>
              <input type="email" value={form.email} onChange={set('email')} className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/20" placeholder="tu@empresa.cl" required />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Contrasena</label>
              <input type="password" value={form.password} onChange={set('password')} className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/20" minLength={6} required />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Nombre de la empresa</label>
              <input type="text" value={form.empresaNombre} onChange={set('empresaNombre')} className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/20" required />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">RUT empresa</label>
              <input type="text" value={form.empresaRut} onChange={set('empresaRut')} className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/20" placeholder="12.345.678-9" required />
            </div>
            <button type="submit" disabled={loading} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0F6E56] text-sm font-medium text-white hover:bg-[#0c5a47] disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear cuenta
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-[#1F4E79] hover:underline">Inicia sesion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
