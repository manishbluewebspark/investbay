import React from "react";
import bgImage from "../assets/newletter-bg.jpg";

export default function Newsletter() {
  return (
    <section className="w-full bg-white flex justify-center items-center">
      <div
        className="w-full max-w-7xl py-12 flex justify-center items-center bg-cover bg-center bg-no-repeat rounded-t-2xl"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="text-center w-full max-w-xl px-4">
          <h2 className="text-2xl md:text-4xl  text-white mb-6">
            Subscribe Our <span className="text-white/90 font-semibold">Newsletter</span>
          </h2>

          <form className="flex items-center bg-white/10 backdrop-blur-md rounded-full overflow-hidden p-2 max-w-lg mx-auto border border-gray-300">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-transparent text-white placeholder-white/70 outline-none"
            />
            <button
              type="submit"
              className="bg-white text-gray-800 font-medium px-5 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
