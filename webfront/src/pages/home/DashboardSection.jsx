export default function DashboardSection() {
  return (
    <div className="relative z-20 flex justify-center pb-20 mt-10">
      <style>{`
        .gradient-border {
          position: relative;
          border-radius: 1rem 1rem 0 0;
          overflow: hidden;
        }
        .gradient-border::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 1rem 1rem 0 0;
          padding: 3px;
          background: linear-gradient(
            90deg,
            #E3D8FF 0%,
            #E3D8FF 33%,
            #E3D8FF 66%,
            #E3D8FF 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 3px),
            0 calc(100% - 3px)
          );
        }
        .above-dashboard-glow {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 20px;
          background: radial-gradient(circle at top center, #3A4EFB 0%, transparent 70%);
          opacity: 0.45;
          z-index: 15;
          pointer-events: none;
          filter: blur(20px);
        }
      `}</style>

      <div className="above-dashboard-glow"></div>

      <div
        className="absolute bottom-20.5 left-0 w-[50%] h-[200%] blur-5xl rounded-2xl ml-2 z-10"
        style={{
          background:
            "radial-gradient(39.65% 39.65% at 0% 100%, #3A4EFB 0%, #FFFFFF 100%)",
        }}
      ></div>

      <div
        className="absolute bottom-20.5 right-0 w-[50%] h-[200%] blur-5xl rounded-2xl mr-2 z-10"
        style={{
          background:
            "radial-gradient(39.65% 39.65% at 100% 100%, #3A4EFB 0%, #FFFFFF 100%)",
        }}
      ></div>

      <div className="relative z-20 w-[90%] md:w-[70%] gradient-border p-1 bg-white rounded-2xl">
        <img
          src="/dashboard.jpg"
          alt="Dashboard Preview"
          className="w-full h-auto rounded-2xl"
        />
      </div>
    </div>
  );
}
