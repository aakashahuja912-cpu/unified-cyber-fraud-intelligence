import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';

// Pages
import Dashboard from './pages/Dashboard';
import TransactionMonitoring from './pages/TransactionMonitoring';
import CyberTelemetry from './pages/CyberTelemetry';
import FraudDetection from './pages/FraudDetection';
import ThreatMonitoring from './pages/ThreatMonitoring';
import QuantumMonitoring from './pages/QuantumMonitoring';
import AIExplainability from './pages/AIExplainability';
import SecurityAlerts from './pages/SecurityAlerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import AuditLogs from './pages/AuditLogs';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';

// Services
import { authAPI } from './services/authAPI';
import { threatAPI } from './services/threatAPI';
import { subscribeToTelemetry, getAuthToken } from './services/api';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const profile = await authAPI.getProfile();
          if (profile && profile.user) {
            setUser(profile.user);
          } else {
            authAPI.logout();
          }
        } catch (err) {
          console.warn('Auth token invalid or session expired. Logging out...', err);
          authAPI.logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Fetch threat alerts for notifications
  useEffect(() => {
    if (!user) return;

    const fetchAlerts = async () => {
      try {
        const alerts = await threatAPI.getThreatAlerts();
        const openAlerts = (alerts || []).filter((a: any) => a.status === 'Open');
        setNotifications(openAlerts);
      } catch (err) {
        console.error('Failed to fetch initial alerts:', err);
      }
    };

    fetchAlerts();

    // Subscribe to SSE for real-time alerts
    const unsubscribe = subscribeToTelemetry((event) => {
      if (event.type === 'threat_alert') {
        setNotifications(prev => {
          if (prev.some(n => n.id === event.data.id)) return prev;
          return [event.data, ...prev];
        });
      } else if (event.type === 'threat_resolved') {
        setNotifications(prev => prev.filter(n => n.id !== event.data.alertId));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleLogout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
  };

  const handleClearNotification = async (id: string) => {
    try {
      await threatAPI.resolveThreatAlert(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071B2F] flex items-center justify-center p-4">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? <Navigate to="/" replace /> : <Register />
          } 
        />

        {/* Private Layout / Protected Routes */}
        <Route
          path="/*"
          element={
            user ? (
              <div className="min-h-screen bg-[#071B2F] flex text-slate-100 font-sans antialiased selection:bg-cyan-500/30">
                {/* Sidebar */}
                <Sidebar onLogout={handleLogout} user={user} />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                  {/* Top Navbar */}
                  <Navbar 
                    user={user} 
                    onLogout={handleLogout} 
                    notifications={notifications} 
                    onClearNotification={handleClearNotification} 
                  />

                  {/* Page Scrollable Container */}
                  <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route 
                          path="/" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Dashboard />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/transactions" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <TransactionMonitoring />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/telemetry" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CyberTelemetry />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/fraud" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FraudDetection />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/threats" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ThreatMonitoring />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/quantum" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <QuantumMonitoring />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/explainability" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <AIExplainability />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/alerts" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <SecurityAlerts 
                                notifications={notifications} 
                                onClearNotification={handleClearNotification} 
                              />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/reports" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Reports />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/settings" 
                          element={
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Settings />
                            </motion.div>
                          } 
                        />
                        
                        {/* Admin / Auditor only routes */}
                        {(user.role === 'Admin' || user.role === 'Auditor') && (
                          <>
                            <Route 
                              path="/admin" 
                              element={
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <AdminPanel />
                                </motion.div>
                              } 
                            />
                            <Route 
                              path="/audit-logs" 
                              element={
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <AuditLogs />
                                </motion.div>
                              } 
                            />
                            <Route 
                              path="/analytics" 
                              element={
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Analytics />
                                </motion.div>
                              } 
                            />
                          </>
                        )}

                        {/* Fallback to Dashboard */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </AnimatePresence>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
