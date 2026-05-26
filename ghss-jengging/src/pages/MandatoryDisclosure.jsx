import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function MandatoryDisclosure() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load

    const fetchDisclosureData = async () => {
      try {
        const response = await api.getDisclosure();
        setData(response || {});
      } catch (err) {
        console.error("Failed to load disclosure data:", err);
        setError("Failed to load disclosure information. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisclosureData();
  }, []);

  // Helper variables to keep table classes clean and matching your CSS perfectly
  const tableClass = "w-full border-collapse bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] table-fixed break-words";
  const thClass = "bg-primary text-white border border-[#ddd] p-[15px] text-left font-semibold";
  const tdClass = "border border-[#ddd] p-[15px] text-left text-gray-700";
  const centerTdClass = "border border-[#ddd] p-[15px] text-center text-gray-700";
  const docLinkClass = "text-primary font-semibold transition-all duration-300 hover:text-accent hover:underline underline-offset-4";

  // Helper to safely render document links
  const renderDocLink = (docObj) => {
    if (docObj && docObj.url) {
      return (
        <a href={docObj.url} target="_blank" rel="noopener noreferrer" className={docLinkClass}>
          View Document
        </a>
      );
    }
    return <span className="text-gray-400 italic text-sm">Not Uploaded</span>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col font-sans h-screen items-center justify-center">
        <div className="text-primary font-semibold animate-pulse text-xl">Loading Disclosure Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col font-sans h-screen items-center justify-center">
        <div className="text-red-600 bg-red-50 p-6 rounded-lg font-medium border border-red-100">⚠️ {error}</div>
      </div>
    );
  }

  // Safely extract data categories
  const { 
    generalData = {}, 
    docsData = {}, 
    academicDocs = {}, 
    classXResults = [], 
    classXIIResults = [], 
    staffData = {}, 
    infraData = {} 
  } = data;

  // Calculate total teachers dynamically
  const totalTeachers = (parseInt(staffData.pgt) || 0) + (parseInt(staffData.tgt) || 0) + (parseInt(staffData.prt) || 0);

  return (
    <div className="flex flex-col font-sans animate-fade-in-up">
      
      {/* PAGE HEADER */}
      <header className="h-[40vh] bg-gradient-to-br from-primary to-[#004080] flex items-center justify-center text-white text-center pt-[50px] mt-[-30px] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h1 className="text-5xl text-accent mb-3 font-serif font-bold">Mandatory Public Disclosure</h1>
          <p className="text-lg opacity-90">Compliance with CBSE Appendix-IX Revised Format</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto max-w-7xl px-5 py-[60px]">
        
        {/* CATEGORY A */}
        <div className="mb-[50px]">
          <h2 className="text-[1.8rem] text-primary border-b-[3px] border-accent pb-[10px] mb-[20px] font-serif font-bold">A: GENERAL INFORMATION</h2>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={`${thClass} w-[10%]`}>SL NO.</th>
                  <th className={`${thClass} w-[50%]`}>INFORMATION</th>
                  <th className={`${thClass} w-[40%]`}>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                <tr><th className={tdClass}>1</th><td className={tdClass}>NAME OF THE SCHOOL</td><td className={tdClass}>{generalData.schoolName || 'N/A'}</td></tr>
                <tr><th className={tdClass}>2</th><td className={tdClass}>AFFILIATION NO. (IF APPLICABLE)</td><td className={tdClass}>{generalData.affiliationNo || 'N/A'}</td></tr>
                <tr><th className={tdClass}>3</th><td className={tdClass}>SCHOOL CODE (IF APPLICABLE)</td><td className={tdClass}>{generalData.schoolCode || 'N/A'}</td></tr>
                <tr><th className={tdClass}>4</th><td className={tdClass}>COMPLETE ADDRESS WITH PIN CODE</td><td className={tdClass}>{generalData.address || 'N/A'}</td></tr>
                <tr><th className={tdClass}>5</th><td className={tdClass}>PRINCIPAL NAME & QUALIFICATION:</td><td className={tdClass}>{generalData.principalName || 'N/A'}</td></tr>
                <tr><th className={tdClass}>6</th><td className={tdClass}>SCHOOL EMAIL ID</td><td className={tdClass}>{generalData.email || 'N/A'}</td></tr>
                <tr><th className={tdClass}>7</th><td className={tdClass}>CONTACT DETAILS (LANDLINE/MOBILE)</td><td className={tdClass}>{generalData.phone || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CATEGORY B */}
        <div className="mb-[50px]">
          <h2 className="text-[1.8rem] text-primary border-b-[3px] border-accent pb-[10px] mb-[20px] font-serif font-bold">B: DOCUMENTS AND INFORMATION</h2>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={`${thClass} w-[10%]`}>SL NO.</th>
                  <th className={`${thClass} w-[50%]`}>DOCUMENTS/INFORMATION</th>
                  <th className={`${thClass} w-[40%] text-center`}>UPLOAD DOCUMENTS</th>
                </tr>
              </thead>
              <tbody>
                <tr><th className={tdClass}>1</th><td className={tdClass}>COPIES OF AFFILIATION/UPGRADATION LETTER</td><td className={centerTdClass}>{renderDocLink(docsData.affiliationLetter)}</td></tr>
                <tr><th className={tdClass}>2</th><td className={tdClass}>COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL</td><td className={centerTdClass}>{renderDocLink(docsData.societyRegistration)}</td></tr>
                <tr><th className={tdClass}>3</th><td className={tdClass}>COPY OF NO OBJECTION CERTIFICATE (NOC)</td><td className={centerTdClass}>{renderDocLink(docsData.noc)}</td></tr>
                <tr><th className={tdClass}>4</th><td className={tdClass}>COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009</td><td className={centerTdClass}>{renderDocLink(docsData.recognitionRTE)}</td></tr>
                <tr><th className={tdClass}>5</th><td className={tdClass}>COPY OF VALID BUILDING SAFETY CERTIFICATE</td><td className={centerTdClass}>{renderDocLink(docsData.buildingSafety)}</td></tr>
                <tr><th className={tdClass}>6</th><td className={tdClass}>COPY OF VALID FIRE SAFETY CERTIFICATE</td><td className={centerTdClass}>{renderDocLink(docsData.fireSafety)}</td></tr>
                <tr><th className={tdClass}>7</th><td className={tdClass}>COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL</td><td className={centerTdClass}>{renderDocLink(docsData.deoCertificate)}</td></tr>
                <tr><th className={tdClass}>8</th><td className={tdClass}>COPIES OF VALID DRINKING WATER, HEALTH AND SANITATION CERTIFICATES</td><td className={centerTdClass}>{renderDocLink(docsData.waterHealthSanitation)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CATEGORY C */}
        <div className="mb-[50px]">
          <h2 className="text-[1.8rem] text-primary border-b-[3px] border-accent pb-[10px] mb-[20px] font-serif font-bold">C: RESULT AND ACADEMICS</h2>
          
          <div className="overflow-x-auto mb-[30px]">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={`${thClass} w-[10%]`}>S.NO.</th>
                  <th className={`${thClass} w-[50%]`}>DOCUMENTS/INFORMATION</th>
                  <th className={`${thClass} w-[40%] text-center`}>UPLOAD DOCUMENTS</th>
                </tr>
              </thead>
              <tbody>
                <tr><th className={tdClass}>1</th><td className={tdClass}>FEE STRUCTURE OF THE SCHOOL</td><td className={centerTdClass}>{renderDocLink(academicDocs.feeStructure)}</td></tr>
                <tr><th className={tdClass}>2</th><td className={tdClass}>ANNUAL ACADEMIC CALENDAR</td><td className={centerTdClass}>{renderDocLink(academicDocs.academicCalendar)}</td></tr>
                <tr><th className={tdClass}>3</th><td className={tdClass}>LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC)</td><td className={centerTdClass}>{renderDocLink(academicDocs.smcList)}</td></tr>
                <tr><th className={tdClass}>4</th><td className={tdClass}>LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS</td><td className={centerTdClass}>{renderDocLink(academicDocs.ptaList)}</td></tr>
                <tr><th className={tdClass}>5</th><td className={tdClass}>LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION</td><td className={centerTdClass}><a href="#board-results" className={docLinkClass}>View Below</a></td></tr>
              </tbody>
            </table>
          </div>

          <h3 id="board-results" className="text-xl font-serif text-primary font-bold mb-[10px]">RESULT CLASS: X</h3>
          <div className="overflow-x-auto mb-[30px]">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={`${thClass} w-[10%]`}>S.NO.</th>
                  <th className={thClass}>YEAR</th>
                  <th className={`${thClass} text-center`}>REGISTERED STUDENTS</th>
                  <th className={`${thClass} text-center`}>STUDENTS PASSED</th>
                  <th className={`${thClass} text-center`}>PASS %</th>
                  <th className={thClass}>REMARKS</th>
                </tr>
              </thead>
              <tbody>
                {classXResults.length > 0 ? classXResults.map((row, idx) => (
                  <tr key={row.id}>
                    <th className={tdClass}>{idx + 1}</th>
                    <td className={tdClass}>{row.year}</td>
                    <td className={centerTdClass}>{row.registered}</td>
                    <td className={centerTdClass}>{row.passed}</td>
                    <td className={centerTdClass}>{row.passPercentage}</td>
                    <td className={tdClass}>{row.remarks}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className={centerTdClass}>No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-serif text-primary font-bold mb-[10px]">RESULT CLASS: XII</h3>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={`${thClass} w-[10%]`}>S.NO.</th>
                  <th className={thClass}>YEAR</th>
                  <th className={`${thClass} text-center`}>REGISTERED STUDENTS</th>
                  <th className={`${thClass} text-center`}>STUDENTS PASSED</th>
                  <th className={`${thClass} text-center`}>PASS %</th>
                  <th className={thClass}>REMARKS</th>
                </tr>
              </thead>
              <tbody>
                {classXIIResults.length > 0 ? classXIIResults.map((row, idx) => (
                  <tr key={row.id}>
                    <th className={tdClass}>{idx + 1}</th>
                    <td className={tdClass}>{row.year}</td>
                    <td className={centerTdClass}>{row.registered}</td>
                    <td className={centerTdClass}>{row.passed}</td>
                    <td className={centerTdClass}>{row.passPercentage}</td>
                    <td className={tdClass}>{row.remarks}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className={centerTdClass}>No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CATEGORY D */}
        <div className="mb-[50px]">
          <h2 className="text-[1.8rem] text-primary border-b-[3px] border-accent pb-[10px] mb-[20px] font-serif font-bold">D: STAFF (TEACHING)</h2>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={`${thClass} w-[10%]`}>S.NO.</th>
                  <th className={`${thClass} w-[50%]`}>INFORMATION</th>
                  <th className={`${thClass} w-[40%]`}>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                <tr><th className={tdClass}>1</th><td className={tdClass}>PRINCIPAL</td><td className={tdClass}>{staffData.principal || 'N/A'}</td></tr>
                <tr><th className={tdClass}>2</th><td className={tdClass}>VICE PRINCIPAL</td><td className={tdClass}>{staffData.vicePrincipal || 'N/A'}</td></tr>
                <tr><th className={tdClass}>3</th><td className={tdClass}>HEADMISTRESS/HEADMASTER</td><td className={tdClass}>{staffData.headmaster || 'N/A'}</td></tr>
                <tr>
                  <th className={tdClass}>4</th>
                  <td className={tdClass}>
                    TOTAL NO. OF TEACHERS
                    <ul className="list-disc mt-2 pl-5 space-y-1 text-sm">
                      <li>PGT (Post Graduate Teachers)</li>
                      <li>TGT (Trained Graduate Teachers)</li>
                      <li>PRT (Primary Teachers)</li>
                    </ul>
                  </td>
                  <td className={tdClass}>
                    <strong>{totalTeachers}</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li><strong>{staffData.pgt || 0}</strong></li>
                      <li><strong>{staffData.tgt || 0}</strong></li>
                      <li><strong>{staffData.prt || 0}</strong></li>
                    </ul>
                  </td>
                </tr>
                <tr><th className={tdClass}>5</th><td className={tdClass}>TEACHERS SECTION RATIO</td><td className={tdClass}>{staffData.ratio || 'N/A'}</td></tr>
                <tr><th className={tdClass}>6</th><td className={tdClass}>DETAILS OF SPECIAL EDUCATOR</td><td className={tdClass}>{staffData.specialEducator || 'N/A'}</td></tr>
                <tr><th className={tdClass}>7</th><td className={tdClass}>DETAILS OF COUNSELLOR & WELLNESS TEACHER</td><td className={tdClass}>{staffData.wellnessTeacher || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CATEGORY E */}
        <div className="mb-[50px]">
          <h2 className="text-[1.8rem] text-primary border-b-[3px] border-accent pb-[10px] mb-[20px] font-serif font-bold">E: SCHOOL INFRASTRUCTURE</h2>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={`${thClass} w-[10%]`}>S.NO.</th>
                  <th className={`${thClass} w-[50%]`}>INFORMATION</th>
                  <th className={`${thClass} w-[40%]`}>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                <tr><th className={tdClass}>1</th><td className={tdClass}>TOTAL CAMPUS AREA OF THE SCHOOL (IN SQR MTR)</td><td className={tdClass}>{infraData.campusArea || 'N/A'}</td></tr>
                <tr><th className={tdClass}>2</th><td className={tdClass}>NO. AND SIZE OF THE CLASSROOM (IN SQR MTR)</td><td className={tdClass}>{infraData.classrooms || 'N/A'}</td></tr>
                <tr><th className={tdClass}>3</th><td className={tdClass}>NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQR MTR)</td><td className={tdClass}>{infraData.labs || 'N/A'}</td></tr>
                <tr><th className={tdClass}>4</th><td className={tdClass}>NO. AND SIZE OF LIBRARY (IN SQR MTR)</td><td className={tdClass}>{infraData.library || 'N/A'}</td></tr>
                <tr><th className={tdClass}>5</th><td className={tdClass}>INTERNET FACILITY (YES/NO)</td><td className={tdClass}>{infraData.internet || 'N/A'}</td></tr>
                <tr><th className={tdClass}>6</th><td className={tdClass}>NO. OF GIRLS TOILETS</td><td className={tdClass}>{infraData.girlsToilets || 'N/A'}</td></tr>
                <tr><th className={tdClass}>7</th><td className={tdClass}>NO. OF BOYS TOILETS</td><td className={tdClass}>{infraData.boysToilets || 'N/A'}</td></tr>
                <tr><th className={tdClass}>8</th><td className={tdClass}>NO. OF CWSN TOILETS</td><td className={tdClass}>{infraData.cwsnToilets || 'N/A'}</td></tr>
                <tr>
                  <th className={tdClass}>9</th>
                  <td className={tdClass}>LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING THE INFRASTRUCTURE OF THE SCHOOL</td>
                  <td className={tdClass}>
                    {infraData.youtubeLink ? (
                      <a href={infraData.youtubeLink} target="_blank" rel="noopener noreferrer" className={docLinkClass}>Watch Video</a>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Not Provided</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}