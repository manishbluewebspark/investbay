import { useEffect, useState } from "react";
import { FiFilter, FiPlus } from "react-icons/fi";
import CourseCard from "../../components/CourseCard";
import AddCourseModal from "../../components/modals/AddCourseModal";
import NotFound from "../../components/NotFound";
import filterIcon from "../../../assets/card/filter.svg";
import axios from "axios";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/courses/${userId}`);
            const courseData = res.data?.data || [];
            setCourses(Array.isArray(courseData) ? courseData : []);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCourses();
        } else {
            setLoading(false);
            setCourses([]);
        }
    }, [userId]);

    return (
        <div className="">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-900">Course</h2>
                    <p className="text-sm text-gray-500">All courses list</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-md">
                        <img src={filterIcon} alt="Filter" className="w-4 h-4" /> Filter
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-md"
                    >
                        <FiPlus /> Add Course
                    </button>
                </div>
            </div>
            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : courses.length === 0 ? (
                <NotFound />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}

            {showModal && (
                <AddCourseModal
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchCourses}
                />
            )}
        </div>
    );
};

export default Courses;
