import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-light text-slate-800">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Public pages (Home, Contact, etc.) will render here */}
      </main>
      <Footer />
    </div>
  );
}