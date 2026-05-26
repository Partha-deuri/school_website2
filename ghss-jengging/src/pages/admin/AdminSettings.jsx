import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initial States
  const [generalData, setGeneralData] = useState({
    schoolName: "", tagline: "", email: "", phone: "", address: "", mapEmbedUrl: ""
  });
  
  const [socialData, setSocialData] = useState({
    facebook: "", instagram: "", youtube: "", twitter: ""
  });

  const [brandingData, setBrandingData] = useState({
    logoUrl: "", logoName: ""
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      const data = await api.getSettings();
      if (data.generalData) setGeneralData(data.generalData);
      if (data.socialData) setSocialData(data.socialData);
      if (data.brandingData) setBrandingData(data.brandingData);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleInputChange = (e, stateUpdater, currentState) => {
    stateUpdater({ ...currentState, [e.target.name]: e.target.value });
  };

  // Upload Logo to Cloudinary
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadResponse = await api.uploadFile(file);
      setBrandingData({ 
        logoUrl: uploadResponse.fileUrl, 
        logoName: uploadResponse.originalName 
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload logo. Please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = null; 
    }
  };

  const handleRemoveLogo = () => {
    if (window.confirm("Are you sure you want to remove the school logo?")) {
      setBrandingData({ logoUrl: "", logoName: "" });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isUploading) {
      alert("Please wait for the logo to finish uploading before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = { generalData, socialData, brandingData };
      await api.updateSettings(payload);
      alert("Site settings saved successfully! The public website will reflect these changes immediately.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Error saving data: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (label, name, value, stateUpdater, currentState, placeholder = "", type = "text") => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type={type} 
        name={name} 
        value={value || ''} 
        onChange={(e) => handleInputChange(e, stateUpdater, currentState)} 
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" 
      />
    </div>
  );

  const tabs = [
    { id: 'general', label: 'Contact & General' },
    { id: 'social', label: 'Social Media' },
    { id: 'branding', label: 'Branding & Logo' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Site Settings</h1>
          <p className="text-gray-500 text-sm">Manage global website configurations and contact details.</p>
        </div>
        <div className="flex items-center space-x-4">
          {isUploading && <span className="text-accent font-semibold animate-pulse text-sm">Uploading logo...</span>}
          {isSaving && <span className="text-blue-600 font-semibold animate-pulse text-sm">Saving changes...</span>}
          
          <button 
            onClick={handleSave}
            disabled={isUploading || isSaving}
            className={`px-6 py-2 rounded-md font-semibold text-white shadow-sm transition ${
              (isUploading || isSaving) ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#003060]'
            }`}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <h2 className="col-span-full text-lg font-bold text-primary mb-4 border-b pb-2">School Information</h2>
            {renderInput("Official School Name", "schoolName", generalData.schoolName, setGeneralData, generalData)}
            {renderInput("School Tagline / Motto", "tagline", generalData.tagline, setGeneralData, generalData, "e.g., Empowering Minds, Shaping Futures")}
            
            <h2 className="col-span-full text-lg font-bold text-primary mt-6 mb-4 border-b pb-2">Contact Details</h2>
            {renderInput("Public Email Address", "email", generalData.email, setGeneralData, generalData, "e.g., info@ghss.edu.in", "email")}
            {renderInput("Primary Phone Number", "phone", generalData.phone, setGeneralData, generalData)}
            
            <div className="col-span-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
              <textarea 
                name="address" 
                value={generalData.address || ''} 
                onChange={(e) => handleInputChange(e, setGeneralData, generalData)} 
                rows="3" 
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent"
              ></textarea>
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
              <input 
                type="text" 
                name="mapEmbedUrl" 
                value={generalData.mapEmbedUrl || ''} 
                onChange={(e) => handleInputChange(e, setGeneralData, generalData)} 
                placeholder="Paste the Google Maps 'src' URL here"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent text-sm text-gray-600" 
              />
              <p className="text-xs text-gray-400 mt-1">Used to display the interactive map on the Contact page.</p>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <h2 className="col-span-full text-lg font-bold text-primary mb-4 border-b pb-2">Social Media Links</h2>
            <p className="col-span-full text-sm text-gray-500 mb-6">Leave fields blank to hide the respective social icon on the public website.</p>
            
            {renderInput("Facebook Page URL", "facebook", socialData.facebook, setSocialData, socialData, "https://facebook.com/...")}
            {renderInput("Instagram Profile URL", "instagram", socialData.instagram, setSocialData, socialData, "https://instagram.com/...")}
            {renderInput("YouTube Channel URL", "youtube", socialData.youtube, setSocialData, socialData, "https://youtube.com/...")}
            {renderInput("X (Twitter) Profile URL", "twitter", socialData.twitter, setSocialData, socialData, "https://twitter.com/...")}
          </div>
        )}

        {activeTab === 'branding' && (
          <div>
            <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">School Logo</h2>
            <p className="text-sm text-gray-500 mb-6">This logo will be displayed in the website header and footer. Recommended format: transparent PNG.</p>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center max-w-md mx-auto">
              {brandingData.logoUrl ? (
                <div className="mb-6">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center mb-4">
                    <img src={brandingData.logoUrl} alt="School Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-3">{brandingData.logoName}</p>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-red-500 hover:text-red-700 text-sm font-bold underline transition"
                  >
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
                  <span className="text-gray-400 text-sm font-medium">No Logo</span>
                </div>
              )}
              
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/svg+xml" 
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-primary file:border file:border-gray-300 hover:file:bg-gray-100 cursor-pointer disabled:opacity-50" 
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}