import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WizardForm from './pages/WizardForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { UserCircle } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

function App() {
    return (
        <Router>
            <div className="bg-shape bg-shape-1"></div>
            <div className="bg-shape bg-shape-2"></div>

            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: 'var(--spacing-4)',
                display: 'flex',
                justifyContent: 'space-between',
                backdropFilter: 'blur(10px)',
                background: 'rgba(0,0,0,0.2)',
                zIndex: 100,
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <Link to="/" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    letterSpacing: '-0.02em'
                }}>
                    Sports Notifier
                </Link>
                <Link to="/dashboard" style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    fontSize: '0.9rem',
                    background: 'rgba(255,255,255,0.1)',
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    borderRadius: 'var(--radius-full)'
                }}>
                    <UserCircle size={18} />
                    Кабинет
                </Link>
            </nav>

            <div style={{ paddingTop: '80px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <ErrorBoundary>
                    <Routes>
                        <Route path="/" element={<WizardForm />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </ErrorBoundary>
            </div>
        </Router>
    );
}

export default App;
