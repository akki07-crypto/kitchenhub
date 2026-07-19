import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChefHat, ShieldAlert, CheckCircle2, User, Key, Mail, Landmark } from 'lucide-react';

const Auth: React.FC = () => {
  const { login, registerUser, setShowAuthModal } = useApp();
  
  // Tabs: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');

  // Sign Up inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'user' | 'chef'>('user');
  const [chefSpecialty, setChefSpecialty] = useState('');
  const [chefBio, setChefBio] = useState('');
  const [signUpSuccessMsg, setSignUpSuccessMsg] = useState('');
  const [signUpErrorMsg, setSignUpErrorMsg] = useState('');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setSignInError('Please fill in both email and password.');
      return;
    }

    const response = await login(signInEmail, signInPassword);
    if (!response.success) {
      setSignInError(response.error || 'Failed to authenticate.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpSuccessMsg('');
    setSignUpErrorMsg('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setSignUpErrorMsg('All fields are required.');
      return;
    }

    if (signUpRole === 'chef' && (!chefSpecialty.trim() || !chefBio.trim())) {
      setSignUpErrorMsg('Please fill in your specialty and bio.');
      return;
    }

    // Call registration handler
    await registerUser({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      role: signUpRole,
      bio: signUpRole === 'chef' ? `${chefSpecialty} | ${chefBio}` : 'Home Cook',
      avatar: signUpRole === 'chef' 
        ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    });

    if (signUpRole === 'chef') {
      setSignUpSuccessMsg('Chef application submitted! Admin will activate your credentials shortly.');
      // Clear fields
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setChefSpecialty('');
      setChefBio('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#040406',
      zIndex: 99999,
      overflow: 'hidden'
    }}>
      {/* Cinematic Looping Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          opacity: 0.12,
          zIndex: 0
        }}
      >
        <source 
          src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054ba208d130ab15e507b1d644d563a&profile_id=139&oauth2_token_id=57447761" 
          type="video/mp4" 
        />
      </video>

      {/* Luxury gold/dark radial vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(20,15,10,0.3) 0%, rgba(4,4,6,0.98) 100%)',
        zIndex: 1
      }}></div>

      {/* Auth Card with responsive scroll, compact padding & blurred glass */}
      <div 
        className="glass-panel animate-fade-in auth-card-scroll" 
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px 30px',
          borderRadius: '20px',
          background: 'rgba(7, 9, 14, 0.96)',
          border: '1px solid rgba(197, 168, 128, 0.28)',
          boxShadow: '0 0 30px rgba(197, 168, 128, 0.15), var(--shadow-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 2,
          margin: '0 16px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Close Modal Button */}
        <button 
          onClick={() => setShowAuthModal(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 10
          }}
          title="Close Portal"
        >
          ✕
        </button>
        {/* Brand Header */}
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            background: 'var(--primary-gradient)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: '10px'
          }}>
            <ChefHat size={22} color="#07090e" />
          </div>
          <h1 style={{
            fontSize: '1.6rem',
            margin: 0,
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>
            Kitchen Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px', lineHeight: 1.3 }}>
            Where home cooks and professional chefs meet
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '10px',
          padding: '3px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => {
              setAuthMode('signin');
              setSignInError('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '7px',
              border: 'none',
              background: authMode === 'signin' ? 'var(--primary-gradient)' : 'transparent',
              color: authMode === 'signin' ? '#07090e' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Sign In Portal
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setSignUpSuccessMsg('');
              setSignUpErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '7px',
              border: 'none',
              background: authMode === 'signup' ? 'var(--primary-gradient)' : 'transparent',
              color: authMode === 'signup' ? '#07090e' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Create Account
          </button>
        </div>

        {/* SIGN IN VIEW */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            
            {signInError && (
              <div className="tag animate-fade-in" style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)', width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.72rem', justifyContent: 'flex-start' }}>
                <ShieldAlert size={14} color="#ef4444" />
                <span>{signInError}</span>
              </div>
            )}

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="form-input"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '36px', height: '38px', fontSize: '0.82rem', background: 'rgba(7,9,14,0.5)', borderColor: 'rgba(197,168,128,0.2)', color: '#ffffff' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>Account Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                  <Key size={14} />
                </span>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="form-input"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '36px', height: '38px', fontSize: '0.82rem', background: 'rgba(7,9,14,0.5)', borderColor: 'rgba(197,168,128,0.2)', color: '#ffffff' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary animate-hover-lift" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', height: '40px', marginTop: '4px' }}>
              Authorize Credentials
            </button>

            {/* Clickable Demo Credentials */}
            <div style={{
              background: 'rgba(197, 168, 128, 0.02)',
              border: '1px solid rgba(197, 168, 128, 0.12)',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '0.68rem',
              color: 'var(--text-secondary)',
              marginTop: '8px',
              lineHeight: 1.4
            }}>
              <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>🔑 Demo Credentials — click to fill:</strong>
              {[
                { label: '👤 User', email: 'alex@kitchenhub.com', pw: 'password' },
                { label: '👨‍🍳 Chef', email: 'melissa@kitchenhub.com', pw: 'chef123' },
                { label: '🛡️ Admin', email: 'admin@kitchenhub.com', pw: 'admin123' },
              ].map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => { setSignInEmail(demo.email); setSignInPassword(demo.pw); setSignInError(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: signInEmail === demo.email ? 'rgba(197,168,128,0.10)' : 'rgba(255,255,255,0.02)',
                    border: signInEmail === demo.email ? '1px solid rgba(197,168,128,0.35)' : '1px solid transparent',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    color: 'inherit'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--primary)', minWidth: '52px' }}>{demo.label}</span>
                  <span style={{ fontFamily: 'monospace', color: '#fff', fontSize: '0.65rem', flex: 1, marginLeft: '8px' }}>{demo.email}</span>
                  <span style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.65rem', marginLeft: '8px' }}>pw: {demo.pw}</span>
                </button>
              ))}
            </div>
          </form>
        )}

        {/* SIGN UP / REGISTER VIEW */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '11px', textAlign: 'left' }}>
            
            {signUpSuccessMsg && (
              <div className="tag animate-fade-in" style={{ background: 'rgba(74, 222, 128, 0.08)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)', width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.72rem', justifyContent: 'flex-start' }}>
                <CheckCircle2 size={14} color="#4ade80" />
                <span>{signUpSuccessMsg}</span>
              </div>
            )}

            {signUpErrorMsg && (
              <div className="tag animate-fade-in" style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)', width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.72rem', justifyContent: 'flex-start' }}>
                <ShieldAlert size={14} color="#ef4444" />
                <span>{signUpErrorMsg}</span>
              </div>
            )}

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                  <User size={14} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="form-input"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '36px', height: '36px', fontSize: '0.8rem', background: 'rgba(7,9,14,0.5)', borderColor: 'rgba(197,168,128,0.2)', color: '#ffffff' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  placeholder="john@email.com"
                  className="form-input"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '36px', height: '36px', fontSize: '0.8rem', background: 'rgba(7,9,14,0.5)', borderColor: 'rgba(197,168,128,0.2)', color: '#ffffff' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>Choose Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                  <Key size={14} />
                </span>
                <input
                  type="password"
                  placeholder="Create password"
                  className="form-input"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '36px', height: '36px', fontSize: '0.8rem', background: 'rgba(7,9,14,0.5)', borderColor: 'rgba(197,168,128,0.2)', color: '#ffffff' }}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>Register As</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                  <Landmark size={14} />
                </span>
                <select
                  className="form-select"
                  value={signUpRole}
                  onChange={(e: any) => setSignUpRole(e.target.value)}
                  style={{ 
                    width: '100%', 
                    paddingLeft: '36px', 
                    height: '36px', 
                    fontSize: '0.8rem', 
                    background: '#07090e', 
                    color: '#ffffff', 
                    borderColor: 'rgba(197,168,128,0.25)',
                    colorScheme: 'dark'
                  }}
                >
                  <option value="user" style={{ background: '#07090e', color: '#ffffff' }}>Home Cook (Normal User)</option>
                  <option value="chef" style={{ background: '#07090e', color: '#ffffff' }}>Professional Chef (Application)</option>
                </select>
              </div>
            </div>

            {/* Chef Specific Fields */}
            {signUpRole === 'chef' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>Chef Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Classic French Sauces"
                    className="form-input"
                    value={chefSpecialty}
                    onChange={(e) => setChefSpecialty(e.target.value)}
                    required
                    style={{ width: '100%', height: '36px', fontSize: '0.8rem', background: 'rgba(7,9,14,0.5)', borderColor: 'rgba(197,168,128,0.2)', color: '#ffffff' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>Culinary Biography</label>
                  <textarea
                    rows={2}
                    placeholder="Describe your professional kitchen journey..."
                    className="form-textarea"
                    value={chefBio}
                    onChange={(e) => setChefBio(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', background: 'rgba(7,9,14,0.5)', borderColor: 'rgba(197,168,128,0.2)', color: '#ffffff' }}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary animate-hover-lift" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', height: '40px', marginTop: '6px' }}>
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
