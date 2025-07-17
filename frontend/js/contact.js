// document.addEventListener('DOMContentLoaded', function() {
//   // Initialize EmailJS
//   emailjs.init("0E0kYHy1m93uY5uhe"); // Replace with your EmailJS public key
  
//   // Contact form submission
//   const messageForm = document.getElementById('message-form');
  
//   if (messageForm) {
//     messageForm.addEventListener('submit', async function(e) {
//       e.preventDefault();
      
//       // Get form values
//       const name = document.getElementById('name').value;
//       const email = document.getElementById('email').value;
//       const subject = document.getElementById('subject').value;
//       const message = document.getElementById('message').value;
      
//       // Create data object for EmailJS
//       const templateParams = {
//         from_name: name,
//         from_email: email,
//         subject: subject,
//         message: message,
//         to_email: 'adityaseth3007@gmail.com', // Guest house email
//         reply_to: email
//       };
      
//       // Submit message using EmailJS
//       await submitMessage(templateParams);
//     });
//   }
  
//   async function submitMessage(templateParams) {
//     // Show loading state
//     const submitBtn = document.querySelector('.submit-btn');
//     const originalText = submitBtn.textContent;
//     submitBtn.textContent = 'Sending...';
//     submitBtn.disabled = true;
    
//     try {
//       // Send email using EmailJS
//       const response = await emailjs.send(
//         'service_zbnghwp', // Replace with your EmailJS service ID
//         'template_yokooda', // Replace with your EmailJS template ID
//         templateParams
//       );
      
//       if (response.status === 200) {
//         // Reset form
//         messageForm.reset();
        
//         // Show success notification
//         showNotification('success', 'Message Sent!', 'Your message has been sent successfully. We will get back to you soon.');
        
//         // Send confirmation email to user
//         // await sendConfirmationEmail(templateParams);
//       } else {
//         throw new Error('Failed to send email');
//       }
      
//     } catch (error) {
//       console.error('Error sending message:', error);
//       showNotification('error', 'Error', 'Failed to send message. Please try again or contact us directly.');
//     } finally {
//       // Reset button
//       submitBtn.textContent = originalText;
//       submitBtn.disabled = false;
//     }
//   }
  
//   async function sendConfirmationEmail(originalParams) {
//     try {
//       // Send confirmation email to user
//       const confirmationParams = {
//         to_name: originalParams.from_name,
//         to_email: originalParams.from_email,
//         subject: originalParams.subject,
//         original_message: originalParams.message,
//         guest_house_email: 'adityaseth3007@gmail.com',
//         guest_house_phone: '+91 (033) 2668-4561'
//       };
      
//       await emailjs.send(
//         'service_zbnghwp', // Replace with your EmailJS service ID
//         'template_yokooda', // Replace with your confirmation template ID
//         confirmationParams
//       );
      
//     } catch (error) {
//       console.error('Error sending confirmation email:', error);
//       // Don't show error to user as main email was sent successfully
//     }
//   }
  
//   function showNotification(type, title, message) {
//     // Create notification element
//     const notification = document.createElement('div');
//     notification.className = `notification ${type}`;
//     notification.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       background: ${type === 'success' ? '#28a745' : '#dc3545'};
//       color: white;
//       padding: 1rem 1.5rem;
//       border-radius: 8px;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//       z-index: 1000;
//       transform: translateX(100%);
//       transition: transform 0.3s ease;
//       max-width: 400px;
//     `;
    
//     notification.innerHTML = `
//       <div style="display: flex; align-items: center; gap: 10px;">
//         <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
//         <div>
//           <h4 style="margin: 0; font-size: 1rem;">${title}</h4>
//           <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${message}</p>
//         </div>
//         <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;">&times;</button>
//       </div>
//     `;
    
//     // Add to page
//     document.body.appendChild(notification);
    
//     // Show notification
//     setTimeout(() => {
//       notification.style.transform = 'translateX(0)';
//     }, 10);
    
//     // Auto remove after 5 seconds
//     setTimeout(() => {
//       notification.style.transform = 'translateX(100%)';
//       setTimeout(() => {
//         if (notification.parentElement) {
//           notification.remove();
//         }
//       }, 300);
//     }, 5000);
//   }
// });

// // Initialize Google Map
// function initMap() {
//   const mapElement = document.getElementById('map');
  
//   if (mapElement) {
//     // IIEST Shibpur coordinates
//     const position = { lat: 22.5558, lng: 88.3087 };
    
//     // Create map
//     const map = new google.maps.Map(mapElement, {
//       zoom: 15,
//       center: position,
//       styles: [
//         {
//           featureType: 'poi',
//           elementType: 'labels',
//           stylers: [{ visibility: 'off' }]
//         }
//       ]
//     });
    
//     // Add marker
//     const marker = new google.maps.Marker({
//       position,
//       map,
//       title: 'IIEST Guest House'
//     });
    
//     // Add info window
//     const infoWindow = new google.maps.InfoWindow({
//       content: '<div style="padding: 10px;"><strong>IIEST Guest House</strong><br>IIEST Campus, Shibpur, Howrah</div>'
//     });
    
//     // Show info window on marker click
//     marker.addListener('click', function() {
//       infoWindow.open(map, marker);
//     });
    
//     // Show info window by default
//     infoWindow.open(map, marker);
//   }
// }

// document.addEventListener('DOMContentLoaded', function () {
//   const messageForm = document.getElementById('message-form');

//   if (messageForm) {
//     messageForm.addEventListener('submit', async function (e) {
//       e.preventDefault();

//       const name = document.getElementById('name').value;
//       const email = document.getElementById('email').value;
//       const subject = document.getElementById('subject').value;
//       const message = document.getElementById('message').value;

//       const contactData = { name, email, subject, message };

//       const submitBtn = document.querySelector('.submit-btn');
//       const originalText = submitBtn.textContent;
//       submitBtn.textContent = 'Sending...';
//       submitBtn.disabled = true;

//       try {
//         const response = await fetch('http://localhost:3000/api/contact/send-message', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(contactData),
//         });

//         const result = await response.json();

//         if (result.success) {
//           messageForm.reset();
//           showNotification('success', 'Message Sent!', 'Your message has been sent successfully.');
//         } else {
//           throw new Error(result.message);
//         }
//       } catch (err) {
//         console.error(err);
//         showNotification('error', 'Error', 'Failed to send message. Please try again.');
//       } finally {
//         submitBtn.textContent = originalText;
//         submitBtn.disabled = false;
//       }
//     });
//   }

//   function showNotification(type, title, message) {
//     // your existing showNotification code...
//   }
// });




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