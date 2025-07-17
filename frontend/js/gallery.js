document.addEventListener('DOMContentLoaded', function() {
  // Gallery filter functionality
  const filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Gallery data with more images
  const galleryData = [
    {
      src: 'images/dbr1-1.jpg',
      title: 'Double Bed AC Room',
      category: 'rooms'
    },
    {
      src: 'images/dbr1-2.jpg',
      title: 'Twin Bed AC room',
      category: 'rooms'
    },
    {
      src: 'images/dbr1-3.jpg',
      title: 'Twin Bed Room',
      category: 'rooms'
    },
    {
      src: 'images/dbr2-1.jpg',
      title: 'Suite Room',
      category: 'rooms'
    },
    {
      src: 'images/dbr2-2.jpg',
      title: 'Restaurant',
      category: 'restaurant'
    },
    {
      src: 'images/dbr2-3.jpg',
      title: 'Dining Area',
      category: 'restaurant'
    },
    {
      src: 'images/dbr2-4.jpg',
      title: 'Breakfast Area',
      category: 'restaurant'
    },
    {
      src: 'images/dbr3-1.jpg',
      title: 'Garden',
      category: 'exterior'
    },
    {
      src: 'images/dbr3-2.jpg',
      title: 'Guest House Exterior',
      category: 'exterior'
    },
    {
      src: 'images/dsb1.jpg',
      title: 'Campus View',
      category: 'exterior'
    },
    {
      src: 'images/dsbr1-2.jpg',
      title: 'Reception Area',
      category: 'exterior'
    },
    {
      src: 'images/dsbr1-3.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/grdn.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/hllwy1.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/hllwy2.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/int1.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/int2.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/int3.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/int4.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/lng.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/lng2.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/lng3.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/lng4.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/parking.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/WhatsApp Image 2025-05-22 at 21.39.41_4a44f338.jpg',
      title: 'Conference Room',
      category: 'rooms'
    },
    {
      src: 'images/bthrm.jpg',
      title: 'Conference Room',
      category: 'rooms'
    }
  ];
  
  let currentImageIndex = 0;
  let filteredImages = [...galleryData];
  
  // Set active filter and show/hide gallery items
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Filter images
      if (filterValue === 'all') {
        filteredImages = [...galleryData];
      } else {
        filteredImages = galleryData.filter(img => img.category === filterValue);
      }
      
      // Show/hide gallery items based on filter
      galleryItems.forEach((item, index) => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Enhanced lightbox functionality
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      // Find the index in filtered images
      const imgSrc = this.querySelector('img').getAttribute('src');
      const imageData = galleryData.find(img => img.src === imgSrc);
      currentImageIndex = filteredImages.findIndex(img => img.src === imgSrc);
      
      if (currentImageIndex === -1) {
        currentImageIndex = 0;
      }
      
      openLightbox();
    });
  });
  
  function openLightbox() {
    // Create lightbox elements - MAXIMIZED IMAGE, NO TITLE/DESCRIPTION
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <div class="lightbox-header">
          <div class="lightbox-counter">
            <span class="current-image">${currentImageIndex + 1}</span> / 
            <span class="total-images">${filteredImages.length}</span>
          </div>
          <button class="lightbox-close">&times;</button>
        </div>
        
        <div class="lightbox-main">
          <button class="lightbox-nav lightbox-prev" ${currentImageIndex === 0 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="lightbox-image-container">
            <img src="${filteredImages[currentImageIndex].src}" 
                 alt="${filteredImages[currentImageIndex].title}" 
                 class="lightbox-image">
          </div>
          
          <button class="lightbox-nav lightbox-next" ${currentImageIndex === filteredImages.length - 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="lightbox-thumbnails">
          ${filteredImages.map((img, index) => `
            <div class="lightbox-thumbnail ${index === currentImageIndex ? 'active' : ''}" 
                 data-index="${index + 1}">
              <img src="${img.src}" alt="${img.title}">
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
    
    // Show lightbox with animation
    setTimeout(() => {
      lightbox.style.opacity = '1';
    }, 10);
    
    // Setup lightbox event listeners
    setupLightboxEvents(lightbox);
  }
  
  function setupLightboxEvents(lightbox) {
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const thumbnails = lightbox.querySelectorAll('.lightbox-thumbnail');
    
    // Close lightbox
    function closeLightbox() {
      lightbox.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(lightbox)) {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }
      }, 300);
    }
    
    // Update lightbox content
    function updateLightbox() {
      const img = lightbox.querySelector('.lightbox-image');
      const counter = lightbox.querySelector('.current-image');
      
      // Update image with fade effect
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = filteredImages[currentImageIndex].src;
        img.alt = filteredImages[currentImageIndex].title;
        counter.textContent = currentImageIndex + 1;
        img.style.opacity = '1';
      }, 150);
      
      // Update navigation buttons
      prevBtn.disabled = currentImageIndex === 0;
      nextBtn.disabled = currentImageIndex === filteredImages.length - 1;
      
      // Update thumbnails
      thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
      });
      
      // Scroll active thumbnail into view
      const activeThumbnail = thumbnails[currentImageIndex];
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
    
    // Navigation functions
    function goToPrevious() {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightbox();
      }
    }
    
    function goToNext() {
      if (currentImageIndex < filteredImages.length - 1) {
        currentImageIndex++;
        updateLightbox();
      }
    }
    
    function goToImage(index) {
      currentImageIndex = index;
      updateLightbox();
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', goToPrevious);
    nextBtn.addEventListener('click', goToNext);
    
    // Thumbnail clicks
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => goToImage(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    });
    
    // Click outside to close
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next image
          goToNext();
        } else {
          // Swipe right - previous image
          goToPrevious();
        }
      }
    }
  }
});