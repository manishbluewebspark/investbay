import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

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
  <section className="w-full">
    <div className="max-w-7xl mx-auto  px-6 py-8">
      
      {/* ✅ Single Outer Box */}
      <div className="h-[calc(100vh-100px)] min-h-0 rounded-2xl ">
        
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)_300px] xl:gap-6">

          {/* Left Column */}
          <aside
            ref={leftRef}
            className="min-h-0 overflow-y-auto hide-scrollbar"
          >
            <div className="flex flex-col gap-4">
              <MarketCard data={signalData.marketIndices} />
              <FiiDiiCard data={signalData.fiiDii} />
            </div>
          </aside>

          {/* Center Column */}
          <main
            ref={centerRef}
            className="min-h-0 overflow-y-auto hide-scrollbar"
          >
            <div className="flex min-h-full flex-col gap-4">
              {loading ? (
                <div className="flex flex-1 items-center justify-center py-10">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
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
                <div className="flex flex-1 items-center justify-center py-16 text-md text-gray-500">
                  No posts available
                </div>
              )}
            </div>
          </main>

          {/* Right Column */}
          <aside
            ref={rightRef}
            className="min-h-0 overflow-y-auto hide-scrollbar"
          >
            <div className="flex flex-col gap-4">
              <MarketCard data={signalData.marketIndices} />
              <FiiDiiCard data={signalData.fiiDii} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  </section>
);
}