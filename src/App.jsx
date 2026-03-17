import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import SupervisorLayout from './layouts/SupervisorLayout'
import EmpresaLayout from './layouts/EmpresaLayout'
import PortalLayout from './layouts/PortalLayout'

// Public pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import EmpresasPage from './pages/admin/EmpresasPage'
import SupervisorasPage from './pages/admin/SupervisorasPage'

// Supervisor pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard'

// Empresa pages
import Dashboard from './pages/empresa/Dashboard'
import TrabajadoresPage from './pages/empresa/TrabajadoresPage'
import ContratosPage from './pages/empresa/ContratosPage'
import LiquidacionesPage from './pages/empresa/LiquidacionesPage'
import CotizacionesPage from './pages/empresa/CotizacionesPage'
import AsistenciaPage from './pages/empresa/AsistenciaPage'
import VacacionesPage from './pages/empresa/VacacionesPage'
import PermisosPage from './pages/empresa/PermisosPage'
import FiniquitosPage from './pages/empresa/FiniquitosPage'
import KarinPage from './pages/empresa/KarinPage'
import DocumentosPage from './pages/empresa/DocumentosPage'
import CompliancePage from './pages/empresa/CompliancePage'
import ConfiguracionPage from './pages/empresa/ConfiguracionPage'

// Portal pages
import PortalDashboard from './pages/portal/PortalDashboard'
import MisLiquidaciones from './pages/portal/MisLiquidaciones'
import MiContrato from './pages/portal/MiContrato'
import MisVacaciones from './pages/portal/MisVacaciones'
import MiAsistencia from './pages/portal/MiAsistencia'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes - SUPER_ADMIN only */}
      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/empresas" element={<EmpresasPage />} />
          <Route path="/admin/supervisoras" element={<SupervisorasPage />} />
        </Route>
      </Route>

      {/* Supervisor routes - SUPERVISOR only */}
      <Route element={<ProtectedRoute allowedRoles={['SUPERVISOR']} />}>
        <Route element={<SupervisorLayout />}>
          <Route path="/supervisor" element={<SupervisorDashboard />} />
        </Route>
      </Route>

      {/* Empresa routes - OWNER, ADMIN, or impersonating */}
      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN']} requireImpersonation />}>
        <Route element={<EmpresaLayout />}>
          <Route path="/empresa/dashboard" element={<Dashboard />} />
          <Route path="/empresa/trabajadores" element={<TrabajadoresPage />} />
          <Route path="/empresa/contratos" element={<ContratosPage />} />
          <Route path="/empresa/liquidaciones" element={<LiquidacionesPage />} />
          <Route path="/empresa/cotizaciones" element={<CotizacionesPage />} />
          <Route path="/empresa/asistencia" element={<AsistenciaPage />} />
          <Route path="/empresa/vacaciones" element={<VacacionesPage />} />
          <Route path="/empresa/permisos" element={<PermisosPage />} />
          <Route path="/empresa/finiquitos" element={<FiniquitosPage />} />
          <Route path="/empresa/karin" element={<KarinPage />} />
          <Route path="/empresa/documentos" element={<DocumentosPage />} />
          <Route path="/empresa/compliance" element={<CompliancePage />} />
          <Route path="/empresa/configuracion" element={<ConfiguracionPage />} />
        </Route>
      </Route>

      {/* Portal routes - WORKER only */}
      <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
        <Route element={<PortalLayout />}>
          <Route path="/portal" element={<PortalDashboard />} />
          <Route path="/portal/liquidaciones" element={<MisLiquidaciones />} />
          <Route path="/portal/contrato" element={<MiContrato />} />
          <Route path="/portal/vacaciones" element={<MisVacaciones />} />
          <Route path="/portal/asistencia" element={<MiAsistencia />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
