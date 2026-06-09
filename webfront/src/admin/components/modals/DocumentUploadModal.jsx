
import React, { useState, useEffect } from "react";
import { X, FolderUp, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const labelCls = "block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5";
const errCls   = "text-red-500 text-[11px] mt-1";

const UploadZone = ({ label, file, setter, error }) => (
  <div className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${error?"border-red-300 bg-red-50":"border-gray-200 hover:border-green-400 bg-gray-50 hover:bg-green-50"}`}>
    <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${file?"bg-green-50 border border-green-200":"bg-gray-100 border border-gray-200"}`}>
      {file ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <FolderUp className="w-5 h-5 text-gray-400" />}
    </div>
    <p className="text-[13px] font-semibold text-gray-700 mb-1">{label}</p>
    {file
      ? <p className="text-[12px] text-green-600 font-medium mb-3">{file.name}</p>
      : <p className="text-[12px] text-gray-400 mb-3">Drag & drop or browse</p>}
    <label className="inline-block cursor-pointer">
      <input type="file" className="hidden" onChange={e => setter(e.target.files[0])} />
      <span className="inline-block px-4 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-green-400 text-[12px] font-semibold text-gray-600 hover:text-green-600 transition-all">
        Browse files
      </span>
    </label>
    {error && <p className={errCls + " mt-2"}>{error}</p>}
  </div>
);

export default function DocumentUploadModal({ data, parentData, onSubmit, onBack, onClose }) {
  const [panFile,  setPan]    = useState(null);
  const [sebiFile, setSebi]   = useState(null);
  const [terms,    setTerms]  = useState("");
  const [errors,   setErrors] = useState({});
  const [loading,  setLoad]   = useState(false);
  const [profileImage, setProfileImg] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (parentData?.personal?.profileImage) setProfileImg(parentData.personal.profileImage);
  }, [parentData]);

  const validate = () => {
    const e = {};
    if (!panFile)       e.panFile  = "Please upload PAN / Aadhar";
    if (!sebiFile)      e.sebiFile = "Please upload SEBI certificate";
    if (!terms.trim())  e.terms    = "Terms & declaration required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const p = parentData?.personal || {};
    const prof = parentData?.professional || {};
    try {
      setLoad(true);
      const fd = new FormData();
      Object.entries({ name:p.name,email:p.email,mobile:p.mobile,pan:p.pan,gender:p.gender,dob:p.dob,city:p.city,state:p.state,address:p.address,aboutUs:p.aboutUs,sebiNumber:prof.sebiNumber,specialization:prof.specialization,education:prof.education,experience:prof.experience,companyName:prof.companyName,languages:prof.languages,segment:prof.segment,terms }).forEach(([k,v]) => fd.append(k,v||""));
      if (p.signature)       fd.append("signature",          p.signature);
      if (prof.selectedFile) fd.append("professionalDocument", prof.selectedFile);
      if (profileImage)      fd.append("profileImage",         profileImage);
      fd.append("panFile",  panFile);
      fd.append("sebiFile", sebiFile);
      await axios.post(`${apiUrl}/research-analyst/create`, fd, { withCredentials:true });
      toast.success("RA added successfully!");
      onSubmit?.({ panFile, sebiFile, terms });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit ❌");
    } finally { setLoad(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/25" style={{ backdropFilter:"blur(4px)", fontFamily:"'Hind Siliguri',sans-serif" }}>
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-[0_24px_64px_rgba(0,0,0,0.1)] flex flex-col max-h-[92vh]">

        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 style={{ fontFamily:"'Aileron','Arial Black',sans-serif", fontWeight:900, fontSize:16, color:"#111827" }}>Document Upload</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Step 3 of 3 — Upload verification documents</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth:"thin" }}>
          <UploadZone label="PAN / Aadhar Upload"    file={panFile}  setter={setPan}  error={errors.panFile}  />
          <UploadZone label="SEBI Certificate Upload" file={sebiFile} setter={setSebi} error={errors.sebiFile} />

          <div>
            <label className={labelCls}>Terms & Declaration <span className="text-red-500 normal-case">*</span></label>
            <input type="text" value={terms} onChange={e=>setTerms(e.target.value)} placeholder="Enter terms & declaration"
              className={`w-full bg-white border ${errors.terms?"border-red-400 ring-2 ring-red-100":"border-gray-200"} rounded-xl px-4 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all`} />
            {errors.terms && <p className={errCls}>{errors.terms}</p>}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-gray-100 px-6 py-4 flex justify-between gap-3">
          <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            style={{ fontFamily:"'Aileron','Arial Black',sans-serif" }}>← Back</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              style={{ fontFamily:"'Aileron','Arial Black',sans-serif" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.3)]"
              style={{ fontFamily:"'Aileron','Arial Black',sans-serif" }}>
              {loading ? "Submitting…" : "Submit ✓"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}