import React from 'react';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2
          className="text-[20px] font-bold text-[#2a2118] tracking-tight leading-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Welcome, {user?.name || 'User'} 👋
        </h2>
        <p className="text-[12.5px] text-[#8a7e74] mt-0.5">
          Here's your admin overview for today
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['Card 1', 'Card 2', 'Card 3'].map((card) => (
          <div
            key={card}
            className="p-5 bg-white/20 backdrop-blur-xl border border-white/40 rounded-[18px]
              hover:bg-white/30 transition-all duration-200"
          >
            <p className="text-[13px] font-medium text-[#2a2118]">{card}</p>
          </div>
        ))}
      </div>

    </div>
  );
}