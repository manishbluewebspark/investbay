// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// const CourseCard = ({ course }) => {

  
//   const navigate = useNavigate();
//   const [imageError, setImageError] = useState(false);

//   const imageUrl = course?.uploded_image || "/placeholder-image.jpg";
//   const displayImage = imageError ? "/placeholder-image.jpg" : imageUrl;

//   const price = Number(course?.course_price || 0);
//   const discount = Number(course?.discount || 0);
//   const oldPrice = price + (price * discount) / 100;



//   return (



//     <div
//       onClick={() => navigate(`/admin/courses/details/${course.id}`)}
//       className="relative cursor-pointer rounded-xl overflow-hidden w-100 h-65 shadow-md bg-gray-100"
//     >
//       <div className="absolute inset-0 flex items-stretch justify-stretch">
//         <img
//           src={displayImage}
//           alt={course?.courseTitle || "Course Image"}
//           className="flex-1"
//           style={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'fill',
//           }}
//           onError={() => setImageError(true)}
//           onLoad={() => setImageError(false)}
//         />
//       </div>

//       <div className="absolute bottom-3 left-3 right-3 p-3 rounded-md backdrop-blur-xl bg-black/60 z-10">
//         <h3 className="text-white font-semibold text-md line-clamp-2">
//           {course?.course_title || "Untitled Course"}
//         </h3>

//         <div className="flex justify-between items-center mt-1">
//           <p className="text-xs text-gray-300 line-through">
//             {/* ₹{oldPrice.toFixed(2)} */}
//             {discount > 0 && (
//               <span className="text-green-400 ml-1">
//                 SAVE {discount
// }%
//               </span>
//             )}
//           </p>

//           <p className="text-white text-md font-semibold">
//             ₹{price.toFixed(2)}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseCard;


import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    const imageUrl = course?.uploded_image || "/placeholder-image.jpg";
    const displayImage = imageError ? "/placeholder-image.jpg" : imageUrl;

    const price = Number(course?.course_price || 0);
    const discount = Number(course?.discount || 0);
    const oldPrice = price + (price * discount) / 100;

    return (
        <div
            onClick={() => navigate(`/admin/courses/details/${course.id}`)}
            className="relative cursor-pointer rounded-xl overflow-hidden w-full h-[260px] shadow-md bg-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <div className="absolute inset-0 flex items-stretch justify-stretch">
                <img
                    src={displayImage}
                    alt={course?.course_title || "Course Image"}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                />
            </div>

            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-md backdrop-blur-xl bg-black/70 z-10">
                <h3 className="text-white font-semibold text-md line-clamp-2 leading-tight">
                    {course?.course_title || "Untitled Course"}
                </h3>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1">
                        {discount > 0 && (
                            <span className="text-green-400 text-xs font-medium">
                                SAVE {discount}%
                            </span>
                        )}
                    </div>
                    <p className="text-white text-md font-bold">
                        ₹{price.toFixed(0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
