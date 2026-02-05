import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import AddFeedModal from "../../components/modals/AddFeedModal";
import NotFound from "../../components/NotFound";
import FeedCard from "../../components/FeedCard";
import filterIcon from "../../../assets/card/filter.svg";
import axios from "axios";

const AdminFeed = () => {

  
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/feeds/${userId}`);
      setFeeds(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching feeds:", error);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchFeeds();
    else setLoading(false);
  }, [userId]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Feeds</h2>
          <p className="text-sm text-gray-500">All feeds list</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg">
            <img src={filterIcon} className="w-4 h-4" />
            Filter
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            <FiPlus /> Add Feed
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : feeds.length === 0 ? (
        <NotFound />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feeds.map((feed) => (
            <FeedCard key={feed.id} feed={feed} />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddFeedModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onNext={() => {
          setShowModal(false);
          fetchFeeds();
        }}
      />
    </div>
  );
};

export default AdminFeed;