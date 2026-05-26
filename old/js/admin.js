// Wait for the DOM to load before running scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Dashboard Loaded Successfully.");

    /* =========================================
       1. DISPLAY CURRENT DATE IN HEADER
       ========================================= */
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.innerText = new Date().toLocaleDateString('en-US', options);
    }

    /* =========================================
       2. HANDLE NEW ANNOUNCEMENT FORM SUBMISSION
       ========================================= */
    const announcementForm = document.getElementById('announcementForm');
    
    if (announcementForm) {
        announcementForm.addEventListener('submit', (event) => {
            // Prevents the page from refreshing when you click submit
            event.preventDefault();
            
            /* FUTURE BACKEND LOGIC GOES HERE
               When you build your backend, you will gather the input values 
               and use fetch() or Axios to send a POST request to your API.
            */
            
            alert("This is a frontend mockup. Once your backend database is connected, this will instantly update the Announcements page!");
            
            // Clears the form fields after successful "submission"
            announcementForm.reset(); 
        });
    }
});