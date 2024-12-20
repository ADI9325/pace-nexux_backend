require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const applicationsRoute = require('./routes/applications');
const path = require('path');

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

// Serve uploaded resumes statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', applicationsRoute);

// Database connection
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
