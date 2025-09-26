// Supabase configuration
const supabaseUrl = 'https://pxndfzixwgfawohzidju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmRmeml4d2dmYXdvaHppZGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzOTEzOTAsImV4cCI6MjA3Mzk2NzM5MH0.fYu_A5qh-aMO-9-Pocci5271Hgqiw8d75gN62J_jrcI';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Invitation page with music controls
document.addEventListener('DOMContentLoaded', () => {
  const musicToggle = document.getElementById('music-toggle');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeControl = document.getElementById('volume-control');
  const backgroundMusic = document.getElementById('background-music');
  const petalsContainer = document.getElementById('petals-container');
  const musicControls = document.getElementById('music-controls');
  const hideControls = document.getElementById('hide-controls');
  const hiddenMusicBtn = document.getElementById('hidden-music-btn');

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

  // Set initial volume
  backgroundMusic.volume = 0.5;

  // Optimize image loading
  const couplePhoto = document.querySelector('.couple-photo');
  if (couplePhoto) {
    couplePhoto.addEventListener('load', () => {
      couplePhoto.classList.add('loaded');
    });
    
    // If image is already loaded (cached), add loaded class immediately
    if (couplePhoto.complete) {
      couplePhoto.classList.add('loaded');
    }
  }

  // Countdown functionality
  function startCountdown() {
    // Wedding date: November 15, 2025 at 11:00 AM
    const weddingDate = new Date('2025-11-15T11:00:00');
    
    function updateCountdown() {
      const now = new Date();
      const timeLeft = weddingDate - now;
      
      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update the countdown display
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
      } else {
        // Wedding day has arrived!
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // Optional: Change the title when countdown reaches zero
        const countdownTitle = document.querySelector('.countdown-title');
        if (countdownTitle) {
          countdownTitle.textContent = 'É HOJE!';
        }
      }
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Start the countdown
  startCountdown();

  // Message handling functionality
  const messageForm = document.getElementById('message-form');
  const viewMessagesBtn = document.getElementById('view-messages-btn');
  const messagesDisplay = document.getElementById('messages-display');
  const messagesList = document.getElementById('messages-list');
  const closeMessagesBtn = document.getElementById('close-messages-btn');
  const successNotification = document.getElementById('success-notification');
  const closeNotificationBtn = document.getElementById('close-notification');

  // Handle form submission
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(messageForm);
    const name = formData.get('name').trim();
    const message = formData.get('message').trim();
    
    if (!name || !message) {
      showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          { name: name, message: message }
        ]);
      
      if (error) {
        console.error('Error inserting message:', error);
        showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        return;
      }
      
      // Clear form
      messageForm.reset();
      showNotification('Mensagem enviada com sucesso! Obrigado pela sua felicitação.', 'success');
      
    } catch (error) {
      console.error('Error:', error);
      showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
    }
  });

  // Handle view messages button
  viewMessagesBtn.addEventListener('click', async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching messages:', error);
        showNotification('Erro ao carregar mensagens.', 'error');
        return;
      }
      
      displayMessages(data);
      messagesDisplay.style.display = 'block';
      
    } catch (error) {
      console.error('Error:', error);
      showNotification('Erro ao carregar mensagens.', 'error');
    }
  });

  // Handle close messages button
  closeMessagesBtn.addEventListener('click', () => {
    messagesDisplay.style.display = 'none';
  });

  // Handle close notification button
  closeNotificationBtn.addEventListener('click', () => {
    hideNotification();
  });

  // Function to display messages
  function displayMessages(messages) {
    if (!messages || messages.length === 0) {
      messagesList.innerHTML = '<p style="text-align: center; color: #6b7280; font-style: italic;">Ainda não há mensagens de felicitação.</p>';
      return;
    }
    
    messagesList.innerHTML = messages.map(msg => {
      const date = new Date(msg.created_at);
      const formattedDate = date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return `
        <div class="message-card">
          <h5>${escapeHtml(msg.name)}</h5>
          <p>${escapeHtml(msg.message)}</p>
          <div class="message-date">${formattedDate}</div>
        </div>
      `;
    }).join('');
  }

  // Function to escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Notification functions
  function showNotification(message, type = 'success') {
    const notification = document.getElementById('success-notification');
    const icon = notification.querySelector('.notification-icon');
    const title = notification.querySelector('.notification-text h4');
    const text = notification.querySelector('.notification-text p');
    
    if (type === 'success') {
      icon.textContent = '✅';
      title.textContent = 'Mensagem Enviada!';
      text.textContent = message;
      notification.style.borderColor = '#10b981';
      notification.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
      title.style.color = '#10b981';
    } else if (type === 'error') {
      icon.textContent = '❌';
      title.textContent = 'Erro';
      text.textContent = message;
      notification.style.borderColor = '#ef4444';
      notification.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.3)';
      title.style.color = '#ef4444';
    }
    
    notification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  }

  function hideNotification() {
    const notification = document.getElementById('success-notification');
    notification.classList.remove('show');
  }

  // RSVP functionality
  const rsvpBtn = document.getElementById('rsvp-btn');
  
  rsvpBtn.addEventListener('click', () => {
    // Placeholder for future RSVP functionality
    showNotification('Funcionalidade de RSVP será implementada em breve!', 'success');
  });

  // Gift section functionality
  const giftToggleBtn = document.getElementById('gift-toggle-btn');
  const giftOptions = document.getElementById('gift-options');
  
  giftToggleBtn.addEventListener('click', () => {
    if (giftOptions.style.display === 'none') {
      giftOptions.style.display = 'block';
      giftToggleBtn.textContent = 'FECHAR';
    } else {
      giftOptions.style.display = 'none';
      giftToggleBtn.textContent = 'CLIQUE AQUI';
    }
  });

  window.openStoreLink = function(storeType) {
    let url = '';
    let message = '';
    
    switch(storeType) {
      case 'hisense':
        url = 'https://www.hisense.co.za/';
        message = 'Redirecionando para Hisense...';
        break;
      case 'builders':
        url = 'https://www.builders.co.za/';
        message = 'Redirecionando para Builders Warehouse...';
        break;
      case 'vouchers':
        url = 'https://www.giftvouchers.co.za/';
        message = 'Redirecionando para Gift Vouchers...';
        break;
      default:
        message = 'Link não disponível.';
    }
    
    if (url) {
      showNotification(message, 'success');
      setTimeout(() => {
        window.open(url, '_blank');
      }, 1000);
    } else {
      showNotification(message, 'error');
    }
  };

  // Music toggle functionality
  musicToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play().catch(e => console.log('Autoplay prevented:', e));
      musicToggle.innerHTML = '<span class="music-icon">🎵</span>';
      volumeControl.style.display = 'flex';
    } else {
      backgroundMusic.pause();
      musicToggle.innerHTML = '<span class="music-icon">🔇</span>';
      volumeControl.style.display = 'none';
    }
  });

  // Hidden music button functionality
  hiddenMusicBtn.addEventListener('click', () => {
    musicControls.style.display = 'flex';
    hiddenMusicBtn.classList.remove('show');
  });

  // Hide controls functionality
  hideControls.addEventListener('click', () => {
    musicControls.style.display = 'none';
    hiddenMusicBtn.classList.add('show');
  });

  // Volume control
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    backgroundMusic.volume = volume;
    
    // Update volume icon based on level
    const volumeIcon = volumeControl.querySelector('.volume-icon');
    if (volume === 0) {
      volumeIcon.textContent = '🔇';
    } else if (volume < 0.5) {
      volumeIcon.textContent = '🔉';
    } else {
      volumeIcon.textContent = '🔊';
    }
  });

  // Try to start music automatically (may be blocked by browser)
  backgroundMusic.play().catch(e => {
    console.log('Autoplay prevented, user needs to interact first');
    // Show music controls to indicate music is available
    volumeControl.style.display = 'flex';
  });

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
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
});
