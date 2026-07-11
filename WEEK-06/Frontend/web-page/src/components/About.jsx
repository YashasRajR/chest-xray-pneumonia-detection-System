import React from 'react';
import { ShieldAlert, Cpu, Heart, CheckCircle2, Award, Activity } from 'lucide-react';

export default function About({ roleMode }) {
  const patientSolutions = [
    { title: 'Instant Pneumonia Detection', desc: 'Fast, automated preliminary screening.' },
    { title: 'Secure Image Processing', desc: 'Your medical data remains private.' },
    { title: 'Diagnostic Assistance', desc: 'Aiding medical professionals with AI insights.' }
  ];

  const techSpecs = [
    { label: 'Architecture', value: 'MobileNetV2', color: 'var(--accent-cyan)' },
    { label: 'Target Condition', value: 'Pneumonia', color: 'var(--accent-teal)' },
    { label: 'Input Modality', value: 'Chest X-Ray', color: 'var(--accent-purple)' },
    { label: 'Analysis Speed', value: 'Real-time', color: 'var(--accent-blue)' }
  ];

  if (roleMode === 'technician') {
    return (
      <div className="glass-panel" id="about" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
        
        {/* Brand Header */}
        <div>
          <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.35rem', marginBottom: '2px' }}>
            <Cpu className="text-teal animate-pulse-glow" size={20} />
            Clinical AI Core
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Deep Learning Framework & Inference Engine.
          </p>
        </div>

        {/* Neural core details */}
        <div>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Model Specifications
          </h3>
          <p style={{ fontSize: '0.82rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
            Features a highly-efficient MobileNetV2 architecture trained specifically for detecting pneumonia infiltrates in pediatric and adult chest radiographs.
          </p>
        </div>

        {/* Model Metrics */}
        <div>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} className="text-teal" />
            System Parameters
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {techSpecs.map((spec, i) => (
              <div key={i} className="glass-panel" style={{ padding: '8px 12px', textAlign: 'center', borderTop: `2px solid ${spec.color}`, background: 'rgba(255,255,255,0.01)', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: spec.color, fontFamily: 'var(--font-mono)' }}>{spec.value}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{spec.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div 
          style={{ 
            background: 'rgba(244, 63, 94, 0.02)', 
            border: '1px solid rgba(244, 63, 94, 0.1)', 
            borderRadius: '6px', 
            padding: '10px 12px',
            display: 'flex',
            gap: '8px',
            marginTop: 'auto'
          }}
        >
          <ShieldAlert className="text-danger" size={16} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
            <strong style={{ color: 'var(--accent-danger)', display: 'block', marginBottom: '1px' }}>Clinical Warning</strong>
            System operates strictly as computer-aided screening support. Not a standalone pulmonology diagnostic node.
          </div>
        </div>

      </div>
    );
  }

  // PATIENT MODE RENDER
  return (
    <div className="glass-panel" id="about" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
      
      {/* Brand Header */}
      <div>
        <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.35rem', marginBottom: '2px' }}>
          <Cpu className="text-cyan animate-pulse-glow" size={20} />
          About Akshar AI
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Intelligent Healthcare Automation Solutions.
        </p>
      </div>

      {/* Mission Section */}
      <div>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Heart size={14} className="text-danger" />
          Our Mission
        </h3>
        <p style={{ fontSize: '0.82rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
          We aim to empower healthcare providers and patients by offering an accessible, AI-powered tool for early pneumonia detection from chest X-rays. 
        </p>
      </div>

      {/* Solutions Grid */}
      <div>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={14} className="text-teal" />
          Core Solutions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {patientSolutions.map((sol, i) => (
            <div key={i} className="glass-panel" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.01)', borderLeft: '3px solid var(--accent-cyan)', borderRadius: '6px' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{sol.title}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{sol.desc}</p>
            </div>
          ))}
        </div>
      </div>



      {/* Regulatory Alert */}
      <div 
        style={{ 
          background: 'rgba(245, 158, 11, 0.02)', 
          border: '1px solid rgba(245, 158, 11, 0.1)', 
          borderRadius: '6px', 
          padding: '10px 12px',
          display: 'flex',
          gap: '8px',
          marginTop: 'auto'
        }}
      >
        <ShieldAlert className="text-warning" size={16} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
          <strong style={{ color: 'var(--accent-warning)', display: 'block', marginBottom: '1px' }}>Clinical Disclaimer</strong>
          System functions as auxiliary decision support. Findings must be validated by a licensed physician.
        </div>
      </div>

    </div>
  );
}
