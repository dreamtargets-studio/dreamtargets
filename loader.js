/* --- THINKAMIGO MASTER LOADER & LIGHTBOX v1.6 --- */

/**
 * 1. COMPONENT LOADER
 * Injects header.html and footer.html into the page
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
 * Highlights the active menu item based on the URL
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
 * Runs when the page is first loaded
 */
window.addEventListener('DOMContentLoaded', async () => {
    // Load components first
    await loadComponent('main-nav', 'header.html');
    await loadComponent('main-footer', 'footer.html');
    
    // Run sync tasks after components exist in the DOM
    highlightActiveLink();
});

/**
 * 4. SCROLL WATCHER
 * Toggles the "Back to Top" button visibility
 */
window.addEventListener('scroll', () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (window.scrollY > 40) btn.classList.add("show");
        else btn.classList.remove("show");
    }
});

/**
 * 5. GLOBAL CLICK MANAGER
 * Handles Lightbox opening/closing and Back to Top clicks
 */
document.addEventListener('click', (e) => {
    
    // A. Back to Top Logic
    if (e.target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // B. UNIFIED LIGHTBOX OPEN LOGIC
    // Targets images in the text rail, editorial galleries, or archive frames
    const galleryImg = e.target.closest('.text-rail img, .gallery-grid img, .gallery-grid-3 img, .frame-16-9 img, .panoramic-hero');
    
    if (galleryImg) {
        const lightbox = document.getElementById('lightbox-overlay');
        const lightboxImg = document.getElementById('lightbox-img');
        
        if (lightbox && lightboxImg) {
            // Priority: data-full attribute -> fallback to current src
            const fullImage = galleryImg.getAttribute('data-full') || galleryImg.src;
            
            lightbox.style.display = "flex";
            lightboxImg.src = fullImage;
            
            // Prevent background page from scrolling
            document.body.style.overflow = 'hidden'; 
        }
    }

    // C. LIGHTBOX CLOSE LOGIC
    // Closes if clicking the 'X' button or the dark background
    if (e.target.id === 'lightbox-overlay' || e.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox-overlay');
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightbox) {
            lightbox.style.display = "none";
            lightboxImg.src = ""; // Clear source to prevent "ghosting"
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }
});

/**
 * 6. ACCESSIBILITY
 * Allows closing the lightbox with the Escape key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        const lightbox = document.getElementById('lightbox-overlay');
        if (lightbox && lightbox.style.display === "flex") {
            lightbox.style.display = "none";
            document.getElementById('lightbox-img').src = "";
            document.body.style.overflow = 'auto';
        }
    }
});