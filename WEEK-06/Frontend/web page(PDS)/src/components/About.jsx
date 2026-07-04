import React from 'react';
import { ShieldAlert, Cpu, Heart, CheckCircle2, Award, BarChart2 } from 'lucide-react';

export default function About({ roleMode }) {
  const patientSolutions = [
    { title: 'Patient Triage & Navigation', desc: 'AI-driven case prioritization.' },
    { title: 'Clinical Documentation', desc: 'Automating administrative charts.' },
    { title: 'Medication Management', desc: 'Intelligent prescription validation.' }
  ];

  const techSpecs = [
    { label: 'Ingestion Accuracy', value: '96.4%', color: 'var(--accent-cyan)' },
    { label: 'Sensitivity (Recall)', value: '98.2%', color: 'var(--accent-teal)' },
    { label: 'Clinical Specificity', value: '94.1%', color: 'var(--accent-purple)' },
    { label: 'Weighted F1-Score', value: '97.3%', color: 'var(--accent-blue)' }
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
            Convolutional Neural Network Parameters & Segmentation Pipelines.
          </p>
        </div>

        {/* Neural core details */}
        <div>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Deep CNN Specifications
          </h3>
          <p style={{ fontSize: '0.82rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
            Features a multi-stage ResNet50 framework fine-tuned on NIH ChestX-ray14 datasets. Incorporates Contrast Limited Adaptive Histogram Equalization (CLAHE) and U-Net boundaries.
          </p>
        </div>

        {/* Model Metrics */}
        <div>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={14} className="text-teal" />
            Calibration Performance
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

        {/* Compliance */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Standards & Hardware</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-teal)' }}>
              <CheckCircle2 size={12} /> CE Medical Standard
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
              <CheckCircle2 size={12} /> ISO 13485 Devices
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--accent-purple)' }}>
              <CheckCircle2 size={12} /> CUDA GPU Node
            </span>
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
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.3' }}>
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
          We empower healthcare providers by reducing administrative burdens, improving patient outcomes, and optimizing resources. Automating repetitive workflows allows clinicians to dedicate more time to active patient care.
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

      {/* Compliance & Trust */}
      <div>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Compliance Standards</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--accent-teal)' }}>
            <CheckCircle2 size={12} /> HIPAA Secure
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
            <CheckCircle2 size={12} /> GDPR Compliant
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--accent-purple)' }}>
            <CheckCircle2 size={12} /> NHS Compliant
          </span>
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
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.3' }}>
          <strong style={{ color: 'var(--accent-warning)', display: 'block', marginBottom: '1px' }}>Clinical Disclaimer</strong>
          System functions as auxiliary decision support. Findings must be validated by a licensed physician.
        </div>
      </div>

    </div>
  );
}
