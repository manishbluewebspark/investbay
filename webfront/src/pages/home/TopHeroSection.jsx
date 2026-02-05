import Mask from "../../assets/mask.jpg";
import PatternTop from "../../assets/PatternTop.jpg";

export default function TopHeroSection() {
  return (
    <div className="relative z-30 flex flex-col items-center text-center px-6 pt-24 pb-12 overflow-hidden">
      <style>{`
        /* 🔹 Top 40% background image overlay */
        .top-pattern-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 75%;
          background-image: url(${PatternTop});
          background-size: cover;
          background-position: top center;
          background-repeat: no-repeat;
          z-index: 0;
        }

        /* 🔹 Subtle top gradient overlay */
        .top-gradient-overlay {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 180px;
          background: radial-gradient(circle at top center, #00bfa6 0%, transparent 70%);
          opacity: 0.4;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>

      <div className="top-pattern-bg"></div>
      <div className="relative z-20">
        <span className="gradientborder inline-block rounded-full">
          <span className="bg-white text-sm px-4 py-1 rounded-full">
            Where knowledge turns into profit.
          </span>
        </span>

        <h1 className="text-4xl md:text-6xl mb-4 leading-tight">
          Invest With the <br />
          <span className="flex items-center gap-3">
            <span className="gradient-text koho-bold">Experts</span>{" "}
            <img src={Mask} alt="Mask" className="w-10 h-auto inline-block" /> You Trust.
          </span>
        </h1>

        <p className="text-gray-600 max-w-2xl mb-8">
          Discover India’s top research analysts, access real-time signals, and make
          data-driven investment decisions.
        </p>

        <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
          Explore Plans
        </button>
      </div>
    </div>
  );
}
