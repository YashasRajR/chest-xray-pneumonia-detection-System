import React, { useState, useEffect } from 'react';
import { User, Calendar, Mail, Lock, ShieldCheck, Database, Key, Phone, Edit, Check, LogOut } from 'lucide-react';
import { loginUser, registerUser, updateUser } from '../services/api';

export default function LoginForm({ user, onLogin, onLogout, roleMode }) {
  const [formMode, setFormMode] = useState('signin'); // 'signin' or 'register'
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    age: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [editErrors, setEditErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Forgot Password Flow States
  const [resetStep, setResetStep] = useState(0); // 0: Hidden, 1: Email, 2: Nickname & New Password
  const [resetEmail, setResetEmail] = useState('');
  const [resetNickname, setResetNickname] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetErrors, setResetErrors] = useState({});

  // Sync edit form state when user updates
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        age: user.age || '',
        mobile: user.mobile || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    const labelName = roleMode === 'technician' ? 'Technician name' : 'Full name';
    
    if (formMode === 'register') {
      if (!formData.name.trim()) {
        tempErrors.name = `${labelName} is required`;
      }
      if (!formData.nickname.trim()) {
        tempErrors.nickname = 'Nickname is required';
      }
      if (!formData.age.trim()) {
        tempErrors.age = 'Age is required';
      } else if (isNaN(formData.age) || parseInt(formData.age) <= 0 || parseInt(formData.age) > 120) {
        tempErrors.age = 'Invalid';
      }
      if (!formData.mobile.trim()) {
        tempErrors.mobile = 'Mobile is required';
      } else if (!/^\d{10}$/.test(formData.mobile.replace(/[-\s()]/g, ''))) {
        tempErrors.mobile = 'Must be 10 digits';
      }
      if (!formData.confirmPassword) {
        tempErrors.confirmPassword = 'Confirm password is required';
      } else if (formData.confirmPassword !== formData.password) {
        tempErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email ID is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid';
    }
    
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Min 6 chars';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const isTech = roleMode === 'technician';
      
      try {
        if (formMode === 'signin') {
          // Call API to login
          const data = await loginUser(formData.email, formData.password);
          
          localStorage.setItem('akshar_token', data.token);

          onLogin({
            name: data.user.name,
            email: data.user.email,
            id: data.user.id,
            patientId: data.user.patient_id,
            role: data.user.role === 'technician' ? 'Operator' : 'Patient',
            licenseKey: data.user.role === 'technician' 
              ? `AK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
              : data.user.patient_id,
            age: data.user.age,
            mobile: data.user.mobile
          });

        } else {
          const regRes = await registerUser(
            formData.name, 
            formData.email, 
            formData.password,
            formData.nickname,
            formData.age,
            formData.mobile,
            isTech ? 'technician' : 'patient'
          );
          
          const data = await loginUser(formData.email, formData.password);
          localStorage.setItem('akshar_token', data.token);

          onLogin({
            name: data.user.name,
            email: data.user.email,
            id: data.user.id,
            patientId: data.user.patient_id || regRes.patient_id,
            role: data.user.role === 'technician' ? 'Operator' : 'Patient',
            licenseKey: data.user.role === 'technician' 
              ? `AK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
              : (data.user.patient_id || regRes.patient_id),
            age: data.user.age,
            mobile: data.user.mobile
          });
        }
      } catch (err) {
        setErrors({
          email: err.message
        });
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!editData.name.trim()) tempErrors.name = 'Full name is required';
    if (!editData.age || parseInt(editData.age) <= 0 || parseInt(editData.age) > 120) {
      tempErrors.age = 'Provide a valid age (1-120)';
    }
    if (!editData.mobile.trim()) {
      tempErrors.mobile = 'Mobile is required';
    } else if (!/^\d{10}$/.test(editData.mobile.replace(/[-\s()]/g, ''))) {
      tempErrors.mobile = 'Must be 10 digits';
    }

    // Optional password change validation
    if (editData.password) {
      if (editData.password.length < 6) {
        tempErrors.password = 'Min 6 chars';
      }
      if (editData.password !== editData.confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(tempErrors).length > 0) {
      setEditErrors(tempErrors);
      return;
    }

    try {
      const result = await updateUser({
        name: editData.name,
        age: editData.age,
        mobile: editData.mobile,
        password: editData.password
      });

      onLogin({
        ...user,
        name: result.user.name,
        age: result.user.age,
        mobile: result.user.mobile
      });
      setIsEditing(false);
    } catch (err) {
      setEditErrors({ api: err.message });
    }
  };

  const handleForgotPassword = () => {
    setResetStep(1);
    setResetEmail(formData.email || '');
    setResetErrors({});
  };

  const submitForgotPasswordStep1 = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetErrors({ email: 'Email is required' });
      return;
    }
    setResetErrors({});
    setResetStep(2);
  };

  const submitForgotPasswordStep2 = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!resetNickname.trim()) tempErrors.nickname = 'Nickname is required';
    if (!resetNewPassword.trim()) tempErrors.newPassword = 'New password is required';
    if (Object.keys(tempErrors).length > 0) {
      setResetErrors(tempErrors);
      return;
    }

    try {
      const { resetPasswordWithSecurityQuestion } = await import('../services/api');
      const res = await resetPasswordWithSecurityQuestion(resetEmail, resetNickname, resetNewPassword);
      alert(res.message);
      setResetStep(0);
      setResetNickname('');
      setResetNewPassword('');
    } catch (err) {
      setResetErrors({ global: err.message });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone and will delete all your diagnostic records.")) {
      try {
        const { deleteAccount } = await import('../services/api');
        await deleteAccount();
        alert("Your account has been deleted.");
        if (onLogout) onLogout();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="glass-panel" id="login" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
      
      {user ? (
        isEditing ? (
          /* Edit Profile Details Form */
          <form onSubmit={handleSaveEdit} className="fade-in" style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '2px', textAlign: 'center' }}>Edit Profile</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '8px' }}>
              Modify your registered account information below.
            </p>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
              <div className="input-icon-wrapper" style={{ borderColor: editErrors.name ? 'var(--accent-danger)' : '' }}>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => {
                    setEditData({ ...editData, name: e.target.value });
                    if (editErrors.name) setEditErrors({ ...editErrors, name: '' });
                  }}
                  placeholder="Enter full name"
                  className="form-input"
                  style={{ color: 'black', fontWeight: 'bold' }}
                />
                <User size={13} />
              </div>
              {editErrors.name && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{editErrors.name}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Age</label>
                <div className="input-icon-wrapper" style={{ borderColor: editErrors.age ? 'var(--accent-danger)' : '' }}>
                  <input
                    type="text"
                    value={editData.age}
                    onChange={(e) => {
                      setEditData({ ...editData, age: e.target.value });
                      if (editErrors.age) setEditErrors({ ...editErrors, age: '' });
                    }}
                    placeholder="32"
                    maxLength="3"
                    className="form-input"
                    style={{ color: 'black', fontWeight: 'bold' }}
                  />
                  <Calendar size={13} />
                </div>
                {editErrors.age && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{editErrors.age}</span>}
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Mobile Number</label>
                <div className="input-icon-wrapper" style={{ borderColor: editErrors.mobile ? 'var(--accent-danger)' : '' }}>
                  <input
                    type="text"
                    value={editData.mobile}
                    onChange={(e) => {
                      setEditData({ ...editData, mobile: e.target.value });
                      if (editErrors.mobile) setEditErrors({ ...editErrors, mobile: '' });
                    }}
                    placeholder="9876543210"
                    maxLength="15"
                    className="form-input"
                    style={{ color: 'black', fontWeight: 'bold' }}
                  />
                  <Phone size={13} />
                </div>
                {editErrors.mobile && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{editErrors.mobile}</span>}
              </div>
            </div>

            {/* Optional Change Password Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>New Password</label>
                <div className="input-icon-wrapper" style={{ borderColor: editErrors.password ? 'var(--accent-danger)' : '' }}>
                  <input
                    type="password"
                    value={editData.password}
                    onChange={(e) => {
                      setEditData({ ...editData, password: e.target.value });
                      if (editErrors.password) setEditErrors({ ...editErrors, password: '' });
                    }}
                    placeholder="Leave blank to keep same"
                    className="form-input"
                    style={{ color: 'black', fontWeight: 'bold' }}
                  />
                  <Lock size={13} />
                </div>
                {editErrors.password && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{editErrors.password}</span>}
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Confirm New Password</label>
                <div className="input-icon-wrapper" style={{ borderColor: editErrors.confirmPassword ? 'var(--accent-danger)' : '' }}>
                  <input
                    type="password"
                    value={editData.confirmPassword}
                    onChange={(e) => {
                      setEditData({ ...editData, confirmPassword: e.target.value });
                      if (editErrors.confirmPassword) setEditErrors({ ...editErrors, confirmPassword: '' });
                    }}
                    placeholder="Leave blank to keep same"
                    className="form-input"
                    style={{ color: 'black', fontWeight: 'bold' }}
                  />
                  <Lock size={13} />
                </div>
                {editErrors.confirmPassword && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{editErrors.confirmPassword}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <Check size={13} />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          /* Logged In Dashboard View */
          <div className="user-dashboard fade-in" style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="dashboard-avatar" style={{ margin: '0 auto', width: '56px', height: '56px', fontSize: '1.25rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>Welcome back, {user.name}</h3>
              <span className={roleMode === 'technician' ? 'text-teal' : 'text-cyan'} style={{ fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} />
                {user.role}
              </span>
            </div>

            <div className="user-badge-grid" style={{ width: '100%', marginTop: '6px', gap: '8px' }}>
              <div className="user-badge-item" style={{ padding: '8px' }}>
                <div className="label" style={{ fontSize: '0.65rem' }}>Registered Age</div>
                <div className="value" style={{ fontSize: '0.85rem' }}>{user.age} Years</div>
              </div>
              <div className="user-badge-item" style={{ padding: '8px' }}>
                <div className="label" style={{ fontSize: '0.65rem' }}>Mobile Number</div>
                <div className="value" style={{ fontSize: '0.85rem' }}>{user.mobile || '+91 98765 43210'}</div>
              </div>
              <div className="user-badge-item" style={{ padding: '8px' }}>
                <div className="label" style={{ fontSize: '0.65rem' }}>Secure Link</div>
                <div className="value" style={{ fontSize: '0.85rem' }}>{roleMode === 'technician' ? 'TLS 1.3 Audit' : '256-Bit SSL'}</div>
              </div>
              <div className="user-badge-item" style={{ padding: '8px' }}>
                <div className="label" style={{ fontSize: '0.65rem' }}>
                  {roleMode === 'technician' ? 'License Key' : 'Patient ID'}
                </div>
                <div className="value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {roleMode === 'technician' ? user.licenseKey : (user.patientId || user.licenseKey)}
                  {roleMode !== 'technician' && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(user.patientId || user.licenseKey)}
                      title="Copy Patient ID"
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-teal)', cursor: 'pointer', padding: 0, display: 'inline-flex' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="tech-info-card" style={{ background: '#ffffff', borderColor: 'var(--border-color)', marginTop: '6px', textAlign: 'left', padding: '10px 12px' }}>
              <div className="tech-info-icon" style={{ background: 'rgba(20, 104, 117, 0.05)', borderColor: 'rgba(20, 104, 117, 0.1)', color: 'var(--accent-teal)', width: '28px', height: '28px' }}>
                <Database size={12} />
              </div>
              <div className="tech-info-content">
                {roleMode === 'technician' ? (
                  <>
                    <h4 className="text-teal" style={{ fontSize: '0.8rem' }}>Session Auditing</h4>
                    <p style={{ fontSize: '0.72rem' }}>Diagnostics caching and transmission hashes signed with active key node.</p>
                  </>
                ) : (
                  <>
                    <h4 className="text-teal" style={{ fontSize: '0.8rem' }}>Data Privacy Active</h4>
                    <p style={{ fontSize: '0.72rem' }}>All medical files and profiles are encrypted locally to preserve user privacy.</p>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons Row */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-secondary" 
                style={{ 
                  flex: 1,
                  justifyContent: 'center', 
                  padding: '10px', 
                  fontSize: '0.82rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: 'var(--accent-teal)', 
                  borderColor: 'var(--border-color)', 
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-teal)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <Edit size={13} />
                Edit Profile
              </button>

              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="btn-secondary" 
                  style={{ 
                    flex: 1,
                    justifyContent: 'center', 
                    padding: '10px', 
                    fontSize: '0.82rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    color: 'var(--accent-danger)', 
                    borderColor: 'rgba(244, 63, 94, 0.2)', 
                    background: 'rgba(244, 63, 94, 0.02)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.02)'}
                >
                  <LogOut size={13} fill="none" />
                  Sign Out
                </button>
              )}
            </div>

            {/* Delete Account Row */}
            <div style={{ marginTop: '8px' }}>
              <button 
                onClick={handleDeleteAccount}
                className="btn-secondary" 
                style={{ 
                  width: '100%',
                  justifyContent: 'center', 
                  padding: '10px', 
                  fontSize: '0.82rem', 
                  color: 'white', 
                  background: 'var(--accent-danger)',
                  borderColor: 'var(--accent-danger)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e11d48'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-danger)'}
              >
                Delete Account
              </button>
            </div>
          </div>
        )
      ) : (
        /* Login Form View */
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          
          <div>
            {/* Header Group */}
            <div className="login-header-group" style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '2px' }}>
                {formMode === 'signin' 
                  ? (roleMode === 'technician' ? 'Terminal Sign In' : 'Patient Sign In')
                  : (roleMode === 'technician' ? 'Operator Registration' : 'Patient Registration')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {formMode === 'signin'
                  ? (roleMode === 'technician' ? 'Authenticate secure operator credentials.' : 'Sign in to access your health automation tools.')
                  : (roleMode === 'technician' ? 'Create a secure diagnostic operator account.' : 'Register a new account to unlock AI screening.')}
              </p>
            </div>

            {/* Mode Switcher Toggle (Pill Selector Style) */}
            <div className="login-mode-toggle-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div className="pill-switcher-container">
                <button 
                  type="button" 
                  className={`pill-switcher-button ${formMode === 'signin' ? 'active' : ''}`}
                  onClick={() => {
                    setFormMode('signin');
                    setErrors({});
                  }}
                  style={{ width: '90px' }}
                >
                  Sign In
                </button>
                <button 
                  type="button" 
                  className={`pill-switcher-button ${formMode === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    setFormMode('register');
                    setErrors({});
                  }}
                  style={{ width: '90px' }}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {formMode === 'register' ? (
                /* Register Fields (3 rows grid) */
                <>
                  {/* Row 1: Name and Age */}
                  <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>
                        {roleMode === 'technician' ? 'Technician Name' : 'Full Name'}
                      </label>
                      <div className="input-icon-wrapper">
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange}
                          className="form-input" 
                          placeholder={roleMode === 'technician' ? 'Jane Smith' : 'John Doe'}
                          style={{ borderColor: errors.name ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                        />
                        <User size={13} />
                      </div>
                      {errors.name && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.name}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Age</label>
                      <div className="input-icon-wrapper">
                        <input 
                          type="text" 
                          name="age" 
                          value={formData.age} 
                          onChange={handleChange}
                          className="form-input" 
                          placeholder="32"
                          maxLength="3"
                          style={{ borderColor: errors.age ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                        />
                        <Calendar size={13} />
                      </div>
                      {errors.age && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.age}</span>}
                    </div>
                  </div>

                  {/* Row 2: Email and Mobile Number */}
                  <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Email ID</label>
                      <div className="input-icon-wrapper">
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange}
                          className="form-input" 
                          placeholder={roleMode === 'technician' ? 'operator@akshar.ai' : 'patient@akshar.ai'}
                          style={{ borderColor: errors.email ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                        />
                        <Mail size={13} />
                      </div>
                      {errors.email && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.email}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Mobile Number</label>
                      <div className="input-icon-wrapper">
                        <input 
                          type="tel" 
                          name="mobile" 
                          value={formData.mobile} 
                          onChange={handleChange}
                          className="form-input" 
                          placeholder="9876543210"
                          maxLength="15"
                          style={{ borderColor: errors.mobile ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                        />
                        <Phone size={13} />
                      </div>
                      {errors.mobile && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.mobile}</span>}
                    </div>
                  </div>

                  {/* Row 3: Nickname for Recovery */}
                  <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Nickname (For Password Recovery)</label>
                    <div className="input-icon-wrapper">
                      <input 
                        type="text" 
                        name="nickname" 
                        value={formData.nickname} 
                        onChange={handleChange}
                        className="form-input" 
                        placeholder="What is your nick name?"
                        style={{ borderColor: errors.nickname ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                      />
                      <User size={13} />
                    </div>
                    {errors.nickname && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.nickname}</span>}
                  </div>

                  {/* Row 4: Set Password and Confirm Password */}
                  <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Set Password</label>
                      <div className="input-icon-wrapper">
                        <input 
                          type="password" 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange}
                          className="form-input" 
                          placeholder="••••••••"
                          style={{ borderColor: errors.password ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                        />
                        <Lock size={13} />
                      </div>
                      {errors.password && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.password}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Confirm Password</label>
                      <div className="input-icon-wrapper">
                        <input 
                          type="password" 
                          name="confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleChange}
                          className="form-input" 
                          placeholder="••••••••"
                          style={{ borderColor: errors.confirmPassword ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                        />
                        <Lock size={13} />
                      </div>
                      {errors.confirmPassword && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.confirmPassword}</span>}
                    </div>
                  </div>
                </>
              ) : resetStep > 0 ? (
                /* Password Recovery Flow */
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Password Recovery</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {resetStep === 1 ? "Enter your email to begin." : "Answer your security question."}
                    </p>
                  </div>

                  {resetStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Email ID</label>
                        <div className="input-icon-wrapper">
                          <input 
                            type="email" 
                            value={resetEmail} 
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="form-input" 
                            placeholder="your@email.com"
                            style={{ borderColor: resetErrors.email ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                          />
                          <Mail size={13} />
                        </div>
                        {resetErrors.email && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{resetErrors.email}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button type="button" onClick={() => setResetStep(0)} className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}>Cancel</button>
                        <button type="button" onClick={submitForgotPasswordStep1} className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}>Next</button>
                      </div>
                    </div>
                  )}

                  {resetStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Security Question: What is your nick name?</label>
                        <div className="input-icon-wrapper">
                          <input 
                            type="text" 
                            value={resetNickname} 
                            onChange={(e) => setResetNickname(e.target.value)}
                            className="form-input" 
                            placeholder="Your nickname"
                            style={{ borderColor: resetErrors.nickname ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                          />
                          <User size={13} />
                        </div>
                        {resetErrors.nickname && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{resetErrors.nickname}</span>}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>New Password</label>
                        <div className="input-icon-wrapper">
                          <input 
                            type="password" 
                            value={resetNewPassword} 
                            onChange={(e) => setResetNewPassword(e.target.value)}
                            className="form-input" 
                            placeholder="••••••••"
                            style={{ borderColor: resetErrors.newPassword ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                          />
                          <Lock size={13} />
                        </div>
                        {resetErrors.newPassword && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{resetErrors.newPassword}</span>}
                      </div>
                      
                      {resetErrors.global && <div style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', textAlign: 'center', marginTop: '4px' }}>{resetErrors.global}</div>}

                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button type="button" onClick={() => setResetStep(1)} className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}>Back</button>
                        <button type="button" onClick={submitForgotPasswordStep2} className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}>Reset Password</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Sign In Fields (1 row grid) */
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Email ID</label>
                    <div className="input-icon-wrapper">
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="form-input" 
                        placeholder={roleMode === 'technician' ? 'operator@akshar.ai' : 'patient@akshar.ai'}
                        style={{ borderColor: errors.email ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                      />
                      <Mail size={13} />
                    </div>
                    {errors.email && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.email}</span>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Password</label>
                      <span 
                        onClick={handleForgotPassword}
                        style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', cursor: 'pointer' }}
                      >
                        Forgot password?
                      </span>
                    </div>
                    <div className="input-icon-wrapper">
                      <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        className="form-input" 
                        placeholder="••••••••"
                        style={{ borderColor: errors.password ? 'var(--accent-danger)' : '', color: 'black', fontWeight: 'bold' }}
                      />
                      <Lock size={13} />
                    </div>
                    {errors.password && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.password}</span>}
                  </div>
                </div>
              )}

              {/* Action Submit Button */}
              {resetStep === 0 && (
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '10px', fontSize: '0.82rem' }}>
                  <Key size={13} />
                  {formMode === 'signin' 
                    ? (roleMode === 'technician' ? 'Authenticate Terminal' : 'Sign In to Portal')
                    : (roleMode === 'technician' ? 'Register Operator Account' : 'Register & Sign In')}
                </button>
              )}
            </form>

            {/* Inline Link Toggle Helper */}
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <span 
                onClick={() => {
                  setFormMode(formMode === 'signin' ? 'register' : 'signin');
                  setErrors({});
                }} 
                style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
              >
                {formMode === 'signin' ? "Don't have an account? Register here" : "Already have an account? Sign In"}
              </span>
            </div>
          </div>

          {/* Footnote Compliance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '8px' }}>
            <ShieldCheck size={12} className="text-teal" />
            <span>
              {roleMode === 'technician' 
                ? 'Authorized Access Only • TLS 1.3 encryption enabled' 
                : 'Secure Patient Connection • Encrypted Storage'}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
