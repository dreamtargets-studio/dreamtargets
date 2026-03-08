async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
    } catch (error) {
        console.error('Error loading ' + filePath, error);
    }
}

function highlightActiveLink() {
    // Get the current page filename (e.g., 'digital-stories.html')
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // If the URL contains the link's href, light it up!
        if (currentPath.includes(linkHref) && linkHref !== "") {
            link.classList.add('active');
        }
        
        // Special case for Home page
        if (currentPath.endsWith('/dreamtargets/') && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
}




window.addEventListener('DOMContentLoaded', () => {
    loadComponent('main-nav', 'header.html');
    loadComponent('main-footer', 'footer.html');
});


window.addEventListener('scroll', () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (window.scrollY > 40) { // Appears after 400px of scrolling
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('main-nav', 'header.html');
    await loadComponent('main-footer', 'footer.html');
    
    highlightActiveLink(); // The new step
    initBackToTop();
});

// The Jump-to-Top Logic
document.addEventListener('click', (e) => {
    if (e.target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});


/* Simple Lightbox Logic */
document.addEventListener('click', (e) => {
    const link = e.target.closest('.expandable');
    if (link) {
        e.preventDefault();
        const fullImgSrc = link.getAttribute('href');
        
        // Create Overlay
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); display: flex; align-items: center;
            justify-content: center; z-index: 2000; cursor: zoom-out;
        `;
        
        const img = document.createElement('img');
        img.src = fullImgSrc;
        img.style = "max-width: 90%; max-height: 90%; border: 2px solid #fff;";
        
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        
        overlay.onclick = () => overlay.remove();
    }
});

/* --- Append to the bottom of loader.js --- */

/* --- UNIFIED GRID LIGHTBOX v1.3 --- */
document.addEventListener('click', (e) => {
    // 1. SELECTOR: Target images in Editorial Galleries OR Archive Frames
    const clickedImg = e.target.closest('.gallery-grid img, .gallery-grid-3 img, .frame-16-9 img, .panoramic-hero');
    
    if (clickedImg) {
        const lightbox = document.getElementById('lightbox-overlay');
        const lightboxImg = document.getElementById('lightbox-img');
        
        if (lightbox && lightboxImg) {
            // 2. LOGIC: Use high-res 'data-full' if available, otherwise use standard 'src'
            const targetImage = clickedImg.getAttribute('data-full') || clickedImg.src;
            
            lightbox.style.display = "flex";
            lightboxImg.src = targetImage;
            
            // Optional: Prevent background scrolling while viewing
            document.body.style.overflow = 'hidden';
        }
    }

    // 3. CLOSE LOGIC: If clicking the Close 'X' or the dark background
    if (e.target.id === 'lightbox-overlay' || e.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox-overlay');
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightbox) {
            lightbox.style.display = "none";
            lightboxImg.src = ""; // Clear image to prevent "ghosting" on next open
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }
});

// 4. KEYBOARD SUPPORT (Escape to close)
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