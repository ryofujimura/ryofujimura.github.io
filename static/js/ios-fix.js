/**
 * iOS Safari Scroll Fix and Content Optimization
 * This script helps resolve nested scrolling issues on iOS Safari and optimizes content display
 */

document.addEventListener('DOMContentLoaded', function() {
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS) {
    // Add iOS-specific class to body
    document.body.classList.add('ios-device');
    
    // Fix for element heights
    function adjustHeights() {
      // Get main containers
      const contentContainer = document.querySelector('.content-container');
      const experienceSection = document.querySelector('.experience-section');
      const experienceSectionContainer = document.querySelector('.experience-section-container');
      
      if (contentContainer) {
        contentContainer.style.height = 'auto';
        contentContainer.style.maxHeight = 'none';
        contentContainer.style.overflow = 'visible';
      }
      
      if (experienceSectionContainer) {
        experienceSectionContainer.style.height = 'auto';
        experienceSectionContainer.style.maxHeight = 'none';
        experienceSectionContainer.style.overflow = 'visible';
      }
      
      if (experienceSection) {
        experienceSection.style.height = 'auto';
        experienceSection.style.maxHeight = 'none';
        experienceSection.style.overflow = 'visible';
      }
      
      // Get all project tiles
      const projectTiles = document.querySelectorAll('[id^="project-"]');
      projectTiles.forEach(tile => {
        tile.style.overflow = 'visible';
      });
      
      // Optimize content display based on screen width
      const screenWidth = window.innerWidth;
      
      // For very small screens, hide less important elements
      if (screenWidth <= 375) { // iPhone SE/mini size
        // Hide tags on small screens
        const tags = document.querySelectorAll('.experience-tags');
        tags.forEach(tag => {
          tag.style.display = 'none';
        });
        
        // Limit short description to fewer lines
        const shortDes = document.querySelectorAll('.experience-shortdes');
        shortDes.forEach(des => {
          des.style.display = '-webkit-box';
          des.style.webkitLineClamp = '2';
          des.style.webkitBoxOrient = 'vertical';
          des.style.overflow = 'hidden';
          des.style.fontSize = '0.7rem';
        });
        
        // Adjust padding for more space
        const outerTiles = document.querySelectorAll('.outer');
        outerTiles.forEach(tile => {
          tile.style.padding = '0.5rem';
        });
      }
      
      // Check if iPhone Plus/Pro Max models with more space
      if (screenWidth >= 414) {
        // Allow more content to show on larger iPhones
        const shortDes = document.querySelectorAll('.experience-shortdes');
        shortDes.forEach(des => {
          des.style.display = '-webkit-box';
          des.style.webkitLineClamp = '5'; // More lines on larger screens
          des.style.webkitBoxOrient = 'vertical';
          des.style.overflow = 'hidden';
          des.style.fontSize = '0.8rem'; // Slightly larger font
        });
      }
    }
    
    // Run on load and resize
    adjustHeights();
    window.addEventListener('resize', adjustHeights);
    window.addEventListener('orientationchange', adjustHeights);
    
    // Additional touch events to ensure smooth scrolling
    document.addEventListener('touchstart', function() {
      // Ensure body is scrollable
      document.body.style.overflow = 'auto';
    }, {passive: true});
  }
}); 