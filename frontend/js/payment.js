document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const bookingDetails = document.getElementById('booking-details');
  const totalAmount = document.getElementById('total-amount');
  const backToBookingBtn = document.getElementById('back-to-booking');
  const makePaymentBtn = document.getElementById('make-payment');
  const successModal = document.getElementById('success-modal');
  const viewBookingBtn = document.getElementById('view-booking');
  const backToHomeBtn = document.getElementById('back-to-home');
  const bookingId = document.getElementById('booking-id');
  
  // Payment method selection
  const creditCardRadio = document.getElementById('credit-card');
  const upiRadio = document.getElementById('upi');
  const netbankingRadio = document.getElementById('netbanking');
  const creditCardForm = document.getElementById('credit-card-form');
  const upiForm = document.getElementById('upi-form');
  const netbankingForm = document.getElementById('netbanking-form');
  
  // Get booking data from session storage
  const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
  
  if (!bookingData) {
    window.location.href = 'rooms.html';
    return;
  }
  
  // Load booking details
  function loadBookingDetails() {
    // Check if dates are valid
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      window.location.href = 'rooms.html';
      return;
    }
    
    // Calculate number of nights
    const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Calculate total
    const total = nights * bookingData.room.price;
    
    // Format dates for display
    const formatDisplayDate = date => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    // Create booking details HTML
    bookingDetails.innerHTML = `
      <div class="booking-room">
        <div class="booking-room-image">
          <img src="${bookingData.room.images[0]}" alt="${bookingData.room.title}">
        </div>
        <div class="booking-room-details">
          <h3>${bookingData.room.title}</h3>
          <p class="booking-room-price">₹${bookingData.room.price} / night</p>
          <p class="booking-room-dates">${formatDisplayDate(checkIn)} - ${formatDisplayDate(checkOut)}</p>
        </div>
      </div>
      <div class="booking-detail-list">
        <div class="booking-detail">
          <span class="booking-detail-label">Guest Name:</span>
          <span class="booking-detail-value">${bookingData.guestName}</span>
        </div>
        <div class="booking-detail">
          <span class="booking-detail-label">Number of Guests:</span>
          <span class="booking-detail-value">${bookingData.numGuests}</span>
        </div>
        <div class="booking-detail">
          <span class="booking-detail-label">Check In:</span>
          <span class="booking-detail-value">${formatDisplayDate(checkIn)}</span>
        </div>
        <div class="booking-detail">
          <span class="booking-detail-label">Check Out:</span>
          <span class="booking-detail-value">${formatDisplayDate(checkOut)}</span>
        </div>
        <div class="booking-detail">
          <span class="booking-detail-label">Nights:</span>
          <span class="booking-detail-value">${nights}</span>
        </div>
        <div class="booking-detail">
          <span class="booking-detail-label">Room Price:</span>
          <span class="booking-detail-value">₹${bookingData.room.price} / night</span>
        </div>
      </div>
      <div class="booking-total">
        <span class="booking-total-label">Total Amount:</span>
        <span class="booking-total-value">₹${total}</span>
      </div>
    `;
    
    // Set total amount
    totalAmount.textContent = `₹${total}`;
  }
  
  // Toggle payment methods
  function togglePaymentMethod() {
    if (creditCardRadio.checked) {
      creditCardForm.style.display = 'block';
      upiForm.style.display = 'none';
      netbankingForm.style.display = 'none';
    } else if (upiRadio.checked) {
      creditCardForm.style.display = 'none';
      upiForm.style.display = 'block';
      netbankingForm.style.display = 'none';
    } else if (netbankingRadio.checked) {
      creditCardForm.style.display = 'none';
      upiForm.style.display = 'none';
      netbankingForm.style.display = 'block';
    }
  }
  
  // Process payment
  function processPayment() {
    // Get selected payment method
    let paymentMethod;
    
    if (creditCardRadio.checked) {
      paymentMethod = 'Credit/Debit Card';
      
      // Validate card details
      const cardNumber = document.getElementById('card-number').value;
      const expiryDate = document.getElementById('expiry-date').value;
      const cvv = document.getElementById('cvv').value;
      const cardName = document.getElementById('card-name').value;
      
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        alert('Please fill in all card details');
        return;
      }
      
      // Basic validation
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid 16-digit card number');
        return;
      }
      
      if (!/^\d{3}$/.test(cvv)) {
        alert('Please enter a valid 3-digit CVV');
        return;
      }
    } else if (upiRadio.checked) {
      paymentMethod = 'UPI';
      
      // Validate UPI ID
      const upiId = document.getElementById('upi-id').value;
      
      if (!upiId) {
        alert('Please enter your UPI ID');
        return;
      }
      
      // Basic validation
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        alert('Please enter a valid UPI ID');
        return;
      }
    } else if (netbankingRadio.checked) {
      paymentMethod = 'Net Banking';
      
      // Validate bank selection
      const bankSelect = document.getElementById('bank-select').value;
      
      if (!bankSelect) {
        alert('Please select your bank');
        return;
      }
    }
    
    // Show loading state
    makePaymentBtn.textContent = 'Processing...';
    makePaymentBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
      // Create a booking ID
      const generatedBookingId = 'GH' + Math.floor(100000 + Math.random() * 900000);
      bookingId.textContent = generatedBookingId;
      
      // Save booking to localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      
      const newBooking = {
        ...bookingData,
        bookingId: generatedBookingId,
        paymentMethod,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
      };
      
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      // Clear session storage
      sessionStorage.removeItem('bookingData');
      
      // Show success modal
      successModal.style.display = 'flex';
    }, 2000);
  }
  
  // Event listeners
  if (backToBookingBtn) {
    backToBookingBtn.addEventListener('click', function() {
      window.history.back();
    });
  }
  
  if (makePaymentBtn) {
    makePaymentBtn.addEventListener('click', processPayment);
  }
  
  if (viewBookingBtn) {
    viewBookingBtn.addEventListener('click', function() {
      window.location.href = 'my-bookings.html';
    });
  }
  
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  // Payment method toggle events
  if (creditCardRadio) {
    creditCardRadio.addEventListener('change', togglePaymentMethod);
  }
  
  if (upiRadio) {
    upiRadio.addEventListener('change', togglePaymentMethod);
  }
  
  if (netbankingRadio) {
    netbankingRadio.addEventListener('change', togglePaymentMethod);
  }
  
  // Credit card input formatting
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      // Remove non-digits
      let value = e.target.value.replace(/\D/g, '');
      
      // Add spaces after every 4 digits
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      
      // Update input value
      e.target.value = value;
    });
  }
  
  const expiryDateInput = document.getElementById('expiry-date');
  if (expiryDateInput) {
    expiryDateInput.addEventListener('input', function(e) {
      // Remove non-digits
      let value = e.target.value.replace(/\D/g, '');
      
      // Add slash after 2 digits (MM/YY)
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      
      // Update input value
      e.target.value = value;
    });
  }
  
  // Initialize page
  loadBookingDetails();
  togglePaymentMethod();
});