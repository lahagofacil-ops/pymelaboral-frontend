import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './layouts/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import EmpresaLayout from './layouts/EmpresaLayout'
import PortalLayout from './layouts/PortalLayout'
import SupervisorLayout from './layouts/SupervisorLayout'
import Spinner from './components/ui/Spinner'

// Public
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import EmpresasPage from './pages/admin/EmpresasPage'
import SupervisorasPage from './pages/admin/SupervisorasPage'

// Supervisor
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard'

// Empresa
import EmpresaDashboard from './pages/empresa/EmpresaDashboard'
import TrabajadoresPage from './pages/empresa/TrabajadoresPage'
import ContratosPage from './pages/empresa/ContratosPage'
import LiquidacionesPage from './pages/empresa/LiquidacionesPage'
import CotizacionesPage from './pages/empresa/CotizacionesPage'
import AsistenciaPage from './pages/empresa/AsistenciaPage'
import VacacionesPage from './pages/empresa/VacacionesPage'
import PermisosPage from './pages/empresa/PermisosPage'
import FiniquitosPage from './pages/empresa/FiniquitosPage'
import KarinPage from './pages/empresa/KarinPage'
import CompliancePage from './pages/empresa/CompliancePage'
import DocumentosPage from './pages/empresa/DocumentosPage'
import ConfiguracionPage from './pages/empresa/ConfiguracionPage'

// Portal
import PortalDashboard from './pages/portal/PortalDashboard'
import PortalLiquidaciones from './pages/portal/PortalLiquidaciones'
import PortalVacaciones from './pages/portal/PortalVacaciones'
import PortalPermisos from './pages/portal/PortalPermisos'

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['SUPER_ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="empresas" element={<EmpresasPage />} />
        <Route path="supervisoras" element={<SupervisorasPage />} />
      </Route>

      {/* Supervisor */}
      <Route path="/supervisor" element={
        <ProtectedRoute roles={['SUPERVISOR']}>
          <SupervisorLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SupervisorDashboard />} />
      </Route>

      {/* Empresa */}
      <Route path="/empresa" element={
        <ProtectedRoute roles={['SUPER_ADMIN', 'SUPERVISOR', 'OWNER', 'ADMIN']}>
          <EmpresaLayout />
        </ProtectedRoute>
      }>
        <Route index element={<EmpresaDashboard />} />
        <Route path="trabajadores" element={<TrabajadoresPage />} />
        <Route path="contratos" element={<ContratosPage />} />
        <Route path="liquidaciones" element={<LiquidacionesPage />} />
        <Route path="cotizaciones" element={<CotizacionesPage />} />
        <Route path="asistencia" element={<AsistenciaPage />} />
        <Route path="vacaciones" element={<VacacionesPage />} />
        <Route path="permisos" element={<PermisosPage />} />
        <Route path="finiquitos" element={<FiniquitosPage />} />
        <Route path="karin" element={<KarinPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="documentos" element={<DocumentosPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
      </Route>

      {/* Portal */}
      <Route path="/portal" element={
        <ProtectedRoute roles={['WORKER']}>
          <PortalLayout />
        </ProtectedRoute>
      }>
        <Route index element={<PortalDashboard />} />
        <Route path="liquidaciones" element={<PortalLiquidaciones />} />
        <Route path="vacaciones" element={<PortalVacaciones />} />
        <Route path="permisos" element={<PortalPermisos />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
