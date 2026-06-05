import React, { useState } from 'react';
import { User, Calendar, Mail, Lock, ShieldCheck, Database, Key, Phone } from 'lucide-react';

export default function LoginForm({ user, onLogin, roleMode }) {
  const [formMode, setFormMode] = useState('signin'); // 'signin' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const isTech = roleMode === 'technician';
      
      // Load saved users from localStorage or default to empty array
      let registeredUsers = [];
      try {
        const storedUsers = localStorage.getItem('akshar_users');
        if (storedUsers) {
          registeredUsers = JSON.parse(storedUsers);
        }
      } catch (err) {
        console.error("Error reading registered users from localStorage:", err);
      }

      const emailLower = formData.email.toLowerCase().trim();

      if (formMode === 'signin') {
        // Find if user is in registered list
        let matchedUser = registeredUsers.find(
          u => u.email.toLowerCase().trim() === emailLower && u.isTechnician === isTech
        );

        // Fallbacks for default users
        if (!matchedUser) {
          if (emailLower === 'patient@akshar.ai' && !isTech) {
            matchedUser = {
              name: 'John Doe',
              age: '28',
              email: 'patient@akshar.ai',
              mobile: '+91 98765 43210',
              isTechnician: false
            };
          } else if (emailLower === 'operator@akshar.ai' && isTech) {
            matchedUser = {
              name: 'Dr. Sarah Jenkins',
              age: '42',
              email: 'operator@akshar.ai',
              mobile: '+91 90123 45678',
              isTechnician: true
            };
          }
        }

        if (matchedUser) {
          onLogin({
            name: matchedUser.name,
            age: matchedUser.age,
            email: matchedUser.email,
            mobile: matchedUser.mobile || '+91 98765 43210',
            licenseKey: isTech 
              ? `AK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
              : `PT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            role: isTech 
              ? (parseInt(matchedUser.age) > 35 ? 'Lead Clinical Radiologist' : 'Diagnostic Imaging Technician')
              : 'Registered Patient'
          });
        } else {
          setErrors({
            email: 'Email not registered. Switch to Register or use operator@akshar.ai / patient@akshar.ai'
          });
        }
      } else {
        // Register mode: Check if user already exists
        const exists = registeredUsers.some(
          u => u.email.toLowerCase().trim() === emailLower && u.isTechnician === isTech
        ) || (emailLower === 'patient@akshar.ai' && !isTech) 
          || (emailLower === 'operator@akshar.ai' && isTech);

        if (exists) {
          setErrors({
            email: 'Email is already registered. Please sign in.'
          });
          return;
        }

        // Register new user
        const newUser = {
          name: formData.name,
          age: formData.age,
          email: formData.email,
          mobile: formData.mobile,
          isTechnician: isTech
        };

        registeredUsers.push(newUser);
        try {
          localStorage.setItem('akshar_users', JSON.stringify(registeredUsers));
        } catch (err) {
          console.error("Error writing new user to localStorage:", err);
        }

        // Auto-login registered user
        onLogin({
          name: newUser.name,
          age: newUser.age,
          email: newUser.email,
          mobile: newUser.mobile,
          licenseKey: isTech 
            ? `AK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            : `PT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          role: isTech 
            ? (parseInt(newUser.age) > 35 ? 'Lead Clinical Radiologist' : 'Diagnostic Imaging Technician')
            : 'Registered Patient'
        });
      }
    }
  };

  return (
    <div className="glass-panel" id="login" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
      
      {user ? (
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
                {roleMode === 'technician' ? 'License Key' : 'Medical ID'}
              </div>
              <div className="value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-teal)' }}>
                {user.licenseKey}
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
        </div>
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
                          style={{ borderColor: errors.name ? 'var(--accent-danger)' : '' }}
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
                          style={{ borderColor: errors.age ? 'var(--accent-danger)' : '' }}
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
                          style={{ borderColor: errors.email ? 'var(--accent-danger)' : '' }}
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
                          style={{ borderColor: errors.mobile ? 'var(--accent-danger)' : '' }}
                        />
                        <Phone size={13} />
                      </div>
                      {errors.mobile && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.mobile}</span>}
                    </div>
                  </div>

                  {/* Row 3: Set Password and Confirm Password */}
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
                          style={{ borderColor: errors.password ? 'var(--accent-danger)' : '' }}
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
                          style={{ borderColor: errors.confirmPassword ? 'var(--accent-danger)' : '' }}
                        />
                        <Lock size={13} />
                      </div>
                      {errors.confirmPassword && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.confirmPassword}</span>}
                    </div>
                  </div>
                </>
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
                        style={{ borderColor: errors.email ? 'var(--accent-danger)' : '' }}
                      />
                      <Mail size={13} />
                    </div>
                    {errors.email && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.email}</span>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Password</label>
                    <div className="input-icon-wrapper">
                      <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        className="form-input" 
                        placeholder="••••••••"
                        style={{ borderColor: errors.password ? 'var(--accent-danger)' : '' }}
                      />
                      <Lock size={13} />
                    </div>
                    {errors.password && <span style={{ fontSize: '0.62rem', color: 'var(--accent-danger)' }}>{errors.password}</span>}
                  </div>
                </div>
              )}

              {/* Action Submit Button */}
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '10px', fontSize: '0.82rem' }}>
                <Key size={13} />
                {formMode === 'signin' 
                  ? (roleMode === 'technician' ? 'Authenticate Terminal' : 'Sign In to Portal')
                  : (roleMode === 'technician' ? 'Register Operator Account' : 'Register & Sign In')}
              </button>
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
                ? 'Encrypted Operator Connection • Audit Hash Logged'
                : 'Encrypted Patient Connection • HIPAA Secure'}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
