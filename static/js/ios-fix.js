/**
 * iOS Safari Scroll Fix
 * This script helps resolve nested scrolling issues on iOS Safari
 */

document.addEventListener('DOMContentLoaded', function() {
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isMobile = window.innerWidth <= 879;
  
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
    }
    
    // Run on load and resize
    adjustHeights();
    window.addEventListener('resize', adjustHeights);
    
    // Additional touch events to ensure smooth scrolling
    document.addEventListener('touchstart', function() {
      // Ensure body is scrollable
      document.body.style.overflow = 'auto';
    }, {passive: true});
  }
  
  // Text optimization for all mobile devices
  if (isMobile) {
    document.body.classList.add('mobile-device');
    
    // Optimize text for mobile
    function optimizeTextForMobile() {
      // Find all title elements and ensure text fits properly
      const titles = document.querySelectorAll('.experience-title');
      titles.forEach(title => {
        title.classList.add('mobile-optimize');
        
        // If title is very long, add more truncation
        if (title.textContent.length > 30) {
          title.classList.add('mobile-truncate');
          title.classList.add('lines-2');
        }
      });
      
      // Optimize descriptions
      const descriptions = document.querySelectorAll('.experience-shortdes');
      descriptions.forEach(desc => {
        desc.classList.add('mobile-optimize');
        desc.classList.add('mobile-truncate');
        desc.classList.add('lines-3');
        
        // On very small screens, limit to 2 lines
        if (window.innerWidth <= 450) {
          desc.classList.remove('lines-3');
          desc.classList.add('lines-2');
        }
      });
      
      // Handle overflow in tiles
      const tiles = document.querySelectorAll('.project-item');
      tiles.forEach(tile => {
        const tileWidth = tile.offsetWidth;
        
        // Adjust font size based on tile width for better proportions
        if (tileWidth < 180) {
          tile.classList.add('very-small-tile');
        } else if (tileWidth < 250) {
          tile.classList.add('small-tile');
        }
      });
    }
    
    // Run optimizations
    optimizeTextForMobile();
    window.addEventListener('resize', optimizeTextForMobile);
  }
}); 