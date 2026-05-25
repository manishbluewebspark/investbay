import React, { useState, useEffect } from "react";
import { X, FolderUp } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DocumentUploadModal({ data, parentData, onSubmit, onBack, onClose }) {
  const [panFile, setPanFile] = useState(null);
  const [sebiFile, setSebiFile] = useState(null);
  const [terms, setTerms] = useState("");
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (parentData?.personal?.profileImage) {
      setProfileImage(parentData.personal.profileImage);
    }
  }, [parentData]);

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    setter(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!panFile) newErrors.panFile = "Please upload your PAN / Aadhar file";
    if (!sebiFile) newErrors.sebiFile = "Please upload your SEBI certificate";
    if (!terms.trim()) newErrors.terms = "Please enter terms & declaration";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setPanFile(null);
    setSebiFile(null);
    setTerms("");
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const p = parentData?.personal || {};
    const prof = parentData?.professional || {};

    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Personal
      formDataToSend.append("name", p.name || "");
      formDataToSend.append("email", p.email || "");
      formDataToSend.append("mobile", p.mobile || "");
      formDataToSend.append("pan", p.pan || "");
      formDataToSend.append("gender", p.gender || "");
      formDataToSend.append("dob", p.dob || "");
      formDataToSend.append("city", p.city || "");
      formDataToSend.append("state", p.state || "");
      formDataToSend.append("address", p.address || "");
      formDataToSend.append("aboutUs", p.aboutUs || "");

      // ✅ IMPORTANT: Add signature file if it exists
      if (p.signature) {
        formDataToSend.append("signature", p.signature);
        console.log("Signature file appended:", p.signature);
      }

      // Professional
      formDataToSend.append("sebiNumber", prof.sebiNumber || "");
      formDataToSend.append("specialization", prof.specialization || "");
      formDataToSend.append("education", prof.education || "");
      formDataToSend.append("experience", prof.experience || "");
      formDataToSend.append("companyName", prof.companyName || "");
      formDataToSend.append("languages", prof.languages || "");
      formDataToSend.append("segment", prof.segment || "");

      if (prof.selectedFile) {
        formDataToSend.append("professionalDocument", prof.selectedFile);
      }

      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      formDataToSend.append("terms", terms);
      formDataToSend.append("panFile", panFile);
      formDataToSend.append("sebiFile", sebiFile);

      const res = await axios.post(
        `${apiUrl}/research-analyst/create`,
        formDataToSend,
        { withCredentials: true }
      );

      toast.success("Form submitted successfully");
      console.log("Saved to DB:", res.data);

      resetForm();
      onSubmit?.({ panFile, sebiFile, terms });
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error.response?.data?.message || "Failed to submit data ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4 border-gray-300">
          <h2 className="text-lg font-semibold">Expertise & Services</h2>
          <button onClick={onClose}>
            <X className="w-7 h-7 text-gray-400 hover:text-gray-700 bg-gray-300 rounded-md p-1" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* PAN */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.panFile ? "border-red-500" : "border-gray-300"}`}>
            <FolderUp className="w-10 h-10 mx-auto text-teal-500" />
            <p className="font-medium mt-2">PAN / Aadhar Upload</p>
            <p className="text-gray-400 text-md mt-1">OR</p>
            <label className="inline-block mt-3">
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, setPanFile)} />
              <span className="px-4 py-1.5 border rounded-lg text-md cursor-pointer hover:bg-gray-50 border-gray-300">
                Browse files
              </span>
            </label>
            {panFile && <p className="text-md text-gray-600 mt-2">{panFile.name}</p>}
            {errors.panFile && <p className="text-red-500 text-md mt-2">{errors.panFile}</p>}
          </div>

          {/* SEBI */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.sebiFile ? "border-red-500" : "border-gray-300"}`}>
            <FolderUp className="w-10 h-10 mx-auto text-teal-500" />
            <p className="font-medium mt-2">SEBI Certificate Upload</p>
            <p className="text-gray-400 text-md mt-1">OR</p>
            <label className="inline-block mt-3">
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, setSebiFile)} />
              <span className="px-4 py-1.5 border rounded-lg text-md cursor-pointer hover:bg-gray-50 border-gray-300">
                Browse files
              </span>
            </label>
            {sebiFile && <p className="text-md text-gray-600 mt-2">{sebiFile.name}</p>}
            {errors.sebiFile && <p className="text-red-500 text-md mt-2">{errors.sebiFile}</p>}
          </div>

          {/* Terms */}
          <div>
            <label className="text-md font-medium block mb-1">Terms & Declaration</label>
            <input
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Enter Terms & Declaration"
              className={`w-full border rounded-lg px-3 py-2 text-md ${errors.terms ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.terms && <p className="text-red-500 text-md mt-1">{errors.terms}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4 border-gray-300">
          <button onClick={onBack} className="px-4 py-2 border rounded-lg text-md hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-lg text-md hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}