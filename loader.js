document.addEventListener('DOMContentLoaded', () => {
    
    /* --- SYSTEM 1: THE GLOBAL LIGHTBOX --- */
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    // This selector covers ALL galleries on ALL your pages
    const galleryImages = document.querySelectorAll('.gallery-grid-3 img, figure img');

    if (lightbox && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                const fullSrc = img.getAttribute('data-full');
                if (fullSrc) {
                    lightboxImg.src = fullSrc;
                    lightbox.classList.add('active');
                }
            });
        });

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            lightboxImg.src = '';
        });
    }

    /* --- SYSTEM 2: THE AUDIO PLAYER DASHBOARD --- */
    const mainAudio = document.getElementById('main-audio-engine');
    const masterPlayBtn = document.getElementById('masterPlayBtn');
    const trackItems = document.querySelectorAll('.track-item');
    const nowPlayingText = document.getElementById('now-playing');
    const progressBar = document.getElementById('master-progress');
    const timeDisplay = document.getElementById('master-time');

    if (mainAudio && masterPlayBtn) {
        
        // Logic for clicking individual songs in the list
        trackItems.forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                const title = item.getAttribute('data-title');
                trackItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                mainAudio.src = src;
                nowPlayingText.textContent = title;
                mainAudio.play();
                masterPlayBtn.classList.add('playing');
            });
        });

        // Logic for the big central Play/Pause button
        masterPlayBtn.addEventListener('click', () => {
            if (mainAudio.paused) {
                if (!mainAudio.src && trackItems.length > 0) {
                    trackItems[0].click(); // Default to track 1
                } else {
                    mainAudio.play();
                    masterPlayBtn.classList.add('playing');
                }
            } else {
                mainAudio.pause();
                masterPlayBtn.classList.remove('playing');
            }
        });

        // Logic for the moving orange bar and digital timer
        mainAudio.addEventListener('timeupdate', () => {
            if (mainAudio.duration) {
                const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
                if (progressBar) progressBar.style.width = `${progress}%`;
                
                if (timeDisplay) {
                    let mins = Math.floor(mainAudio.currentTime / 60);
                    let secs = Math.floor(mainAudio.currentTime % 60);
                    timeDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                }
            }
        });
    }
});