import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import TermsPopup from "../components/TermsPopup";
import { 
  FiArrowRight, FiUser, FiAward, FiTarget, FiTrendingUp, 
  FiActivity, FiClock, FiDollarSign, FiTag, FiPercent,
  FiBookOpen, FiBriefcase, FiShield
} from "react-icons/fi";

export default function SubscriptionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [plan, setPlan] = useState(null);
    const [analyst, setAnalyst] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [signalLoading, setSignalLoading] = useState(true);

    const raSignatureRef = useRef(null);

    // Terms Popup State
    const [showTermsPopup, setShowTermsPopup] = useState(false);
    const [termsHtml, setTermsHtml] = useState('');
    const [termsLoading, setTermsLoading] = useState(false);
    const [signatureFile, setSignatureFile] = useState(null); 
    const [raSignature, setRaSignature] = useState(null);

    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const user_id = parsedUser?.id;

    // Fallback images
    const fallbackPlanImage = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=450&fit=crop";
    const fallbackAvatar = "https://i.pravatar.cc/150";

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
        raSignatureRef.current = analyst?.signature;
    }, [analyst]);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        axios
            .get(`${apiUrl}/plans/details/${id}`)
            .then(res => {
                setPlan(res.data.data.plan);
                setAnalyst(res.data.data.analyst);
            })
            .catch(() => console.error("Failed to load plan details"))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        const fetchOtherSubscriptions = async () => {
            if (!analyst?.id) return;

            try {
                setSubscriptionLoading(true);
                const res = await axios.get(`${apiUrl}/plans/plansbyuser/${analyst.id}`);
                if (res.data.success) {
                    setSubscriptions(res.data.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setSubscriptionLoading(false);
            }
        };

        if (analyst?.id) {
            fetchOtherSubscriptions();
        }
    }, [apiUrl, analyst?.id]);

    const fetchTermsAndShowPopup = async () => {
        if (!plan || !analyst || !parsedUser) return;

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
                RA_FullName: analyst?.name || 'Research Analyst',
                RA_Address: analyst?.address || 'N/A',
                RA_Signature: analyst?.signature, 
                UserName: parsedUser?.name || 'User',
                UserPAN: parsedUser?.pan || 'N/A',
                RA_SEBI_Registration_Number: analyst?.sebi_number || 'N/A',
                Registration_Date: analyst?.registration_date || formatDate(today),
                Execution_Date: formatDate(today),
                StartDate: formatDate(today),
                EndDate: formatDate(endDate),
                EffectiveDate: formatDate(today),
                jurisdiction_place: 'Mumbai',
                ra_complaint_email: analyst?.complaint_email || 'complaints@signalz.in',
                ra_compliance_email: analyst?.compliance_email || 'compliance@signalz.in',
                service_name: plan.plan_name || 'Research Service',
                subscription_description: plan.short_description || 'No description available',
                combination_details: plan.combination_details || '',
                ask_mentor: plan.ask_mentor || '',
                signature: ''
            };

            const response = await axios.post(`${apiUrl}/terms/generate`, termsData, {
                responseType: 'text',
                headers: { 'Content-Type': 'application/json' }
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
            const res = await axios.get(`${apiUrl}/users/verify/${user_id}`);

            if (res.data.success && res.data.verified === true) {
                await fetchTermsAndShowPopup();
            } else {
                toast.error('Please complete your profile verification first');
                navigate('/profile');
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Verification failed. Please check your profile');
            navigate('/profile');
        }
    };

    const handleAgreeToTerms = async () => {
        try {
            setTermsLoading(true);
            
            const signatureBase64 = signatureFile ? await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(signatureFile);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            }) : '';

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
                RA_FullName: analyst?.name || 'Research Analyst',
                RA_Address: analyst?.address || 'N/A',
                UserName: parsedUser?.name || 'User',
                UserPAN: parsedUser?.pan || 'N/A',
                RA_SEBI_Registration_Number: analyst?.sebi_number || 'N/A',
                Registration_Date: analyst?.registration_date || formatDate(today),
                Execution_Date: formatDate(today),
                StartDate: formatDate(today),
                EndDate: formatDate(endDate),
                EffectiveDate: formatDate(today),
                jurisdiction_place: 'Mumbai',
                ra_complaint_email: analyst?.complaint_email || 'complaints@signalz.in',
                ra_compliance_email: analyst?.compliance_email || 'compliance@signalz.in',
                service_name: plan.plan_name || 'Research Service',
                subscription_description: plan.short_description || 'No description available',
                combination_details: plan.combination_details || '',
                ask_mentor: plan.ask_mentor || ''
            };

            const response = await axios.post(`${apiUrl}/terms/save-signed`, {
                termsData,
                userEmail: parsedUser?.email,
                userName: parsedUser?.name,
                signatureBase64
            });

            if (response.data.success) {
                toast.success('Agreement signed and sent to your email');
                
                navigate(`/subscription/${user_id}`, {
                    state: {
                        planId: plan?.id,
                        analystId: analyst?.id,
                        planName: plan?.plan_name,
                        planPrice: plan?.plan_price,
                        duration: plan?.duration,
                        signatureFile: signatureFile
                    }
                });
            }

        } catch (error) {
            console.error('Error saving signed agreement:', error);
            toast.error('Failed to save signed agreement. Please try again.');
        } finally {
            setTermsLoading(false);
            setShowTermsPopup(false);
        }
    };

    const compressImage = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 300;
                    const MAX_HEIGHT = 100;
                    
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedBase64);
                };
                img.onerror = error => reject(error);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSignatureComplete = async (file) => {
        try {
            setSignatureFile(file);
            
            const signatureBase64 = await compressImage(file);

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

            const currentRaSignature = raSignatureRef.current || raSignature || analyst?.signature;
            
            const termsData = {
                RA_FullName: analyst?.name || 'Research Analyst',
                RA_Address: analyst?.address || 'N/A',
                RA_Signature: currentRaSignature,
                UserName: parsedUser?.name || 'User',
                UserPAN: parsedUser?.pan || 'N/A',
                RA_SEBI_Registration_Number: analyst?.sebi_number || 'N/A',
                Registration_Date: analyst?.registration_date || formatDate(today),
                Execution_Date: formatDate(today),
                StartDate: formatDate(today),
                EndDate: formatDate(endDate),
                EffectiveDate: formatDate(today),
                jurisdiction_place: 'Mumbai',
                ra_complaint_email: analyst?.complaint_email || 'complaints@signalz.in',
                ra_compliance_email: analyst?.compliance_email || 'compliance@signalz.in',
                service_name: plan.plan_name || 'Research Service',
                subscription_description: plan.short_description || 'No description available',
                combination_details: plan.combination_details || '',
                ask_mentor: plan.ask_mentor || '',
                signature: signatureBase64
            };

            setTermsLoading(true);

            const response = await axios.post(`${apiUrl}/terms/generate`, termsData, {
                responseType: 'text',
                headers: { 'Content-Type': 'application/json' },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            setTermsHtml(response.data);
            toast.success('Signature uploaded successfully!');

        } catch (error) {
            console.error('Error adding signature:', error);
            if (error.response?.status === 413) {
                toast.error('Signature file too large. Please upload a smaller image.');
            } else {
                toast.error('Failed to add signature. Please try again.');
            }
        } finally {
            setTermsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative inline-flex">
                        <div className="w-14 h-14 rounded-full border-2 border-gray-200" />
                        <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Loading plan details...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <p className="text-red-600 text-sm font-medium mb-2">No plan data available.</p>
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
        { icon: FiActivity, label: "Total Signals", value: plan.total_signal || "N/A" },
        { icon: FiTrendingUp, label: "Active Calls", value: plan.active_calls || "N/A" },
        { icon: FiClock, label: "Exited Calls", value: plan.exited_calls || "N/A" },
        { icon: FiTarget, label: "Avg Signal Life", value: plan.avg_signal_life || "N/A" },
    ];

    const detailList = [
        { icon: FiTarget, label: "Specialization", value: analyst?.specialization || "N/A" },
        { icon: FiBriefcase, label: "Segment", value: plan.segment || "N/A" },
        { icon: FiTrendingUp, label: "Avg Trades", value: plan.avg_trades || "N/A" },
        { icon: FiDollarSign, label: "Ideal Capital", value: plan.ideal_capital ? `₹${Number(plan.ideal_capital).toLocaleString()}` : "N/A" },
        { icon: FiTag, label: "Category", value: plan.category || "N/A" },
        { icon: FiShield, label: "Stoploss %", value: plan.stop_loss ? `${plan.stop_loss}%` : "N/A" },
        { icon: FiClock, label: "Duration", value: plan.duration || "N/A" },
        { icon: FiDollarSign, label: "Plan Price", value: plan.plan_price ? `₹${Number(plan.plan_price).toLocaleString()}` : "N/A" },
        { icon: FiPercent, label: "Discount", value: plan.discount ? `${plan.discount}%` : "N/A" },
    ];

    return (
        <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT SIDE – IMAGE CARD */}
                    <div className="group/card relative bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-green-200">
                        <div className="w-full h-[400px] flex-shrink-0 relative">
                            <img
                                src={getImageUrl(plan?.uploded_image, fallbackPlanImage)}
                                alt="Plan"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = fallbackPlanImage;
                                    e.currentTarget.onerror = null;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                            <div className="mb-5">
                                <h2 className="text-xl font-['Aileron_Black'] font-bold text-gray-900 mb-2">
                                    {plan.plan_name || "N/A"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {plan.experience || "0"} years of experience
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
                        
                        {/* PLAN DETAILS */}
                        <div className="group/card relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-green-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <h3 className="text-xl font-['Aileron_Black'] font-bold text-gray-900">Plan Details</h3>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={termsLoading}
                                    className={`group/btn flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-['Aileron_Black'] font-semibold transition-all duration-300 cursor-pointer ${
                                        termsLoading
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {termsLoading ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
                                            Loading...
                                        </>
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

                        {/* ABOUT */}
                        <div className="group/card relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-green-200">
                            <h3 className="text-lg font-['Aileron_Black'] font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiBookOpen className="w-5 h-5 text-green-600" />
                                About Description
                            </h3>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {plan.short_description || "No information available"}
                                </p>
                            </div>
                        </div>

                        {/* MENTOR */}
                        <div className="group/card relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-green-200">
                            <h3 className="text-lg font-['Aileron_Black'] font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiUser className="w-5 h-5 text-green-600" />
                                Mentor
                            </h3>
                            <div className="border-t border-gray-100 pt-4">
                                {analyst ? (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={getImageUrl(analyst?.profile_image, fallbackAvatar)}
                                                    alt={analyst?.name || "Analyst"}
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
                                                    <p className="text-base font-['Aileron_Black'] font-bold text-gray-900">{analyst?.name}</p>
                                                    <FiAward className="w-4 h-4 text-green-600" />
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    SEBI: {analyst?.sebi_number || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/mentor/${analyst?.id}`)}
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
            </div>

            {/* Terms Popup */}
            <TermsPopup
                isOpen={showTermsPopup}
                onClose={() => setShowTermsPopup(false)}
                onAgree={handleAgreeToTerms}
                onSignatureComplete={handleSignatureComplete}
                termsHtml={termsHtml}
            />
        </section>
    );
}