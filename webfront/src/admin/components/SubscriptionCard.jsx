import { useNavigate } from "react-router-dom";
import Verify from "../../assets/verify.png";

const SubscriptionCard = ({ subscription }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-sm bg-white rounded-xl border border-gray-300  p-4">
      
      {/* Top Section */}
      <div className="flex items-start justify-between">
        
        {/* Left: Profile + Name */}
        <div className="flex items-center gap-3">
          <img
            src={
              subscription.uploded_image ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-md font-semibold">
                {subscription.plan_name}
              </h3>
              <img src={Verify} alt="verified" className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">
              SEBI Registered
            </p>
          </div>
        </div>

        {/* Right: Price */}
        <div className="text-right">
          <p className="text-green-600 font-semibold text-md">
            ₹{subscription.plan_price}
          </p>
          {subscription.discount && subscription.discount !== "0" && (
            <p className="text-xs text-gray-400 line-through">
              ₹
              {Math.round(
                subscription.plan_price /
                  (1 - subscription.discount / 100)
              )}
            </p>
          )}
        </div>
      </div>

      {/* Title */}
      <h2 className="mt-4 text-md font-semibold text-gray-800">
        {subscription.plan_name}
      </h2>

      {/* Divider */}
      <div className="border-t border-gray-300 my-3"></div>

      {/* Features */}
      <div className="space-y-2 text-md text-gray-600">
        <p>✓ {subscription.avg_trades}</p>
        <p>✓ ₹{subscription.ideal_capital} Recommended Capital</p>
        <p>✓ {subscription.stop_loss}% Stoploss Range</p>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate(`/subscription/${subscription.id}`)}
        className="mt-4 w-full border border-green-500 text-green-600 py-2 rounded-lg text-md font-medium hover:bg-green-50"
      >
        Buy Now
      </button>
    </div>
  );
};

export default SubscriptionCard;