import React, { useRef, useState } from "react";
import { testimonialsData } from "../../data/testimonialsData";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export default function Testimonials() {
  const containerRef = useRef(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const handlePlay = (id) => {
    setPlayingVideo((prev) => (prev === id ? null : id));
  };

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;
    const firstCard = container.firstElementChild;
    const setWidth = firstCard?.offsetWidth || 650;
    const gap = 24;
    const scrollAmount = setWidth * 2 + gap * 2;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const getEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  };

  return (
    <section className="py-16 px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute left-0 top-0 w-[100px] h-full bg-white z-10 pointer-events-none"></div>
      <div className="flex items-center justify-between mb-10 px-26 relative z-20">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Real People,{" "}
            <span 
            className="active-text"
            // className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFA6] to-[#BEFFF6]"
            >
              Real Results
            </span>
          </h2>
          <p className="text-gray-500 mt-2">
            Join the Thousands of Satisfied Investors
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 border border-gray-500 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-2 border border-gray-500 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      <div className="relative z-0 pl-[100px]">
        <div
          ref={containerRef}
          className="flex gap-8 overflow-x-hidden scroll-smooth transition-all duration-500"
        >
          {testimonialsData.map((item) => (
            <div key={item.id} className="flex gap-2 flex-shrink-0">
              <div className="w-[350px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden relative">
                <div className="relative w-full h-[300px]">
                  {playingVideo === item.id ? (
                    <iframe
                      src={getEmbedUrl(item.video)}
                      title={item.name}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <img
                        src={`https://img.youtube.com/vi/${
                          item.video.split("v=")[1]?.split("&")[0]
                        }/hqdefault.jpg`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                        onClick={() => handlePlay(item.id)}
                      >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Play className="text-[#00BFA6] w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-[350px] bg-gray-900 text-white rounded-2xl shadow-md border border-gray-800 p-6 flex flex-col justify-between">
                <p className="text-sm leading-snug opacity-90">{item.text}</p>
                <div className="mt-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
