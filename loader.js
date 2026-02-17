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

// LIGHTBOX LOGIC: Expands thumbnails to full screen
document.addEventListener('click', (e) => {
    const link = e.target.closest('.expandable');
    if (link) {
        // Essential: Prevents the browser from leaving the page to open the image file
        e.preventDefault(); 
        
        const fullImgSrc = link.getAttribute('href');
        
        // Create the Overlay container
        const overlay = document.createElement('div');
        overlay.id = 'lightbox-overlay';
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); display: flex; align-items: center;
            justify-content: center; z-index: 9999; cursor: zoom-out;
        `;
        
        // Create the Image element
        const img = document.createElement('img');
        img.src = fullImgSrc;
        img.style = "max-width: 90%; max-height: 90%; border: 2px solid #fff; background: #222; box-shadow: 0 0 50px rgba(0,0,0,0.5);";
        
        // Local testing fallback: if image is missing, show a styled "missing" box
        img.onerror = () => { 
            img.alt = "Image not found locally"; 
            img.style.padding = "40px";
            img.style.color = "#fff";
            img.style.fontFamily = "Arial, sans-serif";
        };

        overlay.appendChild(img);
        document.body.appendChild(overlay);
        
        // Remove the overlay (close lightbox) when the user clicks anywhere
        overlay.onclick = () => overlay.remove();
    }
});

