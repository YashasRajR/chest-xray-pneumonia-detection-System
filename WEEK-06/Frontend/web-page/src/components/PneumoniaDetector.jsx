import React, { useState, useEffect } from 'react';
import { Upload, Eye, EyeOff, CheckCircle, AlertTriangle, RefreshCw, Cpu, Activity, Plus, Trash2, FileText, Search, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { predictImage, getHistory, deleteHistoryRecord, clearHistory } from '../services/api';

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

export default function PneumoniaDetector({ roleMode }) {
  // Application state: 'idle' | 'ready' | 'processing' | 'result' | 'error' | 'batch-ready' | 'batch-processing' | 'batch-result'
  const [appState, setAppState] = useState('idle');
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Batch processing states
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, results: [] });
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

  // Load upload logs registry from Database
  useEffect(() => {
    const fetchHistory = async () => {
      const records = await getHistory();
      setUploadHistory(records);
    };
    fetchHistory();
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
    processSelectedFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processSelectedFiles(files);
  };

  const processSelectedFiles = (files) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validFiles = files.filter(f => allowedTypes.includes(f.type));
    
    if (validFiles.length === 0) {
      setResultData({ prediction: null, confidence: null, rawScore: null, errorMsg: "Invalid File(s). Please upload a valid chest X-ray image (JPG/PNG)." });
      setAppState('error');
      return;
    }

    if (validFiles.length === 1) {
      selectFile(validFiles[0]);
    } else {
      setBatchFiles(validFiles);
      setAppState('batch-ready');
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

  const executeBatchAnalysis = async () => {
    setAppState('batch-processing');
    setBatchProgress({ current: 0, total: batchFiles.length, results: [] });
    let resultsArray = [];

    for (let i = 0; i < batchFiles.length; i++) {
      setBatchProgress(prev => ({ ...prev, current: i + 1 }));
      try {
        const result = await predictImage(batchFiles[i]);
        if (result.db_record) {
          setUploadHistory(prev => [result.db_record, ...prev]);
        }
        resultsArray.push({ file: batchFiles[i], result, status: 'success' });
      } catch (err) {
        resultsArray.push({ file: batchFiles[i], error: err.message, status: 'error' });
      }
    }
    setBatchProgress(prev => ({ ...prev, results: resultsArray }));
    setAppState('batch-result');
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
      
      // Log history using the actual DB record returned by backend
      if (apiResult.db_record) {
        setUploadHistory(prev => {
          return [apiResult.db_record, ...prev];
        });
      }
    }
  };

  const resetDetector = () => {
    setAppState('idle');
    setUploadedFile(null);
    setPreviewUrl(null);
    setBatchFiles([]);
    setBatchProgress({ current: 0, total: 0, results: [] });
    setProcessingStep(0);
    setResultData({ prediction: null, confidence: null, rawScore: null, errorMsg: null });
  };

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    const actionButtons = document.getElementById('report-actions');
    
    if (actionButtons) actionButtons.style.display = 'none';

    const opt = {
      margin:       10,
      filename:     `clinical_report_${activeReport?.patientId || 'new'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      if (actionButtons) actionButtons.style.display = 'flex';
    });
  };

  return (
    <section className="section" id="detector">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.75rem', margin: '0' }}>
            <Cpu className="text-cyan animate-pulse-glow" size={28} />
            AI Chest X-Ray Analyzer
          </h2>
          <p style={{ maxWidth: '640px', margin: '8px auto 0', fontSize: '0.9rem' }}>
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
                  multiple={roleMode === 'technician'}
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
                    <h3 style={{ fontSize: '1.25rem', marginTop: '8px', color: 'var(--text-primary)' }}>
                      {isDragOver ? 'Drop X-Ray Here' : 'Select or drop your X-Ray here'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Drag & drop or select a file (PNG, JPG)</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STATE: BATCH READY */}
          {appState === 'batch-ready' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', flex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Batch Ready ({batchFiles.length} files)</h3>
              <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '16px', maxHeight: '250px', overflowY: 'auto', marginBottom: '24px' }}>
                {batchFiles.map((f, i) => (
                  <div key={i} style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{f.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(f.size/1024/1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn-primary" onClick={executeBatchAnalysis} style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', gap: '8px' }}>
                  <Activity size={20} /> Analyze Batch
                </button>
                <button className="btn-secondary" onClick={resetDetector} style={{ padding: '12px 24px' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* STATE: BATCH PROCESSING */}
          {appState === 'batch-processing' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', flex: 1, justifyContent: 'center' }}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', marginBottom: '16px' }}>
                <RefreshCw className="animate-spin text-cyan" size={24} />
                Processing Batch...
              </h3>
              <p style={{ marginBottom: '32px', color: 'var(--text-secondary)' }}>
                Analyzing {batchProgress.current} of {batchProgress.total} images
              </p>
              
              <div style={{ width: '100%', maxWidth: '500px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  background: 'var(--accent-teal)', 
                  width: `${(batchProgress.current / batchProgress.total) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* STATE: BATCH RESULT */}
          {appState === 'batch-result' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', flex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '24px', color: 'var(--accent-teal)' }}>Batch Analysis Complete</h3>
              <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '16px', maxHeight: '400px', overflowY: 'auto', marginBottom: '24px' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px' }}>File</th>
                      <th style={{ padding: '12px' }}>Diagnosis</th>
                      <th style={{ padding: '12px' }}>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchProgress.results.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px' }}>{r.file.name}</td>
                        {r.status === 'success' ? (
                          <>
                            <td style={{ padding: '12px', fontWeight: 'bold', color: r.result.prediction.toLowerCase() === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)' }}>
                              {r.result.prediction}
                            </td>
                            <td style={{ padding: '12px' }}>{r.result.confidence}%</td>
                          </>
                        ) : (
                          <td colSpan="2" style={{ padding: '12px', color: 'var(--accent-danger)' }}>Error: {r.error}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn-primary" onClick={resetDetector} style={{ padding: '12px 24px' }}>
                Analyze Another Batch
              </button>
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
                    Start Scan
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Upload Your X-Ray</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Our AI system will securely analyze your chest X-ray for signs of pneumonia.
                  </p>
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
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', flex: 1, width: '100%' }}>
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
                  border: `2px solid ${resultData.prediction?.toLowerCase() === 'pneumonia' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(2, 195, 154, 0.4)'}`,
                  boxShadow: `0 10px 25px ${resultData.prediction?.toLowerCase() === 'pneumonia' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(2, 195, 154, 0.15)'}`,
                }}
              >
                {/* Left: Image Preview */}
                <div style={{ 
                  flex: '1 1 300px', 
                  background: '#020305', 
                  padding: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRight: '1px solid var(--border-color)',
                  position: 'relative'
                }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '280px', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={previewUrl} alt="Analyzed X-ray" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
                    {/* Optional Heatmap Overlay for Pneumonia */}
                    {resultData.prediction?.toLowerCase() === 'pneumonia' && (
                       <div 
                         style={{
                           position: 'absolute', width: '100px', height: '100px', borderRadius: '50%',
                           background: 'radial-gradient(circle, rgba(255,65,108,0.7) 0%, rgba(255,185,0,0.3) 50%, transparent 70%)',
                           top: '40%', left: '30%', mixBlendMode: 'screen', pointerEvents: 'none'
                         }}
                       />
                    )}
                  </div>
                </div>

                {/* Right: AI Prediction */}
                <div style={{ flex: '1 1 350px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                      AI Diagnosis
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '4px 10px', 
                      borderRadius: '16px',
                      background: resultData.prediction?.toLowerCase() === 'pneumonia' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(2, 195, 154, 0.15)',
                      color: resultData.prediction?.toLowerCase() === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)',
                      fontWeight: '700'
                    }}>
                      {resultData.prediction.toLowerCase() === 'pneumonia' ? 'Pneumonia Detected' : 'No Pneumonia Detected'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    {resultData.prediction?.toLowerCase() === 'pneumonia' ? (
                      <AlertTriangle className="text-danger animate-pulse-glow" size={36} />
                    ) : (
                      <CheckCircle className="text-teal animate-pulse-glow" size={36} />
                    )}
                    <h2 style={{ 
                      fontSize: '2rem', 
                      margin: 0, 
                      color: resultData.prediction?.toLowerCase() === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)',
                      textShadow: `0 0 15px ${resultData.prediction?.toLowerCase() === 'pneumonia' ? 'rgba(244,63,94,0.4)' : 'rgba(2,195,154,0.4)'}`
                    }}>
                      {resultData.prediction === 'Pneumonia' || resultData.prediction === 'PNEUMONIA' ? 'PNEUMONIA' : 'NORMAL'}
                    </h2>
                  </div>

                  {/* AI Analysis Text */}
                  <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {resultData.prediction?.toLowerCase() === 'pneumonia' ? 
                        "Radiographic features commonly associated with pneumonia detected. Clinical confirmation recommended." : 
                        "No significant radiographic patterns associated with pneumonia were detected."}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Confidence Meter</span>
                      <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{animatedConfidence.toFixed(2)}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${animatedConfidence}%`, 
                        height: '100%', 
                        background: resultData.prediction?.toLowerCase() === 'pneumonia' ? 'linear-gradient(90deg, #ff416c, #ff4b2b)' : 'linear-gradient(90deg, #00b09b, #96c93d)',
                        borderRadius: '4px',
                        transition: 'width 0.1s ease-out'
                      }}></div>
                    </div>
                    <div style={{ marginTop: '6px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Raw Score: <span style={{ fontFamily: 'var(--font-mono)' }}>{resultData.rawScore}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button className="btn-primary" onClick={resetDetector} style={{ flex: 1, padding: '10px', fontSize: '0.95rem' }}>
                      Analyze Another
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
                    onClick={async () => {
                      try {
                        await clearHistory();
                        setUploadHistory([]);
                      } catch (err) {
                        console.error("Failed to clear history");
                      }
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
                        <th style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>File Name</th>
                        <th style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>Patient ID</th>
                        <th style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>Date & Time</th>
                        <th style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>AI Result</th>
                        <th style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>Confidence</th>
                        <th style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>Raw Score</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', whiteSpace: 'nowrap' }}>Report</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
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
                          <td 
                            style={{ 
                              padding: '10px 12px', 
                              fontWeight: '600', 
                              color: 'var(--accent-teal)',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              maxWidth: '120px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            onClick={() => {
                              if (item.imagePath) {
                                window.open(`/uploads/${item.imagePath}`, '_blank');
                              } else {
                                alert('Original image not available for this legacy record.');
                              }
                            }}
                            title={item.imagePath ? `Open ${item.name} X-Ray Image` : `Image not available`}
                          >
                            {item.name}
                          </td>
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
                              onClick={async () => {
                                try {
                                  await deleteHistoryRecord(item.id);
                                  const updated = uploadHistory.filter(h => h.id !== item.id);
                                  setUploadHistory(updated);
                                } catch (err) {
                                  console.error("Failed to delete record");
                                }
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

      {/* Professional Clinical Report Modal */}
      {activeReport && (
        <div className="print-modal-wrapper" onClick={() => setActiveReport(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '20px 16px', overflowY: 'auto', cursor: 'pointer' }}>
          <div id="report-content" className="print-report" onClick={(e) => e.stopPropagation()} style={{ width: '700px', background: '#ffffff', color: '#000000', padding: '40px', position: 'relative', textAlign: 'left', borderRadius: '4px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', margin: 'auto', cursor: 'default' }}>
            
            {/* Header / Letterhead */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #000000', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900, letterSpacing: '1px', color: '#000000', WebkitTextFillColor: '#000000', background: 'none' }}>AKSHAR AI</h1>
                <h3 style={{ margin: '5px 0 0 0', fontSize: '1rem', color: '#444444', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', WebkitTextFillColor: '#444444', background: 'none' }}>Radiology Diagnostics</h3>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#666666' }}>123 Medical Plaza, Health District<br/>Tel: (555) 123-4567 | clinical@akshar.ai</p>
              </div>
              <div style={{ textAlign: 'right', color: '#000000' }}>
                <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', color: '#000000', WebkitTextFillColor: '#000000', background: 'none' }}>Clinical Report</h2>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', fontWeight: 600 }}>Date: {new Date(activeReport.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.95rem' }}>Report ID: {activeReport.id || 'REP-NEW'}</p>
              </div>
            </div>

            {/* Patient Information Box */}
            <div style={{ border: '2px solid #dddddd', padding: '12px 15px', marginBottom: '20px', background: '#fcfcfc', borderRadius: '4px' }}>
              <table style={{ width: '100%', fontSize: '0.9rem', color: '#000000' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 0', width: '20%', fontWeight: 700 }}>Patient ID:</td>
                    <td style={{ padding: '4px 0', width: '30%', fontFamily: 'monospace', fontWeight: 600 }}>{activeReport.patientId || 'PAT-3012'}</td>
                    <td style={{ padding: '6px 0', width: '20%', fontWeight: 700 }}>Study Type:</td>
                    <td style={{ padding: '6px 0', width: '30%' }}>Chest Radiograph (PA View)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>Name:</td>
                    <td style={{ padding: '6px 0' }}>{activeReport.name}</td>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>Scan Date:</td>
                    <td style={{ padding: '6px 0' }}>{new Date(activeReport.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Clinical Findings */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, borderBottom: '1px solid #eeeeee', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase', color: '#000000', WebkitTextFillColor: '#000000', background: 'none' }}>Diagnostic Findings</h3>
            
            <div style={{ display: 'flex', gap: '30px', marginBottom: '25px' }}>
              <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.5, color: '#000000' }}>
                <p style={{ margin: '0 0 10px 0' }}><strong>Indication:</strong> Evaluation for pulmonary infiltrates or opacities suggestive of pneumonia.</p>
                <p style={{ margin: '0 0 10px 0' }}><strong>Methodology:</strong> The provided chest radiograph was analyzed using the Akshar AI {activeReport.model || 'MobileNetV2'} Deep Learning Architecture.</p>
                
                <div style={{ background: '#f5f5f5', padding: '15px 20px', borderLeft: `5px solid ${activeReport.result === 'pneumonia' || activeReport.result === 'PNEUMONIA' ? '#d32f2f' : '#2e7d32'}`, marginTop: '20px' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '1.05rem' }}>
                    <strong>AI Conclusion: </strong> 
                    <span style={{ color: activeReport.result === 'pneumonia' || activeReport.result === 'PNEUMONIA' ? '#d32f2f' : '#2e7d32', fontWeight: 800, textTransform: 'uppercase' }}>
                      {activeReport.result === 'pneumonia' || activeReport.result === 'PNEUMONIA' ? 'Pneumonia Detected' : 'Normal / Healthy'}
                    </span>
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Confidence Score: </strong> {activeReport.confidence}
                  </p>
                  {activeReport.rawScore && (
                    <p style={{ margin: '5px 0 0 0' }}>
                      <strong>Raw AI Score: </strong> {activeReport.rawScore}
                    </p>
                  )}
                </div>
              
              {/* Image constrained to fit well in the report */}
              {activeReport.imagePath && (
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img 
                    src={activeReport.imagePath.startsWith('blob:') ? activeReport.imagePath : `/uploads/${activeReport.imagePath}`} 
                    alt="Radiograph" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #cccccc', marginBottom: '5px', background: '#000000' }} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23111"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-family="sans-serif" font-size="14">Image Unavailable</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23555" font-family="sans-serif" font-size="10">(Storage Reset)</text></svg>';
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#666666', fontWeight: 600 }}>Analyzed Radiograph</span>
                </div>
              )}
            </div>

            {/* Disclaimer & Signatures */}
            <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: '#666666' }}>
              <p style={{ borderTop: '2px solid #eeeeee', paddingTop: '10px', marginBottom: '30px' }}>
                <em>Disclaimer: This report was generated by an artificial intelligence diagnostic assistant. It is intended to augment, not replace, professional medical judgement. Clinical correlation is recommended.</em>
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', color: '#000000' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid #000000', height: '40px' }}></div>
                  <p style={{ margin: '8px 0 0 0', fontWeight: 700 }}>AI System Architect</p>
                </div>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid #000000', height: '40px' }}></div>
                  <p style={{ margin: '8px 0 0 0', fontWeight: 700 }}>Attending Physician</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons (Hidden when printing) */}
            <div id="report-actions" className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px', borderTop: '2px solid #eeeeee', paddingTop: '20px' }}>
              <button className="btn-secondary" onClick={downloadPDF} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <Download size={18} /> Download PDF
              </button>
              <button className="btn-secondary" onClick={() => window.print()} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                Print Report
              </button>
              <button className="btn-primary" onClick={() => setActiveReport(null)} style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
