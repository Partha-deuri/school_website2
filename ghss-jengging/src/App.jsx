import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts & Protection
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import the bouncer
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Facilities from './pages/Facilities';
import Faculty from './pages/Faculty';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import MandatoryDisclosure from './pages/MandatoryDisclosure';
import StudentCorner from './pages/StudentCorner';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminMandatoryDisclosure from './pages/admin/AdminMandatoryDisclosure';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminStudentCorner from './pages/admin/AdminStudentCorner';
import AdminFacilities from './pages/admin/AdminFacilities';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        
        {/* === PUBLIC ROUTES === */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/mandatory-disclosure" element={<MandatoryDisclosure />} />
          <Route path="/student-corner" element={<StudentCorner />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* === ADMIN LOGIN (Unprotected, standalone route) === */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* === SECURE ADMIN ROUTES === */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="faculty" element={<AdminFaculty />} /> 
            <Route path="facilities" element={<AdminFacilities />} />
            <Route path="student-corner" element={<AdminStudentCorner />} />
            <Route path="mandatory-disclosure" element={<AdminMandatoryDisclosure />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="security" element={<AdminSecurity />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;