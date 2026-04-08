/* ============================================================
   THINKAMIGO UNIFIED LOADER & INJECTOR v21.5
   Features: Context-Aware Injection, Persistent DOM Lightbox
   Architecture: High-Fidelity Kinetic Cross-Fade
   Updates: Aspect-Ratio Lock, Zero-Jump Footer, Target-Swapping
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THE INJECTOR ENGINE ---
    const loadPartials = async () => {
        try {
            const hRes = await fetch('header.html');
            if (hRes.ok) {
                const hData = await hRes.text();
                const headerSocket = document.getElementById('main-nav');
                if (headerSocket) {
                    headerSocket.innerHTML = hData;
                    setupMobileMenu();
                }
            }

            const fRes = await fetch('footer.html');
            if (fRes.ok) {
                const fData = await fRes.text();
                const footerSocket = document.getElementById('main-footer');
                if (footerSocket) {
                    footerSocket.innerHTML = fData;
                    setupUI(); 
                }
            }

            const needsGallery = document.querySelector('img[data-full]');
            const needsVideo = document.querySelector('.video-item');
            
            if (needsGallery || needsVideo) {
                injectLightbox();
            }

        } catch (err) {
            console.error("Critical: Partial injection failed.", err);
        }
    };

    // --- 2. MODULE: LIGHTBOX INJECTOR & ENGINE (Persistent Mode) ---
    const injectLightbox = () => {
        if (document.getElementById('lightbox-overlay')) return;

        const lb = document.createElement('div');
        lb.id = 'lightbox-overlay';
        lb.className = 'lightbox';
        // Persistent structure: elements are created once, swapped later
        lb.innerHTML = `
            <div class="lightbox-close"></div>
            <div class="lightbox-prev" id="prev-btn"></div>
            <div class="lightbox-next" id="next-btn"></div>
            <div class="lightbox-wrapper">
                <img class="lightbox-content" id="lb-main-img" src="">
                <div class="lightbox-info">
                    <span class="lightbox-caption" id="lb-cap"></span>
                    <span class="lightbox-counter" id="lb-count"></span>
                </div>
            </div>
        `;
        document.body.appendChild(lb);
        setupLightboxLogic();
        setupVideoLogic(); 
    };

    const setupLightboxLogic = () => {
        const overlay = document.getElementById('lightbox-overlay');
        const lbWrapper = document.querySelector('.lightbox-wrapper');
        const lbImg = document.getElementById('lb-main-img');
        const lbCap = document.getElementById('lb-cap');
        const lbCount = document.getElementById('lb-count');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        let currentGallery = [];
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        const updateLightbox = () => {
            const currentItem = currentGallery[currentIndex];
            
            // Trigger Fade Out/Scale via CSS
            lbWrapper.classList.add('lightbox-animating');

            // Swap content during the transparent state
            setTimeout(() => {
                lbImg.src = currentItem.getAttribute('data-full');
                lbCap.textContent = currentItem.getAttribute('alt') || "";
                
                if (currentGallery.length > 1) {
                    lbCount.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
                    lbCount.style.display = 'inline-block';
                    prevBtn.style.display = 'block';
                    nextBtn.style.display = 'block';
                } else {
                    lbCount.style.display = 'none';
                    prevBtn.style.display = 'none';
                    nextBtn.style.display = 'none';
                }
                
                // Fade In
                lbWrapper.classList.remove('lightbox-animating');
            }, 150); 
        };

        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) nextBtn.click();
            if (touchEndX > touchStartX + swipeThreshold) prevBtn.click();
        };

        overlay.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        overlay.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

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
            document.body.style.overflow = 'hidden';
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

        const closeLB = (e) => {
            if (e) e.stopPropagation(); 
            overlay.style.display = 'none';
            lbImg.src = ''; // Clear image to free memory
            document.body.style.overflow = 'auto';
        };

        const closeBtn = overlay.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLB);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLB(e);
        });

        document.addEventListener('keydown', (e) => {
            if (overlay.style.display === 'flex') {
                if (e.key === 'Escape') closeLB();
                if (e.key === 'ArrowRight' && currentGallery.length > 1) nextBtn.click();
                if (e.key === 'ArrowLeft' && currentGallery.length > 1) prevBtn.click();
            }
        });
    };

    // --- 3. MODULE: VIDEO ENGINE ---
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

            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';

            // Videos still require innerHTML because of iframe instantiation
            lbWrapper.innerHTML = `
                <div class="video-stage">
                    <iframe src="${url}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                </div>
            `;
            
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
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