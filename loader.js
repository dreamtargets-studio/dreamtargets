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
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
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


