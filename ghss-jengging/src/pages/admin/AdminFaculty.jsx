import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminFaculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // NEW: Added Saving State
  const [isSaving, setIsSaving] = useState(false);
  
  const initialFormState = { name: '', role: '', qual: '', subject: '', classTaught: '' };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      const data = await api.getFaculty();
      setFacultyList(data);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATED: Handle Submit with Saving State
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSaving(true); // Trigger saving indicator

    try {
      if (editId) {
        await api.updateFaculty(editId, formData);
      } else {
        await api.createFaculty(formData);
      }
      
      loadFaculty(); 
      setFormData(initialFormState);
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save faculty:", error);
      alert("Error saving data: " + error.message);
    } finally {
      setIsSaving(false); // Turn it off when done!
    }
  };

  const handleEdit = (faculty) => {
    setFormData({
      name: faculty.name || '',
      role: faculty.role || '',
      qual: faculty.qual || '',
      subject: faculty.subject || '',
      classTaught: faculty.classTaught || ''
    });
    setEditId(faculty.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this faculty member permanently?")) {
      try {
        await api.deleteFaculty(id);
        setFacultyList(facultyList.filter(emp => emp.id !== id));
      } catch (error) {
        console.error("Failed to delete faculty:", error);
        alert("Error deleting data: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manage Faculty</h1>
          <p className="text-gray-500 text-sm">Add, update, or remove teaching staff.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData(initialFormState);
          }}
          disabled={isSaving}
          className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-[#b18d4e] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showForm ? "Cancel" : "+ Add New Faculty"}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-fade-in-up">
          <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">
            {editId ? "Edit Faculty Details" : "Register New Faculty"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation / Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" placeholder="e.g., PGT, TGT, Principal" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              <input type="text" name="qual" value={formData.qual} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" placeholder="e.g., M.A., B.Ed." required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Subject <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" placeholder="e.g., History, Mathematics" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classes Taught <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input type="text" name="classTaught" value={formData.classTaught} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" placeholder="e.g., IX - XII" />
            </div>
            
            {/* UPDATED: Submit Button UI */}
            <div className="md:col-span-2 mt-4 flex items-center space-x-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className={`font-semibold py-2 px-6 rounded-md shadow-sm transition ${
                  isSaving ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-[#003060]'
                }`}
              >
                {isSaving ? "Saving..." : (editId ? "Save Changes" : "Add to Directory")}
              </button>
              {isSaving && <span className="text-blue-600 font-semibold text-sm animate-pulse">Saving to database...</span>}
            </div>
          </form>
        </div>
      )}

      {/* Faculty Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Role & Qual</th>
                <th className="p-4 font-semibold">Subject</th>
                <th className="p-4 font-semibold">Classes</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facultyList.length > 0 ? (
                facultyList.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-primary whitespace-nowrap">{faculty.name}</td>
                    <td className="p-4">
                      <p className="text-gray-800 font-medium">{faculty.role}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{faculty.qual}</p>
                    </td>
                    <td className="p-4 text-gray-600">
                      {faculty.subject ? (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">{faculty.subject}</span>
                      ) : (
                        <span className="text-gray-400 italic text-sm">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      {faculty.classTaught ? (
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-semibold">{faculty.classTaught}</span>
                      ) : (
                        <span className="text-gray-400 italic text-sm">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEdit(faculty)} disabled={isSaving} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition disabled:opacity-50">Edit</button>
                      <button onClick={() => handleDelete(faculty.id)} disabled={isSaving} className="text-red-600 hover:text-red-800 font-medium text-sm transition disabled:opacity-50">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No faculty members found. Click "Add New Faculty" to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}