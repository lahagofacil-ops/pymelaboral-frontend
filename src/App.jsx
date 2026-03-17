import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import EmpresaLayout from './layouts/EmpresaLayout'
import PortalLayout from './layouts/PortalLayout'
import SupervisorLayout from './layouts/SupervisorLayout'

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
import DocumentosPage from './pages/empresa/DocumentosPage'
import CompliancePage from './pages/empresa/CompliancePage'
import ConfiguracionPage from './pages/empresa/ConfiguracionPage'
import ChatPage from './pages/empresa/ChatPage'

// Portal pages
import PortalDashboard from './pages/portal/PortalDashboard'
import PortalLiquidaciones from './pages/portal/PortalLiquidaciones'
import PortalAsistencia from './pages/portal/PortalAsistencia'
import PortalVacaciones from './pages/portal/PortalVacaciones'
import PortalPermisos from './pages/portal/PortalPermisos'

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

      {/* Empresa routes - OWNER, ADMIN, or impersonating SUPER_ADMIN/SUPERVISOR */}
      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'SUPER_ADMIN', 'SUPERVISOR']} />}>
        <Route element={<EmpresaLayout />}>
          <Route path="/empresa" element={<EmpresaDashboard />} />
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
          <Route path="/empresa/chat" element={<ChatPage />} />
        </Route>
      </Route>

      {/* Portal routes - WORKER only */}
      <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
        <Route element={<PortalLayout />}>
          <Route path="/portal" element={<PortalDashboard />} />
          <Route path="/portal/liquidaciones" element={<PortalLiquidaciones />} />
          <Route path="/portal/asistencia" element={<PortalAsistencia />} />
          <Route path="/portal/vacaciones" element={<PortalVacaciones />} />
          <Route path="/portal/permisos" element={<PortalPermisos />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
