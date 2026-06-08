import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiMessageCircle, FiShare2, FiDownload, FiFileText } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const FeedView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const feed = state?.feed;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFeedText = (text) => {
    if (!text) return "";
    return text
      .replace(/\\\\r\\\\n/g, "\n")
      .replace(/\\r\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .filter((line) => line.trim())
      .map((line, index) => (
        <p key={index} className="mb-5 text-white/90 font-light leading-relaxed tracking-wide text-md md:text-lg">
          {line}
        </p>
      ));
  };

  const getAssetUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const sanitizedBase = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
    const sanitizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${sanitizedBase}${sanitizedPath}`;
  };

  if (!feed) {
    return (
      <div className="min-h-screen bg-[#b8a495] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Soft Clay Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 rounded-full bg-slate-400/30 blur-2xl" />
        <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 rounded-full bg-amber-50/20 blur-xl" />
        
        <div className="w-full max-w-xl relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2.5rem] p-12 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
          <div className="text-sm font-light tracking-[0.3em] text-white/50 mb-8 uppercase">SYSTEM NOTICE</div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-8 uppercase select-none">FEED DATA NOT FOUND</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white/20 hover:bg-white text-white hover:text-[#b8a495] border border-white/30 rounded-xl tracking-widest text-xs font-bold uppercase transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#b8a495] p-4 md:p-8 flex items-center justify-center relative overflow-hidden font-sans antialiased selection:bg-white/30 selection:text-white">
      
      {/* 3D Soft-Render Clay Morphism Spheres (Muted Steel-Blue & Ivory/Cream) */}
      {/* <div className="absolute top-[8%] left-[5%] w-72 h-72 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.25),25px_35px_60px_rgba(0,0,0,0.15)] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-[12%] right-[-5%] w-[26rem] h-[26rem] rounded-full bg-gradient-to-br from-orange-50 via-amber-100 to-amber-200/80 shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.15),30px_40px_70px_rgba(0,0,0,0.12)] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[15%] w-56 h-56 rounded-full bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600/70 shadow-[inset_-15px_-15px_40px_rgba(0,0,0,0.3),20px_20px_40px_rgba(0,0,0,0.15)] pointer-events-none" /> */}

      {/* Editorial Minimal Layer Tags (Brutalist Portfolio Frame Elements) */}
      {/* <div className="hidden lg:block absolute top-8 left-8 text-[10px] font-light tracking-[0.4em] text-white/40 uppercase pointer-events-none select-none">Figma Composition</div>
      <div className="hidden lg:block absolute top-8 right-8 text-[10px] font-light tracking-[0.4em] text-white/40 uppercase pointer-events-none select-none">Design 2026</div>
      <div className="hidden lg:block absolute bottom-8 left-8 text-[10px] font-light tracking-[0.4em] text-white/40 uppercase pointer-events-none select-none">Glass Effect</div>
      <div className="hidden lg:block absolute bottom-8 right-8 text-[10px] font-light tracking-[0.4em] text-white/40 uppercase pointer-events-none select-none">By Portfolio UI</div> */}

      <div className="w-full max-w-3xl relative z-10">
        
        {/* Navigation Wrapper */}
        <div className="flex justify-between items-center mb-6 px-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] font-bold text-white/70 hover:text-white transition-colors duration-200"
            aria-label="Return to index"
          >
            <FiArrowLeft size={16} /> Back
          </button>
          <span className="text-[10px] tracking-[0.2em] font-light text-white/40 uppercase select-none">
            Perspective / 01
          </span>
        </div>

        {/* Core Premium Frosted Glass Card Panel */}
        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.2)] rounded-[2rem] p-6 md:p-10 text-white">
          
          {/* Top Frame Header Profile */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-white/10">
            {feed.ra_avatar ? (
              <div className="p-0.5 bg-white/20 rounded-2xl border border-white/10 shadow-sm backdrop-blur-md">
                <img
                  src={getAssetUrl(feed.ra_avatar)}
                  className="w-16 h-16 rounded-[1.15rem] object-cover"
                  alt={feed.ra_name || "Research Analyst"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/60";
                  }}
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 border border-white/20 shadow-inner">
                <FaUserTie className="w-8 h-8" />
              </div>
            )}

            <div className="overflow-hidden">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-1 text-white truncate drop-shadow-sm">
                {feed.ra_name || "Anonymous Analyst"}
              </h1>
              <div className="text-[10px] font-bold tracking-[0.25em] text-white/50 uppercase inline-block mt-1">
                RA REFERENCE ID: <span className="text-white/80 font-mono">{feed.ra_id || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Core Structured Container Space */}
          <div className="space-y-8">
            
            {/* Main Editorial Copy text */}
            <div className="tracking-wide text-white/95">
              {formatFeedText(feed.feed_text)}
            </div>

            {/* Media Rendering Attachments Area */}
            {feed.feed_documents?.length > 0 && (
              <div className="grid grid-cols-1 gap-4 pt-2">
                {feed.feed_documents.map((doc, i) => {
                  const targetUrl = getAssetUrl(doc.url);
                  const isImage = doc.mimetype?.startsWith("image/");

                  if (isImage) {
                    return (
                      <div key={i} className="rounded-2xl overflow-hidden border border-white/15 bg-white/5 p-1.5 shadow-xl">
                        <img
                          src={targetUrl}
                          className="w-full rounded-[1.15rem] max-h-[550px] object-cover"
                          alt="Layout content asset visual"
                        />
                      </div>
                    );
                  }

                  {/* Translucent Premium Document Card Downloader */}
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4 overflow-hidden mr-3">
                        <div className="p-3.5 bg-white/10 text-white rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-105">
                          <FiFileText size={20} />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-white truncate tracking-wide">
                            {doc.originalname || `Resource File #${i + 1}`}
                          </p>
                          <p className="text-[9px] font-bold tracking-widest text-white/40 uppercase mt-1">
                            {doc.mimetype?.split("/")[1] || "BINARY"} TYPE
                          </p>
                        </div>
                      </div>
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white text-white hover:text-[#b8a495] font-bold tracking-wider rounded-xl border border-white/20 shadow-sm text-xs uppercase transition-all duration-200 whitespace-nowrap active:scale-[0.97]"
                      >
                        <FiDownload size={13} />
                        Download
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Micro Tags Cloud Layout */}
            {feed.feed_tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {feed.feed_tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1 bg-white/5 text-white/90 border border-white/10 font-medium rounded-md text-[10px] uppercase tracking-[0.15em] backdrop-blur-sm"
                  >
                    #{tag.replace(/^#/, "")}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Panel Metadata Framework */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-8 border-t border-white/10 gap-6">
              
              {/* Counter Modules */}
              <div className="flex gap-7 text-white/60 font-medium">
                <span className="flex items-center gap-2 text-xs font-bold tracking-widest hover:text-white cursor-pointer transition-all duration-150 hover:scale-105">
                  <FiHeart size={17} className="text-white/40 transition-colors hover:text-white" /> 
                  {feed.feed_like_count || 0}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold tracking-widest hover:text-white cursor-pointer transition-all duration-150 hover:scale-105">
                  <FiMessageCircle size={17} className="text-white/40" /> 
                  {feed.feed_comment_count || 0}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold tracking-widest hover:text-white cursor-pointer transition-all duration-150 hover:scale-105">
                  <FiShare2 size={17} className="text-white/40" /> 
                  {feed.feed_share_count || 0}
                </span>
              </div>

              {/* Timestamp Stamp */}
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase whitespace-nowrap">
                {feed.created_at ? formatDate(feed.created_at) : "UNSPECIFIED DATESTAMP"}
              </p>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedView;