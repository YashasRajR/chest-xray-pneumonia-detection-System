import React from 'react';
import { Cpu, Upload, Shield, User } from 'lucide-react';

export default function HomeView({ user, setActiveTab, roleMode }) {
  const isTech = roleMode === 'technician';
  
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'space-between' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel glass-welcome-banner" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="status-dot animate-pulse-glow" style={{ width: '8px', height: '8px', background: 'var(--accent-teal)' }}></div>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--accent-teal)', textTransform: 'uppercase' }}>
            Interactive Diagnostic Workspace
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
          Welcome back, {user.name}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '650px' }}>
          You have successfully authenticated into the Akshar AI Medical Portal. Access your clinical utilities, model training diagnostics, and x-ray scanning nodes from this central hub.
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
            <div className="tech-info-icon" style={{ background: 'rgba(2, 195, 154, 0.08)', color: 'var(--accent-cyan)', width: '36px', height: '36px', borderRadius: '8px' }}>
              <Upload size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>AI Upload Scanner</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Drag & drop or select chest X-ray images to run real-time neural scans and heatmaps.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
            Initialize Scan Node &rarr;
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
            <div className="tech-info-icon" style={{ background: 'rgba(5, 102, 141, 0.08)', color: 'var(--accent-blue)', width: '36px', height: '36px', borderRadius: '8px' }}>
              <Cpu size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Model Metrics</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Review convolutional neural network specifications, model parameters, and sensitivity charts.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
            View Model Statistics &rarr;
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
            <div className="tech-info-icon" style={{ background: 'rgba(0, 168, 150, 0.08)', color: 'var(--accent-purple)', width: '36px', height: '36px', borderRadius: '8px' }}>
              <User size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>My Account</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Inspect registered metadata, mobile credentials, license encryption logs, and sessions.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
            Access Profile Keys &rarr;
          </span>
        </div>

      </div>

      {/* Footer Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
        <Shield size={12} className="text-teal" />
        <span>
          {isTech 
            ? 'Operator session complies with TLS 1.3 encryption norms. Diagnostics audited under HIPAA compliance.' 
            : 'Patient connection complies with HIPAA secure storage parameters. Diagnostics logs encrypted.'}
        </span>
      </div>

    </div>
  );
}
