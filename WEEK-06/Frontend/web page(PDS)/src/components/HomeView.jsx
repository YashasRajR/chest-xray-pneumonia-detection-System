import React from 'react';
import { Cpu, Upload, Shield, User } from 'lucide-react';

export default function HomeView({ user, setActiveTab, roleMode }) {
  const isTech = roleMode === 'technician';
  
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'space-between' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel glass-welcome-banner" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="status-dot animate-pulse-glow" style={{ width: '8px', height: '8px', background: 'var(--accent-success)' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--accent-success)', textTransform: 'uppercase' }}>
            Secure Patient Portal
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
          Welcome back, {user.name}
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '650px' }}>
          You have successfully logged into the Akshar AI Medical Portal. From here, you can securely upload your X-rays, review your past results, and manage your account.
        </p>
      </div>

      {/* Grid of Action Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flex: 1, minHeight: 0 }}>
        
        {/* Shortcut 1: Upload X-Ray */}
        <div 
          onClick={() => setActiveTab('uploads')}
          className="glass-panel" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            transition: '0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = 'var(--accent-teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="tech-info-icon" style={{ background: 'rgba(2, 132, 199, 0.08)', color: 'var(--accent-teal)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Upload X-Ray</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Securely upload your chest X-ray to receive an instant, AI-assisted preliminary scan.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
            Start Scan &rarr;
          </span>
        </div>

        {/* Shortcut 2: About AI Model */}
        <div 
          onClick={() => setActiveTab('about')}
          className="glass-panel" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            transition: '0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = 'var(--accent-teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="tech-info-icon" style={{ background: 'rgba(14, 165, 233, 0.08)', color: 'var(--accent-cyan)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>How It Works</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Learn how our AI securely and accurately analyzes your X-rays to assist with diagnosis.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
            Learn More &rarr;
          </span>
        </div>

        {/* Shortcut 3: User Profile */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="glass-panel" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            transition: '0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = 'var(--accent-teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="tech-info-icon" style={{ background: 'rgba(59, 130, 246, 0.08)', color: 'var(--accent-purple)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>My Profile</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Manage your personal information and view your secure session details.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-purple)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
            View Profile &rarr;
          </span>
        </div>

      </div>

      {/* Footer Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
        <Shield size={14} className="text-teal" />
        <span>
          {isTech 
            ? 'Operator session is secure and private.' 
            : 'Your connection is secure and private.'}
        </span>
      </div>

    </div>
  );
}
