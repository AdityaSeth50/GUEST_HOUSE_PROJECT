document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginContainer = document.getElementById('login-container');
  const registerContainer = document.getElementById('register-container');
  const bookingsContainer = document.getElementById('bookings-container');
  const bookingsList = document.getElementById('bookings-list');
  const bookingFilter = document.getElementById('booking-filter');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterBtn = document.getElementById('show-register');
  const showLoginBtn = document.getElementById('show-login');
  const bookingDetailsModal = document.getElementById('booking-details-modal');
  const modalBookingDetails = document.getElementById('modal-booking-details');
  const bookingCardTemplate = document.getElementById('booking-card-template');
  const bookingDetailsTemplate = document.getElementById('booking-details-template');
  
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Initialize user state
  if (currentUser) {
    showBookings();
  } else {
    showLogin();
  }
  
  // Show login form
  function showLogin() {
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
    bookingsContainer.style.display = 'none';
  }
  
  // Show register form
  function showRegister() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
    bookingsContainer.style.display = 'none';
  }
  
  // Show bookings
  function showBookings() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'none';
    bookingsContainer.style.display = 'block';
    
    // Load bookings
    loadBookings();
  }
  
  // Load bookings
  function loadBookings(filter = 'all') {
    // Get bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    // Clear bookings list
    bookingsList.innerHTML = '';
    
    // Filter bookings based on status and current user
    const filteredBookings = bookings.filter(booking => {
      // Filter by user email
      if (booking.guestEmail !== currentUser.email) return false;
      
      // Filter by status
      if (filter === 'upcoming') {
        return booking.status === 'confirmed' && new Date(booking.checkIn) > new Date();
      } else if (filter === 'past') {
        return booking.status === 'confirmed' && new Date(booking.checkIn) <= new Date();
      } else if (filter === 'cancelled') {
        return booking.status === 'cancelled';
      }
      
      return true;
    });
    
    if (filteredBookings.length === 0) {
      bookingsList.innerHTML = '<div class="no-bookings">No bookings found.</div>';
      return;
    }
    
    // Sort bookings by check-in date (newest first)
    filteredBookings.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
    
    // Create booking cards
    filteredBookings.forEach(booking => {
      // Clone template
      const bookingCard = document.importNode(bookingCardTemplate.content, true);
      
      // Format dates
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const formattedDates = `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
      
      // Calculate total
      const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const total = nights * booking.room.price;
      
      // Set booking details
      bookingCard.querySelector('.booking-id').textContent = `Booking #${booking.bookingId}`;
      
      const statusEl = bookingCard.querySelector('.booking-status');
      statusEl.textContent = capitalizeFirstLetter(booking.status);
      statusEl.classList.add(`status-${booking.status}`);
      
      bookingCard.querySelector('.room-thumbnail').src = booking.room.images[0];
      bookingCard.querySelector('.room-title').textContent = booking.room.title;
      bookingCard.querySelector('.booking-dates').textContent = formattedDates;
      bookingCard.querySelector('.guests-count').textContent = booking.numGuests;
      bookingCard.querySelector('.booking-amount').textContent = `₹${total}`;
      
      // Set button visibility based on status
      const cancelBtn = bookingCard.querySelector('.cancel-booking-btn');
      if (booking.status === 'cancelled' || new Date(booking.checkIn) <= new Date()) {
        cancelBtn.style.display = 'none';
      }
      
      // Add event listeners
      bookingCard.querySelector('.view-details-btn').addEventListener('click', function() {
        showBookingDetails(booking);
      });
      
      cancelBtn.addEventListener('click', function() {
        cancelBooking(booking.bookingId);
      });
      
      // Append card to list
      bookingsList.appendChild(bookingCard);
    });
  }
  
  // Show booking details in modal
  function showBookingDetails(booking) {
    // Clone template
    const detailsEl = document.importNode(bookingDetailsTemplate.content, true);
    
    // Format dates
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    // Calculate total
    const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const total = nights * booking.room.price;
    
    // Set booking details
    detailsEl.querySelector('.modal-room-title').textContent = booking.room.title;
    detailsEl.querySelector('.modal-booking-id').textContent = `Booking #${booking.bookingId}`;
    
    const statusEl = detailsEl.querySelector('.modal-booking-status');
    statusEl.textContent = capitalizeFirstLetter(booking.status);
    statusEl.classList.add(`status-${booking.status}`);
    
    detailsEl.querySelector('.modal-booking-image img').src = booking.room.images[0];
    detailsEl.querySelector('.check-in-date').textContent = formatDate(checkIn, true);
    detailsEl.querySelector('.check-out-date').textContent = formatDate(checkOut, true);
    detailsEl.querySelector('.guest-count').textContent = booking.numGuests;
    detailsEl.querySelector('.total-amount').textContent = `₹${total}`;
    detailsEl.querySelector('.payment-method').textContent = booking.paymentMethod || 'Online Payment';
    detailsEl.querySelector('.guest-name').textContent = booking.guestName;
    detailsEl.querySelector('.guest-email').textContent = booking.guestEmail;
    detailsEl.querySelector('.guest-phone').textContent = booking.guestPhone;
    
    // Set special requests
    const specialRequests = detailsEl.querySelector('.special-requests');
    if (booking.specialRequests) {
      specialRequests.textContent = booking.specialRequests;
    } else {
      specialRequests.textContent = 'None';
    }
    
    // Set button visibility based on status
    const cancelBtn = detailsEl.querySelector('.cancel-booking-btn');
    if (booking.status === 'cancelled' || new Date(booking.checkIn) <= new Date()) {
      cancelBtn.style.display = 'none';
    }
    
    // Add event listeners
    cancelBtn.addEventListener('click', function() {
      cancelBooking(booking.bookingId);
      bookingDetailsModal.style.display = 'none';
    });
    
    detailsEl.querySelector('.print-booking-btn').addEventListener('click', function() {
      printBookingDetails(booking);
    });
    
    // Clear modal content and append new details
    modalBookingDetails.innerHTML = '';
    modalBookingDetails.appendChild(detailsEl);
    
    // Show modal
    bookingDetailsModal.style.display = 'flex';
  }
  
  // Print booking details
  function printBookingDetails(booking) {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Format dates
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    // Calculate total
    const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const total = nights * booking.room.price;
    
    // Create print content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking #${booking.bookingId} - IIEST Guest House</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #1A3A5A;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 10px;
          }
          .booking-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #1A3A5A;
            margin-bottom: 10px;
          }
          .detail-row {
            display: flex;
            border-bottom: 1px solid #eee;
            padding: 8px 0;
          }
          .detail-label {
            font-weight: bold;
            width: 200px;
          }
          .total {
            font-weight: bold;
            font-size: 1.2em;
            margin-top: 20px;
            text-align: right;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>IIEST Guest House - Booking Confirmation</h1>
        
        <div class="booking-header">
          <div>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Status:</strong> ${capitalizeFirstLetter(booking.status)}</p>
          </div>
          <div>
            <p><strong>Booking Date:</strong> ${formatDate(new Date(booking.bookingDate || new Date()), true)}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Room Details</h2>
          <div class="detail-row">
            <div class="detail-label">Room Type:</div>
            <div>${booking.room.title}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Check In:</div>
            <div>${formatDate(checkIn, true)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Check Out:</div>
            <div>${formatDate(checkOut, true)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Number of Nights:</div>
            <div>${nights}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Number of Guests:</div>
            <div>${booking.numGuests}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Room Rate:</div>
            <div>₹${booking.room.price} per night</div>
          </div>
        </div>
        
        <div class="section">
          <h2>Guest Information</h2>
          <div class="detail-row">
            <div class="detail-label">Name:</div>
            <div>${booking.guestName}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Email:</div>
            <div>${booking.guestEmail}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Phone:</div>
            <div>${booking.guestPhone}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Address:</div>
            <div>${booking.guestAddress}</div>
          </div>
        </div>
        
        <div class="section">
          <h2>Payment Information</h2>
          <div class="detail-row">
            <div class="detail-label">Payment Method:</div>
            <div>${booking.paymentMethod || 'Online Payment'}</div>
          </div>
          <div class="total">
            Total Amount: ₹${total}
          </div>
        </div>
        
        <div class="section">
          <h2>Special Requests</h2>
          <p>${booking.specialRequests || 'None'}</p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing IIEST Guest House!</p>
          <p>For any queries, please contact us at guesthouse@iiest.ac.in or call +91 (033) 2668-4561</p>
          <p>IIEST Campus, Shibpur, Howrah, West Bengal, India</p>
        </div>
      </body>
      </html>
    `;
    
    // Write content to new window
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Print after content is loaded
    printWindow.onload = function() {
      printWindow.print();
    };
  }
  
  // Cancel booking
  function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    // Get bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    // Find booking index
    const bookingIndex = bookings.findIndex(booking => booking.bookingId === bookingId);
    
    if (bookingIndex === -1) {
      alert('Booking not found');
      return;
    }
    
    // Update booking status
    bookings[bookingIndex].status = 'cancelled';
    
    // Save updated bookings
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Reload bookings
    loadBookings(bookingFilter.value);
    
    // Show success message
    alert('Booking cancelled successfully');
  }
  
  // Format date
  function formatDate(date, includeDay = false) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    if (includeDay) {
      options.weekday = 'short';
    }
    
    return date.toLocaleDateString('en-US', options);
  }
  
  // Capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Event listeners
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showRegister();
    });
  }
  
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showLogin();
    });
  }
  
  // Close modal
  const closeModal = document.querySelector('.close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      bookingDetailsModal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === bookingDetailsModal) {
      bookingDetailsModal.style.display = 'none';
    }
  });
  
  // Filter bookings
  if (bookingFilter) {
    bookingFilter.addEventListener('change', function() {
      loadBookings(this.value);
    });
  }
  
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find user
      const user = users.find(user => user.email === email && user.password === password);
      
      if (!user) {
        alert('Invalid email or password');
        return;
      }
      
      // Set current user
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Show bookings
      showBookings();
    });
  }
  
  // Register form submission
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const phone = document.getElementById('register-phone').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Validate passwords
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if user already exists
      if (users.some(user => user.email === email)) {
        alert('Email already registered');
        return;
      }
      
      // Create new user
      const newUser = {
        name,
        email,
        phone,
        password
      };
      
      // Add user to users array
      users.push(newUser);
      
      // Save users to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Show bookings
      showBookings();
    });
  }
});