const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_super_secret_jwt_key_2024";

// ── Middleware ────────────────────────────────────────────────
// Enable CORS for localhost (dev) and Vercel frontend (prod)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://logintestt.vercel.app/login" // ← replace with your Vercel URL
  ],
  credentials: true
}));

app.use(express.json());

// ── In-memory user store (single valid user) ──────────────────
const VALID_USER = {
  username: "admin",
  password: "admin",
  role: "Administrator",
  fullName: "Admin User",
  email: "admin@company.com",
  lastLogin: null,
};

// ── POST /login ───────────────────────────────────────────────
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  if (username.trim() !== VALID_USER.username || password !== VALID_USER.password) {
    return res.status(401).json({ success: false, message: "Invalid username or password. Please try again." });
  }

  const token = jwt.sign(
    { username: VALID_USER.username, role: VALID_USER.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  VALID_USER.lastLogin = new Date().toISOString();

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
    user: {
      username: VALID_USER.username,
      fullName: VALID_USER.fullName,
      email: VALID_USER.email,
      role: VALID_USER.role,
      lastLogin: VALID_USER.lastLogin,
    },
  });
});

// ── GET /verify ──────────────────────────────────────────────
app.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
});

// ── GET /health ──────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});