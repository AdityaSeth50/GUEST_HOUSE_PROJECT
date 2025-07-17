document.addEventListener('DOMContentLoaded', function() {
  // Gallery filter functionality
  const filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Set active filter and show/hide gallery items
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Show/hide gallery items based on filter
      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Lightbox functionality
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      // Get image source and title
      const imgSrc = this.querySelector('img').getAttribute('src');
      const imgTitle = this.querySelector('h3').textContent;
      
      // Create lightbox elements
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      
      const lightboxContent = document.createElement('div');
      lightboxContent.className = 'lightbox-content';
      
      const img = document.createElement('img');
      img.src = imgSrc;
      
      const caption = document.createElement('div');
      caption.className = 'lightbox-caption';
      caption.textContent = imgTitle;
      
      const closeBtn = document.createElement('span');
      closeBtn.className = 'lightbox-close';
      closeBtn.innerHTML = '&times;';
      
      // Append elements
      lightboxContent.appendChild(closeBtn);
      lightboxContent.appendChild(img);
      lightboxContent.appendChild(caption);
      lightbox.appendChild(lightboxContent);
      document.body.appendChild(lightbox);
      
      // Prevent scrolling when lightbox is open
      document.body.style.overflow = 'hidden';
      
      // Show lightbox with animation
      setTimeout(() => {
        lightbox.style.opacity = '1';
      }, 10);
      
      // Close lightbox on click
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target === closeBtn) {
          lightbox.style.opacity = '0';
          
          // Remove lightbox after animation
          setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
          }, 300);
        }
      });
    });
  });
});