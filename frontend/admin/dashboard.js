// Admin Dashboard JavaScript
let currentBookings = [];
let filteredBookings = [];
let currentPage = 1;
let bookingsPerPage = 10;
let bookingToDelete = null;

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  checkAuthentication();
  
  // Load initial data
  loadDashboardData();
  
  // Setup event listeners
  setupEventListeners();
});

async function checkAuthentication() {
  try {
    const response = await fetch('/api/admin/verify', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      // Not authenticated, redirect to login
      window.location.href = 'login.html';
      return;
    }
    
    const data = await response.json();
    console.log('Admin authenticated:', data.admin);
    
  } catch (error) {
    console.error('Authentication check failed:', error);
    window.location.href = 'login.html';
  }
}

function setupEventListeners() {
  // Close modals when clicking outside
  window.addEventListener('click', function(e) {
    const bookingModal = document.getElementById('booking-modal');
    const deleteModal = document.getElementById('delete-modal');
    
    if (e.target === bookingModal) {
      closeModal();
    }
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
      closeDeleteModal();
    }
  });
}

async function loadDashboardData() {
  try {
    // Load statistics
    await loadStatistics();
    
    // Load recent bookings
    await loadBookings();
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showNotification('error', 'Error', 'Failed to load dashboard data');
  }
}

async function loadStatistics() {
  try {
    const response = await fetch('/api/admin/bookings/stats', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const stats = await response.json();
      
      document.getElementById('pending-count').textContent = stats.pending || 0;
      document.getElementById('verified-count').textContent = stats.verified || 0;
      document.getElementById('confirmed-count').textContent = stats.confirmed || 0;
      document.getElementById('rejected-count').textContent = stats.rejected || 0;
    } else {
      throw new Error('Failed to load statistics');
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
    // Set default values
    document.getElementById('pending-count').textContent = '0';
    document.getElementById('verified-count').textContent = '0';
    document.getElementById('confirmed-count').textContent = '0';
    document.getElementById('rejected-count').textContent = '0';
  }
}

async function loadBookings() {
  try {
    const response = await fetch('/api/admin/bookings', {
      credentials: 'include'
    });
    
    if (response.ok) {
      currentBookings = await response.json();
      filteredBookings = [...currentBookings];
      displayBookings();
    } else {
      throw new Error('Failed to load bookings');
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
    document.getElementById('bookings-container').innerHTML = `
      <div class="no-bookings">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load bookings. Please try again.</p>
        <button class="btn-sm btn-view" onclick="loadBookings()">Retry</button>
      </div>
    `;
  }
}

function displayBookings() {
  const container = document.getElementById('bookings-container');
  
  if (filteredBookings.length === 0) {
    container.innerHTML = `
      <div class="no-bookings">
        <i class="fas fa-inbox"></i>
        <p>No bookings found matching your criteria.</p>
      </div>
    `;
    document.getElementById('pagination').style.display = 'none';
    return;
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const endIndex = startIndex + bookingsPerPage;
  const pageBookings = filteredBookings.slice(startIndex, endIndex);
  
  // Generate table HTML
  const tableHTML = `
    <table class="bookings-table">
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>Guest Name</th>
          <th>Email</th>
          <th>Check-in</th>
          <th>Check-out</th>
          <th>Status</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${pageBookings.map(booking => `
          <tr>
            <td><strong>${booking.bookingId}</strong></td>
            <td>${booking.guestDetails.name}</td>
            <td>${booking.guestDetails.email}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td><span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span></td>
            <td>${getCategoryText(booking.category)}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-sm btn-view" onclick="viewBooking('${booking._id}')" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
                ${booking.status === 'verified' ? `
                  <button class="btn-sm btn-approve" onclick="updateBookingStatus('${booking._id}', 'confirmed')" title="Confirm Booking">
                    <i class="fas fa-check"></i>
                  </button>
                  <button class="btn-sm btn-reject" onclick="updateBookingStatus('${booking._id}', 'rejected')" title="Reject Booking">
                    <i class="fas fa-times"></i>
                  </button>
                ` : ''}
                <button class="btn-sm btn-delete" onclick="deleteBooking('${booking._id}')" title="Delete Booking">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  container.innerHTML = tableHTML;
  
  // Update pagination
  updatePagination(totalPages);
}

function updatePagination(totalPages) {
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    pagination.style.display = 'none';
    return;
  }
  
  pagination.style.display = 'flex';
  
  let paginationHTML = '';
  
  // Previous button
  paginationHTML += `
    <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fas fa-chevron-left"></i> Previous
    </button>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage || i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      paginationHTML += `
        <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += '<span>...</span>';
    }
  }
  
  // Next button
  paginationHTML += `
    <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
      Next <i class="fas fa-chevron-right"></i>
    </button>
  `;
  
  pagination.innerHTML = paginationHTML;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    displayBookings();
  }
}

function applyFilters() {
  const statusFilter = document.getElementById('status-filter').value;
  const categoryFilter = document.getElementById('category-filter').value;
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  
  filteredBookings = currentBookings.filter(booking => {
    // Status filter
    if (statusFilter && booking.status !== statusFilter) {
      return false;
    }
    
    // Category filter
    if (categoryFilter && booking.category !== categoryFilter) {
      return false;
    }
    
    // Search filter
    if (searchInput) {
      const searchFields = [
        booking.bookingId.toLowerCase(),
        booking.guestDetails.name.toLowerCase(),
        booking.guestDetails.email.toLowerCase()
      ];
      
      if (!searchFields.some(field => field.includes(searchInput))) {
        return false;
      }
    }
    
    return true;
  });
  
  currentPage = 1; // Reset to first page
  displayBookings();
}

async function viewBooking(bookingId) {
  try {
    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      const booking = await response.json();
      displayBookingDetails(booking);
    } else {
      throw new Error('Failed to load booking details');
    }
  } catch (error) {
    console.error('Error loading booking details:', error);
    showNotification('error', 'Error', 'Failed to load booking details');
  }
}

function displayBookingDetails(booking) {
  const modal = document.getElementById('booking-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  modalTitle.textContent = `Booking Details - ${booking.bookingId}`;
  
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  modalBody.innerHTML = `
    <div class="detail-grid">
      <div class="detail-section">
        <h4>Booking Information</h4>
        <div class="detail-item">
          <span class="detail-label">Booking ID:</span>
          <span class="detail-value">${booking.bookingId}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span class="detail-value">
            <span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span>
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Submitted:</span>
          <span class="detail-value">${formatDateTime(booking.submittedAt)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Category:</span>
          <span class="detail-value">${getCategoryText(booking.category)}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <h4>Guest Details</h4>
        <div class="detail-item">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${booking.guestDetails.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${booking.guestDetails.email}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${booking.guestDetails.phone}</span>
        </div>
        ${booking.guestDetails.designation ? `
        <div class="detail-item">
          <span class="detail-label">Designation:</span>
          <span class="detail-value">${booking.guestDetails.designation}</span>
        </div>
        ` : ''}
        ${booking.guestDetails.department ? `
        <div class="detail-item">
          <span class="detail-label">Department:</span>
          <span class="detail-value">${booking.guestDetails.department}</span>
        </div>
        ` : ''}
        ${booking.guestDetails.institute ? `
        <div class="detail-item">
          <span class="detail-label">Institute:</span>
          <span class="detail-value">${booking.guestDetails.institute}</span>
        </div>
        ` : ''}
        <div class="detail-item">
          <span class="detail-label">Address:</span>
          <span class="detail-value">${booking.guestDetails.address}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <h4>Stay Details</h4>
        <div class="detail-item">
          <span class="detail-label">Room Type:</span>
          <span class="detail-value">${booking.room ? booking.room.title : 'N/A'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Check-in:</span>
          <span class="detail-value">${formatDate(booking.checkIn)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Check-out:</span>
          <span class="detail-value">${formatDate(booking.checkOut)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Nights:</span>
          <span class="detail-value">${nights}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Guests:</span>
          <span class="detail-value">${booking.numGuests}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Rooms Required:</span>
          <span class="detail-value">${booking.roomsRequired}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <h4>Recommending Authority</h4>
        <div class="detail-item">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${booking.recommendingAuthority.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Designation:</span>
          <span class="detail-value">${booking.recommendingAuthority.designation}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Department:</span>
          <span class="detail-value">${booking.recommendingAuthority.department}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${booking.recommendingAuthority.email}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${booking.recommendingAuthority.phone}</span>
        </div>
      </div>
      
      ${booking.emergencyContact && booking.emergencyContact.name ? `
      <div class="detail-section">
        <h4>Emergency Contact</h4>
        <div class="detail-item">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${booking.emergencyContact.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${booking.emergencyContact.phone}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Relation:</span>
          <span class="detail-value">${booking.emergencyContact.relation}</span>
        </div>
      </div>
      ` : ''}
      
      <div class="detail-section">
        <h4>Additional Information</h4>
        <div class="detail-item">
          <span class="detail-label">Purpose of Visit:</span>
          <span class="detail-value">${booking.purposeOfVisit}</span>
        </div>
        ${booking.specialRequests ? `
        <div class="detail-item">
          <span class="detail-label">Special Requests:</span>
          <span class="detail-value">${booking.specialRequests}</span>
        </div>
        ` : ''}
        ${booking.paymentDetails ? `
        <div class="detail-item">
          <span class="detail-label">Payment Status:</span>
          <span class="detail-value">${booking.paymentDetails.status}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Payment Amount:</span>
          <span class="detail-value">₹${booking.paymentDetails.amount}</span>
        </div>
        ` : ''}
      </div>
    </div>
    
    ${booking.status === 'verified' ? `
    <div style="margin-top: var(--spacing-lg); text-align: center; padding-top: var(--spacing-lg); border-top: 1px solid var(--border-color);">
      <button class="btn-sm btn-approve" onclick="updateBookingStatus('${booking._id}', 'confirmed')" style="margin-right: var(--spacing-sm);">
        <i class="fas fa-check"></i> Confirm Booking
      </button>
      <button class="btn-sm btn-reject" onclick="updateBookingStatus('${booking._id}', 'rejected')">
        <i class="fas fa-times"></i> Reject Booking
      </button>
    </div>
    ` : ''}
  `;
  
  modal.style.display = 'block';
}

async function updateBookingStatus(bookingId, newStatus) {
  try {
    const remarks = prompt(`Enter remarks for ${newStatus === 'confirmed' ? 'confirming' : 'rejecting'} this booking:`);
    
    if (remarks === null) return; // User cancelled
    
    const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        status: newStatus,
        remarks: remarks
      })
    });
    
    if (response.ok) {
      showNotification('success', 'Success', `Booking ${newStatus} successfully`);
      closeModal();
      await loadDashboardData(); // Refresh data
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    showNotification('error', 'Error', 'Failed to update booking status');
  }
}

function deleteBooking(bookingId) {
  bookingToDelete = bookingId;
  document.getElementById('delete-modal').style.display = 'block';
}

async function confirmDelete() {
  if (!bookingToDelete) return;
  
  try {
    const response = await fetch(`/api/admin/bookings/${bookingToDelete}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (response.ok) {
      showNotification('success', 'Success', 'Booking deleted successfully');
      closeDeleteModal();
      await loadDashboardData(); // Refresh data
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    showNotification('error', 'Error', 'Failed to delete booking');
  }
}

function closeModal() {
  document.getElementById('booking-modal').style.display = 'none';
}

function closeDeleteModal() {
  document.getElementById('delete-modal').style.display = 'none';
  bookingToDelete = null;
}

async function refreshBookings() {
  await loadDashboardData();
  showNotification('success', 'Refreshed', 'Bookings data refreshed successfully');
}

function showAllBookings() {
  // Reset filters
  document.getElementById('status-filter').value = '';
  document.getElementById('category-filter').value = '';
  document.getElementById('search-input').value = '';
  
  // Apply filters (which will show all bookings)
  applyFilters();
  
  showNotification('info', 'All Bookings', 'Showing all bookings');
}

async function logout() {
  try {
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      window.location.href = 'login.html';
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Force redirect even if logout request fails
    window.location.href = 'login.html';
  }
}

// Utility functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN');
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-IN');
}

function getStatusText(status) {
  const statusMap = {
    'pending': 'Pending',
    'verified': 'Verified',
    'confirmed': 'Confirmed',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
}

function getCategoryText(category) {
  const categoryMap = {
    'faculty-iiest': 'Faculty (IIEST)',
    'faculty-other-institute': 'Faculty (Other)',
    'research-scholar-iiest': 'Research Scholar (IIEST)',
    'research-scholar-other-institute': 'Research Scholar (Other)',
    'student-iiest': 'Student (IIEST)',
    'student-other-institute': 'Student (Other)',
    'official-guest': 'Official Guest',
    'parent-guardian': 'Parent/Guardian',
    'alumni': 'Alumni',
    'others': 'Others'
  };
  return categoryMap[category] || category;
}

function showNotification(type, title, message) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : type === 'info' ? '#17a2b8' : '#dc3545'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
      <div>
        <h4 style="margin: 0; font-size: 1rem;">${title}</h4>
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}