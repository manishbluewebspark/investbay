import { useNavigate } from "react-router-dom";
import bgImage from "../assets/profile-bg.jpg";
import Verify from "../assets/Verify.svg";
import { Filter } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function FeaturedSubscriptions() {
  const tabs = ["All Subscriptions", "My Subscriptions"];
  const [activeTab, setActiveTab] = useState("All Subscriptions");

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${apiUrl}/plans/plans`);

      if (res?.data?.success) {
        setSubscriptions(res.data.data || []);
      } else {
        setError("Failed to fetch subscriptions");
      }
    } catch (err) {
      console.error("Error fetching subscriptions", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const filteredSubscriptions = useMemo(() => {
    if (activeTab === "My Subscriptions") {
      return subscriptions.filter((sub) => sub.is_subscribed);
    }
    return subscriptions;
  }, [activeTab, subscriptions]);

  return (
    <section className="w-full py-10 px-6">
      <div className="max-w-7xl mx-auto px-6 min-h-screen">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit items-center rounded-full bg-black p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-md transition-all duration-300 ${
                    isActive
                      ? "bg-white text-black font-medium"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-md text-gray-700 transition hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">Loading subscriptions...</p>
        )}

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSubscriptions.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No subscriptions found
              </p>
            ) : (
              filteredSubscriptions.map((sub) => {
                const price = Number(sub.plan_price) || 0;
                const discount = Number(sub.discount) || 0;
                const originalPrice =
                  discount > 0 ? Math.round(price / (1 - discount / 100)) : 0;

                return (
                  <div
                    key={sub.id}
                    className="overflow-hidden rounded-2xl border p-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{
                      background:
                        "linear-gradient(144.29deg, #E3F4CB 35%, #FFFFFF 70%)",
                    }}
                  >
                    {/* Top Image */}
                    <div
                      className="relative h-32 rounded-2xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    >
                      <div className="absolute left-5 -bottom-8">
                        <img
                          src={sub.uploded_image || "/default-avatar.png"}
                          alt={sub.plan_name || "subscription"}
                          className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md"
                        />
                      </div>

                      <p className="absolute right-4 top-4 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white">
                        {sub.segment || "N/A"}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-6 pt-12 text-gray-700">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-black">
                            {sub.plan_name}
                          </h3>
                          <p className="text-md text-gray-500">
                            {sub.category || "Research Analyst"}
                          </p>
                        </div>

                        <img
                          src={Verify}
                          alt="verified"
                          className="mt-1 h-5 w-5 shrink-0"
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-md">
                        <div>
                          <p className="font-medium text-gray-600">Calls</p>
                          <p className="font-semibold text-black">
                            {sub.avg_trades || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">
                            Ideal Capital
                          </p>
                          <p className="font-semibold text-black">
                            {sub.ideal_capital || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">Stoploss</p>
                          <p className="font-semibold text-black">
                            {sub.stop_loss ? `${sub.stop_loss}%` : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">Segment</p>
                          <p className="font-semibold text-black">
                            {sub.segment || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="text-md">
                          <span className="text-md font-semibold text-[#00BFA6]">
                            Starting ₹{price}
                          </span>

                          {discount > 0 && (
                            <span className="ml-2 text-gray-400 line-through">
                              ₹{originalPrice}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/subscription/${sub.id}`)}
                          className="rounded-md bg-black px-5 py-2 text-md text-white transition hover:bg-gray-800"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}