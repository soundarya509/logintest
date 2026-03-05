import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Small helpers ─────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "First time login";
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <span style={styles.clock}>
      {pad(time.getHours())}
      <span style={{ animation: "blink 1s step-start infinite", opacity: 1 }}>:</span>
      {pad(time.getMinutes())}
      <span style={{ animation: "blink 1s step-start infinite", opacity: 1 }}>:</span>
      {pad(time.getSeconds())}
    </span>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent, delay }) => (
  <div style={{ ...styles.statCard, animationDelay: delay }}>
    <div style={{ ...styles.statIcon, background: accent + "18", color: accent }}>{icon}</div>
    <div style={styles.statInfo}>
      <span style={styles.statLabel}>{label}</span>
      <span style={{ ...styles.statValue, color: accent }}>{value}</span>
    </div>
  </div>
);

// ── Activity row ──────────────────────────────────────────────────────────────
const ActivityRow = ({ label, time, status, delay }) => (
  <div style={{ ...styles.actRow, animationDelay: delay }}>
    <div style={styles.actDot} />
    <div style={styles.actInfo}>
      <span style={styles.actLabel}>{label}</span>
      <span style={styles.actTime}>{time}</span>
    </div>
    <span style={{ ...styles.actBadge, background: status === "Success" ? "rgba(16,217,138,0.12)" : "rgba(79,142,247,0.12)", color: status === "Success" ? "#10d98a" : "#4f8ef7" }}>
      {status}
    </span>
  </div>
);

// ── Welcome Page ──────────────────────────────────────────────────────────────
const WelcomePage = () => {
  const navigate    = useNavigate();
  const { user, logout } = useAuth();
  const [greeting,  setGreeting]  = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12)      setGreeting("Good morning");
    else if (h < 18) setGreeting("Good afternoon");
    else             setGreeting("Good evening");
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  if (!user) return null;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div style={styles.root}>
      {/* Ambient */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.grid} />

      {/* ── Top Nav ── */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.logoMark}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="#4f8ef7" strokeWidth="2"/>
              <polygon points="16,8 24,13 24,19 16,24 8,19 8,13" fill="rgba(79,142,247,0.2)" stroke="#4f8ef7" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="3" fill="#4f8ef7"/>
            </svg>
          </div>
          <span style={styles.brandName}>NEXUS</span>
        </div>

        <div style={styles.navCenter}>
          {["Dashboard", "Analytics", "Reports", "Settings"].map((item, i) => (
            <button key={item} style={{ ...styles.navItem, ...(i === 0 ? styles.navItemActive : {}) }}>
              {item}
            </button>
          ))}
        </div>

        <div style={styles.navRight}>
          <Clock />
          <div style={styles.avatarWrap}>
            <div style={styles.avatar}>{user.username[0].toUpperCase()}</div>
            <div style={styles.avatarInfo}>
              <span style={styles.avatarName}>{user.fullName || user.username}</span>
              <span style={styles.avatarRole}>{user.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={styles.main}>

        {/* Hero row */}
        <div style={styles.heroRow}>
          <div style={styles.heroLeft}>
            <div style={styles.dateBadge}>
              <div style={styles.dateDot} />
              {today}
            </div>
            <h1 style={styles.heroH1}>
              {greeting},<br />
              <span style={styles.heroName}>{user.fullName || user.username}</span>
            </h1>
            <p style={styles.heroSub}>Your dashboard is ready. Here's an overview of your account and activity.</p>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.sessionCard}>
              <div style={styles.sessionHeader}>
                <div style={styles.sessionDot} />
                <span style={styles.sessionTitle}>Active Session</span>
              </div>
              <div style={styles.sessionRows}>
                {[
                  ["User",        user.username],
                  ["Email",       user.email || "admin@company.com"],
                  ["Role",        user.role],
                  ["Last Login",  formatDate(user.lastLogin)],
                ].map(([k, v]) => (
                  <div key={k} style={styles.sessionRow}>
                    <span style={styles.sessionKey}>{k}</span>
                    <span style={styles.sessionVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={styles.statsGrid}>
          <StatCard delay="0.1s" icon={<span>📊</span>} label="Total Sessions" value="1,284" accent="#4f8ef7" />
          <StatCard delay="0.15s" icon={<span>✅</span>} label="Tasks Complete" value="94%" accent="#10d98a" />
          <StatCard delay="0.2s" icon={<span>🔐</span>} label="Security Score" value="A+" accent="#7c3aed" />
          <StatCard delay="0.25s" icon={<span>⚡</span>} label="System Status" value="Online" accent="#f59e0b" />
        </div>

        {/* Lower grid */}
        <div style={styles.lowerGrid}>
          {/* Activity */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Recent Activity</h3>
              <span style={styles.panelBadge}>Live</span>
            </div>
            <div style={styles.actList}>
              <ActivityRow delay="0.1s" label="Login successful"            time="Just now"     status="Success" />
              <ActivityRow delay="0.15s" label="Session token issued"       time="Just now"     status="Success" />
              <ActivityRow delay="0.2s"  label="Dashboard loaded"           time="Just now"     status="Success" />
              <ActivityRow delay="0.25s" label="Profile data fetched"       time="1 min ago"    status="Success" />
              <ActivityRow delay="0.3s"  label="Security check passed"      time="1 min ago"    status="Active"  />
            </div>
          </div>

          {/* Quick actions */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Quick Actions</h3>
            </div>
            <div style={styles.actionGrid}>
              {[
                { icon: "👤", label: "Edit Profile",      color: "#4f8ef7" },
                { icon: "🔒", label: "Change Password",   color: "#7c3aed" },
                { icon: "📁", label: "My Documents",      color: "#10d98a" },
                { icon: "🔔", label: "Notifications",     color: "#f59e0b" },
                { icon: "📈", label: "View Reports",      color: "#ec4899" },
                { icon: "⚙️", label: "Settings",          color: "#64748b" },
              ].map(({ icon, label, color }) => (
                <button key={label} style={styles.actionBtn}>
                  <span style={{ ...styles.actionIcon, background: color + "18", color }}>{icon}</span>
                  <span style={styles.actionLabel}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System info */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>System Health</h3>
            </div>
            <div style={styles.healthList}>
              {[
                ["API Server",       99, "#10d98a"],
                ["Auth Service",     100, "#10d98a"],
                ["Database",         87, "#f59e0b"],
                ["CDN",              95, "#4f8ef7"],
              ].map(([name, pct, color]) => (
                <div key={name} style={styles.healthRow}>
                  <div style={styles.healthMeta}>
                    <span style={styles.healthName}>{name}</span>
                    <span style={{ ...styles.healthPct, color }}>{pct}%</span>
                  </div>
                  <div style={styles.healthBar}>
                    <div style={{ ...styles.healthFill, width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh", background: "var(--bg-dark)",
    display: "flex", flexDirection: "column",
    position: "relative", overflow: "hidden",
  },
  orb1: {
    position: "fixed", top: "-20%", right: "-10%",
    width: 700, height: 700, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed", bottom: "-20%", left: "-10%",
    width: 700, height: 700, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage: "linear-gradient(rgba(79,142,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.03) 1px, transparent 1px)",
    backgroundSize: "60px 60px", pointerEvents: "none",
  },

  // Nav
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 2.5rem", height: 64,
    background: "rgba(8,12,20,0.85)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
  },
  navBrand: { display: "flex", alignItems: "center", gap: "0.7rem" },
  logoMark: {
    width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(79,142,247,0.1)", border: "1px solid var(--border)", borderRadius: 8,
  },
  brandName: { fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.2em", color: "var(--text-primary)" },
  navCenter: { display: "flex", gap: "0.25rem" },
  navItem: {
    background: "none", border: "none", cursor: "pointer",
    padding: "0.4rem 0.9rem", borderRadius: 8,
    fontSize: "0.85rem", fontFamily: "var(--font-body)", fontWeight: 500,
    color: "var(--text-secondary)", transition: "all 0.2s",
  },
  navItemActive: { background: "rgba(79,142,247,0.12)", color: "var(--accent)" },
  navRight: { display: "flex", alignItems: "center", gap: "1.25rem" },
  clock: { fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em" },
  avatarWrap: { display: "flex", alignItems: "center", gap: "0.65rem" },
  avatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg, #4f8ef7, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "#fff",
  },
  avatarInfo: { display: "flex", flexDirection: "column" },
  avatarName: { fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" },
  avatarRole: { fontSize: "0.7rem", color: "var(--text-muted)" },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: "0.4rem",
    background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.2)",
    borderRadius: 8, padding: "0.4rem 0.85rem", cursor: "pointer",
    color: "var(--error)", fontSize: "0.82rem", fontFamily: "var(--font-body)", fontWeight: 500,
    transition: "all 0.2s",
  },

  // Main
  main: {
    position: "relative", zIndex: 1,
    padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem",
    maxWidth: 1280, margin: "0 auto", width: "100%",
  },

  // Hero row
  heroRow: {
    display: "flex", gap: "2rem", alignItems: "flex-start",
    animation: "fadeIn 0.6s ease both",
  },
  heroLeft: { flex: 1, display: "flex", flexDirection: "column", gap: "1rem" },
  dateBadge: {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    background: "rgba(79,142,247,0.08)", border: "1px solid var(--border)",
    borderRadius: 20, padding: "0.3rem 0.9rem",
    fontSize: "0.78rem", color: "var(--text-secondary)", width: "fit-content",
  },
  dateDot: { width: 6, height: 6, borderRadius: "50%", background: "#10d98a", animation: "pulseGlow 2s ease-in-out infinite" },
  heroH1: {
    fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 800, lineHeight: 1.15,
    color: "var(--text-primary)",
  },
  heroName: {
    background: "linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: { fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 480 },
  heroRight: { width: 340 },
  sessionCard: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "1.5rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  sessionHeader: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" },
  sessionDot: { width: 8, height: 8, borderRadius: "50%", background: "#10d98a", animation: "pulseGlow 2s ease-in-out infinite" },
  sessionTitle: { fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" },
  sessionRows: { display: "flex", flexDirection: "column", gap: "0.6rem" },
  sessionRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sessionKey: { fontSize: "0.8rem", color: "var(--text-muted)" },
  sessionVal: { fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)" },

  // Stats grid
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem",
  },
  statCard: {
    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14,
    padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem",
    animation: "fadeIn 0.5s ease both",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
  },
  statInfo: { display: "flex", flexDirection: "column", gap: "0.2rem" },
  statLabel: { fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" },
  statValue: { fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700 },

  // Lower grid
  lowerGrid: { display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "1.5rem" },
  panel: {
    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16,
    padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.6s ease both",
  },
  panelHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  panelTitle: { fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" },
  panelBadge: {
    background: "rgba(16,217,138,0.12)", color: "#10d98a",
    fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: 20,
    border: "1px solid rgba(16,217,138,0.25)",
  },

  // Activity
  actList: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  actRow: {
    display: "flex", alignItems: "center", gap: "0.75rem",
    padding: "0.65rem 0.85rem",
    background: "rgba(255,255,255,0.02)", borderRadius: 10,
    animation: "fadeIn 0.4s ease both",
  },
  actDot: { width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 },
  actInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "0.1rem" },
  actLabel: { fontSize: "0.83rem", color: "var(--text-primary)", fontWeight: 500 },
  actTime:  { fontSize: "0.72rem", color: "var(--text-muted)" },
  actBadge: { fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: 20, flexShrink: 0 },

  // Actions
  actionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
  actionBtn: {
    display: "flex", alignItems: "center", gap: "0.6rem",
    background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "0.7rem 0.85rem", cursor: "pointer",
    transition: "all 0.2s",
  },
  actionIcon: { width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 },
  actionLabel: { fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500, fontFamily: "var(--font-body)", textAlign: "left" },

  // Health
  healthList: { display: "flex", flexDirection: "column", gap: "1rem" },
  healthRow:  { display: "flex", flexDirection: "column", gap: "0.4rem" },
  healthMeta: { display: "flex", justifyContent: "space-between" },
  healthName: { fontSize: "0.82rem", color: "var(--text-secondary)" },
  healthPct:  { fontSize: "0.82rem", fontWeight: 700 },
  healthBar:  { height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" },
  healthFill: { height: "100%", borderRadius: 10, transition: "width 1s ease" },
};

export default WelcomePage;
