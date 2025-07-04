import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout'
import NormativasPage from './pages/NormativasPage'
import AnexosPage from './pages/AnexosPage'
import ArquitecturaPage from './pages/ArquitecturaPage'
import LoginPage from './pages/LoginPage'
import { useAuth } from './hooks/useAuth'
import Loading from './components/common/Loading'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Navigate to="/normas" replace />} />
        <Route path="normas" element={<NormativasPage />} />
        <Route path="anexos" element={<AnexosPage />} />
        <Route path="arquitectura" element={<ArquitecturaPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App