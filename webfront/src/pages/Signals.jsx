// import React, { useRef, useEffect, useState } from "react";
// import MarketCard from "./signals/MarketCard";
// import FiiDiiCard from "./signals/FiiDiiCard";
// import PostCard from "./signals/PostCard";
// import { signalData } from "../data/signalData";
// import Newsletter from "./Newsletter";
// import axios from "axios";

// export default function Signals() {
//   const leftRef = useRef(null);
//   const centerRef = useRef(null);
//   const rightRef = useRef(null);
//   const isSyncingRef = useRef(false);
//   const [feeds, setFeeds] = useState([]);

//    const user = localStorage.getItem("user");
//   const userId = user ? JSON.parse(user).id : null;
//   const apiUrl = import.meta.env.VITE_API_URL;




//     const fetchFeeds = async () => {
//       // console.log('hiiii')
//       try {
      
//         const res = await axios.get(`${apiUrl}/feeds/all-feed`);
//         // console.log(res,'feeds...')
//         setFeeds(res.data?.data || []);
//       } catch (error) {
//         console.error("Error fetching feeds:", error);
//         setFeeds([]);
//       } 
//     };


//     useEffect(()=>{

// fetchFeeds()

//     },[])




//   useEffect(() => {
//     const left = leftRef.current;
//     const center = centerRef.current;
//     const right = rightRef.current;

//     if (!left || !center || !right) return;

//     const syncScroll = (source) => {
//       if (isSyncingRef.current) return;
//       isSyncingRef.current = true;

//       const scrollTop = source.scrollTop;

//       [left, center, right].forEach((el) => {
//         if (el !== source) {
//           const maxScroll = el.scrollHeight - el.clientHeight;
//           el.scrollTop = Math.min(scrollTop, maxScroll);
//         }
//       });

//       requestAnimationFrame(() => {
//         isSyncingRef.current = false;
//       });
//     };

//     const onScrollLeft = () => syncScroll(left);
//     const onScrollCenter = () => syncScroll(center);
//     const onScrollRight = () => syncScroll(right);

//     left.addEventListener("scroll", onScrollLeft);
//     center.addEventListener("scroll", onScrollCenter);
//     right.addEventListener("scroll", onScrollRight);

//     return () => {
//       left.removeEventListener("scroll", onScrollLeft);
//       center.removeEventListener("scroll", onScrollCenter);
//       right.removeEventListener("scroll", onScrollRight);
//     };
//   }, []);

//   return (
// <section>
//         <div className="w-full max-w-full flex gap-4 h-[90vh] px-30 py-10">
//       {/* Left Column */}
//       <div
//         ref={leftRef}
//         className="w-1/4 h-full flex flex-col gap-4 overflow-y-auto pr-1 scroll-smooth hide-scrollbar"
//       >
//         <MarketCard data={signalData.marketIndices} />
//         <FiiDiiCard data={signalData.fiiDii} />
//       </div>

//       {/* Center Column */}
//       <div
//         ref={centerRef}
//         className="w-1/2 h-full overflow-y-auto px-2 scroll-smooth hide-scrollbar"
//       >
//         {feeds.map((post) => (
//           <PostCard key={post.id} post={post} />
//         ))}
//       </div>

//       {/* Right Column */}
//       <div
//         ref={rightRef}
//         className="w-1/4 h-full flex flex-col gap-4 overflow-y-auto pl-1 scroll-smooth hide-scrollbar"
//       >
//         <MarketCard data={signalData.marketIndices} />
//         <FiiDiiCard data={signalData.fiiDii} />
//       </div>
//     </div>
//     <Newsletter />
// </section>
//   );
// }

// components/Signals.jsx
import React, { useRef, useEffect, useState } from "react";
import MarketCard from "./signals/MarketCard";
import FiiDiiCard from "./signals/FiiDiiCard";
import PostCard from "./signals/PostCard";
import { signalData } from "../data/signalData";
import Newsletter from "./Newsletter";
import axios from "axios";

export default function Signals() {
  const leftRef = useRef(null);
  const centerRef = useRef(null);
  const rightRef = useRef(null);
  const isSyncingRef = useRef(false);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/feeds/all-feed`, {
        withCredentials: true
      });
      setFeeds(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching feeds:", error);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  // Sync scroll effect (your existing code)
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
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : feeds.length > 0 ? (
            feeds.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onUpdate={fetchFeeds}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              No posts available
            </div>
          )}
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
