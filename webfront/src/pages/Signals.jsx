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
    <section className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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
                        <div className="w-12 h-12 rounded-full border-2 border-gray-200" />
                        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
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
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        <FiInbox className="w-7 h-7 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        No posts available
                      </p>
                      <p className="text-gray-400 text-xs">
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

      {/* Custom Scrollbar Styles - Light Theme */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 100px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
        }
      `}</style>
    </section>
  );
}