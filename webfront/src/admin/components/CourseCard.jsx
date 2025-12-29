import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const imageUrl = course?.uplodedImage
    ? `${apiUrl}/${course.uplodedImage.replace(/\\/g, "/").split("uploads/")[1]}`
    : "/placeholder-image.jpg";

  const price = Number(course?.coursePrice || 0);
  const discount = Number(course?.discount || 0);
  const oldPrice = price + (price * discount) / 100;

  return (
    <div
      onClick={() => navigate(`/admin/courses/details/${course.id}`)}
      className="bg-black rounded-xl overflow-hidden relative cursor-pointer hover:scale-105 transition-transform"
    >
      <img
        src={imageUrl}
        alt={course?.courseTitle || "Course"}
        className="w-full h-40 object-cover"
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg";
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute bottom-0 p-3 w-full">
        <h3 className="text-white font-semibold text-sm">
          {course?.courseTitle || "Untitled Course"}
        </h3>

        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-300">
            ₹{oldPrice.toFixed(2)}
            {discount > 0 && (
              <span className="text-green-400 ml-1">
                SAVE {discount}%
              </span>
            )}
          </p>

          <p className="text-white text-sm font-semibold">
            ₹{price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
