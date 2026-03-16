
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import TermsPopup from "../components/TermsPopup";
import { useRef } from "react";


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

   console.log(analyst?.signature,'analyst..')
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




    useEffect(()=>{

 raSignatureRef.current = analyst?.signature

    },[analyst])

//     const fetchRaSignature = useCallback(async () => {
//     if (!analyst?.id) return;
    
//     try {
//         const response = await axios.get(`${apiUrl}/research-analyst/signature/${analyst.id}`);
//         if (response.data.success && response.data.signature) {
//             setRaSignature(response.data.signature);
//             console.log('RA Signature fetched:', response.data.signature);
//         }
//     } catch (error) {
//         console.error('Error fetching RA signature:', error);
//     }
// }, [apiUrl, analyst?.id]);

// // Jab analyst load ho jaye tab signature fetch karo
// useEffect(() => {
//     if (analyst?.id) {
//         fetchRaSignature();
//     }
// }, [analyst?.id, fetchRaSignature]);












    useEffect(() => {
        if (!id) return;

        setLoading(true);

        axios
            .get(`${apiUrl}/plans/details/${id}`)
            .then(res => {
                setPlan(res.data.data.plan);
                console.log(res.data.data,'plan ki detail')
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
                    console.log(res.data.data,'kisne kitne plan liye')
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




// SubscriptionDetails.jsx mein yeh function update karo
const fetchTermsAndShowPopup = async () => {
    if (!plan || !analyst || !parsedUser) return;

    setTermsLoading(true);
    try {
        // Calculate dates
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

        // Terms data without signature initially
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
            signature: '' // Initially empty
        };

        console.log('Fetching terms without signature...');
        
        // /generate endpoint call karo
        const response = await axios.post(`${apiUrl}/terms/generate`, termsData, {
            responseType: 'text',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Terms fetched, length:', response.data.length);
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
            const id = user_id;
            const res = await axios.get(`${apiUrl}/users/verify/${id}`);

            // ✅ More robust check
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
        
        // Convert signature file to base64 if needed
        const signatureBase64 = signatureFile ? await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(signatureFile);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        }) : '';

        // Calculate dates
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

        // Save signed agreement - YE FINAL SUBMISSION HAI
        const response = await axios.post(`${apiUrl}/terms/save-signed`, {
            termsData,
            userEmail: parsedUser?.email,
            userName: parsedUser?.name,
            signatureBase64
        });

        if (response.data.success) {
            toast.success('Agreement signed and sent to your email');
            
            // Navigate to subscription page
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

// SubscriptionDetails.jsx mein compressImage function add karo
const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 300; // Signature ke liye enough width
                const MAX_HEIGHT = 100; // Signature ke liye enough height
                
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
                
                // Compress quality bhi kam karo (0.7 = 70% quality)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
            };
            img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
    });
};

// const handleSignatureComplete = async (file) => {
//     try {
//         console.log('1. Signature file received:', file.name, file.size);
//         setSignatureFile(file);
        
//         // Convert and compress signature file to base64
//         const signatureBase64 = await compressImage(file);
        
//         console.log('2. Signature compressed:', {
//             originalSize: file.size,
//             compressedLength: signatureBase64.length
//         });

//         // Calculate dates
//         const today = new Date();
//         const endDate = new Date(today);
//         const durationDays = parseInt(plan.duration) || 30;
//         endDate.setDate(endDate.getDate() + durationDays);

//         const formatDate = (date) => {
//             return date.toLocaleDateString('en-IN', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             });
//         };

//         // Prepare complete terms data with signature
//         const termsData = {
//             RA_FullName: analyst?.name || 'Research Analyst',
//             RA_Address: analyst?.address || 'N/A',
//             UserName: parsedUser?.name || 'User',
//             UserPAN: parsedUser?.pan || 'N/A',
//             RA_SEBI_Registration_Number: analyst?.sebi_number || 'N/A',
//             Registration_Date: analyst?.registration_date || formatDate(today),
//             Execution_Date: formatDate(today),
//             StartDate: formatDate(today),
//             EndDate: formatDate(endDate),
//             EffectiveDate: formatDate(today),
//             jurisdiction_place: 'Mumbai',
//             ra_complaint_email: analyst?.complaint_email || 'complaints@signalz.in',
//             ra_compliance_email: analyst?.compliance_email || 'compliance@signalz.in',
//             service_name: plan.plan_name || 'Research Service',
//             subscription_description: plan.short_description || 'No description available',
//             combination_details: plan.combination_details || '',
//             ask_mentor: plan.ask_mentor || '',
//             signature: signatureBase64
//         };

//         console.log('3. Total data size:', JSON.stringify(termsData).length);

//         setTermsLoading(true);

//         // /generate endpoint call
//         const response = await axios.post(`${apiUrl}/terms/generate`, termsData, {
//             responseType: 'text',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             maxContentLength: Infinity, // Increase max content length
//             maxBodyLength: Infinity     // Increase max body length
//         });

//         console.log('4. Response received from /generate');
//         setTermsHtml(response.data);
        
//         toast.success('Signature uploaded successfully!');

//     } catch (error) {
//         console.error('Error adding signature:', error);
//         if (error.response?.status === 413) {
//             toast.error('Signature file too large. Please upload a smaller image.');
//         } else {
//             toast.error('Failed to add signature. Please try again.');
//         }
//     } finally {
//         setTermsLoading(false);
//     }
// };

const handleSignatureComplete = async (file) => {
    try {
        console.log('1. Signature file received:', file.name, file.size);
        setSignatureFile(file);
        
        // Convert and compress signature file to base64
        const signatureBase64 = await compressImage(file);
        
        console.log('2. Signature compressed:', {
            originalSize: file.size,
            compressedLength: signatureBase64.length
        });

        // Calculate dates
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

        // ✅ IMPORTANT: Current RA signature ko state se le rahe hain
        console.log('3. Current RA signature from state:', {
            exists: !!raSignature,
            length: raSignature ? raSignature.length : 0
        });


             const currentRaSignature = raSignatureRef.current || raSignature || analyst?.signature;
            
        // Prepare complete terms data with BOTH signatures
        const termsData = {
            RA_FullName: analyst?.name || 'Research Analyst',
            RA_Address: analyst?.address || 'N/A',
            RA_Signature: currentRaSignature, // ✅ RA signature - yeh preserve rahega
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
            signature: signatureBase64 // User signature
        };

        console.log('4. Total data size:', JSON.stringify(termsData).length);
        console.log('5. Both signatures present in request:', {
            raSignature: !!termsData.RA_Signature,
            userSignature: !!termsData.signature
        });

        setTermsLoading(true);

        // /generate endpoint call with both signatures
        const response = await axios.post(`${apiUrl}/terms/generate`, termsData, {
            responseType: 'text',
            headers: {
                'Content-Type': 'application/json'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        console.log('6. Response received from /generate');
        console.log('7. Response length:', response.data.length);
        console.log('8. HTML contains RA signature?', response.data.includes('RA Signature') || response.data.includes('signature-image'));
        
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading plan details...</p>
            </div>
        </div>
    );

    if (!plan) {
        return (
            <div className="text-center mt-10">
                <p className="text-red-500">No plan data available.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const infoList = [
        ["Total Signal", plan.total_signal],
        ["Total Active Calls", plan.active_calls],
        ["Total Exited Calls", plan.exited_calls],
        ["Avg Signal Life", plan.avg_signal_life],
    ];

    const detailList = [
        ["Specialization", analyst?.specialization],
        ["Segment", plan.segment],
        ["Avg Trades", plan.avg_trades],
        ["Ideal Capital", `₹ ${plan.ideal_capital}`],
        ["Category", plan.category],
        ["Stoploss %", `${plan.stop_loss} %`],
        ["Duration", plan.duration],
        ["Plan Price", `₹ ${plan.plan_price}`],
        ["Discount %", `${plan.discount} %`],
    ];

    return (
        <>
            <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* LEFT SIDE – IMAGE CARD */}
                    <div className="bg-white rounded-2xl overflow-hidden md:col-span-1 flex flex-col h-full">
                        <div className="w-full h-[450px] flex-shrink-0">
                            <img
                                src={
                                    plan.uploded_image
                                        ? plan.uploded_image
                                        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt="Profile"
                                className="w-full h-full object-fill"
                            />
                        </div>

                        <div
                            className="p-5 -mt-6 rounded-t-2xl relative z-10 flex-grow flex flex-col"
                            style={{
                                background: "linear-gradient(to bottom, #CED3FF 10%, #FFFFFF 100%)",
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-grow">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {plan.plan_name || "N/A"}
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        {plan.experience || "0"} years of experience
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm flex-grow">
                                {infoList.map(([label, value], index) => (
                                    <div
                                        key={index}
                                        className="flex bg-white px-4 py-2 rounded-full"
                                    >
                                        <p className="text-gray-500 w-40 truncate">{label}</p>
                                        <p className="font-medium text-gray-800 flex-1 text-right truncate">
                                            {value || "NA"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE – ALL DETAILS */}
                    <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                        {/* PLAN DETAILS */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-300">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-2xl font-semibold">Plan Details</h3>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={termsLoading}
                                    className={`text-white text-sm px-6 py-2 rounded transition ${termsLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-black hover:bg-gray-800'
                                        }`}
                                >
                                    {termsLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Loading...
                                        </span>
                                    ) : 'Buy Now'}
                                </button>
                            </div>

                            <hr className="-mx-6 mb-4 text-gray-300" />

                            <div className="grid sm:grid-cols-2 gap-4">
                                {detailList.map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-gray-500 text-sm">{label}</p>
                                        <p className="font-medium">{value ?? "N/A"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ABOUT US */}
                        <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
                            <h1 className="text-lg font-semibold mb-4">About Description</h1>
                            <hr className="border-t border-gray-300 -mx-6 mb-4" />
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {plan.short_description || "No information available"}
                            </p>
                        </div>

                        {/* MENTOR */}
                        <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
                            <h1 className="text-lg font-semibold mb-4">Mentor</h1>
                            <hr className="border-t border-gray-300 -mx-6 mb-4" />

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={analyst?.profile_image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                        alt={analyst?.name || "Analyst Profile"}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold">{analyst?.name}</p>
                                        <p className="text-gray-600 text-sm">{analyst?.sebi_number}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/analyst/${analyst?.id}`)}
                                    className="border border-gray-300 p-2 rounded-full hover:bg-gray-100 transition"
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Popup */}
           <TermsPopup
    isOpen={showTermsPopup}
    onClose={() => setShowTermsPopup(false)}
    onAgree={handleAgreeToTerms}
    onSignatureComplete={handleSignatureComplete}
    termsHtml={termsHtml}
/>
        </>
    );
}

// -------------------------------------------------------------------------------------------------new component h -----------------------------------------

