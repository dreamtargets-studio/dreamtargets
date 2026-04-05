/* ============================================================
   THINKAMIGO UNIFIED LOADER & INJECTOR v20.4
   Features: Auto-Injection, One vs. Many Lightbox, Audio Engine
   Architecture: Pixel-Strict Asset Handling (16:9 & A4)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THE INJECTOR ENGINE (Header, Footer, Lightbox) ---
    const loadPartials = async () => {
        try {
            // Fetch and Inject Header
            const hRes = await fetch('header.html');
            if (hRes.ok) {
                const hData = await hRes.text();
                const headerSocket = document.getElementById('main-nav');
                if (headerSocket) {
                    headerSocket.innerHTML = hData;
                    setupMobileMenu();
                }
            }

            // Fetch and Inject Footer
            const fRes = await fetch('footer.html');
            if (fRes.ok) {
                const fData = await fRes.text();
                const footerSocket = document.getElementById('main-footer');
                if (footerSocket) {
                    footerSocket.innerHTML = fData;
                    setupUI(); 
                }
            }

            // AUTO-INJECT LIGHTBOX BONES
            // We do this here so it's ready regardless of page content
            injectLightbox();

        } catch (err) {
            console.error("Critical: Partial injection failed.", err);
        }
    };

    // --- 2. MODULE: LIGHTBOX INJECTOR & ENGINE ---
    const injectLightbox = () => {
        if (document.getElementById('lightbox-overlay')) return;

        const lb = document.createElement('div');
        lb.id = 'lightbox-overlay';
        lb.className = 'lightbox';
        lb.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-prev" id="prev-btn"></div>
            <div class="lightbox-next" id="next-btn"></div>
            <div class="lightbox-wrapper">
                <img class="lightbox-content" id="lightbox-img" src="">
                <div class="lightbox-info">
                    <span id="lightbox-caption" class="lightbox-caption"></span>
                    <span id="lightbox-counter" class="lightbox-counter"></span>
                </div>
            </div>
        `;
        document.body.appendChild(lb);
        setupLightboxLogic();
    };

    const setupLightboxLogic = () => {
        const overlay = document.getElementById('lightbox-overlay');
        const lbImg = document.getElementById('lightbox-img');
        const lbCaption = document.getElementById('lightbox-caption');
        const lbCounter = document.getElementById('lightbox-counter');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        let currentGallery = [];
        let currentIndex = 0;

        const updateLightbox = () => {
            const currentItem = currentGallery[currentIndex];
            // Clear current src to prevent "ghosting" while new high-res loads
            lbImg.src = ''; 
            lbImg.src = currentItem.getAttribute('data-full');
            lbCaption.innerText = currentItem.getAttribute('alt');

            // ONE vs MANY LOGIC (Hides Nav if standalone)
            if (currentGallery.length > 1) {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
                lbCounter.innerText = `${currentIndex + 1} / ${currentGallery.length}`;
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                lbCounter.innerText = '';
            }
        };

        // EVENT DELEGATION: Listens for clicks on any thumbnail with data-full
        document.addEventListener('click', (e) => {
            const clicked = e.target.closest('img[data-full]');
            if (!clicked) return;

            const galleryTag = clicked.getAttribute('data-gallery');
            if (galleryTag) {
                // Group by gallery tag (e.g. "publications" or "comic-issue-1")
                currentGallery = Array.from(document.querySelectorAll(`img[data-gallery="${galleryTag}"]`));
                currentIndex = currentGallery.indexOf(clicked);
            } else {
                // Standalone image mode
                currentGallery = [clicked];
                currentIndex = 0;
            }

            updateLightbox();
            overlay.style.display = 'flex';
        });

        // NAVIGATION: Next
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightbox();
        });

        // NAVIGATION: Prev
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightbox();
        });

        // CLOSE LOGIC
        overlay.addEventListener('click', (e) => {
            // Closes if clicking background, X button, or if specific targets hit
            if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
                overlay.style.display = 'none';
                lbImg.src = ''; // Clean memory
            }
        });

        // Keyboard Support (Esc to close, arrows to nav)
        document.addEventListener('keydown', (e) => {
            if (overlay.style.display === 'flex') {
                if (e.key === 'Escape') overlay.style.display = 'none';
                if (e.key === 'ArrowRight' && currentGallery.length > 1) nextBtn.click();
                if (e.key === 'ArrowLeft' && currentGallery.length > 1) prevBtn.click();
            }
        });
    };

    // --- 3. MODULE: MOBILE MENU (Auto-close on click) ---
    const setupMobileMenu = () => {
        const checkbox = document.getElementById('menu-toggle');
        if (!checkbox) return;
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => { checkbox.checked = false; });
        });
    };

    // --- 4. MODULE: AUDIO ENGINE (Playlist logic) ---
    const setupAudioPlayer = () => {
        const engine = document.getElementById('main-audio-engine');
        const masterBtn = document.getElementById('masterPlayBtn');
        if (!engine || !masterBtn) return;

        document.querySelectorAll('.track-item').forEach(track => {
            track.addEventListener('click', () => {
                engine.src = track.getAttribute('data-src');
                engine.play();
                masterBtn.classList.add('playing');
            });
        });

        masterBtn.addEventListener('click', () => {
            engine.paused ? engine.play() : engine.pause();
            masterBtn.classList.toggle('playing');
        });
    };

    // --- 5. MODULE: UI UTILITIES (Scroll Behavior) ---
    const setupUI = () => {
        const topBtn = document.getElementById('backToTop');
        if (!topBtn) return;
        window.addEventListener('scroll', () => {
            window.scrollY > 400 ? topBtn.classList.add('show') : topBtn.classList.remove('show');
        }, { passive: true });
        topBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // --- INITIAL EXECUTION ---
    loadPartials();
    setupAudioPlayer();

});