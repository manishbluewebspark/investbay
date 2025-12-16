import React from "react";
import { coursesData } from "../../data/coursesData";
import bgImage from "../../assets/courses-bg.jpg";

export default function FeaturedCourses() {
  return (
    <section
      className="py-16 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl">
          Featured{" "}
          <span
            className="active-text"
            // style={{
            //   background: "linear-gradient(90deg, #00BFA6 50%, #BEFFF6 100%)",
            //   WebkitBackgroundClip: "text",
            // }}
          >
            Courses
          </span>
        </h2>
        <p className="text-gray-600 mt-2">
          Get exclusive market insights and expert recommendations from SEBI-registered advisors.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {coursesData.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-2 flex flex-col justify-between"
          >
            <img
              src={course.image}
              alt={course.title}
              className="rounded-xl object-cover w-full h-48 mb-4"
            />
            <div className="text-left space-y-2">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-gray-500 text-sm">By {course.mentor}</p>

              <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full"></div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Language</span>
                <span className="font-medium">{course.language}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Segment</span>
                <span className="font-medium">{course.segment}</span>
              </div>

              <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-l from-gray-400 via-gray-200 to-gray-50 rounded-full"></div>

              <div className="flex justify-between items-center">
                <p className="text-sm">
                  Incl taxes <br />
                  <span className="text-[#00BFA6] text-xl">{course.price}</span>
                </p>
                <button className="border rounded-md p-2 px-9 hover:bg-[#00BFA6] hover:text-white transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition">
          View All Courses
        </button>
      </div>
    </section>
  );
}
