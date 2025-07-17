
import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, purpose = 'email_verification') => {
  const transporter = createTransporter();
  
  const purposeText = {
    'email_verification': 'Email Verification',
    'booking_verification': 'Booking Verification'
  };
  
  const mailOptions = {
    from: `"IIEST Guest House" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${purposeText[purpose]} - OTP Code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1A3A5A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-box { 
            background-color: white; 
            padding: 20px; 
            margin: 20px 0; 
            border-left: 4px solid #D4AF37; 
            border-radius: 4px;
            text-align: center;
          }
          .otp-code { 
            font-size: 2.5rem; 
            font-weight: bold; 
            color: #1A3A5A; 
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
          }
          .warning { 
            background-color: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 15px; 
            border-radius: 4px; 
            margin: 15px 0;
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            color: #666; 
            font-size: 0.9rem;
          }
          
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IIEST Guest House</h1>
            <h2>${purposeText[purpose]}</h2>
          </div>
          <div class="content">
            <p>Dear Guest,</p>
            <p>You have requested an OTP for ${purposeText[purpose].toLowerCase()} at IIEST Guest House. Please use the following code to verify your email address:</p>
            
            <div class="otp-box">
              <h3>Your OTP Code</h3>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 0.9rem;">This code is valid for 10 minutes</p>
            </div>
            
            <div class="warning">
              <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ Important Security Information</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>This OTP will expire in <strong>10 minutes</strong></li>
                <li>You have <strong>3 attempts</strong> to enter the correct OTP</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this OTP, please ignore this email</li>
              </ul>
            </div>
            
            
            <p>If you're having trouble with verification, please contact us:</p>
            <ul>
              <li><strong>Phone:</strong> +91 (033) 2668-2223</li>
              <li><strong>Email:</strong> guesthouse@iiests.ac.in</li>
            </ul>
          </div>
          <div class="footer">
            <p>IIEST Guest House - Secure Booking System</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
    return { success: true, message: 'OTP email sent successfully' };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send contact form email
export const sendContactEmail = async (contactData) => {
  const transporter = createTransporter();
  
  const { name, email, subject, message } = contactData;
  
  // Email to guest house
  const guestHouseMailOptions = {
    from: `"IIEST Guest House Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.GUEST_HOUSE_EMAIL,
    subject: `Contact Form: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1A3A5A; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #1A3A5A; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #D4AF37; }
          .label { font-weight: bold; color: #1A3A5A; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IIEST Guest House</h1>
            <h2>New Contact Message</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <p><span class="label">Name:</span> ${name}</p>
              <p><span class="label">Email:</span> ${email}</p>
              <p><span class="label">Subject:</span> ${subject}</p>
              <p><span class="label">Message:</span> ${message}</p>
              <p><span class="label">Submitted:</span> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
          <div class="footer">
            <p>IIEST Guest House - Contact Management System</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  // Confirmation email to sender
  const confirmationMailOptions = {
    from: `"IIEST Guest House" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Message Received - ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1A3A5A; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #1A3A5A; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #D4AF37; }
          .label { font-weight: bold; color: #1A3A5A; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IIEST Guest House</h1>
            <h2>Message Confirmation</h2>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for contacting IIEST Guest House. We have received your message and will respond within 24 hours.</p>
            
            <div class="info-box">
              <p><span class="label">Your Message Details:</span></p>
              <p><span class="label">Subject:</span> ${subject}</p>
              <p><span class="label">Message:</span> ${message}</p>
              <p><span class="label">Submitted:</span> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            
            <p>If you have any urgent queries, please contact us directly:</p>
            <ul>
              <li><strong>Phone:</strong> +91 (033) 2668-2223</li>
              <li><strong>Email:</strong> guesthouse@iiests.ac.in</li>
              <li><strong>Address:</strong> IIEST Campus, Shibpur, Howrah, West Bengal</li>
            </ul>
          </div>
          <div class="footer">
            <p>IIEST Guest House - Comfort and hospitality at its best</p>
            <p>This is an automated confirmation email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    // Send both emails
    await transporter.sendMail(guestHouseMailOptions);
    await transporter.sendMail(confirmationMailOptions);
    
    console.log('Contact emails sent successfully');
    return { success: true, message: 'Emails sent successfully' };
  } catch (error) {
    console.error('Error sending contact emails:', error);
    throw new Error('Failed to send emails');
  }
};

// NEW: Send booking confirmation email to guest
export const sendGuestBookingConfirmationEmail = async (bookingData) => {
  const transporter = createTransporter();
  
  const { booking, room } = bookingData;
  
  // Calculate nights and total
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  const mailOptions = {
    from: `"IIEST Guest House" <${process.env.EMAIL_USER}>`,
    to: booking.guestDetails.email,
    subject: `Booking Confirmation - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #D4AF37; }
          .label { font-weight: bold; color: #1A3A5A; }
          .status-box { 
            background-color: #d4edda; 
            border: 1px solid #c3e6cb; 
            padding: 15px; 
            border-radius: 4px; 
            margin: 15px 0;
            text-align: center;
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            color: #666; 
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Request Submitted!</h1>
            <h2>IIEST Guest House</h2>
          </div>
          <div class="content">
            <p>Dear ${booking.guestDetails.name},</p>
            <p>Thank you for choosing IIEST Guest House! Your booking request has been successfully submitted and payment received.</p>
            
            <div class="status-box">
              <h3 style="margin: 0; color: #28a745;">✅ Payment Confirmed</h3>
              <p style="margin: 5px 0 0 0;">Caution Money: ₹199 (Refundable)</p>
            </div>
            
            <div class="info-box">
              <h3>Booking Details</h3>
              <p><span class="label">Booking ID:</span> ${booking.bookingId}</p>
              <p><span class="label">Room Type:</span> ${room.title}</p>
              <p><span class="label">Check In:</span> ${checkIn.toLocaleDateString('en-IN')}</p>
              <p><span class="label">Check Out:</span> ${checkOut.toLocaleDateString('en-IN')}</p>
              <p><span class="label">Nights:</span> ${nights}</p>
              <p><span class="label">Guests:</span> ${booking.numGuests}</p>
              <p><span class="label">Rooms Required:</span> ${booking.roomsRequired}</p>
              <p><span class="label">Purpose:</span> ${booking.purposeOfVisit}</p>
            </div>
            
            <div class="info-box">
              <h3>Next Steps</h3>
              <ol>
                <li><strong>Verification:</strong> We have sent a verification email to your recommending authority</li>
                <li><strong>Approval:</strong> Once approved, the guest house will review and confirm your booking</li>
                <li><strong>Confirmation:</strong> You will receive a final confirmation email with check-in details</li>
              </ol>
            </div>
            
            <div class="info-box">
              <h3>Important Information</h3>
              <ul>
                <li>Your caution money will be adjusted in the final bill</li>
                <li>Please keep your Booking ID for future reference</li>
                <li>You can check your booking status anytime using our booking tracker</li>
              </ul>
            </div>
            
            <p>For any queries, please contact us:</p>
            <ul>
              <li><strong>Phone:</strong> +91 (033) 2668-2223</li>
              <li><strong>Email:</strong> guesthouse@iiests.ac.in</li>
            </ul>
          </div>
          <div class="footer">
            <p>IIEST Guest House - Thank you for choosing us!</p>
            <p>This is an automated confirmation email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Guest booking confirmation email sent successfully to ${booking.guestDetails.email}`);
    return { success: true, message: 'Guest confirmation email sent successfully' };
  } catch (error) {
    console.error('Error sending guest confirmation email:', error);
    throw new Error('Failed to send guest confirmation email');
  }
};

// NEW: Send booking notification email to guest house
export const sendGuestHouseBookingNotificationEmail = async (bookingData) => {
  const transporter = createTransporter();
  
  const { booking, room } = bookingData;
  
  // Calculate nights and total
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  const mailOptions = {
    from: `"IIEST Guest House System" <${process.env.EMAIL_USER}>`,
    to: process.env.GUEST_HOUSE_EMAIL,
    subject: `New Booking Request - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1A3A5A; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #1A3A5A; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #D4AF37; }
          .label { font-weight: bold; color: #1A3A5A; }
          .status { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 10px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IIEST Guest House</h1>
            <h2>New Booking Request</h2>
          </div>
          <div class="content">
            <div class="status">
              <p><strong>Status:</strong> Payment Received - Verification email sent to recommending authority</p>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Payment Status:</strong> ₹199 Caution Money Received</p>
            </div>
            
            <div class="info-box">
              <h3>Guest Information</h3>
              <p><span class="label">Name:</span> ${booking.guestDetails.name}</p>
              ${booking.guestDetails.designation ? `<p><span class="label">Designation:</span> ${booking.guestDetails.designation}</p>` : ''}
              ${booking.guestDetails.department ? `<p><span class="label">Department:</span> ${booking.guestDetails.department}</p>` : ''}
              ${booking.guestDetails.institute ? `<p><span class="label">Institute:</span> ${booking.guestDetails.institute}</p>` : ''}
              <p><span class="label">Email:</span> ${booking.guestDetails.email}</p>
              <p><span class="label">Phone:</span> ${booking.guestDetails.phone}</p>
              <p><span class="label">Address:</span> ${booking.guestDetails.address}</p>
              <p><span class="label">Category:</span> ${booking.category}</p>
            </div>
            
            <div class="info-box">
              <h3>Booking Details</h3>
              <p><span class="label">Room Type:</span> ${room.title}</p>
              <p><span class="label">Check In:</span> ${checkIn.toLocaleDateString('en-IN')}</p>
              <p><span class="label">Check Out:</span> ${checkOut.toLocaleDateString('en-IN')}</p>
              <p><span class="label">Nights:</span> ${nights}</p>
              <p><span class="label">Total Guests:</span> ${booking.numGuests}</p>
              <p><span class="label">Rooms Required:</span> ${booking.roomsRequired}</p>
              <p><span class="label">Purpose:</span> ${booking.purposeOfVisit}</p>
            </div>
            
            <div class="info-box">
              <h3>Recommending Authority</h3>
              <p><span class="label">Name:</span> ${booking.recommendingAuthority.name}</p>
              <p><span class="label">Designation:</span> ${booking.recommendingAuthority.designation}</p>
              <p><span class="label">Department:</span> ${booking.recommendingAuthority.department}</p>
              <p><span class="label">Email:</span> ${booking.recommendingAuthority.email}</p>
              <p><span class="label">Phone:</span> ${booking.recommendingAuthority.phone}</p>
            </div>
            
            <div class="info-box">
              <h3>Emergency Contact</h3>
              <p><span class="label">Name:</span> ${booking.emergencyContact.name || 'Not provided'}</p>
              <p><span class="label">Phone:</span> ${booking.emergencyContact.phone || 'Not provided'}</p>
              <p><span class="label">Relation:</span> ${booking.emergencyContact.relation || 'Not provided'}</p>
            </div>
            
            <div class="info-box">
              <h3>Special Requests</h3>
              <p>${booking.specialRequests || 'None'}</p>
            </div>
          </div>
          <div class="footer">
            <p>IIEST Guest House - Booking Management System</p>
            <p>Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Guest house booking notification email sent successfully');
    return { success: true, message: 'Guest house notification email sent successfully' };
  } catch (error) {
    console.error('Error sending guest house notification email:', error);
    throw new Error('Failed to send guest house notification email');
  }
};

// Send booking notification email with verification links to recommending authority
export const sendAuthorityVerificationEmail = async (bookingData) => {
  const transporter = createTransporter();
  
  const { booking, room } = bookingData;
  
  // Calculate nights and total
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  // Create verification links (using localhost for testing)
  const baseUrl = 'http://localhost:3000';
  const approveLink = `${baseUrl}/api/bookings/verify/${booking.bookingId}?action=approve&token=${generateVerificationToken(booking.bookingId)}`;
  const rejectLink = `${baseUrl}/api/bookings/verify/${booking.bookingId}?action=reject&token=${generateVerificationToken(booking.bookingId)}`;
  
  // Email to recommending authority with verification links
  const authMailOptions = {
    from: `"IIEST Guest House" <${process.env.EMAIL_USER}>`,
    to: booking.recommendingAuthority.email,
    subject: `Booking Verification Required - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1A3A5A; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #1A3A5A; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #D4AF37; }
          .label { font-weight: bold; color: #1A3A5A; }
          .action-required { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .verification-buttons { text-align: center; margin: 20px 0; }
          .approve-btn { 
            background-color: #28a745; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 0 10px;
            display: inline-block;
            font-weight: bold;
          }
          .reject-btn { 
            background-color: #dc3545; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 0 10px;
            display: inline-block;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IIEST Guest House</h1>
            <h2>Booking Verification Required</h2>
          </div>
          <div class="content">
            <div class="action-required">
              <h3>⚠️ Action Required: Please verify this booking request</h3>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            </div>
            
            <div class="verification-buttons">
              <a href="${approveLink}" class="approve-btn">✅ APPROVE BOOKING</a>
              <a href="${rejectLink}" class="reject-btn">❌ REJECT BOOKING</a>
            </div>
            
            <div class="info-box">
              <h3>Guest Details</h3>
              <p><span class="label">Name:</span> ${booking.guestDetails.name}</p>
              ${booking.guestDetails.designation ? `<p><span class="label">Designation:</span> ${booking.guestDetails.designation}</p>` : ''}
              ${booking.guestDetails.department ? `<p><span class="label">Department:</span> ${booking.guestDetails.department}</p>` : ''}
              ${booking.guestDetails.institute ? `<p><span class="label">Institute:</span> ${booking.guestDetails.institute}</p>` : ''}
              <p><span class="label">Email:</span> ${booking.guestDetails.email}</p>
              <p><span class="label">Phone:</span> ${booking.guestDetails.phone}</p>
              <p><span class="label">Category:</span> ${booking.category}</p>
            </div>
            
            <div class="info-box">
              <h3>Booking Details</h3>
              <p><span class="label">Room Type:</span> ${room.title}</p>
              <p><span class="label">Check In:</span> ${checkIn.toLocaleDateString('en-IN')}</p>
              <p><span class="label">Check Out:</span> ${checkOut.toLocaleDateString('en-IN')}</p>
              <p><span class="label">Nights:</span> ${nights}</p>
              <p><span class="label">Total Guests:</span> ${booking.numGuests}</p>
              <p><span class="label">Rooms Required:</span> ${booking.roomsRequired}</p>
              <p><span class="label">Purpose:</span> ${booking.purposeOfVisit}</p>
            </div>
            
            <div class="info-box">
              <h3>Special Requests</h3>
              <p>${booking.specialRequests || 'None'}</p>
            </div>
            
            <p><strong>Please click one of the buttons above to approve or reject this booking request.</strong></p>
            <p>Alternatively, you can contact the guest house at <strong>guesthouse@iiests.ac.in</strong> or <strong>+91 (033) 2668-2223</strong>.</p>
          </div>
          <div class="footer">
            <p>IIEST Guest House - Booking Verification System</p>
            <p>This email requires your action for booking verification.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(authMailOptions);
    console.log('Authority verification email sent successfully');
    return { success: true, message: 'Authority verification email sent successfully' };
  } catch (error) {
    console.error('Error sending authority verification email:', error);
    throw new Error('Failed to send authority verification email');
  }
};

// NEW: Send guest house confirmation email with approve/reject links
export const sendGuestHouseConfirmationEmail = async (booking) => {
  const transporter = createTransporter();
  
  // Calculate nights and total
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  // Create confirmation links (using localhost for testing)
  const baseUrl = 'http://localhost:3000';
  const confirmLink = `${baseUrl}/api/bookings/guest-house-confirm/${booking.bookingId}?action=confirm&token=${generateVerificationToken(booking.bookingId)}`;
  const rejectLink = `${baseUrl}/api/bookings/guest-house-confirm/${booking.bookingId}?action=reject&token=${generateVerificationToken(booking.bookingId)}`;
  
  const mailOptions = {
    from: `"IIEST Guest House System" <${process.env.EMAIL_USER}>`,
    to: process.env.GUEST_HOUSE_EMAIL || 'guesthouse@iiest.ac.in',
    subject: `Guest House Confirmation Required - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1A3A5A; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #1A3A5A; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #D4AF37; }
          .label { font-weight: bold; color: #1A3A5A; }
          .action-required { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .verification-buttons { text-align: center; margin: 20px 0; }
          .confirm-btn { 
            background-color: #28a745; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 0 10px;
            display: inline-block;
            font-weight: bold;
          }
          .reject-btn { 
            background-color: #dc3545; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 0 10px;
            display: inline-block;
            font-weight: bold;
          }
          .status-info { background-color: #e8f4fd; border: 1px solid #bee5eb; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IIEST Guest House</h1>
            <h2>Booking Confirmation Required</h2>
          </div>
          <div class="content">
            <div class="action-required">
              <h3>✅ Authority Approved - Guest House Confirmation Required</h3>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p>The recommending authority has approved this booking. Please review and confirm or reject the booking.</p>
            </div>
            
            <div class="verification-buttons">
              <a href="${confirmLink}" class="confirm-btn">✅ CONFIRM BOOKING</a>
              <a href="${rejectLink}" class="reject-btn">❌ REJECT BOOKING</a>
            </div>
            
            <div class="status-info">
              <h4>📋 Booking Status Flow</h4>
              <p>✅ <strong>Payment Received:</strong> ₹199 caution money collected</p>
              <p>✅ <strong>Authority Approved:</strong> Recommending authority has verified the booking</p>
              <p>⏳ <strong>Awaiting Guest House Confirmation:</strong> Please confirm or reject this booking</p>
            </div>
            
            <div class="info-box">
              <h3>Guest Details</h3>
              <p><span class="label">Name:</span> ${booking.guestDetails.name}</p>
              ${booking.guestDetails.designation ? `<p><span class="label">Designation:</span> ${booking.guestDetails.designation}</p>` : ''}
              ${booking.guestDetails.department ? `<p><span class="label">Department:</span> ${booking.guestDetails.department}</p>` : ''}
              ${booking.guestDetails.institute ? `<p><span class="label">Institute:</span> ${booking.guestDetails.institute}</p>` : ''}
              <p><span class="label">Email:</span> ${booking.guestDetails.email}</p>
              <p><span class="label">Phone:</span> ${booking.guestDetails.phone}</p>
              <p><span class="label">Category:</span> ${booking.category}</p>
            </div>
            
            <div class="info-box">
              <h3>Booking Details</h3>
              <p><span class="label">Room Type:</span> ${booking.room ? booking.room.title : 'Room details not available'}</p>
              <p><span class="label">Check In:</span> ${checkIn.toLocaleDateString('en-IN')}</p>
              <p><span class="label">Check Out:</span> ${checkOut.toLocaleDateString('en-IN')}</p>
              <p><span class="label">Nights:</span> ${nights}</p>
              <p><span class="label">Total Guests:</span> ${booking.numGuests}</p>
              <p><span class="label">Rooms Required:</span> ${booking.roomsRequired}</p>
              <p><span class="label">Purpose:</span> ${booking.purposeOfVisit}</p>
            </div>
            
            <div class="info-box">
              <h3>Recommending Authority</h3>
              <p><span class="label">Name:</span> ${booking.recommendingAuthority.name}</p>
              <p><span class="label">Designation:</span> ${booking.recommendingAuthority.designation}</p>
              <p><span class="label">Department:</span> ${booking.recommendingAuthority.department}</p>
              <p><span class="label">Email:</span> ${booking.recommendingAuthority.email}</p>
              <p><span class="label">Phone:</span> ${booking.recommendingAuthority.phone}</p>
            </div>
            
            <div class="info-box">
              <h3>Special Requests</h3>
              <p>${booking.specialRequests || 'None'}</p>
            </div>
            
            <div class="info-box">
              <h3>Payment Information</h3>
              <p><span class="label">Caution Money:</span> ₹199 (Received)</p>
              <p><span class="label">Payment Status:</span> Completed</p>
              <p><span class="label">Payment ID:</span> ${booking.paymentDetails?.razorpay_payment_id || 'N/A'}</p>
            </div>
            
            <p><strong>Please click one of the buttons above to confirm or reject this booking request.</strong></p>
            <p>If you have any questions, please contact the guest at <strong>${booking.guestDetails.email}</strong> or <strong>${booking.guestDetails.phone}</strong>.</p>
          </div>
          <div class="footer">
            <p>IIEST Guest House - Booking Management System</p>
            <p>This email requires your action for final booking confirmation.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Guest house confirmation email sent successfully');
    return { success: true, message: 'Guest house confirmation email sent successfully' };
  } catch (error) {
    console.error('Error sending guest house confirmation email:', error);
    throw new Error('Failed to send guest house confirmation email');
  }
};

// Send booking status update email to guest
export const sendBookingStatusEmail = async (booking, status, remarks = '') => {
  const transporter = createTransporter();
  
  const statusMessages = {
    verified: {
      subject: 'Booking Approved by Authority',
      title: '✅ Your Booking Has Been Approved!',
      message: 'Great news! Your booking request has been approved by the recommending authority. The guest house will now review and confirm your booking.',
      color: '#28a745'
    },
    rejected: {
      subject: 'Booking Rejected by Authority',
      title: '❌ Your Booking Has Been Rejected',
      message: 'Unfortunately, your booking request has been rejected by the recommending authority.',
      color: '#dc3545'
    },
    confirmed: {
      subject: 'Booking Confirmed by Guest House',
      title: '🎉 Your Booking Is Confirmed!',
      message: 'Your booking has been confirmed by the guest house. We look forward to hosting you!',
      color: '#28a745'
    },
    'guest-house-rejected': {
      subject: 'Booking Rejected by Guest House',
      title: '❌ Your Booking Has Been Rejected',
      message: 'Unfortunately, your booking request has been rejected by the guest house after authority approval.',
      color: '#dc3545'
    }
  };
  
  const statusInfo = statusMessages[status];
  
  const mailOptions = {
    from: `"IIEST Guest House" <${process.env.EMAIL_USER}>`,
    to: booking.guestDetails.email,
    subject: `${statusInfo.subject} - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: ${statusInfo.color}; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { background-color: #1A3A5A; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #D4AF37; }
          .label { font-weight: bold; color: #1A3A5A; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IIEST Guest House</h1>
            <h2>${statusInfo.title}</h2>
          </div>
          <div class="content">
            <p>Dear ${booking.guestDetails.name},</p>
            <p>${statusInfo.message}</p>
            
            <div class="info-box">
              <h3>Booking Details</h3>
              <p><span class="label">Booking ID:</span> ${booking.bookingId}</p>
              <p><span class="label">Check In:</span> ${new Date(booking.checkIn).toLocaleDateString('en-IN')}</p>
              <p><span class="label">Check Out:</span> ${new Date(booking.checkOut).toLocaleDateString('en-IN')}</p>
              <p><span class="label">Guests:</span> ${booking.numGuests}</p>
              <p><span class="label">Rooms:</span> ${booking.roomsRequired}</p>
            </div>
            
            ${remarks ? `
            <div class="info-box">
              <h3>Remarks</h3>
              <p>${remarks}</p>
            </div>
            ` : ''}
            
            ${status === 'rejected' ? `
            <div class="info-box" style="background-color: #fff3cd; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404;">💰 Refund Information</h3>
              <p style="color: #856404;">Your caution money of ₹199 will be refunded within 5-7 business days to your original payment method.</p>
              <p style="color: #856404; font-size: 0.9rem;">If you don't receive the refund within this timeframe, please contact us immediately.</p>
            </div>
            ` : ''}
            
            ${status === 'verified' ? `
            <div class="info-box" style="background-color: #e8f4fd; border-left: 4px solid #17a2b8;">
              <h3 style="color: #0c5460;">📋 Next Steps</h3>
              <ul style="color: #0c5460;">
                <li>Your booking is now with the guest house for final confirmation</li>
                <li>You will receive another email once the guest house confirms your booking</li>
                <li>This usually takes 1-2 business days</li>
                <li>Your caution money is secure and will be adjusted in the final bill</li>
              </ul>
            </div>
            ` : ''}
            
            ${status === 'confirmed' ? `
            <div class="info-box" style="background-color: #d4edda; border-left: 4px solid #28a745;">
              <h3 style="color: #155724;">🎯 Check-in Instructions</h3>
              <ul style="color: #155724;">
                <li>Please arrive at the guest house during check-in hours (after 2:00 PM)</li>
                <li>Carry a valid government-issued ID proof for verification</li>
                <li>Your caution money will be adjusted in the final bill</li>
                <li>Contact us if you need to modify your arrival time</li>
              </ul>
            </div>
            ` : ''}
            
            <p>For any queries, please contact us at:</p>
            <ul>
              <li><strong>Phone:</strong> +91 (033) 2668-2223</li>
              <li><strong>Email:</strong> guesthouse@iiests.ac.in</li>
            </ul>
          </div>
          <div class="footer">
            <p>IIEST Guest House - Thank you for choosing us!</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking ${status} email sent successfully to ${booking.guestDetails.email}`);
    return { success: true, message: `${status} email sent successfully` };
  } catch (error) {
    console.error(`Error sending ${status} email:`, error);
    throw new Error(`Failed to send ${status} email`);
  }
};

// Generate verification token (simple implementation for testing)
function generateVerificationToken(bookingId) {
  return Buffer.from(`${bookingId}_${Date.now()}`).toString('base64');
}

export default { 
  sendOTPEmail, 
  sendContactEmail, 
  sendGuestBookingConfirmationEmail,
  sendGuestHouseBookingNotificationEmail,
  sendAuthorityVerificationEmail,
  sendGuestHouseConfirmationEmail,
  sendBookingStatusEmail 
};