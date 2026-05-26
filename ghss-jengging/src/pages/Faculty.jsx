import { useState, useEffect } from 'react';
import { api } from '../services/api'; // Make sure this path is correct!

export default function Faculty() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);

    const fetchFaculty = async () => {
      try {
        const data = await api.getFaculty();
        setTeachers(data);
      } catch (err) {
        console.error("Failed to load faculty:", err);
        setError("Failed to load the faculty directory. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div className="flex flex-col font-sans animate-fade-in-up">
      
      {/* PAGE HEADER - Matching your precise CSS gradients and sizing */}
      <header className="h-[40vh] bg-gradient-to-br from-primary to-[#004080] flex items-center justify-center text-white text-center pt-[50px] mt-[-30px] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h1 className="text-5xl text-accent mb-3 font-serif font-bold">Our Faculty</h1>
          <p className="text-lg opacity-90">Dedicated Educators Shaping the Future of Jengging</p>
        </div>
      </header>

      {/* FACULTY GRID SECTION */}
      <main className="container mx-auto max-w-7xl px-5 py-[60px]">
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 text-primary font-semibold animate-pulse text-lg">
            Loading faculty directory...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg font-medium border border-red-100 max-w-2xl mx-auto">
            ⚠️ {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && teachers.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-medium text-lg">
            No faculty members found.
          </div>
        )}

        {/* Responsive Grid */}
        {!isLoading && !error && teachers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-10">
            
            {/* Loop through the database records to create the cards */}
            {teachers.map((teacher) => (
              <div 
                key={teacher.id} 
                className="px-5 py-9 border-t-[6px] border-t-primary border-b-[6px] border-b-accent flex flex-col justify-center bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] rounded-lg text-center hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-primary text-2xl font-serif font-bold mb-1">{teacher.name}</h3>
                  <p className="text-accent font-semibold mb-1">{teacher.role}</p>
                  <p className="text-sm text-gray-500 mb-4">{teacher.qual}</p>
                  
                  {/* Info Box: Only shows up if there is a Subject or Class Taught */}
                  {(teacher.subject || teacher.classTaught) && (
                    <div className="text-[0.95rem] text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200 space-y-1">
                      {teacher.subject && (
                        <span className="block"><strong>Subject:</strong> {teacher.subject}</span>
                      )}
                      
                      {teacher.classTaught && (
                        <span className="block"><strong>Classes Taught:</strong> {teacher.classTaught}</span>
                      )}
                    </div>
                  )}
                  
                </div>
              </div>
            ))}

          </div>
        )}
      </main>

    </div>
  );
}