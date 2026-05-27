import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const initialFormState = { title: '', description: '', imageName: '', imageUrl: '' };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const data = await api.getFacilities();
      setFacilities(data);
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadResponse = await api.uploadFile(file);
      setFormData({ 
        ...formData, 
        imageUrl: uploadResponse.fileUrl, 
        imageName: uploadResponse.originalName 
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = null; 
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '', imageName: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) return alert("Please wait for the image to finish uploading.");

    setIsSaving(true);
    try {
      if (editId) {
        await api.updateFacility(editId, formData);
      } else {
        await api.createFacility(formData);
      }
      
      loadFacilities(); 
      setFormData(initialFormState);
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      alert("Error saving data: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      imageName: item.imageName || '',
      imageUrl: item.imageUrl || ''
    });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await api.deleteFacility(id);
        setFacilities(facilities.filter(item => item.id !== id));
      } catch (error) {
        alert("Error deleting data: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">School Facilities</h1>
          <p className="text-gray-500 text-sm">Manage the infrastructure showcased on the public website.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setEditId(null); setFormData(initialFormState); }}
          disabled={isUploading || isSaving}
          className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-[#b18d4e] transition disabled:opacity-50"
        >
          {showForm ? "Close Form" : "+ Add New Facility"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">
            {editId ? "Edit Facility" : "Add New Facility"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Computer Laboratory" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Describe the facility..." className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent"></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Facility Image <span className="text-gray-400 font-normal italic">(Optional)</span></label>
              
              {formData.imageUrl ? (
                <div className="mb-4 relative w-48 h-32 rounded-md overflow-hidden border border-gray-300 shadow-sm group">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={handleRemoveImage} className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">Remove</button>
                  </div>
                </div>
              ) : (
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-primary file:border file:border-gray-300 hover:file:bg-gray-100 cursor-pointer disabled:opacity-50" 
                />
              )}
              {isUploading && <p className="text-xs text-accent mt-2 animate-pulse font-semibold">Uploading image to cloud...</p>}
            </div>
            
            <div className="pt-2">
              <button type="submit" disabled={isUploading || isSaving} className={`font-semibold py-2 px-6 rounded-md shadow-sm transition ${ (isUploading || isSaving) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-[#003060]' }`}>
                {isSaving ? "Saving..." : (editId ? "Save Changes" : "Publish Facility")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover border-b border-gray-100" />
            ) : (
              <div className="w-full h-48 bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-b border-gray-100">
                <span className="text-3xl mb-2">🏫</span>
                <span className="text-sm font-medium">No Image Provided</span>
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-primary text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 flex-1 whitespace-pre-wrap">{item.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium text-sm transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {facilities.length === 0 && !showForm && (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            No facilities added yet. Click "Add New Facility" to get started.
          </div>
        )}
      </div>
    </div>
  );
}