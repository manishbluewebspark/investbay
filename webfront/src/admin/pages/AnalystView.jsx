import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Download } from "lucide-react";
import Verify from "../../assets/verify.png";

export default function AnalystView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [analyst, setAnalyst] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalystById = async () => {
            try {
                const res = await axios.get(`${apiUrl}/research-analyst/${id}`);
                if (res.data.success) setAnalyst(res.data.data);
                else setError("Failed to fetch analyst details");
            } catch (err) {
                console.error(err);
                setError("Server error");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalystById();
    }, [apiUrl, id]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Loading...
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                {error}
            </div>
        );

    if (!analyst)
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Analyst not found
            </div>
        );

    const handleDownload = (fileName) => {
        if (!fileName) return alert("File not found!");
        const link = document.createElement("a");
        link.href = `${apiUrl}/uploads/${fileName}`;
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-black transition mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button> */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-full mx-auto">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden md:col-span-1">
                    <img
                        src={
                            analyst.profileImage
                                ? `${apiUrl}/uploads/${analyst.profileImage}`
                                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="Profile"
                        className="w-full h-56 object-cover"
                    />

                    <div
                        className="p-5 rounded-2xl"
                        style={{
                            background: "linear-gradient(to bottom, #BFFFD2 10%, #FFFFFF 100%)",
                        }}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {analyst.name || "N/A"}
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    {analyst.experience || "0"} years of experience
                                </p>
                            </div>
                            <div>
                                <img src={Verify} alt="Verified" className="w-5 h-5 mb-3" />
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">Email</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {analyst.email || "N/A"}
                                </p>
                            </div>

                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">Gender</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {analyst.gender || "N/A"}
                                </p>
                            </div>

                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">Date of Birth</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {analyst.dob || "N/A"}
                                </p>
                            </div>

                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">City</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {analyst.city || "N/A"}
                                </p>
                            </div>

                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">State</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {analyst.state || "N/A"}
                                </p>
                            </div>

                            <div className="flex bg-white p-2 rounded-full">
                                <p className="text-gray-500 w-40">Address</p>
                                <p className="font-medium text-gray-800 flex-1 text-right">
                                    {analyst.address || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT DETAILS SECTION */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm  p-6">
                        <h3 className="text-gray-800 font-semibold mb-4 text-2xl">
                            Professional Details
                        </h3>
                        <hr className="border-t border-gray-300 -mx-6 mb-3" />
                        <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                            <div>
                                <p className="text-gray-500 text-sm">SEBI Registration Number</p>
                                <p className="font-medium text-gray-800 text-md">
                                    {analyst.sebiNumber || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Experience (in years)</p>
                                <p className="font-medium text-gray-800 text-md">
                                    {analyst.experience || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Specialization</p>
                                <p className="font-medium text-gray-800 text-md">
                                    {analyst.specialization || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Current Firm / Company Name</p>
                                <p className="font-medium text-gray-800 text-md">
                                    {analyst.companyName || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Education / Certification</p>
                                <p className="font-medium text-gray-800 text-md">
                                    {analyst.education || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Languages</p>
                                <p className="font-medium text-gray-800 text-md">
                                    {(() => {
                                        const langs = analyst.languages;

                                        if (!langs) return "N/A";

                                        if (Array.isArray(langs)) {
                                            return langs.join(", ");
                                        }

                                        if (typeof langs === "string") {
                                            const cleaned = langs
                                                .replace(/[{}"]/g, "") 
                                                .split(",")
                                                .map((lang) => {
                                                    const trimmed = lang.trim();
                                                    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                                                })
                                                .filter(Boolean);

                                            return cleaned.join(", ");
                                        }


                                        return "N/A";
                                    })()}
                                </p>

                            </div>
                        </div>
                    </div>

                    {/* Document Details */}
                    <div className="bg-white rounded-2xl shadow-sm  p-6">
                        <h3 className="text-gray-800 font-semibold mb-4 text-2xl">
                            Document Details
                        </h3>
                        <hr className="border-t border-gray-300 -mx-6 mb-3" />

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg ">
                                <div>
                                    <p className="font-medium text-gray-800 text-md">
                                        Pan Card.pdf
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDownload(analyst.panFile)}
                                    className="text-gray-600 hover:text-black"
                                >
                                    <Download size={18} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg ">
                                <div>
                                    <p className="font-medium text-gray-800 text-md">
                                        SEBI Certificate.pdf
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDownload(analyst.sebiFile)}
                                    className="text-gray-600 hover:text-black"
                                >
                                    <Download size={18} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg ">
                                <div>
                                    <p className="font-medium text-gray-800 text-md">
                                        Document.pdf
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDownload(analyst.professionalDocument)}
                                    className="text-gray-600 hover:text-black"
                                >
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
