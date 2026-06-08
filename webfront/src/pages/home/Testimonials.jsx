import React, { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sagar Rajvanshi",
    review: "The Value investing course is an awesome course with a good amount of knowledge and its best for the beginners who know nothing about stock market but want to invest in it. So if you are deciding, whether you have to take this course or not, I will recommend it will be very fruitful for you.",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Arun Dsouza",
    review: "I feel InvestBay is genuine and committed towards his customer as well as their offers for investment. Also would like to add their response time for queries is excellent and clear answer for questions. Because of InvestBay am into investment and will go long and longer!!! Thank you InvestBay giving me confidence and courage and patience, all together will make successful investor.",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Raja Dasgupta",
    review: "Team is young and enthusiastic!! I just started with InvestBay and getting constant updates and guidance from them. The care with which they listen and understand your goal is something different. The AI driven tool does the preliminary checks and thereafter the team steps in and provides the final touch. Till now the experience has been good, only time will tell how calculated the suggestions were!!",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Priya Mehta",
    review: "InvestBay is one of the best platforms for all your investments and learning needs. The team is committed and ethical. There is a positive culture and if someone wants to learn Value Investing dedicatedly then there is no alternative to InvestBay.",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    name: "Vikram Singh",
    review: "The capital lock feature gave me peace of mind during market volatility. My investments are protected and the returns are consistent. Best decision I made for my portfolio management.",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    name: "Neha Gupta",
    review: "The learn investing course transformed my understanding of the stock market. From a complete beginner to a confident investor, this journey has been amazing. The mentors are truly supportive and always available.",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: 7,
    name: "Amit Kumar",
    review: "Screen stocks feature is a game-changer! The filters are powerful and the technical indicators are spot on. I've discovered some great investment opportunities using this tool over the past few months.",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: 8,
    name: "Kavita Reddy",
    review: "Coach support has been invaluable. The 1-on-1 mentoring sessions helped me understand my risk profile better and create a diversified portfolio that aligns with my long-term financial goals.",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: 9,
    name: "Rajesh Nair",
    review: "Loss protection feature saved me during the recent market correction. The automated stops and insurance cover gave me confidence to stay invested even during volatile times. Truly a lifesaver!",
    platform: "Google",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
  },
];

const CARDS_PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(testimonials.length / CARDS_PER_PAGE);

export default function Testimonials() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = (idx) => {
    if (idx === page || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setPage(idx);
      setAnimating(false);
    }, 220);
  };

  const currentCards = testimonials.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 bg-black overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className={`text-[clamp(32px,4.5vw,52px)] font-black leading-[1.1] tracking-tight text-white mb-4 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            Trusted by Investors.
          </h2>
          <p
            className={`text-[15px] text-gray-400 max-w-xl mx-auto leading-relaxed transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
          >
            Definitely! We are leading the conversations on all social media. Here are some of them.
          </p>
        </div>

        {/* Cards — 3 per page */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 transition-all duration-220 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}
          style={{ transition: "opacity 0.22s ease, transform 0.22s ease" }}
        >
          {currentCards.map((item, idx) => (
            <Card key={`${page}-${idx}`} item={item} />
          ))}
        </div>

        {/* Dot pagination */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {Array.from({ length: TOTAL_PAGES }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-200 ${
                idx === page
                  ? "w-6 h-2.5 bg-green-500"
                  : "w-2.5 h-2.5 bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Trustpilot bar */}
        <div
          className={`text-center transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-[14px] text-gray-300">
            <span>We're rated</span>
            {/* Trustpilot star icon */}
            <span className="inline-flex items-center gap-1 bg-[#00b67a] text-white text-[12px] font-bold px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-white text-white" />
              Trustpilot
            </span>
            <span>
              <strong className="text-white">Excellent 4.6</strong> out of 5 on
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#00b67a] text-[#00b67a]" />
                ))}
              </span>
              <strong className="text-white underline underline-offset-2 cursor-pointer">Trustpilot</strong>
            </span>
            <span>based on <strong className="text-white">multiple reviews</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ item }) {
  return (
    <div className="group bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-200 cursor-default min-h-[280px]">

      {/* Review text */}
      <p
        className="text-[15px] text-gray-300 leading-relaxed line-clamp-6 mb-6 group-hover:text-gray-200 transition-colors duration-200 flex-1"
        style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
      >
        {item.review}
      </p>

      {/* Footer — avatar + name + platform */}
      <div className="flex items-center gap-3 pt-5 border-t border-white/[0.07]">
        <img
          src={item.image}
          alt={item.name}
          className="w-11 h-11 rounded-full object-cover border border-white/10 flex-shrink-0"
          onError={(e) => { e.currentTarget.src = "https://randomuser.me/api/portraits/men/1.jpg"; }}
        />
        <div>
          <h4
            className="text-[15px] font-black text-white leading-tight"
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            {item.name}
          </h4>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Said on:{" "}
            <span className="font-semibold text-gray-400">{item.platform}</span>
          </p>
        </div>
      </div>
    </div>
  );
}