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