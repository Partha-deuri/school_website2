import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // NEW: Added Loading States
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const initialFormState = { 
  title: '', content: '', linkUrl: '', fileName: '', fileUrl: '', 
  isRecent: false, // <-- Change this here
  showOnHome: true, showInTicker: false 
};
  const [formData, setFormData] = useState(initialFormState);

 
  const loadAnnouncements = async () => {
    try {
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };
   // Fetch data on load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnnouncements();
  }, []);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value 
    });
  };

  // NEW: Instant File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadResponse = await api.uploadFile(file);
      
      // Update form data instantly with the Cloudinary URL and Name
      setFormData({ 
        ...formData, 
        fileUrl: uploadResponse.fileUrl, 
        fileName: uploadResponse.originalName 
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the input so they can upload the same file again if they remove it
      e.target.value = null; 
    }
  };

  // NEW: Remove File Handler
  const handleRemoveFile = () => {
    if (window.confirm("Are you sure you want to remove this attached file?")) {
      setFormData({ ...formData, fileUrl: '', fileName: '' });
    }
  };

  // UPDATED: Handle Submit with Saving State
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Protect against submitting while a file is uploading
    if (isUploading) {
      alert("Please wait for the file to finish uploading before saving.");
      return;
    }

    setIsSaving(true);

    try {
      if (editId) {
        await api.updateAnnouncement(editId, formData);
      } else {
        await api.createAnnouncement(formData);
      }
      
      loadAnnouncements(); // Refresh table with latest DB data
      setFormData(initialFormState);
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save announcement:", error);
      alert("Error saving data: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Prepare form for editing
  const handleEdit = (item) => {
    // Retained the Date String fix!
    const formattedDate = item.date ? item.date.split('T')[0] : '';
    
    setFormData({
      ...item,
      date: formattedDate,
      isRecent: !!item.isRecent,
      showOnHome: !!item.showOnHome,
      showInTicker: !!item.showInTicker
    });
    
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this announcement?")) {
      try {
        await api.deleteAnnouncement(id);
        setAnnouncements(announcements.filter(item => item.id !== id));
      } catch (error) {
        console.error("Failed to delete announcement:", error);
        alert("Error deleting data: " + error.message);
      }
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manage Announcements</h1>
          <p className="text-gray-500 text-sm">Publish and control the visibility of school notices.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData(initialFormState);
          }}
          disabled={isUploading || isSaving}
          className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-[#b18d4e] transition disabled:opacity-50"
        >
          {showForm ? "Close Form" : "+ Create Announcement"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-fade-in-up">
          <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">
            {editId ? "Edit Announcement" : "Draft New Announcement"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent text-gray-700" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
              <textarea name="content" value={formData.content} onChange={handleInputChange} rows="4" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" required></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Optional Link (URL)</label>
                <input type="text" name="linkUrl" value={formData.linkUrl || ''} onChange={handleInputChange} placeholder="e.g., /mandatory-disclosure" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" />
              </div>
              
              {/* UPDATED: File Upload UI */}
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Attach File (PDF/Image)</label>
                
                {formData.fileUrl && (
                  <div className="mb-3 flex flex-wrap items-center gap-4">
                    <a 
                      href={formData.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded text-sm font-semibold transition"
                    >
                      📎 View Attached: {formData.fileName}
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 text-sm font-bold underline transition"
                    >
                      Remove File
                    </button>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept=".pdf, image/png, image/jpeg, image/jpg" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-semibold file:bg-white file:text-primary file:border file:border-gray-300 hover:file:bg-gray-100 cursor-pointer disabled:opacity-50" 
                />
                {isUploading && <p className="text-xs text-accent mt-2 animate-pulse font-semibold">Uploading file to cloud...</p>}
              </div>
            </div>

            {/* Visibility Checkboxes */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex flex-wrap gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="isRecent" checked={formData.isRecent} onChange={handleInputChange} className="w-4 h-4 text-primary rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Mark as "New"</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="showOnHome" checked={formData.showOnHome} onChange={handleInputChange} className="w-4 h-4 text-primary rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Show in Homepage Notice Board</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="showInTicker" checked={formData.showInTicker} onChange={handleInputChange} className="w-4 h-4 text-primary rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Show in Latest News Ticker</span>
              </label>
            </div>
            
            {/* UPDATED: Submit Button UI */}
            <div className="flex items-center space-x-4 pt-2">
              <button 
                type="submit" 
                disabled={isUploading || isSaving}
                className={`font-semibold py-2 px-6 rounded-md shadow-sm transition ${
                  (isUploading || isSaving) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-[#003060]'
                }`}
              >
                {isSaving ? "Saving..." : (editId ? "Save Changes" : "Publish Announcement")}
              </button>
              {isSaving && <span className="text-blue-600 font-semibold text-sm animate-pulse">Saving to database...</span>}
            </div>
          </form>
        </div>
      )}

      {/* Data Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
                <th className="p-4 font-semibold w-40">Date</th>
                <th className="p-4 font-semibold">Title & Content</th>
                <th className="p-4 font-semibold w-32">Visibility</th>
                <th className="p-4 font-semibold text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition align-top">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDateForDisplay(item.date)}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-primary mb-1">{item.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
                      {item.fileName && item.fileUrl && (
                        <a 
                          href={item.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 px-3 py-1.5 rounded text-xs font-semibold border border-blue-200 transition-colors shadow-sm"
                        >
                          📎 View Attached: {item.fileName}
                        </a>
                      )}
                    </td>
                    <td className="p-4 space-y-2">
                      {!!item.isRecent && <span className="block w-max bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">NEW</span>}
                      {!!item.showOnHome && <span className="block w-max bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">Homepage</span>}
                      {!!item.showInTicker && <span className="block w-max bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-semibold">Ticker</span>}
                    </td>
                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium text-sm transition">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No announcements found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}