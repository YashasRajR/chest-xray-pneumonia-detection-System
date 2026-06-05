import React from 'react';
import { LogOut } from 'lucide-react';

export default function Header({ 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  theme, 
  setTheme, 
  roleMode, 
  setRoleMode 
}) {
  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleRoleSelect = (mode) => {
    if (roleMode !== mode) {
      setRoleMode(mode);
      onLogout(); // Clear session to prevent cross-profile leak
    }
  };

  return (
    <header className="header-wrapper">
      <div className="container header-container">
        
        {/* Left: Logo & Subtitle */}
        <a 
          href="#" 
          className="logo" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('about'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <img 
            src="/AksharAI_Logo.png" 
            alt="Akshar AI Logo" 
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Akshar AI
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: '500', color: 'var(--text-muted)' }}>
              Intelligent Healthcare Solutions
            </span>
          </div>
        </a>

        {/* Center section: Empty since controls are consolidated on the right */}
        <div style={{ flex: 1 }}></div>

        {/* Right: Profile, Theme Toggle & Perspective Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-color)', paddingRight: '12px', marginRight: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.75rem', lineHeight: 1.25 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Age: {user.age}</span>
              </div>
              <button 
                onClick={onLogout}
                style={{
                  background: 'rgba(244, 63, 94, 0.08)',
                  border: '1px solid rgba(244, 63, 94, 0.15)',
                  color: 'var(--accent-danger)',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.2s'
                }}
                title="Sign Out"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)'}
              >
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <div className="header-status" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRight: '1px solid var(--border-color)', paddingRight: '12px', borderRadius: 0, borderTop: 0, borderBottom: 0, background: 'transparent', marginRight: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="status-dot animate-pulse-glow"></div>
                <span>Secure Gateway</span>
              </div>
            </div>
          )}

          {/* Theme Cycling Toggle Button */}
          <button
            onClick={() => {
              const themes = ['light', 'dark', 'soft', 'warm'];
              const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
              setTheme(themes[nextIndex]);
            }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-fast)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-teal)';
              e.currentTarget.style.color = 'var(--accent-teal)';
              e.currentTarget.style.boxShadow = '0 2px 8px var(--glow-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.03)';
            }}
            title={`Cycle Theme (Current: ${theme})`}
          >
            <span style={{ 
              width: '5px', 
              height: '5px', 
              borderRadius: '50%', 
              background: 
                theme === 'light' ? '#286FA5' :
                theme === 'dark' ? '#88CDF6' :
                theme === 'soft' ? '#7c482c' : '#0fa282',
              boxShadow: `0 0 4px ${
                theme === 'light' ? '#286FA5' :
                theme === 'dark' ? '#88CDF6' :
                theme === 'soft' ? '#7c482c' : '#0fa282'
              }`
            }}></span>
            <span>{theme}</span>
          </button>

          {/* Role Perspective Switcher Button */}
          <button
            onClick={() => handleRoleSelect(roleMode === 'patient' ? 'technician' : 'patient')}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-fast)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-teal)';
              e.currentTarget.style.color = 'var(--accent-teal)';
              e.currentTarget.style.boxShadow = '0 2px 8px var(--glow-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.03)';
            }}
            title={`Switch to ${roleMode === 'patient' ? 'Technician' : 'Patient'} perspective`}
          >
            <span style={{ 
              width: '5px', 
              height: '5px', 
              borderRadius: '50%', 
              background: roleMode === 'patient' ? 'var(--accent-cyan)' : 'var(--accent-teal)',
              boxShadow: `0 0 4px ${roleMode === 'patient' ? 'var(--accent-cyan)' : 'var(--accent-teal)'}`
            }}></span>
            <span>{roleMode === 'patient' ? 'Patient' : 'Technician'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
