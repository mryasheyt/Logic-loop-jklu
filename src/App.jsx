import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Mood from './pages/Mood';
import PeerFeed from './pages/PeerFeed';
import Journal from './pages/Journal';
import Burnout from './pages/Burnout';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Breathing from './pages/Breathing';
import SplineBackground from './components/SplineBackground';

import { useDarkMode } from './hooks/useDarkMode';

const queryClient = new QueryClient();


const ProtectedRoute = ({ children }) => {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  useDarkMode();
  return (
    <QueryClientProvider client={queryClient}>
      <SplineBackground />
      <Router>
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/chat"
              element={<ProtectedRoute><Chat /></ProtectedRoute>}
            />
            <Route
              path="/mood"
              element={<ProtectedRoute><Mood /></ProtectedRoute>}
            />
            <Route
              path="/peer-feed"
              element={<ProtectedRoute><PeerFeed /></ProtectedRoute>}
            />
            <Route
              path="/journal"
              element={<ProtectedRoute><Journal /></ProtectedRoute>}
            />
            <Route
              path="/burnout"
              element={<ProtectedRoute><Burnout /></ProtectedRoute>}
            />
            <Route
              path="/resources"
              element={<ProtectedRoute><Resources /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/breathing"
              element={<ProtectedRoute><Breathing /></ProtectedRoute>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1A1A2E',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 24px rgba(107, 70, 193, 0.10)',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}


export default App;
