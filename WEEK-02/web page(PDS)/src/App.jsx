import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import About from './components/About';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  
  // Header selectors state
  const [theme, setTheme] = useState('warm');
  const [roleMode, setRoleMode] = useState('patient');

  // Load user session from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('akshar_operator');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
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

  // Update body class whenever theme changes
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('akshar_operator', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('akshar_operator');
  };

  return (
    <>
      {/* Header with Selector States */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        roleMode={roleMode}
        setRoleMode={setRoleMode}
      />

      {/* Main Container - Locked-screen layout utilizing flex growth */}
      <main style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="layout-grid-side-by-side" style={{ flex: 1, minHeight: 0 }}>
            {/* About (Left) - Adapts based on RoleMode */}
            <About roleMode={roleMode} />

            {/* Login Form (Right) - Adapts based on RoleMode */}
            <LoginForm user={user} onLogin={handleLogin} roleMode={roleMode} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
