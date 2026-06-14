require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connect to database
connectDB();

// Security Middlewares
app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://event-sphere-g2sx.vercel.app',
  'https://event-sphere-ecru.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Base Route
app.get('/', (req, res) => {
  res.send('EventSphere API is running...');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Static uploads serving removed for Serverless
// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const http = require('http');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

if (process.env.VERCEL) {
  // In production (Vercel), we just export the app
  console.log('Exporting app for Vercel Serverless');
} else {
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
