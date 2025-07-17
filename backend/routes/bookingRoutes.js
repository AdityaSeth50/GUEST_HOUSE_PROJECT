import express from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import OTP from '../models/OTP.js';
// import { authenticateUser } from '../middleware/auth.js';
import { 
  sendGuestBookingConfirmationEmail,
  sendGuestHouseBookingNotificationEmail,
  sendAuthorityVerificationEmail,
  sendGuestHouseConfirmationEmail,
  sendBookingStatusEmail 
} from '../config/emailConfig.js';

const router = express.Router();

// PUBLIC BOOKING ROUTE - No authentication required but email verification required
router.post('/public', async (req, res) => {
  try {
    const {
      roomType,
      checkIn,
      checkOut,
      numGuests,
      guestDetails,
      category,
      purposeOfVisit,
      recommendingAuthority,
      specialRequests,
      emergencyContact,
      paymentDetails
    } = req.body;
    
    // Verify email OTP before proceeding
    const emailVerification = await OTP.findOne({
      email: guestDetails.email.toLowerCase(),
      purpose: 'email_verification',
      verified: true,
      createdAt: { $gte: new Date(Date.now() - 3600000) } // Valid for 1 hour
    });
    
    if (!emailVerification) {
      return res.status(400).json({
        message: 'Email verification required. Please verify your email address first.'
      });
    }
    
    // Calculate rooms required
    const roomsRequired = Math.ceil(numGuests / 2);
    
    // Check room availability using the new method
    const availabilityData = await Room.getAvailableRoomsCount(roomType, checkIn, checkOut);
    
    if (availabilityData.availableRooms < roomsRequired) {
      return res.status(400).json({ 
        message: `Not enough rooms available. Required: ${roomsRequired}, Available: ${availabilityData.availableRooms}`,
        availability: availabilityData
      });
    }
    
    // Find available rooms of the requested type
    const availableRooms = await Room.find({ 
      type: roomType,
      isAvailable: true 
    });
    
    // Use the first available room for booking reference (we'll assign specific rooms later)
    const selectedRoom = availableRooms[0];
    
    // Create booking
    const booking = new Booking({
      room: selectedRoom._id,
      checkIn,
      checkOut,
      numGuests,
      roomsRequired,
      guestDetails,
      category,
      purposeOfVisit,
      recommendingAuthority,
      specialRequests,
      emergencyContact,
      paymentDetails,
      status: 'pending'
    });

    booking.bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
    
    await booking.save();
    
    // Populate room details for response
    await booking.populate('room');
    
    // Send THREE emails as requested
    try {
      // 1. Send confirmation email to guest
      await sendGuestBookingConfirmationEmail({
        booking,
        room: selectedRoom
      });
      
      // 2. Send notification email to guest house
      await sendGuestHouseBookingNotificationEmail({
        booking,
        room: selectedRoom
      });
      
      // 3. Send verification email to recommending authority
      await sendAuthorityVerificationEmail({
        booking,
        room: selectedRoom
      });
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }
    
    res.status(201).json({
      message: 'Booking request submitted successfully. You will receive a confirmation email once verified.',
      booking,
      roomsAllocated: roomsRequired,
      availabilityAfterBooking: {
        totalRooms: availabilityData.totalRooms,
        bookedRooms: availabilityData.bookedRooms + roomsRequired,
        availableRooms: availabilityData.availableRooms - roomsRequired
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// EMAIL VERIFICATION ROUTE - Handle approve/reject links
router.get('/verify/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action, token } = req.query;
    
    // Find the booking
    const booking = await Booking.findOne({ bookingId }).populate('room');
    
    if (!booking) {
      return res.status(404).send(`
        <html>
          <head><title>Booking Not Found</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc3545;">❌ Booking Not Found</h1>
            <p>The booking ID ${bookingId} was not found in our system.</p>
            <p>Please contact the guest house at <strong>guesthouse@iiest.ac.in</strong> for assistance.</p>
          </body>
        </html>
      `);
    }
    
    // Check if booking is already processed
    if (booking.status !== 'pending') {
      return res.status(400).send(`
        <html>
          <head><title>Booking Already Processed</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #ffc107;">⚠️ Booking Already Processed</h1>
            <p>Booking ${bookingId} has already been <strong>${booking.status}</strong>.</p>
            <p>Current Status: <span style="color: #1A3A5A; font-weight: bold;">${booking.status.toUpperCase()}</span></p>
            <p>If you have any questions, please contact the guest house at <strong>guesthouse@iiest.ac.in</strong>.</p>
          </body>
        </html>
      `);
    }
    
    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).send(`
        <html>
          <head><title>Invalid Action</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc3545;">❌ Invalid Action</h1>
            <p>Invalid verification action. Please use the correct links from the email.</p>
          </body>
        </html>
      `);
    }
    
    // Process the verification
    if (action === 'approve') {
      booking.status = 'verified';
      booking.verifiedAt = new Date();
      booking.verificationRemarks = 'Approved via email verification';
      
      await booking.save();
      
      // Send approval email to guest (KEEP THIS AS USUAL)
      try {
        await sendBookingStatusEmail(booking, 'verified', 'Your booking has been approved by the recommending authority. The guest house will now review and confirm your booking shortly.');
        
        // ALSO send confirmation request to guest house
        await sendGuestHouseConfirmationEmail(booking);
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
      }
      
      return res.send(`
        <html>
          <head><title>Booking Approved</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #28a745;">✅ Booking Approved Successfully!</h1>
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin: 20px auto; max-width: 500px;">
              <h3>Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Guest:</strong> ${booking.guestDetails.name}</p>
              <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString('en-IN')}</p>
              <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString('en-IN')}</p>
              <p><strong>Guests:</strong> ${booking.numGuests}</p>
              <p><strong>Rooms:</strong> ${booking.roomsRequired}</p>
            </div>
            <p>The guest has been notified of the approval. The guest house will now review and confirm the booking.</p>
            <p style="color: #6c757d; font-size: 14px;">Thank you for your prompt response!</p>
          </body>
        </html>
      `);
      
    } else if (action === 'reject') {
      booking.status = 'rejected';
      booking.rejectedAt = new Date();
      booking.rejectionRemarks = 'Rejected via email verification';
      
      await booking.save();
      
      // Send rejection email to guest (KEEP THIS AS USUAL)
      try {
        await sendBookingStatusEmail(booking, 'rejected', 'Your booking has been rejected by the recommending authority. Your caution money of ₹199 will be refunded within 5-7 business days.');
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
      }
      
      return res.send(`
        <html>
          <head><title>Booking Rejected</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc3545;">❌ Booking Rejected</h1>
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 5px; margin: 20px auto; max-width: 500px;">
              <h3>Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Guest:</strong> ${booking.guestDetails.name}</p>
              <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString('en-IN')}</p>
              <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString('en-IN')}</p>
            </div>
            <p>The guest has been notified of the rejection and will receive a refund of the caution money.</p>
            <p style="color: #6c757d; font-size: 14px;">Thank you for your response.</p>
          </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).send(`
      <html>
        <head><title>Verification Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">❌ Verification Error</h1>
          <p>An error occurred while processing your verification.</p>
          <p>Please contact the guest house at <strong>guesthouse@iiests.ac.in</strong> for assistance.</p>
          <p style="color: #6c757d; font-size: 12px;">Error: ${error.message}</p>
        </body>
      </html>
    `);
  }
});

// NEW: Guest House Confirmation Route - Handle confirm/reject links
router.get('/guest-house-confirm/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action, token } = req.query;
    
    // Find the booking
    const booking = await Booking.findOne({ bookingId }).populate('room');
    
    if (!booking) {
      return res.status(404).send(`
        <html>
          <head><title>Booking Not Found</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc3545;">❌ Booking Not Found</h1>
            <p>The booking ID ${bookingId} was not found in our system.</p>
            <p>Please contact the guest house at <strong>guesthouse@iiests.ac.in</strong> for assistance.</p>
          </body>
        </html>
      `);
    }
    
    // Check if booking is in verified status (ready for guest house confirmation)
    if (booking.status !== 'verified') {
      return res.status(400).send(`
        <html>
          <head><title>Invalid Booking Status</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #ffc107;">⚠️ Invalid Booking Status</h1>
            <p>Booking ${bookingId} is currently <strong>${booking.status}</strong>.</p>
            <p>Guest house confirmation is only available for verified bookings.</p>
            <p>If you have any questions, please contact the guest house at <strong>guesthouse@iiest.ac.in</strong>.</p>
          </body>
        </html>
      `);
    }
    
    // Validate action
    if (!['confirm', 'reject'].includes(action)) {
      return res.status(400).send(`
        <html>
          <head><title>Invalid Action</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc3545;">❌ Invalid Action</h1>
            <p>Invalid confirmation action. Please use the correct links from the email.</p>
          </body>
        </html>
      `);
    }
    
    // Process the guest house confirmation
    if (action === 'confirm') {
      booking.status = 'confirmed';
      booking.confirmedAt = new Date();
      booking.confirmationRemarks = 'Confirmed by guest house via email';
      
      await booking.save();
      
      // Send final confirmation email to guest
      try {
        await sendBookingStatusEmail(booking, 'confirmed', 'Your booking has been confirmed by the guest house. We look forward to hosting you!');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
      
      return res.send(`
        <html>
          <head><title>Booking Confirmed</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #28a745;">✅ Booking Confirmed Successfully!</h1>
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin: 20px auto; max-width: 500px;">
              <h3>Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Guest:</strong> ${booking.guestDetails.name}</p>
              <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString('en-IN')}</p>
              <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString('en-IN')}</p>
              <p><strong>Guests:</strong> ${booking.numGuests}</p>
              <p><strong>Rooms:</strong> ${booking.roomsRequired}</p>
            </div>
            <p>The guest has been notified of the confirmation with check-in instructions.</p>
            <p style="color: #6c757d; font-size: 14px;">Thank you for confirming this booking!</p>
          </body>
        </html>
      `);
      
    } else if (action === 'reject') {
      booking.status = 'rejected';
      booking.rejectedAt = new Date();
      booking.rejectionRemarks = 'Rejected by guest house after authority approval';
      
      await booking.save();
      
      // Send rejection email to guest
      try {
        await sendBookingStatusEmail(booking, 'guest-house-rejected', 'Your booking has been rejected by the guest house after authority approval. Your caution money of ₹199 will be refunded within 5-7 business days.');
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
      }
      
      return res.send(`
        <html>
          <head><title>Booking Rejected</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc3545;">❌ Booking Rejected</h1>
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 5px; margin: 20px auto; max-width: 500px;">
              <h3>Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Guest:</strong> ${booking.guestDetails.name}</p>
              <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString('en-IN')}</p>
              <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString('en-IN')}</p>
            </div>
            <p>The guest has been notified of the rejection and will receive a refund of the caution money.</p>
            <p style="color: #6c757d; font-size: 14px;">Thank you for your response.</p>
          </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('Guest house confirmation error:', error);
    return res.status(500).send(`
      <html>
        <head><title>Confirmation Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc3545;">❌ Confirmation Error</h1>
          <p>An error occurred while processing your confirmation.</p>
          <p>Please contact the guest house at <strong>guesthouse@iiest.ac.in</strong> for assistance.</p>
          <p style="color: #6c757d; font-size: 12px;">Error: ${error.message}</p>
        </body>
      </html>
    `);
  }
});

// Get available rooms count for a specific type and dates - IMPROVED VERSION
router.get('/availability', async (req, res) => {
  try {
    const { roomType, checkIn, checkOut } = req.query;
    
    if (!roomType || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Room type, check-in, and check-out dates are required' });
    }
    
    // Use the improved availability checking method
    const availabilityData = await Room.getAvailableRoomsCount(roomType, checkIn, checkOut);
    
    res.json({
      roomType,
      checkIn,
      checkOut,
      ...availabilityData
    });
    
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ message: error.message });
  }
});

// NEW: Public booking status check route (no authentication required)
router.get('/status/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { guestName } = req.query;
    
    if (!guestName) {
      return res.status(400).json({ message: 'Guest name is required' });
    }
    
    // Find booking by ID and guest name (case insensitive)
    const booking = await Booking.findOne({
      bookingId: bookingId.toUpperCase(),
      'guestDetails.name': { $regex: new RegExp(guestName, 'i') }
    }).populate('room');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found. Please check your booking ID and name.' });
    }
    
    // Return booking status information
    res.json({
      bookingId: booking.bookingId,
      status: booking.status,
      guestName: booking.guestDetails.name,
      roomType: booking.room.title,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      numGuests: booking.numGuests,
      roomsRequired: booking.roomsRequired,
      submittedAt: booking.submittedAt,
      verifiedAt: booking.verifiedAt,
      confirmedAt: booking.confirmedAt,
      rejectedAt: booking.rejectedAt,
      verificationRemarks: booking.verificationRemarks,
      confirmationRemarks: booking.confirmationRemarks,
      rejectionRemarks: booking.rejectionRemarks
    });
    
  } catch (error) {
    console.error('Booking status check error:', error);
    res.status(500).json({ message: error.message });
  }
});



export default router;