function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function showPreview(event, projectId) {
    const previewContainer = document.getElementById('preview-' + projectId);
    previewContainer.style.display = 'block';

    const windowWidth = window.innerWidth;
    const previewWidth = previewContainer.offsetWidth;
    const centerX = (windowWidth - previewWidth) / 2;

    const rect = event.target.getBoundingClientRect();
    const linkTop = rect.top + window.scrollY;

    previewContainer.style.top = `${linkTop}px`;
    previewContainer.style.left = `${centerX + window.scrollX}px`;

    const projectData = projects.find(p => p.id === projectId);

    if (projectData) {
        const companyName = projectData.company;
        const description = projectData.description;

        // Truncate the description to 50 characters
        const truncatedDescription = truncateText(description, 80);

        previewContainer.innerHTML = `
            <div class="company-name" style="font-weight: bold; font-size: 2.5vw;">${companyName}</div>
            <div class="project-description">${truncatedDescription}</div>
        `;

    }

    previewContainer.addEventListener('mouseover', () => {
        previewContainer.style.display = 'block';
    });

    previewContainer.addEventListener('mouseout', () => {
        previewContainer.style.display = 'none';
    });
}

function hidePreview(event) {
    const previewContainers = document.querySelectorAll('.preview-container');
    previewContainers.forEach(container => {
        container.style.display = 'none';
    });
}

// Function to truncate the text to a specific character limit
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

document.addEventListener('DOMContentLoaded', function () {
    if (!isTouchDevice()) {
        const projectLinks = document.querySelectorAll('.project-link');

        projectLinks.forEach(link => {
            const projectId = link.getAttribute('href').split('project_id=')[1];
            link.addEventListener('mouseover', (event) => showPreview(event, projectId));
            link.addEventListener('mouseout', hidePreview);
        });
    }
});

function openFeedbackForm() {
    document.getElementById('feedback-modal').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
  }
  
  function closeFeedbackForm() {
    document.getElementById('feedback-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
  }
  
  // Close the modal when clicking outside of it
  window.onclick = function(event) {
    if (event.target == document.getElementById('modal-overlay')) {
      closeFeedbackForm();
    }
  }
  
  // Handle form submission
  document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var feedback = document.getElementById('feedback').value;
  
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/submit_feedback', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        alert('Thank you for your feedback!');
        closeFeedbackForm();
      }
    };
    xhr.send('feedback=' + encodeURIComponent(feedback));
  });
  