const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow requests from Expo app
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - Protect against abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const businessRoutes = require('./routes/business');
const orderRoutes = require('./routes/orders');
const menuRoutes = require('./routes/menu');

// API Routes
app.use('/api/business', businessRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'One Indang Express Backend is running',
    timestamp: new Date().toISOString(),
    database: 'Supabase (PostgreSQL)',
    auth: 'Supabase Auth (handled by frontend)'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'One Indang Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      business: '/api/business',
      orders: '/api/orders',
      menu: '/api/menu'
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 One Indang Backend Server`);
  console.log(`   Running on port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n📦 Available endpoints:`);
  console.log(`   GET  /api/business      - Get all businesses`);
  console.log(`   GET  /api/business/:id  - Get business by ID`);
  console.log(`   POST /api/business      - Create business`);
  console.log(`   PUT  /api/business/:id  - Update business`);
  console.log(`   DELETE /api/business/:id - Delete business`);
  console.log(`   GET  /api/orders        - Get all orders`);
  console.log(`   POST /api/orders        - Create order`);
  console.log(`   GET  /api/menu/:name    - Get menu by restaurant`);
  console.log('\n');
});

module.exports = app;
