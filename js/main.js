// Wait for the HTML to fully load before running scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log("GHSS Jengging Website Loaded Successfully.");

    /* =========================================
       1. ACTIVE NAVIGATION LINK HIGHLIGHTING
       ========================================= */
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-links a');
    
    menuItems.forEach(link => {
        // If the link matches the current URL, add the 'active' class (which gives it the gold underline)
        if(link.href === currentLocation) {
            link.classList.add('active');
        }
    });

    /* =========================================
       2. MOBILE HAMBURGER MENU TOGGLE
       ========================================= */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Safety check: only run if both elements exist on the page
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    } else {
        console.error("Could not find the hamburger or nav-links ID in the HTML.");
    }
    
});


document.addEventListener('DOMContentLoaded', () => {
    console.log("GHSS Jengging Website Loaded Successfully.");

    /* =========================================
       1. ACTIVE NAVIGATION LINK HIGHLIGHTING
       ========================================= */
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-links a');
    
    menuItems.forEach(link => {
        if(link.href === currentLocation) {
            link.classList.add('active');
        }
    });

    /* =========================================
       2. MOBILE HAMBURGER MENU TOGGLE
       ========================================= */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    /* =========================================
       3. STICKY / SCROLLING NAVIGATION BAR
       ========================================= */
    const nav = document.querySelector('nav');
    
    // Only apply the scroll effect on the homepage (where nav starts transparent)
    if (nav.style.background === 'transparent' || nav.style.background === '') {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
});