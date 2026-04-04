/* ============================================================
   THINKAMIGO UNIFIED LOADER & INJECTOR v20.2
   Features: HTML Partials, Lightbox, Audio Engine, UI Utils
   Architecture: Pixel-Perfect Scroll Triggers
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THE INJECTOR ENGINE (The "Glue") ---
    const loadPartials = async () => {
        try {
            // Fetch and Inject Header
            const hRes = await fetch('header.html');
            if (hRes.ok) {
                const hData = await hRes.text();
                const headerSocket = document.getElementById('main-nav');
                if (headerSocket) headerSocket.innerHTML = hData;
            }

            // Fetch and Inject Footer
            const fRes = await fetch('footer.html');
            if (fRes.ok) {
                const fData = await fRes.text();
                const footerSocket = document.getElementById('main-footer');
                if (footerSocket) {
                    footerSocket.innerHTML = fData;
                    
                    // CRITICAL: Initialize UI elements (Back-to-top) AFTER injection
                    setupUI(); 
                }
            }

            // Initialize Mobile Menu
            setupMobileMenu();

        } catch (err) {
            console.error("Critical: Partial injection failed.", err);
        }
    };

    // --- 2. MODULE: MOBILE MENU ---
    const setupMobileMenu = () => {
        const btn = document.getElementById('menu-toggle');
        const nav = document.querySelector('.nav-links');
        // Logic left open for future animation states; Checkbox handles primary toggle.
    };

    // --- 3. MODULE: LIGHTBOX (Galleries & Archives) ---
    const setupLightbox = () => {
        const overlay = document.getElementById('lightbox-overlay');
        const targetImg = document.getElementById('lightbox-img');
        const triggers = document.querySelectorAll('img[data-full]');

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
            targetImg.src = ""; 
        });
    };

    // --- 4. MODULE: AUDIO ENGINE (Destination Pages) ---
    const setupAudioPlayer = () => {
        const engine = document.getElementById('main-audio-engine');
        const masterBtn = document.getElementById('masterPlayBtn');
        const trackDisplay = document.getElementById('now-playing');
        
        if (!engine || !masterBtn) return;

        const tracks = document.querySelectorAll('.track-item');

        tracks.forEach(track => {
            track.addEventListener('click', () => {
                const src = track.getAttribute('data-src');
                const title = track.innerText;

                tracks.forEach(t => t.classList.remove('active'));
                track.classList.add('active');

                engine.src = src;
                engine.play();
                
                if (trackDisplay) trackDisplay.innerText = title;
                masterBtn.classList.add('playing');
            });
        });

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

    // --- 5. MODULE: UI UTILITIES (Back to Top) ---
    const setupUI = () => {
        const topBtn = document.getElementById('backToTop');
        if (!topBtn) return;

        // Optimized scroll listener for appearance
        window.addEventListener('scroll', () => {
            // Appears after 400px of scrolling
            if (window.pageYOffset > 400) {
                topBtn.classList.add('show');
            } else {
                topBtn.classList.remove('show');
            }
        }, { passive: true });

        // Smooth Scroll Execution
        topBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });
    };

    // --- EXECUTION ---
    loadPartials();      // Starts the partial injection sequence
    setupLightbox();     // Scans for gallery images
    setupAudioPlayer();  // Scans for audio elements
});