import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // Listen for the user scrolling down the page
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => `
    font-semibold text-base transition duration-300 pb-1 border-b-2
    ${isActive(path) 
      ? 'text-accent border-accent' 
      : 'text-white border-transparent hover:text-accent'}
  `;

  // DYNAMIC CLASSES:
  // If it is the homepage AND not scrolled, it stays transparent and floats.
  // Otherwise, it turns solid blue with a drop shadow.
  const navBackground = isHomePage && !isScrolled 
    ? 'bg-transparent py-8 shadow-none' 
    : 'bg-primary py-5 shadow-md';

  // On the homepage, we want the nav to sit *over* the image (fixed).
  // On other pages, we want it to push the page headers down normally (sticky).
  const positionClass = isHomePage ? 'fixed' : 'sticky';

  return (
    <nav className={`w-full top-0 left-0 z-50 transition-all duration-500 ease-in-out px-[5%] ${positionClass} ${navBackground}`}>
      <div className="w-full flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-[1.8rem] font-semibold text-white drop-shadow-md">
          GHSS Jengging
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-6">
          <li><Link to="/" className={navLinkStyle('/')}>Home</Link></li>
          <li><Link to="/facilities" className={navLinkStyle('/facilities')}>Facilities</Link></li>
          <li><Link to="/faculty" className={navLinkStyle('/faculty')}>Faculty</Link></li>
          <li><Link to="/student-corner" className={navLinkStyle('/student-corner')}>Student Corner</Link></li>
          <li><Link to="/mandatory-disclosure" className={navLinkStyle('/mandatory-disclosure')}>Mandatory Disclosure</Link></li>
          <li><Link to="/contact" className={navLinkStyle('/contact')}>Contact</Link></li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          className="lg:hidden focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <ul className="lg:hidden bg-primary pb-6 pt-4 space-y-5 text-center font-semibold border-t border-blue-900 mt-5 shadow-inner rounded-b-lg absolute left-0 w-full text-white">
          <li><Link to="/" onClick={() => setIsOpen(false)} className="block hover:text-accent">Home</Link></li>
          <li><Link to="/facilities" onClick={() => setIsOpen(false)} className="block hover:text-accent">Facilities</Link></li>
          <li><Link to="/faculty" onClick={() => setIsOpen(false)} className="block hover:text-accent">Faculty</Link></li>
          <li><Link to="/student-corner" onClick={() => setIsOpen(false)} className="block hover:text-accent">Student Corner</Link></li>
          <li><Link to="/mandatory-disclosure" onClick={() => setIsOpen(false)} className="block hover:text-accent">Mandatory Disclosure</Link></li>
          <li><Link to="/contact" onClick={() => setIsOpen(false)} className="block hover:text-accent">Contact</Link></li>
        </ul>
      )}
    </nav>
  );
}