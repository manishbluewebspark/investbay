import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Camera, Upload, User, FileSignature } from "lucide-react";

const INDIAN_STATES = [
  { value: "andhra-pradesh", label: "Andhra Pradesh" },{ value: "arunachal-pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },{ value: "bihar", label: "Bihar" },{ value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" },{ value: "gujarat", label: "Gujarat" },{ value: "haryana", label: "Haryana" },
  { value: "himachal-pradesh", label: "Himachal Pradesh" },{ value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },{ value: "kerala", label: "Kerala" },
  { value: "madhya-pradesh", label: "Madhya Pradesh" },{ value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },{ value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },{ value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },{ value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },{ value: "sikkim", label: "Sikkim" },
  { value: "tamil-nadu", label: "Tamil Nadu" },{ value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },{ value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },{ value: "west-bengal", label: "West Bengal" },
  { value: "andaman-and-nicobar-islands", label: "Andaman and Nicobar Islands" },
  { value: "chandigarh", label: "Chandigarh" },
  { value: "dadra-and-nagar-haveli-and-daman-and-diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "delhi", label: "Delhi" },{ value: "jammu-and-kashmir", label: "Jammu and Kashmir" },
  { value: "ladakh", label: "Ladakh" },{ value: "puducherry", label: "Puducherry" },
  { value: "lakshadweep", label: "Lakshadweep" },
];

const GlassInput = ({ error, className = "", ...props }) => (
  <input
    {...props}
    className={`w-full bg-white/25 border ${error ? "border-red-400" : "border-white/50"}
      rounded-[12px] px-4 py-2.5 text-[13px] text-[#2a2118] placeholder-[#8a7e74]
      focus:outline-none focus:border-[#6e7cf8]/60 focus:bg-white/35 backdrop-blur-sm
      transition-all duration-200 ${className}`}
  />
);

const GlassDropdown = ({ open, onToggle, label, placeholder, error, children, dropdownRef }) => (
  <div className="relative" ref={dropdownRef}>
    <button type="button" onClick={onToggle}
      className={`w-full bg-white/25 border ${error ? "border-red-400" : "border-white/50"}
        rounded-[12px] px-4 py-2.5 text-[13px] text-left flex items-center justify-between
        hover:bg-white/35 focus:outline-none focus:border-[#6e7cf8]/60 backdrop-blur-sm transition-all duration-200`}>
      <span className={label ? "text-[#2a2118]" : "text-[#8a7e74]"}>{label || placeholder}</span>
      <ChevronDown className={`h-3.5 w-3.5 text-[#8a7e74] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
    {open && (
      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/80 backdrop-blur-2xl border border-white/60
        rounded-[14px] shadow-xl z-30 max-h-52 overflow-y-auto">
        {children}
      </div>
    )}
  </div>
);

const DropdownOption = ({ selected, onClick, label }) => (
  <button type="button" onClick={onClick}
    className={`w-full px-4 py-2.5 text-left text-[12.5px] flex items-center gap-2.5 transition-all
      ${selected ? "bg-[#6e7cf8]/12 text-[#4338ca]" : "text-[#2a2118] hover:bg-white/50"}`}>
    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selected ? "bg-[#6e7cf8]" : "bg-[#c8b8a8]"}`} />
    <span className="font-medium">{label}</span>
  </button>
);

export default function PersonalDetailsModal({ data, onNext, onClose }) {
  const defaults = { name:"",email:"",gender:"",dob:"",city:"",state:"",address:"",profilePicture:null,about_us:"",mobile:"",pan:"",signature:null };
  const [form, setForm] = useState({ ...defaults, ...(data || {}) });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [isDayOpen,setIsDayOpen] = useState(false);
  const [isMonthOpen,setIsMonthOpen] = useState(false);
  const [isYearOpen,setIsYearOpen] = useState(false);
  const [dobDate,setDobDate] = useState({ day:"",month:"",year:"" });
  const [isGenderOpen,setIsGenderOpen] = useState(false);
  const [isStateOpen,setIsStateOpen] = useState(false);

  const fileInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const genderDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);
  const dayDropdownRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);

  const DAYS = Array.from({length:31},(_,i)=>({value:i+1,label:String(i+1).padStart(2,'0')}));
  const MONTHS = Array.from({length:12},(_,i)=>({value:i+1,label:new Date(0,i).toLocaleString('default',{month:'short'})}));
  const YEARS = Array.from({length:127},(_,i)=>({value:2026-i,label:`${2026-i}`}));
  const genderOptions = [{value:"male",label:"Male"},{value:"female",label:"Female"},{value:"other",label:"Other"}];

  const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter valid email address";
    if (!form.mobile || form.mobile.length !== 10 || !/^[0-9]{10}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit mobile number";
    if (!form.pan.trim()) e.pan = "PAN number is required";
    else if (!isValidPAN(form.pan)) e.pan = "Enter valid PAN format (ABCDE1234F)";
    if (!form.state) e.state = "State is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!dobDate.day || !dobDate.month || !dobDate.year) e.dob = "Select complete date of birth";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const dobString = `${dobDate.year}-${String(dobDate.month).padStart(2,'0')}-${String(dobDate.day).padStart(2,'0')}`;
      onNext({ ...form, profileImage: form.profilePicture, dob: dobString, signature: form.signature });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5*1024*1024) { alert("File size should be less than 5MB"); return; }
    if (file) { const r = new FileReader(); r.onload=(ev)=>{setImagePreview(ev.target.result);setForm({...form,profilePicture:file});}; r.readAsDataURL(file); }
  };
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { alert("Max 2MB"); return; }
    if (!["image/png","image/jpeg","image/jpg"].includes(file.type)) { alert("PNG/JPG only"); return; }
    const r = new FileReader(); r.onload=(ev)=>{setSignaturePreview(ev.target.result);setForm({...form,signature:file});}; r.readAsDataURL(file);
  };

  useEffect(() => {
    const h = (e) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(e.target)) setIsGenderOpen(false);
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(e.target)) setIsStateOpen(false);
      if (dayDropdownRef.current && !dayDropdownRef.current.contains(e.target)) setIsDayOpen(false);
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(e.target)) setIsMonthOpen(false);
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target)) setIsYearOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

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
            <h3 className="font-['Sora'] text-[16px] font-bold text-[#2a2118]">Add New RA</h3>
            <p className="text-[11.5px] text-[#8a7e74] mt-0.5">Step 1 of 3 — Personal Details</p>
          </div>
          <button onClick={onClose}
            className="h-8 w-8 rounded-[10px] bg-white/30 border border-white/45 flex items-center justify-center hover:bg-white/45 transition-all">
            <X className="h-4 w-4 text-[#5a4e44]" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Profile + Signature */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-2">
              <span className={labelClass}>Profile Photo</span>
              <div className="relative group">
                <div className="w-24 h-24 rounded-[18px] border-2 border-white/50 bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-lg">
                  {imagePreview
                    ? <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    : <User className="h-9 w-9 text-[#8a7e74]" />}
                  <div onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[18px]">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <button onClick={() => fileInputRef.current?.click()}
                  className="mt-2 flex items-center gap-1.5 text-[11.5px] text-[#8a7e74] hover:text-[#2a2118] transition-colors mx-auto">
                  <Upload className="h-3 w-3" />{imagePreview ? "Change" : "Upload"}
                </button>
                {imagePreview && <button onClick={() => { setImagePreview(null); setForm({...form,profilePicture:null}); }}
                  className="text-[11px] text-red-400 hover:text-red-600 mx-auto block">Remove</button>}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="hidden sm:block w-px h-24 bg-white/30" />

            {/* Signature */}
            <div className="flex flex-col items-center gap-2">
              <span className={labelClass}>Signature</span>
              <div onClick={() => signatureInputRef.current?.click()}
                className="w-44 h-24 rounded-[16px] border-2 border-dashed border-white/50 hover:border-[#6e7cf8]/50
                  bg-white/15 hover:bg-white/25 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group">
                {signaturePreview
                  ? <><img src={signaturePreview} alt="Signature" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[16px]">
                        <Camera className="h-5 w-5 text-white" />
                      </div></>
                  : <><FileSignature className="h-7 w-7 text-[#8a7e74] mb-1" />
                      <span className="text-[11px] text-[#8a7e74]">Click to upload</span>
                      <span className="text-[10px] text-[#8a7e74]">PNG/JPG, max 2MB</span></>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => signatureInputRef.current?.click()}
                  className="flex items-center gap-1 text-[11.5px] text-[#8a7e74] hover:text-[#2a2118] transition-colors">
                  <Upload className="h-3 w-3" />{signaturePreview ? "Change" : "Upload"}
                </button>
                {signaturePreview && <button onClick={() => { setSignaturePreview(null); setForm({...form,signature:null}); }}
                  className="text-[11px] text-red-400 hover:text-red-600">Remove</button>}
              </div>
              <input type="file" ref={signatureInputRef} onChange={handleSignatureUpload} accept="image/png,image/jpeg,image/jpg" className="hidden" />
            </div>
          </div>

          {/* Row 1: Name, Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name (As Per PAN) <span className="text-red-400 normal-case">*</span></label>
              <GlassInput type="text" placeholder="Enter full name" value={form.name}
                onChange={(e) => setForm({...form,name:e.target.value})} error={errors.name} />
              {errors.name && <p className={errorClass}>{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Mobile Number <span className="text-red-400 normal-case">*</span></label>
              <GlassInput type="tel" inputMode="numeric" placeholder="10-digit number" value={form.mobile} maxLength="10"
                onChange={(e) => setForm({...form,mobile:e.target.value})} error={errors.mobile} />
              {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
            </div>
          </div>

          {/* Row 2: PAN, Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>PAN Number <span className="text-red-400 normal-case">*</span></label>
              <GlassInput type="text" placeholder="ABCDE1234F" value={form.pan} maxLength="10"
                onChange={(e) => setForm({...form,pan:e.target.value.toUpperCase()})} error={errors.pan} />
              {errors.pan && <p className={errorClass}>{errors.pan}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Address <span className="text-red-400 normal-case">*</span></label>
              <GlassInput type="email" placeholder="Enter email" value={form.email}
                onChange={(e) => setForm({...form,email:e.target.value})} error={errors.email} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>

          {/* Row 3: Gender & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Gender</label>
              <GlassDropdown open={isGenderOpen} onToggle={() => setIsGenderOpen(!isGenderOpen)}
                label={genderOptions.find(o=>o.value===form.gender)?.label} placeholder="Select Gender" dropdownRef={genderDropdownRef}>
                {genderOptions.map(o => <DropdownOption key={o.value} selected={form.gender===o.value}
                  onClick={() => { setForm({...form,gender:o.value}); setIsGenderOpen(false); }} label={o.label} />)}
              </GlassDropdown>
            </div>
            <div>
              <label className={labelClass}>Date of Birth <span className="text-red-400 normal-case">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {/* Day */}
                <div className="relative" ref={dayDropdownRef}>
                  <button onClick={() => setIsDayOpen(!isDayOpen)}
                    className={`w-full bg-white/25 border ${errors.dob ? "border-red-400" : "border-white/50"} rounded-[12px] px-3 py-2.5 text-[13px] text-left flex items-center justify-between backdrop-blur-sm hover:bg-white/35 transition-all`}>
                    <span className={dobDate.day ? "text-[#2a2118]" : "text-[#8a7e74]"}>{dobDate.day ? String(dobDate.day).padStart(2,'0') : "DD"}</span>
                    <ChevronDown className={`h-3 w-3 text-[#8a7e74] transition-transform ${isDayOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isDayOpen && <div className="absolute top-full left-0 right-0 mt-1 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[12px] shadow-xl z-30 max-h-44 overflow-y-auto min-w-[60px]">
                    {DAYS.map(d => <button key={d.value} onClick={() => { setDobDate({...dobDate,day:d.value}); setIsDayOpen(false); }}
                      className={`w-full px-3 py-1.5 text-left text-[12px] hover:bg-white/50 ${dobDate.day===d.value ? "bg-[#6e7cf8]/15 text-[#4338ca]" : "text-[#2a2118]"}`}>{d.label}</button>)}
                  </div>}
                </div>
                {/* Month */}
                <div className="relative" ref={monthDropdownRef}>
                  <button onClick={() => setIsMonthOpen(!isMonthOpen)}
                    className={`w-full bg-white/25 border ${errors.dob ? "border-red-400" : "border-white/50"} rounded-[12px] px-3 py-2.5 text-[13px] text-left flex items-center justify-between backdrop-blur-sm hover:bg-white/35 transition-all`}>
                    <span className={dobDate.month ? "text-[#2a2118]" : "text-[#8a7e74]"}>{dobDate.month ? MONTHS.find(m=>m.value===dobDate.month)?.label : "MM"}</span>
                    <ChevronDown className={`h-3 w-3 text-[#8a7e74] transition-transform ${isMonthOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMonthOpen && <div className="absolute top-full left-0 right-0 mt-1 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[12px] shadow-xl z-30 max-h-44 overflow-y-auto min-w-[60px]">
                    {MONTHS.map(m => <button key={m.value} onClick={() => { setDobDate({...dobDate,month:m.value}); setIsMonthOpen(false); }}
                      className={`w-full px-3 py-1.5 text-left text-[12px] hover:bg-white/50 ${dobDate.month===m.value ? "bg-[#6e7cf8]/15 text-[#4338ca]" : "text-[#2a2118]"}`}>{m.label}</button>)}
                  </div>}
                </div>
                {/* Year */}
                <div className="relative" ref={yearDropdownRef}>
                  <button onClick={() => setIsYearOpen(!isYearOpen)}
                    className={`w-full bg-white/25 border ${errors.dob ? "border-red-400" : "border-white/50"} rounded-[12px] px-3 py-2.5 text-[13px] text-left flex items-center justify-between backdrop-blur-sm hover:bg-white/35 transition-all`}>
                    <span className={dobDate.year ? "text-[#2a2118]" : "text-[#8a7e74]"}>{dobDate.year || "YY"}</span>
                    <ChevronDown className={`h-3 w-3 text-[#8a7e74] transition-transform ${isYearOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isYearOpen && <div className="absolute top-full left-0 right-0 mt-1 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[12px] shadow-xl z-30 max-h-44 overflow-y-auto min-w-[70px]">
                    {YEARS.slice(0,60).map(y => <button key={y.value} onClick={() => { setDobDate({...dobDate,year:y.value}); setIsYearOpen(false); }}
                      className={`w-full px-3 py-1.5 text-left text-[12px] hover:bg-white/50 ${dobDate.year===y.value ? "bg-[#6e7cf8]/15 text-[#4338ca]" : "text-[#2a2118]"}`}>{y.label}</button>)}
                  </div>}
                </div>
              </div>
              {errors.dob && <p className={errorClass}>{errors.dob}</p>}
            </div>
          </div>

          {/* Row 4: City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <GlassInput type="text" placeholder="Enter city" value={form.city}
                onChange={(e) => setForm({...form,city:e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>State <span className="text-red-400 normal-case">*</span></label>
              <GlassDropdown open={isStateOpen} onToggle={() => setIsStateOpen(!isStateOpen)}
                label={INDIAN_STATES.find(s=>s.value===form.state)?.label} placeholder="Select State"
                error={errors.state} dropdownRef={stateDropdownRef}>
                {INDIAN_STATES.map(s => <DropdownOption key={s.value} selected={form.state===s.value}
                  onClick={() => { setForm({...form,state:s.value}); setIsStateOpen(false); }} label={s.label} />)}
              </GlassDropdown>
              {errors.state && <p className={errorClass}>{errors.state}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>Address <span className="text-red-400 normal-case">*</span></label>
            <GlassInput type="text" placeholder="Enter complete address" value={form.address}
              onChange={(e) => setForm({...form,address:e.target.value})} error={errors.address} />
            {errors.address && <p className={errorClass}>{errors.address}</p>}
          </div>

          {/* About */}
          <div>
            <label className={labelClass}>About</label>
            <GlassInput type="text" placeholder="Short bio or description" value={form.about_us}
              onChange={(e) => setForm({...form,about_us:e.target.value})} />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/20 backdrop-blur-xl border-t border-white/30 px-6 py-4 flex justify-end gap-3 rounded-b-[24px]">
          <button onClick={onClose}
            className="px-6 py-2.5 rounded-[12px] bg-white/25 border border-white/45 text-[13px] text-[#5a4e44] font-medium hover:bg-white/35 transition-all">
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
  );
}