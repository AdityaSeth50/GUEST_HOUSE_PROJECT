document.addEventListener('DOMContentLoaded', function() {
  // Contact form submission
  const messageForm = document.getElementById('message-form');
  
  if (messageForm) {
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Create data object
      const formData = {
        name,
        email,
        subject,
        message
      };
      
      // Simulate form submission (would be replaced with actual API call)
      submitMessage(formData);
    });
  }
  
  function submitMessage(formData) {
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Reset form
      messageForm.reset();
      
      // Create success notification
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-check-circle"></i>
          <div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. We'll get back to you soon.</p>
          </div>
          <button class="close-notification">&times;</button>
        </div>
      `;
      
      // Add notification to the page
      document.body.appendChild(notification);
      
      // Show notification with animation
      setTimeout(() => {
        notification.style.transform = 'translateY(0)';
      }, 10);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        notification.style.transform = 'translateY(100%)';
        
        // Remove from DOM after animation
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 5000);
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Close notification on click
      const closeBtn = notification.querySelector('.close-notification');
      closeBtn.addEventListener('click', function() {
        notification.style.transform = 'translateY(100%)';
        
        // Remove from DOM after animation
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      });
    }, 1500);
  }
});

// Initialize Google Map
function initMap() {
  const mapElement = document.getElementById('map');
  
  if (mapElement) {
    // IIEST Shibpur coordinates (example)
    const position = { lat: 22.5558, lng: 88.3087 };
    
    // Create map
    const map = new google.maps.Map(mapElement, {
      zoom: 15,
      center: position,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });
    
    // Add marker
    const marker = new google.maps.Marker({
      position,
      map,
      title: 'IIEST Guest House'
    });
    
    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: '<div style="padding: 10px;"><strong>IIEST Guest House</strong><br>IIEST Campus, Shibpur, Howrah</div>'
    });
    
    // Show info window on marker click
    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
    
    // Show info window by default
    infoWindow.open(map, marker);
  }
}