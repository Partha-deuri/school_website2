import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ announcements: 0, faculty: 0 });
  const [recentNotices, setRecentNotices] = useState([]);
  
  const [profile, setProfile] = useState({
    name: 'Not configured',
    principal: 'Not configured',
    affiliation: 'Not configured',
    address: 'Not configured'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data concurrently for maximum speed
        const [announcementsData, facultyData, settingsData, disclosureData] = await Promise.all([
          api.getAnnouncements(),
          api.getFaculty(),
          api.getSettings(),
          api.getDisclosure()
        ]);

        // 1. Set Stats
        setStats({
          announcements: announcementsData.length || 0,
          faculty: facultyData.length || 0
        });

        // 2. Set Recent Notices (Backend already sorts by date DESC, so we just grab the first 3)
        setRecentNotices(announcementsData.slice(0, 3));

        // 3. Build School Profile
        // We pull the Name and Address from Settings, and Principal and Affiliation from Disclosure
        const settingsGen = settingsData.generalData || {};
        const disclosureGen = disclosureData.generalData || {};

        setProfile({
          name: settingsGen.schoolName || 'Govt. Higher Secondary School, Jengging', 
          principal: disclosureGen.principalName || 'Not configured',
          affiliation: disclosureGen.affiliationNo || 'Not configured',
          address: settingsGen.address || 'Not configured'
        });

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-primary font-semibold animate-pulse">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Quick Stats Grid (Changed to 2 columns since Students count was removed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Announcements</h3>
          <p className="text-4xl font-bold text-primary">{stats.announcements}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Registered Faculty</h3>
          <p className="text-4xl font-bold text-primary">{stats.faculty}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Basic School Details */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
            <h2 className="text-lg font-bold text-primary">School Profile</h2>
            <span className="text-2xl">🏫</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Institute Name</p>
              <p className="font-medium text-gray-800">{profile.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Principal</p>
              <p className="font-medium text-gray-800">{profile.principal}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Affiliation No.</p>
              <p className="font-medium text-gray-800">{profile.affiliation}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Location</p>
              <p className="font-medium text-gray-800 leading-snug whitespace-pre-wrap">{profile.address}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activity Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-100">Recently Published Announcements</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-3 font-semibold rounded-tl-lg">Date</th>
                  <th className="p-3 font-semibold">Title</th>
                  <th className="p-3 font-semibold text-center">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentNotices.length > 0 ? (
                  recentNotices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDateForDisplay(notice.date)}
                      </td>
                      <td className="p-3 font-medium text-primary">
                        {notice.title}
                        {notice.isNew ? <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">New</span> : null}
                      </td>
                      <td className="p-3 text-center space-x-1">
                        {notice.showOnHome ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Home</span> : null}
                        {notice.showInTicker ? <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Ticker</span> : null}
                        {!notice.showOnHome && !notice.showInTicker ? <span className="text-gray-400 text-xs italic">Notice Board Only</span> : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-gray-500 text-sm">
                      No announcements published yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
             <span className="text-xs text-gray-400 italic">Manage all notices in the Announcements tab.</span>
          </div>
        </div>

      </div>
    </div>
  );
}