document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const roomSummary = document.getElementById('room-summary');
  const roomSummaryTemplate = document.getElementById('room-summary-template');
  const checkInInput = document.getElementById('check-in');
  const checkOutInput = document.getElementById('check-out');
  const categorySelect = document.getElementById('category');
  const recommendingAuthorityInfo = document.getElementById('recommending-authority-info');
  const bookingForm = document.getElementById('booking-form');
  const successModal = document.getElementById('success-modal');
  const bookingIdSpan = document.getElementById('booking-id');
  
  // Get room ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('id');
  
  if (!roomId) {
    window.location.href = 'rooms.html';
    return;
  }
  
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
  
  // Category-wise recommending authority information
  const recommendingAuthorities = {
    'faculty-iiest': {
      title: 'Faculty (IIEST)',
      authority: 'Head of Department or Dean',
      description: 'For IIEST faculty members, the recommending authority should be the Head of Department or Dean of the respective school.'
    },
    'faculty-other-institute': {
      title: 'Faculty (Other Institute)',
      authority: 'IIEST Faculty Member or Head of Department',
      description: 'For faculty from other institutes, an IIEST faculty member or Head of Department should recommend.'
    },
    'research-scholar-iiest': {
      title: 'Research Scholar (IIEST)',
      authority: 'Supervisor or Head of Department',
      description: 'For IIEST research scholars, the supervisor or Head of Department should recommend.'
    },
    'research-scholar-other-institute': {
      title: 'Research Scholar (Other Institute)',
      authority: 'IIEST Faculty Member',
      description: 'For research scholars from other institutes, an IIEST faculty member should recommend.'
    },
    'student-iiest': {
      title: 'Student (IIEST)',
      authority: 'Head of Department or Faculty Advisor',
      description: 'For IIEST students, the Head of Department or Faculty Advisor should recommend.'
    },
    'student-other-institute': {
      title: 'Student (Other Institute)',
      authority: 'IIEST Faculty Member',
      description: 'For students from other institutes, an IIEST faculty member should recommend.'
    },
    'official-guest': {
      title: 'Official Guest',
      authority: 'Registrar or Director',
      description: 'For official guests, the Registrar or Director should recommend.'
    },
    'parent-guardian': {
      title: 'Parent/Guardian',
      authority: 'Head of Department (of student/faculty)',
      description: 'For parents/guardians, the Head of Department of the concerned student/faculty should recommend.'
    },
    'alumni': {
      title: 'Alumni',
      authority: 'Head of Department or Alumni Office',
      description: 'For alumni, the Head of Department or Alumni Office should recommend.'
    },
    'others': {
      title: 'Others',
      authority: 'Appropriate IIEST Authority',
      description: 'For other categories, an appropriate IIEST authority should recommend based on the purpose of visit.'
    }
  };
  
  // Find selected room
  const selectedRoom = rooms.find(room => room.id === parseInt(roomId));
  
  if (!selectedRoom) {
    window.location.href = 'rooms.html';
    return;
  }
  
  // Set min dates for check-in and check-out
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  checkInInput.min = formatDate(today);
  checkOutInput.min = formatDate(tomorrow);
  
  // Load room summary
  function loadRoomSummary() {
    // Clear container
    roomSummary.innerHTML = '';
    
    // Clone template
    const summaryEl = document.importNode(roomSummaryTemplate.content, true);
    
    // Set room details
    summaryEl.querySelector('.summary-image img').src = selectedRoom.images[0];
    summaryEl.querySelector('.summary-image img').alt = selectedRoom.title;
    summaryEl.querySelector('.summary-title').textContent = selectedRoom.title;
    summaryEl.querySelector('.summary-description').textContent = selectedRoom.description;
    summaryEl.querySelector('.summary-capacity').textContent = `Capacity: ${selectedRoom.capacity} guests`;
    
    // Set room features
    const featuresContainer = summaryEl.querySelector('.summary-features');
    selectedRoom.features.forEach(feature => {
      const featureEl = document.createElement('div');
      featureEl.className = 'summary-feature';
      featureEl.innerHTML = `<i class="fas ${feature.icon}"></i> ${feature.name}`;
      featuresContainer.appendChild(featureEl);
    });
    
    // Update booking summary
    document.getElementById('summary-room-type').textContent = selectedRoom.title;
    
    // Append to container
    roomSummary.appendChild(summaryEl);
  }
  
  // Update booking summary
  function updateBookingSummary() {
    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);
    const numGuests = document.getElementById('num-guests').value;
    
    // Check if dates are valid
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      document.getElementById('summary-check-in').textContent = '-';
      document.getElementById('summary-check-out').textContent = '-';
      document.getElementById('summary-nights').textContent = '-';
      return;
    }
    
    // Calculate number of nights
    const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      alert('Check-out date must be after check-in date');
      checkOutInput.value = '';
      return;
    }
    
    // Format dates for display
    const formatDisplayDate = date => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    // Update summary
    document.getElementById('summary-check-in').textContent = formatDisplayDate(checkIn);
    document.getElementById('summary-check-out').textContent = formatDisplayDate(checkOut);
    document.getElementById('summary-nights').textContent = nights;
    document.getElementById('summary-guests').textContent = numGuests || '-';
  }
  
  // Update recommending authority info
  function updateRecommendingAuthorityInfo() {
    const category = categorySelect.value;
    
    if (!category) {
      recommendingAuthorityInfo.innerHTML = '<p class="info-note">Please select a category to see the recommending authority details.</p>';
      return;
    }
    
    const authInfo = recommendingAuthorities[category];
    
    recommendingAuthorityInfo.innerHTML = `
      <div class="authority-info">
        <h4>${authInfo.title}</h4>
        <p><strong>Recommending Authority:</strong> ${authInfo.authority}</p>
        <p class="description">${authInfo.description}</p>
      </div>
    `;
  }
  
  // Handle booking form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Check if dates are selected
      if (!checkInInput.value || !checkOutInput.value) {
        alert('Please select check-in and check-out dates');
        return;
      }
      
      // Get form data
      const formData = {
        roomId: selectedRoom.id,
        checkIn: checkInInput.value,
        checkOut: checkOutInput.value,
        numGuests: parseInt(document.getElementById('num-guests').value),
        guestDetails: {
          name: document.getElementById('guest-name').value,
          designation: document.getElementById('guest-designation').value,
          department: document.getElementById('guest-department').value,
          institute: document.getElementById('guest-institute').value,
          email: document.getElementById('guest-email').value,
          phone: document.getElementById('guest-phone').value,
          address: document.getElementById('guest-address').value
        },
        category: document.getElementById('category').value,
        purposeOfVisit: document.getElementById('purpose-of-visit').value,
        recommendingAuthority: {
          name: document.getElementById('auth-name').value,
          designation: document.getElementById('auth-designation').value,
          department: document.getElementById('auth-department').value,
          email: document.getElementById('auth-email').value,
          phone: document.getElementById('auth-phone').value
        },
        specialRequests: document.getElementById('special-requests').value,
        emergencyContact: {
          name: document.getElementById('emergency-name').value,
          phone: document.getElementById('emergency-phone').value,
          relation: document.getElementById('emergency-relation').value
        }
      };
      
      try {
        // Show loading state
        const submitBtn = document.querySelector('.confirm-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Submit booking request
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          // Show success modal
          bookingIdSpan.textContent = result.booking.bookingId;
          successModal.style.display = 'flex';
        } else {
          alert(result.message || 'Failed to submit booking request');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
      } catch (error) {
        console.error('Error submitting booking:', error);
        alert('Failed to submit booking request. Please try again.');
        
        // Reset button
        const submitBtn = document.querySelector('.confirm-btn');
        submitBtn.textContent = 'Submit Booking Request';
        submitBtn.disabled = false;
      }
    });
  }
  
  // Event listeners
  if (checkInInput) {
    checkInInput.addEventListener('change', function() {
      // Set min check-out date to day after check-in
      const checkInDate = new Date(this.value);
      const minCheckOutDate = new Date(checkInDate);
      minCheckOutDate.setDate(minCheckOutDate.getDate() + 1);
      
      checkOutInput.min = formatDate(minCheckOutDate);
      
      // Clear check-out date if it's before new min date
      const checkOutDate = new Date(checkOutInput.value);
      if (checkOutDate < minCheckOutDate) {
        checkOutInput.value = '';
      }
      
      updateBookingSummary();
    });
  }
  
  if (checkOutInput) {
    checkOutInput.addEventListener('change', updateBookingSummary);
  }
  
  if (categorySelect) {
    categorySelect.addEventListener('change', updateRecommendingAuthorityInfo);
  }
  
  if (document.getElementById('num-guests')) {
    document.getElementById('num-guests').addEventListener('change', updateBookingSummary);
  }
  
  // Modal event listeners
  if (document.getElementById('back-to-home')) {
    document.getElementById('back-to-home').addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  if (document.getElementById('view-status')) {
    document.getElementById('view-status').addEventListener('click', function() {
      const bookingId = bookingIdSpan.textContent;
      window.location.href = `booking-status.html?id=${bookingId}`;
    });
  }
  
  // Initialize page
  loadRoomSummary();
  updateBookingSummary();
  updateRecommendingAuthorityInfo();
});