/* --- THINKAMIGO MASTER LOADER & LIGHTBOX v2.0 --- */

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
        if (currentPath.endsWith('/dreamtargets/') && linkHref === 'index.html') {
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
 * 5. UNIFIED GALLERY & LIGHTBOX ENGINE
 */

let currentGallery = []; 
let currentIndex = 0;

function updateLightbox(index) {
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');

    if (!lightboxImg) return;

    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;
    
    currentIndex = index;
    const targetImage = currentGallery[currentIndex];
    
    // Smooth transition
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        const fullSrc = targetImage.getAttribute('data-full') || targetImage.src;
        lightboxImg.src = fullSrc;
        
        if (caption) caption.textContent = targetImage.getAttribute('alt') || "";
        if (counter) counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
        
        lightboxImg.style.opacity = '1';
    }, 150);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox) {
        // Remove the style attribute to let CSS "display: none !important" take back control
        lightbox.removeAttribute('style'); 
        if (lightboxImg) lightboxImg.src = ""; 
        document.body.style.overflow = 'auto';
    }
}

// Global Click Manager (Intentional Close Only)
document.addEventListener('click', (e) => {
    
    // A. Back to Top Logic
    if (e.target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // B. Lightbox Open Logic
    const galleryImg = e.target.closest('img[data-full]');
    
    if (galleryImg) {
        const galleryName = galleryImg.getAttribute('data-gallery');

        // If the image isn't part of a gallery folder, do nothing.
        if (!galleryName) return;

        const lightbox = document.getElementById('lightbox-overlay');
        
        currentGallery = Array.from(document.querySelectorAll(`img[data-gallery="${galleryName}"]`));
        currentIndex = currentGallery.indexOf(galleryImg);
        
        if (lightbox) {
            // Overrides the CSS "none" only when a valid gallery click occurs
            lightbox.setAttribute('style', 'display: flex !important'); 
            document.body.style.overflow = 'hidden'; 
            updateLightbox(currentIndex);
        }
        return;
    }

    // C. Lightbox Internal Navigation & Close
    if (e.target.classList.contains('lightbox-next')) {
        updateLightbox(currentIndex + 1);
    } 
    else if (e.target.classList.contains('lightbox-prev')) {
        updateLightbox(currentIndex - 1);
    }
    // MODIFIED: We no longer check for the overlay ID here.
    // This prevents accidental closing when clicking the background.
    else if (e.target.classList.contains('lightbox-close')) {
        closeLightbox();
    }
});

/**
 * 6. ACCESSIBILITY (Keyboard Nav)
 */
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox-overlay');
    // Check if the lightbox is actually visible via the style attribute
    if (lightbox && lightbox.getAttribute('style')?.includes('flex')) {
        if (e.key === "ArrowRight") updateLightbox(currentIndex + 1);
        if (e.key === "ArrowLeft") updateLightbox(currentIndex - 1);
        if (e.key === "Escape") closeLightbox();
    }
});