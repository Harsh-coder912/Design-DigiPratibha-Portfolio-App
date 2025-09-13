import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Import critical components directly (no lazy loading for core components)
import { ThemeProvider } from './components/ThemeProvider';
import ErrorBoundary from './components/ErrorBoundary';
import SimpleApp from './components/SimpleApp';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import NotFound from './components/NotFound';

// Only lazy load heavy components with timeout protection
const StudentDashboard = React.lazy(() => 
  Promise.race([
    import('./components/StudentDashboard'),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Component load timeout')), 10000)
    )
  ]) as Promise<{ default: React.ComponentType<any> }>
);

const AdminDashboard = React.lazy(() => 
  Promise.race([
    import('./components/AdvancedAdminDashboard'),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Component load timeout')), 10000)
    )
  ]) as Promise<{ default: React.ComponentType<any> }>
);

const FullPortfolioView = React.lazy(() => import('./components/FullPortfolioView'));
const AIFeatures = React.lazy(() => import('./components/AIFeatures'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const ContactPage = React.lazy(() => import('./components/ContactPage'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const SystemTest = React.lazy(() => import('./components/SystemTest'));

interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'admin';
  portfolioId?: string;
}

// Loading component with timeout protection
function LoadingSpinner() {
  const [showTimeout, setShowTimeout] = useState(false);
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    // Show timeout options after 4 seconds (faster)
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 4000);

    // Countdown for auto-switch to safe mode
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          localStorage.setItem('digipratibha_simple_mode', 'true');
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, []);

  if (showTimeout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <h2 className="text-xl mb-2">DigiPratibha</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Auto-switching to safe mode in {countdown} seconds...
        </p>
        <div className="space-y-3 w-full max-w-sm">
          <button
            onClick={() => {
              try {
                localStorage.setItem('digipratibha_simple_mode', 'true');
                localStorage.removeItem('digipratibha_deployment_error');
                window.location.reload();
              } catch {
                window.location.reload();
              }
            }}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Switch to Safe Mode Now
          </button>
          <button
            onClick={() => {
              try {
                localStorage.removeItem('digipratibha_simple_mode');
                localStorage.removeItem('digipratibha_deployment_error');
                window.location.reload();
              } catch {
                window.location.reload();
              }
            }}
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Retry Full Mode
          </button>
          <button
            onClick={() => {
              try {
                localStorage.clear();
              } catch {
                console.warn('Could not clear localStorage');
              }
              window.location.reload();
            }}
            className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors text-sm"
          >
            Clear Data & Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [useSimpleMode, setUseSimpleMode] = useState(false);

  useEffect(() => {
    // Deployment-safe initialization with faster timeout
    const globalTimeout = setTimeout(() => {
      console.warn('Switching to deployment-safe mode');
      localStorage.setItem('digipratibha_simple_mode', 'true');
      setUseSimpleMode(true);
      setLoading(false);
    }, 8000); // Reduced to 8 seconds for faster recovery

    // Mock-data only initialization (no external dependencies)
    try {
      console.info('DigiPratibha: Initializing with mock data (no backend)');
      
      // Clear any deployment error flags
      localStorage.removeItem('digipratibha_deployment_error');
      localStorage.removeItem('digipratibha_supabase_error');
      
      const savedUser = localStorage.getItem('digipratibha_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          if (userData && userData.id && userData.email && userData.type) {
            setUser(userData);
          } else {
            localStorage.removeItem('digipratibha_user');
          }
        } catch (parseError) {
          console.warn('Invalid user data found, clearing...');
          localStorage.removeItem('digipratibha_user');
        }
      }
      
      // Check if simple mode is preferred
      const simpleMode = localStorage.getItem('digipratibha_simple_mode');
      if (simpleMode === 'true') {
        setUseSimpleMode(true);
      }
      
      // Mark successful initialization
      localStorage.setItem('digipratibha_init_success', 'true');
      
    } catch (error) {
      console.error('Initialization error, using safe mode:', error);
      localStorage.setItem('digipratibha_deployment_error', 'true');
      setUseSimpleMode(true);
    } finally {
      clearTimeout(globalTimeout);
      setLoading(false);
    }

    return () => clearTimeout(globalTimeout);
  }, []);

  const loginUser = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem('digipratibha_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('digipratibha_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // If simple mode is enabled or we detect issues, use SimpleApp
  if (useSimpleMode) {
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <SimpleApp 
            user={user} 
            onLogin={loginUser} 
            onLogout={logoutUser}
          />
          <Toaster position="top-right" />
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen">
            <React.Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<LandingPage user={user} onLogout={logoutUser} />} />
                <Route path="/auth" element={<AuthPage onLogin={loginUser} />} />
                <Route 
                  path="/dashboard" 
                  element={
                    user?.type === 'student' ? (
                      <React.Suspense 
                        fallback={<LoadingSpinner />}
                      >
                        <StudentDashboard user={user} onLogout={logoutUser} />
                      </React.Suspense>
                    ) : user?.type === 'admin' ? (
                      <React.Suspense 
                        fallback={<LoadingSpinner />}
                      >
                        <AdminDashboard user={user} onLogout={logoutUser} />
                      </React.Suspense>
                    ) : (
                      <AuthPage onLogin={loginUser} />
                    )
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    user?.type === 'admin' ? (
                      <React.Suspense 
                        fallback={<LoadingSpinner />}
                      >
                        <AdminDashboard user={user} onLogout={logoutUser} />
                      </React.Suspense>
                    ) : (
                      <AuthPage onLogin={loginUser} />
                    )
                  } 
                />
                <Route path="/portfolio/:slug" element={<FullPortfolioView />} />
                <Route path="/ai-features" element={<AIFeatures />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/test" element={<SystemTest />} />
                
                {/* Simple redirects */}
                <Route path="/preview_page.html" element={<Navigate to="/" replace />} />
                <Route path="/preview_page" element={<Navigate to="/" replace />} />
                <Route path="/index.html" element={<Navigate to="/" replace />} />
                <Route path="/main.html" element={<Navigate to="/" replace />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </React.Suspense>
            <Toaster position="top-right" />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}