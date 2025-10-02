// Simple animation on load
window.addEventListener('load', () => {
  const container = document.querySelector('.container');
  container.style.transform = 'translateY(0)';
  container.style.opacity = '1';
  
  // Create falling petals for index page
  const petalsContainer = document.getElementById('petals-container');
  if (petalsContainer) {
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
      petal.style.animationDelay = Math.random() * 2 + 's';
      petalsContainer.appendChild(petal);
    }
  }
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Optional: Add subtle hover effect to the map button
const mapButton = document.querySelector('.map-button');
if (mapButton) {
  mapButton.addEventListener('mouseenter', () => {
    mapButton.style.transform = 'scale(1.05)';
  });

  mapButton.addEventListener('mouseleave', () => {
    mapButton.style.transform = 'scale(1)';
  });
}