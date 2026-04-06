/* ============================================================
   THINKAMIGO UNIFIED LOADER & INJECTOR v21.0
   Features: Context-Aware Injection, Vimeo-Exclusive Video Engine
   Architecture: High-Fidelity Cinematic Overlay
   Updates: Conditional Lightbox Check (Fixes Footer Leak)
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

            // --- THE CLEAN CHECK ---
            // Only inject lightbox bones if the page actually uses them
            const needsGallery = document.querySelector('img[data-full]');
            const needsVideo = document.querySelector('.video-item');
            
            if (needsGallery || needsVideo) {
                injectLightbox();
            }

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
            <div class="lightbox-wrapper"></div>
        `;
        document.body.appendChild(lb);
        setupLightboxLogic();
        setupVideoLogic(); 
    };

    const setupLightboxLogic = () => {
        const overlay = document.getElementById('lightbox-overlay');
        const lbWrapper = document.querySelector('.lightbox-wrapper');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        let currentGallery = [];
        let currentIndex = 0;

        const updateLightbox = () => {
            const currentItem = currentGallery[currentIndex];
            const fullSrc = currentItem.getAttribute('data-full');
            const caption = currentItem.getAttribute('alt');
            
            lbWrapper.innerHTML = `
                <img class="lightbox-content" id="lightbox-img" src="${fullSrc}">
                <div class="lightbox-info">
                    <span id="lightbox-caption" class="lightbox-caption">${caption}</span>
                    <span id="lightbox-counter" class="lightbox-counter"></span>
                </div>
            `;

            const lbCounter = document.getElementById('lightbox-counter');

            if (currentGallery.length > 1) {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
                lbCounter.innerText = `${currentIndex + 1} / ${currentGallery.length}`;
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
        };

        document.addEventListener('click', (e) => {
            const clicked = e.target.closest('img[data-full]');
            if (!clicked) return;

            const galleryTag = clicked.getAttribute('data-gallery');
            if (galleryTag) {
                currentGallery = Array.from(document.querySelectorAll(`img[data-gallery="${galleryTag}"]`));
                currentIndex = currentGallery.indexOf(clicked);
            } else {
                currentGallery = [clicked];
                currentIndex = 0;
            }

            updateLightbox();
            overlay.style.display = 'flex';
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightbox();
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightbox();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
                overlay.style.display = 'none';
                lbWrapper.innerHTML = ''; 
            }
        });

        document.addEventListener('keydown', (e) => {
            if (overlay.style.display === 'flex') {
                if (e.key === 'Escape') {
                    overlay.style.display = 'none';
                    lbWrapper.innerHTML = '';
                }
                if (e.key === 'ArrowRight' && currentGallery.length > 1) nextBtn.click();
                if (e.key === 'ArrowLeft' && currentGallery.length > 1) prevBtn.click();
            }
        });
    };

    // --- 3. MODULE: VIDEO ENGINE (Vimeo Optimized) ---
    const setupVideoLogic = () => {
        const overlay = document.getElementById('lightbox-overlay');
        const lbWrapper = document.querySelector('.lightbox-wrapper');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        document.addEventListener('click', (e) => {
            const videoTrigger = e.target.closest('.video-item');
            if (!videoTrigger) return;

            const id = videoTrigger.getAttribute('data-video-id');
            const url = `https://player.vimeo.com/video/${id}?autoplay=1&color=f39c12&title=0&byline=0&portrait=0`;

            // Clear gallery nav for theater mode
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';

            lbWrapper.innerHTML = `
                <div class="video-stage">
                    <iframe src="${url}" 
                            frameborder="0"
                            allow="autoplay; fullscreen" 
                            allowfullscreen></iframe>
                </div>
            `;
            
            overlay.style.display = 'flex';
        });
    };

    // --- 4. MODULE: MOBILE MENU ---
    const setupMobileMenu = () => {
        const checkbox = document.getElementById('menu-toggle');
        if (!checkbox) return;
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => { checkbox.checked = false; });
        });
    };

    // --- 5. MODULE: AUDIO ENGINE ---
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

    // --- 6. MODULE: UI UTILITIES ---
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

    loadPartials();
    setupAudioPlayer();

});