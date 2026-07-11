import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import About from './components/About';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import PneumoniaDetector from './components/PneumoniaDetector';
import RecordsView from './components/RecordsView';
import TechnicianDashboard from './components/TechnicianDashboard';
import { ArrowLeft } from 'lucide-react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  
  // Header selectors state
  const [roleMode, setRoleMode] = useState('patient');

  // Load user session from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('akshar_operator');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setActiveTab('home'); // Send to Home immediately if already logged in
        // Sync roleMode to match saved user profile
        if (parsed.role === 'Registered Patient') {
          setRoleMode('patient');
        } else {
          setRoleMode('technician');
        }
      } catch (e) {
        localStorage.removeItem('akshar_operator');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('akshar_operator', JSON.stringify(userData));
    setActiveTab('home'); // Go to Home view on successful login
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('akshar_operator');
    localStorage.removeItem('akshar_token');
    setActiveTab('about'); // Return to Landing Page's About view
  };

  return (
    <>
      {/* Header with Selector States */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        roleMode={roleMode}
        setRoleMode={setRoleMode}
      />

      {/* Main Container - Locked-screen layout utilizing flex growth */}
      <main style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {!user ? (
            /* LANDING VIEW (NOT LOGGED IN) - Side-by-side About + LoginForm */
            <div className="layout-grid-side-by-side" style={{ flex: 1, minHeight: 0 }}>
              {/* About (Left) - Adapts based on RoleMode */}
              <About roleMode={roleMode} />

              {/* Login Form (Right) - Adapts based on RoleMode */}
              <LoginForm user={user} onLogin={handleLogin} roleMode={roleMode} />
            </div>
          ) : (
            /* HOME PAGE VIEW (LOGGED IN) - Renders active tab full screen */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {activeTab !== 'home' && (
                <button
                  onClick={() => setActiveTab('home')}
                  style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    transition: 'var(--transition-fast)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-teal)';
                    e.currentTarget.style.color = 'var(--accent-teal)';
                    e.currentTarget.style.boxShadow = '0 2px 8px var(--glow-cyan)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.02)';
                  }}
                  title="Back to Home"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              {activeTab === 'home' && <HomeView user={user} setActiveTab={setActiveTab} roleMode={roleMode} />}
              {activeTab === 'about' && (
                <div className="glass-panel" style={{ padding: '24px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
                  <About roleMode={roleMode} />
                </div>
              )}
              {activeTab === 'uploads' && (
                <div className="glass-panel" style={{ padding: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
                  <PneumoniaDetector roleMode={roleMode} />
                </div>
              )}
              {activeTab === 'records' && (
                <div className="glass-panel" style={{ padding: '24px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
                  <RecordsView />
                </div>
              )}
              {activeTab === 'profile' && (
                <div style={{ flex: 1, maxWidth: '600px', margin: '0 auto', width: '100%', minHeight: 0 }}>
                  <LoginForm user={user} onLogin={handleLogin} onLogout={handleLogout} roleMode={roleMode} />
                </div>
              )}
              {activeTab === 'dashboard' && roleMode === 'technician' && (
                <TechnicianDashboard token={localStorage.getItem('akshar_token')} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer - receives states to mirror header links when logged in */}
      <Footer 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
    </>
  );
}

export default App;
