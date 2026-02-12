// import { useEffect, useState } from "react";
// import { FiFilter, FiPlus } from "react-icons/fi";
// import CourseCard from "../../components/CourseCard";
// import AddCourseModal from "../../components/modals/AddCourseModal";
// import NotFound from "../../components/NotFound";
// import filterIcon from "../../../assets/card/filter.svg";
// import axios from "axios";

// const Courses = () => {
//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const user = localStorage.getItem("user");
//     const userId = user ? JSON.parse(user).id : null;
//     const apiUrl = import.meta.env.VITE_API_URL;

//     const fetchCourses = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`${apiUrl}/courses/${userId}`);
//             const courseData = res.data?.data || [];
//             setCourses(Array.isArray(courseData) ? courseData : []);
//         } catch (err) {
//             console.error("Error fetching courses:", err);
//             setCourses([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (userId) {
//             fetchCourses();
//         } else {
//             setLoading(false);
//             setCourses([]);
//         }
//     }, [userId]);

//     return (
//         <div className="">
//             <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
//                 <div>
//                     <h2 className="text-3xl font-semibold text-gray-900">Course</h2>
//                     <p className="text-sm text-gray-500">All courses list</p>
//                 </div>

//                 <div className="flex gap-3">
//                     <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-md">
//                         <img src={filterIcon} alt="Filter" className="w-4 h-4" /> Filter
//                     </button>

//                     <button
//                         onClick={() => setShowModal(true)}
//                         className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-md"
//                     >
//                         <FiPlus /> Add Course
//                     </button>
//                 </div>
//             </div>
//             {loading ? (
//                 <p className="text-gray-400">Loading...</p>
//             ) : courses.length === 0 ? (
//                 <NotFound />
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {courses.map((course) => (
//                         <CourseCard key={course.id} course={course} />
//                     ))}
//                 </div>
//             )}

//             {showModal && (
//                 <AddCourseModal
//                     onClose={() => setShowModal(false)}
//                     onSuccess={fetchCourses}
//                 />
//             )}
//         </div>
//     );
// };

// export default Courses;




import { useEffect, useState } from "react";
import { FiFilter, FiPlus } from "react-icons/fi";
import CourseCard from "../../components/CourseCard";
import AddCourseModal from "../../components/modals/AddCourseModal";
import NotFound from "../../components/NotFound";
import filterIcon from "../../../assets/card/filter.svg";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import DeleteDynamicModal from "../../../components/DeleteDynamicModal";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deletingCourseId, setDeletingCourseId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // ✅ Delete modal state
    const [courseToDelete, setCourseToDelete] = useState(null);   // ✅ Course to delete
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

    // ✅ Open delete modal
    const handleDeleteClick = (courseId, course) => {
        setCourseToDelete(course);
        setDeletingCourseId(courseId);
        setDeleteModalOpen(true);
    };

    // ✅ Confirm delete
    const handleConfirmDelete = async () => {
        if (!deletingCourseId) return;

        try {
            await axios.delete(`${apiUrl}/courses/${deletingCourseId}`, {
                data: { userId }
            });
            fetchCourses();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete course");
        } finally {
            setDeleteModalOpen(false);
            setDeletingCourseId(null);
            setCourseToDelete(null);
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
                    <h2 className="text-3xl font-semibold text-gray-900">Courses</h2>
                    <p className="text-sm text-gray-500">All courses list</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-md hover:bg-gray-50">
                        <img src={filterIcon} alt="Filter" className="w-4 h-4" /> Filter
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2.5 rounded-xl hover:from-gray-800 hover:to-gray-900 shadow-lg"
                    >
                        <FiPlus size={18} /> Add Course
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Loading courses...</p>
                    </div>
                </div>
            ) : courses.length === 0 ? (
                <NotFound />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="relative group">
                            {/* ✅ DELETE BUTTON - TOP RIGHT CORNER */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    handleDeleteClick(course.id, course);
                                }}
                                disabled={deletingCourseId === course.id}
                                className="absolute top-2 right-3 z-20 bg-white border-2 border-red-200 shadow-lg rounded-full p-1.5 hover:bg-red-50 hover:border-red-300 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                title="Delete Course"
                            >
                                {deletingCourseId === course.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mx-auto"></div>
                                ) : (
                                    <FiTrash2 size={14} className="text-red-500" />
                                )}
                            </button>

                            {/* Course Card */}
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ ADD COURSE MODAL */}
            {showModal && (
                <AddCourseModal
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchCourses}
                />
            )}

            {/* ✅ DELETE CONFIRMATION MODAL */}
            <DeleteDynamicModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeletingCourseId(null);
                    setCourseToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Course?"
                description={
                    courseToDelete 
                        ? `This will permanently delete "${courseToDelete.course_title}" course and all its videos.`
                        : "This will permanently delete the course."
                }
            />
        </div>
    );
};

export default Courses;
