import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const OnboardingPage = lazy(() => import('./pages/onboarding/OnboardingPage'));
const EmitPage = lazy(() => import('./pages/emit/EmitPage'));
const PlansPage = lazy(() => import('./pages/plans/PlansPage'));

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40vh', color: 'var(--color-muted)' }}>
      Carregando...
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Rotas públicas */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<RegisterPage />} />
            </Route>

            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/emitir" element={<EmitPage />} />
              <Route path="/planos" element={<PlansPage />} />
            </Route>

            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </CompanyProvider>
    </AuthProvider>
  );
}
