import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['double-bed-ac', 'twin-bed-ac']
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    icon: String,
    name: String
  }],
  images: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    default: 2
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a method to check room availability for specific dates
roomSchema.methods.checkAvailability = async function(checkIn, checkOut) {
  const Booking = mongoose.model('Booking');
  
  // Convert string dates to Date objects
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Find bookings for this room that overlap with the requested dates
  const overlappingBookings = await Booking.find({
    room: this._id,
    status: { $in: ['pending', 'verified', 'confirmed'] },
    $or: [
      // Booking check-in date falls within requested period
      { checkIn: { $gte: checkInDate, $lt: checkOutDate } },
      // Booking check-out date falls within requested period
      { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
      // Booking encompasses the entire requested period
      { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } }
    ]
  });
  
  // Return true if no overlapping bookings found
  return overlappingBookings.length === 0;
};

// Static method to get available rooms count for a room type and date range
roomSchema.statics.getAvailableRoomsCount = async function(roomType, checkIn, checkOut) {
  const Booking = mongoose.model('Booking');
  
  // Convert string dates to Date objects
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Get all rooms of the requested type
  const allRooms = await this.find({ 
    type: roomType,
    isAvailable: true 
  });
  
  // Find all bookings that overlap with the requested dates for this room type
  const overlappingBookings = await Booking.find({
    room: { $in: allRooms.map(room => room._id) },
    status: { $in: ['pending', 'verified', 'confirmed'] },
    $or: [
      // Booking check-in date falls within requested period
      { checkIn: { $gte: checkInDate, $lt: checkOutDate } },
      // Booking check-out date falls within requested period
      { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
      // Booking encompasses the entire requested period
      { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } }
    ]
  }).populate('room');
  
  // Count total rooms required by overlapping bookings
  const totalRoomsBooked = overlappingBookings.reduce((total, booking) => {
    return total + booking.roomsRequired;
  }, 0);
  
  // Calculate available rooms
  const totalRooms = allRooms.length;
  const availableRooms = Math.max(0, totalRooms - totalRoomsBooked);
  
  return {
    totalRooms,
    bookedRooms: totalRoomsBooked,
    availableRooms
  };
};

const Room = mongoose.model('Room', roomSchema);

export default Room;