// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Clock, ArrowUpRight, Loader2 } from "lucide-react";
// import Newsletter from "./Newsletter";

// // --- Sub-components (same as before) ---
// const Tag = ({ children }) => (
//     <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-700">
//         {children}
//     </span>
// );

// const ReadMore = ({ id }) => (
//     <a href={`/news/${id}`} className="mt-2 inline-flex items-center gap-1 text-md font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
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

// // Shimmer Components (same as before)
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

// // Main Components (same as before)
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
//             <p className="mt-2 text-md text-gray-600 leading-relaxed">{excerpt}</p>
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
//             <h4 className="text-md font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">{title}</h4>
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
//                 className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
//                 onError={(e) => {
//                     e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop";
//                 }}
//             />
//         </div>
//         <div className="p-4">
//             <div className="flex items-center justify-between mb-2">
//                 <Tag>{category}</Tag>
//                 <TimeStamp time={timeAgo} />
//             </div>
//             <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors text-md">{title}</h3>
//             <p className="mt-2 text-md text-gray-600 line-clamp-2">{excerpt}</p>
//             <ReadMore id={id} />
//         </div>
//     </article>
// );

// // Updated Section Component - Modified to show ONLY 2 cards per row
// const NewsSection = ({ articles, sectionIndex }) => {
//     if (!articles || articles.length === 0) return null;

//     const heroArticle = articles[0];
//     const sidebarArticles = articles.slice(1, Math.min(6, articles.length));
//     const gridArticles = articles.slice(6, 10);

//     return (
//         <div className="mb-16 last:mb-0" key={`section-${sectionIndex}`}>
//             {/* Hero + Sidebar Grid - Only if we have at least 1 article */}
//             {heroArticle && (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-full mx-auto mb-8">
//                     <div className="lg:col-span-2">
//                         <HeroArticle {...heroArticle} />
//                     </div>
//                     {sidebarArticles.length > 0 && (
//                         <div className="flex flex-col gap-3">
//                             {sidebarArticles.map((item, i) => (
//                                 <SidebarNewsItem key={`sidebar-${sectionIndex}-${i}`} {...item} />
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Grid Articles - MODIFIED: Always show ONLY 2 cards per row */}
//             {gridArticles.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-full mx-auto">
//                     {gridArticles.map((article, i) => (
//                         <NewsCard key={`grid-${sectionIndex}-${i}`} {...article} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

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

// // Loading Spinner
// const LoadingSpinner = () => (
//     <div className="flex justify-center items-center py-8">
//         <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
//     </div>
// );

// // --- Main Component ---
// export default function News() {
//     const [allNews, setAllNews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const apiUrl = import.meta.env.VITE_API_URL;
//     const navigate = useNavigate();

//     // Fetch ALL news at once - NO LIMITS
//     useEffect(() => {
//         const fetchAllNews = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 // Remove limit parameter or set to a very high number
//                 // Try different approaches based on your API

//                 // Approach 1: If API supports no limit
//                 const res = await axios.get(`${apiUrl}/news/all?limit=1000`); // High limit

//                 // Approach 2: If API has pagination, fetch all pages
//                 // const res = await axios.get(`${apiUrl}/news/all?page=1&limit=100`);

//                 console.log("All News API response:", res.data);

//                 if (res.data.success && Array.isArray(res.data.news)) {
//                     setAllNews(res.data.news);

//                     // If there are more pages and you want to fetch ALL
//                     // Uncomment this if you need to fetch multiple pages
//                     /*
//                     let allNewsData = [...res.data.news];
//                     let currentPage = 1;
//                     const totalPages = res.data.totalPages || 1;
                    
//                     while (currentPage < totalPages) {
//                         currentPage++;
//                         const nextRes = await axios.get(`${apiUrl}/news/all?page=${currentPage}&limit=100`);
//                         if (nextRes.data.success && Array.isArray(nextRes.data.news)) {
//                             allNewsData = [...allNewsData, ...nextRes.data.news];
//                         }
//                     }
                    
//                     setAllNews(allNewsData);
//                     */
//                 } else {
//                     setAllNews([]);
//                     setError("Unexpected data format");
//                 }
//             } catch (error) {
//                 console.error("Error fetching news:", error);
//                 setError(error.message || "Failed to load news");
//                 setAllNews([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAllNews();
//     }, [apiUrl]);

//     // Process news into sections - Now handles any number of articles
//     const displaySections = [];
//     if (allNews.length > 0) {
//         // Create sections with 10 articles each, but last section can have fewer
//         for (let i = 0; i < allNews.length; i += 10) {
//             const sectionNews = allNews.slice(i, i + 10);

//             // Format articles for display
//             const formattedArticles = sectionNews.map(article => ({
//                 image: article.images?.[0]?.url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
//                 category: article.category || "Market News",
//                 title: article.title,
//                 excerpt: article.short_description || article.full_article?.substring(0, 150) + "...",
//                 timeAgo: article.scheduled_date || article.created_at,
//                 id: article.id
//             }));

//             displaySections.push({
//                 articles: formattedArticles,
//                 sectionIndex: i / 10
//             });
//         }
//     }

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

//                             {/* Grid Loading - MODIFIED to show only 2 shimmer cards per row */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-full mx-auto">
//                                 {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
//                                     <ShimmerCard key={i} />
//                                 ))}
//                             </div>
//                         </>
//                     ) : error || displaySections.length === 0 ? (
//                         <EmptyState />
//                     ) : (
//                         <>
//                             {/* Render ALL sections with ALL articles */}
//                             {displaySections.map((section) => (
//                                 <NewsSection key={`section-${section.sectionIndex}`} {...section} />
//                             ))}

//                             {/* Show total count */}
//                             <div className="text-center text-gray-600 mt-8 mb-4">
//                                 Total Articles: {allNews.length}
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </section>

//             <Newsletter />
//         </>
//     );
// }




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Clock, ArrowUpRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
// import Newsletter from "./Newsletter";

// // Image Slider Component
// const ImageSlider = ({ images, title, className = "w-full h-full object-cover" }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isHovered, setIsHovered] = useState(false);

//     // Use provided images or fallback to a default array with one image
//     const imageArray = images && images.length > 0 
//         ? images 
//         : [{ url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop" }];

//     const goToPrevious = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setCurrentIndex((prevIndex) => 
//             prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
//         );
//     };

//     const goToNext = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setCurrentIndex((prevIndex) => 
//             prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
//         );
//     };

//     const goToSlide = (e, index) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setCurrentIndex(index);
//     };

//     // Auto-play functionality when hovered
//     useEffect(() => {
//         let interval;
//         if (isHovered && imageArray.length > 1) {
//             interval = setInterval(() => {
//                 setCurrentIndex((prevIndex) => 
//                     prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
//                 );
//             }, 3000);
//         }
//         return () => clearInterval(interval);
//     }, [isHovered, imageArray.length]);

//     if (imageArray.length === 1) {
//         // Single image - render normally with original classes
//         return (
//             <img
//                 src={imageArray[0].url}
//                 alt={title}
//                 className={className}
//                 onError={(e) => {
//                     e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop";
//                 }}
//             />
//         );
//     }

//     // Multiple images - render slider while maintaining original dimensions
//     return (
//         <div 
//             className="relative w-full h-full overflow-hidden"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {/* Images */}
//             <div 
//                 className="flex transition-transform duration-500 ease-out h-full"
//                 style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//             >
//                 {imageArray.map((image, idx) => (
//                     <img
//                         key={idx}
//                         src={image.url}
//                         alt={`${title} - Image ${idx + 1}`}
//                         className={className + " flex-shrink-0"}
//                         onError={(e) => {
//                             e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop";
//                         }}
//                     />
//                 ))}
//             </div>

//             {/* Navigation Arrows - Only show on hover */}
//             {isHovered && imageArray.length > 1 && (
//                 <>
//                     <button
//                         onClick={goToPrevious}
//                         className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all duration-200 z-10"
//                         aria-label="Previous image"
//                     >
//                         <ChevronLeft className="w-4 h-4" />
//                     </button>
//                     <button
//                         onClick={goToNext}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all duration-200 z-10"
//                         aria-label="Next image"
//                     >
//                         <ChevronRight className="w-4 h-4" />
//                     </button>
//                 </>
//             )}

//             {/* Dots Indicator */}
//             {imageArray.length > 1 && (
//                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
//                     {imageArray.map((_, idx) => (
//                         <button
//                             key={idx}
//                             onClick={(e) => goToSlide(e, idx)}
//                             className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
//                                 idx === currentIndex 
//                                     ? 'bg-white w-3' 
//                                     : 'bg-white/50 hover:bg-white/80'
//                             }`}
//                             aria-label={`Go to slide ${idx + 1}`}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- Sub-components (exactly same as before, just using ImageSlider) ---
// const Tag = ({ children }) => (
//     <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-700">
//         {children}
//     </span>
// );

// const ReadMore = ({ id }) => (
//     <a href={`/news/${id}`} className="mt-2 inline-flex items-center gap-1 text-md font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
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

// // Shimmer Components (same as before)
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

// // Main Components (updated to use ImageSlider)
// const HeroArticle = ({ images, category, title, excerpt, timeAgo, id }) => (
//     <article className="group cursor-pointer">
//         <div className="overflow-hidden rounded-xl shadow-lg">
//             <ImageSlider 
//                 images={images} 
//                 title={title} 
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//             />
//         </div>
//         <div className="mt-4">
//             <div className="flex items-center justify-between">
//                 <Tag>{category}</Tag>
//                 <TimeStamp time={timeAgo} />
//             </div>
//             <h2 className="mt-3 text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{title}</h2>
//             <p className="mt-2 text-md text-gray-600 leading-relaxed">{excerpt}</p>
//             <ReadMore id={id} />
//         </div>
//     </article>
// );

// const SidebarNewsItem = ({ images, category, title, id }) => (
//     <article className="flex gap-3 group cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
//         <div className="w-30 h-25 flex-shrink-0 overflow-hidden rounded-md">
//             <ImageSlider 
//                 images={images} 
//                 title={title} 
//                 className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
//             />
//         </div>
//         <div className="flex flex-col justify-center min-w-0">
//             <span className="inline-block self-start text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 mb-1">{category}</span>
//             <h4 className="text-md font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">{title}</h4>
//             <ReadMore id={id} />
//         </div>
//     </article>
// );

// const NewsCard = ({ images, category, title, excerpt, timeAgo, id }) => (
//     <article className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
//         <div className="overflow-hidden h-40">
//             <ImageSlider 
//                 images={images} 
//                 title={title} 
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//             />
//         </div>
//         <div className="p-4">
//             <div className="flex items-center justify-between mb-2">
//                 <Tag>{category}</Tag>
//                 <TimeStamp time={timeAgo} />
//             </div>
//             <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors text-md">{title}</h3>
//             <p className="mt-2 text-md text-gray-600 line-clamp-2">{excerpt}</p>
//             <ReadMore id={id} />
//         </div>
//     </article>
// );

// // Updated Section Component - Modified to show ONLY 2 cards per row
// const NewsSection = ({ articles, sectionIndex }) => {
//     if (!articles || articles.length === 0) return null;

//     const heroArticle = articles[0];
//     const sidebarArticles = articles.slice(1, Math.min(6, articles.length));
//     const gridArticles = articles.slice(6, 10);

//     return (
//         <div className="mb-16 last:mb-0" key={`section-${sectionIndex}`}>
//             {/* Hero + Sidebar Grid - Only if we have at least 1 article */}
//             {heroArticle && (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-full mx-auto mb-8">
//                     <div className="lg:col-span-2">
//                         <HeroArticle {...heroArticle} />
//                     </div>
//                     {sidebarArticles.length > 0 && (
//                         <div className="flex flex-col gap-3">
//                             {sidebarArticles.map((item, i) => (
//                                 <SidebarNewsItem key={`sidebar-${sectionIndex}-${i}`} {...item} />
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Grid Articles - MODIFIED: Always show ONLY 2 cards per row */}
//             {gridArticles.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-full mx-auto">
//                     {gridArticles.map((article, i) => (
//                         <NewsCard key={`grid-${sectionIndex}-${i}`} {...article} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

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

// // Loading Spinner
// const LoadingSpinner = () => (
//     <div className="flex justify-center items-center py-8">
//         <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
//     </div>
// );

// // --- Main Component ---
// export default function News() {
//     const [allNews, setAllNews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const apiUrl = import.meta.env.VITE_API_URL;
//     const navigate = useNavigate();

//     // Fetch ALL news at once - NO LIMITS
//     useEffect(() => {
//         const fetchAllNews = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 // Remove limit parameter or set to a very high number
//                 // Try different approaches based on your API

//                 // Approach 1: If API supports no limit
//                 const res = await axios.get(`${apiUrl}/news/all?limit=1000`); // High limit

//                 // Approach 2: If API has pagination, fetch all pages
//                 // const res = await axios.get(`${apiUrl}/news/all?page=1&limit=100`);

//                 console.log("All News API response:", res.data);

//                 if (res.data.success && Array.isArray(res.data.news)) {
//                     setAllNews(res.data.news);

//                     // If there are more pages and you want to fetch ALL
//                     // Uncomment this if you need to fetch multiple pages
//                     /*
//                     let allNewsData = [...res.data.news];
//                     let currentPage = 1;
//                     const totalPages = res.data.totalPages || 1;
                    
//                     while (currentPage < totalPages) {
//                         currentPage++;
//                         const nextRes = await axios.get(`${apiUrl}/news/all?page=${currentPage}&limit=100`);
//                         if (nextRes.data.success && Array.isArray(nextRes.data.news)) {
//                             allNewsData = [...allNewsData, ...nextRes.data.news];
//                         }
//                     }
                    
//                     setAllNews(allNewsData);
//                     */
//                 } else {
//                     setAllNews([]);
//                     setError("Unexpected data format");
//                 }
//             } catch (error) {
//                 console.error("Error fetching news:", error);
//                 setError(error.message || "Failed to load news");
//                 setAllNews([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAllNews();
//     }, [apiUrl]);

//     // Process news into sections - Now handles any number of articles
//     const displaySections = [];
//     if (allNews.length > 0) {
//         // Create sections with 10 articles each, but last section can have fewer
//         for (let i = 0; i < allNews.length; i += 10) {
//             const sectionNews = allNews.slice(i, i + 10);

//             // Format articles for display - using images array instead of single image
//             const formattedArticles = sectionNews.map(article => ({
//                 images: article.images || [{ url: article.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop" }],
//                 category: article.category || "Market News",
//                 title: article.title,
//                 excerpt: article.short_description || article.full_article?.substring(0, 150) + "...",
//                 timeAgo: article.scheduled_date || article.created_at,
//                 id: article.id
//             }));

//             displaySections.push({
//                 articles: formattedArticles,
//                 sectionIndex: i / 10
//             });
//         }
//     }

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

//                             {/* Grid Loading - MODIFIED to show only 2 shimmer cards per row */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-full mx-auto">
//                                 {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
//                                     <ShimmerCard key={i} />
//                                 ))}
//                             </div>
//                         </>
//                     ) : error || displaySections.length === 0 ? (
//                         <EmptyState />
//                     ) : (
//                         <>
//                             {/* Render ALL sections with ALL articles */}
//                             {displaySections.map((section) => (
//                                 <NewsSection key={`section-${section.sectionIndex}`} {...section} />
//                             ))}

//                             {/* Show total count */}
//                             {/* <div className="text-center text-gray-600 mt-8 mb-4">
//                                 Total Articles: {allNews.length}
//                             </div> */}
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
import { Clock, ArrowUpRight, Loader2, ChevronLeft, ChevronRight, Film } from "lucide-react";
import Newsletter from "./Newsletter";

// Media Slider Component (supports both images and videos)
const MediaSlider = ({ media, title, className = "w-full h-full object-cover" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

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

    // Auto-play functionality when hovered
    useEffect(() => {
        let interval;
        if (isHovered && mediaArray.length > 1) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => 
                    prevIndex === mediaArray.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered, mediaArray.length]);

    // Render single media
    if (mediaArray.length === 1) {
        const item = mediaArray[0];
        const isVideo = item.type === 'video' || 
                       (item.url && item.url.match(/\.(mp4|webm|ogg|mov)$/i)) ||
                       item.mimeType?.startsWith('video/');

        if (isVideo) {
            return (
                <div className="relative w-full h-full bg-black">
                    <video
                        src={item.url}
                        className={className}
                        controls={false}
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                            e.target.pause();
                            e.target.currentTime = 0;
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Film className="text-white opacity-50" size={30} />
                    </div>
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
            className="relative w-full h-full overflow-hidden"
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
                            <div key={idx} className="relative w-full h-full flex-shrink-0 bg-black">
                                <video
                                    src={item.url}
                                    className={className}
                                    controls={false}
                                    muted
                                    loop
                                    playsInline
                                    onMouseEnter={(e) => e.target.play()}
                                    onMouseLeave={(e) => {
                                        e.target.pause();
                                        e.target.currentTime = 0;
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <Film className="text-white opacity-50" size={30} />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <img
                            key={idx}
                            src={item.url}
                            alt={`${title} - Media ${idx + 1}`}
                            className={className + " flex-shrink-0"}
                            onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop";
                            }}
                        />
                    );
                })}
            </div>

            {/* Navigation Arrows - Only show on hover */}
            {isHovered && mediaArray.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all duration-200 z-10"
                        aria-label="Previous media"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all duration-200 z-10"
                        aria-label="Next media"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {mediaArray.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {mediaArray.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => goToSlide(e, idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                idx === currentIndex 
                                    ? 'bg-white w-3' 
                                    : 'bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Media Type Indicator */}
            {mediaArray[currentIndex]?.type === 'video' && (
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                    Video
                </div>
            )}
        </div>
    );
};

// --- Sub-components (exactly same as before, just using MediaSlider) ---
const Tag = ({ children }) => (
    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-700">
        {children}
    </span>
);

const ReadMore = ({ id }) => (
    <a href={`/news/${id}`} className="mt-2 inline-flex items-center gap-1 text-md font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
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

// Main Components (updated to use MediaSlider)
const HeroArticle = ({ media, category, title, excerpt, timeAgo, id }) => (
    <article className="group cursor-pointer">
        <div className="overflow-hidden rounded-xl shadow-lg">
            <MediaSlider 
                media={media} 
                title={title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <Tag>{category}</Tag>
                <TimeStamp time={timeAgo} />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{title}</h2>
            <p className="mt-2 text-md text-gray-600 leading-relaxed">{excerpt}</p>
            <ReadMore id={id} />
        </div>
    </article>
);

const SidebarNewsItem = ({ media, category, title, id }) => (
    <article className="flex gap-3 group cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-30 h-25 flex-shrink-0 overflow-hidden rounded-md">
            <MediaSlider 
                media={media} 
                title={title} 
                className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
            />
        </div>
        <div className="flex flex-col justify-center min-w-0">
            <span className="inline-block self-start text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 mb-1">{category}</span>
            <h4 className="text-md font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">{title}</h4>
            <ReadMore id={id} />
        </div>
    </article>
);

const NewsCard = ({ media, category, title, excerpt, timeAgo, id }) => (
    <article className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
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

            // Format articles for display - using media array instead of images
            const formattedArticles = sectionNews.map(article => {
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
                        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
                        type: 'image'
                    }];
                }

                return {
                    media: mediaArray,
                    category: article.category || "Market News",
                    title: article.title,
                    excerpt: article.short_description || article.full_article?.substring(0, 150) + "...",
                    timeAgo: article.scheduled_date || article.created_at,
                    id: article.id
                };
            });

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
                        </>
                    )}
                </div>
            </section>

            <Newsletter />
        </>
    );
}