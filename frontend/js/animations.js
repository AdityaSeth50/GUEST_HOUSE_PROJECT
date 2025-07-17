document.addEventListener('DOMContentLoaded', function() {
  // Scroll animations
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  // Initial check for elements in viewport on page load
  checkForVisibleElements();
  
  // Check for elements in viewport on scroll
  window.addEventListener('scroll', debounce(checkForVisibleElements, 15));
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Element is considered in viewport if it's top edge is within the viewport,
    // or if its top edge is above the viewport but bottom edge is within it
    return (
      (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) ||
      (rect.top <= 0 && rect.bottom >= 0)
    );
  }
  
  // Check all animated elements and show if visible
  function checkForVisibleElements() {
    animateElements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('show');
      }
    });
  }
  
  // Debounce function to limit scroll event frequency
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
});