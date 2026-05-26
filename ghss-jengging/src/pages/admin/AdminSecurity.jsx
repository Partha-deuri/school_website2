/* eslint-disable react-hooks/static-components */
import { useState } from 'react';
import { api } from '../../services/api';

export default function AdminSecurity() {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); 
  
  // States for password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: 'error', text: 'New password cannot be the same as the old password.' });
      return;
    }

    // Submit to Backend
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password successfully updated!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Reset visibility toggles after successful change
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      
    } catch (error) {
      console.error("Failed to update password:", error);
      setMessage({ type: 'error', text: error.message || "Failed to update password." });
    } finally {
      setIsSaving(false);
    }
  };

  // Reusable Eye Icons (SVG)
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      
      {/* Header Section */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-primary">Security Settings</h1>
        <p className="text-gray-500 text-sm">Manage your administrator account credentials.</p>
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
        
        <h2 className="text-lg font-bold text-primary mb-6 border-b pb-2">Change Administrator Password</h2>
        
        {/* Status Message Display */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-md text-sm font-semibold border ${
            message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            {message.type === 'error' ? '⚠️ ' : '✅ '} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
          
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrent ? "text" : "password"} 
                name="currentPassword" 
                value={formData.currentPassword} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:border-accent" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showCurrent ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          
          {/* New Password */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                name="newPassword" 
                value={formData.newPassword} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:border-accent" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showNew ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters long.</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:border-accent" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirm ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4 flex items-center space-x-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className={`font-semibold py-2 px-6 rounded-md shadow-sm transition ${
                isSaving ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-[#003060]'
              }`}
            >
              {isSaving ? "Updating Password..." : "Update Password"}
            </button>
          </div>
          
        </form>
      </div>
      
    </div>
  );
}