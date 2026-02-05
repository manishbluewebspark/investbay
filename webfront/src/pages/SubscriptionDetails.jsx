// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function PlanDetails() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const apiUrl = import.meta.env.VITE_API_URL;

//     const [plan, setPlan] = useState(null);
//     const [analyst, setAnalyst] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!id) return;

//         setLoading(true);

//         axios
//             .get(`${apiUrl}/plans/details/${id}`)
//             .then(res => {
//                 setPlan(res.data.data.plan);
//                 setAnalyst(res.data.data.analyst);
//             })
//             .catch(() => console.error("Failed to load plan details"))
//             .finally(() => setLoading(false));
//     }, [id]);

//     if (loading) return <p className="text-center mt-10">Loading...</p>;

//     if (!plan) {
//         return (
//             <div className="text-center mt-10">
//                 <p className="text-red-500">No plan data available.</p>
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
//                 >
//                     Go Back
//                 </button>
//             </div>
//         );
//     }

//     const infoList = [
//         ["Total Signal", plan.totalSignal],
//         ["Total Active Calls", plan.activeCalls],
//         ["Total Exited Calls", plan.exitedCalls],
//         ["Avg Signal Life", plan.avgSignalLife],
//     ];

//     const detailList = [
//         ["Specialization", analyst.specialization],
//         ["Segment", plan.segment],
//         ["Avg Trades", plan.avgTrades],
//         ["Ideal Capital", `₹ ${plan.idealCapital}`],
//         ["Category", plan.category],
//         ["Stoploss %", `${plan.stopLoss} %`],
//         ["Duration", plan.duration],
//         ["Plan Price", `₹ ${plan.planPrice}`],
//         ["Discount %", `${plan.discount} %`],
//     ];

//     return (
//         <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

//                 {/* LEFT SIDE – IMAGE CARD */}
//                     <div className="bg-white rounded-2xl overflow-hidden md:col-span-1 flex flex-col h-full">
//                         <div className="w-full h-[450px] flex-shrink-0">
//                             <img
//                                 src={
//                                     plan.uplodedImage
//                                         ? plan.uplodedImage
//                                         : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                                 }
//                                 alt="Profile"
//                                 className="w-full h-full object-fill"
//                             />
//                         </div>

//                         <div
//                             className="p-5 -mt-6 rounded-t-2xl relative z-10 flex-grow flex flex-col"
//                             style={{
//                                 background: "linear-gradient(to bottom, #CED3FF 10%, #FFFFFF 100%)",
//                             }}
//                         >
//                             <div className="flex justify-between items-start mb-4">
//                                 <div className="flex-grow">
//                                     <h2 className="text-lg font-semibold text-gray-900">
//                                         {plan.name || "N/A"}
//                                     </h2>
//                                     <p className="text-gray-600 text-sm">
//                                         {plan.experience || "0"} years of experience
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="space-y-3 text-sm flex-grow">
//                                 {infoList.map(([label, value], index) => (
//                                     <div
//                                         key={index}
//                                         className="flex bg-white px-4 py-2 rounded-full"
//                                     >
//                                         <p className="text-gray-500 w-40 truncate">{label}</p>
//                                         <p className="font-medium text-gray-800 flex-1 text-right truncate">
//                                             {value || "NA"}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                 {/* RIGHT SIDE – ALL DETAILS */}
//                 <div className="lg:col-span-2 flex flex-col gap-6 h-full">

//                     {/* PLAN DETAILS */}
//                     <div className="bg-white rounded-2xl p-6 border border-gray-300">
//                         <h3 className="text-2xl font-semibold mb-4">Plan Details</h3>
//                         <hr className="-mx-6 mb-4 text-gray-300" />

//                         <div className="grid sm:grid-cols-2 gap-4">
//                             {detailList.map(([label, value]) => (
//                                 <div key={label}>
//                                     <p className="text-gray-500 text-sm">{label}</p>
//                                     <p className="font-medium">{value ?? "N/A"}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ABOUT US */}
//                     <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
//                         <h1 className="text-lg font-semibold mb-4">About Description</h1>
//                         <hr className="border-t border-gray-300 -mx-6 mb-4" />
//                         <p className="text-sm text-gray-700 leading-relaxed">
//                             {plan.about_us || "No information available"}
//                         </p>
//                     </div>

//                     {/* DESCRIPTION */}
//                     <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
//                         <h1 className="text-lg font-semibold mb-4">Mentor</h1>
//                         <hr className="border-t border-gray-300 -mx-6 mb-4" />

//                         <div className="flex justify-between items-center">
//                             <div className="flex items-center gap-3">
//                                 <img
//                                     src={analyst.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//                                     alt={analyst.name || "Analyst Profile"}
//                                     className="w-20 h-20 rounded-full object-fil"
//                                 />
//                                 <div>
//                                     <p className="font-semibold">{analyst.name}</p>
//                                     <p className="text-gray-600 text-sm">{analyst.sebiNumber}</p>
//                                 </div>
//                             </div>
//                             <button className="border border-gray-300 p-2 rounded-full hover:bg-gray-100 transition">
//                                 View Profile
//                             </button>
//                         </div>

//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// }



// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function PlanDetails() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const apiUrl = import.meta.env.VITE_API_URL;

//     const [plan, setPlan] = useState(null);
//     const [analyst, setAnalyst] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!id) return;

//         setLoading(true);

//         axios
//             .get(`${apiUrl}/plans/details/${id}`)
//             .then(res => {
//                 setPlan(res.data.data.plan);
//                 setAnalyst(res.data.data.analyst);
//             })
//             .catch(() => console.error("Failed to load plan details"))
//             .finally(() => setLoading(false));
//     }, [id]);

//     if (loading) return <p className="text-center mt-10">Loading...</p>;

//     if (!plan) {
//         return (
//             <div className="text-center mt-10">
//                 <p className="text-red-500">No plan data available.</p>
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
//                 >
//                     Go Back
//                 </button>
//             </div>
//         );
//     }

//     const infoList = [
//         ["Total Signal", plan.total_signal],
//         ["Total Active Calls", plan.active_calls],
//         ["Total Exited Calls", plan.exited_calls],
//         ["Avg Signal Life", plan.avg_signal_life],
//     ];

//     const detailList = [
//         ["Specialization", analyst?.specialization],
//         ["Segment", plan.segment],
//         ["Avg Trades", plan.avg_trades],
//         ["Ideal Capital", `₹ ${plan.ideal_capital}`],
//         ["Category", plan.category],
//         ["Stoploss %", `${plan.stop_loss} %`],
//         ["Duration", plan.duration],
//         ["Plan Price", `₹ ${plan.plan_price}`],
//         ["Discount %", `${plan.discount} %`],
//     ];

//     return (
//         <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

//                 {/* LEFT SIDE – IMAGE CARD */}
//                     <div className="bg-white rounded-2xl overflow-hidden md:col-span-1 flex flex-col h-full">
//                         <div className="w-full h-[450px] flex-shrink-0">
//                             <img
//                                 src={
//                                     plan.uploded_image
//                                         ? plan.uploded_image
//                                         : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                                 }
//                                 alt="Profile"
//                                 className="w-full h-full object-fill"
//                             />
//                         </div>

//                         <div
//                             className="p-5 -mt-6 rounded-t-2xl relative z-10 flex-grow flex flex-col"
//                             style={{
//                                 background: "linear-gradient(to bottom, #CED3FF 10%, #FFFFFF 100%)",
//                             }}
//                         >
//                             <div className="flex justify-between items-start mb-4">
//                                 <div className="flex-grow">
//                                     <h2 className="text-lg font-semibold text-gray-900">
//                                         {plan.plan_name || "N/A"}
//                                     </h2>
//                                     <p className="text-gray-600 text-sm">
//                                         {plan.experience || "0"} years of experience
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="space-y-3 text-sm flex-grow">
//                                 {infoList.map(([label, value], index) => (
//                                     <div
//                                         key={index}
//                                         className="flex bg-white px-4 py-2 rounded-full"
//                                     >
//                                         <p className="text-gray-500 w-40 truncate">{label}</p>
//                                         <p className="font-medium text-gray-800 flex-1 text-right truncate">
//                                             {value || "NA"}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                 {/* RIGHT SIDE – ALL DETAILS */}
//                 <div className="lg:col-span-2 flex flex-col gap-6 h-full">

//                     {/* PLAN DETAILS */}
//                     <div className="bg-white rounded-2xl p-6 border border-gray-300">
//                         <h3 className="text-2xl font-semibold mb-4">Plan Details</h3>
//                         <hr className="-mx-6 mb-4 text-gray-300" />

//                         <div className="grid sm:grid-cols-2 gap-4">
//                             {detailList.map(([label, value]) => (
//                                 <div key={label}>
//                                     <p className="text-gray-500 text-sm">{label}</p>
//                                     <p className="font-medium">{value ?? "N/A"}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ABOUT US */}
//                     <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
//                         <h1 className="text-lg font-semibold mb-4">About Description</h1>
//                         <hr className="border-t border-gray-300 -mx-6 mb-4" />
//                         <p className="text-sm text-gray-700 leading-relaxed">
//                             {plan.short_description || "No information available"}
//                         </p>
//                     </div>

//                     {/* DESCRIPTION */}
//                     <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
//                         <h1 className="text-lg font-semibold mb-4">Mentor</h1>
//                         <hr className="border-t border-gray-300 -mx-6 mb-4" />

//                         <div className="flex justify-between items-center">
//                             <div className="flex items-center gap-3">
//                                 <img
//                                     src={analyst?.profile_image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//                                     alt={analyst?.name || "Analyst Profile"}
//                                     className="w-20 h-20 rounded-full object-cover"
//                                 />
//                                 <div>
//                                     <p className="font-semibold">{analyst?.name}</p>
//                                     <p className="text-gray-600 text-sm">{analyst?.sebi_number}</p>
//                                 </div>
//                             </div>
//                             <button className="border border-gray-300 p-2 rounded-full hover:bg-gray-100 transition">
//                                 View Profile
//                             </button>
//                         </div>

//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// }
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SubscriptionCard from "../admin/components/SubscriptionCard";
import SignalCard from "../admin/components/SignalCard";

export default function PlanDetails() {
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

    useEffect(() => {
        const fetchSignals = async () => {
            if (!analyst?.id) return;
            
            try {
                setSignalLoading(true);
                const res = await axios.get(`${apiUrl}/signals/signalsbyuser/${analyst.id}`);
                if (res.data.success) {
                    setSignals(res.data.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setSignalLoading(false);
            }
        };

        if (analyst?.id) {
            fetchSignals();
        }
    }, [apiUrl, analyst?.id]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;

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
                        <h3 className="text-2xl font-semibold mb-4">Plan Details</h3>
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

            {/* OTHER SUBSCRIPTIONS SECTION */}
            <div className="mt-10">
                <h1 className="text-2xl font-semibold mb-6">Other Subscriptions</h1>
                
                {subscriptionLoading ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">
                        Loading subscriptions...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {subscriptions.length === 0 ? (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                No other subscriptions found
                            </p>
                        ) : (
                            subscriptions
                                .filter(sub => sub.id !== parseInt(id)) // Exclude current plan
                                .map((subscription) => (
                                    <SubscriptionCard 
                                        key={subscription.id} 
                                        subscription={subscription} 
                                    />
                                ))
                        )}
                    </div>
                )}
            </div>

            {/* SIGNALS SECTION */}
            <div className="mt-10">
                <h1 className="text-2xl font-semibold mb-6">Recent Signals</h1>
                
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 place-items-center">
                    {!signalLoading && signals.length > 0 ? (
                        signals.map((signal, index) => (
                            <SignalCard 
                                key={signal.id || index} 
                                signal={signal} 
                                index={index} 
                            />
                        ))
                    ) : !signalLoading ? (
                        <div className="col-span-3 text-center py-10">
                            <p className="text-gray-600">No signals available</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                            >
                                Refresh
                            </button>
                        </div>
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            <p className="text-gray-500">Loading signals...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}