import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => `
    block px-4 py-3 rounded-md transition-colors font-medium text-lg lg:text-base
    ${isActive(path) ? 'bg-white/10 text-accent' : 'text-white/80 hover:bg-white/5 hover:text-white'}
  `;

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); 
    navigate('/admin-login'); 
  };

  const handleNavLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-primary text-white flex flex-col shadow-xl z-40 transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/10 text-center relative">
          <h2 className="text-2xl font-serif font-bold text-accent">GHSS Admin</h2>
          <p className="text-sm opacity-70 mt-1">Control Panel</p>
          
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white lg:hidden text-2xl"
          >
            ✕
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/admin" onClick={handleNavLinkClick} className={linkStyle('/admin')}>📊 Dashboard</Link>
          <Link to="/admin/announcements" onClick={handleNavLinkClick} className={linkStyle('/admin/announcements')}>📢 Announcements</Link>
          <Link to="/admin/faculty" onClick={handleNavLinkClick} className={linkStyle('/admin/faculty')}>👨‍🏫 Faculty</Link>
          <Link to="/admin/student-corner" onClick={handleNavLinkClick} className={linkStyle('/admin/student-corner')}>🎓 Student Corner</Link>
          <Link to="/admin/facilities" onClick={handleNavLinkClick} className={linkStyle('/admin/facilities')}>🏢 Facilities</Link>
          <Link to="/admin/mandatory-disclosure" onClick={handleNavLinkClick} className={linkStyle('/admin/mandatory-disclosure')}>📝 Disclosures</Link>
          <Link to="/admin/settings" onClick={handleNavLinkClick} className={linkStyle('/admin/settings')}>⚙️ Settings</Link>
          <Link to="/admin/security" onClick={handleNavLinkClick} className={linkStyle('/admin/security')}>🔒 Security</Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="block w-full text-center bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
          >
            Logout & Exit
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-8 py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-primary hover:bg-gray-100 rounded-md lg:hidden transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-primary truncate">Welcome, Admin</h2>
          </div>

          <span className="text-gray-500 text-xs sm:text-sm font-medium hidden sm:inline">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet /> 
        </main>
        
      </div>
    </div>
  );
}