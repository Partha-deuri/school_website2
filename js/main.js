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
    
    // Only apply the scroll effect if the nav starts transparent (like on the homepage)
    if (nav && (nav.style.background === 'transparent' || nav.style.background === '')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    /* =========================================
       4. HERO SLIDESHOW ANIMATION
       ========================================= */
    const slides = document.querySelectorAll('.slide');
    
    // Safety check: Only run this script if the slider exists on the current page
    if (slides.length > 0) {
        let currentSlide = 0;
        
        // Change image every 5 seconds (5000 milliseconds)
        setInterval(() => {
            // Hide the current image
            slides[currentSlide].classList.remove('active');
            
            // Calculate the next image using modulo logic to loop back to 0
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Show the new image
            slides[currentSlide].classList.add('active');
        }, 5000); 
    }
});