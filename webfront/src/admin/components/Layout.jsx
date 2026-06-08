import React from "react";
import Topbar from "../../admin/components/Topbar.jsx";
import Sidebar from "../../admin/components/Sidebar.jsx";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#c8b8a8" }}>

      {/* Decorative spheres */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute rounded-full" style={{ width: 320, height: 320, top: -90, right: 50, background: "radial-gradient(circle at 35% 35%, #8fa3b8, #3a5060)", opacity: 0.82 }} />
        <div className="absolute rounded-full" style={{ width: 220, height: 220, bottom: 30, left: -50, background: "radial-gradient(circle at 35% 35%, #e8ddd2, #a89880)", opacity: 0.75 }} />
        <div className="absolute rounded-full" style={{ width: 160, height: 160, top: 160, right: -20, background: "radial-gradient(circle at 35% 35%, #7b8fa0, #2a4050)", opacity: 0.78 }} />
        <div className="absolute rounded-full" style={{ width: 110, height: 110, bottom: 220, right: 180, background: "radial-gradient(circle at 35% 35%, #8fa3b8, #4a6070)", opacity: 0.65 }} />
        <div className="absolute rounded-full" style={{ width: 200, height: 200, top: "55%", left: "35%", background: "radial-gradient(circle at 35% 35%, #e0d4c8, #b0a090)", opacity: 0.42 }} />
      </div>

      {/* App shell */}
      <div className="relative z-10">
        <Topbar />

        <div className="pt-[58px] flex">
          {/* Sidebar — self-manages hover state, always 60px collapsed */}
          <Sidebar />

          {/* Main content — fixed ml-[60px], sidebar expands over content */}
          <main className="ml-[60px] flex-1 min-h-[calc(100vh-58px)] p-5 overflow-auto">
            {children}
          </main>
        </div>
      </div>

    </div>
  );
}