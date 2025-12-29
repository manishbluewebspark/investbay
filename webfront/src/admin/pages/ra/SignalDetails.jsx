import { useLocation, useNavigate } from "react-router-dom";
import { FaChartLine, FaTimes, FaBullseye, FaCheck, FaCircle } from "react-icons/fa";
import stockIcon from "../../../assets/card/stock.svg";

const SignalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const signal = location.state?.signal;

  // 🇮🇳 Convert to IST Date
  const formatISTDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 🇮🇳 Convert to IST Time
  const formatISTTime = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  return (
    <div className="flex gap-6 p-6">

      <div className="bg-white shadow-md rounded-lg p-6 w-64 md:w-96 ">
        <h2 className="text-gray-700 font-semibold mb-4 flex items-center gap-2 border-b pb-2 border-gray-300">
          <img src={stockIcon} alt="Signal" className="w-6 h-6" />
          <span>Price Levels</span>
        </h2>

        <div className="flex flex-col items-start gap-14">
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full">
              <FaTimes className="text-gray-400 text-lg" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-full">
                <span className="text-gray-500 text-sm">Stop Loss</span>
                <span className="font-semibold text-gray-700">{signal.stopLoss}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center justify-center p-2 bg-green-500 rounded-full">
              <FaBullseye className="text-white text-lg" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center bg-green-500 px-3 py-2 rounded-full text-white">
                <span className="text-sm">Entry</span>
                <span className="font-semibold">{signal.entryPrice}</span>
              </div>
            </div>
          </div>

          {/* Target 1 */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center justify-center p-2 bg-gray-500 rounded-full">
              <FaBullseye className="text-white text-lg" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-full">
                <span className="text-gray-500 text-sm">Target 1</span>
                <span className="font-semibold text-gray-700">{signal.targetFirst}</span>
              </div>
            </div>
          </div>

          {/* Target 2 */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center justify-center p-2 bg-gray-300 rounded-full">
              <FaBullseye className="text-white text-lg" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-full">
                <span className="text-gray-500 text-sm">Target 2</span>
                <span className="font-semibold text-gray-700">{signal.targetSecond}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-300">
          <h2 className="text-gray-700 font-semibold text-lg">Plan Details</h2>
                              <span className={`text-sm px-2 py-1 rounded-full ${
                      signal.status === "active"
                        ? "text-green-700 bg-green-50"
                        : "text-red-700 bg-red-50"
                    }`}>
                      {signal.status === "active" ? "Active" : "Inactive"}
                    </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-gray-600 text-sm mb-1">Date</div>
            <div className="font-semibold">{formatISTDate(signal.createdAt)}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Time</div>
            <div className="font-semibold">{formatISTTime(signal.createdAt)}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Entry</div>
            <div className="font-semibold text-lg">{signal.entryPrice}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Stop Loss</div>
            <div className="font-semibold text-lg">{signal.stopLoss}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Target 1</div>
            <div className="font-semibold text-lg">{signal.targetFirst}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Target 2</div>
            <div className="font-semibold text-lg">{signal.targetSecond}</div>
          </div>
          <div>
            <div className="text-gray-600">Current Status</div>
            <div className="font-semibold">{signal.currentStatus || "NA"}</div>
          </div>
          <div>
            <div className="text-gray-600">Price Zone</div>
            <div className="font-semibold">{signal.priceZone || "NA"}</div>
          </div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Plan</div>
          <div className="font-semibold">{signal.planName || "—"}</div>
        </div>
      </div>
    </div>
  );
};

export default SignalDetails;