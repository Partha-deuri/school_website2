import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12 mt-auto">
      <div className="container mx-auto px-5 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-accent text-xl font-bold mb-4">Contact Us</h3>
          <p>Govt Higher Secondary School Jengging,</p>
          <p>Jengging, Siang District,</p>
          <p>Arunachal Pradesh - 791002, India</p>
        </div>
        <div>
          <h3 className="text-accent text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/mandatory-disclosure" className="hover:text-accent transition">CBSE Mandatory Disclosure</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition">Contact Administration</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center border-t border-white/10 mt-10 pt-5 text-sm opacity-80">
        &copy; 2026 GHSS Jengging. All Rights Reserved.
      </div>
    </footer>
  );
}