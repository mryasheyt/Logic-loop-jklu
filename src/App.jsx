import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import NudgeToast from './components/NudgeToast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Mood from './pages/Mood'
import Journal from './pages/Journal'
import PeerFeed from './pages/PeerFeed'
import Burnout from './pages/Burnout'
import Resources from './pages/Resources'
import Profile from './pages/Profile'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const location = useLocation()
  const token = useAuthStore(s => s.token)
  const isAuth = !!token
  const showNavbar = isAuth && !['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-bg">
      {showNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={
            <PageWrapper>{isAuth ? <Navigate to="/dashboard" /> : <Login />}</PageWrapper>
          } />
          <Route path="/register" element={
            <PageWrapper>{isAuth ? <Navigate to="/dashboard" /> : <Register />}</PageWrapper>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute><PageWrapper><Chat /></PageWrapper></ProtectedRoute>
          } />
          <Route path="/mood" element={
            <ProtectedRoute><PageWrapper><Mood /></PageWrapper></ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute><PageWrapper><Journal /></PageWrapper></ProtectedRoute>
          } />
          <Route path="/peer-feed" element={
            <ProtectedRoute><PageWrapper><PeerFeed /></PageWrapper></ProtectedRoute>
          } />
          <Route path="/burnout" element={
            <ProtectedRoute><PageWrapper><Burnout /></PageWrapper></ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute><PageWrapper><Resources /></PageWrapper></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to={isAuth ? '/dashboard' : '/login'} />} />
        </Routes>
      </AnimatePresence>
      {isAuth && <NudgeToast />}
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
