import React, { useState, useEffect } from 'react';
import { Upload, Eye, EyeOff, CheckCircle, AlertTriangle, RefreshCw, Cpu, Activity, Plus, Trash2, FileText } from 'lucide-react';

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
  const [selectedCase, setSelectedCase] = useState(null); // 'normal', 'pneumonia', or 'upload'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  
  // Bulk upload queue states
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isBatchScanning, setIsBatchScanning] = useState(false);
  const [activeQueueIndex, setActiveQueueIndex] = useState(null);

  const scanSteps = [
    { progress: 15, label: 'Initializing optical neural core...' },
    { progress: 40, label: 'Segmenting right and left lung lobes...' },
    { progress: 65, label: 'Measuring localized density variations...' },
    { progress: 85, label: 'Applying convolutional attention mapping...' },
    { progress: 100, label: 'Finalizing diagnosis classification...' }
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
    } else {
      const defaultMockRecords = [
        {
          id: 'REC-XP928',
          patientId: 'PAT-8402',
          name: 'patient_study_0842.png',
          size: '1.42 MB',
          date: '2026-06-27, 10:14:02 AM',
          result: 'normal',
          confidence: '98.1%',
          model: 'DenseNet-121',
          processingTime: '1.8s'
        },
        {
          id: 'REC-XP817',
          patientId: 'PAT-3392',
          name: 'cxr_opacity_consolidation.jpg',
          size: '2.18 MB',
          date: '2026-06-27, 11:22:45 AM',
          result: 'pneumonia',
          confidence: '92.4%',
          model: 'DenseNet-121',
          processingTime: '2.1s'
        },
        {
          id: 'REC-XP602',
          patientId: 'PAT-4109',
          name: 'chest_xray_pediatric_normal.png',
          size: '0.95 MB',
          date: '2026-06-27, 02:40:11 PM',
          result: 'normal',
          confidence: '99.3%',
          model: 'DenseNet-121',
          processingTime: '1.4s'
        },
        {
          id: 'REC-XP384',
          patientId: 'PAT-5829',
          name: 'radiograph_left_infiltrations.jpg',
          size: '1.87 MB',
          date: '2026-06-27, 03:05:54 PM',
          result: 'pneumonia',
          confidence: '91.8%',
          model: 'DenseNet-121',
          processingTime: '2.0s'
        },
        {
          id: 'REC-XP119',
          patientId: 'PAT-9021',
          name: 'patient_study_9901_clear.png',
          size: '1.63 MB',
          date: '2026-06-27, 04:50:33 PM',
          result: 'normal',
          confidence: '98.7%',
          model: 'DenseNet-121',
          processingTime: '1.6s'
        }
      ];
      localStorage.setItem('akshar_upload_history', JSON.stringify(defaultMockRecords));
      setUploadHistory(defaultMockRecords);
    }
  }, []);

  const triggerScan = (caseType, fileName = null, fileSize = null) => {
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

          // Add to log if from custom upload
          if (fileName) {
            const newRecord = {
              id: Math.random().toString(36).substr(2, 9).toUpperCase(),
              patientId: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
              name: fileName,
              size: fileSize || 'Unknown',
              date: new Date().toLocaleString(),
              result: caseType,
              confidence: caseType === 'pneumonia' ? '92.4%' : '98.1%',
              model: 'DenseNet-121',
              processingTime: (1.2 + Math.random() * 1.0).toFixed(1) + 's'
            };
            setUploadHistory(prev => {
              const updated = [newRecord, ...prev];
              localStorage.setItem('akshar_upload_history', JSON.stringify(updated));
              return updated;
            });
          }
        }, 600);
      }
    }, 900);
  };

  const processSelectedFiles = (files) => {
    const newItems = [];
    let processedCount = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newItems.push({
          id: Math.random().toString(36).substr(2, 9).toUpperCase(),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          dataUrl: reader.result,
          status: 'pending',
          result: null
        });

        processedCount++;
        if (processedCount === files.length) {
          setUploadQueue(prev => [...prev, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processSelectedFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processSelectedFiles(files);
    }
  };

  const runSingleScanPromise = (outcome) => {
    return new Promise((resolve) => {
      setIsScanning(true);
      setScanProgress(0);
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
            resolve(outcome);
          }, 300);
        }
      }, 400);
    });
  };

  const startBatchAnalysis = async () => {
    setIsBatchScanning(true);
    
    for (let i = 0; i < uploadQueue.length; i++) {
      if (uploadQueue[i].status === 'completed') continue;
      
      setActiveQueueIndex(i);
      
      setUploadQueue(prev => {
        const copy = [...prev];
        copy[i].status = 'scanning';
        return copy;
      });

      const simulatedOutcome = Math.random() > 0.5 ? 'pneumonia' : 'normal';
      await runSingleScanPromise(simulatedOutcome);

      setUploadQueue(prev => {
        const copy = [...prev];
        copy[i].status = 'completed';
        copy[i].result = simulatedOutcome;
        return copy;
      });

      const currentItem = uploadQueue[i];
      const newRecord = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        patientId: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
        name: currentItem.name,
        size: currentItem.size,
        date: new Date().toLocaleString(),
        result: simulatedOutcome,
        confidence: simulatedOutcome === 'pneumonia' ? '92.4%' : '98.1%',
        model: 'DenseNet-121',
        processingTime: (1.2 + Math.random() * 1.0).toFixed(1) + 's'
      };

      setUploadHistory(prev => {
        const updated = [newRecord, ...prev];
        localStorage.setItem('akshar_upload_history', JSON.stringify(updated));
        return updated;
      });
    }

    setActiveQueueIndex(null);
    setIsBatchScanning(false);
  };

  const inspectQueueItem = (item) => {
    if (item.status !== 'completed') return;
    setUploadedImage(item.dataUrl);
    setSelectedCase('upload');
    setDiagnosticResult(item.result);
    setIsScanning(false);
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
            Evaluate digital chest radiography in real time. Upload all radiography images at once to deploy the Akshar AI Convolutional Neural Network for batch classification.
          </p>
        </div>

        {/* Core Detector Workspace */}
        <div className="glass-panel" style={{ padding: '24px', overflow: 'hidden' }}>
          
          {/* 1. Upload Box Workspace (No files in queue, and no active detail preview) */}
          {!selectedCase && uploadQueue.length === 0 && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '40px 0' }}>
              
              {/* Upload Box Dropzone */}
              <div style={{ width: '100%', maxWidth: '480px' }}>
                <input 
                  type="file" 
                  id="xray-upload" 
                  accept="image/*" 
                  multiple
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
                <label 
                  htmlFor="xray-upload" 
                  className="dropzone-label"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
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
                      {isDragOver ? 'Drop Radiographies Here' : 'Upload Radiography Images'}
                    </h3>
                    <p style={{ fontSize: '0.85rem' }}>Drag & drop or select multiple files from local drive (PNG, JPG, DICOM)</p>
                  </div>
                </label>
              </div>

              {/* Upload details list registry below the upload component */}
              <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '28px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} className="text-teal" />
                    Radiography Image Upload Details & History
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
                      Clear Registry
                    </button>
                  )}
                </div>

                {uploadHistory.length === 0 ? (
                  <div className="tech-info-card" style={{ background: '#ffffff', borderColor: 'var(--border-color)', padding: '16px', display: 'flex', justifyContent: 'center' }}>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                      No radiography scans registered. Upload a chest X-ray to initiate AI telemetry logging.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', whiteSpace: 'nowrap' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: '700' }}>
                          <th style={{ padding: '8px 12px' }}>File Name</th>
                          <th style={{ padding: '8px 12px' }}>Patient ID</th>
                          <th style={{ padding: '8px 12px' }}>Scan Date</th>
                          <th style={{ padding: '8px 12px' }}>AI Result</th>
                          <th style={{ padding: '8px 12px' }}>Confidence</th>
                          <th style={{ padding: '8px 12px' }}>Model</th>
                          <th style={{ padding: '8px 12px' }}>Processing Time</th>
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
                                  background: item.result === 'pneumonia' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(20, 104, 117, 0.08)',
                                  color: item.result === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)'
                                }}
                              >
                                {item.result === 'pneumonia' ? 'Pneumonia Detected' : 'Normal'}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: '700' }}>{item.confidence || (item.result === 'pneumonia' ? '92.4%' : '98.1%')}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{item.model || 'DenseNet-121'}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{item.processingTime || '1.5s'}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <button
                                onClick={() => setActiveReport(item)}
                                className="btn-secondary"
                                style={{
                                  padding: '2px 6px',
                                  fontSize: '0.72rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  cursor: 'pointer',
                                  margin: 0
                                }}
                              >
                                <FileText size={11} />
                                View
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
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--accent-danger)',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  textDecoration: 'underline'
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 2. Bulk Batch Scan Queue Workspace */}
          {!selectedCase && uploadQueue.length > 0 && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px 0' }}>
              
              {/* Batch Telemetry Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity className="text-cyan animate-pulse-glow" size={24} />
                    Clinical Radiography Batch Analysis Queue
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    Successfully parsed {uploadQueue.length} radiographs. Initiate neural core scan below.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  {uploadQueue.some(item => item.status === 'pending') && !isBatchScanning && (
                    <button
                      onClick={startBatchAnalysis}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: '700' }}
                    >
                      Analyze All {uploadQueue.filter(item => item.status === 'pending').length} Radiographs
                    </button>
                  )}
                  {!isBatchScanning && (
                    <>
                      <input 
                        type="file" 
                        id="xray-upload-more" 
                        accept="image/*" 
                        multiple 
                        onChange={handleFileUpload} 
                        style={{ display: 'none' }} 
                      />
                      <label 
                        htmlFor="xray-upload-more" 
                        className="btn-secondary"
                        style={{ 
                          padding: '8px 16px', 
                          fontSize: '0.82rem', 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          margin: 0
                        }}
                      >
                        <Plus size={14} />
                        Add More
                      </label>
                    </>
                  )}
                  <button
                    onClick={() => {
                      if (!isBatchScanning || window.confirm("Cancel batch analysis run?")) {
                        setUploadQueue([]);
                        setIsBatchScanning(false);
                        setActiveQueueIndex(null);
                      }
                    }}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', color: 'var(--accent-danger)' }}
                  >
                    Clear Queue
                  </button>
                </div>
              </div>

              {/* Batch Queue List (Glassmorphic Cards) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {uploadQueue.map((item, index) => {
                  const isCurrent = index === activeQueueIndex;
                  return (
                    <div 
                      key={item.id} 
                      className="glass-panel" 
                      onClick={() => item.status === 'completed' && inspectQueueItem(item)}
                      style={{ 
                        padding: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        background: isCurrent ? 'rgba(2, 195, 154, 0.03)' : 'var(--bg-secondary)',
                        borderColor: isCurrent ? 'var(--accent-teal)' : 'var(--border-color)',
                        boxShadow: isCurrent ? '0 0 12px var(--glow-cyan)' : '',
                        transition: '0.3s',
                        cursor: item.status === 'completed' ? 'pointer' : 'default'
                      }}
                      title={item.status === 'completed' ? "Click to view full diagnosis & heatmap" : ""}
                    >
                      {/* Left: Thumbnail & Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                        {item.dataUrl && (
                          <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', background: '#000', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <img src={item.dataUrl} alt="Thumbnail" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                        )}
                        <div>
                          <h4 style={{ fontSize: '0.88rem', margin: 0, fontWeight: '700' }}>{item.name}</h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Size: {item.size}</span>
                        </div>
                      </div>

                      {/* Right: Status and Diagnosis outcome */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Progress Bar inside active row */}
                        {isCurrent && isScanning && (
                          <div style={{ width: '120px', textAlign: 'right' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--accent-teal)', fontWeight: '700', marginBottom: '2px' }}>Scanning: {scanProgress}%</div>
                            <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${scanProgress}%`, height: '100%', background: 'var(--accent-teal)' }}></div>
                            </div>
                          </div>
                        )}

                        <div style={{ minWidth: '160px', textAlign: 'right' }}>
                          {item.status === 'pending' && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Awaiting Scan</span>
                          )}
                          {item.status === 'scanning' && (
                            <span className="text-cyan animate-pulse" style={{ fontSize: '0.78rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <RefreshCw size={12} className="animate-spin" />
                              Running CNN...
                            </span>
                          )}
                          {item.status === 'completed' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                              <span 
                                style={{ 
                                  padding: '2px 8px', 
                                  borderRadius: '12px', 
                                  fontSize: '0.72rem', 
                                  fontWeight: '700',
                                  background: item.result === 'pneumonia' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(20, 104, 117, 0.08)',
                                  color: item.result === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)'
                                }}
                              >
                                {item.result === 'pneumonia' ? 'Pneumonia Detected (92.4%)' : 'Normal (98.1%)'}
                              </span>
                              <span style={{ fontSize: '0.62rem', color: 'var(--accent-teal)' }}>Click to view details</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* 3. Single Visual Inspection Workspace */}
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

              {/* Right Column: AI Analysis Telemetry Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Diagnostic Result Panel */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Activity size={18} className="text-cyan" />
                    AI Diagnostic Report
                  </h3>

                  {isScanning ? (
                    <div className="scanning-state" style={{ padding: '24px 0' }}>
                      <RefreshCw className="animate-spin text-cyan" size={36} style={{ margin: '0 auto 16px' }} />
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Scanning Radiograph...</h4>
                      
                      <div className="progress-track" style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', margin: '0 auto 12px', maxWidth: '300px' }}>
                        <div className="progress-bar" style={{ width: `${scanProgress}%`, height: '100%', background: 'var(--accent-teal)', transition: 'width 0.3s ease-in-out' }}></div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{scanStep}</p>
                    </div>
                  ) : diagnosticResult ? (
                    <div className="results-state fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '8px',
                        background: diagnosticResult === 'pneumonia' ? 'rgba(244, 63, 94, 0.06)' : 'rgba(20, 104, 117, 0.06)',
                        border: `1px solid ${diagnosticResult === 'pneumonia' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(20, 104, 117, 0.15)'}`
                      }}>
                        {diagnosticResult === 'pneumonia' ? (
                          <AlertTriangle className="text-danger" size={32} />
                        ) : (
                          <CheckCircle className="text-teal" size={32} />
                        )}
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', color: diagnosticResult === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)' }}>
                            {diagnosticResult === 'pneumonia' ? 'Pneumonia Detected' : 'No Infiltrations Found'}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Confidence: {diagnosticResult === 'pneumonia' ? '92.4%' : '98.1%'} (CNN Calibrated)
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                        <button 
                          className="btn-secondary"
                          onClick={() => setShowHeatmap(!showHeatmap)}
                          style={{ flex: 1, fontSize: '0.8rem', padding: '10px' }}
                        >
                          {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                        </button>
                        
                        <button 
                          className="btn-primary"
                          onClick={resetDetector}
                          style={{ flex: 1, fontSize: '0.8rem', padding: '10px' }}
                        >
                          Return to Queue
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '40px 0' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Radiography file parsed. Awaiting scan initiation.</p>
                    </div>
                  )}
                </div>

                {/* Model Telemetry Parameters */}
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                    Model Telemetry Parameters
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Architecture:</span>
                      <span style={{ fontWeight: 600 }}>Densenet-121 (CNN)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Input Resolution:</span>
                      <span style={{ fontWeight: 600 }}>1024 x 1024 px</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Local Caching:</span>
                      <span style={{ fontWeight: 600 }}>Active (Secure Session)</span>
                    </div>
                  </div>
                </div>

              </div>

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
                <span style={{ color: activeReport.result === 'pneumonia' ? 'var(--accent-danger)' : 'var(--accent-teal)', fontWeight: 'bold' }}>
                  {activeReport.result === 'pneumonia' ? 'Pneumonia Detected' : 'Normal / Healthy'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Confidence Metric:</span>
                <span style={{ fontWeight: 'bold' }}>{activeReport.confidence || (activeReport.result === 'pneumonia' ? '92.4%' : '98.1%')}</span>
              </div>
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
