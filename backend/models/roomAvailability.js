const mongoose = require('mongoose');

const roomAvailabilitySchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalRooms: {
    type: Number,
    required: true,
    default: 4
  },
  bookedRooms: {
    type: Number,
    default: 0
  },
  availableRooms: {
    type: Number,
    default: 4
  },
  bookings: [{
    bookingId: String,
    status: {
      type: String,
      enum: ['pending', 'verified', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  }]
}, {
  indexes: [
    { roomType: 1, date: 1 }
  ]
});

// Calculate available rooms before saving
roomAvailabilitySchema.pre('save', function(next) {
  const confirmedBookings = this.bookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'verified'
  ).length;
  
  this.bookedRooms = confirmedBookings;
  this.availableRooms = this.totalRooms - confirmedBookings;
  next();
});

module.exports = mongoose.model('RoomAvailability', roomAvailabilitySchema);