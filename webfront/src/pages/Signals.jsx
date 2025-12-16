import React, { useRef, useEffect } from "react";
import MarketCard from "./signals/MarketCard";
import FiiDiiCard from "./signals/FiiDiiCard";
import PostCard from "./signals/PostCard";
import { signalData } from "../data/signalData";
import Newsletter from "./Newsletter";

export default function Signals() {
  const leftRef = useRef(null);
  const centerRef = useRef(null);
  const rightRef = useRef(null);
  const isSyncingRef = useRef(false);

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
          const maxScroll = el.scrollHeight - el.clientHeight;
          el.scrollTop = Math.min(scrollTop, maxScroll);
        }
      });

      requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    };

    const onScrollLeft = () => syncScroll(left);
    const onScrollCenter = () => syncScroll(center);
    const onScrollRight = () => syncScroll(right);

    left.addEventListener("scroll", onScrollLeft);
    center.addEventListener("scroll", onScrollCenter);
    right.addEventListener("scroll", onScrollRight);

    return () => {
      left.removeEventListener("scroll", onScrollLeft);
      center.removeEventListener("scroll", onScrollCenter);
      right.removeEventListener("scroll", onScrollRight);
    };
  }, []);

  return (
<section>
        <div className="w-full max-w-full flex gap-4 h-[90vh] px-30 py-10">
      {/* Left Column */}
      <div
        ref={leftRef}
        className="w-1/4 h-full flex flex-col gap-4 overflow-y-auto pr-1 scroll-smooth hide-scrollbar"
      >
        <MarketCard data={signalData.marketIndices} />
        <FiiDiiCard data={signalData.fiiDii} />
      </div>

      {/* Center Column */}
      <div
        ref={centerRef}
        className="w-1/2 h-full overflow-y-auto px-2 scroll-smooth hide-scrollbar"
      >
        {signalData.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Right Column */}
      <div
        ref={rightRef}
        className="w-1/4 h-full flex flex-col gap-4 overflow-y-auto pl-1 scroll-smooth hide-scrollbar"
      >
        <MarketCard data={signalData.marketIndices} />
        <FiiDiiCard data={signalData.fiiDii} />
      </div>
    </div>
    <Newsletter />
</section>
  );
}
