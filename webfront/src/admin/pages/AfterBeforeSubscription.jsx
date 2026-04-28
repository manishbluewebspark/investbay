// import React, { useCallback, useEffect, useState } from "react";
// import { FaCircle } from "react-icons/fa";
// import VerifyDetailsModal from "../components/modals/VerifyDetailsModal";
// import TermsConditionsModal from "../components/modals/TermsConditionsModal";
// import EsignOtpModal from "../components/modals/EsignOtpModal";
// import UploadSignatureModal from "../components/modals/UploadSignatureModal";
// import DocumentSignedModal from "../components/modals/DocumentSignedModal";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// export default function AfterBeforeSubscription() {
//     const [open, setOpen] = useState(false)
//     const [terms, setTerms] = useState(false)
//     const [otp, setOtp] = useState(false)
//     const [uploadSignature, setUploadSignature] = useState(false)
//     const [signed, setSigned] = useState(false)
//     const { id } = useParams();
//     const [signal, setSignal] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
      
//       const apiUrl = import.meta.env.VITE_API_URL;

//       const navigate = useNavigate();
    
//       console.log(signal,'signals..')

//       const fetchSignals = useCallback(async () => {
//         try {
//           setLoading(true);
//           setError("");
          
//           const res = await axios.get(`${apiUrl}/signals/get-signals-by-id/${id}`);
          
//           if (res.data?.success) {
//             setSignal(res.data.data || {});
//           } else {
//             setError("Failed to fetch signals");
//           }
//         } catch (err) {
//           console.error("Error fetching signals:", err);
//           setError("Server error");
//         } finally {
//           setLoading(false);
//         }
//       }, [apiUrl]);
    
//       useEffect(() => {
//         fetchSignals();
//       }, [fetchSignals]);



//     return ( 
//         <div className="min-h-screen bg-gray-50 p-6 lg:px-40">
//             <div className="max-w-full bg-white rounded-xl shadow-sm border border-gray-300 p-6">

//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-3">
//                         <FaCircle className="text-green-500 text-md" />
//                         <h2 className="text-md font-semibold text-gray-800">
//                             HINDUNILVR30DEC252400CE
//                         </h2>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                     {/* Price Levels */}
//                     <div className="border border-gray-300 rounded-lg p-4">
//                         <h3 className="text-md font-semibold text-gray-700 mb-4">
//                             Price Levels
//                         </h3>

//                         <div className="space-y-3">
//                             <Level label="Stop Loss" value="60" />
//                             <Level label="Entry" value="100" active />
//                             <Level label="Target 1" value="150" />
//                             <Level label="Target 2" value="200" />
//                         </div>
//                     </div>

//                     {/* Plan Details */}
//                     <div className="lg:col-span-2 border border-gray-300 rounded-lg p-4 relative">
//                         <span className="absolute top-4 right-4 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                             ● Active
//                         </span>

//                         <h3 className="text-md font-semibold text-gray-700 mb-4">
//                             Plan Details
//                         </h3>

//                         <div className="grid grid-cols-2 gap-y-4 text-md">
//                             <Detail label="Segment" value="F&O" />
//                             <Detail label="Instrument" value="OPTSTK" />
//                             <Detail label="Script" value="HINDUNILVR" />
//                             <Detail label="Expiry" value="30DEC2025" />
//                             <Detail label="Strike Price" value="2400" />
//                             <Detail label="Instrument Type" value="CE" />
//                             <Detail label="Duration" value="Intraday" />
//                             <Detail label="Trade Direction" value="Buy" />
//                             <Detail label="Date" value="12-Apr-2025" />
//                             <Detail label="Time" value="10:00 AM" />
//                             <Detail label="Current Status" value="NA" />
//                             <Detail label="Subscription Plan" value="Options Intraday Pro" />
//                             <Detail label="Risk" value="1:1" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Mentor */}
//                 <div className="border border-gray-300 rounded-lg p-4 mt-6 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <img
//                             src="https://i.pravatar.cc/40"
//                             alt="mentor"
//                             className="w-10 h-10 rounded-full"
//                         />
//                         <div>
//                             <p className="text-md font-semibold text-gray-800">
//                                 Amit Dwivedi
//                             </p>
//                             <p className="text-xs text-gray-500">Status - NA</p>
//                         </div>
//                     </div>

//                     <button
//                         // onClick={() => setOpen(true)}
//                         // onClick={() => setTerms(true)}
//                         // onClick={() => setOtp(true)}
//                         // onClick={() => setUploadSignature(true)}
//                         onClick={() => setSigned(true)}
//                         className="border border-gray-300 px-4 py-1.5 rounded-full text-md text-gray-700 hover:bg-gray-100">
//                         View Plan
//                     </button>
//                 </div>
//             </div>

//             <VerifyDetailsModal open={open} onClose={() => setOpen(false)} />

//             <TermsConditionsModal open={terms} onClose={() => setTerms(false)} />

//                 <EsignOtpModal open={otp} onClose={() => setOtp(false)} />

//                     <UploadSignatureModal open={uploadSignature} onClose={() => setUploadSignature(false)}/>

//                         <DocumentSignedModal open={signed} onClose={() => setSigned(false)}/>
//         </div>
//     );
// }

// /* --------- Small Components ---------- */

// const Level = ({ label, value, active }) => (
//     <div
//         className={`flex items-center justify-between px-4 py-2 rounded-md border ${active
//                 ? "bg-green-500 text-white border-green-500"
//                 : "bg-gray-50 text-gray-700"
//             }`}
//     >
//         <span className="text-md">{label}</span>
//         <span className="text-md font-semibold">{value}</span>
//     </div>
// );

// const Detail = ({ label, value }) => (
//     <div>
//         <p className="text-xs text-gray-500">{label}</p>
//         <p className="font-medium text-gray-800">{value}</p>
//     </div>
// );


import React, { useCallback, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import VerifyDetailsModal from "../components/modals/VerifyDetailsModal";
import TermsConditionsModal from "../components/modals/TermsConditionsModal";
import EsignOtpModal from "../components/modals/EsignOtpModal";
import UploadSignatureModal from "../components/modals/UploadSignatureModal";
import DocumentSignedModal from "../components/modals/DocumentSignedModal";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AfterBeforeSubscription() {
    const [open, setOpen] = useState(false);
    const [terms, setTerms] = useState(false);
    const [otp, setOtp] = useState(false);
    const [uploadSignature, setUploadSignature] = useState(false);
    const [signed, setSigned] = useState(false);
    const { id } = useParams();
    const [signal, setSignal] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const fetchSignals = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            
            const res = await axios.get(`${apiUrl}/signals/get-signals-by-id/${id}`);
            
            if (res.data?.success) {
                setSignal(res.data.data || {});
            } else {
                setError("Failed to fetch signals");
            }
        } catch (err) {
            console.error("Error fetching signals:", err);
            setError("Server error");
        } finally {
            setLoading(false);
        }
    }, [apiUrl, id]);

    useEffect(() => {
        fetchSignals();
    }, [fetchSignals]);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format time function
    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper to get script name (you might need to parse this based on your data structure)
    const getScriptName = () => {
        // If you have a script field, use it, otherwise derive from other fields
        return signal.script || "N/A";
    };

    // Generate display title (you can customize this based on your needs)
    const getDisplayTitle = () => {
        const parts = [];
        if (signal.instrument) parts.push(signal.instrument);
        if (signal.instrument_type) parts.push(signal.instrument_type);
        if (signal.exchange) parts.push(signal.exchange);
        return parts.join(' - ') || "Signal Details";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 lg:px-40 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 lg:px-40 flex items-center justify-center">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return ( 
        <div className="min-h-screen max-w-7xl mx-auto px-6 py-10">
            <div className="max-w-full bg-white rounded-xl shadow-sm border border-gray-300 p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FaCircle className={`text-md ${signal.status === 'active' ? 'text-green-500' : 'text-gray-400'}`} />
                        <h2 className="text-md font-semibold text-gray-800">
                            {getDisplayTitle()}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Price Levels */}
                    <div className="border border-gray-300 rounded-lg p-4">
                        <h3 className="text-md font-semibold text-gray-700 mb-4">
                            Price Levels
                        </h3>

                        <div className="space-y-3">
                            <Level 
                                label="Stop Loss" 
                                value={signal.stop_loss || "N/A"} 
                            />
                            <Level 
                                label="Entry" 
                                value={signal.entry_price || "N/A"} 
                                active 
                            />
                            <Level 
                                label="Target 1" 
                                value={signal.target_first || "N/A"} 
                            />
                            <Level 
                                label="Target 2" 
                                value={signal.target_second || "N/A"} 
                            />
                            {signal.target_third && (
                                <Level 
                                    label="Target 3" 
                                    value={signal.target_third} 
                                />
                            )}
                        </div>
                    </div>

                    {/* Plan Details */}
                    <div className="lg:col-span-2 border border-gray-300 rounded-lg p-4 relative">
                        <span className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full ${
                            signal.status === 'active' 
                                ? 'text-green-600 bg-green-50' 
                                : 'text-gray-600 bg-gray-50'
                        }`}>
                            ● {signal.status ? signal.status.charAt(0).toUpperCase() + signal.status.slice(1) : 'Inactive'}
                        </span>

                        <h3 className="text-md font-semibold text-gray-700 mb-4">
                            Plan Details
                        </h3>

                        <div className="grid grid-cols-2 gap-y-4 text-md">
                            <Detail label="Segment" value={signal.segment || signal.category || "N/A"} />
                            <Detail label="Instrument" value={signal.instrument || "N/A"} />
                            <Detail label="Script" value={signal.script || "N/A"} />
                            <Detail label="Exchange" value={signal.exchange || "N/A"} />
                            <Detail label="Strike Price" value={signal.strike_price || "N/A"} />
                            <Detail label="Instrument Type" value={signal.instrument_type || "N/A"} />
                            <Detail label="Duration" value={signal.duration || "N/A"} />
                            <Detail label="Trade Direction" value={signal.trade_direction || "N/A"} />
                            <Detail label="Date" value={formatDate(signal.created_at)} />
                            <Detail label="Time" value={formatTime(signal.created_at)} />
                            <Detail label="Current Status" value={signal.status || "N/A"} />
                            <Detail label="Subscription Plan" value={signal.subscription_plan || signal.plan_name || "N/A"} />
                            <Detail label="Risk" value={signal.risk || signal.risk_reward_ratio || "N/A"} />
                            <Detail label="Plan Price" value={signal.plan_price ? `₹${signal.plan_price}` : "N/A"} />
                            <Detail label="Ideal Capital" value={signal.ideal_capital ? `₹${signal.ideal_capital}` : "N/A"} />
                        </div>
                    </div>
                </div>

                {/* Mentor/RA Details */}
                {signal.name && (
                    <div className="border border-gray-300 rounded-lg p-4 mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={signal.profile_image || "https://i.pravatar.cc/40"}
                                alt={signal.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://i.pravatar.cc/40";
                                }}
                            />
                            <div>
                                <p className="text-md font-semibold text-gray-800">
                                    {signal.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {signal.role} - {signal.specialization || "N/A"}
                                </p>
                                {signal.sebi_number && (
                                    <p className="text-xs text-gray-500">
                                        SEBI: {signal.sebi_number}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            // onClick={() => setSigned(true)}
                            onClick={()=>{

                                navigate(`/plans/${signal.id}`)

                            }}
                            className="border border-gray-300 px-4 py-1.5 rounded-full text-md text-gray-700 hover:bg-gray-100"
                        >
                            View Plan
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <VerifyDetailsModal open={open} onClose={() => setOpen(false)} />
            <TermsConditionsModal open={terms} onClose={() => setTerms(false)} />
            <EsignOtpModal open={otp} onClose={() => setOtp(false)} />
            <UploadSignatureModal open={uploadSignature} onClose={() => setUploadSignature(false)}/>
            <DocumentSignedModal open={signed} onClose={() => setSigned(false)}/>
        </div>
    );
}

/* --------- Small Components ---------- */
const Level = ({ label, value, active }) => (
    <div
        className={`flex items-center justify-between px-4 py-2 rounded-md border ${
            active
                ? "bg-green-500 text-white border-green-500"
                : "bg-gray-50 text-gray-700 border-gray-200"
        }`}
    >
        <span className="text-md">{label}</span>
        <span className="text-md font-semibold">{value}</span>
    </div>
);

const Detail = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value || "N/A"}</p>
    </div>
);