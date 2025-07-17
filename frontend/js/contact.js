document.addEventListener('DOMContentLoaded', function() {
  // Contact form submission
  const messageForm = document.getElementById('message-form');
  
  if (messageForm) {
    messageForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Create data object for backend
      const contactData = {
        name: name,
        email: email,
        subject: subject,
        message: message
      };
      
      // Submit message using backend API
      await submitMessage(contactData);
    });
  }
  
  async function submitMessage(contactData) {
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Send email using backend API
      const response = await fetch('/api/contact/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Reset form
        messageForm.reset();
        
        // Show success notification
        showNotification('success', 'Message Sent!', result.message || 'Your message has been sent successfully. We will get back to you soon.');
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('error', 'Error', error.message || 'Failed to send message. Please try again or contact us directly.');
    } finally {
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
  
  function showNotification(type, title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <div>
          <h4 style="margin: 0; font-size: 1rem;">${title}</h4>
          <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;">&times;</button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }
});

// Initialize Google Map
function initMap() {
  const mapElement = document.getElementById('map');
  
  if (mapElement) {
    // IIEST Shibpur coordinates
    const position = { lat: 22.5558, lng: 88.3087 };
    
    //Create map
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