import express from 'express';
import { sendContactEmail } from '../config/emailConfig.js';

const router = express.Router();

// Handle contact form submission
router.post('/send-message', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Send emails using nodemailer
    await sendContactEmail({ name, email, subject, message });
    
    res.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message. Please try again later.'
    });
  }
});

export default router;