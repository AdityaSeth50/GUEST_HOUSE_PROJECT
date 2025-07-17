import express from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

const router = express.Router();

// Get all bookings (for admin/faculty in charge)
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const bookings = await Booking.find(filter)
      .populate('room')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific booking by booking ID
router.get('/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId
    }).populate('room');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      numGuests,
      guestDetails,
      category,
      purposeOfVisit,
      recommendingAuthority,
      specialRequests,
      emergencyContact
    } = req.body;
    
    // Find room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check room availability
    const isAvailable = await room.checkAvailability(checkIn, checkOut);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }
    
    // Validate number of guests
    if (numGuests > 2) {
      return res.status(400).json({ message: 'Maximum 2 guests allowed per room' });
    }
    
    // Create booking
    const booking = new Booking({
      room: roomId,
      checkIn,
      checkOut,
      numGuests,
      guestDetails,
      category,
      purposeOfVisit,
      recommendingAuthority,
      specialRequests,
      emergencyContact,
      status: 'pending'
    });
    
    await booking.save();
    
    // Populate room details for response
    await booking.populate('room');
    
    res.status(201).json({
      message: 'Booking request submitted successfully. You will receive a confirmation email once verified.',
      booking
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking status (for admin/faculty)
router.put('/:bookingId/status', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update status and timestamps
    booking.status = status;
    
    if (status === 'verified') {
      booking.verifiedAt = new Date();
      booking.verificationRemarks = remarks;
    } else if (status === 'confirmed') {
      booking.confirmedAt = new Date();
      booking.confirmationRemarks = remarks;
    } else if (status === 'rejected') {
      booking.rejectedAt = new Date();
      booking.rejectionRemarks = remarks;
    }
    
    await booking.save();
    
    res.json({
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel a booking
router.put('/:bookingId/cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    if (booking.status === 'confirmed') {
      const now = new Date();
      const checkIn = new Date(booking.checkIn);
      
      // Allow cancellation only if check-in is more than 24 hours away
      if (checkIn <= now) {
        return res.status(400).json({ message: 'Cannot cancel a booking after check-in date' });
      }
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;