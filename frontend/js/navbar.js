// document.addEventListener('DOMContentLoaded', function() {
//   // DOM Elements
//   const navbar = document.getElementById('navbar');
//   const hamburger = document.querySelector('.hamburger');
//   const navLinks = document.querySelector('.nav-links');

//   const logo = document.getElementById("college-logo");
//   const originalLogo = "images/iiestlogo1.png";
//   const scrolledLogo = "images/iiest.png";

  
//   // Toggle mobile menu
//   hamburger.addEventListener('click', function() {
//     hamburger.classList.toggle('active');
//     navLinks.classList.toggle('active');
//   });
  
//   // Close mobile menu when clicking a link
//   document.querySelectorAll('.nav-links a').forEach(link => {
//     link.addEventListener('click', function() {
//       hamburger.classList.remove('active');
//       navLinks.classList.remove('active');
//     });
//   });
  
//   // Navbar scroll effect
//   window.addEventListener('scroll', function() {
//     if (window.scrollY > 50) {
//       navbar.classList.add('scrolled');
//       logo.src = scrolledLogo;
//     } else {
//       navbar.classList.remove('scrolled');
//       logo.src = originalLogo;
//     }
//   });

// });

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  const logo = document.getElementById("college-logo");
  const originalLogo = "images/iiestlogo1.png";
  const scrolledLogo = "images/iiest.png";
  const mobileLogobw = "images/iiestsmallbw1.png"; // <-- set your mobile logo path here
  const mobileLogo = "images/iiestlogosmallcolor.png";

  // Toggle mobile menu
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Responsive and scroll-based logo update
  function updateNavbarLogo() {
    if (window.innerWidth < 993) {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
        logo.src = mobileLogo;
      } else {
        navbar.classList.remove('scrolled');
        logo.src = mobileLogobw;
      }
    } else {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
        logo.src = scrolledLogo;
      } else {
        navbar.classList.remove('scrolled');
        logo.src = originalLogo;
      }
    }
  }

  window.addEventListener('scroll', updateNavbarLogo);
  window.addEventListener('resize', updateNavbarLogo);
  updateNavbarLogo(); // Initial call on DOMContentLoaded
});