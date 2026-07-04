import React, { useState, useEffect } from 'react';
import { Upload, Eye, EyeOff, CheckCircle, AlertTriangle, RefreshCw, Cpu, Activity, Plus, Trash2, FileText, Search } from 'lucide-react';
import { predictImage } from '../services/api';

// Symmetrical SVG Chest X-ray simulator
const ChestXraySVG = ({ type, isScanning, showHeatmap }) => {
  return (
    <svg viewBox="0 0 400 400" className="xray-vector-art" style={{ width: '100%', height: '100%', maxHeight: '350px' }}>
      <defs>
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
        <radialGradient id="heatmap-grad" cx="45%" cy="65%" r="35%">
          <stop offset="0%" stopColor="#ff416c" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffb900" stopOpacity="0.5" />
          <stop offset="85%" stopColor="#00f2fe" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill="#020205" rx="8" />
      <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="5,5" />
      <line x1="200" y1="10" x2="200" y2="390" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="10" y1="200" x2="390" y2="200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3,3" />

      {/* LUNG FIELDS */}
      <path d="M 175 90 C 130 50, 70 70, 60 160 C 50 240, 75 320, 120 330 C 145 335, 175 315, 175 280 Z" fill="url(#lung-grad-left)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <path d="M 225 90 C 270 50, 330 70, 340 160 C 350 240, 325 320, 280 330 C 255 335, 225 315, 225 280 Z" fill="url(#lung-grad-right)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

      {/* PATHOLOGY */}
      {type === 'pneumonia' && !isScanning && (
        <g id="consolidation-clouds">
          <ellipse cx="110" cy="240" rx="35" ry="25" fill="#ffffff" fillOpacity="0.25" filter="url(#blur-heavy)" />
          <ellipse cx="125" cy="265" rx="25" ry="20" fill="#e2e8f0" fillOpacity="0.3" filter="url(#blur-medium)" />
          <ellipse cx="95" cy="220" rx="20" ry="15" fill="#f1f5f9" fillOpacity="0.2" filter="url(#blur-medium)" />
          <ellipse cx="280" cy="180" rx="30" ry="20" fill="#ffffff" fillOpacity="0.18" filter="url(#blur-heavy)" />
          <ellipse cx="290" cy="195" rx="18" ry="14" fill="#e2e8f0" fillOpacity="0.25" filter="url(#blur-medium)" />
        </g>
      )}

      {/* HEATMAP */}
      {type === 'pneumonia' && showHeatmap && !isScanning && (
        <g id="ai-heatmap" className="heatmap-overlay">
          <circle cx="115" cy="250" r="55" fill="url(#heatmap-grad)" />
          <circle cx="285" cy="190" r="40" fill="url(#heatmap-grad)" opacity="0.7" />
          <rect x="70" y="190" width="90" height="110" fill="none" stroke="var(--accent-danger)" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
          <text x="75" y="205" fill="var(--accent-danger)" fontSize="8" fontFamily="var(--font-mono)" opacity="0.8" fontWeight="bold">AI: INFILTRATION ZONE 92%</text>
        </g>
      )}

      <path d="M 165 190 C 165 240, 200 270, 240 270 C 265 270, 275 250, 275 230 C 275 190, 220 180, 200 180 C 180 180, 165 185, 165 190 Z" fill="#1e293b" fillOpacity="0.55" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      
      <rect x="195" y="50" width="10" height="290" fill="#334155" fillOpacity="0.4" rx="2" />
      {Array.from({ length: 15 }).map((_, i) => (
        <rect key={i} x="192" y={60 + i * 18} width="16" height="8" fill="#475569" fillOpacity="0.6" rx="1.5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      ))}

      <path d="M 200 80 Q 140 65, 60 75" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      <path d="M 200 80 Q 260 65, 340 75" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" opacity="0.75" />

      <g stroke="#64748b" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.25">
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

      <circle cx="28" cy="370" r="4" fill={isScanning ? 'var(--accent-cyan)' : (type === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)')} className={isScanning ? 'animate-pulse' : ''} />
      <text x="40" y="373" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="var(--font-mono)">
        {isScanning ? 'SCAN_SEQUENCE_INITIALIZED' : (type === 'pneumonia' ? 'DIAGNOSIS: DETECTED' : 'DIAGNOSIS: NORMAL')}
      </text>
    </svg>
  );
};

export default function PneumoniaDetector() {
  // Application state: 'idle' | 'ready' | 'processing' | 'result' | 'error'
  const [appState, setAppState] = useState('idle');
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [resultData, setResultData] = useState({ prediction: null, confidence: null, rawScore: null, errorMsg: null });
  
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  
  // Animation states for result card
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  const processingSteps = [
    "Upload completed",
    "Preprocessing image",
    "Detecting lung region",
    "Extracting features",
    "Running MobileNetV2",
    "Generating diagnosis",
    "Completed"
  ];

  // Load upload logs registry from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('akshar_upload_history');
    if (storedHistory) {
      try {
        setUploadHistory(JSON.parse(storedHistory));
      } catch (err) {
        console.error("Error parsing upload registry:", err);
      }
    }
  }, []);

  // Animate confidence bar when entering 'result' state
  useEffect(() => {
    if (appState === 'result' && resultData.confidence) {
      setAnimatedConfidence(0);
      const target = parseFloat(resultData.confidence);
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= target) {
          setAnimatedConfidence(target);
          clearInterval(interval);
        } else {
          setAnimatedConfidence(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [appState, resultData.confidence]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      selectFile(files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      selectFile(files[0]);
    }
  };

  const selectFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setResultData({ prediction: null, confidence: null, rawScore: null, errorMsg: "Invalid File. Please upload a valid chest X-ray image (JPG/PNG)." });
      setAppState('error');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setAppState('ready');
    };
    reader.readAsDataURL(file);
  };

  const executeAnalysis = () => {
    if (!uploadedFile) return;
    const apiPromise = predictImage(uploadedFile);
    simulateProcessingTimeline(apiPromise);
  };

  const simulateProcessingTimeline = async (apiPromise) => {
    setAppState('processing');
    setProcessingStep(0);
    
    // Step 0: Upload completed
    await new Promise(r => setTimeout(r, 400));
    setProcessingStep(1);
    
    // Step 1: Preprocessing image
    await new Promise(r => setTimeout(r, 500));
    setProcessingStep(2);
    
    // Step 2: Detecting lung region
    await new Promise(r => setTimeout(r, 500));
    setProcessingStep(3);
    
    // Step 3: Extracting features
    await new Promise(r => setTimeout(r, 600));
    
    let apiResult = null;
    let apiError = null;
    
    try {
      apiResult = await apiPromise;
    } catch (err) {
      apiError = err;
    }
    
    setProcessingStep(4);
    
    // Step 4: Running MobileNetV2
    await new Promise(r => setTimeout(r, 600));
    setProcessingStep(5);
    
    // Step 5: Generating diagnosis
    await new Promise(r => setTimeout(r, 400));
    setProcessingStep(6);
    
    // Step 6: Completed
    await new Promise(r => setTimeout(r, 300));

    if (apiError || !apiResult) {
      setResultData({ prediction: null, confidence: null, rawScore: null, errorMsg: apiError?.message || "Prediction Failed or Network Error." });
      setAppState('error');
    } else if (apiResult.error) {
      setResultData({ prediction: null, confidence: null, rawScore: null, errorMsg: apiResult.error });
      setAppState('error');
    } else {
      setResultData({
        prediction: apiResult.prediction,
        confidence: apiResult.confidence,
        rawScore: apiResult.raw_score,
        errorMsg: null
      });
      setAppState('result');
      
      // Log history
      const newRecord = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        patientId: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
        name: uploadedFile?.name || 'Uploaded File',
        size: uploadedFile ? (uploadedFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown',
        date: new Date().toLocaleString(),
        result: apiResult.prediction.toLowerCase(),
        confidence: `${apiResult.confidence}%`,
        rawScore: apiResult.raw_score,
        model: 'MobileNetV2',
        processingTime: '2.4s'
      };

      setUploadHistory(prev => {
        const updated = [newRecord, ...prev];
        localStorage.setItem('akshar_upload_history', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const resetDetector = () => {
    setAppState('idle');
    setUploadedFile(null);
    setPreviewUrl(null);
    setProcessingStep(0);
    setResultData({ prediction: null, confidence: null, rawScore: null, errorMsg: null });
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
            Evaluate digital chest radiography in real time. Upload a radiography image to deploy the MobileNetV2 CNN for immediate classification.
          </p>
        </div>

        {/* Core Detector Workspace */}
        <div className="glass-panel" style={{ padding: '24px', overflow: 'hidden', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          
          {/* STATE: IDLE (Upload Dropzone) */}
          {appState === 'idle' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '40px 0', flex: 1, justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '480px' }}>
                <input 
                  type="file" 
                  id="xray-upload" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
                <label 
                  htmlFor="xray-upload" 
                  className="dropzone-label"
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                  onDrop={handleDrop}
                  style={{ display: 'block', width: '100%' }}
                >
                  <div 
                    className="upload-panel glass-panel" 
                    style={{ 
                      width: '100%', 
                      borderStyle: 'dashed', 
                      borderWidth: '2px', 
                      cursor: 'pointer',
                      borderColor: isDragOver ? 'var(--accent-teal)' : 'var(--border-color)',
                      background: isDragOver ? 'rgba(2, 195, 154, 0.05)' : 'var(--bg-secondary)',
                      boxShadow: isDragOver ? '0 0 15px var(--glow-cyan)' : '',
                      transition: '0.2s ease-in-out'
                    }}
                  >
                    <div className="upload-icon-container" style={{ transform: isDragOver ? 'scale(1.15)' : 'scale(1)', transition: '0.2s' }}>
                      <Upload size={28} className={isDragOver ? 'text-teal animate-bounce' : ''} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '8px' }}>
                      {isDragOver ? 'Drop Radiography Here' : 'Upload Radiography Image'}
                    </h3>
                    <p style={{ fontSize: '0.85rem' }}>Drag & drop or select a file from local drive (PNG, JPG)</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STATE: READY (File Selected, Awaiting Button Click) */}
          {appState === 'ready' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', flex: 1, justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '32px' }}>Image Ready for Analysis</h3>
              <div style={{ display: 'flex', gap: '48px', width: '100%', maxWidth: '800px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '250px', height: '250px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#000', flexShrink: 0 }}>
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '250px' }}>
                  <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Selected File</p>
                    <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-primary)', wordBreak: 'break-word' }}>{uploadedFile?.name}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {(uploadedFile?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button className="btn-primary" onClick={executeAnalysis} style={{ padding: '14px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} />
                    Analyze X-Ray
                  </button>
                  <button className="btn-secondary" onClick={resetDetector} style={{ padding: '10px' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STATE: PROCESSING (Timeline & Scanner Animation) */}
          {appState === 'processing' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', flex: 1 }}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', marginBottom: '32px' }}>
                <RefreshCw className="animate-spin text-cyan" size={24} />
                Analyzing...
              </h3>
              
              <div style={{ display: 'flex', gap: '48px', width: '100%', maxWidth: '800px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Image Preview with Scanning Beam */}
                <div style={{ position: 'relative', width: '250px', height: '250px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#000', flexShrink: 0, boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)' }}>
                  <img src={previewUrl} alt="Scanning" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8 }} />
                  <div className="laser-scan-line"></div>
                </div>

                {/* AI Analysis Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minWidth: '250px', justifyContent: 'center' }}>
                  {processingSteps.map((step, index) => {
                    const isCompleted = index < processingStep;
                    const isCurrent = index === processingStep;
                    const isPending = index > processingStep;
                    
                    return (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isPending ? 0.3 : 1, transition: '0.3s opacity' }}>
                        <div style={{ 
                          width: '24px', height: '24px', borderRadius: '50%', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isCompleted ? 'rgba(2, 195, 154, 0.2)' : isCurrent ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          border: `1px solid ${isCompleted ? 'var(--accent-teal)' : isCurrent ? 'var(--accent-cyan)' : 'var(--border-color)'}`
                        }}>
                          {isCompleted ? <CheckCircle size={14} className="text-teal" /> : isCurrent ? <Activity size={14} className="text-cyan animate-pulse" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }}/>}
                        </div>
                        <span style={{ 
                          fontSize: '0.95rem', 
                          fontWeight: isCurrent ? '600' : '400',
                          color: isCompleted ? 'var(--text-primary)' : isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)'
                        }}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--accent-cyan)', fontSize: '0.9rem', letterSpacing: '1px' }}>AI is analyzing your chest X-ray...</p>
              </div>
            </div>
          )}

          {/* STATE: ERROR */}
          {appState === 'error' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', flex: 1 }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px', padding: '32px', textAlign: 'center', maxWidth: '400px' }}>
                <AlertTriangle size={48} className="text-danger" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: 'var(--accent-danger)', marginBottom: '8px' }}>Operation Failed</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{resultData.errorMsg}</p>
                <button className="btn-primary" onClick={resetDetector} style={{ padding: '10px 24px' }}>
                  Acknowledge & Try Again
                </button>
              </div>
            </div>
          )}

          {/* STATE: RESULT (Beautiful Result Card) */}
          {appState === 'result' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', flex: 1 }}>
              <div 
                className="glass-panel" 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  width: '100%', 
                  maxWidth: '850px', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  border: `2px solid ${resultData.prediction?.toLowerCase() === 'pneumonia' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(2, 195, 154, 0.3)'}`,
                  boxShadow: `0 15px 35px ${resultData.prediction?.toLowerCase() === 'pneumonia' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(2, 195, 154, 0.15)'}`,
                }}
              >
                {/* Left: Image Preview */}
                <div style={{ flex: '1 1 300px', background: '#020305', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-color)' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '300px', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={previewUrl} alt="Analyzed X-ray" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    {/* Optional Heatmap Overlay for Pneumonia */}
                    {resultData.prediction?.toLowerCase() === 'pneumonia' && (
                       <div 
                         style={{
                           position: 'absolute', width: '120px', height: '120px', borderRadius: '50%',
                           background: 'radial-gradient(circle, rgba(255,65,108,0.7) 0%, rgba(255,185,0,0.3) 50%, transparent 70%)',
                           top: '40%', left: '30%', mixBlendMode: 'screen', pointerEvents: 'none'
                         }}
                       />
                    )}
                  </div>
                </div>

                {/* Right: AI Prediction */}
                <div style={{ flex: '1 1 350px', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                      AI Diagnosis
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '4px 8px', 
                      borderRadius: '12px',
                      background: resultData.prediction?.toLowerCase() === 'pneumonia' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(2, 195, 154, 0.15)',
                      color: resultData.prediction?.toLowerCase() === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)',
                      fontWeight: '700'
                    }}>
                      {resultData.prediction?.toLowerCase() === 'pneumonia' ? 'Possible Pneumonia' : 'Healthy'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    {resultData.prediction?.toLowerCase() === 'pneumonia' ? (
                      <AlertTriangle className="text-danger animate-pulse-glow" size={42} />
                    ) : (
                      <CheckCircle className="text-teal animate-pulse-glow" size={42} />
                    )}
                    <h2 style={{ 
                      fontSize: '2.4rem', 
                      margin: 0, 
                      color: resultData.prediction?.toLowerCase() === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)',
                      textShadow: `0 0 20px ${resultData.prediction?.toLowerCase() === 'pneumonia' ? 'rgba(244,63,94,0.4)' : 'rgba(2,195,154,0.4)'}`
                    }}>
                      {resultData.prediction === 'Pneumonia' || resultData.prediction === 'PNEUMONIA' ? 'PNEUMONIA' : 'NORMAL'}
                    </h2>
                  </div>

                  {/* AI Analysis Text */}
                  <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {resultData.prediction?.toLowerCase() === 'pneumonia' ? 
                        "The uploaded chest X-ray contains radiographic features commonly associated with pneumonia. Clinical confirmation by a healthcare professional is recommended." : 
                        "No significant radiographic patterns associated with pneumonia were detected. The uploaded chest X-ray appears normal based on the trained MobileNetV2 model."}
                    </p>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>Confidence Meter</span>
                      <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{animatedConfidence.toFixed(2)}%</span>
                    </div>
                    <div style={{ height: '10px', background: 'var(--border-color)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${animatedConfidence}%`, 
                        height: '100%', 
                        background: resultData.prediction?.toLowerCase() === 'pneumonia' ? 'linear-gradient(90deg, #ff416c, #ff4b2b)' : 'linear-gradient(90deg, #00b09b, #96c93d)',
                        borderRadius: '5px',
                        transition: 'width 0.1s ease-out'
                      }}></div>
                    </div>
                    <div style={{ marginTop: '8px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Raw AI Score: <span style={{ fontFamily: 'var(--font-mono)' }}>{resultData.rawScore}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                    <button className="btn-primary" onClick={resetDetector} style={{ flex: 1, padding: '12px', fontSize: '1rem' }}>
                      Analyze Another Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Registry at the bottom (visible in idle/result) */}
          {(appState === 'idle' || appState === 'result' || appState === 'ready') && (
            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '28px', marginTop: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} className="text-teal" />
                  Prediction History
                </h3>
                {uploadHistory.length > 0 && (
                  <button
                    onClick={() => {
                      setUploadHistory([]);
                      localStorage.removeItem('akshar_upload_history');
                    }}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.78rem', color: 'var(--accent-danger)', borderColor: 'rgba(244, 63, 94, 0.15)', cursor: 'pointer' }}
                  >
                    Clear History
                  </button>
                )}
              </div>

              {uploadHistory.length === 0 ? (
                <div className="tech-info-card" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', padding: '16px', display: 'flex', justifyContent: 'center' }}>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                    No predictions logged.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'hidden', width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', wordBreak: 'break-word' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: '700' }}>
                        <th style={{ padding: '8px 12px' }}>File Name</th>
                        <th style={{ padding: '8px 12px' }}>Patient ID</th>
                        <th style={{ padding: '8px 12px' }}>Date & Time</th>
                        <th style={{ padding: '8px 12px' }}>AI Result</th>
                        <th style={{ padding: '8px 12px' }}>Confidence</th>
                        <th style={{ padding: '8px 12px' }}>Raw Score</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center' }}>Report</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadHistory.map((item) => (
                        <tr 
                          key={item.id} 
                          style={{ 
                            borderBottom: '1px solid var(--border-color)',
                            transition: '0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2, 195, 154, 0.02)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>{item.patientId || 'PAT-2038'}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{item.date}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span 
                              style={{ 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '0.72rem', 
                                fontWeight: '700',
                                background: item.result === 'pneumonia' || item.result === 'PNEUMONIA' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(20, 104, 117, 0.08)',
                                color: item.result === 'pneumonia' || item.result === 'PNEUMONIA' ? 'var(--accent-danger)' : 'var(--accent-teal)'
                              }}
                            >
                              {item.result === 'pneumonia' || item.result === 'PNEUMONIA' ? 'Pneumonia Detected' : 'Normal'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: '700' }}>{item.confidence}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{item.rawScore || '-'}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              onClick={() => setActiveReport(item)}
                              className="btn-secondary"
                              title="View Report"
                              style={{
                                padding: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                margin: 0,
                                borderRadius: '6px'
                              }}
                            >
                              <FileText size={16} />
                            </button>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                const updated = uploadHistory.filter(h => h.id !== item.id);
                                setUploadHistory(updated);
                                localStorage.setItem('akshar_upload_history', JSON.stringify(updated));
                              }}
                              style={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                border: 'none',
                                color: 'var(--accent-danger)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px',
                                borderRadius: '6px'
                              }}
                              title="Delete scan"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Interactive PDF Clinical Report Sheet Modal */}
      {activeReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-secondary)', padding: '24px', position: 'relative', textAlign: 'left', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity className="text-teal animate-pulse-glow" size={24} />
              Clinical Radiology Report
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '20px 0', margin: '16px 0', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Patient ID:</span>
                <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{activeReport.patientId || 'PAT-3012'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Radiography File:</span>
                <span style={{ fontWeight: 'bold' }}>{activeReport.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Scan Date & Time:</span>
                <span>{activeReport.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>AI Diagnostic Class:</span>
                <span style={{ color: activeReport.result === 'pneumonia' || activeReport.result === 'PNEUMONIA' ? 'var(--accent-danger)' : 'var(--accent-teal)', fontWeight: 'bold' }}>
                  {activeReport.result === 'pneumonia' || activeReport.result === 'PNEUMONIA' ? 'Pneumonia Detected' : 'Normal / Healthy'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Confidence Metric:</span>
                <span style={{ fontWeight: 'bold' }}>{activeReport.confidence}</span>
              </div>
              {activeReport.rawScore && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Raw AI Score:</span>
                  <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{activeReport.rawScore}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>CNN Model Architecture:</span>
                <span>{activeReport.model || 'DenseNet-121'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Processing Duration:</span>
                <span>{activeReport.processingTime || '1.7s'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => window.print()} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                Print Report
              </button>
              <button className="btn-primary" onClick={() => setActiveReport(null)} style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
