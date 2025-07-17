import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  numGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  // Guest Details
  guestDetails: {
    name: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    institute: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  // Category and Purpose
  category: {
    type: String,
    required: true,
    enum: [
      'faculty-iiest',
      'faculty-other-institute',
      'research-scholar-iiest',
      'research-scholar-other-institute',
      'student-iiest',
      'student-other-institute',
      'official-guest',
      'parent-guardian',
      'alumni',
      'others'
    ]
  },
  purposeOfVisit: {
    type: String,
    required: true
  },
  // Recommending Authority
  recommendingAuthority: {
    name: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  // Additional Information
  specialRequests: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'verified', 'confirmed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: Date,
  confirmedAt: Date,
  rejectedAt: Date,
  // Remarks
  verificationRemarks: String,
  confirmationRemarks: String,
  rejectionRemarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a unique booking ID
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const prefix = 'GH';
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.bookingId = `${prefix}${year}${randomNum}`;
  }
  next();
});

// Calculate nights and validate dates
bookingSchema.pre('validate', function(next) {
  if (this.checkIn && this.checkOut) {
    // Ensure check-out is after check-in
    if (this.checkOut <= this.checkIn) {
      return next(new Error('Check-out date must be after check-in date'));
    }
    
    // Calculate nights (will be used for rate calculation)
    const nights = Math.floor((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
      return next(new Error('Booking must be for at least one night'));
    }
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;