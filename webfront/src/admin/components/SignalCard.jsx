import { useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

const SignalCard = ({ signal, index }) => {
    const navigate = useNavigate();

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get gradient based on segment and trade direction
    const getGradient = (segment, tradeDirection) => {
        if (tradeDirection === "SELL") {
            return "from-red-50 to-red-100";
        }
        switch (segment?.toLowerCase()) {
            case "equity":
                return "from-blue-50 to-blue-100";
            case "commodity":
                return "from-yellow-50 to-yellow-100";
            case "currency":
                return "from-green-50 to-green-100";
            case "future":
                return "from-purple-50 to-purple-100";
            case "option":
                return "from-pink-50 to-pink-100";
            default:
                return "from-gray-50 to-gray-100";
        }
    };

    return (
        <div
            className="relative w-full max-w-[380px] sm:max-w-[350px] md:max-w-[370px] rounded-2xl transition-all duration-300 hover:shadow-lg"
        >
            <div
                className={`relative z-10 p-5 sm:p-6 text-gray-800 rounded-2xl bg-gradient-to-r ${getGradient(
                    signal.segment,
                    signal.trade_direction
                )} shadow-sm`}
            >
                {/* Date and Time */}
                <div className="flex justify-between text-gray-700 text-xs sm:text-sm mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />{" "}
                        {formatDate(signal.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />{" "}
                        {formatTime(signal.created_at)}
                    </div>
                </div>

                {/* Profile and Status */}
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={signal.profile_image || "https://i.pravatar.cc/40"}
                        alt="profile"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300"
                    />
                    <div className="text-left">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {signal.instrument} {signal.instrument_type || ""}
                        </h4>
                        <p className="text-gray-700 text-xs sm:text-sm">
                            Status -{" "}
                            <span
                                className={`font-medium ${
                                    signal.status === "active"
                                        ? "text-green-600"
                                        : "text-gray-600"
                                }`}
                            >
                                {signal.status || "Active"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Signal Details Grid */}
                <div className="grid grid-cols-2 text-left text-gray-900 text-xs sm:text-sm gap-y-2 mb-5">
                    <p>
                        <span className="font-semibold">Entry:</span> ₹
                        {signal.entry_price}
                    </p>
                    <p>
                        <span className="font-semibold">SL:</span> ₹
                        {signal.stop_loss}
                    </p>
                    <p>
                        <span className="font-semibold">Target 1:</span> ₹
                        {signal.target_first}
                    </p>
                    <p>
                        <span className="font-semibold">Target 2:</span> ₹
                        {signal.target_second}
                    </p>
                    <p>
                        <span className="font-semibold">Target 3:</span> ₹
                        {signal.target_third}
                    </p>
                    <p>
                        <span className="font-semibold">Risk/Reward:</span>{" "}
                        {signal.risk_reward_ratio}
                    </p>
                    <p className="col-span-2">
                        <span className="font-semibold">Trade:</span>{" "}
                        <span
                            className={`font-medium ${
                                signal.trade_direction === "BUY"
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {signal.trade_direction || "BUY"}
                        </span>
                    </p>
                </div>

                {/* Action Button */}
                <div className="items-center gap-3">
                    <button
                        onClick={() =>
                            navigate(`/signal-details/${signal.id || index}`)
                        }
                        className="border w-full py-2 rounded-md text-sm hover:bg-black hover:text-white transition-colors duration-300"
                    >
                        View Details
                    </button>
                </div>
            </div>

            {/* Bottom Segment Tag */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-0">
                <div className="py-3 sm:py-4 text-center text-white font-medium text-xs sm:text-sm bg-black rounded-b-2xl mt-8">
                    {signal.segment || "Segment"}
                </div>
            </div>
        </div>
    );
};

export default SignalCard;