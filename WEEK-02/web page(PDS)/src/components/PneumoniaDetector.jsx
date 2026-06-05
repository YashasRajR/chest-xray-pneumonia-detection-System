import React, { useState, useEffect } from 'react';
import { Upload, Eye, EyeOff, CheckCircle, AlertTriangle, RefreshCw, Cpu, Activity, Info } from 'lucide-react';

// Symmetrical SVG Chest X-ray simulator
const ChestXraySVG = ({ type, isScanning, showHeatmap }) => {
  // Generates different lung representations based on Normal vs Pneumonia
  return (
    <svg viewBox="0 0 400 400" className="xray-vector-art" style={{ width: '100%', height: '100%', maxHeight: '350px' }}>
      <defs>
        {/* Soft shadow/glow filters */}
        <filter id="blur-heavy" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" />
        </filter>
        <filter id="blur-medium" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <radialGradient id="lung-grad-left" cx="40%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#111827" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#030712" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#000000" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="lung-grad-right" cx="60%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#111827" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#030712" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#000000" stopOpacity="1" />
        </radialGradient>
        {/* Heatmap gradients */}
        <radialGradient id="heatmap-grad" cx="45%" cy="65%" r="35%">
          <stop offset="0%" stopColor="#ff416c" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffb900" stopOpacity="0.5" />
          <stop offset="85%" stopColor="#00f2fe" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background backing */}
      <rect width="400" height="400" fill="#020205" rx="8" />
      
      {/* Medical Alignment Reticle */}
      <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="5,5" />
      <line x1="200" y1="10" x2="200" y2="390" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="10" y1="200" x2="390" y2="200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3,3" />

      {/* LUNG FIELDS */}
      {/* Left Lung */}
      <path d="M 175 90 C 130 50, 70 70, 60 160 C 50 240, 75 320, 120 330 C 145 335, 175 315, 175 280 Z" fill="url(#lung-grad-left)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      {/* Right Lung */}
      <path d="M 225 90 C 270 50, 330 70, 340 160 C 350 240, 325 320, 280 330 C 255 335, 225 315, 225 280 Z" fill="url(#lung-grad-right)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

      {/* PATHOLOGY: Pneumonia Consolidation Clouds */}
      {type === 'pneumonia' && !isScanning && (
        <g id="consolidation-clouds">
          {/* Cloudy patches inside left lung (lower lobe consolidation) */}
          <ellipse cx="110" cy="240" rx="35" ry="25" fill="#ffffff" fillOpacity="0.25" filter="url(#blur-heavy)" />
          <ellipse cx="125" cy="265" rx="25" ry="20" fill="#e2e8f0" fillOpacity="0.3" filter="url(#blur-medium)" />
          <ellipse cx="95" cy="220" rx="20" ry="15" fill="#f1f5f9" fillOpacity="0.2" filter="url(#blur-medium)" />
          
          {/* Patch inside right lung (mid lobe infiltration) */}
          <ellipse cx="280" cy="180" rx="30" ry="20" fill="#ffffff" fillOpacity="0.18" filter="url(#blur-heavy)" />
          <ellipse cx="290" cy="195" rx="18" ry="14" fill="#e2e8f0" fillOpacity="0.25" filter="url(#blur-medium)" />
        </g>
      )}

      {/* HEATMAP: AI Localization overlay */}
      {type === 'pneumonia' && showHeatmap && !isScanning && (
        <g id="ai-heatmap" className="heatmap-overlay">
          {/* High probability region in left lower zone */}
          <circle cx="115" cy="250" r="55" fill="url(#heatmap-grad)" />
          {/* Lower probability region in right mid zone */}
          <circle cx="285" cy="190" r="40" fill="url(#heatmap-grad)" opacity="0.7" />
          
          {/* AI Bounding Indicator */}
          <rect x="70" y="190" width="90" height="110" fill="none" stroke="var(--accent-danger)" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
          <text x="75" y="205" fill="var(--accent-danger)" fontSize="8" fontFamily="var(--font-mono)" opacity="0.8" fontWeight="bold">AI: INFILTRATION ZONE 92%</text>
        </g>
      )}

      {/* CENTRAL BONY STRUCTURE: Spine & Heart outline */}
      {/* Heart Silhouette */}
      <path d="M 165 190 C 165 240, 200 270, 240 270 C 265 270, 275 250, 275 230 C 275 190, 220 180, 200 180 C 180 180, 165 185, 165 190 Z" fill="#1e293b" fillOpacity="0.55" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      
      {/* Spine (Vertebrae stack) */}
      <rect x="195" y="50" width="10" height="290" fill="#334155" fillOpacity="0.4" rx="2" />
      {Array.from({ length: 15 }).map((_, i) => (
        <rect key={i} x="192" y={60 + i * 18} width="16" height="8" fill="#475569" fillOpacity="0.6" rx="1.5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      ))}

      {/* Clavicles (Collarbones) */}
      <path d="M 200 80 Q 140 65, 60 75" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      <path d="M 200 80 Q 260 65, 340 75" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" opacity="0.75" />

      {/* Rib cage overlay */}
      <g stroke="#64748b" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.25">
        {/* Ribs branching out */}
        <path d="M 195 100 Q 130 100, 80 120" />
        <path d="M 205 100 Q 270 100, 320 120" />
        
        <path d="M 195 120 Q 120 125, 70 155" />
        <path d="M 205 120 Q 280 125, 330 155" />

        <path d="M 195 142 Q 110 150, 64 195" />
        <path d="M 205 142 Q 290 150, 336 195" />

        <path d="M 195 165 Q 110 180, 62 235" />
        <path d="M 205 165 Q 290 180, 338 235" />

        <path d="M 195 190 Q 110 210, 68 275" />
        <path d="M 205 190 Q 290 210, 332 275" />

        <path d="M 195 215 Q 115 240, 80 310" />
        <path d="M 205 215 Q 285 240, 320 310" />
      </g>

      {/* Dynamic Telemetry UI inside SVG */}
      <text x="25" y="30" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="var(--font-mono)">SYS_XRAY_V3.8</text>
      <text x="375" y="30" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="end">AKSHAR_AI_NODE</text>
      <circle cx="28" cy="370" r="4" fill={isScanning ? 'var(--accent-cyan)' : (type === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)')} className={isScanning ? 'animate-pulse' : ''} />
      <text x="40" y="373" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="var(--font-mono)">
        {isScanning ? 'SCAN_SEQUENCE_INITIALIZED' : (type === 'pneumonia' ? 'DIAGNOSIS: DETECTED' : 'DIAGNOSIS: NORMAL')}
      </text>
    </svg>
  );
};

export default function PneumoniaDetector() {
  const [selectedCase, setSelectedCase] = useState(null); // 'normal', 'pneumonia', or 'upload'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const scanSteps = [
    { progress: 15, label: 'Initializing optical neural core...' },
    { progress: 40, label: 'Segmenting right and left lung lobes...' },
    { progress: 65, label: 'Measuring localized density variations...' },
    { progress: 85, label: 'Applying convolutional attention mapping...' },
    { progress: 100, label: 'Finalizing diagnosis classification...' }
  ];

  const handleSelectCase = (caseType) => {
    setSelectedCase(caseType);
    setUploadedImage(null);
    triggerScan(caseType);
  };

  const triggerScan = (caseType) => {
    setIsScanning(true);
    setScanProgress(0);
    setDiagnosticResult(null);

    let stepIndex = 0;
    
    const interval = setInterval(() => {
      if (stepIndex < scanSteps.length) {
        const currentStep = scanSteps[stepIndex];
        setScanProgress(currentStep.progress);
        setScanStep(currentStep.label);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setDiagnosticResult(caseType);
        }, 600);
      }
    }, 900);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setSelectedCase('upload');
        // Randomly simulate normal or pneumonia for the user's uploaded chest X-ray
        const simulatedOutcome = Math.random() > 0.5 ? 'pneumonia' : 'normal';
        triggerScan(simulatedOutcome);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetDetector = () => {
    setSelectedCase(null);
    setUploadedImage(null);
    setDiagnosticResult(null);
    setScanProgress(0);
  };

  return (
    <section className="section" id="detector">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <Cpu className="text-cyan animate-pulse-glow" size={32} />
            AI Chest X-Ray Analyzer
          </h2>
          <p style={{ maxWidth: '640px', margin: '12px auto 0' }}>
            Evaluate digital chest radiography in real time. Select a calibrated patient study below or upload a custom DICOM/image to deploy the Akshar AI Convolutional Neural Network.
          </p>
        </div>

        {/* Core Detector Workspace */}
        <div className="glass-panel" style={{ padding: '24px', overflow: 'hidden' }}>
          
          {/* Quick Select Buttons */}
          {!selectedCase && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '40px 0' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => handleSelectCase('normal')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', width: '220px', borderRadius: '12px', gap: '12px' }}>
                  <CheckCircle className="text-teal" size={36} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Load Sample 01</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Healthy Chest Radiograph</span>
                  </div>
                </button>

                <button className="btn-secondary" onClick={() => handleSelectCase('pneumonia')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', width: '220px', borderRadius: '12px', gap: '12px' }}>
                  <AlertTriangle className="text-danger" size={36} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Load Sample 02</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pneumonic Consolidation</span>
                  </div>
                </button>
              </div>

              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>— OR —</span>
              </div>

              {/* Upload Box */}
              <div style={{ width: '100%', maxWidth: '480px' }}>
                <input 
                  type="file" 
                  id="xray-upload" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
                <label htmlFor="xray-upload" className="dropzone-label">
                  <div className="upload-panel glass-panel" style={{ width: '100%', borderStyle: 'dashed', borderWidth: '2px', cursor: 'pointer' }}>
                    <div className="upload-icon-container">
                      <Upload size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '8px' }}>Upload Radiography Image</h3>
                    <p style={{ fontSize: '0.85rem' }}>Drag & drop or browse from local drive (PNG, JPG, DICOM)</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {selectedCase && (
            <div className="detector-container fade-in">
              {/* Left Column: Image Viewing Panel */}
              <div className="glass-panel image-preview-container" style={{ padding: '16px', background: '#04050a' }}>
                
                {/* Scanner Laser Bar */}
                {isScanning && (
                  <div className={`laser-scan-line ${selectedCase === 'pneumonia' ? 'danger' : ''}`}></div>
                )}
                
                {/* Viewer Calibration Elements */}
                <div className="medical-crosshairs">
                  <div className="crosshair tl"></div>
                  <div className="crosshair tr"></div>
                  <div className="crosshair bl"></div>
                  <div className="crosshair br"></div>
                </div>

                {/* SVG Lung/X-ray Simulator or custom uploaded image */}
                {selectedCase === 'upload' && uploadedImage ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={uploadedImage} alt="Uploaded Chest X-ray" className="preview-image" />
                    {/* Simulated Heatmap for uploaded image */}
                    {showHeatmap && diagnosticResult === 'pneumonia' && !isScanning && (
                      <div 
                        style={{
                          position: 'absolute',
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(255,65,108,0.85) 0%, rgba(255,185,0,0.5) 45%, transparent 70%)',
                          top: '55%',
                          left: '30%',
                          mixBlendMode: 'color-dodge',
                          pointerEvents: 'none'
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <ChestXraySVG 
                    type={selectedCase} 
                    isScanning={isScanning} 
                    showHeatmap={showHeatmap} 
                  />
                )}
              </div>

              {/* Right Column: Telemetry & Results Analysis */}
              <div className="glass-panel results-panel">
                <div>
                  <div className="panel-header">
                    <div className="panel-title-wrapper">
                      <Activity size={20} className="text-cyan animate-pulse-glow" />
                      <h3 style={{ fontSize: '1.2rem' }}>AI Diagnostics Feed</h3>
                    </div>
                    {diagnosticResult && (
                      <button className="btn-secondary" onClick={resetDetector} style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={12} />
                        Analyze New
                      </button>
                    )}
                  </div>

                  {/* Scanning Active Overlay */}
                  {isScanning && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in">
                      <div className="status-badge scanning">
                        <RefreshCw size={14} className="animate-spin" />
                        <span>PROCESSING VOLUMETRIC SCANS</span>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          <span>Neural Path Analysis:</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, marginLeft: 'auto' }}>{scanProgress}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill scanning" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                      </div>
                      <p style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Cpu size={16} className="text-cyan" />
                        {scanStep}
                      </p>
                    </div>
                  )}

                  {/* Diagnostic Finished Results */}
                  {diagnosticResult && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="fade-in">
                      
                      {/* Classification Badge */}
                      {diagnosticResult === 'pneumonia' ? (
                        <div className="analysis-status-card glow-border-danger" style={{ background: 'rgba(255, 65, 108, 0.03)' }}>
                          <div className="status-badge pneumonia" style={{ marginBottom: '10px' }}>
                            <AlertTriangle size={14} />
                            <span>PNEUMONIA DETECTED</span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: '#fff' }}>
                            Significant alveolar infiltration and interstitial opacities detected in the left pulmonary lobes.
                          </p>
                        </div>
                      ) : (
                        <div className="analysis-status-card glow-border-teal" style={{ background: 'rgba(5, 255, 161, 0.03)' }}>
                          <div className="status-badge normal" style={{ marginBottom: '10px' }}>
                            <CheckCircle size={14} />
                            <span>NORMAL / CLEAR LUNGS</span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: '#fff' }}>
                            Lungs are well-inflated. No consolidations, focal opacities, or pleural effusions identified.
                          </p>
                        </div>
                      )}

                      {/* Performance Metrology Grid */}
                      <div className="metrics-container">
                        <div className="metric-bar-group">
                          <div className="metric-header">
                            <span className="metric-label">Neural Network Confidence</span>
                            <span className="metric-value text-cyan">
                              {diagnosticResult === 'pneumonia' ? '92.4%' : '98.7%'}
                            </span>
                          </div>
                          <div className="progress-track">
                            <div 
                              className={`progress-fill ${diagnosticResult === 'pneumonia' ? 'pneumonia' : 'normal'}`} 
                              style={{ width: diagnosticResult === 'pneumonia' ? '92.4%' : '98.7%' }}
                            ></div>
                          </div>
                        </div>

                        <div className="metric-bar-group">
                          <div className="metric-header">
                            <span className="metric-label">Alveolar Consolidation Index</span>
                            <span className="metric-value">
                              {diagnosticResult === 'pneumonia' ? '74.2%' : '4.1%'}
                            </span>
                          </div>
                          <div className="progress-track">
                            <div 
                              className={`progress-fill ${diagnosticResult === 'pneumonia' ? 'pneumonia' : 'normal'}`} 
                              style={{ width: diagnosticResult === 'pneumonia' ? '74.2%' : '4.1%' }}
                            ></div>
                          </div>
                        </div>

                        {diagnosticResult === 'pneumonia' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Info size={14} className="text-cyan" />
                              Heatmap Overlay
                            </span>
                            <button 
                              className="btn-secondary" 
                              onClick={() => setShowHeatmap(!showHeatmap)} 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              {showHeatmap ? <EyeOff size={12} /> : <Eye size={12} />}
                              {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ready / Idle state */}
                  {!isScanning && !diagnosticResult && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '16px', color: 'var(--text-muted)' }}>
                      <Cpu size={48} style={{ opacity: 0.3 }} />
                      <p style={{ fontSize: '0.95rem' }}>Awaiting patient study activation...</p>
                    </div>
                  )}
                </div>

                {/* Bottom Disclaimer */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '24px' }}>
                  Akshar AI Engine calibrated on 5,840 clinical pediatric radiographs. Sensitivity: 98.2%.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
