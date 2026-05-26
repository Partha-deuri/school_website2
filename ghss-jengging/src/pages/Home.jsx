import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Home() {
  // --- Hero Slider Logic ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    '/images/gate.jpeg',
    '/images/classroom.jpeg',
    '/images/students.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer); 
  }, [slides.length]);

  // --- Backend Data Logic ---
  const [tickerNotices, setTickerNotices] = useState([]);
  const [homeNotices, setHomeNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const allAnnouncements = await api.getAnnouncements();
        
        // Filter based on admin visibility toggles
        setTickerNotices(allAnnouncements.filter(notice => notice.showInTicker));
        setHomeNotices(allAnnouncements.filter(notice => notice.showOnHome));
      } catch (error) {
        console.error("Failed to fetch homepage announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Format date helper
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const options = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col">
      {/* 1. Stunning Hero Slideshow Section */}
      <header className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Dynamic Background Slides */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0, 31, 63, 0.8) 0%, rgba(0, 64, 128, 0.7) 100%), url('${slide}')`
              }}
            ></div>
          ))}
        </div>

        {/* Static Text Content */}
        <div className="relative z-10 max-w-4xl px-5 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6 leading-tight">
            Government Higher Secondary School, <span className="text-accent">Jengging</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-90">
            Empowering Minds, Shaping Futures in the Heart of Arunachal Pradesh. Dedicated to academic excellence and holistic student development.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/mandatory-disclosure" className="bg-accent text-white px-8 py-3 rounded-md font-semibold hover:-translate-y-1 transition duration-300">
              CBSE Compliance
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-accent text-accent px-8 py-3 rounded-md font-semibold hover:bg-accent hover:text-white hover:-translate-y-1 transition duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Latest Announcements Ticker (Hidden if empty) */}
      {tickerNotices.length > 0 && (
        <div className="flex items-center bg-primary text-accent h-12 relative z-20 border-black/10">
          <Link to="/announcements" className="bg-red-600 text-white font-bold px-6 h-full flex items-center shadow-lg relative z-10 tracking-wide text-sm whitespace-nowrap hover:bg-red-700 transition">
            LATEST NEWS
          </Link>
          <div className="flex-1 overflow-hidden whitespace-nowrap h-full flex items-center group">
            <div className="inline-block animate-ticker group-hover:[animation-play-state:paused] cursor-pointer font-semibold pl-[100%]">
              {tickerNotices.map((notice, idx) => (
                <span key={notice.id}>
                  <Link to="/announcements" className="hover:underline">
                    {notice.isNew ? "⭐ " : "🔹 "}{notice.title}
                  </Link>
                  {/* Add separator if it's not the last item */}
                  {idx < tickerNotices.length - 1 && <span className="opacity-50"> &nbsp; | &nbsp; </span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Quick Explore Section (Overlapping Hero) */}
      <div className="container mx-auto px-5 relative z-20 mt-10">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Our Faculty', desc: 'Meet our highly qualified and dedicated teaching staff.', link: '/faculty', text: 'View Directory' },
            { title: 'Campus Facilities', desc: 'Explore our modern laboratories, library, and classrooms.', link: '/facilities', text: 'Take a Tour' },
            { title: 'Student Corner', desc: 'Access syllabus, exam routines, and academic resources.', link: '/student-corner', text: 'Enter Portal' }
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-8 rounded-lg shadow-xl text-center hover:-translate-y-2 transition duration-300 border-b-4 border-transparent hover:border-accent">
              <h3 className="text-primary font-serif text-2xl mb-3">{card.title}</h3>
              <p className="text-gray-600 mb-5">{card.desc}</p>
              <Link to={card.link} className="text-accent font-semibold hover:underline">
                {card.text} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Main Content (Message & Notice Board) */}
      <main className="container mx-auto px-5 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Principal's Message */}
          <div>
            <h2 className="text-3xl font-serif text-primary mb-6">Welcome to GHSS Jengging</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Education is the most powerful weapon which you can use to change the world. At Government Higher Secondary School Jengging, we strive not only for academic excellence but also for the holistic development of every student.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Our dedicated faculty ensures that our students are nurtured in a safe, disciplined, and intellectually stimulating environment, preparing them for the challenges of tomorrow.
            </p>
            <p className="text-xl font-serif italic text-primary">— Mr. Tapang Pazing, Principal</p>
          </div>

          {/* Dynamic Notice Board */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-600">
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4 mb-6">
              <h3 className="text-2xl font-serif text-primary">📌 Announcements</h3>
              <Link to="/announcements" className="text-accent font-semibold hover:underline">View All &rarr;</Link>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="text-gray-500 animate-pulse font-medium">Loading latest announcements...</div>
              ) : homeNotices.length > 0 ? (
                homeNotices.map((notice) => (
                  <div key={notice.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <span className="flex items-center text-sm font-bold text-red-600 mb-1">
                      {formatDateForDisplay(notice.date)}
                      {notice.isNew && (
                        <span className="ml-3 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </span>
                    <Link to="/announcements" className="text-lg font-semibold text-primary hover:text-accent transition">
                      {notice.title}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic text-sm py-4">
                  No new announcements at this time. Check back later!
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* 5. School Statistics */}
      <section className="bg-[#f0f4f8] py-24 border-t border-gray-200">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { num: '1980', label: 'Year Established' },
              { num: '8+', label: 'Dedicated Educators' },
              { num: '100%', label: 'Commitment to Excellence' },
              { num: 'Class 12', label: 'Highest Academic Level' }
            ].map((stat, idx) => (
              <div key={idx}>
                <h2 className="text-6xl md:text-7xl font-bold font-serif text-primary mb-3">{stat.num}</h2>
                <p className="text-accent font-bold tracking-[0.15em] uppercase text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}