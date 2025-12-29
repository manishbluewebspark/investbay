import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PlanDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const plan = location.state?.plan;
    const [isActive, setIsActive] = useState(false);


    useEffect(() => {
        if (plan?.status) {
            setIsActive(plan.status === "active");
        }
    }, [plan]);

    const handleToggle = async () => {
        try {
            const newStatus = isActive ? "inactive" : "active";

            await axios.put(`${apiUrl}/plans/status`, {
                planId: plan.id,
                userId: plan.userId,
                status: newStatus,
            });

            setIsActive(!isActive);
        } catch (error) {
            console.error("Status update failed", error);
        }
    };

    if (!plan)
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-full mx-auto">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden md:col-span-1">
                    <img
                        src={
                            plan.profileImage
                                ? `${apiUrl}/uploads/${plan.profileImage}`
                                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="Profile"
                        className="w-full h-56 object-cover"
                    />

                    <div
                        className="p-5 rounded-2xl"
                        style={{
                            background: "linear-gradient(to bottom, #D5DAFF 10%, #FFFFFF 100%)",
                        }}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {plan.planName || "N/A"}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {plan.segment}
                                    </p>
                                </div>

                                {/* 🔹 Fixed Toggle Button */}
                                <div className="flex flex-col items-center ml-4">
                                    <span className={`text-xs font-medium mb-1 ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <button
                                        onClick={handleToggle}
                                        className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300
                                            ${isActive ? "bg-green-500" : "bg-gray-300"}
                                        `}
                                    >
                                        <div
                                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300
                                                ${isActive ? "translate-x-7" : "translate-x-0"}
                                            `}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">Total Signal</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {plan.email || "N/A"}
                                </p>
                            </div>

                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">Total Active Calls</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {plan.gender || "N/A"}
                                </p>
                            </div>

                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">Total Exited Calls</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {plan.dob || "N/A"}
                                </p>
                            </div>

                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">Avg.Signal Life</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {plan.city || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-gray-800 font-semibold mb-4 text-2xl">
                            Plan Details
                        </h3>
                        <hr className="border-t border-gray-300 -mx-6 mb-3" />

                        <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                            <Detail label="Segment" value={plan.segment} />
                            <Detail label="Category" value={plan.category} />
                            <Detail label="Risk" value={plan.risk} />
                            <Detail label="Ideal Capital" value={`₹ ${plan.idealCapital}`} />
                            <Detail label="Duration" value={plan.duration} />
                            <Detail label="Plan Price" value={`₹ ${plan.planPrice}`} />
                            <Detail label="Discount %" value={`${plan.discount} %`} />
                            <Detail label="Stoploss %" value={plan.stoploss} />
                            <Detail label="Avg Trades" value={plan.avgTrades} />
                        </div>

                        <div className="border-t border-gray-300 mt-5 pt-5">
                            <Detail label="Description" value={plan.description} />
                            <Detail label="Refund Policy" value={plan.refundPolicy} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="font-medium text-gray-800 text-md">
                {value || "N/A"}
            </p>
        </div>
    );
}