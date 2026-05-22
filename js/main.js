document.addEventListener('DOMContentLoaded', () => {
    console.log("School Website Loaded Successfully.");
    
    // Example: Highlight current page in nav
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('nav a');
    menuItem.forEach(link => {
        if(link.href === currentLocation) {
            link.style.fontWeight = "bold";
        }
    });
});

// Wait for the HTML to fully load
document.addEventListener('DOMContentLoaded', () => {
    
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Safety check: only run if both elements exist on the page
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            console.log("Hamburger clicked!"); // Helps with debugging
        });
    } else {
        console.error("Could not find the hamburger or nav-links ID in the HTML.");
    }
    
});