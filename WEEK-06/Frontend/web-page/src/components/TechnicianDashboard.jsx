import React, { useState, useEffect } from 'react';
import { Activity, Users, FileBarChart, PieChart, CheckCircle, Search, Clock } from 'lucide-react';

export default function TechnicianDashboard({ token }) {
  const [analytics, setAnalytics] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const actualToken = token || localStorage.getItem('akshar_token');
      const [analyticsRes, patientsRes] = await Promise.all([
        fetch('http://127.0.0.1:5000/api/technician/analytics', {
          headers: { 'Authorization': `Bearer ${actualToken}` }
        }),
        fetch('http://127.0.0.1:5000/api/technician/patients', {
          headers: { 'Authorization': `Bearer ${actualToken}` }
        })
      ]);

      if (!analyticsRes.ok || !patientsRes.ok) {
        throw new Error("Failed to fetch dashboard metrics (Status: " + analyticsRes.status + ")");
      }

      const analyticsData = await analyticsRes.json();
      const patientsData = await patientsRes.json();

      setAnalytics(analyticsData);
      setPatients(patientsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ color: 'var(--accent-cyan)' }}>Synchronizing Subsystems...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '40px', color: 'var(--accent-danger)' }}>
        Error loading telemetry: {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
      
      {/* HUD Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '10px 0' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '4px', color: 'var(--text-primary)' }}>System Telemetry</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} className="text-cyan" /> Live Diagnostic Feed
          </p>
        </div>
        <div className="badge-fda" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle size={12} /> {analytics?.modelStatus || 'Online'} - {analytics?.modelVersion}
        </div>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        {/* Total Scans Card */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Processed</span>
            <FileBarChart size={18} className="text-teal" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {analytics?.totalScans}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
            + {analytics?.todayScans} scans today
          </div>
        </div>

        {/* Positive Detection Ratio */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Detection Ratio (PNE)</span>
            <PieChart size={18} className="text-danger" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-danger)', lineHeight: 1 }}>
            {analytics?.positiveRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Of all uploaded diagnostics
          </div>
        </div>

        {/* Registered Patients */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Global Patients</span>
            <Users size={18} className="text-purple" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {patients.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Unique registered profiles
          </div>
        </div>

      </div>

      {/* Patient Directory */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Global Patient Directory</h3>
          
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: '36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Patient ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Full Name</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Registered</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Total Scans</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Last Scan Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No patients match your search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(13, 104, 116, 0.1)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {patient.patientId}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {patient.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {patient.registeredAt}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: 'var(--glow-cyan)', color: 'var(--accent-teal)', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                        {patient.totalScans}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> {patient.lastScanDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
