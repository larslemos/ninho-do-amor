// Envelope Animation and Navigation
document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('envelope');
  const fadeOverlay = document.getElementById('fade-overlay');
  const petalsContainer = document.getElementById('petals-container');

  // Create falling petals
  function createPetals() {
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
      petal.style.animationDelay = Math.random() * 2 + 's';
      petalsContainer.appendChild(petal);
    }
  }

  // Start petals animation
  createPetals();

  // Envelope click handler
  envelope.addEventListener('click', () => {
    // Add opened class to trigger flap animation
    envelope.classList.add('opened');
    
    // Hide the click instruction
    const clickInstruction = document.querySelector('.click-instruction');
    clickInstruction.style.opacity = '0';
    
    // After flap animation completes, start fade transition
    setTimeout(() => {
      fadeOverlay.classList.add('active');
      
      // Navigate to invitation page after fade
      setTimeout(() => {
        window.location.href = 'invitation.html';
      }, 500);
    }, 800); // Match the flap animation duration
  });
});
