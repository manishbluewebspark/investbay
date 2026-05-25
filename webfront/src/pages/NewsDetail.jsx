// // NewsDetail.js
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Clock, ArrowUpRight, ArrowLeft, Loader2 } from "lucide-react";
// import Newsletter from "./Newsletter";

// // Reusing the same components from News.js
// const Tag = ({ children }) => (
//     <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-700">
//         {children}
//     </span>
// );

// const NewsCard = ({ image, category, title, excerpt, timeAgo, id, currentId }) => {
//     // Don't render if this is the current article
//     if (id === currentId) return null;
    
//     return (
//         <a href={`/news/${id}`} className="block group">
//             <article className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
//                 <div className="overflow-hidden">
//                     <img
//                         src={image}
//                         alt={title}
//                         className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
//                         onError={(e) => {
//                             e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop";
//                         }}
//                     />
//                 </div>
//                 <div className="p-4">
//                     <div className="flex items-center justify-between mb-2">
//                         <Tag>{category}</Tag>
//                         <TimeStamp time={timeAgo} />
//                     </div>
//                     <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors text-md">{title}</h3>
//                     <p className="mt-2 text-md text-gray-600 line-clamp-2">{excerpt}</p>
//                     <span className="mt-2 inline-flex items-center gap-1 text-md font-semibold text-indigo-600 group-hover:text-indigo-800 group-hover:underline transition-colors">
//                         Read More <ArrowUpRight className="w-3.5 h-3.5" />
//                     </span>
//                 </div>
//             </article>
//         </a>
//     );
// };

// const TimeStamp = ({ time }) => {
//     const getTimeAgo = (dateString) => {
//         const now = new Date();
//         const past = new Date(dateString);
//         const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
        
//         if (diffInHours < 1) return "Just now";
//         if (diffInHours === 1) return "1 hour ago";
//         if (diffInHours < 24) return `${diffInHours} hours ago`;
//         if (diffInHours < 48) return "Yesterday";
//         return `${Math.floor(diffInHours / 24)} days ago`;
//     };

//     return (
//         <span className="flex items-center gap-1 text-xs text-gray-500">
//             <Clock className="w-3 h-3" />
//             {getTimeAgo(time)}
//         </span>
//     );
// };

// // Shimmer for loading
// const ShimmerDetail = () => (
//     <div className="animate-pulse">
//         <div className="h-8 w-32 bg-gray-300 rounded mb-6"></div>
//         <div className="w-full h-[400px] bg-gray-300 rounded-xl mb-6"></div>
//         <div className="h-10 w-3/4 bg-gray-300 rounded mb-4"></div>
//         <div className="h-6 w-48 bg-gray-300 rounded mb-6"></div>
//         <div className="space-y-3">
//             <div className="h-4 w-full bg-gray-300 rounded"></div>
//             <div className="h-4 w-full bg-gray-300 rounded"></div>
//             <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
//         </div>
//     </div>
// );

// const ShimmerCard = () => (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
//         <div className="w-full h-40 bg-gray-300"></div>
//         <div className="p-4">
//             <div className="flex items-center justify-between mb-2">
//                 <div className="h-5 w-20 bg-gray-300 rounded"></div>
//                 <div className="h-4 w-16 bg-gray-300 rounded"></div>
//             </div>
//             <div className="h-5 w-full bg-gray-300 rounded"></div>
//             <div className="h-10 w-full bg-gray-300 rounded mt-2"></div>
//             <div className="h-5 w-24 bg-gray-300 rounded mt-2"></div>
//         </div>
//     </div>
// );

// export default function NewsDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [newsItem, setNewsItem] = useState(null);
//     const [allNews, setAllNews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
    
//     const apiUrl = import.meta.env.VITE_API_URL;

//     // Fetch specific news item and all other news
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
                
//                 // Fetch all news with high limit
//                 const allNewsRes = await axios.get(`${apiUrl}/news/all?limit=1000`);
                
//                 if (allNewsRes.data.success && Array.isArray(allNewsRes.data.news)) {
//                     setAllNews(allNewsRes.data.news);
                    
//                     // Find the current news item
//                     const currentNews = allNewsRes.data.news.find(item => item.id === parseInt(id));
                    
//                     if (currentNews) {
//                         setNewsItem(currentNews);
//                     } else {
//                         setError("News article not found");
//                     }
//                 } else {
//                     setError("Failed to fetch news");
//                 }
//             } catch (error) {
//                 console.error("Error fetching news:", error);
//                 setError(error.message || "Failed to load news");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchData();
//         }
//     }, [apiUrl, id]);

//     // Format other news for display (excluding current article)
//     const otherNews = allNews
//         .filter(item => item.id !== parseInt(id))
//         .map(article => ({
//             image: article.images?.[0]?.url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
//             category: article.category || "Market News",
//             title: article.title,
//             excerpt: article.short_description || article.full_article?.substring(0, 100) + "...",
//             timeAgo: article.scheduled_date || article.created_at,
//             id: article.id
//         }));

//     if (loading) {
//         return (
//             <>
//                 <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 min-h-screen">
//                     <div className="mx-auto px-4 max-w-7xl">
//                         {/* Back button shimmer */}
//                         <div className="h-8 w-32 bg-gray-300 rounded animate-pulse mb-6"></div>
                        
//                         {/* Detail shimmer */}
//                         <ShimmerDetail />
                        
//                         {/* Other News heading shimmer */}
//                         <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mt-12 mb-6"></div>
                        
//                         {/* Other news cards shimmer - 2 per row */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                             {[1, 2, 3, 4].map(i => (
//                                 <ShimmerCard key={i} />
//                             ))}
//                         </div>
//                     </div>
//                 </section>
//                 <Newsletter />
//             </>
//         );
//     }

//     if (error || !newsItem) {
//         return (
//             <>
//                 <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 min-h-screen">
//                     <div className="mx-auto px-4 max-w-7xl">
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6"
//                         >
//                             <ArrowLeft className="w-4 h-4" />
//                             Back
//                         </button>
                        
//                         <div className="text-center py-12">
//                             <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
//                                 <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                                     <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-2">News Not Found</h3>
//                                 <p className="text-gray-600">The article you're looking for doesn't exist.</p>
//                                 <button
//                                     onClick={() => navigate('/news')}
//                                     className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                                 >
//                                     Back to News
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//                 <Newsletter />
//             </>
//         );
//     }

//     return (
//         <>
//             <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 min-h-screen">
//                 {/* Background elements */}
//                 <div className="absolute inset-0">
//                     <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//                     <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//                 </div>

//                 <div className="absolute inset-0" style={{
//                     backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.05) 1px, transparent 0)`,
//                     backgroundSize: '40px 40px'
//                 }}></div>

//                 <div className="mx-auto px-4 max-w-7xl relative z-10">
//                     {/* Back button */}
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6 group"
//                     >
//                         <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//                         Back to News
//                     </button>

//                     {/* Main News Article */}
//                     <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
//                         {/* Hero Image */}
//                         {newsItem.images?.[0]?.url && (
//                             <div className="w-full h-[400px] overflow-hidden">
//                                 <img
//                                     src={newsItem.images[0].url}
//                                     alt={newsItem.title}
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => {
//                                         e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop";
//                                     }}
//                                 />
//                             </div>
//                         )}

//                         {/* Content */}
//                         <div className="p-8">
//                             <div className="flex items-center justify-between mb-4">
//                                 <Tag>{newsItem.category || "Market News"}</Tag>
//                                 <TimeStamp time={newsItem.scheduled_date || newsItem.created_at} />
//                             </div>

//                             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//                                 {newsItem.title}
//                             </h1>

//                             {/* Author info if available */}
//                             {newsItem.author && (
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                                         <span className="text-indigo-600 font-semibold">
//                                             {newsItem.author.charAt(0)}
//                                         </span>
//                                     </div>
//                                     <div>
//                                         <p className="font-medium text-gray-900">{newsItem.author}</p>
//                                         <p className="text-md text-gray-500">Author</p>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Full article content */}
//                             <div className="prose prose-lg max-w-none">
//                                 {newsItem.short_description && (
//                                     <p className="text-lg text-gray-700 font-medium mb-4">
//                                         {newsItem.short_description}
//                                     </p>
//                                 )}
//                                 <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
//                                     {newsItem.full_article}
//                                 </div>
//                             </div>
//                         </div>
//                     </article>

//                     {/* Other News Section */}
//                     {otherNews.length > 0 && (
//                         <div className="mt-12">
//                             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                                 More News You Might Like
//                                 <span className="text-md font-normal text-gray-500 ml-2">
//                                     ({otherNews.length} articles)
//                                 </span>
//                             </h2>

//                             {/* Other news cards - 2 per row */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                 {otherNews.map((article) => (
//                                     <NewsCard 
//                                         key={article.id} 
//                                         {...article} 
//                                         currentId={parseInt(id)}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </section>

//             <Newsletter />
//         </>
//     );
// }

// NewsDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, ArrowUpRight, ArrowLeft, Loader2, ChevronLeft, ChevronRight, Film, Play, Pause } from "lucide-react";
import Newsletter from "./Newsletter";

// Media Slider Component (supports both images and videos)
const MediaSlider = ({ media, title, className = "w-full h-full object-cover", autoPlay = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // Use provided media or fallback to a default image
    const mediaArray = media && media.length > 0 
        ? media 
        : [{ url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop", type: 'image' }];

    const goToPrevious = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? mediaArray.length - 1 : prevIndex - 1
        );
    };

    const goToNext = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prevIndex) => 
            prevIndex === mediaArray.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToSlide = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex(index);
    };

    const toggleVideoPlay = (e, videoRef) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.paused) {
            videoRef.play();
            setIsVideoPlaying(true);
        } else {
            videoRef.pause();
            setIsVideoPlaying(false);
        }
    };

    // Auto-play functionality when hovered (for images only)
    useEffect(() => {
        let interval;
        const currentItem = mediaArray[currentIndex];
        const isVideo = currentItem?.type === 'video' || 
                       (currentItem?.url && currentItem.url.match(/\.(mp4|webm|ogg|mov)$/i)) ||
                       currentItem?.mimeType?.startsWith('video/');

        // Only auto-advance if not a video and hovered
        if (isHovered && mediaArray.length > 1 && !isVideo) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => 
                    prevIndex === mediaArray.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered, mediaArray.length, currentIndex]);

    // Render single media
    if (mediaArray.length === 1) {
        const item = mediaArray[0];
        const isVideo = item.type === 'video' || 
                       (item.url && item.url.match(/\.(mp4|webm|ogg|mov)$/i)) ||
                       item.mimeType?.startsWith('video/');

        if (isVideo) {
            return (
                <div className="relative w-full h-full bg-black group">
                    <video
                        src={item.url}
                        className={className}
                        controls
                        playsInline
                        poster={item.thumbnail || null}
                    />
                </div>
            );
        }

        return (
            <img
                src={item.url}
                alt={title}
                className={className}
                onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop";
                }}
            />
        );
    }

    // Multiple media - render slider
    return (
        <div 
            className="relative w-full h-full overflow-hidden bg-black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Media Items */}
            <div 
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {mediaArray.map((item, idx) => {
                    const isVideo = item.type === 'video' || 
                                   (item.url && item.url.match(/\.(mp4|webm|ogg|mov)$/i)) ||
                                   item.mimeType?.startsWith('video/');

                    if (isVideo) {
                        return (
                            <div key={idx} className="relative w-full h-full flex-shrink-0">
                                <video
                                    src={item.url}
                                    className="w-full h-full object-contain"
                                    controls
                                    playsInline
                                    poster={item.thumbnail || null}
                                />
                            </div>
                        );
                    }

                    return (
                        <img
                            key={idx}
                            src={item.url}
                            alt={`${title} - Media ${idx + 1}`}
                            className="w-full h-full object-contain flex-shrink-0"
                            onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop";
                            }}
                        />
                    );
                })}
            </div>

            {/* Navigation Arrows - Show on hover or when multiple items */}
            {(isHovered || mediaArray.length > 1) && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-20 opacity-0 group-hover:opacity-100 hover:opacity-100"
                        style={{ opacity: isHovered ? 1 : 0 }}
                        aria-label="Previous media"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-20 opacity-0 group-hover:opacity-100 hover:opacity-100"
                        style={{ opacity: isHovered ? 1 : 0 }}
                        aria-label="Next media"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {mediaArray.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {mediaArray.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => goToSlide(e, idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                idx === currentIndex 
                                    ? 'bg-white w-4' 
                                    : 'bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Media Counter */}
            {mediaArray.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-20">
                    {currentIndex + 1} / {mediaArray.length}
                </div>
            )}

            {/* Video Indicator for current item */}
            {mediaArray[currentIndex]?.type === 'video' && (
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-20 flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    Video
                </div>
            )}
        </div>
    );
};

// Reusing the same components from News.js
const Tag = ({ children }) => (
    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-700">
        {children}
    </span>
);

const NewsCard = ({ media, category, title, excerpt, timeAgo, id, currentId }) => {
    // Don't render if this is the current article
    if (id === currentId) return null;
    
    return (
        <a href={`/news/${id}`} className="block group">
            <article className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                <div className="overflow-hidden h-40">
                    <MediaSlider 
                        media={media} 
                        title={title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Tag>{category}</Tag>
                        <TimeStamp time={timeAgo} />
                    </div>
                    <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors text-md">{title}</h3>
                    <p className="mt-2 text-md text-gray-600 line-clamp-2">{excerpt}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-md font-semibold text-indigo-600 group-hover:text-indigo-800 group-hover:underline transition-colors">
                        Read More <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </article>
        </a>
    );
};

const TimeStamp = ({ time }) => {
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return "Just now";
        if (diffInHours === 1) return "1 hour ago";
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInHours < 48) return "Yesterday";
        return `${Math.floor(diffInHours / 24)} days ago`;
    };

    return (
        <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {getTimeAgo(time)}
        </span>
    );
};

// Shimmer for loading
const ShimmerDetail = () => (
    <div className="animate-pulse">
        <div className="h-8 w-32 bg-gray-300 rounded mb-6"></div>
        <div className="w-full h-[400px] bg-gray-300 rounded-xl mb-6"></div>
        <div className="h-10 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="h-6 w-48 bg-gray-300 rounded mb-6"></div>
        <div className="space-y-3">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </div>
    </div>
);

const ShimmerCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-40 bg-gray-300"></div>
        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="h-5 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
            <div className="h-5 w-full bg-gray-300 rounded"></div>
            <div className="h-10 w-full bg-gray-300 rounded mt-2"></div>
            <div className="h-5 w-24 bg-gray-300 rounded mt-2"></div>
        </div>
    </div>
);

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);
    const [allNews, setAllNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const apiUrl = import.meta.env.VITE_API_URL;

    // Fetch specific news item and all other news
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch all news with high limit
                const allNewsRes = await axios.get(`${apiUrl}/news/all?limit=1000`);
                
                if (allNewsRes.data.success && Array.isArray(allNewsRes.data.news)) {
                    setAllNews(allNewsRes.data.news);
                    
                    // Find the current news item
                    const currentNews = allNewsRes.data.news.find(item => item.id === parseInt(id));
                    
                    if (currentNews) {
                        setNewsItem(currentNews);
                    } else {
                        setError("News article not found");
                    }
                } else {
                    setError("Failed to fetch news");
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setError(error.message || "Failed to load news");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [apiUrl, id]);

    // Format other news for display (excluding current article)
    const otherNews = allNews
        .filter(item => item.id !== parseInt(id))
        .map(article => {
            // Handle different possible media formats
            let mediaArray = [];
            
            // If media array exists (new format)
            if (article.media && article.media.length > 0) {
                mediaArray = article.media;
            }
            // If images array exists (old format)
            else if (article.images && article.images.length > 0) {
                mediaArray = article.images.map(img => ({
                    url: typeof img === 'string' ? img : img.url,
                    type: 'image'
                }));
            }
            // If single image exists
            else if (article.image) {
                mediaArray = [{
                    url: article.image,
                    type: 'image'
                }];
            }
            // Fallback
            else {
                mediaArray = [{
                    url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
                    type: 'image'
                }];
            }

            return {
                media: mediaArray,
                category: article.category || "Market News",
                title: article.title,
                excerpt: article.short_description || article.full_article?.substring(0, 100) + "...",
                timeAgo: article.scheduled_date || article.created_at,
                id: article.id
            };
        });

    if (loading) {
        return (
            <>
                <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 min-h-screen">
                    <div className="mx-auto px-4 max-w-7xl">
                        {/* Back button shimmer */}
                        <div className="h-8 w-32 bg-gray-300 rounded animate-pulse mb-6"></div>
                        
                        {/* Detail shimmer */}
                        <ShimmerDetail />
                        
                        {/* Other News heading shimmer */}
                        <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mt-12 mb-6"></div>
                        
                        {/* Other news cards shimmer - 2 per row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <ShimmerCard key={i} />
                            ))}
                        </div>
                    </div>
                </section>
                <Newsletter />
            </>
        );
    }

    if (error || !newsItem) {
        return (
            <>
                <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 min-h-screen">
                    <div className="mx-auto px-4 max-w-7xl">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        
                        <div className="text-center py-12">
                            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">News Not Found</h3>
                                <p className="text-gray-600">The article you're looking for doesn't exist.</p>
                                <button
                                    onClick={() => navigate('/news')}
                                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Back to News
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <Newsletter />
            </>
        );
    }

    // Format current news media
    let currentMedia = [];
    
    // If media array exists (new format)
    if (newsItem.media && newsItem.media.length > 0) {
        currentMedia = newsItem.media;
    }
    // If images array exists (old format)
    else if (newsItem.images && newsItem.images.length > 0) {
        currentMedia = newsItem.images.map(img => ({
            url: typeof img === 'string' ? img : img.url,
            type: 'image'
        }));
    }
    // If single image exists
    else if (newsItem.image) {
        currentMedia = [{
            url: newsItem.image,
            type: 'image'
        }];
    }
    // Fallback
    else {
        currentMedia = [{
            url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop",
            type: 'image'
        }];
    }

    return (
        <>
            <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 min-h-screen">
                {/* Background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                </div>

                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.05) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>

                <div className="mx-auto px-4 max-w-7xl relative z-10">
                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to News
                    </button>

                    {/* Main News Article */}
                    <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
                        {/* Media Slider */}
                        {currentMedia.length > 0 && (
                            <div className="w-full h-[400px] overflow-hidden">
                                <MediaSlider 
                                    media={currentMedia} 
                                    title={newsItem.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <Tag>{newsItem.category || "Market News"}</Tag>
                                <TimeStamp time={newsItem.scheduled_date || newsItem.created_at} />
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {newsItem.title}
                            </h1>

                            {/* Author info if available */}
                            {newsItem.author && (
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-semibold">
                                            {newsItem.author.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{newsItem.author}</p>
                                        <p className="text-md text-gray-500">Author</p>
                                    </div>
                                </div>
                            )}

                            {/* Full article content */}
                            <div className="prose prose-lg max-w-none">
                                {newsItem.short_description && (
                                    <p className="text-lg text-gray-700 font-medium mb-4">
                                        {newsItem.short_description}
                                    </p>
                                )}
                                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {newsItem.full_article}
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Other News Section */}
                    {otherNews.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                More News You Might Like
                                <span className="text-md font-normal text-gray-500 ml-2">
                                    ({otherNews.length} articles)
                                </span>
                            </h2>

                            {/* Other news cards - 2 per row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {otherNews.map((article) => (
                                    <NewsCard 
                                        key={article.id} 
                                        {...article} 
                                        currentId={parseInt(id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Newsletter />
        </>
    );
}