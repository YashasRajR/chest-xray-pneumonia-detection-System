import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '16px 24px' }}>
        
        {/* Left Side: Brand, Contact and Badges in one line */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <img 
            src="/AksharAI_Logo.png" 
            alt="Akshar AI Logo" 
            style={{ height: '22px', width: 'auto', objectFit: 'contain' }} 
          />
          
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <strong>Akshar AI</strong>
          </span>

          <span style={{ fontSize: '0.78rem', color: 'var(--border-color)' }}>|</span>

          <span style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: '500' }}>
            Intelligent Healthcare Solutions
          </span>

        </div>

        {/* Right Side: Developed by and Terms & Conditions link */}
        <div style={{ fontSize: '0.78rem', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Developed by <strong>Yashas Raj R</strong>
          </span>
          <a 
            href="#" 
            style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: '0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            Subject to Akshar AI Programme Terms & Conditions
          </a>
        </div>

      </div>
    </footer>
  );
}
