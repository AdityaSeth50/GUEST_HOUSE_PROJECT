import express from 'express';
import jwt from 'jsonwebtoken';
import Booking from '../models/Booking.js';

const router = express.Router();

// Admin credentials (in production, use environment variables or database)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

// Middleware to verify admin authentication
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    
    if (!token) {
      return res.status(401).json({ message: 'Admin authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid admin token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Verify credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate admin token
    const token = jwt.sign(
      { 
        username: username,
        role: 'admin',
        loginTime: new Date()
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '8h' } // 8 hour session
    );
    
    // Set secure cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      sameSite: 'strict'
    });
    
    res.json({
      message: 'Login successful',
      admin: {
        username: username,
        role: 'admin'
      }
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Verify admin authentication
router.get('/verify', verifyAdmin, (req, res) => {
  res.json({
    message: 'Admin authenticated',
    admin: {
      username: req.admin.username,
      role: req.admin.role
    }
  });
});

// Admin logout
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logged out successfully' });
});

// Get booking statistics
router.get('/bookings/stats', verifyAdmin, async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Convert to object format
    const statsObject = {};
    stats.forEach(stat => {
      statsObject[stat._id] = stat.count;
    });
    
    res.json(statsObject);
    
  } catch (error) {
    console.error('Error getting booking stats:', error);
    res.status(500).json({ message: 'Failed to get booking statistics' });
  }
});

// Get all bookings (admin only)
router.get('/bookings', verifyAdmin, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 50 } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    // Get bookings with pagination
    const bookings = await Booking.find(filter)
      .populate('room')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.json(bookings);
    
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ message: 'Failed to get bookings' });
  }
});

// Get specific booking (admin only)
router.get('/bookings/:id', verifyAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
    
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ message: 'Failed to get booking' });
  }
});

// Update booking status (admin only)
router.put('/bookings/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update status and timestamps
    booking.status = status;
    
    if (status === 'confirmed') {
      booking.confirmedAt = new Date();
      booking.confirmationRemarks = remarks;
    } else if (status === 'rejected') {
      booking.rejectedAt = new Date();
      booking.rejectionRemarks = remarks;
    }
    
    await booking.save();
    
    // TODO: Send email notification to guest
    
    res.json({
      message: `Booking ${status} successfully`,
      booking
    });
    
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

// Delete booking (admin only)
router.delete('/bookings/:id', verifyAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Booking deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
});

// Get booking counts by date range (for analytics)
router.get('/analytics/bookings-by-date', verifyAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const analytics = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          statuses: {
            $push: '$status'
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    res.json(analytics);
    
  } catch (error) {
    console.error('Error getting booking analytics:', error);
    res.status(500).json({ message: 'Failed to get booking analytics' });
  }
});

export default router;