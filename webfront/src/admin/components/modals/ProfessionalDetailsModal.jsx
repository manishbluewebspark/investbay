import React, { useState } from "react";
import uploadIcon from "../../../assets/upload.svg";
import { X, ChevronDown, Check } from "lucide-react";

const EDUCATION_OPTIONS = [
  { value: "cfa", label: "CFA (Chartered Financial Analyst)" },{ value: "cpa", label: "CPA (Certified Public Accountant)" },
  { value: "ca", label: "CA (Chartered Accountant)" },{ value: "cma", label: "CMA (Certified Management Accountant)" },
  { value: "cs", label: "CS (Company Secretary)" },{ value: "cfp", label: "CFP (Certified Financial Planner)" },
  { value: "nism", label: "NISM Certifications" },{ value: "ncfm", label: "NCFM (NSE Certifications)" },
  { value: "sebi-ria", label: "SEBI RIA Certification" },
  { value: "mba-finance", label: "MBA Finance" },{ value: "mba", label: "MBA" },
  { value: "bcom", label: "B.Com" },{ value: "mcom", label: "M.Com" },
  { value: "btech-cse", label: "B.Tech Computer Science" },{ value: "btech-it", label: "B.Tech Information Technology" },
  { value: "mca", label: "MCA" },{ value: "bsc-cs", label: "B.Sc Computer Science" },
  { value: "other", label: "Other" },
];

const languageOptions = [
  { value: "english", label: "English" },{ value: "hindi", label: "Hindi" },
  { value: "spanish", label: "Spanish" },{ value: "french", label: "French" },
  { value: "german", label: "German" },{ value: "japanese", label: "Japanese" },
  { value: "chinese", label: "Chinese" },{ value: "arabic", label: "Arabic" },
  { value: "portuguese", label: "Portuguese" },{ value: "russian", label: "Russian" },
];

const GlassInput = ({ error, ...props }) => (
  <input {...props}
    className={`w-full bg-white/25 border ${error ? "border-red-400" : "border-white/50"}
      rounded-[12px] px-4 py-2.5 text-[13px] text-[#2a2118] placeholder-[#8a7e74]
      focus:outline-none focus:border-[#6e7cf8]/60 focus:bg-white/35 backdrop-blur-sm transition-all duration-200`} />
);

export default function ProfessionalDetailsModal({ data, onNext, onBack, onClose }) {
  const defaults = { sebiNumber:"",specialization:"",education:"",experience:"",companyName:"",segment:"",description:"",languages:[] };
  const [form, setForm] = useState({ ...defaults, ...(data || {}) });
  const [selectedFile, setSelectedFile] = useState(null);
  const [touched, setTouched] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);

  const handleInputChange = (field, value) => setForm({ ...form, [field]: value });
  const handleLanguageToggle = (val) => {
    const langs = form.languages || [];
    setForm({ ...form, languages: langs.includes(val) ? langs.filter(l=>l!==val) : [...langs, val] });
  };

  const validateForm = () =>
    ["sebiNumber","specialization","experience","segment","description"].every(f => form[f]?.trim())
    && selectedFile && form.languages?.length > 0;

  const handleNext = () => { setTouched(true); if (validateForm()) onNext({ ...form, selectedFile }); };

  const isInvalid = (f) => touched && !form[f]?.trim();
  const isLangInvalid = touched && (!form.languages || form.languages.length === 0);
  const isFileInvalid = touched && !selectedFile;

  const labelClass = "text-[12px] font-semibold text-[#5a4e44] uppercase tracking-[0.4px] mb-1.5 block";
  const errorClass = "text-red-400 text-[11px] mt-1";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: "rgba(30,20,10,0.45)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[24px]
        bg-white/25 backdrop-blur-2xl border border-white/45 shadow-2xl
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/20 backdrop-blur-xl border-b border-white/30 px-6 py-4 flex items-center justify-between rounded-t-[24px]">
          <div>
            <h3 className="font-['Sora'] text-[16px] font-bold text-[#2a2118]">Professional Details</h3>
            <p className="text-[11.5px] text-[#8a7e74] mt-0.5">Step 2 of 3</p>
          </div>
          <button onClick={onClose}
            className="h-8 w-8 rounded-[10px] bg-white/30 border border-white/45 flex items-center justify-center hover:bg-white/45 transition-all">
            <X className="h-4 w-4 text-[#5a4e44]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* SEBI + Specialization */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>SEBI Reg No. <span className="text-red-400 normal-case">*</span></label>
              <GlassInput type="text" placeholder="Enter number" value={form.sebiNumber}
                onChange={(e) => handleInputChange("sebiNumber", e.target.value)} error={isInvalid("sebiNumber")} />
              {isInvalid("sebiNumber") && <p className={errorClass}>Required</p>}
            </div>
            <div>
              <label className={labelClass}>Specialization <span className="text-red-400 normal-case">*</span></label>
              <GlassInput type="text" placeholder="e.g. Equity, Derivatives" value={form.specialization}
                onChange={(e) => handleInputChange("specialization", e.target.value)} error={isInvalid("specialization")} />
              {isInvalid("specialization") && <p className={errorClass}>Required</p>}
            </div>
          </div>

          {/* Education Dropdown */}
          <div>
            <label className={labelClass}>Education / Certification</label>
            <div className="relative">
              <button type="button" onClick={() => setIsEducationOpen(!isEducationOpen)}
                className={`w-full bg-white/25 border ${isEducationOpen ? "border-[#6e7cf8]/60" : "border-white/50"}
                  rounded-[12px] px-4 py-2.5 text-[13px] text-left flex items-center justify-between
                  hover:bg-white/35 backdrop-blur-sm transition-all duration-200`}>
                <span className={form.education ? "text-[#2a2118]" : "text-[#8a7e74]"}>
                  {EDUCATION_OPTIONS.find(o=>o.value===form.education)?.label || "Select Education / Certification"}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-[#8a7e74] transition-transform ${isEducationOpen ? "rotate-180" : ""}`} />
              </button>
              {isEducationOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[14px] shadow-xl z-30 max-h-52 overflow-y-auto">
                  {EDUCATION_OPTIONS.map(o => (
                    <button key={o.value} type="button"
                      onClick={() => { handleInputChange("education", o.value); setIsEducationOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-[12.5px] flex items-center gap-2.5 transition-all
                        ${form.education===o.value ? "bg-[#6e7cf8]/12 text-[#4338ca]" : "text-[#2a2118] hover:bg-white/50"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${form.education===o.value ? "bg-[#6e7cf8]" : "bg-[#c8b8a8]"}`} />
                      <span className="font-medium">{o.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Experience + Segment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Experience (Years) <span className="text-red-400 normal-case">*</span></label>
              <GlassInput type="text" placeholder="e.g. 5" value={form.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)} error={isInvalid("experience")} />
              {isInvalid("experience") && <p className={errorClass}>Required</p>}
            </div>
            <div>
              <label className={labelClass}>Segment <span className="text-red-400 normal-case">*</span></label>
              <GlassInput type="text" placeholder="e.g. Equity, F&O" value={form.segment}
                onChange={(e) => handleInputChange("segment", e.target.value)} error={isInvalid("segment")} />
              {isInvalid("segment") && <p className={errorClass}>Required</p>}
            </div>
          </div>

          {/* Company */}
          <div>
            <label className={labelClass}>Current Firm / Company</label>
            <GlassInput type="text" placeholder="Enter company name" value={form.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)} />
          </div>

          {/* Languages */}
          <div className="relative">
            <label className={labelClass}>Languages <span className="text-red-400 normal-case">*</span></label>
            <div onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className={`w-full bg-white/25 border ${isLangInvalid ? "border-red-400" : isLanguageOpen ? "border-[#6e7cf8]/60" : "border-white/50"}
                rounded-[12px] px-4 py-2.5 text-[13px] cursor-pointer flex items-center justify-between
                hover:bg-white/35 backdrop-blur-sm transition-all`}>
              <span className={form.languages?.length ? "text-[#2a2118]" : "text-[#8a7e74]"}>
                {form.languages?.length
                  ? form.languages.map(v => languageOptions.find(o=>o.value===v)?.label).join(", ")
                  : "Select languages"}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-[#8a7e74] transition-transform ${isLanguageOpen ? "rotate-180" : ""}`} />
            </div>
            {isLanguageOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[14px] shadow-xl z-30 overflow-hidden">
                <div className="p-2 max-h-48 overflow-y-auto space-y-0.5">
                  {languageOptions.map(lang => {
                    const sel = form.languages?.includes(lang.value);
                    return (
                      <div key={lang.value} onClick={() => handleLanguageToggle(lang.value)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-[10px] cursor-pointer transition-colors
                          ${sel ? "bg-[#6e7cf8]/12 text-[#4338ca]" : "hover:bg-white/50 text-[#2a2118]"}`}>
                        <div className={`w-4 h-4 rounded-[5px] border flex items-center justify-center flex-shrink-0
                          ${sel ? "bg-[#6e7cf8] border-[#6e7cf8]" : "border-white/60 bg-white/20"}`}>
                          {sel && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        <span className="text-[12.5px] font-medium">{lang.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-white/30 px-3 py-2 flex justify-between items-center bg-white/10">
                  <span className="text-[11px] text-[#8a7e74]">{form.languages?.length || 0} selected</span>
                  {form.languages?.length > 0 && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form,languages:[]}); }}
                      className="text-[11px] text-red-400 hover:text-red-600">Clear all</button>
                  )}
                </div>
              </div>
            )}
            {isLangInvalid && <p className={errorClass}>Please select at least one language</p>}
          </div>

          {/* File Upload */}
          <div>
            <label className={labelClass}>Documents <span className="text-red-400 normal-case">*</span></label>
            <div className={`border-2 border-dashed rounded-[16px] p-5 text-center transition-all
              ${isFileInvalid ? "border-red-400 bg-red-400/5" : "border-white/45 hover:border-[#6e7cf8]/40 bg-white/10 hover:bg-white/15"}`}>
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <img src={uploadIcon} alt="Upload" className="mb-2 h-8 w-8 opacity-60" />
                <p className="text-[13px] font-medium text-[#2a2118]">Upload Documents</p>
                <p className="text-[11.5px] text-[#8a7e74] mt-0.5">Click to browse or drag & drop</p>
                <input id="fileInput" type="file" className="hidden" onChange={(e) => { if(e.target.files[0]) setSelectedFile(e.target.files[0]); }} />
              </label>
              {selectedFile && (
                <div className="mt-3">
                  <p className="text-[12px] text-[#2a2118]">
                    <span className="font-medium text-green-600">{selectedFile.name}</span>
                  </p>
                  <button type="button" onClick={() => setSelectedFile(null)}
                    className="text-[11px] text-red-400 hover:text-red-600 mt-1">Remove</button>
                </div>
              )}
            </div>
            {isFileInvalid && <p className={errorClass}>Please upload a document</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description <span className="text-red-400 normal-case">*</span></label>
            <GlassInput type="text" placeholder="Brief description..." value={form.description}
              onChange={(e) => setForm({...form,description:e.target.value})} error={isInvalid("description")} />
            {isInvalid("description") && <p className={errorClass}>Required</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/20 backdrop-blur-xl border-t border-white/30 px-6 py-4 flex justify-between items-center rounded-b-[24px]">
          <button onClick={onBack}
            className="px-5 py-2.5 rounded-[12px] bg-white/25 border border-white/45 text-[13px] text-[#5a4e44] font-medium hover:bg-white/35 transition-all">
            ← Back
          </button>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-[12px] bg-white/25 border border-white/45 text-[13px] text-[#5a4e44] font-medium hover:bg-white/35 transition-all">
              Cancel
            </button>
            <button onClick={handleNext}
              className="px-6 py-2.5 rounded-[12px] text-white text-[13px] font-medium transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #6e7cf8, #4fc3f7)" }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}