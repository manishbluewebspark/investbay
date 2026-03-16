
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Clock, ArrowUpRight, Loader2 } from "lucide-react";
// import Newsletter from "./Newsletter";

// // --- Sub-components ---
// const Tag = ({ children }) => (
//     <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-700">
//         {children}
//     </span>
// );

// const ReadMore = ({ id }) => (
//     <a href={`/news/${id}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
//         Read More <ArrowUpRight className="w-3.5 h-3.5" />
//     </a>
// );

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

// // Shimmer Components (same size as original)
// const ShimmerHero = () => (
//     <div className="animate-pulse">
//         <div className="overflow-hidden rounded-xl shadow-lg">
//             <div className="w-full h-[340px] bg-gray-300"></div>
//         </div>
//         <div className="mt-4">
//             <div className="flex items-center justify-between">
//                 <div className="h-5 w-24 bg-gray-300 rounded"></div>
//                 <div className="h-4 w-20 bg-gray-300 rounded"></div>
//             </div>
//             <div className="h-8 w-3/4 bg-gray-300 rounded mt-3"></div>
//             <div className="h-16 w-full bg-gray-300 rounded mt-2"></div>
//             <div className="h-5 w-28 bg-gray-300 rounded mt-2"></div>
//         </div>
//     </div>
// );

// const ShimmerSidebarItem = () => (
//     <div className="flex gap-3 p-3 animate-pulse">
//         <div className="w-30 h-25 bg-gray-300 rounded-md"></div>
//         <div className="flex flex-col justify-center min-w-0 space-y-2">
//             <div className="h-4 w-16 bg-gray-300 rounded"></div>
//             <div className="h-5 w-40 bg-gray-300 rounded"></div>
//             <div className="h-4 w-20 bg-gray-300 rounded"></div>
//         </div>
//     </div>
// );

// const ShimmerCard = () => (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
//         <div className="w-full h-56 bg-gray-300"></div>
//         <div className="p-5">
//             <div className="flex items-center justify-between mb-2">
//                 <div className="h-5 w-20 bg-gray-300 rounded"></div>
//                 <div className="h-4 w-16 bg-gray-300 rounded"></div>
//             </div>
//             <div className="h-6 w-full bg-gray-300 rounded"></div>
//             <div className="h-12 w-full bg-gray-300 rounded mt-2"></div>
//             <div className="h-5 w-24 bg-gray-300 rounded mt-2"></div>
//         </div>
//     </div>
// );

// // Main Components (exact same styling as your original)
// const HeroArticle = ({ image, category, title, excerpt, timeAgo, id }) => (
//     <article className="group cursor-pointer">
//         <div className="overflow-hidden rounded-xl shadow-lg">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 onError={(e) => {
//                     e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop";
//                 }}
//             />
//         </div>
//         <div className="mt-4">
//             <div className="flex items-center justify-between">
//                 <Tag>{category}</Tag>
//                 <TimeStamp time={timeAgo} />
//             </div>
//             <h2 className="mt-3 text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{title}</h2>
//             <p className="mt-2 text-sm text-gray-600 leading-relaxed">{excerpt}</p>
//             <ReadMore id={id} />
//         </div>
//     </article>
// );

// const SidebarNewsItem = ({ image, category, title, id }) => (
//     <article className="flex gap-3 group cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
//         <img
//             src={image}
//             alt={title}
//             className="w-30 h-25 object-cover rounded-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
//             onError={(e) => {
//                 e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=80&fit=crop";
//             }}
//         />
//         <div className="flex flex-col justify-center min-w-0">
//             <span className="inline-block self-start text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 mb-1">{category}</span>
//             <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">{title}</h4>
//             <ReadMore id={id} />
//         </div>
//     </article>
// );

// const NewsCard = ({ image, category, title, excerpt, timeAgo, id }) => (
//     <article className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
//         <div className="overflow-hidden">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
//                 onError={(e) => {
//                     e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop";
//                 }}
//             />
//         </div>
//         <div className="p-5">
//             <div className="flex items-center justify-between mb-2">
//                 <Tag>{category}</Tag>
//                 <TimeStamp time={timeAgo} />
//             </div>
//             <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors text-lg">{title}</h3>
//             <p className="mt-2 text-sm text-gray-600 line-clamp-2">{excerpt}</p>
//             <ReadMore id={id} />
//         </div>
//     </article>
// );

// // Empty State
// const EmptyState = () => (
//     <div className="col-span-full text-center py-12">
//         <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
//             <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
//                 </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Available</h3>
//             <p className="text-gray-600">Check back later for latest updates.</p>
//         </div>
//     </div>
// );

// // --- Main Component ---
// export default function News() {
//     const [news, setNews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const apiUrl = import.meta.env.VITE_API_URL;
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchNews = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 const res = await axios.get(`${apiUrl}/news/all`);
//                 console.log("News API response:", res.data);

//                 if (res.data.success && Array.isArray(res.data.news)) {
//                     setNews(res.data.news);
//                 } else {
//                     setNews([]);
//                     setError("Unexpected data format");
//                 }
//             } catch (error) {
//                 console.error("Error fetching news:", error);
//                 setError(error.message || "Failed to load news");
//                 setNews([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchNews();
//     }, [apiUrl]);

//     // Prepare data in the format your components expect
//     const heroArticle = news.length > 0 ? {
//         image: news[0].images?.[0]?.url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
//         category: news[0].category || "Market News",
//         title: news[0].title,
//         excerpt: news[0].short_description || news[0].full_article?.substring(0, 150) + "...",
//         timeAgo: news[0].scheduled_date || news[0].created_at,
//         id: news[0].id
//     } : null;

//     const sidebarArticles = news.slice(1, 6).map(article => ({
//         image: article.images?.[0]?.url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
//         category: article.category || "Market News",
//         title: article.title,
//         id: article.id
//     }));

//     const gridArticles = news.slice(6, 10).map(article => ({
//         image: article.images?.[0]?.url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
//         category: article.category || "Market News",
//         title: article.title,
//         excerpt: article.short_description || article.full_article?.substring(0, 100) + "...",
//         timeAgo: article.scheduled_date || article.created_at,
//         id: article.id
//     }));

//     return (
//         <>
//             <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 overflow-hidden lg:px-30">
//                 {/* Abstract Background Elements */}
//                 <div className="absolute inset-0">
//                     <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//                     <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
//                 </div>

//                 {/* Grid Pattern Overlay */}
//                 <div className="absolute inset-0" style={{
//                     backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.05) 1px, transparent 0)`,
//                     backgroundSize: '40px 40px'
//                 }}></div>

//                 <div className="mx-auto px-4 relative z-10">
                    

//                     {loading ? (
//                         <>
//                             {/* Hero + Sidebar Loading */}
//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-full mx-auto mb-12">
//                                 <div className="lg:col-span-2">
//                                     <ShimmerHero />
//                                 </div>
//                                 <div className="flex flex-col gap-3">
//                                     {[1, 2, 3, 4, 5].map((i) => (
//                                         <ShimmerSidebarItem key={i} />
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Grid Loading */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full mx-auto mt-10">
//                                 {[1, 2, 3, 4].map((i) => (
//                                     <ShimmerCard key={i} />
//                                 ))}
//                             </div>
//                         </>
//                     ) : error || news.length === 0 ? (
//                         <EmptyState />
//                     ) : (
//                         <>
//                             {/* Hero + Sidebar Grid */}
//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-full mx-auto mb-12">
//                                 <div className="lg:col-span-2">
//                                     {heroArticle && (
//                                         <HeroArticle {...heroArticle} />
//                                     )}
//                                 </div>
//                                 <div className="flex flex-col gap-3">
//                                     {sidebarArticles.map((item, i) => (
//                                         <SidebarNewsItem key={i} {...item} />
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Grid Articles */}
//                             {gridArticles.length > 0 && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full mx-auto mt-10">
//                                     {gridArticles.map((article, i) => (
//                                         <NewsCard key={i} {...article} />
//                                     ))}
//                                 </div>
//                             )}

//                             {/* View All Button */}
//                             <div className="text-center mt-12">
//                                 <button 
//                                     onClick={() => navigate("/all-news")}
//                                     className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
//                                 >
//                                     View All News
//                                     <ArrowUpRight className="w-5 h-5" />
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </section>

//             <Newsletter />
//         </>
//     );
// }






import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, ArrowUpRight, Loader2 } from "lucide-react";
import Newsletter from "./Newsletter";

// --- Sub-components (same as before) ---
const Tag = ({ children }) => (
    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-700">
        {children}
    </span>
);

const ReadMore = ({ id }) => (
    <a href={`/news/${id}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
        Read More <ArrowUpRight className="w-3.5 h-3.5" />
    </a>
);

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

// Shimmer Components (same as before)
const ShimmerHero = () => (
    <div className="animate-pulse">
        <div className="overflow-hidden rounded-xl shadow-lg">
            <div className="w-full h-[340px] bg-gray-300"></div>
        </div>
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="h-8 w-3/4 bg-gray-300 rounded mt-3"></div>
            <div className="h-16 w-full bg-gray-300 rounded mt-2"></div>
            <div className="h-5 w-28 bg-gray-300 rounded mt-2"></div>
        </div>
    </div>
);

const ShimmerSidebarItem = () => (
    <div className="flex gap-3 p-3 animate-pulse">
        <div className="w-30 h-25 bg-gray-300 rounded-md"></div>
        <div className="flex flex-col justify-center min-w-0 space-y-2">
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
            <div className="h-5 w-40 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
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

// Main Components (same as before)
const HeroArticle = ({ image, category, title, excerpt, timeAgo, id }) => (
    <article className="group cursor-pointer">
        <div className="overflow-hidden rounded-xl shadow-lg">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop";
                }}
            />
        </div>
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <Tag>{category}</Tag>
                <TimeStamp time={timeAgo} />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{title}</h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{excerpt}</p>
            <ReadMore id={id} />
        </div>
    </article>
);

const SidebarNewsItem = ({ image, category, title, id }) => (
    <article className="flex gap-3 group cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <img
            src={image}
            alt={title}
            className="w-30 h-25 object-cover rounded-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=80&fit=crop";
            }}
        />
        <div className="flex flex-col justify-center min-w-0">
            <span className="inline-block self-start text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 mb-1">{category}</span>
            <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">{title}</h4>
            <ReadMore id={id} />
        </div>
    </article>
);

const NewsCard = ({ image, category, title, excerpt, timeAgo, id }) => (
    <article className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="overflow-hidden">
            <img
                src={image}
                alt={title}
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop";
                }}
            />
        </div>
        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <Tag>{category}</Tag>
                <TimeStamp time={timeAgo} />
            </div>
            <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors text-base">{title}</h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{excerpt}</p>
            <ReadMore id={id} />
        </div>
    </article>
);

// Updated Section Component - Modified to show ONLY 2 cards per row
const NewsSection = ({ articles, sectionIndex }) => {
    if (!articles || articles.length === 0) return null;
    
    const heroArticle = articles[0];
    const sidebarArticles = articles.slice(1, Math.min(6, articles.length));
    const gridArticles = articles.slice(6, 10);
    
    return (
        <div className="mb-16 last:mb-0" key={`section-${sectionIndex}`}>
            {/* Hero + Sidebar Grid - Only if we have at least 1 article */}
            {heroArticle && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-full mx-auto mb-8">
                    <div className="lg:col-span-2">
                        <HeroArticle {...heroArticle} />
                    </div>
                    {sidebarArticles.length > 0 && (
                        <div className="flex flex-col gap-3">
                            {sidebarArticles.map((item, i) => (
                                <SidebarNewsItem key={`sidebar-${sectionIndex}-${i}`} {...item} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Grid Articles - MODIFIED: Always show ONLY 2 cards per row */}
            {gridArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-full mx-auto">
                    {gridArticles.map((article, i) => (
                        <NewsCard key={`grid-${sectionIndex}-${i}`} {...article} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Empty State
const EmptyState = () => (
    <div className="col-span-full text-center py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Available</h3>
            <p className="text-gray-600">Check back later for latest updates.</p>
        </div>
    </div>
);

// Loading Spinner
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
);

// --- Main Component ---
export default function News() {
    const [allNews, setAllNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Fetch ALL news at once - NO LIMITS
    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Remove limit parameter or set to a very high number
                // Try different approaches based on your API
                
                // Approach 1: If API supports no limit
                const res = await axios.get(`${apiUrl}/news/all?limit=1000`); // High limit
                
                // Approach 2: If API has pagination, fetch all pages
                // const res = await axios.get(`${apiUrl}/news/all?page=1&limit=100`);
                
                console.log("All News API response:", res.data);

                if (res.data.success && Array.isArray(res.data.news)) {
                    setAllNews(res.data.news);
                    
                    // If there are more pages and you want to fetch ALL
                    // Uncomment this if you need to fetch multiple pages
                    /*
                    let allNewsData = [...res.data.news];
                    let currentPage = 1;
                    const totalPages = res.data.totalPages || 1;
                    
                    while (currentPage < totalPages) {
                        currentPage++;
                        const nextRes = await axios.get(`${apiUrl}/news/all?page=${currentPage}&limit=100`);
                        if (nextRes.data.success && Array.isArray(nextRes.data.news)) {
                            allNewsData = [...allNewsData, ...nextRes.data.news];
                        }
                    }
                    
                    setAllNews(allNewsData);
                    */
                } else {
                    setAllNews([]);
                    setError("Unexpected data format");
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setError(error.message || "Failed to load news");
                setAllNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllNews();
    }, [apiUrl]);

    // Process news into sections - Now handles any number of articles
    const displaySections = [];
    if (allNews.length > 0) {
        // Create sections with 10 articles each, but last section can have fewer
        for (let i = 0; i < allNews.length; i += 10) {
            const sectionNews = allNews.slice(i, i + 10);
            
            // Format articles for display
            const formattedArticles = sectionNews.map(article => ({
                image: article.images?.[0]?.url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
                category: article.category || "Market News",
                title: article.title,
                excerpt: article.short_description || article.full_article?.substring(0, 150) + "...",
                timeAgo: article.scheduled_date || article.created_at,
                id: article.id
            }));
            
            displaySections.push({
                articles: formattedArticles,
                sectionIndex: i / 10
            });
        }
    }

    return (
        <>
            <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 overflow-hidden lg:px-30">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.05) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>

                <div className="mx-auto px-4 relative z-10">
                    {loading ? (
                        <>
                            {/* Hero + Sidebar Loading */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-full mx-auto mb-12">
                                <div className="lg:col-span-2">
                                    <ShimmerHero />
                                </div>
                                <div className="flex flex-col gap-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <ShimmerSidebarItem key={i} />
                                    ))}
                                </div>
                            </div>

                            {/* Grid Loading - MODIFIED to show only 2 shimmer cards per row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-full mx-auto">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <ShimmerCard key={i} />
                                ))}
                            </div>
                        </>
                    ) : error || displaySections.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            {/* Render ALL sections with ALL articles */}
                            {displaySections.map((section) => (
                                <NewsSection key={`section-${section.sectionIndex}`} {...section} />
                            ))}
                            
                            {/* Show total count */}
                            <div className="text-center text-gray-600 mt-8 mb-4">
                                Total Articles: {allNews.length}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Newsletter />
        </>
    );
}