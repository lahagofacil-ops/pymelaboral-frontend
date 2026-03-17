import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ChatWidget } from './components/chat/ChatWidget';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import TrabajadoresPage from './pages/trabajadores/TrabajadoresPage';
import TrabajadorNuevoPage from './pages/trabajadores/TrabajadorNuevoPage';
import TrabajadorDetallePage from './pages/trabajadores/TrabajadorDetallePage';
import ContratosPage from './pages/contratos/ContratosPage';
import ContratoNuevoPage from './pages/contratos/ContratoNuevoPage';
import LiquidacionesPage from './pages/liquidaciones/LiquidacionesPage';
import LiquidacionNuevaPage from './pages/liquidaciones/LiquidacionNuevaPage';
import LiquidacionDetallePage from './pages/liquidaciones/LiquidacionDetallePage';
import CotizacionesPage from './pages/cotizaciones/CotizacionesPage';
import AsistenciaPage from './pages/asistencia/AsistenciaPage';
import VacacionesPage from './pages/vacaciones/VacacionesPage';
import FiniquitosPage from './pages/finiquitos/FiniquitosPage';
import LeyKarinPage from './pages/ley-karin/LeyKarinPage';
import CompliancePage from './pages/compliance/CompliancePage';
import DocumentosPage from './pages/documentos/DocumentosPage';
import ConfiguracionPage from './pages/configuracion/ConfiguracionPage';
import PlanesPage from './pages/planes/PlanesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* Protected - Dashboard layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trabajadores" element={<TrabajadoresPage />} />
            <Route path="/trabajadores/nuevo" element={<TrabajadorNuevoPage />} />
            <Route path="/trabajadores/:id" element={<TrabajadorDetallePage />} />
            <Route path="/contratos" element={<ContratosPage />} />
            <Route path="/contratos/nuevo" element={<ContratoNuevoPage />} />
            <Route path="/liquidaciones" element={<LiquidacionesPage />} />
            <Route path="/liquidaciones/nueva" element={<LiquidacionNuevaPage />} />
            <Route path="/liquidaciones/:id" element={<LiquidacionDetallePage />} />
            <Route path="/cotizaciones" element={<CotizacionesPage />} />
            <Route path="/asistencia" element={<AsistenciaPage />} />
            <Route path="/vacaciones" element={<VacacionesPage />} />
            <Route path="/finiquitos" element={<FiniquitosPage />} />
            <Route path="/ley-karin" element={<LeyKarinPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
            <Route path="/planes" element={<PlanesPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatWidget />
      </AuthProvider>
    </BrowserRouter>
  );
}
