import React, { useState } from "react";
import uploadIcon from "../../../assets/upload.svg";
import { X, ChevronDown, Check } from "lucide-react";

const EDUCATION_OPTIONS = [
  { value:"cfa",label:"CFA (Chartered Financial Analyst)" },{ value:"cpa",label:"CPA (Certified Public Accountant)" },
  { value:"ca",label:"CA (Chartered Accountant)" },{ value:"cma",label:"CMA (Certified Management Accountant)" },
  { value:"cs",label:"CS (Company Secretary)" },{ value:"cfp",label:"CFP (Certified Financial Planner)" },
  { value:"nism",label:"NISM Certifications" },{ value:"ncfm",label:"NCFM (NSE Certifications)" },
  { value:"sebi-ria",label:"SEBI RIA Certification" },{ value:"mba-finance",label:"MBA Finance" },
  { value:"mba",label:"MBA" },{ value:"bcom",label:"B.Com" },{ value:"mcom",label:"M.Com" },
  { value:"btech-cse",label:"B.Tech Computer Science" },{ value:"btech-it",label:"B.Tech Information Technology" },
  { value:"mca",label:"MCA" },{ value:"bsc-cs",label:"B.Sc Computer Science" },{ value:"other",label:"Other" },
];
const LANGUAGES = [
  { value:"english",label:"English" },{ value:"hindi",label:"Hindi" },{ value:"spanish",label:"Spanish" },
  { value:"french",label:"French" },{ value:"german",label:"German" },{ value:"japanese",label:"Japanese" },
  { value:"chinese",label:"Chinese" },{ value:"arabic",label:"Arabic" },{ value:"portuguese",label:"Portuguese" },
  { value:"russian",label:"Russian" },
];

const Input = ({ error, ...props }) => (
  <input {...props} className={`w-full bg-white border ${error?"border-red-400 ring-2 ring-red-100":"border-gray-200"} rounded-xl px-4 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all`} />
);

const labelCls = "block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5";
const errCls   = "text-red-500 text-[11px] mt-1";

export default function ProfessionalDetailsModal({ data, onNext, onBack, onClose }) {
  const [form, setForm]       = useState({ sebiNumber:"",specialization:"",education:"",experience:"",companyName:"",segment:"",description:"",languages:[], ...data });
  const [selectedFile, setFile] = useState(null);
  const [touched, setTouched] = useState(false);
  const [openEdu, setOpenEdu]   = useState(false);
  const [openLang, setOpenLang] = useState(false);

  const set = (k,v) => setForm(f => ({ ...f,[k]:v }));
  const toggleLang = (v) => set("languages", form.languages.includes(v) ? form.languages.filter(l=>l!==v) : [...form.languages,v]);

  const valid = () => ["sebiNumber","specialization","experience","segment","description"].every(k => form[k]?.trim()) && selectedFile && form.languages.length>0;
  const invalid = (k) => touched && !form[k]?.trim();

  const handleNext = () => { setTouched(true); if (valid()) onNext({ ...form, selectedFile }); };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/25" style={{ backdropFilter:"blur(4px)", fontFamily:"'Hind Siliguri',sans-serif" }}>
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-[0_24px_64px_rgba(0,0,0,0.1)]" style={{ scrollbarWidth:"none" }}>

        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 style={{ fontFamily:"'Aileron','Arial Black',sans-serif", fontWeight:900, fontSize:16, color:"#111827" }}>Professional Details</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Step 2 of 3</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>SEBI Reg No. <span className="text-red-500 normal-case">*</span></label>
              <Input placeholder="INH000..." value={form.sebiNumber} onChange={e=>set("sebiNumber",e.target.value)} error={invalid("sebiNumber")} />
              {invalid("sebiNumber") && <p className={errCls}>Required</p>}</div>
            <div><label className={labelCls}>Specialization <span className="text-red-500 normal-case">*</span></label>
              <Input placeholder="e.g. Equity, Derivatives" value={form.specialization} onChange={e=>set("specialization",e.target.value)} error={invalid("specialization")} />
              {invalid("specialization") && <p className={errCls}>Required</p>}</div>
          </div>

          {/* Education dropdown */}
          <div>
            <label className={labelCls}>Education / Certification</label>
            <div className="relative">
              <button type="button" onClick={() => setOpenEdu(!openEdu)}
                className={`w-full bg-white border ${openEdu?"border-green-400 ring-2 ring-green-100":"border-gray-200"} rounded-xl px-4 py-2.5 text-[13px] text-left flex items-center justify-between hover:border-gray-300 transition-all focus:outline-none`}>
                <span className={form.education?"text-gray-900":"text-gray-400"}>
                  {EDUCATION_OPTIONS.find(o=>o.value===form.education)?.label || "Select Education / Certification"}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${openEdu?"rotate-180":""}`} />
              </button>
              {openEdu && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-30 max-h-52 overflow-y-auto">
                  {EDUCATION_OPTIONS.map(o => (
                    <button key={o.value} type="button" onClick={() => { set("education",o.value); setOpenEdu(false); }}
                      className={`w-full px-4 py-2.5 text-left text-[13px] flex items-center gap-2.5 transition-all ${form.education===o.value?"bg-green-50 text-green-700 font-semibold":"text-gray-700 hover:bg-gray-50"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${form.education===o.value?"bg-green-500":"bg-gray-300"}`} />
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Experience (Years) <span className="text-red-500 normal-case">*</span></label>
              <Input placeholder="e.g. 5" value={form.experience} onChange={e=>set("experience",e.target.value)} error={invalid("experience")} />
              {invalid("experience") && <p className={errCls}>Required</p>}</div>
            <div><label className={labelCls}>Segment <span className="text-red-500 normal-case">*</span></label>
              <Input placeholder="e.g. Equity, F&O" value={form.segment} onChange={e=>set("segment",e.target.value)} error={invalid("segment")} />
              {invalid("segment") && <p className={errCls}>Required</p>}</div>
          </div>

          <div><label className={labelCls}>Current Firm / Company</label>
            <Input placeholder="Company name" value={form.companyName} onChange={e=>set("companyName",e.target.value)} /></div>

          {/* Languages multi-select */}
          <div className="relative">
            <label className={labelCls}>Languages <span className="text-red-500 normal-case">*</span></label>
            <div onClick={() => setOpenLang(!openLang)}
              className={`w-full bg-white border ${touched&&!form.languages.length?"border-red-400 ring-2 ring-red-100":openLang?"border-green-400 ring-2 ring-green-100":"border-gray-200"} rounded-xl px-4 py-2.5 text-[13px] cursor-pointer flex items-center justify-between hover:border-gray-300 transition-all`}>
              <span className={form.languages.length?"text-gray-900":"text-gray-400"}>
                {form.languages.length ? form.languages.map(v=>LANGUAGES.find(l=>l.value===v)?.label).join(", ") : "Select languages"}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${openLang?"rotate-180":""}`} />
            </div>
            {openLang && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-30 overflow-hidden">
                <div className="p-2 max-h-48 overflow-y-auto space-y-0.5">
                  {LANGUAGES.map(lang => {
                    const sel = form.languages.includes(lang.value);
                    return (
                      <div key={lang.value} onClick={() => toggleLang(lang.value)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors ${sel?"bg-green-50 text-green-700":"hover:bg-gray-50 text-gray-700"}`}>
                        <div className={`w-4 h-4 rounded-lg border flex items-center justify-center flex-shrink-0 ${sel?"bg-green-600 border-green-600":"border-gray-300 bg-white"}`}>
                          {sel && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        <span className="text-[13px] font-medium">{lang.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-100 px-4 py-2.5 flex justify-between items-center bg-gray-50">
                  <span className="text-[11px] text-gray-400">{form.languages.length} selected</span>
                  {form.languages.length > 0 && <button type="button" onClick={e => { e.stopPropagation(); set("languages",[]); }}
                    className="text-[11px] text-red-500 hover:text-red-700 font-semibold">Clear all</button>}
                </div>
              </div>
            )}
            {touched && !form.languages.length && <p className={errCls}>Select at least one language</p>}
          </div>

          {/* File upload */}
          <div>
            <label className={labelCls}>Documents <span className="text-red-500 normal-case">*</span></label>
            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${touched&&!selectedFile?"border-red-300 bg-red-50":"border-gray-200 hover:border-green-400 bg-gray-50 hover:bg-green-50"}`}>
              <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                <img src={uploadIcon} alt="Upload" className="h-8 w-8 opacity-40" />
                <p className="text-[13px] font-semibold text-gray-700">Upload Documents</p>
                <p className="text-[12px] text-gray-400">Click to browse or drag & drop</p>
                <input type="file" className="hidden" onChange={e => { if(e.target.files[0]) setFile(e.target.files[0]); }} />
              </label>
              {selectedFile && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-[12px] font-semibold text-green-600">{selectedFile.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="text-[11px] text-red-500 hover:text-red-700">Remove</button>
                </div>
              )}
            </div>
            {touched && !selectedFile && <p className={errCls}>Please upload a document</p>}
          </div>

          <div><label className={labelCls}>Description <span className="text-red-500 normal-case">*</span></label>
            <Input placeholder="Brief description…" value={form.description} onChange={e=>set("description",e.target.value)} error={invalid("description")} />
            {invalid("description") && <p className={errCls}>Required</p>}</div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between">
          <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            style={{ fontFamily:"'Aileron','Arial Black',sans-serif" }}>← Back</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              style={{ fontFamily:"'Aileron','Arial Black',sans-serif" }}>Cancel</button>
            <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.3)]"
              style={{ fontFamily:"'Aileron','Arial Black',sans-serif" }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
