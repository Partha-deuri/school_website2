// src/services/api.js

// Grab the base URL from your .env file
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle standard JSON requests
// Add token injection to your existing fetch wrapper
const fetchWithErrorCheck = async (url, options = {}) => {
  // Grab the token from browser storage
  const token = localStorage.getItem('adminToken');
  
  // If we have one, attach it to the headers
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // If the token expires, automatically log the user out!
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin-login'; // Force them to log in again
    }
    
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const api = {
  // ==========================================
  // ANNOUNCEMENTS
  // ==========================================
  getAnnouncements: () => {
    return fetchWithErrorCheck(`${BASE_URL}/announcements`);
  },
  
  createAnnouncement: (data) => {
    return fetchWithErrorCheck(`${BASE_URL}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  deleteAnnouncement: (id) => {
    return fetchWithErrorCheck(`${BASE_URL}/announcements/${id}`, {
      method: 'DELETE'
    });
  },
  // Add this inside your exported `api` object:
  updateAnnouncement: (id, data) => {
    return fetchWithErrorCheck(`${BASE_URL}/announcements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
// ==========================================
  // FACULTY
  // ==========================================
  getFaculty: () => {
    return fetchWithErrorCheck(`${BASE_URL}/faculty`);
  },
  
  createFaculty: (data) => {
    return fetchWithErrorCheck(`${BASE_URL}/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  updateFaculty: (id, data) => {
    return fetchWithErrorCheck(`${BASE_URL}/faculty/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  
  deleteFaculty: (id) => {
    return fetchWithErrorCheck(`${BASE_URL}/faculty/${id}`, {
      method: 'DELETE'
    });
  },


  // ==========================================
  // FILE UPLOADS
  // ==========================================
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Note: We do NOT set 'Content-Type': 'application/json' here. 
    // The browser automatically sets the correct Multipart boundary for files!
    return fetchWithErrorCheck(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
  },

  // ==========================================
  // MANDATORY DISCLOSURE
  // ==========================================
  getDisclosure: () => {
    return fetchWithErrorCheck(`${BASE_URL}/disclosure`);
  },
  
  updateDisclosure: (data) => {
    return fetchWithErrorCheck(`${BASE_URL}/disclosure`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // ==========================================
  // SITE SETTINGS
  // ==========================================
  getSettings: () => {
    return fetchWithErrorCheck(`${BASE_URL}/settings`);
  },
  
  updateSettings: (data) => {
    return fetchWithErrorCheck(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // ==========================================
  // SECURITY
  // ==========================================
  changePassword: (data) => {
    return fetchWithErrorCheck(`${BASE_URL}/security/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },


  // ==========================================
  // AUTHENTICATION
  // ==========================================
  login: (credentials) => {
    return fetchWithErrorCheck(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  },

  // ==========================================
  // STUDENT CORNER
  // ==========================================
  getStudentResources: () => {
    return fetchWithErrorCheck(`${BASE_URL}/student-resources`);
  },
  createStudentResource: (data) => {
    return fetchWithErrorCheck(`${BASE_URL}/student-resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  updateStudentResource: (id, data) => {
    return fetchWithErrorCheck(`${BASE_URL}/student-resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  deleteStudentResource: (id) => {
    return fetchWithErrorCheck(`${BASE_URL}/student-resources/${id}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // FACILITIES
  // ==========================================
  getFacilities: () => {
    return fetchWithErrorCheck(`${BASE_URL}/facilities`);
  },
  createFacility: (data) => {
    return fetchWithErrorCheck(`${BASE_URL}/facilities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  updateFacility: (id, data) => {
    return fetchWithErrorCheck(`${BASE_URL}/facilities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  deleteFacility: (id) => {
    return fetchWithErrorCheck(`${BASE_URL}/facilities/${id}`, {
      method: 'DELETE'
    });
  },



};