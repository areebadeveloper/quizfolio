// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const quizRoutes = require('./routes/quizRoutes');
const quizResultRoutes = require('./routes/quizResultRoutes');
const emailRoutes = require('./routes/email'); // Imported the email route
const newEmailRoutes = require('./routes/newEmail'); // New comprehensive email routes
const multiEmailRoutes = require('./routes/multiEmail'); // Multi-approach email service
const realEmailRoutes = require('./routes/realEmail'); // REAL email service for actual users

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware - Updated CORS for network access
app.use(cors({
    origin: [
        'http://localhost:8100',           // Local development
        'http://192.168.1.101:8100',       // Network access for phone
        'capacitor://localhost',           // Capacitor app
        'ionic://localhost',               // Ionic app
        'http://localhost',                // Any localhost port
        /^http:\/\/192\.168\.1\.\d+/       // Any device on local network
    ],
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Include OPTIONS for preflight
    allowedHeaders: 'Content-Type,Authorization,x-auth-token', // Allow specific headers
    credentials: true // Allow credentials if needed
}));

app.use(express.json()); // Parses incoming JSON requests

// Email Routes
app.use('/api/email', emailRoutes); // Original email routes
app.use('/api/email-service', newEmailRoutes); // New comprehensive email service
app.use('/api/multi-email', multiEmailRoutes); // Multi-approach email service
app.use('/api/send-email', realEmailRoutes); // REAL email service (BEST FOR ACTUAL USERS)

// Define Routes
app.use('/api', apiRoutes); // Base path for all API routes

app.use('/api/quizResult', quizResultRoutes);

// Define Routes
app.use('/api/quiz', quizRoutes); // Add quizRoutes here for quiz-specific endpoints

// Register the routes with /api prefix
app.use('/api', quizRoutes);

// Quiz result route
app.use('/api/quizResult', quizResultRoutes);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log('📧 Email services available:');
    console.log('  - /api/send-email (REAL emails to actual users) ⭐');
    console.log('  - /api/multi-email (Multi-approach service)');
    console.log('  - /api/email-service (Comprehensive service)');
    console.log('🚀 Ready to send emails to real users at http://localhost:8100/send-email');
});

// Run this by executing "node server.js"
