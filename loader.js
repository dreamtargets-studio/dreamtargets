/* ============================================================
   THINKAMIGO UNIFIED LOADER & INJECTOR v22.11
   Architecture: Triple-Slot Filmstrip (Left | Center | Right)
   Updates: STABLE BUILD | Keyboard Navigation Added (Haptic Bridge)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THE INJECTOR ENGINE ---
    const loadPartials = async () => {
        try {
            // Load Header
            const hRes = await fetch('header.html');
            if (hRes.ok) {
                const hData = await hRes.text();
                const hSocket = document.getElementById('main-nav');
                if (hSocket) { 
                    hSocket.innerHTML = hData; 
                    setupMobileMenu(); 
                }
            }

            // Load Footer
            const fRes = await fetch('footer.html');
            if (fRes.ok) {
                const fData = await fRes.text();
                const fSocket = document.getElementById('main-footer');
                if (fSocket) { 
                    fSocket.innerHTML = fData; 
                    setupUI(); 
                    setupAudioPlayer(); 
                }
            }

            // Lightbox check for images/videos
            if (document.querySelector('img[data-full]') || document.querySelector('.video-item')) {
                injectLightbox();
            }

        } catch (err) {
            console.warn("Partial injection missed a step:", err);
        }
    };

    // --- 2. MODULE: LIGHTBOX INJECTOR & ENGINE ---
    const injectLightbox = () => {
        if (document.getElementById('lightbox-overlay')) return;

        const lb = document.createElement('div');
        lb.id = 'lightbox-overlay';
        lb.className = 'lightbox';
        
        if (document.body.classList.contains('comic-mode')) {
            lb.classList.add('comic-mode');
        }

        lb.innerHTML = `
            <div class="lightbox-close"></div>
            <div class="lightbox-prev" id="prev-btn"></div>
            <div class="lightbox-next" id="next-btn"></div>
            <div class="lightbox-track" id="lb-track">
                <div class="lb-slot" id="slot-prev"></div>
                <div class="lb-slot" id="slot-curr"></div>
                <div class="lb-slot" id="slot-next"></div>
            </div>
            <div class="lightbox-info">
                <span class="lightbox-caption" id="lb-cap"></span>
            </div>
        `;
        document.body.appendChild(lb);
        setupLightboxLogic();
        setupVideoLogic(); 
    };

    const setupLightboxLogic = () => {
        const overlay = document.getElementById('lightbox-overlay');
        const track = document.getElementById('lb-track');
        const slotPrev = document.getElementById('slot-prev');
        const slotCurr = document.getElementById('slot-curr');
        const slotNext = document.getElementById('slot-next');
        const lbCap = document.getElementById('lb-cap');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        let currentGallery = [];
        let currentIndex = 0;
        let touchStartX = 0;
        let isAnimating = false;

        const prepareSlots = () => {
            const total = currentGallery.length;
            const prevIdx = (currentIndex - 1 + total) % total;
            const nextIdx = (currentIndex + 1) % total;
            const getImg = (idx) => `<img src="${currentGallery[idx].getAttribute('data-full')}" class="lightbox-content">`;

            slotCurr.innerHTML = getImg(currentIndex);
            const rawCap = currentGallery[currentIndex].getAttribute('alt') || "";
            const isComic = document.body.classList.contains('comic-mode');
            const sep = rawCap ? (isComic ? ` &nbsp;/&nbsp; ` : ` &nbsp;—&nbsp; `) : "";
            lbCap.innerHTML = `<span class="lb-count-accent">${currentIndex + 1} / ${total}</span>${sep}${rawCap}`;

            if (total > 1) {
                slotPrev.innerHTML = getImg(prevIdx);
                slotNext.innerHTML = getImg(nextIdx);
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            } else {
                slotPrev.innerHTML = ''; slotNext.innerHTML = '';
                prevBtn.style.display = 'none'; nextBtn.style.display = 'none';
            }
        };

        const navigate = (direction) => {
            if (isAnimating || currentGallery.length <= 1) return;
            isAnimating = true;

            const targetTranslate = direction === 1 ? -66.66 : 0;
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            track.style.transform = `translateX(${targetTranslate}%)`;

            setTimeout(() => {
                currentIndex = (currentIndex + direction + currentGallery.length) % currentGallery.length;
                track.style.transition = 'none';
                track.style.transform = 'translateX(-33.33%)';
                prepareSlots();
                isAnimating = false;
            }, 410);
        };

        const closeLB = (e) => {
            if (e) e.stopPropagation(); 
            overlay.style.display = 'none';
            document.body.classList.remove('no-scroll');
        };

        // KEYBOARD NAVIGATION (The Haptic Bridge)
        document.addEventListener('keydown', (e) => {
            // Only fire if the lightbox is actually visible
            if (overlay.style.display === 'flex') {
                if (e.key === 'ArrowRight' || e.key === ' ') {
                    e.preventDefault(); // Stop spacebar from scrolling page
                    navigate(1);
                } else if (e.key === 'ArrowLeft') {
                    navigate(-1);
                } else if (e.key === 'Escape') {
                    closeLB();
                }
            }
        });

        overlay.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        overlay.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
        }, { passive: true });

        document.addEventListener('click', (e) => {
            const clicked = e.target.closest('img[data-full]');
            if (!clicked) return;

            const galleryTag = clicked.getAttribute('data-gallery');
            currentGallery = galleryTag 
                ? Array.from(document.querySelectorAll(`img[data-gallery="${galleryTag}"]`))
                : [clicked];
            
            currentIndex = currentGallery.indexOf(clicked);
            track.style.transition = 'none';
            track.style.transform = 'translateX(-33.33%)';
            prepareSlots();
            overlay.style.display = 'flex';
            document.body.classList.add('no-scroll');
        });

        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
        overlay.querySelector('.lightbox-close').addEventListener('click', closeLB);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLB(e); });
    };

    // --- 3. MODULE: VIDEO/AUDIO/UI ENGINE ---
    const setupVideoLogic = () => {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.video-item');
            if (!trigger) return;
            const id = trigger.getAttribute('data-video-id');
            const url = `https://player.vimeo.com/video/${id}?autoplay=1&color=f39c12`;
            document.getElementById('slot-curr').innerHTML = `<div class="video-stage"><iframe src="${url}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;
            document.getElementById('lightbox-overlay').style.display = 'flex';
            document.body.classList.add('no-scroll');
        });
    };

    const setupMobileMenu = () => {
        const checkbox = document.getElementById('menu-toggle');
        if (!checkbox) return;
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => { checkbox.checked = false; });
        });
    };

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
});