import { useNavigate } from "react-router-dom";
import Verify from "../../assets/verify.png";

const SubscriptionCard = ({ subscription }) => {
    const navigate = useNavigate();
    
    // Background image for subscription cards
    const bgImage = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop";

    return (
        <div
            className="rounded-2xl shadow-sm border p-1 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
            style={{
                background: "linear-gradient(144.29deg, #E3F4CB 35%, #FFFFFF 70%)",
            }}
        >
            {/* Top Image */}
            <div
                className="relative h-28 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute left-5 -bottom-8">
                    <img
                        src={subscription.uploded_image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                        alt={subscription.plan_name}
                        className="w-16 h-16 rounded-full border-4 border-white shadow-md"
                    />
                </div>

                <p className="absolute top-20 right-4 text-white text-sm font-medium bg-black/40 px-2 py-1 rounded-md">
                    {subscription.segment}
                </p>
            </div>

            {/* Content */}
            <div className="pt-12 pb-6 px-5 text-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">
                            {subscription.plan_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {subscription.category || "Research Analyst"}
                        </p>
                    </div>
                    <img
                        src={Verify}
                        alt="verified"
                        className="w-5 h-5"
                    />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600 font-medium">Calls</p>
                        <p className="font-semibold">{subscription.avg_trades}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">
                            Ideal Capital
                        </p>
                        <p className="font-semibold">{subscription.ideal_capital}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">
                            Stoploss
                        </p>
                        <p className="font-semibold">{`${subscription.stop_loss} %`}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium">
                            Segment
                        </p>
                        <p className="font-semibold">{subscription.segment}</p>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <div className="text-sm">
                        <span className="text-[#00BFA6] font-semibold text-base">
                            Starting ₹{subscription.plan_price}
                        </span>{" "}
                        {subscription.discount && subscription.discount !== "0" && (
                            <span className="line-through text-gray-400 ml-2">
                                ₹{Math.round(subscription.plan_price / (1 - subscription.discount/100))}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => navigate(`/subscription/${subscription.id}`)}
                        className="bg-black text-white text-sm px-8 py-2 rounded-lg hover:bg-gray-800"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCard;