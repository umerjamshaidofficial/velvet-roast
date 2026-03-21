const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path'); 
require('dotenv').config();
const db = require('./config/db'); 

// Route Imports
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const giftRoutes = require('./routes/giftRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const ritualRoutes = require('./routes/ritualRoutes');

const app = express();
const port = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
  })
);

// UPDATED: Explicitly allowed PATCH for visibility toggles and added OPTIONS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev')); 
app.use(express.json()); 

// --- STATIC FILES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/profile', profileRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rituals', ritualRoutes);

// --- DATABASE CONNECTION TEST ---
if (db) {
  db.query('SELECT NOW()')
    .then(() => {
      console.log('✅ PostgreSQL Database Connected Successfully!');
    })
    .catch(err => {
      console.error('❌ Database connection error:', err.message);
    });
}

app.get('/', (req, res) => {
  res.send('☕ Velvet Roast API is running...');
});

app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`🚀 Server spinning on http://localhost:${port}`);
});