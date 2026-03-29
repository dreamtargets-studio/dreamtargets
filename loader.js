/* ============================================================
   THINKAMIGO MASTER LOADER & LIGHTBOX v4.0 (MOTION EDITION)
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
let isAnimating = false; // Prevents animation overlap glitches

function updateLightbox(index, direction = 'next') {
    if (isAnimating) return;
    
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightboxImg) return;

    isAnimating = true;

    // A. SLIDE OUT: Move current image in the direction of travel
    lightboxImg.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s';
    lightboxImg.style.opacity = '0';
    // If 'next', fly left (-100px). If 'prev', fly right (100px).
    lightboxImg.style.transform = direction === 'next' ? 'translateX(-100px)' : 'translateX(100px)';

    setTimeout(() => {
        // B. INDEX LOGIC
        if (index < 0) index = currentGallery.length - 1;
        if (index >= currentGallery.length) index = 0;
        currentIndex = index;
        
        const targetImage = currentGallery[currentIndex];
        const isGallery = currentGallery.length > 1;

        // C. PREP NEW IMAGE: Teleport it to the opposite side while invisible
        lightboxImg.style.transition = 'none';
        lightboxImg.style.transform = direction === 'next' ? 'translateX(100px)' : 'translateX(-100px)';
        
        // D. UPDATE CONTENT
        const fullSrc = targetImage.getAttribute('data-full') || targetImage.src;
        lightboxImg.src = fullSrc;
        
        if (caption) caption.innerHTML = targetImage.getAttribute('alt') || "";
        
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
            counter.style.setProperty('display', isGallery ? 'block' : 'none', 'important');
        }

        if (prevBtn) prevBtn.style.setProperty('display', isGallery ? 'flex' : 'none', 'important');
        if (nextBtn) nextBtn.style.setProperty('display', isGallery ? 'flex' : 'none', 'important');

        // E. SLIDE IN: Bring it back to center
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

// Swipe Listeners
document.addEventListener('touchstart', e => { 
    touchStartX = e.changedTouches[0].screenX; 
}, {passive: true});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const threshold = 70; // Slightly higher for iPad stability
    const lightbox = document.getElementById('lightbox-overlay');
    
    if (lightbox && lightbox.getAttribute('style')?.includes('flex') && currentGallery.length > 1) {
        if (touchEndX < touchStartX - threshold) updateLightbox(currentIndex + 1, 'next');
        if (touchEndX > touchStartX + threshold) updateLightbox(currentIndex - 1, 'prev');
    }
}, false);

// Click Logic
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

    // Ghost Controls
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