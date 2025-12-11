require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mailRoutes = require('./src/routes/mailRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// ============== Middleware ==============

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging middleware (optional)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============== Routes ==============

/**
 * Health check endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'IntmavensApi is running',
    timestamp: new Date().toISOString(),
  });
});

/** Mail routes - All endpoints under /api/mail/ */
app.use('/api/mail', mailRoutes);

// ============== Error Handling ==============

/**
 * 404 Not Found handler
 */
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

/**
 * Global error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    ok: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// ============== Server Startup ==============

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                   IntmavensApi Server                      ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on http://localhost:${PORT}

📧 Email Service Configuration:
   ✓ SMTP Host: ${process.env.SMTP_HOST}
   ✓ SMTP Port: ${process.env.SMTP_PORT}
   ✓ Sender Email: ${process.env.SENDER_EMAIL}

🌐 CORS enabled for:
   ✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

📝 Available Endpoints:
   ✓ GET  /health
   ✓ GET  /api/version
   ✓ POST /api/mail/contact  - Contact form submissions
   ✓ POST /api/mail/career   - Career applications
   ✓ POST /api/mail/blog     - Blog comments/inquiries
   ✓ POST /api/mail/send     - Generic email (templateType required)

💡 Documentation: Check README.md for detailed API documentation

═══════════════════════════════════════════════════════════════
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
