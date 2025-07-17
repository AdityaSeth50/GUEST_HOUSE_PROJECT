document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const roomsContainer = document.getElementById('rooms-container');
  const roomTemplate = document.getElementById('room-card-template');
  const applyFiltersBtn = document.getElementById('apply-filters');
  
  // Room types for display (only 2 cards)
  const roomTypes = [
    {
      id: 'double-bed-ac',
      title: 'Double Bed AC Room',
      type: 'double-bed-ac',
      description: 'Comfortable double bed room with air conditioning and attached bathroom. Basic amenities included like sofa, telivision, etc.',
      tariff: 1400, // Per night in INR
      features: [
        { icon: 'fa-bed', name: 'Double Bed' },
        { icon: 'fa-wind', name: 'Air Conditioning' },
        { icon: 'fa-shower', name: 'Attached Bathroom' },
        { icon: 'fa-wifi', name: 'Free WiFi' },
        { icon: 'fa-tv', name: 'Television' },
        { icon: 'fa-couch', name: 'Sofa' }
      ],
      images: [
        'images/dbr1-1.jpg',
        'images/dbr1-3.jpg'
      ],
      capacity: 2,
      totalRooms: 4 // Total rooms of this type
    },
    {
      id: 'twin-bed-ac',
      title: 'Twin Bed AC Room',
      type: 'twin-bed-ac',
      description: 'Room with two separate single beds, air conditioning and attached bathroom. Ideal for friends or colleagues traveling together.',
      tariff: 1400,
      features: [
        { icon: 'fa-bed', name: 'Twin Beds' },
        { icon: 'fa-wind', name: 'Air Conditioning' },
        { icon: 'fa-shower', name: 'Attached Bathroom' },
        { icon: 'fa-wifi', name: 'Free WiFi' },
        { icon: 'fa-tv', name: 'Television' },
        { icon: 'fa-couch', name: 'Sofa' }
      ],
      images: [
        'images/dsb1.jpg',
        'images/dsbr1-3.jpg'
      ],
      capacity: 2,
      totalRooms: 4 // Total rooms of this type
    }
  ];
  
  // Load room types without availability (since availability depends on dates)
  function loadRooms(filteredRooms = roomTypes) {
    // Clear container
    roomsContainer.innerHTML = '';
    
    if (filteredRooms.length === 0) {
      roomsContainer.innerHTML = '<div class="no-rooms-message">No rooms match your search criteria. Please try different filters.</div>';
      return;
    }
    
    // Create room cards
    filteredRooms.forEach(room => {
      const roomCard = createRoomCard(room);
      roomsContainer.appendChild(roomCard);
    });
  }
  
  // Create room card element (simplified - no availability check)
  function createRoomCard(room) {
    // Clone template
    const roomCard = document.importNode(roomTemplate.content, true);
    
    // Set room details
    roomCard.querySelector('.room-title').textContent = room.title;
    roomCard.querySelector('.tariff-amount').textContent = room.tariff;
    roomCard.querySelector('.room-capacity span').textContent = room.capacity;
    roomCard.querySelector('.room-description').textContent = room.description;
    
    // Remove availability display (since it's meaningless without dates)
    const availabilityElement = roomCard.querySelector('.room-availability');
    availabilityElement.innerHTML = `<i class="fas fa-info-circle"></i> ${room.totalRooms} rooms of this type available`;
    availabilityElement.style.color = 'var(--primary-color)';
    
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
    
    // Set book button link - ALWAYS CLICKABLE
    const bookButton = roomCard.querySelector('.book-room-btn');
    bookButton.href = `booking.html?type=${room.type}`;
    bookButton.textContent = 'Check Availability & Book';
    bookButton.style.backgroundColor = 'var(--primary-color)';
    bookButton.style.cursor = 'pointer';
    
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
    
    return roomCard;
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
    
    let filteredRooms = roomTypes.filter(room => {
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