import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '16px 24px' }}>
        
        {/* Left Side: Brand and Contact stacked vertically */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          
          {/* Brand & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/AksharAI_Logo.png" 
              alt="Akshar AI Logo" 
              style={{ height: '22px', width: 'auto', objectFit: 'contain' }} 
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <strong>Akshar AI Ltd</strong> · Registered in England & Wales
            </span>
          </div>

          {/* Contact Email & Compliance Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a 
              href="mailto:hello@aksharaiworks.com" 
              style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '600' }}
            >
              hello@aksharaiworks.com
            </a>
            <span className="badge-fda" style={{ fontSize: '0.62rem', padding: '2px 5px', margin: 0 }}>HIPAA SECURE</span>
          </div>

        </div>

        {/* Right Side: Terms & Conditions link */}
        <div style={{ fontSize: '0.78rem', textAlign: 'right' }}>
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
