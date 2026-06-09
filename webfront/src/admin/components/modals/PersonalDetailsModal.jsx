
import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Camera, Upload, User, FileSignature } from "lucide-react";

const INDIAN_STATES = [
  { value: "andhra-pradesh", label: "Andhra Pradesh" }, { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" }, { value: "bihar", label: "Bihar" }, { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" }, { value: "gujarat", label: "Gujarat" }, { value: "haryana", label: "Haryana" },
  { value: "himachal-pradesh", label: "Himachal Pradesh" }, { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" }, { value: "kerala", label: "Kerala" },
  { value: "madhya-pradesh", label: "Madhya Pradesh" }, { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" }, { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" }, { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" }, { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" }, { value: "sikkim", label: "Sikkim" },
  { value: "tamil-nadu", label: "Tamil Nadu" }, { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" }, { value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" }, { value: "west-bengal", label: "West Bengal" },
  { value: "delhi", label: "Delhi" }, { value: "jammu-and-kashmir", label: "Jammu and Kashmir" },
  { value: "ladakh", label: "Ladakh" }, { value: "puducherry", label: "Puducherry" },
];

const Input = ({ error, className = "", ...props }) => (
  <input {...props}
    className={`w-full bg-white border ${error ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"} rounded-xl px-4 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all ${className}`}
  />
);

const LightDropdown = ({ open, onToggle, label, placeholder, error, children, dropRef }) => (
  <div className="relative" ref={dropRef}>
    <button type="button" onClick={onToggle}
      className={`w-full bg-white border ${error ? "border-red-400" : open ? "border-green-400 ring-2 ring-green-100" : "border-gray-200"} rounded-xl px-4 py-2.5 text-[13px] text-left flex items-center justify-between hover:border-gray-300 focus:outline-none transition-all`}>
      <span className={label ? "text-gray-900" : "text-gray-400"}>{label || placeholder}</span>
      <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
    {open && (
      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-30 max-h-52 overflow-y-auto">
        {children}
      </div>
    )}
  </div>
);

const DropOpt = ({ selected, onClick, label }) => (
  <button type="button" onClick={onClick}
    className={`w-full px-4 py-2.5 text-left text-[13px] flex items-center gap-2.5 transition-all ${selected ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selected ? "bg-green-500" : "bg-gray-300"}`} />
    {label}
  </button>
);

const labelCls = "block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5";
const errCls = "text-red-500 text-[11px] mt-1";

export default function PersonalDetailsModal({ data, onNext, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", gender: "", dob: "", city: "", state: "", address: "", profilePicture: null, about_us: "", mobile: "", pan: "", signature: null, ...data });
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(null);
  const [sigPreview, setSigPreview] = useState(null);
  const [dobDate, setDobDate] = useState({ day: "", month: "", year: "" });
  const [open, setOpen] = useState({ gender: false, state: false, day: false, month: false, year: false });
  const refs = { gender: useRef(), state: useRef(), day: useRef(), month: useRef(), year: useRef(), file: useRef(), sig: useRef() };

  const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
  const MONTHS = Array.from({ length: 12 }, (_, i) => ({ v: i + 1, l: new Date(0, i).toLocaleString("default", { month: "short" }) }));
  const YEARS = Array.from({ length: 60 }, (_, i) => 2010 - i + 26);
  const genders = [{ v: "male", l: "Male" }, { v: "female", l: "Female" }, { v: "other", l: "Other" }];

  useEffect(() => {
    const close = (e) => {
      ["gender", "state", "day", "month", "year"].forEach(k => {
        if (refs[k].current && !refs[k].current.contains(e.target)) setOpen(o => ({ ...o, [k]: false }));
      });
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.mobile || !/^[0-9]{10}$/.test(form.mobile)) e.mobile = "10-digit mobile required";
    if (!form.pan.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan)) e.pan = "Valid PAN required (ABCDE1234F)";
    if (!form.state) e.state = "State is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!dobDate.day || !dobDate.month || !dobDate.year) e.dob = "Complete date of birth required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      const dob = `${dobDate.year}-${String(dobDate.month).padStart(2, "0")}-${String(dobDate.day).padStart(2, "0")}`;
      onNext({ ...form, profileImage: form.profilePicture, dob, signature: form.signature });
    }
  };

  const uploadImg = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
    const r = new FileReader(); r.onload = ev => { setImgPreview(ev.target.result); setForm({ ...form, profilePicture: f }); }; r.readAsDataURL(f);
  };

  const uploadSig = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
    const r = new FileReader(); r.onload = ev => { setSigPreview(ev.target.result); setForm({ ...form, signature: f }); }; r.readAsDataURL(f);
  };

  const tog = (k) => setOpen(o => ({ ...o, [k]: !o[k] }));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/25" style={{ backdropFilter: "blur(4px)", fontFamily: "'Hind Siliguri',sans-serif" }}>
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-[0_24px_64px_rgba(0,0,0,0.1)]" style={{ scrollbarWidth: "none" }}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 16, color: "#111827" }}>Add New RA</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Step 1 of 3 — Personal Details</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Profile + Signature */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
            {/* Photo */}
            <div className="flex flex-col items-center gap-2">
              <label className={labelCls}>Profile Photo</label>
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {imgPreview ? <img src={imgPreview} alt="Profile" className="w-full h-full object-cover" /> : <User className="h-9 w-9 text-gray-300" />}
                  <div onClick={() => refs.file.current?.click()}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <button onClick={() => refs.file.current?.click()}
                  className="mt-2 flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mx-auto">
                  <Upload className="h-3 w-3" />{imgPreview ? "Change" : "Upload"}
                </button>
                {imgPreview && <button onClick={() => { setImgPreview(null); setForm({ ...form, profilePicture: null }); }}
                  className="text-[11px] text-red-500 hover:text-red-700 mx-auto block">Remove</button>}
                <input type="file" ref={refs.file} onChange={uploadImg} accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="hidden sm:block w-px h-24 bg-gray-100" />

            {/* Signature */}
            <div className="flex flex-col items-center gap-2">
              <label className={labelCls}>Signature</label>
              <div onClick={() => refs.sig.current?.click()}
                className="w-44 h-24 rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-400 bg-gray-50 hover:bg-green-50 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group">
                {sigPreview
                  ? <><img src={sigPreview} alt="Signature" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <Camera className="h-5 w-5 text-white" />
                    </div></>
                  : <><FileSignature className="h-6 w-6 text-gray-300 mb-1" />
                    <span className="text-[11px] text-gray-400">Click to upload</span>
                    <span className="text-[10px] text-gray-400">PNG/JPG, max 2MB</span></>}
              </div>
              {sigPreview && <button onClick={() => { setSigPreview(null); setForm({ ...form, signature: null }); }}
                className="text-[11px] text-red-500 hover:text-red-700">Remove</button>}
              <input type="file" ref={refs.sig} onChange={uploadSig} accept="image/png,image/jpeg,image/jpg" className="hidden" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Full Name (As Per PAN) <span className="text-red-500 normal-case">*</span></label>
              <Input placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
              {errors.name && <p className={errCls}>{errors.name}</p>}</div>
            <div><label className={labelCls}>Mobile Number <span className="text-red-500 normal-case">*</span></label>
              <Input type="tel" placeholder="10-digit number" value={form.mobile} maxLength="10" onChange={e => setForm({ ...form, mobile: e.target.value })} error={errors.mobile} />
              {errors.mobile && <p className={errCls}>{errors.mobile}</p>}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>PAN Number <span className="text-red-500 normal-case">*</span></label>
              <Input placeholder="ABCDE1234F" value={form.pan} maxLength="10" onChange={e => setForm({ ...form, pan: e.target.value.toUpperCase() })} error={errors.pan} />
              {errors.pan && <p className={errCls}>{errors.pan}</p>}</div>
            <div><label className={labelCls}>Email Address <span className="text-red-500 normal-case">*</span></label>
              <Input type="email" placeholder="Enter email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
              {errors.email && <p className={errCls}>{errors.email}</p>}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Gender</label>
              <LightDropdown open={open.gender} onToggle={() => tog("gender")} dropRef={refs.gender}
                label={genders.find(g => g.v === form.gender)?.l} placeholder="Select Gender">
                {genders.map(g => <DropOpt key={g.v} selected={form.gender === g.v} onClick={() => { setForm({ ...form, gender: g.v }); setOpen(o => ({ ...o, gender: false })); }} label={g.l} />)}
              </LightDropdown></div>
            <div><label className={labelCls}>Date of Birth <span className="text-red-500 normal-case">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {/* Day */}
                <div ref={refs.day}>
                  <button onClick={() => tog("day")} type="button"
                    className={`w-full bg-white border ${errors.dob ? "border-red-400" : "border-gray-200"} rounded-xl px-3 py-2.5 text-[13px] text-left flex items-center justify-between hover:border-gray-300 transition-all focus:outline-none`}>
                    <span className={dobDate.day ? "text-gray-900" : "text-gray-400"}>{dobDate.day ? String(dobDate.day).padStart(2, "0") : "DD"}</span>
                    <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${open.day ? "rotate-180" : ""}`} />
                  </button>
                  {open.day && <div className="absolute bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-44 overflow-y-auto w-16 mt-1">
                    {DAYS.map(d => <button key={d} onClick={() => { setDobDate({ ...dobDate, day: d }); setOpen(o => ({ ...o, day: false })); }}
                      className={`w-full px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 ${dobDate.day === d ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700"}`}>{String(d).padStart(2, "0")}</button>)}
                  </div>}
                </div>
                {/* Month */}
                <div ref={refs.month}>
                  <button onClick={() => tog("month")} type="button"
                    className={`w-full bg-white border ${errors.dob ? "border-red-400" : "border-gray-200"} rounded-xl px-3 py-2.5 text-[13px] text-left flex items-center justify-between hover:border-gray-300 transition-all focus:outline-none`}>
                    <span className={dobDate.month ? "text-gray-900" : "text-gray-400"}>{dobDate.month ? MONTHS.find(m => m.v === dobDate.month)?.l : "MM"}</span>
                    <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${open.month ? "rotate-180" : ""}`} />
                  </button>
                  {open.month && <div className="absolute bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-44 overflow-y-auto w-20 mt-1">
                    {MONTHS.map(m => <button key={m.v} onClick={() => { setDobDate({ ...dobDate, month: m.v }); setOpen(o => ({ ...o, month: false })); }}
                      className={`w-full px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 ${dobDate.month === m.v ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700"}`}>{m.l}</button>)}
                  </div>}
                </div>
                {/* Year */}
                <div ref={refs.year}>
                  <button onClick={() => tog("year")} type="button"
                    className={`w-full bg-white border ${errors.dob ? "border-red-400" : "border-gray-200"} rounded-xl px-3 py-2.5 text-[13px] text-left flex items-center justify-between hover:border-gray-300 transition-all focus:outline-none`}>
                    <span className={dobDate.year ? "text-gray-900" : "text-gray-400"}>{dobDate.year || "YYYY"}</span>
                    <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${open.year ? "rotate-180" : ""}`} />
                  </button>
                  {open.year && <div className="absolute bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-44 overflow-y-auto w-20 mt-1">
                    {YEARS.map(y => <button key={y} onClick={() => { setDobDate({ ...dobDate, year: y }); setOpen(o => ({ ...o, year: false })); }}
                      className={`w-full px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 ${dobDate.year === y ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700"}`}>{y}</button>)}
                  </div>}
                </div>
              </div>
              {errors.dob && <p className={errCls}>{errors.dob}</p>}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>City</label>
              <Input placeholder="Enter city" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div><label className={labelCls}>State <span className="text-red-500 normal-case">*</span></label>
              <LightDropdown open={open.state} onToggle={() => tog("state")} dropRef={refs.state}
                label={INDIAN_STATES.find(s => s.value === form.state)?.label} placeholder="Select State" error={errors.state}>
                {INDIAN_STATES.map(s => <DropOpt key={s.value} selected={form.state === s.value} onClick={() => { setForm({ ...form, state: s.value }); setOpen(o => ({ ...o, state: false })); }} label={s.label} />)}
              </LightDropdown>
              {errors.state && <p className={errCls}>{errors.state}</p>}</div>
          </div>

          <div><label className={labelCls}>Address <span className="text-red-500 normal-case">*</span></label>
            <Input placeholder="Complete address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} error={errors.address} />
            {errors.address && <p className={errCls}>{errors.address}</p>}</div>

          <div><label className={labelCls}>About</label>
            <Input placeholder="Short bio or description" value={form.about_us} onChange={e => setForm({ ...form, about_us: e.target.value })} /></div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>Cancel</button>
          <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.3)]"
            style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}