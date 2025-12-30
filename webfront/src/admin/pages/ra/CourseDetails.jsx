import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import AddVideoModal from "../../components/modals/AddVideoModal";
import VideoList from "../../components/VideoList";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError("");

        const user = localStorage.getItem("user");
        if (!user) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const userData = JSON.parse(user);
        setUserData(userData);

        if (!userData?.id) {
          setError("Invalid user data");
          setLoading(false);
          return;
        }

        const courseResponse = await axios.get(
          `${apiUrl}/courses/details/${id}`,
          { params: { userId: userData.id } }
        );

        if (courseResponse.data.success) {
          setCourse(courseResponse.data.data);

          const videoResponse = await fetch(
            `${apiUrl}/videos/videos/course/${id}/${userData.id}`
          );
          const videoData = await videoResponse.json();
          if (videoData.success) {
            setVideos(videoData.data);
          }
        } else {
          setError(courseResponse.data.message || "Course not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, apiUrl]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!course) return <div className="p-6">Course not found</div>;

  const imageUrl = `${apiUrl}/uploads/images/${course?.uplodedImage}`;

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 items-stretch">
        <div className="lg:col-span-1 h-full">
          <div className="relative h-full rounded-xl shadow overflow-hidden flex flex-col">
            <img
              src={imageUrl}
              alt={course.courseTitle}
              className="absolute inset-0 w-full h-full object-fill "
            />
            <div className="relative p-6 bg-white backdrop-blur-sm rounded-t-4xl mt-auto">
              <h2 className="text-lg   mb-2">
                {course.courseTitle}
              </h2>
              <p className="text-sm text-gray-600 bg-white px-3 py-1">
                {course.tradingCategory}
              </p>
            </div>
          </div>
        </div>


        <div className="lg:col-span-3 h-full">
          <div className="bg-white rounded-xl shadow p-8 h-full flex flex-col">
            <div className="border-b pb-6 border-gray-200 flex justify-between items-center mb-8">
              <h3 className="text-2xl  ">Course Details</h3>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                <FiPlus /> Add Video
              </button>
            </div>

            {/* Course Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Course Level
                </p>
                <p className="text-lg  ">
                  {course.courseLevel}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Language
                </p>
                <p className="text-lg ">
                  {course.courseLanguage}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Access Validity
                </p>
                <p className="text-lg  ">
                  {course.accessValidity}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Learners
                </p>
                <p className="text-lg  ">1,626</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Course Price
                </p>
                <p className="text-lg  ">
                  ₹{course.coursePrice}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Discount
                </p>
                <p className="text-lg  ">
                  {course.discount ? `${course.discount}%` : "—"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-auto">
              <p className="text-gray-500 text-sm font-medium mb-3">
                Description
              </p>
              <p className=" leading-relaxed text-base">
                {course.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW VIDEO SECTION */}
      <div className="bg-white rounded-xl shadow p-8">
        <div className="border-b pb-6 border-gray-200 mb-8">
          <h3 className="text-2xl  ">Course Overview</h3>
        </div>

        <VideoList courseId={id} userId={userData?.id} API_URL={apiUrl} />
      </div>

      <AddVideoModal
        isOpen={open}
        onClose={() => setOpen(false)}
        courseId={id}
        userId={userData?.id}
      />
    </div>
  );
}
