import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FiInbox } from "react-icons/fi";

import MarketCard from "./signals/MarketCard";
import FiiDiiCard from "./signals/FiiDiiCard";
import PostCard from "./signals/PostCard";
import { signalData } from "../data/signalData";

export default function Signals() {
  const leftRef = useRef(null);
  const centerRef = useRef(null);
  const rightRef = useRef(null);
  const isSyncingRef = useRef(false);

  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  const user = useMemo(() => {
    try {
      const rawUser = localStorage.getItem("user");
      return rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      return null;
    }
  }, []);

  const userId = user?.id ?? null;

  const fetchFeeds = useCallback(async () => {
    if (!apiUrl) {
      console.error("VITE_API_URL is missing");
      setFeeds([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${apiUrl}/feeds/all-feed`, {
        withCredentials: true,
      });

      setFeeds(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching feeds:", error);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  useEffect(() => {
    const left = leftRef.current;
    const center = centerRef.current;
    const right = rightRef.current;

    if (!left || !center || !right) return;

    const syncScroll = (source) => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;

      const scrollTop = source.scrollTop;

      [left, center, right].forEach((el) => {
        if (el !== source) {
          const maxScrollTop = el.scrollHeight - el.clientHeight;
          el.scrollTop = Math.min(scrollTop, maxScrollTop);
        }
      });

      requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    };

    const onScrollLeft = () => syncScroll(left);
    const onScrollCenter = () => syncScroll(center);
    const onScrollRight = () => syncScroll(right);

    left.addEventListener("scroll", onScrollLeft, { passive: true });
    center.addEventListener("scroll", onScrollCenter, { passive: true });
    right.addEventListener("scroll", onScrollRight, { passive: true });

    return () => {
      left.removeEventListener("scroll", onScrollLeft);
      center.removeEventListener("scroll", onScrollCenter);
      right.removeEventListener("scroll", onScrollRight);
    };
  }, []);

  return (
    <section className="w-full min-h-screen bg-[#060b10]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="h-[calc(100vh-80px)] min-h-0">
          
          <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)_300px] xl:gap-6">

            {/* Left Column */}
            <aside
              ref={leftRef}
              className="min-h-0 overflow-y-auto custom-scrollbar"
            >
              <div className="flex flex-col gap-4 pb-4">
                <MarketCard data={signalData.marketIndices} />
                <FiiDiiCard data={signalData.fiiDii} />
              </div>
            </aside>

            {/* Center Column */}
            <main
              ref={centerRef}
              className="min-h-0 overflow-y-auto custom-scrollbar"
            >
              <div className="flex min-h-full flex-col gap-4 pb-4">
                {loading ? (
                  <div className="flex flex-1 items-center justify-center py-20">
                    <div className="text-center space-y-4">
                      <div className="relative inline-flex">
                        <div className="w-12 h-12 rounded-full border-2 border-white/[0.06]" />
                        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">
                        Loading feeds...
                      </p>
                    </div>
                  </div>
                ) : feeds.length > 0 ? (
                  feeds.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      userId={userId}
                      onUpdate={fetchFeeds}
                    />
                  ))
                ) : (
                  <div className="flex flex-1 items-center justify-center py-20">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                        <FiInbox className="w-7 h-7 text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">
                        No posts available
                      </p>
                      <p className="text-slate-600 text-xs">
                        Check back later for new content
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Right Column */}
            <aside
              ref={rightRef}
              className="min-h-0 overflow-y-auto custom-scrollbar"
            >
              <div className="flex flex-col gap-4 pb-4">
                <MarketCard data={signalData.marketIndices} />
                <FiiDiiCard data={signalData.fiiDii} />
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 100px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.06) transparent;
        }
      `}</style>
    </section>
  );
}