import express from 'express';
import Booking from '../models/Booking.js';
import { authenticateUser } from '../middleware/auth.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent', authenticateUser, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    // Find booking
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot process payment for a cancelled booking' });
    }
    
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment has already been completed for this booking' });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalAmount * 100, // Amount in cents
      currency: 'inr',
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment (webhook handler in a real app)
router.post('/confirm', authenticateUser, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    // Find booking
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;