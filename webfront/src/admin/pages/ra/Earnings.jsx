import { summaryCards, earningsTable } from "../../../data/earningsData";
import { HiOutlineFilter } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Earnings() {
    const navigate = useNavigate();


    const handleView = (row) => {
        if (row.type === "Course") {
            navigate("/admin/earnings/course-view", { state: row });
        } else if (row.type === "Plan") {
            navigate("/admin/earnings/plan-view", { state: row });
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {summaryCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl px-6 py-5 shadow-sm border border-gray-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                    <Icon size={22} />
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">{card.title}</p>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {card.amount}
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Earnings Table - Updated with Plan UI styling */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 relative">
                {/* Header - kept original */}
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800">
                            RA Earning
                        </h3>
                        <p className="text-md text-gray-400">
                            Earning History
                        </p>
                    </div>

                    <button className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-50">
                        <HiOutlineFilter size={16} />
                        Filter
                    </button>
                </div>

                {/* Table - Updated with Plan styling */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2 border-gray-200">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-t border-gray-200">
                                <th className="px-4 py-2">User Name ↓</th>
                                <th className="px-4 py-2">Plan / Course Name ↓</th>
                                <th className="px-4 py-2">Type ↓</th>
                                <th className="px-4 py-2">Purchase Date ↓</th>
                                <th className="px-4 py-2">Amount Paid ↓</th>
                                <th className="px-4 py-2 text-right"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {earningsTable.map((item, index) => (
                                <tr key={item.id || index} className="bg-gray-50 hover:bg-gray-100">
                                    {/* User */}
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <img
                                            src={item.avatar}
                                            alt={item.name}
                                            className="w-7 h-7 rounded-full object-cover"
                                        />
                                        <span className="font-medium">{item.name}</span>
                                    </td>

                                    {/* Plan */}
                                    <td className="px-4 py-3">{item.plan}</td>

                                    {/* Type Badge */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-sm px-2 py-1 rounded-full ${item.type === "Plan"
                                                    ? "text-orange-700 bg-orange-50"
                                                    : "text-blue-700 bg-blue-50"
                                                }`}
                                        >
                                            {item.type}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-4 py-3">{item.date}</td>

                                    {/* Amount */}
                                    <td className="px-4 py-3 font-medium">{item.amount}</td>

                                    {/* Action */}
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleView(item)}
                                            className="hover:bg-gray-200 p-1 rounded"
                                        >
                                            <FiEye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
