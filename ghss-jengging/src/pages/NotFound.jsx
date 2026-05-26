import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5 py-20 animate-fade-in-up">
      
      {/* Giant 404 Text */}
      <h1 className="text-9xl font-black font-serif text-primary/10 mb-2 relative">
        <span className="absolute inset-0 flex items-center justify-center text-primary drop-shadow-md">404</span>
        404
      </h1>
      
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-8">
        Oops! Page Not Found
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        We can't seem to find the page you are looking for. It might have been removed, renamed, or is temporarily unavailable.
      </p>
      
      {/* Return Home Button */}
      <Link 
        to="/" 
        className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-[#b18d4e] transition-all duration-300 shadow-md hover:-translate-y-1 inline-flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Return to Homepage
      </Link>
      
    </div>
  );
}