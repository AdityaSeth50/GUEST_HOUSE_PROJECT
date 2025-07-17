import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// Route imports
import roomRoutes from './backend/routes/roomRoutes.js';
import bookingRoutes from './backend/routes/bookingRoutes.js';
import paymentRoutes from './backend/routes/paymentRoutes.js';
import contactRoutes from './backend/routes/contactRoutes.js';
import otpRoutes from './backend/routes/otpRoutes.js';
import adminRoutes from './backend/routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve specific HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/rooms', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'rooms.html'));
});

app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'booking.html'));
});

app.get('/my-bookings', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'my-bookings.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ success: false, message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
  console.log(`To initialize rooms, visit: http://localhost:${PORT}/api/rooms/initialize`);
});