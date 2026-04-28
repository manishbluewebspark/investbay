import React from "react";
import data from "../../data/testimonials.json";
import { Star } from "lucide-react";

export default function Testimonials() {
  // duplicate data for seamless loop
  const loopData = [...data, ...data];

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-4xl font-semibold text-gray-800">
          What Our Users Say
        </h2>
        <p className="text-md text-gray-500 mt-2">
          Real feedback from investors and traders using InvestBay
        </p>

        {/* ROWS */}
        <div className="mt-12 space-y-8">

          {/* ROW 1 (Right) */}
          <div className="marquee">
            <div className="marquee-content">
              {loopData.map((item, index) => (
                <Card item={item} key={index} />
              ))}
            </div>
          </div>

          {/* ROW 2 (Left) */}
          <div className="marquee reverse">
            <div className="marquee-content">
              {loopData.map((item, index) => (
                <Card item={item} key={index} />
              ))}
            </div>
          </div>

          {/* ROW 3 (Right) */}
          <div className="marquee">
            <div className="marquee-content">
              {loopData.map((item, index) => (
                <Card item={item} key={index} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .marquee {
          overflow: hidden;
          position: relative;
        }

        .marquee-content {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: scroll 85s linear infinite;
        }

        .marquee.reverse .marquee-content {
          animation: scroll-reverse 85s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  );
}

/* CARD COMPONENT */
function Card({ item }) {
  return (
    <div className="max-w-3xl bg-white rounded-xl p-5 border border-gray-100 text-left relative  transition">

      {/* Profile */}
      <img
        src={item.image}
        alt=""
        className="w-8 h-8 rounded-full absolute top-4 right-4 object-cover"
      />

      {/* Review */}
      <p className="text-gray-500 text-md leading-relaxed pr-10 text-justify">
        {item.review}
      </p>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-4">
        
        {/* Stars */}
        <div className="flex gap-1">
          {[...Array(item.rating)].map((_, i) => (
            <Star
              key={i}
              size={15}
              className="text-yellow-400 fill-yellow-400"
            />
          ))}
        </div>

        {/* Name */}
        <span className="text-xs px-3 py-1 rounded-full border border-green-400 text-green-500">
          {item.name}
        </span>

      </div>
    </div>
  );
}