/* ============================================================
   THINKAMIGO UNIFIED LOADER & INJECTOR v20.0
   Features: HTML Partials, Lightbox, Audio Engine, UI Utils
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THE INJECTOR ENGINE (The "Glue") ---
    // This fetches your external HTML files and plugs them into the sockets.
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
                if (footerSocket) footerSocket.innerHTML = fData;
            }

            // After injection is complete, initialize any dynamic UI (like mobile menus)
            setupMobileMenu();

        } catch (err) {
            console.error("Critical: Partial injection failed.", err);
        }
    };

    // --- 2. MODULE: MOBILE MENU (Handles the Hamburger) ---
    const setupMobileMenu = () => {
        const btn = document.getElementById('menu-toggle');
        const nav = document.querySelector('.nav-links');
        // If you are using the Checkbox Hack in CSS, this JS is a backup 
        // but it's good to have for future interactive states.
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

    // --- EXECUTION ---
    loadPartials();    // Runs the fetch for header/footer
    setupLightbox();   // Scans for gallery images
    setupAudioPlayer(); // Scans for audio elements
    setupUI();         // Scans for scroll buttons
});