import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoList from "../admin/components/VideoList";
import TermsPopup from "../components/TermsPopup";
import { toast } from 'react-toastify';
import { 
  FiArrowRight, FiUser, FiClock, FiBookOpen, 
  FiAward, FiGlobe, FiUsers, FiTag, FiPercent, FiVideo 
} from "react-icons/fi";

export default function CourseDataDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [course, setCourse] = useState(null);
  const [analyst, setAnalyst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [parsedUser, setParsedUser] = useState(null);
  const [plan, setPlan] = useState(null);

  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsHtml, setTermsHtml] = useState('');
  const [termsLoading, setTermsLoading] = useState(false);

  // Fallback images
  const fallbackCourseImage = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=450&fit=crop";
  const fallbackAvatar = "https://i.pravatar.cc/100";

  // Helper function to get proper image URL
  const getImageUrl = (imageField, fallback) => {
    if (!imageField) return fallback;
    if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
      return imageField;
    }
    if (imageField.startsWith('/')) {
      return `${apiUrl}${imageField}`;
    }
    return `${apiUrl}/${imageField}`;
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/courses/data/${id}`);
        setCourse(res.data.data?.course || null);
        setAnalyst(res.data.data?.analyst || null);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id, apiUrl]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
        setParsedUser(user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const fetchTermsAndShowPopup = async () => {
    if (!plan || !analyst || !parsedUser) {
      toast.error('Please wait while we load all required information');
      return;
    }

    setTermsLoading(true);
    try {
      const today = new Date();
      const endDate = new Date(today);
      const durationDays = parseInt(plan.duration) || 30;
      endDate.setDate(endDate.getDate() + durationDays);

      const formatDate = (date) => {
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      };

      const termsData = {
        ra_fullname: analyst?.name || 'Research Analyst',
        ra_address: analyst?.address || 'N/A',
        username: parsedUser?.name || 'User',
        userpan: parsedUser?.pan || 'N/A',
        ra_sebi_registration_number: analyst?.sebi_number || analyst?.sebiNumber || 'N/A',
        registration_date: analyst?.registration_date || formatDate(today),
        execution_date: formatDate(today),
        start_date: formatDate(today),
        end_date: formatDate(endDate),
        effective_date: formatDate(today),
        jurisdiction_place: 'Mumbai',
        ra_complaint_email: analyst?.complaint_email || 'complaints@signalz.in',
        ra_compliance_email: analyst?.compliance_email || 'compliance@signalz.in',
        service_name: plan.plan_name || course?.course_title || 'Research Service',
        subscription_description: plan.short_description || course?.description || 'No description available',
        combination_details: plan.combination_details || '',
        ask_mentor: plan.ask_mentor || ''
      };

      const response = await axios.post(`${apiUrl}/terms/generate`, termsData, {
        responseType: 'text',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTermsHtml(response.data);
      setShowTermsPopup(true);

    } catch (error) {
      console.error('Error fetching terms:', error);
      toast.error('Failed to load terms and conditions. Please try again.');
    } finally {
      setTermsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      const userId = userData?.id || parsedUser?.id;

      if (!userId) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const res = await axios.get(`${apiUrl}/users/verify/${userId}`);

      if (res.data.success && res.data.verified === true) {
        setPlan({
          id: course?.id || id,
          plan_name: course?.course_title,
          plan_price: course?.course_price,
          duration: course?.access_validity,
          short_description: course?.description,
          combination_details: '',
          ask_mentor: 'yes'
        });

        setTimeout(() => {
          fetchTermsAndShowPopup();
        }, 100);
      } else {
        toast.error('Please complete your profile verification first');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Verification error:', error.response?.data || error.message);
      toast.error('Verification failed. Please check your profile');
      navigate('/profile');
    }
  };

  const handleAgreeToTerms = () => {
    setShowTermsPopup(false);

    if (!userData?.id || !plan) {
      toast.error('Missing user or plan data');
      return;
    }

    navigate(`/subscription/${userData.id}`, {
      state: {
        planId: plan.id,
        analystId: analyst?.id,
        planName: plan.plan_name,
        planPrice: plan.plan_price,
        duration: plan.duration
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative inline-flex">
            <div className="w-14 h-14 rounded-full border-2 border-gray-200" />
            <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-600 text-sm font-medium mb-2">No course data available.</p>
          <p className="text-gray-500 text-xs mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const infoList = [
    { icon: FiVideo, label: "Total Videos", value: course.total_videos || course.totalVideos || "N/A" },
    { icon: FiClock, label: "Duration", value: course.total_duration || course.totalDuration || "N/A" },
  ];

  const detailList = [
    { icon: FiAward, label: "Course Level", value: course.course_level || course.courseLevel || "N/A" },
    { icon: FiGlobe, label: "Language", value: course.course_language || course.languages || "N/A" },
    { icon: FiClock, label: "Access Validity", value: course.access_validity ? `${course.access_validity} month(s)` : "N/A" },
    { icon: FiUsers, label: "Learners", value: course.learners || "N/A" },
    { icon: FiTag, label: "Course Price", value: course.course_price ? `₹${Number(course.course_price).toLocaleString()}` : "N/A" },
    { icon: FiPercent, label: "Discount", value: course.discount ? `${course.discount}%` : "N/A" },
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT SIDE – IMAGE CARD */}
          <div className="group/card relative bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-green-200 shadow-sm">
            {/* Course Image */}
            <div className="w-full h-[400px] flex-shrink-0 relative">
              <img
                src={getImageUrl(course?.uploded_image || course?.uplodedImage, fallbackCourseImage)}
                alt={course.course_title || "Course"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackCourseImage;
                  e.currentTarget.onerror = null;
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
            </div>

            {/* Course Info */}
            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-5">
                <h2 className="text-xl font-['Aileron_Black'] font-bold text-gray-900 mb-2 group-hover/card:text-green-700 transition-colors duration-300">
                  {course.course_title || course.courseTitle || "Untitled Course"}
                </h2>
                <p className="text-sm text-gray-500">
                  {analyst?.experience || course.experience || "0"} years of experience
                </p>
              </div>

              <div className="space-y-2.5 flex-grow">
                {infoList.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-300">
                    <item.icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-sm font-['Aileron_Black'] font-semibold text-gray-900 ml-auto">
                      {item.value || "NA"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – ALL DETAILS */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* COURSE DETAILS CARD */}
            <div className="group/card relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-green-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-['Aileron_Black'] font-bold text-gray-900">Course Details</h3>
                <button
                  onClick={handleBuyNow}
                  disabled={termsLoading || !userData}
                  className={`group/btn flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-['Aileron_Black'] font-semibold transition-all duration-300 cursor-pointer ${
                    termsLoading || !userData
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {termsLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
                      Loading...
                    </>
                  ) : !userData ? (
                    'Please Login'
                  ) : (
                    <>
                      Buy Now
                      <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  {detailList.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-300">
                      <item.icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">{item.label}</p>
                        <p className="text-sm font-['Aileron_Black'] font-semibold text-gray-700 truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DESCRIPTION CARD */}
            <div className="group/card relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-green-200 shadow-sm">
              <h3 className="text-lg font-['Aileron_Black'] font-bold text-gray-900 mb-4">Description</h3>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {course.description || course.about_us || "No description available for this course."}
                </p>
              </div>
            </div>

            {/* MENTOR CARD */}
            <div className="group/card relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-green-200 shadow-sm">
              <h3 className="text-lg font-['Aileron_Black'] font-bold text-gray-900 mb-4">Mentor</h3>
              <div className="border-t border-gray-100 pt-4">
                {analyst ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={getImageUrl(analyst?.profile_image || analyst?.profileImage, fallbackAvatar)}
                          alt={analyst.name || "Analyst"}
                          className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                          onError={(e) => {
                            e.currentTarget.src = fallbackAvatar;
                            e.currentTarget.onerror = null;
                          }}
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-600 border-2 border-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-['Aileron_Black'] font-bold text-gray-900">{analyst.name || "Unknown"}</p>
                          <FiAward className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          SEBI Reg: {analyst.sebi_number || analyst.sebiNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => analyst.id && navigate(`/mentor/${analyst.id}`)}
                      className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-['Aileron_Black'] font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FiUser className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No mentor information available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* VIDEO LIST SECTION */}
        <div className="mt-8 group/card relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-green-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <FiBookOpen className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-['Aileron_Black'] font-bold text-gray-900">Course Overview</h3>
          </div>
          <VideoList
            courseId={id}
            userId={userData?.id}
            API_URL={apiUrl}
          />
        </div>

        {/* TERMS POPUP */}
        {showTermsPopup && (
          <TermsPopup
            isOpen={showTermsPopup}
            onClose={() => setShowTermsPopup(false)}
            onAgree={handleAgreeToTerms}
            termsHtml={termsHtml}
          />
        )}
      </div>
    </section>
  );
}