/* --- THINKAMIGO MASTER LOADER & LIGHTBOX v1.5 --- */

/**
 * 1. COMPONENT LOADER
 * Fetches HTML files (header/footer) and injects them into the DOM
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
 * Highlights the active menu item based on the current URL
 */
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Check if current path includes the link href (excluding empty links)
        if (linkHref && currentPath.includes(linkHref) && linkHref !== "") {
            link.classList.add('active');
        }
        // Fallback for root/index
        if (currentPath.endsWith('/dreamtargets/') && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
}

/**
 * 3. INITIALIZATION
 * Runs when the page is ready
 */
window.addEventListener('DOMContentLoaded', async () => {
    // Load components first so we can manipulate them
    await loadComponent('main-nav', 'header.html');
    await loadComponent('main-footer', 'footer.html');
    
    // Once components are loaded, run sync tasks
    highlightActiveLink();
});

/**
 * 4. SCROLL WATCHER
 * Handles the visibility of the "Back to Top" button
 */
window.addEventListener('scroll', () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (window.scrollY > 40) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    }
});

/**
 * 5. GLOBAL CLICK MANAGER (Unified)
 * One listener to rule them all: Back to Top and Unified Lightbox
 */
document.addEventListener('click', (e) => {
    
    // A. Back to Top Logic
    if (e.target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // B. UNIFIED LIGHTBOX OPEN LOGIC
    // Targets images in .gallery-grid, .gallery-grid-3, .frame-16-9, or .expandable links
    const galleryImg = e.target.closest('.gallery-grid img, .gallery-grid-3 img, .frame-16-9 img, .expandable img, .panoramic-hero');
    
    if (galleryImg) {
        // Prevent default behavior (stops <a> links from opening the raw image file)
        e.preventDefault(); 

        const lightbox = document.getElementById('lightbox-overlay');
        const lightboxImg = document.getElementById('lightbox-img');
        
        if (lightbox && lightboxImg) {
            // Resolve high-res source: 
            // 1. Check data-full attribute (Archive Grid)
            // 2. Check if wrapped in an <a> tag with an href (Blog Gallery)
            // 3. Fallback to the current img src
            const parentLink = galleryImg.closest('a');
            const highRes = galleryImg.getAttribute('data-full') || 
                            (parentLink ? parentLink.getAttribute('href') : null) || 
                            galleryImg.src;
            
            lightbox.style.display = "flex";
            lightboxImg.src = highRes;
            
            // Lock body scroll to prevent "shifting" behind the lightbox
            document.body.style.overflow = 'hidden'; 
        }
        return;
    }

    // C. LIGHTBOX CLOSE LOGIC
    // Closes if user clicks the X or the dark background overlay
    if (e.target.id === 'lightbox-overlay' || e.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox-overlay');
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightbox) {
            lightbox.style.display = "none";
            lightboxImg.src = ""; // Flush the image to prevent ghosting on next open
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }
});

/**
 * 6. ACCESSIBILITY / KEYBOARD SUPPORT
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