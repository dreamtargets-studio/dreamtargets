/* ============================================================
   THINKAMIGO MASTER LOADER & LIGHTBOX v4.1 (STABILITY EDITION)
   ============================================================ */

/**
 * 1. COMPONENT LOADER
 */
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const content = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = content;
        }
    } catch (error) {
        console.error('Error loading ' + filePath, error);
    }
}

/**
 * 2. NAVIGATION SYNC
 */
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && currentPath.includes(linkHref) && linkHref !== "") {
            link.classList.add('active');
        }
    });
}

/**
 * 3. INITIALIZATION
 */
window.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('main-nav', 'header.html');
    await loadComponent('main-footer', 'footer.html');
    highlightActiveLink();
});

/**
 * 4. SCROLL WATCHER
 */
window.addEventListener('scroll', () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (window.scrollY > 40) btn.classList.add("show");
        else btn.classList.remove("show");
    }
});

/**
 * 5. UNIFIED GALLERY & LIGHTBOX ENGINE (v4.0 - Motion Physics)
 */
let currentGallery = []; 
let currentIndex = 0;
let isAnimating = false;

function updateLightbox(index, direction = 'next') {
    if (isAnimating) return;
    
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightboxImg) return;
    isAnimating = true;

    lightboxImg.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s';
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = direction === 'next' ? 'translateX(-100px)' : 'translateX(100px)';

    setTimeout(() => {
        if (index < 0) index = currentGallery.length - 1;
        if (index >= currentGallery.length) index = 0;
        currentIndex = index;
        
        const targetImage = currentGallery[currentIndex];
        const isGallery = currentGallery.length > 1;

        lightboxImg.style.transition = 'none';
        lightboxImg.style.transform = direction === 'next' ? 'translateX(100px)' : 'translateX(-100px)';
        
        const fullSrc = targetImage.getAttribute('data-full') || targetImage.src;
        lightboxImg.src = fullSrc;
        
        if (caption) caption.innerHTML = targetImage.getAttribute('alt') || "";
        
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
            counter.style.setProperty('display', isGallery ? 'block' : 'none', 'important');
        }

        if (prevBtn) prevBtn.style.setProperty('display', isGallery ? 'flex' : 'none', 'important');
        if (nextBtn) nextBtn.style.setProperty('display', isGallery ? 'flex' : 'none', 'important');

        requestAnimationFrame(() => {
            setTimeout(() => {
                lightboxImg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s';
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'translateX(0)';
                isAnimating = false;
            }, 50);
        });

    }, 250);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox) {
        lightbox.setAttribute('style', 'display: none !important');
        if (lightboxImg) {
            lightboxImg.src = ""; 
            lightboxImg.style.transform = 'translateX(0)';
        }
        document.body.style.overflow = 'auto';
    }
}

/**
 * 6. GLOBAL CLICK & GESTURE MANAGER
 */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => { 
    touchStartX = e.changedTouches[0].screenX; 
}, {passive: true});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const threshold = 70;
    const lightbox = document.getElementById('lightbox-overlay');
    
    if (lightbox && lightbox.getAttribute('style')?.includes('flex') && currentGallery.length > 1) {
        if (touchEndX < touchStartX - threshold) updateLightbox(currentIndex + 1, 'next');
        if (touchEndX > touchStartX + threshold) updateLightbox(currentIndex - 1, 'prev');
    }
}, false);

document.addEventListener('click', (e) => {
    if (e.target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const galleryImg = e.target.closest('img[data-full]');
    if (galleryImg) {
        const galleryName = galleryImg.getAttribute('data-gallery');
        const lightbox = document.getElementById('lightbox-overlay');
        
        currentGallery = galleryName 
            ? Array.from(document.querySelectorAll(`img[data-gallery="${galleryName}"]`))
            : [galleryImg];

        currentIndex = currentGallery.indexOf(galleryImg);
        
        if (lightbox) {
            lightbox.setAttribute('style', 'display: flex !important'); 
            document.body.style.overflow = 'hidden'; 
            updateLightbox(currentIndex, 'next');
        }
        return;
    }

    if (e.target.closest('.lightbox-next')) updateLightbox(currentIndex + 1, 'next');
    else if (e.target.closest('.lightbox-prev')) updateLightbox(currentIndex - 1, 'prev');
    else if (e.target.closest('.lightbox-close') || (e.target.id === 'lightbox-overlay')) closeLightbox();
});

/**
 * 7. ACCESSIBILITY (Keyboard Nav)
 */
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox-overlay');
    if (lightbox && lightbox.getAttribute('style')?.includes('flex')) {
        if (e.key === "ArrowRight") updateLightbox(currentIndex + 1, 'next');
        if (e.key === "ArrowLeft") updateLightbox(currentIndex - 1, 'prev');
        if (e.key === "Escape") closeLightbox();
    }
});

/**
 * 8. INDUSTRIAL AUDIO PLAYER ENGINE
 */
document.addEventListener('click', (e) => {
    const trackItem = e.target.closest('.track-item');
    const playBtn = e.target.closest('#masterPlayBtn');
    
    const audio = document.getElementById('main-audio-engine');
    const nowPlayingText = document.getElementById('now-playing');
    const progressBar = document.getElementById('master-progress');
    const timeDisplay = document.getElementById('master-time');

    if (!audio) return;

    // A. TRACK SELECTION (Designer's Focus)
    if (trackItem) {
        document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
        trackItem.classList.add('active');

        const newSrc = trackItem.getAttribute('data-src');
        
        // Only swap if it's a different track to prevent jitter
        if (audio.getAttribute('src') !== newSrc) {
            audio.src = newSrc;
            nowPlayingText.textContent = trackItem.textContent.trim();
            audio.play();
        }
        
        if (playBtn) playBtn.classList.add('playing');
    }

    // B. PLAY/PAUSE MECHANICAL TOGGLE
    if (playBtn) {
        if (!audio.src) return; 
        if (audio.paused) {
            audio.play();
            playBtn.classList.add('playing');
        } else {
            audio.pause();
            playBtn.classList.remove('playing');
        }
    }

    // C. PROGRESS & SYMMETRICAL TIMER (00:00)
    audio.ontimeupdate = () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = pct + '%';
        }
        
        // APPLE-STANDARD FORMATTING: Always XX:XX
        const mins = Math.floor(audio.currentTime / 60).toString().padStart(2, '0');
        const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        
        if (timeDisplay) {
            timeDisplay.textContent = `${mins}:${secs}`;
        }
    };
});