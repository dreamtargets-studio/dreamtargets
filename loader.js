/* ============================================================
   THINKAMIGO MASTER LOADER & LIGHTBOX v3.0 (GHOST SUITE)
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
 * 5. UNIFIED GALLERY & LIGHTBOX ENGINE (v3.0 Ghost Version)
 */
let currentGallery = []; 
let currentIndex = 0;

function updateLightbox(index) {
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');

    if (!lightboxImg) return;

    // Boundary check (looping)
    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;
    
    currentIndex = index;
    const targetImage = currentGallery[currentIndex];
    
    // Smooth transition between images
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        const fullSrc = targetImage.getAttribute('data-full') || targetImage.src;
        lightboxImg.src = fullSrc;
        
        if (caption) {
            caption.innerHTML = targetImage.getAttribute('alt') || "";
        }
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
        }
        
        lightboxImg.style.opacity = '1';
    }, 150);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox) {
        lightbox.removeAttribute('style'); // Return to CSS "display: none !important"
        if (lightboxImg) lightboxImg.src = ""; 
        document.body.style.overflow = 'auto';
    }
}

/**
 * 6. GLOBAL CLICK MANAGER
 */
document.addEventListener('click', (e) => {
    
    // A. Back to Top Logic
    if (e.target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // B. Lightbox Open Logic
    // This finds any image with a "data-full" attribute
    const galleryImg = e.target.closest('img[data-full]');
    
    if (galleryImg) {
        const galleryName = galleryImg.getAttribute('data-gallery');
        if (!galleryName) return; // Ignore single images not in a gallery set

        const lightbox = document.getElementById('lightbox-overlay');
        
        // Find all images in the same "folder" (data-gallery)
        currentGallery = Array.from(document.querySelectorAll(`img[data-gallery="${galleryName}"]`));
        currentIndex = currentGallery.indexOf(galleryImg);
        
        if (lightbox) {
            lightbox.setAttribute('style', 'display: flex !important'); 
            document.body.style.overflow = 'hidden'; 
            updateLightbox(currentIndex);
        }
        return;
    }

    // C. Internal Ghost Navigation & Close
    // Uses .closest() to ensure clicking the chevron icon triggers the parent square
    if (e.target.closest('.lightbox-next')) {
        updateLightbox(currentIndex + 1);
    } 
    else if (e.target.closest('.lightbox-prev')) {
        updateLightbox(currentIndex - 1);
    }
    else if (e.target.closest('.lightbox-close')) {
        closeLightbox();
    }
});

/**
 * 7. ACCESSIBILITY (Keyboard Nav)
 */
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox-overlay');
    // Check if lightbox is open via the style attribute
    if (lightbox && lightbox.getAttribute('style')?.includes('flex')) {
        if (e.key === "ArrowRight") updateLightbox(currentIndex + 1);
        if (e.key === "ArrowLeft") updateLightbox(currentIndex - 1);
        if (e.key === "Escape") closeLightbox();
    }
});