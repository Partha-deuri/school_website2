import { useState, useEffect } from 'react';
import { api } from '../services/api'; 

export default function StudentCorner() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchResources = async () => {
      try {
        const data = await api.getStudentResources();
        setResources(data);
      } catch (err) {
        console.error("Failed to load student resources:", err);
        setError("Failed to load resources. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="flex flex-col font-sans animate-fade-in-up">
      
      {/* PAGE HEADER */}
      <header className="h-[40vh] bg-gradient-to-br from-primary to-[#004080] flex items-center justify-center text-white text-center pt-[50px] mt-[-30px] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h1 className="text-5xl text-accent mb-3 font-serif font-bold">Student Corner</h1>
          <p className="text-lg opacity-90">Resources, Timetables, and Announcements</p>
        </div>
      </header>

      {/* RESOURCES GRID */}
      <main className="container mx-auto max-w-7xl px-5 py-[60px]">
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 text-primary font-semibold animate-pulse text-lg">
            Loading student resources...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg font-medium border border-red-100 max-w-2xl mx-auto">
            ⚠️ {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && resources.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-medium text-lg">
            No resources have been published yet. Check back soon!
          </div>
        )}

        {/* Dynamic Data Grid */}
        {!isLoading && !error && resources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-10">
            
            {resources.map((resource) => (
              <div 
                key={resource.id}
                className="bg-gray-50 border-l-[5px] border-l-accent p-[30px] rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:bg-white hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-primary text-2xl font-serif font-bold mb-4">{resource.title}</h3>
                  <p className="text-gray-700 mb-6 whitespace-pre-wrap">{resource.description}</p>
                </div>
                
                {/* Only render the button if an attachment exists */}
                {resource.fileUrl && (
                  <div>
                    <a 
                      href={resource.fileUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-primary text-white px-[15px] py-[8px] text-[0.9rem] rounded-md font-semibold hover:bg-[#2b408e] hover:-translate-y-1 transition-all duration-300"
                    >
                      <span>View Document</span>
                    </a>
                  </div>
                )}
              </div>
            ))}

          </div>
        )}
      </main>

    </div>
  );
}