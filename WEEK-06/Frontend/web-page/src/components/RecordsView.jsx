import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle, Trash2, Search, Plus, FileText, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

import { getHistory, deleteHistoryRecord, clearHistory, predictImage } from '../services/api';

const defaultMockRecords = [
  // ... omitting mock records since we are using db
];

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState(null);

  // Load records from database on mount
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const history = await getHistory();
        setRecords(history);
      } catch (e) {
        console.error("Error loading scan logs:", e);
      }
    };
    loadRecords();
  }, []);

  const deleteRecord = async (id) => {
    try {
      await deleteHistoryRecord(id);
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
    } catch (err) {
      console.error("Error deleting record");
    }
  };

  const clearAllRecords = async () => {
    if (window.confirm("Are you sure you want to clear all clinical radiography records from the active session?")) {
      try {
        await clearHistory();
        setRecords([]);
      } catch (err) {
        console.error("Error clearing records");
      }
    }
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

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    const actionButtons = document.getElementById('report-actions');
    
    if (actionButtons) actionButtons.style.display = 'none';

    const opt = {
      margin:       10,
      filename:     `clinical_report_${activeReport?.patientId || 'record'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      if (actionButtons) actionButtons.style.display = 'flex';
    });
  };

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
          <div style={{ overflowX: 'hidden', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', wordBreak: 'break-word' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: '700' }}>
                  <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>File Name</th>
                  <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Patient ID</th>
                  <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Scan Date</th>
                  <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>AI Result</th>
                  <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Confidence</th>
                  <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Model</th>
                  <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Processing Time</th>
                  <th style={{ padding: '12px', textAlign: 'center', whiteSpace: 'nowrap' }}>Report</th>
                  <th style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
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
                    <td 
                      style={{ 
                        padding: '12px', 
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
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{item.model || 'MobileNetV2'}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{item.processingTime || '1.7s'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
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
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => deleteRecord(item.id)}
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
                        title="Delete log entry"
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

      {/* Professional Clinical Report Modal */}
      {activeReport && (
        <div className="print-modal-wrapper" onClick={() => setActiveReport(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '20px 16px', overflowY: 'auto', cursor: 'pointer' }}>
          <div id="report-content" className="print-report" onClick={(e) => e.stopPropagation()} style={{ width: '700px', background: '#ffffff', color: '#000000', padding: '40px', position: 'relative', textAlign: 'left', borderRadius: '4px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', margin: 'auto', cursor: 'default' }}>
            
            {/* Header / Letterhead */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #000000', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900, letterSpacing: '1px', color: '#000000', WebkitTextFillColor: '#000000', background: 'none' }}>AKSHAR AI</h1>
                <h3 style={{ margin: '5px 0 0 0', fontSize: '1rem', color: '#444444', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', WebkitTextFillColor: '#444444', background: 'none' }}>Radiology Diagnostics</h3>
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
                    <td style={{ padding: '6px 0', width: '20%', fontWeight: 700 }}>Patient ID:</td>
                    <td style={{ padding: '6px 0', width: '30%', fontFamily: 'monospace', fontWeight: 600 }}>{activeReport.patientId || 'PAT-3012'}</td>
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
              </div>
              
              {/* Image constrained to fit well in the report */}
              {activeReport.imagePath && (
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img 
                    src={activeReport.imagePath.startsWith('blob:') ? activeReport.imagePath : `/uploads/${activeReport.imagePath}`} 
                    alt="Radiograph" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #cccccc', marginBottom: '5px', background: '#000000' }} 
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

    </div>
  );
}
