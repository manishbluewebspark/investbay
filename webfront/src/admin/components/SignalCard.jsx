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
            return "from-red-50 to-red-100 border-red-200";
        }
        switch (segment?.toLowerCase()) {
            case "equity":
                return "from-blue-50 to-blue-100 border-blue-200";
            case "commodity":
                return "from-yellow-50 to-yellow-100 border-yellow-200";
            case "currency":
                return "from-green-50 to-green-100 border-green-200";
            case "future":
                return "from-purple-50 to-purple-100 border-purple-200";
            case "option":
                return "from-pink-50 to-pink-100 border-pink-200";
            default:
                return "from-gray-50 to-gray-100 border-gray-200";
        }
    };

    return (
        <div className="relative w-full rounded-2xl transition-all duration-300 hover:shadow-lg">
            <div
                className={`relative z-10 p-5 text-gray-800 rounded-2xl bg-gradient-to-r ${getGradient(
                    signal.segment,
                    signal.trade_direction
                )} border shadow-sm`}
            >
                {/* Date and Time */}
                <div className="flex justify-between text-gray-500 text-xs mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />{" "}
                        {formatDate(signal.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />{" "}
                        {formatTime(signal.created_at)}
                    </div>
                </div>

                {/* Profile and Status */}
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={signal.profile_image || "https://i.pravatar.cc/40"}
                        alt="profile"
                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="text-left">
                        <h4 className="font-['Aileron_Black'] font-semibold text-gray-900 text-sm">
                            {signal.instrument} {signal.instrument_type || ""}
                        </h4>
                        <p className="text-gray-600 text-xs">
                            Status -{" "}
                            <span
                                className={`font-medium ${
                                    signal.status === "active"
                                        ? "text-green-600"
                                        : "text-gray-500"
                                }`}
                            >
                                {signal.status || "Active"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Signal Details Grid */}
                <div className="grid grid-cols-2 text-left text-gray-700 text-xs gap-y-2 mb-5">
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
                    {signal.target_third && (
                        <p>
                            <span className="font-semibold">Target 3:</span> ₹
                            {signal.target_third}
                        </p>
                    )}
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
                        className="border border-gray-300 w-full py-2 rounded-xl text-sm font-['Aileron_Black'] font-semibold text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
                    >
                        View Details
                    </button>
                </div>
            </div>

            {/* Bottom Segment Tag */}
            <div className="absolute -bottom-3 left-4 right-4">
                <div className="py-2 text-center text-white font-medium text-xs rounded-b-xl bg-gray-900">
                    {signal.segment || "Segment"}
                </div>
            </div>
        </div>
    );
};

export default SignalCard;