import React from "react";
import { mentorsData } from "../../data/mentorsData";
import leftImg from "../../assets/left.png";
import rightImg from "../../assets/right.png";
import { useNavigate } from "react-router-dom";

export default function Mentors() {
  const navigate = useNavigate();
  return (
    <section
      className="py-16 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(144.29deg, #3A4EFB 35%, #FFFFFF 100%)",
      }}
    >
      {/* ✅ Heading */}
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl text-white mb-3">
          Meet Your Personal Investment{" "}
          <span className="font-semibold">Mentors</span>
        </h2>
        <p className="text-white/80 text-[15px]">
          Verified market experts guiding you toward smarter financial growth.
        </p>
      </div>

      {/* ✅ Mentor Cards Container */}
      <div className="relative max-w-6xl mx-auto mt-14 flex justify-center items-center">
        {/* ✅ Left Decorative Image — fixed beside cards */}
        <img
          src={leftImg}
          alt="left design"
          className="hidden md:block absolute -left-32 top-1/2 -translate-y-1/2 w-44 lg:w-56 opacity-70 z-0 pointer-events-none"
        />

        {/* ✅ Right Decorative Image — fixed beside cards */}
        <img
          src={rightImg}
          alt="right design"
          className="hidden md:block absolute -right-32 top-1/2 -translate-y-1/2 w-44 lg:w-56 opacity-70 z-0 pointer-events-none"
        />

        {/* ✅ Mentor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10 w-full">
          {mentorsData.slice(0, 4).map((mentor, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-white/10 backdrop-blur-sm"
            >
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-full h-84 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

              {/* Text Overlay */}
              <div className="absolute bottom-3 left-0 w-full px-4 text-white z-10">
                <h3 className="text-lg font-semibold text-left">{mentor.name}</h3>
                <div className="flex justify-between items-center text-sm text-white/90 mt-1">
                  <p className="text-left">Experience: {mentor.experience}</p>
                  <p className="text-right">{mentor.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Button */}
      <div className="text-center mt-12 relative z-10">
        <button onClick={() => navigate('/mentors')} className="px-6 py-2 bg-white text-black font-medium rounded-full shadow hover:bg-[#f3f3f3] transition">
          View All Mentors
        </button>
      </div>
    </section>
  );
}
