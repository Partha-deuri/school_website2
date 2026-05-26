import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => `
    block px-4 py-3 rounded-md transition-colors font-medium
    ${isActive(path) ? 'bg-white/10 text-accent' : 'text-white/80 hover:bg-white/5 hover:text-white'}
  `;

  const handleLogout = () => {
    // FIXED: Target the actual JWT token we created during the security upgrade
    localStorage.removeItem('adminToken'); 
    navigate('/admin-login'); // Sending them back to login is usually safer than the public homepage!
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-primary text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-white/10 text-center">
          <h2 className="text-2xl font-serif font-bold text-accent">GHSS Admin</h2>
          <p className="text-sm opacity-70 mt-1">Control Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/admin" className={linkStyle('/admin')}>📊 Dashboard</Link>
          <Link to="/admin/announcements" className={linkStyle('/admin/announcements')}>📢 Announcements</Link>
          <Link to="/admin/faculty" className={linkStyle('/admin/faculty')}>👨‍🏫 Faculty</Link>
          <Link to="/admin/student-corner" className={linkStyle('/admin/student-corner')}>🎓 Student Corner</Link>
          <Link to="/admin/mandatory-disclosure" className={linkStyle('/admin/mandatory-disclosure')}>📝 Disclosures</Link>
          <Link to="/admin/settings" className={linkStyle('/admin/settings')}>⚙️ Settings</Link>
          <Link to="/admin/security" className={linkStyle('/admin/security')}>🔒 Security</Link>
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
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-primary">Welcome, Admin</h2>
          <span className="text-gray-500 text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}