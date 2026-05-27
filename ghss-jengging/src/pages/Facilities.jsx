import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFacilities = async () => {
      try {
        const data = await api.getFacilities();
        setFacilities(data);
      } catch (err) {
        console.error("Failed to load facilities:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  return (
    <div className="flex flex-col font-sans animate-fade-in-up">
      <header className="h-[40vh] bg-gradient-to-br from-primary to-[#004080] flex items-center justify-center text-white text-center pt-[50px] mt-[-30px] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h1 className="text-5xl text-accent mb-3 font-serif font-bold">Our Facilities</h1>
          <p className="text-lg opacity-90">State-of-the-art infrastructure for holistic development</p>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-5 py-[60px]">
        {isLoading && <div className="text-center py-12 text-primary font-semibold animate-pulse text-lg">Loading facilities...</div>}
        
        {!isLoading && facilities.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-medium text-lg">Facilities data is being updated. Check back soon!</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-10">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              {facility.imageUrl ? (
                <div className="h-56 overflow-hidden">
                  <img src={facility.imageUrl} alt={facility.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                  <span>Image Coming Soon</span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-primary text-2xl font-serif font-bold mb-3">{facility.title}</h3>
                <p className="text-gray-600 leading-relaxed">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}