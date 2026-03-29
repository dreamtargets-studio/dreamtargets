/* ============================================================
   THINKAMIGO MASTER LOADER & LIGHTBOX v3.5 (UNIFIED)
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
 * 4. SCROLL WATCHER (Back-to-Top Square)
 */
window.addEventListener('scroll', () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (window.scrollY > 40) btn.classList.add("show");
        else btn.classList.remove("show");
    }
});

/**
 * 5. UNIFIED GALLERY & LIGHTBOX ENGINE (v3.5 Unified)
 */
let currentGallery = []; 
let currentIndex = 0;

function updateLightbox(index) {
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightboxImg) return;

    // Loop logic
    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;
    
    currentIndex = index;
    const targetImage = currentGallery[currentIndex];
    
    // Fade out for transition
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        const fullSrc = targetImage.getAttribute('data-full') || targetImage.src;
        lightboxImg.src = fullSrc;
        
        // Update Caption
        const altText = targetImage.getAttribute('alt');
        if (caption) caption.innerHTML = altText || "";

        // UI SYNC: Only show nav and counter if it's a gallery
        const isGallery = currentGallery.length > 1;

        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
            counter.style.display = isGallery ? 'block' : 'none';
        }

        if (prevBtn) prevBtn.style.display = isGallery ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = isGallery ? 'flex' : 'none';
        
        // Fade in
        lightboxImg.style.opacity = '1';
    }, 150);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox) {
        lightbox.setAttribute('style', 'display: none !important');
        if (lightboxImg) lightboxImg.src = ""; 
        document.body.style.overflow = 'auto';
    }
}

/**
 * 6. GLOBAL CLICK MANAGER
 */
document.addEventListener('click', (e) => {
    
    // Back to Top
    if (e.target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // LIGHTBOX TRIGGER
    const galleryImg = e.target.closest('img[data-full]');
    
    if (galleryImg) {
        const galleryName = galleryImg.getAttribute('data-gallery');
        const lightbox = document.getElementById('lightbox-overlay');
        
        if (galleryName) {
            // Grouped Gallery: Find all siblings in this set
            currentGallery = Array.from(document.querySelectorAll(`img[data-gallery="${galleryName}"]`));
        } else {
            // Single Image: Create a temporary gallery of one
            currentGallery = [galleryImg];
        }

        currentIndex = currentGallery.indexOf(galleryImg);
        
        if (lightbox) {
            lightbox.setAttribute('style', 'display: flex !important'); 
            document.body.style.overflow = 'hidden'; 
            updateLightbox(currentIndex);
        }
        return;
    }

    // GHOST NAVIGATION CONTROLS
    if (e.target.closest('.lightbox-next')) {
        updateLightbox(currentIndex + 1);
    } 
    else if (e.target.closest('.lightbox-prev')) {
        updateLightbox(currentIndex - 1);
    }
    else if (e.target.closest('.lightbox-close') || (e.target.id === 'lightbox-overlay')) {
        closeLightbox();
    }
});

/**
 * 7. ACCESSIBILITY (Keyboard Nav)
 */
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox-overlay');
    if (lightbox && lightbox.getAttribute('style')?.includes('flex')) {
        if (e.key === "ArrowRight") updateLightbox(currentIndex + 1);
        if (e.key === "ArrowLeft") updateLightbox(currentIndex - 1);
        if (e.key === "Escape") closeLightbox();
    }
});