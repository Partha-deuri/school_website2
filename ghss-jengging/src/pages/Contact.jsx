export default function Contact() {
  return (
    <div className="flex flex-col font-sans">
      
      {/* PAGE HEADER */}
      <header className="h-[40vh] bg-gradient-to-br from-primary to-[#004080] flex items-center justify-center text-white text-center pt-[50px] mt-[-30px] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h1 className="text-5xl text-accent mb-3 font-serif font-bold">Contact Us</h1>
          <p className="text-lg opacity-90">We'd love to hear from you</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto max-w-7xl px-5 py-[60px]">
        {/* We use a grid to place the text on the left and map on the right on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* Left Side: Contact Details */}
          <div className="p-[15px]">
            <h2 className="text-3xl font-serif text-primary mb-4 font-bold">Get in Touch</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              For admissions, general inquiries, or feedback, please
              reach out to our administrative office.
            </p>

            <div className="mt-[30px] mb-8">
              <h3 className="text-xl font-serif text-primary font-bold mb-2">📍 Address</h3>
              <p className="text-gray-700 leading-relaxed">
                Government Higher Secondary School<br />
                Jengging, Siang District<br />
                Arunachal Pradesh, India - 791002
              </p>
            </div>

            <div className="mt-[20px]">
              <h3 className="text-xl font-serif text-primary font-bold mb-2">📞 Phone & Email</h3>
              <p className="text-gray-700 leading-relaxed">Phone: +91 [School Phone Number]</p>
              <p className="text-gray-700 leading-relaxed">Email: principal.ghssjengging@example.com</p>
            </div>
          </div>

          {/* Right Side: Google Map */}
          <div className="rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] w-full h-full min-h-[400px]">
            <iframe 
                src="https://maps.google.com/maps?q=Govt.+Higher+Secondary+School+Jengging,+Arunachal+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                className="w-full h-full border-0 min-h-[400px]"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

        </div>
      </main>

    </div>
  );
}