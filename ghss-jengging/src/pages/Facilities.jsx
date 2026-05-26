export default function Facilities() {
  const facilities = [
    {
      title: "Spacious Classrooms",
      desc: "Well-ventilated, well-lit, and spacious classrooms designed to provide a comfortable and focused learning atmosphere for all students.",
      img: "/images/classroom.jpeg",
      alt: "GHSS Jengging Classroom"
    },
    {
      title: "Safe Drinking Water",
      desc: "Health and hygiene are our top priorities. The campus is equipped with purified, safe RO drinking water stations accessible to all students and staff.",
      img: "/images/drinking_water.jpeg",
      alt: "RO Drinking Water Facility"
    },
    {
      title: "Hygienic Washrooms",
      desc: "Clean, well-maintained, and separate washroom blocks for boys and girls, ensuring privacy, hygiene, and comfort with regular sanitation.",
      img: "/images/toilet.jpeg",
      alt: "Separate Washrooms for Boys and Girls"
    }
  ];

  return (
    <div className="flex flex-col font-sans">
      
      {/* PAGE HEADER */}
      <header className="h-[40vh] bg-gradient-to-br from-primary to-[#004080] flex items-center justify-center text-white text-center pt-[50px] mt-[-30px] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.2)]">
        <div>
          <h1 className="text-5xl text-accent mb-3 font-serif font-bold">Campus Facilities</h1>
          <p className="text-lg opacity-90">Providing a Safe, Clean, and Conducive Environment for Holistic Learning</p>
        </div>
      </header>

      {/* FACILITIES GRID */}
      <main className="container mx-auto max-w-7xl px-5 py-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-10">
          
          {facilities.map((facility, index) => (
            <div 
              key={index}
              className="bg-light p-0 overflow-hidden border-b-[5px] border-b-accent shadow-[0_4px_10px_rgba(0,0,0,0.03)] rounded-lg transition-all duration-300 hover:bg-white hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
            >
              <img 
                src={facility.img} 
                alt={facility.alt} 
                className="w-full h-[250px] object-cover bg-[#e0e0e0]" 
              />
              <div className="p-[25px]">
                <h3 className="text-primary text-2xl font-serif font-bold mb-4">{facility.title}</h3>
                <p className="text-gray-700">{facility.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </main>

    </div>
  );
}