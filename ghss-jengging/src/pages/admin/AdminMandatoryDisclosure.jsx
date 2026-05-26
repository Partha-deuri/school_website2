import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminMandatoryDisclosure() {
  const [activeTab, setActiveTab] = useState('general');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initial States
  const [generalData, setGeneralData] = useState({
    schoolName: "", affiliationNo: "", schoolCode: "", address: "", principalName: "", email: "", phone: ""
  });
  
  // Note: We now store an object for each file { url: '', name: '' }
  const [docsData, setDocsData] = useState({
    affiliationLetter: { url: '', name: '' }, 
    societyRegistration: { url: '', name: '' }, 
    noc: { url: '', name: '' }, 
    recognitionRTE: { url: '', name: '' }, 
    buildingSafety: { url: '', name: '' }, 
    fireSafety: { url: '', name: '' }, 
    deoCertificate: { url: '', name: '' }, 
    waterHealthSanitation: { url: '', name: '' }
  });
  
  const [academicDocs, setAcademicDocs] = useState({
    feeStructure: { url: '', name: '' }, 
    academicCalendar: { url: '', name: '' }, 
    smcList: { url: '', name: '' }, 
    ptaList: { url: '', name: '' }
  });
  
  const [classXResults, setClassXResults] = useState([]);
  const [classXIIResults, setClassXIIResults] = useState([]);
  
  const [staffData, setStaffData] = useState({
    principal: "", vicePrincipal: "", headmaster: "", pgt: "", tgt: "", prt: "", ratio: "", specialEducator: "", wellnessTeacher: ""
  });
  
  const [infraData, setInfraData] = useState({
    campusArea: "", classrooms: "", labs: "", library: "", internet: "Yes", girlsToilets: "", boysToilets: "", cwsnToilets: "", youtubeLink: ""
  });

 

   // Load Data on Mount
  useEffect(() => {
    const loadDisclosureData = async () => {
      try {
        const data = await api.getDisclosure();
        if (data.generalData) setGeneralData(data.generalData);
        // We merge with default state to ensure the objects {url, name} exist even if DB is empty
        if (data.docsData) setDocsData(prev => ({...prev, ...data.docsData}));
        if (data.academicDocs) setAcademicDocs(prev => ({...prev, ...data.academicDocs}));
        if (data.classXResults) setClassXResults(data.classXResults);
        if (data.classXIIResults) setClassXIIResults(data.classXIIResults);
        if (data.staffData) setStaffData(data.staffData);
        if (data.infraData) setInfraData(data.infraData);
      } catch (error) {
        console.error("Failed to load disclosure data:", error);
      }
    };
    loadDisclosureData();
  }, []);

  const handleInputChange = (e, stateUpdater, currentState) => {
    stateUpdater({ ...currentState, [e.target.name]: e.target.value });
  };

  // Instant File Upload Handler
  const handleFileUpload = async (e, stateUpdater, currentState, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload to Cloudinary immediately
      const uploadResponse = await api.uploadFile(file);
      
      // 2. Update the specific field with the new URL and original Name
      stateUpdater({ 
        ...currentState, 
        [fieldName]: { 
          url: uploadResponse.fileUrl, 
          name: uploadResponse.originalName 
        } 
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove File Handler
  const handleRemoveFile = (stateUpdater, currentState, fieldName) => {
    if (window.confirm("Are you sure you want to remove this file?")) {
      // Reset that specific field back to empty
      stateUpdater({ 
        ...currentState, 
        [fieldName]: { url: '', name: '' } 
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isUploading) {
      alert("Please wait for files to finish uploading before saving.");
      return;
    }

    setIsSaving(true); // <-- 1. Trigger the saving state

    try {
      const payload = {
        generalData, docsData, academicDocs, classXResults, classXIIResults, staffData, infraData
      };
      await api.updateDisclosure(payload);
      alert("Mandatory Disclosure settings saved successfully!");
    } catch (error) {
      console.error("Failed to save disclosure data:", error);
      alert("Error saving data: " + error.message);
    } finally {
      setIsSaving(false); // <-- 2. Turn it off when done
    }
  };

  // UI Helpers
  const renderInput = (label, name, value, stateUpdater, currentState, placeholder = "") => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type="text" 
        name={name} 
        value={value || ''} 
        onChange={(e) => handleInputChange(e, stateUpdater, currentState)} 
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-accent" 
      />
    </div>
  );

  const renderFileInput = (label, name, stateUpdater, currentState) => {
    const fileData = currentState[name] || { url: '', name: '' };
    
    return (
      <div className="mb-6 p-4 border border-gray-100 bg-gray-50 rounded-lg">
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        
        {/* If a file exists, show the View link AND the Remove button */}
        {fileData.url && (
          <div className="mb-3 flex flex-wrap items-center gap-4">
            <a 
              href={fileData.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded text-sm font-semibold transition"
            >
              📎 View Current File: {fileData.name}
            </a>
            
            <button
              type="button"
              onClick={() => handleRemoveFile(stateUpdater, currentState, name)}
              className="text-red-500 hover:text-red-700 text-sm font-bold underline transition"
            >
              Remove File
            </button>
          </div>
        )}
        
        {/* The upload input stays here so they can replace files if they want */}
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => handleFileUpload(e, stateUpdater, currentState, name)} 
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-semibold file:bg-white file:text-primary file:border file:border-gray-300 hover:file:bg-gray-50 cursor-pointer" 
        />
      </div>
    );
  };

  // Handlers for dynamic Board Results Tables
  const handleResultChange = (classLevel, id, field, value) => {
    const setter = classLevel === 'X' ? setClassXResults : setClassXIIResults;
    const data = classLevel === 'X' ? classXResults : classXIIResults;
    setter(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addResultRow = (classLevel) => {
    const setter = classLevel === 'X' ? setClassXResults : setClassXIIResults;
    setter(prev => [...prev, { id: Date.now(), year: '', registered: '', passed: '', passPercentage: '', remarks: '' }]);
  };

  const deleteResultRow = (classLevel, id) => {
    const setter = classLevel === 'X' ? setClassXResults : setClassXIIResults;
    setter(prev => prev.filter(item => item.id !== id));
  };

  const renderResultTable = (title, classLevel, data) => (
    <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <button type="button" onClick={() => addResultRow(classLevel)} className="text-sm bg-accent text-white px-3 py-1.5 rounded hover:bg-[#b18d4e]">
          + Add Year
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Registered</th>
              <th className="p-2 border">Passed</th>
              <th className="p-2 border">Pass %</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border w-16"></th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id}>
                <td className="p-2 border"><input type="text" value={row.year} onChange={(e) => handleResultChange(classLevel, row.id, 'year', e.target.value)} className="w-full p-1 border rounded" /></td>
                <td className="p-2 border"><input type="text" value={row.registered} onChange={(e) => handleResultChange(classLevel, row.id, 'registered', e.target.value)} className="w-full p-1 border rounded" /></td>
                <td className="p-2 border"><input type="text" value={row.passed} onChange={(e) => handleResultChange(classLevel, row.id, 'passed', e.target.value)} className="w-full p-1 border rounded" /></td>
                <td className="p-2 border"><input type="text" value={row.passPercentage} onChange={(e) => handleResultChange(classLevel, row.id, 'passPercentage', e.target.value)} className="w-full p-1 border rounded" /></td>
                <td className="p-2 border"><input type="text" value={row.remarks} onChange={(e) => handleResultChange(classLevel, row.id, 'remarks', e.target.value)} className="w-full p-1 border rounded" /></td>
                <td className="p-2 border text-center">
                  <button type="button" onClick={() => deleteResultRow(classLevel, row.id)} className="text-red-500 hover:text-red-700 font-bold">X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General Info' },
    { id: 'docs', label: 'Documents & Safety' },
    { id: 'academic', label: 'Academic & SMC' },
    { id: 'results', label: 'Board Results' },
    { id: 'staff', label: 'Staff Info' },
    { id: 'infra', label: 'Infrastructure' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Mandatory Public Disclosure</h1>
          <p className="text-gray-500 text-sm">Update CBSE required information and documents.</p>
        </div>
        
        {/* UPDATED BUTTON CONTAINER */}
        <div className="flex items-center space-x-4">
          
          {/* Status Indicators */}
          {isUploading && <span className="text-accent font-semibold animate-pulse">Uploading file to cloud...</span>}
          {isSaving && <span className="text-blue-600 font-semibold animate-pulse">Saving changes to database...</span>}
          
          <button 
            onClick={handleSave}
            // Disable button if either uploading OR saving is happening
            disabled={isUploading || isSaving}
            className={`px-6 py-2 rounded-md font-semibold text-white shadow-sm transition ${
              (isUploading || isSaving) ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#003060]'
            }`}
          >
            {isSaving ? "Saving..." : "Save All Disclosures"}
          </button>
          
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <h2 className="col-span-full text-lg font-bold text-primary mb-4 border-b pb-2">A. General Information</h2>
            {renderInput("Name of the School", "schoolName", generalData.schoolName, setGeneralData, generalData)}
            {renderInput("Affiliation No. (If Applicable)", "affiliationNo", generalData.affiliationNo, setGeneralData, generalData)}
            {renderInput("School Code (If Applicable)", "schoolCode", generalData.schoolCode, setGeneralData, generalData)}
            {renderInput("Complete Address with Pin Code", "address", generalData.address, setGeneralData, generalData)}
            {renderInput("Principal Name & Qualification", "principalName", generalData.principalName, setGeneralData, generalData)}
            {renderInput("School Email ID", "email", generalData.email, setGeneralData, generalData)}
            {renderInput("Contact Details (Landline/Mobile)", "phone", generalData.phone, setGeneralData, generalData)}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <h2 className="col-span-full text-lg font-bold text-primary mb-4 border-b pb-2">B. Documents and Information</h2>
            <p className="col-span-full text-sm text-gray-500 mb-6">Upload PDF copies of the required documents below.</p>
            {renderFileInput("1. Copies of Affiliation/Upgradation Letter", "affiliationLetter", setDocsData, docsData)}
            {renderFileInput("2. Societies/Trust/Company Registration/Renewal", "societyRegistration", setDocsData, docsData)}
            {renderFileInput("3. No Objection Certificate (NOC)", "noc", setDocsData, docsData)}
            {renderFileInput("4. Recognition Certificate under RTE Act", "recognitionRTE", setDocsData, docsData)}
            {renderFileInput("5. Building Safety Certificate", "buildingSafety", setDocsData, docsData)}
            {renderFileInput("6. Fire Safety Certificate", "fireSafety", setDocsData, docsData)}
            {renderFileInput("7. DEO Certificate for Affiliation", "deoCertificate", setDocsData, docsData)}
            {renderFileInput("8. Water, Health and Sanitation Certificates", "waterHealthSanitation", setDocsData, docsData)}
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <h2 className="col-span-full text-lg font-bold text-primary mb-4 border-b pb-2">C. Result and Academics</h2>
            {renderFileInput("1. Fee Structure of the School", "feeStructure", setAcademicDocs, academicDocs)}
            {renderFileInput("2. Annual Academic Calendar", "academicCalendar", setAcademicDocs, academicDocs)}
            {renderFileInput("3. List of School Management Committee (SMC)", "smcList", setAcademicDocs, academicDocs)}
            {renderFileInput("4. List of Parents Teachers Association (PTA) Members", "ptaList", setAcademicDocs, academicDocs)}
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">Result of Board Examinations</h2>
            {renderResultTable("Class X Results", "X", classXResults)}
            {renderResultTable("Class XII Results", "XII", classXIIResults)}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <h2 className="col-span-full text-lg font-bold text-primary mb-4 border-b pb-2">D. Staff (Teaching)</h2>
            {renderInput("Principal", "principal", staffData.principal, setStaffData, staffData)}
            {renderInput("Vice Principal", "vicePrincipal", staffData.vicePrincipal, setStaffData, staffData)}
            {renderInput("Headmaster", "headmaster", staffData.headmaster, setStaffData, staffData)}
            {renderInput("Total No. of PGT", "pgt", staffData.pgt, setStaffData, staffData)}
            {renderInput("Total No. of TGT", "tgt", staffData.tgt, setStaffData, staffData)}
            {renderInput("Total No. of PRT", "prt", staffData.prt, setStaffData, staffData)}
            {renderInput("Teachers Section Ratio", "ratio", staffData.ratio, setStaffData, staffData)}
            {renderInput("Details of Special Educator", "specialEducator", staffData.specialEducator, setStaffData, staffData)}
            {renderInput("Details of Counsellor and Wellness Teacher", "wellnessTeacher", staffData.wellnessTeacher, setStaffData, staffData)}
          </div>
        )}

        {activeTab === 'infra' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <h2 className="col-span-full text-lg font-bold text-primary mb-4 border-b pb-2">E. School Infrastructure</h2>
            {renderInput("Total Campus Area (in Sq. Mtr)", "campusArea", infraData.campusArea, setInfraData, infraData)}
            {renderInput("No. and Size of Classrooms (in Sq. Mtr)", "classrooms", infraData.classrooms, setInfraData, infraData)}
            {renderInput("No. and Size of Laboratories (in Sq. Mtr)", "labs", infraData.labs, setInfraData, infraData)}
            {renderInput("Internet Facility (Yes/No)", "internet", infraData.internet, setInfraData, infraData)}
            {renderInput("No. of Girls Toilets", "girlsToilets", infraData.girlsToilets, setInfraData, infraData)}
            {renderInput("No. of Boys Toilets", "boysToilets", infraData.boysToilets, setInfraData, infraData)}
            {renderInput("No. of Toilets for CWSN", "cwsnToilets", infraData.cwsnToilets, setInfraData, infraData)}
            {renderInput("YouTube Link of School Inspection Video", "youtubeLink", infraData.youtubeLink, setInfraData, infraData, "https://youtube.com/...")}
          </div>
        )}

      </div>
    </div>
  );
}