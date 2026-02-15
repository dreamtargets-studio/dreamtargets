async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
    } catch (error) {
        console.error('Error loading ' + filePath, error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadComponent('main-nav', 'header.html');
    loadComponent('main-footer', 'footer.html');
});


window.addEventListener('scroll', () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (window.scrollY > 400) { // Appears after 400px of scrolling
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    }
});

// The Jump-to-Top Logic
document.addEventListener('click', (e) => {
    if (e.target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});