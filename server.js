const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/scholarships', require('./routes/scholarships'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/admin/scholarships', require('./routes/admin/scholarships'));
app.use('/api/admin/programs', require('./routes/admin/programs'));

// Root route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'College Scholarship & Programs Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      scholarships: '/api/scholarships',
      programs: '/api/programs',
      admin: {
        scholarships: '/api/admin/scholarships',
        programs: '/api/admin/programs'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API documentation available at http://localhost:${PORT}/api`);
});
