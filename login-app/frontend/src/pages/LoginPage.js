import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

// ── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

// ── Login Page ────────────────────────────────────────────────────────────────
const LoginPage = () => {
  const navigate       = useNavigate();
  const { login, user } = useAuth();

  const [username,    setUsername]    = useState(() => localStorage.getItem("rememberedUser") || "");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [rememberMe,  setRememberMe]  = useState(() => !!localStorage.getItem("rememberedUser"));
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success,     setSuccess]     = useState(false);

  const usernameRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => { if (user) navigate("/welcome", { replace: true }); }, [user, navigate]);

  // Auto-focus
  useEffect(() => { usernameRef.current?.focus(); }, []);

  const validate = () => {
    const errs = {};
    if (!username.trim()) errs.username = "Username is required";
    if (!password)        errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);

    try {
      const data = await loginUser(username.trim(), password);
      if (data.success) {
        if (rememberMe) localStorage.setItem("rememberedUser", username.trim());
        else            localStorage.removeItem("rememberedUser");
        login(data.user, data.token);
        setSuccess(true);
        setTimeout(() => navigate("/welcome"), 600);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Connection error. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Ambient background */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.grid} />

      <div style={styles.wrapper}>
        {/* Left panel */}
        <div style={styles.leftPanel}>
          <div style={styles.brand}>
            <div style={styles.logoMark}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="#4f8ef7" strokeWidth="2"/>
                <polygon points="16,8 24,13 24,19 16,24 8,19 8,13" fill="rgba(79,142,247,0.2)" stroke="#4f8ef7" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="3" fill="#4f8ef7"/>
              </svg>
            </div>
            <span style={styles.brandName}>NEXUS</span>
          </div>

          <div style={styles.heroText}>
            <h1 style={styles.heroH1}>Secure<br/>Access<br/>Portal</h1>
            <p style={styles.heroSub}>
              Enterprise-grade authentication for modern teams. Sign in to continue to your dashboard.
            </p>
          </div>

          <div style={styles.stats}>
            {[["99.9%", "Uptime SLA"], ["256-bit", "Encryption"], ["SOC 2", "Certified"]].map(([val, label]) => (
              <div key={label} style={styles.statItem}>
                <span style={styles.statVal}>{val}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel – Login card */}
        <div style={styles.rightPanel}>
          <div style={{ ...styles.card, ...(success ? styles.cardSuccess : {}) }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Welcome back</h2>
              <p style={styles.cardSub}>Sign in to your account</p>
            </div>

            {/* Error banner */}
            {error && (
              <div style={styles.errorBanner}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={styles.form}>
              {/* Username */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Username</label>
                <div style={{...styles.inputWrap, ...(fieldErrors.username ? styles.inputWrapError : {})}}>
                  <span style={styles.inputIcon}><UserIcon /></span>
                  <input
                    ref={usernameRef}
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setFieldErrors(p => ({...p, username: ""})); setError(""); }}
                    placeholder="Enter your username"
                    style={styles.input}
                    autoComplete="username"
                    disabled={loading || success}
                  />
                </div>
                {fieldErrors.username && <span style={styles.fieldError}>{fieldErrors.username}</span>}
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <div style={{...styles.inputWrap, ...(fieldErrors.password ? styles.inputWrapError : {})}}>
                  <span style={styles.inputIcon}><LockIcon /></span>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({...p, password: ""})); setError(""); }}
                    placeholder="Enter your password"
                    style={{...styles.input, paddingRight: "3rem"}}
                    autoComplete="current-password"
                    disabled={loading || success}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} style={styles.eyeBtn} tabIndex={-1}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                {fieldErrors.password && <span style={styles.fieldError}>{fieldErrors.password}</span>}
              </div>

              {/* Remember me */}
              <div style={styles.rememberRow}>
                <label style={styles.checkLabel}>
                  <div
                    style={{...styles.checkbox, ...(rememberMe ? styles.checkboxChecked : {})}}
                    onClick={() => setRememberMe(p => !p)}
                    role="checkbox"
                    aria-checked={rememberMe}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === " " && setRememberMe(p => !p)}
                  >
                    {rememberMe && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    )}
                  </div>
                  <span style={styles.checkText}>Remember username</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{...styles.submitBtn, ...(loading || success ? styles.submitBtnDisabled : {})}}
                disabled={loading || success}
              >
                {loading ? (
                  <span style={styles.btnInner}>
                    <span style={styles.spinner} />
                    Authenticating…
                  </span>
                ) : success ? (
                  <span style={styles.btnInner}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10d98a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Access Granted
                  </span>
                ) : (
                  <span style={styles.btnInner}>
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <p style={styles.hint}>
              Use <code style={styles.code}>admin</code> / <code style={styles.code}>admin</code> to sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "var(--bg-dark)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "1.5rem",
  },
  orb1: {
    position: "absolute", top: "-10%", left: "-5%",
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute", bottom: "-15%", right: "-5%",
    width: 700, height: 700, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(79,142,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    pointerEvents: "none",
  },
  wrapper: {
    position: "relative", zIndex: 1,
    display: "flex", gap: "4rem",
    alignItems: "center", maxWidth: 960,
    width: "100%", animation: "fadeIn 0.7s ease both",
  },
  leftPanel: {
    flex: 1, display: "flex", flexDirection: "column", gap: "2.5rem",
    animation: "slideInLeft 0.6s ease both",
  },
  brand: {
    display: "flex", alignItems: "center", gap: "0.75rem",
  },
  logoMark: {
    width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(79,142,247,0.1)", border: "1px solid var(--border)",
    borderRadius: 10,
  },
  brandName: {
    fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800,
    letterSpacing: "0.2em", color: "var(--text-primary)",
  },
  heroText: { display: "flex", flexDirection: "column", gap: "1rem" },
  heroH1: {
    fontFamily: "var(--font-display)", fontSize: "3.4rem", fontWeight: 800,
    lineHeight: 1.05, color: "var(--text-primary)",
    background: "linear-gradient(135deg, #f0f4ff 0%, #8899b4 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7,
    maxWidth: 320,
  },
  stats: {
    display: "flex", gap: "1.5rem",
  },
  statItem: {
    display: "flex", flexDirection: "column", gap: "0.2rem",
    padding: "0.75rem 1rem",
    background: "rgba(79,142,247,0.06)",
    border: "1px solid var(--border)", borderRadius: 10,
  },
  statVal: {
    fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700,
    color: "var(--accent)",
  },
  statLabel: { fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" },

  rightPanel: { width: 400, flexShrink: 0 },
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "2.5rem",
    display: "flex", flexDirection: "column", gap: "1.75rem",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
    transition: "border-color 0.3s",
  },
  cardSuccess: { borderColor: "rgba(16,217,138,0.3)" },
  cardHeader: { display: "flex", flexDirection: "column", gap: "0.35rem" },
  cardTitle: { fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" },
  cardSub: { fontSize: "0.88rem", color: "var(--text-secondary)" },

  errorBanner: {
    display: "flex", alignItems: "center", gap: "0.6rem",
    padding: "0.75rem 1rem",
    background: "rgba(255,77,106,0.08)",
    border: "1px solid rgba(255,77,106,0.25)",
    borderRadius: 10,
    fontSize: "0.85rem", color: "var(--error)",
    animation: "fadeIn 0.3s ease",
  },
  form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  label: { fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.04em", textTransform: "uppercase" },
  inputWrap: {
    position: "relative", display: "flex", alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border)", borderRadius: 10,
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputWrapError: { borderColor: "rgba(255,77,106,0.5)" },
  inputIcon: {
    position: "absolute", left: "1rem", color: "var(--text-muted)",
    display: "flex", alignItems: "center", pointerEvents: "none",
  },
  input: {
    width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem",
    background: "transparent", border: "none", outline: "none",
    color: "var(--text-primary)", fontSize: "0.95rem",
    fontFamily: "var(--font-body)",
  },
  eyeBtn: {
    position: "absolute", right: "1rem",
    background: "none", border: "none", cursor: "pointer",
    color: "var(--text-muted)", display: "flex", alignItems: "center",
    padding: "0.25rem", borderRadius: 4,
    transition: "color 0.2s",
  },
  fieldError: { fontSize: "0.78rem", color: "var(--error)", paddingLeft: "0.25rem" },

  rememberRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  checkLabel: { display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    border: "1.5px solid var(--text-muted)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s", cursor: "pointer",
  },
  checkboxChecked: { background: "var(--accent)", borderColor: "var(--accent)" },
  checkText: { fontSize: "0.85rem", color: "var(--text-secondary)" },

  submitBtn: {
    padding: "0.9rem",
    background: "linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)",
    border: "none", borderRadius: 10, cursor: "pointer",
    color: "#fff", fontSize: "0.95rem", fontWeight: 600,
    fontFamily: "var(--font-display)", letterSpacing: "0.03em",
    transition: "opacity 0.2s, transform 0.15s",
    boxShadow: "0 6px 24px rgba(79,142,247,0.35)",
  },
  submitBtnDisabled: { opacity: 0.7, cursor: "not-allowed" },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" },
  spinner: {
    width: 16, height: 16, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  hint: { textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)" },
  code: {
    background: "rgba(79,142,247,0.12)", border: "1px solid var(--border)",
    borderRadius: 4, padding: "0.1em 0.4em",
    color: "var(--accent)", fontFamily: "monospace", fontSize: "0.85em",
  },
};

export default LoginPage;
