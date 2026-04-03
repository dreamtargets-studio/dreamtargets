/* ============================================================
   THINKAMIGO DEFENSIVE LOADER v19.0
   Features: Lightbox, Audio Engine, Scroll Utilities
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MODULE: LIGHTBOX (Galleries & Archives)
    const setupLightbox = () => {
        const overlay = document.getElementById('lightbox-overlay');
        const targetImg = document.getElementById('lightbox-img');
        const triggers = document.querySelectorAll('img[data-full]');

        // Guard Clause: Exit if no lightbox elements exist on this page
        if (!overlay || !targetImg || triggers.length === 0) return;

        triggers.forEach(img => {
            img.addEventListener('click', () => {
                const fullRes = img.getAttribute('data-full');
                if (fullRes) {
                    targetImg.src = fullRes;
                    overlay.classList.add('active');
                }
            });
        });

        overlay.addEventListener('click', () => {
            overlay.classList.remove('active');
            targetImg.src = ""; // Clear memory
        });
    };

    // 2. MODULE: AUDIO ENGINE (Destination Pages)
    const setupAudioPlayer = () => {
        const engine = document.getElementById('main-audio-engine');
        const masterBtn = document.getElementById('masterPlayBtn');
        const trackDisplay = document.getElementById('now-playing');
        
        // Guard Clause: Exit if no player is present (e.g., Home Page)
        if (!engine || !masterBtn) return;

        const tracks = document.querySelectorAll('.track-item');

        // Track Selection Logic
        tracks.forEach(track => {
            track.addEventListener('click', () => {
                const src = track.getAttribute('data-src');
                const title = track.innerText;

                // Reset states
                tracks.forEach(t => t.classList.remove('active'));
                track.classList.add('active');

                // Update Engine
                engine.src = src;
                engine.play();
                
                // Update UI
                if (trackDisplay) trackDisplay.innerText = title;
                masterBtn.classList.add('playing');
            });
        });

        // Master Play/Pause Toggle
        masterBtn.addEventListener('click', () => {
            if (engine.paused) {
                engine.play();
                masterBtn.classList.add('playing');
            } else {
                engine.pause();
                masterBtn.classList.remove('playing');
            }
        });
    };

    // 3. MODULE: UI UTILITIES (Back to Top)
    const setupUI = () => {
        const topBtn = document.querySelector('.back-to-top');
        if (!topBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                topBtn.classList.add('show');
            } else {
                topBtn.classList.remove('show');
            }
        });

        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // EXECUTE INDEPENDENT MODULES
    setupLightbox();
    setupAudioPlayer();
    setupUI();
});