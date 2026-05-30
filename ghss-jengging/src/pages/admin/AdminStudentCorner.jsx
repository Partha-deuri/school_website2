import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminStudentCorner() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const initialFormState = { title: '', description: '', fileName: '', fileUrl: '' };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await api.getStudentResources();
      setResources(data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadResponse = await api.uploadFile(file);
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
      e.target.value = null; 
    }
  };

  const handleRemoveFile = () => {
    if (window.confirm("Are you sure you want to remove this attached file?")) {
      setFormData({ ...formData, fileUrl: '', fileName: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      alert("Please wait for the file to finish uploading before saving.");
      return;
    }

    setIsSaving(true);
    try {
      if (editId) {
        await api.updateStudentResource(editId, formData);
      } else {
        await api.createStudentResource(formData);
      }
      
      loadResources(); 
      setFormData(initialFormState);
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save resource:", error);
      alert("Error saving data: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      fileName: item.fileName || '', // Note: mapping from DB snake_case
      fileUrl: item.fileUrl || ''
    });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this resource?")) {
      try {
        await api.deleteStudentResource(id);
        setResources(resources.filter(item => item.id !== id));
      } catch (error) {
        console.error("Failed to delete resource:", error);
        alert("Error deleting data: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Student Corner Resources</h1>
          <p className="text-gray-500 text-sm">Manage study materials, syllabus, and exam routines.</p>
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
          {showForm ? "Close Form" : "+ Add New Resource"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-fade-in-up">
          <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">
            {editId ? "Edit Resource Card" : "Create New Resource Card"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Class XII Half-Yearly Routine" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" placeholder="Briefly describe what this resource contains..." className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent"></textarea>
            </div>

            {/* File Upload UI */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attach Document (PDF)</label>
              
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
                accept=".pdf, image/png, image/jpeg" 
                onChange={handleFileUpload}
                disabled={isUploading}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-primary file:border file:border-gray-300 hover:file:bg-gray-100 cursor-pointer disabled:opacity-50" 
              />
              {isUploading && <p className="text-xs text-accent mt-2 animate-pulse font-semibold">Uploading file to cloud...</p>}
            </div>
            
            {/* Submit Button */}
            <div className="flex items-center space-x-4 pt-2">
              <button 
                type="submit" 
                disabled={isUploading || isSaving}
                className={`font-semibold py-2 px-6 rounded-md shadow-sm transition ${
                  (isUploading || isSaving) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-[#003060]'
                }`}
              >
                {isSaving ? "Saving..." : (editId ? "Save Changes" : "Publish Resource")}
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
                <th className="p-4 font-semibold w-1/4">Title</th>
                <th className="p-4 font-semibold w-2/4">Description & Attachment</th>
                <th className="p-4 font-semibold text-right w-1/4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.length > 0 ? (
                resources.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition align-top">
                    <td className="p-4 font-bold text-primary">
                      {item.title}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      {item.fileName && item.fileUrl && (
                        <a 
                          href={item.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded text-xs font-semibold border border-blue-200 transition-colors shadow-sm"
                        >
                          📎 {item.fileName}
                        </a>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium text-sm transition">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">No resources found. Click "Add New Resource" to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}