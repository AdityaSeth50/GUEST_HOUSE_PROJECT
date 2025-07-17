import express from 'express';
import OTP from '../models/OTP.js';
import { sendOTPEmail } from '../config/emailConfig.js';

const router = express.Router();

// Generate and send OTP
router.post('/send', async (req, res) => {
  try {
    const { email, purpose = 'email_verification' } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }
    
    // Check if there's a recent OTP request (rate limiting)
    const recentOTP = await OTP.findOne({
      email: email.toLowerCase(),
      purpose,
      createdAt: { $gte: new Date(Date.now() - 60000) } // Within last 1 minute
    });
    
    if (recentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 1 minute before requesting another OTP'
      });
    }
    
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Delete any existing OTPs for this email and purpose
    await OTP.deleteMany({ email: email.toLowerCase(), purpose });
    
    // Create new OTP record
    const newOTP = new OTP({
      email: email.toLowerCase(),
      otp: otpCode,
      purpose
    });
    
    await newOTP.save();
    
    // Send OTP email
    await sendOTPEmail(email, otpCode, purpose);
    
    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresIn: 600 // 10 minutes
    });
    
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// Verify OTP
router.post('/verify', async (req, res) => {
  try {
    const { email, otp, purpose = 'email_verification' } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose,
      verified: false
    });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or already verified. Please request a new OTP.'
      });
    }
    
    // Check if OTP has expired
    const now = new Date();
    const otpAge = (now - otpRecord.createdAt) / 1000; // in seconds
    
    if (otpAge > 600) { // 10 minutes
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }
    
    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }
    
    // Verify OTP
    if (otpRecord.otp !== otp.toString()) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`
      });
    }
    
    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();
    
    res.json({
      success: true,
      message: 'Email verified successfully!'
    });
    
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.'
    });
  }
});

// Check if email is verified
router.post('/check-verification', async (req, res) => {
  try {
    const { email, purpose = 'email_verification' } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const verifiedOTP = await OTP.findOne({
      email: email.toLowerCase(),
      purpose,
      verified: true,
      createdAt: { $gte: new Date(Date.now() - 3600000) } // Valid for 1 hour
    });
    
    res.json({
      success: true,
      verified: !!verifiedOTP
    });
    
  } catch (error) {
    console.error('Check verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check verification status'
    });
  }
});

export default router;