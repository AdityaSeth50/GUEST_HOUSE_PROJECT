document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const roomsContainer = document.getElementById('rooms-container');
  const roomTemplate = document.getElementById('room-card-template');
  const applyFiltersBtn = document.getElementById('apply-filters');
  
  // Room data (updated for 8 rooms)
  const rooms = [
    {
      id: 1,
      roomNumber: 'R001',
      title: 'Double Bed AC Room - 001',
      type: 'double-bed-ac',
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
      id: 2,
      roomNumber: 'R002',
      title: 'Double Bed AC Room - 002',
      type: 'double-bed-ac',
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
      id: 3,
      roomNumber: 'R003',
      title: 'Double Bed AC Room - 003',
      type: 'double-bed-ac',
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
      id: 4,
      roomNumber: 'R004',
      title: 'Double Bed AC Room - 004',
      type: 'double-bed-ac',
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
      id: 5,
      roomNumber: 'R005',
      title: 'Twin Bed AC Room - 005',
      type: 'twin-bed-ac',
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
      id: 6,
      roomNumber: 'R006',
      title: 'Twin Bed AC Room - 006',
      type: 'twin-bed-ac',
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
      id: 7,
      roomNumber: 'R007',
      title: 'Twin Bed AC Room - 007',
      type: 'twin-bed-ac',
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
      id: 8,
      roomNumber: 'R008',
      title: 'Twin Bed AC Room - 008',
      type: 'twin-bed-ac',
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
  
  // Load rooms
  function loadRooms(filteredRooms = rooms) {
    // Clear container
    roomsContainer.innerHTML = '';
    
    if (filteredRooms.length === 0) {
      roomsContainer.innerHTML = '<div class="no-rooms-message">No rooms match your search criteria. Please try different filters.</div>';
      return;
    }
    
    // Create room cards
    filteredRooms.forEach(room => {
      // Clone template
      const roomCard = document.importNode(roomTemplate.content, true);
      
      // Set room details
      roomCard.querySelector('.room-title').textContent = room.title;
      roomCard.querySelector('.room-capacity span').textContent = room.capacity;
      roomCard.querySelector('.room-description').textContent = room.description;
      
      // Set room images
      const roomImages = roomCard.querySelector('.room-images');
      room.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${room.title} - Image ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
        roomImages.appendChild(img);
      });
      
      // Set room features
      const featuresContainer = roomCard.querySelector('.room-features');
      room.features.forEach(feature => {
        const featureEl = document.createElement('div');
        featureEl.className = 'room-feature';
        featureEl.innerHTML = `<i class="fas ${feature.icon}"></i> ${feature.name}`;
        featuresContainer.appendChild(featureEl);
      });
      
      // Set book button link
      roomCard.querySelector('.book-room-btn').href = `booking.html?id=${room.id}`;
      
      // Add image navigation
      const prevButton = roomCard.querySelector('.prev-image');
      const nextButton = roomCard.querySelector('.next-image');
      
      prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        navigateImages(this.closest('.room-card'), 'prev');
      });
      
      nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        navigateImages(this.closest('.room-card'), 'next');
      });
      
      // Append card to container
      roomsContainer.appendChild(roomCard);
    });
  }
  
  // Navigate room images
  function navigateImages(roomCard, direction) {
    const images = roomCard.querySelectorAll('.room-images img');
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    
    // Remove active class from current image
    images[activeIndex].classList.remove('active');
    
    // Calculate new active index
    if (direction === 'next') {
      activeIndex = (activeIndex + 1) % images.length;
    } else {
      activeIndex = (activeIndex - 1 + images.length) % images.length;
    }
    
    // Add active class to new image
    images[activeIndex].classList.add('active');
  }
  
  // Filter rooms
  function filterRooms() {
    const roomType = document.getElementById('room-type').value;
    const capacity = document.getElementById('capacity').value;
    
    let filteredRooms = rooms.filter(room => {
      // Filter by room type
      if (roomType !== 'all' && room.type !== roomType) return false;
      
      // Filter by capacity
      if (capacity !== 'all' && room.capacity !== parseInt(capacity)) return false;
      
      return true;
    });
    
    // Load filtered rooms
    loadRooms(filteredRooms);
  }
  
  // Event listeners
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', filterRooms);
  }
  
  // Initialize page
  loadRooms();
});