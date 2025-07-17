import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Initialize rooms (run once to populate database)
router.get('/initialize', async (req, res) => {
  try {
    // Check if rooms already exist
    const existingRooms = await Room.countDocuments();
    if (existingRooms > 0) {
      return res.status(400).json({ message: 'Rooms already initialized' });
    }
    
    const rooms = [
      // Double Bed AC Rooms
      {
        roomNumber: 'R001',
        title: 'Double Bed AC Room - 001',
        type: 'double-bed-ac',
        isAvailable: true,
        description: 'Comfortable double bed room with air conditioning and attached bathroom.',
        features: [
          { icon: 'fa-bed', name: 'Double Bed' },
          { icon: 'fa-wind', name: 'Air Conditioning' },
          { icon: 'fa-shower', name: 'Attached Bathroom' },
          { icon: 'fa-wifi', name: 'Free WiFi' },
          { icon: 'fa-tv', name: 'Television' }
        ],
        images: [
          'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        ],
        capacity: 2
      },
      {
        roomNumber: 'R002',
        title: 'Double Bed AC Room - 002',
        type: 'double-bed-ac',
        isAvailable: true,
        description: 'Comfortable double bed room with air conditioning and attached bathroom.',
        features: [
          { icon: 'fa-bed', name: 'Double Bed' },
          { icon: 'fa-wind', name: 'Air Conditioning' },
          { icon: 'fa-shower', name: 'Attached Bathroom' },
          { icon: 'fa-wifi', name: 'Free WiFi' },
          { icon: 'fa-tv', name: 'Television' }
        ],
        images: [
          'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        ],
        capacity: 2
      },
      {
        roomNumber: 'R003',
        title: 'Double Bed AC Room - 003',
        type: 'double-bed-ac',
        isAvailable: true,
        description: 'Comfortable double bed room with air conditioning and attached bathroom.',
        features: [
          { icon: 'fa-bed', name: 'Double Bed' },
          { icon: 'fa-wind', name: 'Air Conditioning' },
          { icon: 'fa-shower', name: 'Attached Bathroom' },
          { icon: 'fa-wifi', name: 'Free WiFi' },
          { icon: 'fa-tv', name: 'Television' }
        ],
        images: [
          'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        ],
        capacity: 2
      },
      {
        roomNumber: 'R004',
        title: 'Double Bed AC Room - 004',
        type: 'double-bed-ac',
        isAvailable: true,
        description: 'Comfortable double bed room with air conditioning and attached bathroom.',
        features: [
          { icon: 'fa-bed', name: 'Double Bed' },
          { icon: 'fa-wind', name: 'Air Conditioning' },
          { icon: 'fa-shower', name: 'Attached Bathroom' },
          { icon: 'fa-wifi', name: 'Free WiFi' },
          { icon: 'fa-tv', name: 'Television' }
        ],
        images: [
          'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        ],
        capacity: 2
      },
      // Twin Bed AC Rooms
      {
        roomNumber: 'R005',
        title: 'Twin Bed AC Room - 005',
        type: 'twin-bed-ac',
        isAvailable: true,
        description: 'Room with two separate single beds, air conditioning and attached bathroom.',
        features: [
          { icon: 'fa-bed', name: 'Twin Beds' },
          { icon: 'fa-wind', name: 'Air Conditioning' },
          { icon: 'fa-shower', name: 'Attached Bathroom' },
          { icon: 'fa-wifi', name: 'Free WiFi' },
          { icon: 'fa-tv', name: 'Television' }
        ],
        images: [
          'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        ],
        capacity: 2
      },
      {
        roomNumber: 'R006',
        title: 'Twin Bed AC Room - 006',
        type: 'twin-bed-ac',
        isAvailable: true,
        description: 'Room with two separate single beds, air conditioning and attached bathroom.',
        features: [
          { icon: 'fa-bed', name: 'Twin Beds' },
          { icon: 'fa-wind', name: 'Air Conditioning' },
          { icon: 'fa-shower', name: 'Attached Bathroom' },
          { icon: 'fa-wifi', name: 'Free WiFi' },
          { icon: 'fa-tv', name: 'Television' }
        ],
        images: [
          'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        ],
        capacity: 2
      },
      {
        roomNumber: 'R007',
        title: 'Twin Bed AC Room - 007',
        type: 'twin-bed-ac',
        isAvailable: true,
        description: 'Room with two separate single beds, air conditioning and attached bathroom.',
        features: [
          { icon: 'fa-bed', name: 'Twin Beds' },
          { icon: 'fa-wind', name: 'Air Conditioning' },
          { icon: 'fa-shower', name: 'Attached Bathroom' },
          { icon: 'fa-wifi', name: 'Free WiFi' },
          { icon: 'fa-tv', name: 'Television' }
        ],
        images: [
          'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        ],
        capacity: 2
      },
      {
        roomNumber: 'R008',
        title: 'Twin Bed AC Room - 008',
        type: 'twin-bed-ac',
        isAvailable: true,
        description: 'Room with two separate single beds, air conditioning and attached bathroom.',
        features: [
          { icon: 'fa-bed', name: 'Twin Beds' },
          { icon: 'fa-wind', name: 'Air Conditioning' },
          { icon: 'fa-shower', name: 'Attached Bathroom' },
          { icon: 'fa-wifi', name: 'Free WiFi' },
          { icon: 'fa-tv', name: 'Television' }
        ],
        images: [
          'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
        ],
        capacity: 2
      }
    ];
    
    const createdRooms = await Room.insertMany(rooms);
    res.status(201).json({
      message: 'Rooms initialized successfully',
      rooms: createdRooms
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Get a specific room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check room availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }
    
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const isAvailable = await room.checkAvailability(checkIn, checkOut);
    res.json({ isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;