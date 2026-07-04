import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle, Trash2, Search, Plus, FileText } from 'lucide-react';

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

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState(null);

  // Load records from localStorage on mount
  useEffect(() => {
    const loadRecords = () => {
      const storedHistory = localStorage.getItem('akshar_upload_history');
      if (storedHistory) {
        try {
          setRecords(JSON.parse(storedHistory));
        } catch (e) {
          console.error("Error loading scan logs:", e);
        }
      } else {
        // Pre-populate with default clinical records
        localStorage.setItem('akshar_upload_history', JSON.stringify(defaultMockRecords));
        setRecords(defaultMockRecords);
      }
    };
    loadRecords();
    
    // Add window listener to sync local storage changes
    window.addEventListener('storage', loadRecords);
    return () => window.removeEventListener('storage', loadRecords);
  }, []);

  const deleteRecord = (id) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('akshar_upload_history', JSON.stringify(updated));
  };

  const clearAllRecords = () => {
    if (window.confirm("Are you sure you want to clear all clinical radiography records from the active session?")) {
      setRecords([]);
      localStorage.removeItem('akshar_upload_history');
    }
  };

  const generateMockRecord = () => {
    const fileNames = [
      'patient_study_2041.png',
      'chest_xray_posture_ap.jpg',
      'cxr_segmentation_test.png',
      'radiograph_right_consolidation.jpg',
      'pediatric_chest_healthy.png',
      'clinical_imaging_scan_09.png'
    ];
    const outcomes = ['normal', 'pneumonia'];
    const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
    const randomNameModified = randomName
      .replace('.png', `_${Math.floor(100 + Math.random() * 900)}.png`)
      .replace('.jpg', `_${Math.floor(100 + Math.random() * 900)}.jpg`);
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const randomSize = (1.0 + Math.random() * 1.5).toFixed(2) + ' MB';
    
    const newRecord = {
      id: 'REC-XP' + Math.floor(1000 + Math.random() * 9000),
      patientId: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
      name: randomNameModified,
      size: randomSize,
      date: new Date().toLocaleString(),
      result: randomOutcome,
      confidence: randomOutcome === 'pneumonia' ? '92.4%' : '98.1%',
      model: 'DenseNet-121',
      processingTime: (1.2 + Math.random() * 1.0).toFixed(1) + 's'
    };
    
    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem('akshar_upload_history', JSON.stringify(updated));
  };

  // Filter records based on search query
  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.result === 'pneumonia' ? 'pneumonia detected' : 'normal').includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const totalScans = records.length;
  const pneumoniaCount = records.filter(r => r.result === 'pneumonia').length;
  const normalCount = records.filter(r => r.result === 'normal').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      
      {/* Header Banner */}
      <div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity className="text-teal animate-pulse-glow" size={32} />
          Clinical Radiography Records
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Review, filter, and audit all convolutional neural network diagnostic scan histories captured inside the active session context.
        </p>
      </div>

      {/* Analytics Statistics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        
        {/* Stat 1: Total Scans */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-secondary)' }}>
          <div className="tech-info-icon" style={{ background: 'rgba(2, 195, 154, 0.08)', color: 'var(--accent-teal)' }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Total Analyzed</span>
            <h3 style={{ fontSize: '1.4rem', margin: '2px 0 0' }}>{totalScans}</h3>
          </div>
        </div>

        {/* Stat 2: Normal Cases */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-secondary)' }}>
          <div className="tech-info-icon" style={{ background: 'rgba(20, 104, 117, 0.08)', color: 'var(--accent-teal)' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Healthy Clearances</span>
            <h3 style={{ fontSize: '1.4rem', margin: '2px 0 0', color: 'var(--accent-teal)' }}>{normalCount}</h3>
          </div>
        </div>

        {/* Stat 3: Pneumonia Detected */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-secondary)' }}>
          <div className="tech-info-icon" style={{ background: 'rgba(244, 63, 94, 0.08)', color: 'var(--accent-danger)' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Infiltrations Flagged</span>
            <h3 style={{ fontSize: '1.4rem', margin: '2px 0 0', color: 'var(--accent-danger)' }}>{pneumoniaCount}</h3>
          </div>
        </div>

      </div>

      {/* Filter and Clear Tools Box */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Search Input */}
        <div className="input-icon-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by name, Patient ID or result..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', height: '40px', background: 'var(--bg-secondary)' }}
          />
        </div>

        {/* Global Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={generateMockRecord}
            className="btn-primary"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.8rem', 
              cursor: 'pointer',
              height: '40px',
              fontWeight: '700'
            }}
          >
            <Plus size={14} />
            Generate Mock Scan
          </button>
          
          {records.length > 0 && (
            <button
              onClick={clearAllRecords}
              className="btn-secondary"
              style={{ 
                padding: '8px 16px', 
                fontSize: '0.8rem', 
                color: 'var(--accent-danger)', 
                borderColor: 'rgba(244, 63, 94, 0.15)', 
                cursor: 'pointer',
                height: '40px'
              }}
            >
              Clear All History
            </button>
          )}
        </div>
      </div>

      {/* Main Records Table panel */}
      <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-secondary)' }}>
        {filteredRecords.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              {records.length === 0 
                ? "No radiography scans registered. Run a scan in the uploads tab to populate records."
                : "No matching clinical records found matching your search query."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: '700' }}>
                  <th style={{ padding: '12px' }}>File Name</th>
                  <th style={{ padding: '12px' }}>Patient ID</th>
                  <th style={{ padding: '12px' }}>Scan Date</th>
                  <th style={{ padding: '12px' }}>AI Result</th>
                  <th style={{ padding: '12px' }}>Confidence</th>
                  <th style={{ padding: '12px' }}>Model</th>
                  <th style={{ padding: '12px' }}>Processing Time</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Report</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((item) => (
                  <tr 
                    key={item.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      transition: '0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2, 195, 154, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{item.patientId || 'PAT-3012'}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{item.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span 
                        style={{ 
                          padding: '3px 10px', 
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
                    <td style={{ padding: '12px', fontWeight: '700' }}>{item.confidence || (item.result === 'pneumonia' ? '92.4%' : '98.1%')}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{item.model || 'DenseNet-121'}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{item.processingTime || '1.7s'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => setActiveReport(item)}
                        className="btn-secondary"
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          margin: 0
                        }}
                      >
                        <FileText size={12} />
                        View
                      </button>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => deleteRecord(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-danger)',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'underline'
                        }}
                        title="Delete log entry"
                      >
                        <Trash2 size={12} />
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

    </div>
  );
}
