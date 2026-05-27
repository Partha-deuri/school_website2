import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data || { generalData: {} });
      } catch (err) {
        console.error("Failed to load contact settings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Safe data extraction with fallbacks to your original text if the database is empty
  const address = settings?.generalData?.address || "Government Higher Secondary School\nJengging, Siang District\nArunachal Pradesh, India - 791002";
  const phone = settings?.generalData?.phone || "+91 [School Phone Number]";
  const email = settings?.generalData?.email || "principal.ghssjengging@example.com";

  return (
    <div className="flex flex-col font-sans">
      
      {/* PAGE HEADER */}
      <header className="h-[40vh] bg-linear-to-br from-primary to-[#004080] flex items-center justify-center text-white text-center pt-12.5 -mt-7.5 shadow-[inset_0_-5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h1 className="text-5xl text-accent mb-3 font-serif font-bold">Contact Us</h1>
          <p className="text-lg opacity-90">We'd love to hear from you</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto max-w-7xl px-5 py-15">
        
        {isLoading ? (
          <div className="text-center py-12 text-primary font-semibold animate-pulse text-lg">
            Loading contact details...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            
            {/* Left Side: Contact Details */}
            <div className="p-3.75">
              <h2 className="text-3xl font-serif text-primary mb-4 font-bold">Get in Touch</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                For admissions, general inquiries, or feedback, please
                reach out to our administrative office.
              </p>

              <div className="mt-7.5 mb-8">
                <h3 className="text-xl font-serif text-primary font-bold mb-2">📍 Address</h3>
                {/* whitespace-pre-wrap ensures line breaks from the database render correctly */}
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {address}
                </p>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-serif text-primary font-bold mb-2">📞 Phone & Email</h3>
                <p className="text-gray-700 leading-relaxed">Phone: {phone}</p>
                <p className="text-gray-700 leading-relaxed">Email: {email}</p>
              </div>
            </div>

            {/* Right Side: Google Map */}
            <div className="rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] w-full h-full min-h-100">
              <iframe 
                  src="https://maps.google.com/maps?q=Govt.+Higher+Secondary+School+Jengging,+Arunachal+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  className="w-full h-full border-0 min-h-100"
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>

          </div>
        )}
      </main>

    </div>
  );
}