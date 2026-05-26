import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api'; // Make sure this path is correct for your folder structure!

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to load announcements:", err);
        setError("Failed to load announcements. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Helper function to format the database date string into "May 20, 2026"
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col font-sans animate-fade-in-up">
      
      {/* PAGE HEADER */}
      <header className="h-[40vh] bg-gradient-to-br from-primary to-[#004080] flex items-center justify-center text-white text-center pt-[50px] mt-[-30px] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h1 className="text-5xl text-accent mb-3 font-serif font-bold">Announcements</h1>
          <p className="text-lg opacity-90">Latest news, circulars, and official updates from GHSS Jengging</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-5 py-[80px]">
        
        {/* White Card Container */}
        <div className="max-w-[900px] mx-auto bg-white p-[40px] rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
          
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-10 text-primary font-semibold animate-pulse text-lg">
              Loading latest announcements...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg font-medium border border-red-100">
              ⚠️ {error}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && announcements.length === 0 && (
            <div className="text-center py-10 text-gray-500 font-medium">
              No recent announcements to display. Check back later!
            </div>
          )}

          {/* Loop through the announcements array from DB */}
          {!isLoading && !error && announcements.map((notice) => (
            <div 
              key={notice.id} 
              className="border-b border-[#eee] pb-[30px] mb-[30px] last:border-b-0 last:pb-[10px] last:mb-0"
            >
              <span className="text-[#d32f2f] font-semibold text-[0.95rem] block mb-2 flex items-center">
                {formatDateForDisplay(notice.date)}
                
                {/* Dynamically show the NEW tag if checked in Admin Panel */}
                {!!notice.isNew && (
                  <span className="ml-3 text-xs bg-red-100 text-[#d32f2f] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    New
                  </span>
                )}
              </span>
              
              <h2 className="text-primary text-[1.6rem] font-serif font-bold mb-[15px]">
                {notice.title}
              </h2>
              
              <p className="text-[#555] text-[1.05rem] leading-[1.8] whitespace-pre-wrap">
                {notice.content}
              </p>
              
              <div className="mt-[15px] flex flex-wrap gap-4 items-center">
                {/* Optional Internal/External Link */}
                {notice.linkUrl && (
                  notice.linkUrl.startsWith('http') ? (
                    <a 
                      href={notice.linkUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block font-semibold text-primary underline underline-offset-4 transition-colors hover:text-accent"
                    >
                      Read More &rarr;
                    </a>
                  ) : (
                    <Link 
                      to={notice.linkUrl} 
                      className="inline-block font-semibold text-primary underline underline-offset-4 transition-colors hover:text-accent"
                    >
                      Read More &rarr;
                    </Link>
                  )
                )}

                {/* Cloudinary PDF/Image Attachment Button */}
                {notice.fileUrl && (
                  <a 
                    href={notice.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors border border-blue-200 shadow-sm"
                  >
                    <span>📎</span>
                    <span>View Attached: {notice.fileName}</span>
                  </a>
                )}
              </div>
            </div>
          ))}

        </div>
      </main>
    </div>
  );
}