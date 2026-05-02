import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import AboutPage from '../pages/AboutPage'
import CreateProjectPage from '../pages/CreateProjectPage'
import DashboardPage from '../pages/DashboardPage'
import HowToUsePage from '../pages/HowToUsePage'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import SettingsPage from '../pages/SettingsPage'
import SignupPage from '../pages/SignupPage'
import WorkspacePage from '../pages/WorkspacePage'

function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-to-use" element={<HowToUsePage />} />
        <Route path="/workspace/:projectId" element={<WorkspacePage />} />
        <Route path="/project/:projectId" element={<WorkspacePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
