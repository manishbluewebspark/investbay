// import React, { useState, useRef, useEffect } from "react";
// import { X, ChevronDown, Camera, Upload, User } from "lucide-react";

// const INDIAN_STATES = [
//   { value: "andhra-pradesh", label: "Andhra Pradesh" },
//   { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
//   { value: "assam", label: "Assam" },
//   { value: "bihar", label: "Bihar" },
//   { value: "chhattisgarh", label: "Chhattisgarh" },
//   { value: "goa", label: "Goa" },
//   { value: "gujarat", label: "Gujarat" },
//   { value: "haryana", label: "Haryana" },
//   { value: "himachal-pradesh", label: "Himachal Pradesh" },
//   { value: "jharkhand", label: "Jharkhand" },
//   { value: "karnataka", label: "Karnataka" },
//   { value: "kerala", label: "Kerala" },
//   { value: "madhya-pradesh", label: "Madhya Pradesh" },
//   { value: "maharashtra", label: "Maharashtra" },
//   { value: "manipur", label: "Manipur" },
//   { value: "meghalaya", label: "Meghalaya" },
//   { value: "mizoram", label: "Mizoram" },
//   { value: "nagaland", label: "Nagaland" },
//   { value: "odisha", label: "Odisha" },
//   { value: "punjab", label: "Punjab" },
//   { value: "rajasthan", label: "Rajasthan" },
//   { value: "sikkim", label: "Sikkim" },
//   { value: "tamil-nadu", label: "Tamil Nadu" },
//   { value: "telangana", label: "Telangana" },
//   { value: "tripura", label: "Tripura" },
//   { value: "uttar-pradesh", label: "Uttar Pradesh" },
//   { value: "uttarakhand", label: "Uttarakhand" },
//   { value: "west-bengal", label: "West Bengal" },
//   { value: "andaman-and-nicobar-islands", label: "Andaman and Nicobar Islands" },
//   { value: "chandigarh", label: "Chandigarh" },
//   { value: "dadra-and-nagar-haveli-and-daman-and-diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
//   { value: "delhi", label: "Delhi" },
//   { value: "jammu-and-kashmir", label: "Jammu and Kashmir" },
//   { value: "ladakh", label: "Ladakh" },
//   { value: "puducherry", label: "Puducherry" },
//   { value: "lakshadweep", label: "Lakshadweep" }
// ];

// export default function PersonalDetailsModal({ data, onNext, onClose }) {
//   const defaults = {
//     name: "", email: "", gender: "", dob: "", city: "", state: "", address: "",
//     profilePicture: null, about_us: "", mobile: "", pan: "",
//   };

//   const [form, setForm] = useState({ ...defaults, ...(data || {}) });
//   const [errors, setErrors] = useState({});
//   const [imagePreview, setImagePreview] = useState(null);
  
//   // ✅ Separate DOB dropdown states
//   const [isDayOpen, setIsDayOpen] = useState(false);
//   const [isMonthOpen, setIsMonthOpen] = useState(false);
//   const [isYearOpen, setIsYearOpen] = useState(false);
//   const [dobDate, setDobDate] = useState({ day: "", month: "", year: "" });
  
//   // ✅ Existing dropdown states
//   const [isGenderOpen, setIsGenderOpen] = useState(false);
//   const [isStateOpen, setIsStateOpen] = useState(false);

//   const fileInputRef = useRef(null);
//   const genderDropdownRef = useRef(null);
//   const stateDropdownRef = useRef(null);
//   const dayDropdownRef = useRef(null);
//   const monthDropdownRef = useRef(null);
//   const yearDropdownRef = useRef(null);

//   // ✅ PAN Validation
//   const isValidPAN = (pan) => {
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return panRegex.test(pan);
//   };

//   // ✅ Complete Validation
//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!form.name.trim()) newErrors.name = "Full name is required";


//   if (!form.email.trim()) {
//     newErrors.email = "Email is required";
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//     newErrors.email = "Enter valid email address";
//   }



//     if (!form.mobile || form.mobile.length !== 10 || !/^[0-9]{10}$/.test(form.mobile)) {
//       newErrors.mobile = "Enter valid 10-digit mobile number";
//     }
//     if (!form.pan.trim()) {
//       newErrors.pan = "PAN number is required";
//     } else if (!isValidPAN(form.pan)) {
//       newErrors.pan = "Enter valid PAN format (ABCDE1234F)";
//     }
//     if (!form.state) newErrors.state = "State is required";
//     if (!form.address.trim()) newErrors.address = "Address is required";
    
//     // ✅ DOB Validation
//     if (!dobDate.day || !dobDate.month || !dobDate.year) {
//       newErrors.dob = "Select complete date of birth";
//     } else {
//       const dob = new Date(dobDate.year, dobDate.month - 1, dobDate.day);
//       const today = new Date();
//       const age = today.getFullYear() - dob.getFullYear();
//       if (age < 18 || (age === 18 && today < new Date(dobDate.year, dobDate.month - 1, dobDate.day))) {
//         newErrors.dob = "Age must be 18+";
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateForm()) {
//       const dobString = `${dobDate.year}-${String(dobDate.month).padStart(2, '0')}-${String(dobDate.day).padStart(2, '0')}`;
//       onNext({ ...form, profileImage: form.profilePicture, dob: dobString });
//     }
//   };

//   // ✅ DOB Data
//   const DAYS = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: String(i + 1).padStart(2, '0') }));
//   const MONTHS = Array.from({ length: 12 }, (_, i) => ({
//     value: i + 1, 
//     label: new Date(0, i).toLocaleString('default', { month: 'short' })
//   }));

  
//  const YEARS = Array.from({ length: 127 }, (_, i) => ({
//   value: 2026 - i, label: `${2026 - i}`
// }));

//   // ✅ DOB Handlers
//   const handleDaySelect = (day) => {
//     setDobDate({ ...dobDate, day });
//     setIsDayOpen(false);
//   };
//   const handleMonthSelect = (month) => {
//     setDobDate({ ...dobDate, month });
//     setIsMonthOpen(false);
//   };
//   const handleYearSelect = (year) => {
//     setDobDate({ ...dobDate, year });
//     setIsYearOpen(false);
//   };

//   // ✅ Image handlers
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.size > 5 * 1024 * 1024) {
//       alert("File size should be less than 5MB");
//       return;
//     }
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//         setForm({ ...form, profilePicture: file });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const triggerFileInput = () => fileInputRef.current?.click();
//   const removeImage = () => {
//     setImagePreview(null);
//     setForm({ ...form, profilePicture: null });
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // ✅ Gender handlers
//   const toggleGenderDropdown = () => setIsGenderOpen(!isGenderOpen);
//   const handleGenderSelect = (gender) => {
//     setForm({ ...form, gender });
//     setIsGenderOpen(false);
//   };
//   const genderOptions = [
//     { value: "male", label: "Male" },
//     { value: "female", label: "Female" },
//     { value: "other", label: "Other" },
//   ];
//   const getGenderLabel = (value) => {
//     const option = genderOptions.find((opt) => opt.value === value);
//     return option ? option.label : "Select Gender";
//   };

//   // ✅ State handlers
//   const toggleStateDropdown = () => setIsStateOpen(!isStateOpen);
//   const handleStateSelect = (stateValue) => {
//     setForm({ ...form, state: stateValue });
//     setIsStateOpen(false);
//   };
//   const getStateLabel = (value) => {
//     const state = INDIAN_STATES.find((s) => s.value === value);
//     return state ? state.label : "Select State";
//   };

//   // ✅ Outside click handler
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
//         setIsGenderOpen(false);
//       }
//       if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
//         setIsStateOpen(false);
//       }
//       if (dayDropdownRef.current && !dayDropdownRef.current.contains(event.target)) {
//         setIsDayOpen(false);
//       }
//       if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
//         setIsMonthOpen(false);
//       }
//       if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
//         setIsYearOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative mx-4 max-h-[90vh] overflow-y-auto 
//         [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
//         <button
//           onClick={onClose}
//           className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-all duration-200 hover:scale-105 z-10"
//         >
//           <X className="h-5 w-5" />
//         </button>

//         <div className="mb-2">
//           <h3 className="text-3xl font-bold text-gray-900 mb-2">Add New RA</h3>
//           <p className="text-gray-600">Fill in the personal details below</p>
//         </div>

//         <hr className="border-t border-gray-200 mb-8" />

//         {/* Profile Picture */}
//         <div className="flex flex-col items-center mb-8">
//           <div className="relative group">
//             <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
//               {imagePreview ? (
//                 <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
//               ) : (
//                 <User className="h-12 w-12 text-gray-400" />
//               )}
//               <div
//                 className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl cursor-pointer"
//                 onClick={triggerFileInput}
//               >
//                 <Camera className="h-8 w-8 text-white" />
//               </div>
//             </div>
//             <button
//               onClick={triggerFileInput}
//               className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 mx-auto"
//             >
//               <Upload className="h-4 w-4" />
//               {imagePreview ? "Change Photo" : "Upload Photo"}
//             </button>
//             <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
//           </div>
//         </div>

//         <div className="space-y-6">
//           {/* Row 1: Name, Mobile, PAN, Email */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-gray-700 mb-1 block">
//                 Full Name As Per PAN Card <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your full name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
//               />
//               {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-gray-700 mb-1 block">
//                 Mobile Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 inputMode="numeric"
//                 pattern="[0-9]*"
//                 placeholder="Enter mobile number"
//                 value={form.mobile}
//                 onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//                 className={`w-full border ${errors.mobile ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
//                 maxLength="10"
//               />
//               {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-gray-700 mb-1 block">
//                 PAN Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Valid PAN( ABCDE1234F )"
//                 value={form.pan}
//                 onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
//                 className={`w-full border ${errors.pan ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
//                 maxLength="10"
//               />
//               {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-gray-700 mb-1 block">
//                 Email Address <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
//               />
//               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//             </div>
//           </div>

//           {/* Row 2: Gender & DOB (3 SEPARATE DROPDOWNS) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Gender */}
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-gray-700 mb-1 block">Gender</label>
//               <div className="relative" ref={genderDropdownRef}>
//                 <button
//                   type="button"
//                   onClick={toggleGenderDropdown}
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm text-left flex items-center justify-between hover:border-gray-400"
//                 >
//                   <span className={form.gender ? "text-gray-900" : "text-gray-400"}>
//                     {getGenderLabel(form.gender)}
//                   </span>
//                   <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isGenderOpen ? "rotate-180" : ""}`} />
//                 </button>
//                 {isGenderOpen && (
//                   <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
//                     {genderOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         type="button"
//                         onClick={() => handleGenderSelect(option.value)}
//                         className={`w-full px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 flex items-center gap-3 ${form.gender === option.value ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500" : "text-gray-700"}`}
//                       >
//                         <div className={`w-2 h-2 rounded-full ${form.gender === option.value ? "bg-blue-500" : "bg-gray-300"}`} />
//                         <span className="font-medium">{option.label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* ✅ 3 SEPARATE DOB DROPDOWNS */}
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-gray-700 mb-1 block">
//                 Date of Birth <span className="text-red-500">*</span>
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 {/* Day Dropdown */}
//                 <div className="relative" ref={dayDropdownRef}>
//                   <button
//                     onClick={() => setIsDayOpen(!isDayOpen)}
//                     className={`border ${errors.dob ? "border-red-500" : "border-gray-300"} rounded-lg px-9 py-3 text-xs focus:outline-none bg-white/50 backdrop-blur-sm text-left hover:border-gray-400`}
//                   >
//                     <span className={dobDate.day ? "text-gray-900 font-medium" : "text-gray-400"}>
//                       {dobDate.day || "DD"}
//                     </span>
//                     <ChevronDown className={`h-3 w-3 absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isDayOpen ? "rotate-180" : ""}`} />
//                   </button>
//                   {isDayOpen && (
//                     <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto w-20">
//                       {DAYS.map((day) => (
//                         <button
//                           key={day.value}
//                           onClick={() => handleDaySelect(day.value)}
//                           className={`w-full px-2 py-1 text-left text-xs hover:bg-gray-50 ${dobDate.day === day.value ? "bg-blue-500 text-white" : "text-gray-700"}`}
//                         >
//                           {day.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Month Dropdown */}
//                 <div className="relative" ref={monthDropdownRef}>
//                   <button
//                     onClick={() => setIsMonthOpen(!isMonthOpen)}
//                     className={`border ${errors.dob ? "border-red-500" : "border-gray-300"} rounded-lg px-8 py-3 text-xs focus:outline-none bg-white/50 backdrop-blur-sm text-left hover:border-gray-400`}
//                   >
//                     <span className={dobDate.month ? "text-gray-900 font-medium" : "text-gray-400"}>
//                       {dobDate.month ? MONTHS.find(m => m.value === dobDate.month)?.label : "MM"}
//                     </span>
//                     <ChevronDown className={`h-3 w-3 absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isMonthOpen ? "rotate-180" : ""}`} />
//                   </button>
//                   {isMonthOpen && (
//                     <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto w-20">
//                       {MONTHS.map((month) => (
//                         <button
//                           key={month.value}
//                           onClick={() => handleMonthSelect(month.value)}
//                           className={`w-full px-2 py-1 text-left text-xs hover:bg-gray-50 ${dobDate.month === month.value ? "bg-blue-500 text-white" : "text-gray-700"}`}
//                         >
//                           {month.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Year Dropdown */}
//                 <div className="relative" ref={yearDropdownRef}>
//                   <button
//                     onClick={() => setIsYearOpen(!isYearOpen)}
//                     className={`border ${errors.dob ? "border-red-500" : "border-gray-300"} rounded-lg px-8 py-3 text-xs focus:outline-none bg-white/50 backdrop-blur-sm text-left hover:border-gray-400`}
//                   >
//                     <span className={dobDate.year ? "text-gray-900 font-medium" : "text-gray-400"}>
//                       {dobDate.year || "YY"}
//                     </span>
//                     <ChevronDown className={`h-3 w-3 absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isYearOpen ? "rotate-180" : ""}`} />
//                   </button>
//                   {isYearOpen && (
//                     <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto w-20">
//                       {YEARS.slice(0, 30).map((year) => (  // Show recent 30 years
//                         <button
//                           key={year.value}
//                           onClick={() => handleYearSelect(year.value)}
//                           className={`w-full px-2 py-1 text-left text-xs hover:bg-gray-50 ${dobDate.year === year.value ? "bg-blue-500 text-white" : "text-gray-700"}`}
//                         >
//                           {year.label.slice(-2)}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {errors.dob && <p className="text-red-500 text-xs mt-1 col-span-3">{errors.dob}</p>}
//             </div>
//           </div>

//           {/* Row 3: City & State */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-gray-700 mb-1 block">City</label>
//               <input
//                 type="text"
//                 placeholder="Enter your city"
//                 value={form.city}
//                 onChange={(e) => setForm({ ...form, city: e.target.value })}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-gray-700 mb-1 block">
//                 State <span className="text-red-500">*</span>
//               </label>
//               <div className="relative" ref={stateDropdownRef}>
//                 <button
//                   type="button"
//                   onClick={toggleStateDropdown}
//                   className={`w-full border rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm text-left flex items-center justify-between hover:border-gray-400 ${errors.state ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <span className={form.state ? "text-gray-900" : "text-gray-400"}>
//                     {getStateLabel(form.state)}
//                   </span>
//                   <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isStateOpen ? "rotate-180" : ""}`} />
//                 </button>
//                 {isStateOpen && (
//                   <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
//                     {INDIAN_STATES.map((stateOption) => (
//                       <button
//                         key={stateOption.value}
//                         type="button"
//                         onClick={() => handleStateSelect(stateOption.value)}
//                         className={`w-full px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 flex items-center gap-3 ${form.state === stateOption.value ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500" : "text-gray-700"}`}
//                       >
//                         <div className={`w-2 h-2 rounded-full ${form.state === stateOption.value ? "bg-blue-500" : "bg-gray-300"}`} />
//                         <span className="font-medium">{stateOption.label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
//             </div>
//           </div>

//           {/* Address */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-700 mb-1 block">
//               Address <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter your complete address"
//               value={form.address}
//               onChange={(e) => setForm({ ...form, address: e.target.value })}
//               className={`w-full border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
//             />
//             {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
//           </div>

//           {/* About */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-gray-700 mb-1 block">About Us</label>
//             <input
//               type="text"
//               placeholder="Enter about us"
//               value={form.about_us}
//               onChange={(e) => setForm({ ...form, about_us: e.target.value })}
//               className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all duration-200 hover:shadow-sm flex-1 sm:flex-none"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleNext}
//             className="px-8 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:shadow-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] flex-1 sm:flex-none"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Camera, Upload, User, FileSignature } from "lucide-react";

const INDIAN_STATES = [
  { value: "andhra-pradesh", label: "Andhra Pradesh" },
  { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal-pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya-pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west-bengal", label: "West Bengal" },
  { value: "andaman-and-nicobar-islands", label: "Andaman and Nicobar Islands" },
  { value: "chandigarh", label: "Chandigarh" },
  { value: "dadra-and-nagar-haveli-and-daman-and-diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "delhi", label: "Delhi" },
  { value: "jammu-and-kashmir", label: "Jammu and Kashmir" },
  { value: "ladakh", label: "Ladakh" },
  { value: "puducherry", label: "Puducherry" },
  { value: "lakshadweep", label: "Lakshadweep" }
];

export default function PersonalDetailsModal({ data, onNext, onClose }) {
  const defaults = {
    name: "", email: "", gender: "", dob: "", city: "", state: "", address: "",
    profilePicture: null, about_us: "", mobile: "", pan: "",
    // ✅ NEW: signature field
    signature: null,
  };

  const [form, setForm] = useState({ ...defaults, ...(data || {}) });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ NEW: Signature state
  const [signaturePreview, setSignaturePreview] = useState(null);

  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [dobDate, setDobDate] = useState({ day: "", month: "", year: "" });

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);

  const fileInputRef = useRef(null);
  // ✅ NEW: Signature input ref
  const signatureInputRef = useRef(null);

  const genderDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);
  const dayDropdownRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);

  const isValidPAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter valid email address";
    }

    if (!form.mobile || form.mobile.length !== 10 || !/^[0-9]{10}$/.test(form.mobile)) {
      newErrors.mobile = "Enter valid 10-digit mobile number";
    }
    if (!form.pan.trim()) {
      newErrors.pan = "PAN number is required";
    } else if (!isValidPAN(form.pan)) {
      newErrors.pan = "Enter valid PAN format (ABCDE1234F)";
    }
    if (!form.state) newErrors.state = "State is required";
    if (!form.address.trim()) newErrors.address = "Address is required";

    if (!dobDate.day || !dobDate.month || !dobDate.year) {
      newErrors.dob = "Select complete date of birth";
    } else {
      const dob = new Date(dobDate.year, dobDate.month - 1, dobDate.day);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18 || (age === 18 && today < new Date(dobDate.year, dobDate.month - 1, dobDate.day))) {
        newErrors.dob = "Age must be 18+";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleNext = () => {
  //   if (validateForm()) {
  //     const dobString = `${dobDate.year}-${String(dobDate.month).padStart(2, '0')}-${String(dobDate.day).padStart(2, '0')}`;
  //     // ✅ signature bhi pass ho rahi hai onNext mein
  //     onNext({ ...form, profileImage: form.profilePicture, dob: dobString });
  //   }
  // };

  const handleNext = () => {
  if (validateForm()) {
    const dobString = `${dobDate.year}-${String(dobDate.month).padStart(2, '0')}-${String(dobDate.day).padStart(2, '0')}`;
    // Make sure signature is explicitly included
    onNext({ 
      ...form, 
      profileImage: form.profilePicture, 
      dob: dobString,
      signature: form.signature  // Explicitly include signature file
    });
  }
};

  const DAYS = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: String(i + 1).padStart(2, '0') }));
  const MONTHS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'short' })
  }));
  const YEARS = Array.from({ length: 127 }, (_, i) => ({
    value: 2026 - i, label: `${2026 - i}`
  }));

  const handleDaySelect = (day) => { setDobDate({ ...dobDate, day }); setIsDayOpen(false); };
  const handleMonthSelect = (month) => { setDobDate({ ...dobDate, month }); setIsMonthOpen(false); };
  const handleYearSelect = (year) => { setDobDate({ ...dobDate, year }); setIsYearOpen(false); };

  // Profile image handlers
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { alert("File size should be less than 5MB"); return; }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => { setImagePreview(e.target.result); setForm({ ...form, profilePicture: file }); };
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = () => fileInputRef.current?.click();
  const removeImage = () => {
    setImagePreview(null);
    setForm({ ...form, profilePicture: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ NEW: Signature handlers
  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Signature file size should be less than 2MB"); return; }
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) { alert("Only PNG or JPG allowed for signature"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSignaturePreview(e.target.result);
      setForm({ ...form, signature: file });
    };
    reader.readAsDataURL(file);
  };
  const triggerSignatureInput = () => signatureInputRef.current?.click();
  const removeSignature = () => {
    setSignaturePreview(null);
    setForm({ ...form, signature: null });
    if (signatureInputRef.current) signatureInputRef.current.value = "";
  };

  // Gender handlers
  const toggleGenderDropdown = () => setIsGenderOpen(!isGenderOpen);
  const handleGenderSelect = (gender) => { setForm({ ...form, gender }); setIsGenderOpen(false); };
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];
  const getGenderLabel = (value) => {
    const option = genderOptions.find((opt) => opt.value === value);
    return option ? option.label : "Select Gender";
  };

  // State handlers
  const toggleStateDropdown = () => setIsStateOpen(!isStateOpen);
  const handleStateSelect = (stateValue) => { setForm({ ...form, state: stateValue }); setIsStateOpen(false); };
  const getStateLabel = (value) => {
    const state = INDIAN_STATES.find((s) => s.value === value);
    return state ? state.label : "Select State";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) setIsGenderOpen(false);
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) setIsStateOpen(false);
      if (dayDropdownRef.current && !dayDropdownRef.current.contains(event.target)) setIsDayOpen(false);
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) setIsMonthOpen(false);
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) setIsYearOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative mx-4 max-h-[90vh] overflow-y-auto 
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-all duration-200 hover:scale-105 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-2">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Add New RA</h3>
          <p className="text-gray-600">Fill in the personal details below</p>
        </div>

        <hr className="border-t border-gray-200 mb-8" />

        {/* ✅ Profile Picture + Signature — side by side */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-8">

          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Profile Photo</p>
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-gray-400" />
                )}
                <div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <Camera className="h-7 w-7 text-white" />
                </div>
              </div>
              <button
                onClick={triggerFileInput}
                className="mt-3 flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors duration-200 mx-auto"
              >
                <Upload className="h-3.5 w-3.5" />
                {imagePreview ? "Change Photo" : "Upload Photo"}
              </button>
              {imagePreview && (
                <button onClick={removeImage} className="mt-1 text-xs text-red-400 hover:text-red-600 mx-auto block">
                  Remove
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-28 bg-gray-200" />

          {/* ✅ NEW: Signature Upload */}
          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Signature</p>
            <div
              onClick={triggerSignatureInput}
              className="w-48 h-28 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-500 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden relative group"
            >
              {signaturePreview ? (
                <>
                  <img
                    src={signaturePreview}
                    alt="Signature preview"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <FileSignature className="h-8 w-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Click to upload</span>
                  <span className="text-[10px] text-gray-400">PNG / JPG, max 2MB</span>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-3">
              <button
                onClick={triggerSignatureInput}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                {signaturePreview ? "Change" : "Upload Signature"}
              </button>
              {signaturePreview && (
                <button onClick={removeSignature} className="text-xs text-red-400 hover:text-red-600">
                  Remove
                </button>
              )}
            </div>
            <input
              type="file"
              ref={signatureInputRef}
              onChange={handleSignatureUpload}
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Row 1: Name, Mobile, PAN, Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Full Name As Per PAN Card <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className={`w-full border ${errors.mobile ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
                maxLength="10"
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Valid PAN( ABCDE1234F )"
                value={form.pan}
                onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                className={`w-full border ${errors.pan ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
                maxLength="10"
              />
              {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2: Gender & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Gender</label>
              <div className="relative" ref={genderDropdownRef}>
                <button
                  type="button"
                  onClick={toggleGenderDropdown}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm text-left flex items-center justify-between hover:border-gray-400"
                >
                  <span className={form.gender ? "text-gray-900" : "text-gray-400"}>{getGenderLabel(form.gender)}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isGenderOpen ? "rotate-180" : ""}`} />
                </button>
                {isGenderOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleGenderSelect(option.value)}
                        className={`w-full px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 flex items-center gap-3 ${form.gender === option.value ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500" : "text-gray-700"}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${form.gender === option.value ? "bg-blue-500" : "bg-gray-300"}`} />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Day */}
                <div className="relative" ref={dayDropdownRef}>
                  <button
                    onClick={() => setIsDayOpen(!isDayOpen)}
                    className={`border ${errors.dob ? "border-red-500" : "border-gray-300"} rounded-lg px-9 py-3 text-xs focus:outline-none bg-white/50 backdrop-blur-sm text-left hover:border-gray-400`}
                  >
                    <span className={dobDate.day ? "text-gray-900 font-medium" : "text-gray-400"}>{dobDate.day || "DD"}</span>
                    <ChevronDown className={`h-3 w-3 absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isDayOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isDayOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto w-20">
                      {DAYS.map((day) => (
                        <button key={day.value} onClick={() => handleDaySelect(day.value)}
                          className={`w-full px-2 py-1 text-left text-xs hover:bg-gray-50 ${dobDate.day === day.value ? "bg-blue-500 text-white" : "text-gray-700"}`}>
                          {day.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Month */}
                <div className="relative" ref={monthDropdownRef}>
                  <button
                    onClick={() => setIsMonthOpen(!isMonthOpen)}
                    className={`border ${errors.dob ? "border-red-500" : "border-gray-300"} rounded-lg px-8 py-3 text-xs focus:outline-none bg-white/50 backdrop-blur-sm text-left hover:border-gray-400`}
                  >
                    <span className={dobDate.month ? "text-gray-900 font-medium" : "text-gray-400"}>
                      {dobDate.month ? MONTHS.find(m => m.value === dobDate.month)?.label : "MM"}
                    </span>
                    <ChevronDown className={`h-3 w-3 absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isMonthOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMonthOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto w-20">
                      {MONTHS.map((month) => (
                        <button key={month.value} onClick={() => handleMonthSelect(month.value)}
                          className={`w-full px-2 py-1 text-left text-xs hover:bg-gray-50 ${dobDate.month === month.value ? "bg-blue-500 text-white" : "text-gray-700"}`}>
                          {month.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year */}
                <div className="relative" ref={yearDropdownRef}>
                  <button
                    onClick={() => setIsYearOpen(!isYearOpen)}
                    className={`border ${errors.dob ? "border-red-500" : "border-gray-300"} rounded-lg px-8 py-3 text-xs focus:outline-none bg-white/50 backdrop-blur-sm text-left hover:border-gray-400`}
                  >
                    <span className={dobDate.year ? "text-gray-900 font-medium" : "text-gray-400"}>{dobDate.year || "YY"}</span>
                    <ChevronDown className={`h-3 w-3 absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isYearOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isYearOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto w-20">
                      {YEARS.slice(0, 30).map((year) => (
                        <button key={year.value} onClick={() => handleYearSelect(year.value)}
                          className={`w-full px-2 py-1 text-left text-xs hover:bg-gray-50 ${dobDate.year === year.value ? "bg-blue-500 text-white" : "text-gray-700"}`}>
                          {year.label.slice(-2)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {errors.dob && <p className="text-red-500 text-xs mt-1 col-span-3">{errors.dob}</p>}
            </div>
          </div>

          {/* Row 3: City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={stateDropdownRef}>
                <button
                  type="button"
                  onClick={toggleStateDropdown}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm text-left flex items-center justify-between hover:border-gray-400 ${errors.state ? "border-red-500" : "border-gray-300"}`}
                >
                  <span className={form.state ? "text-gray-900" : "text-gray-400"}>{getStateLabel(form.state)}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isStateOpen ? "rotate-180" : ""}`} />
                </button>
                {isStateOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                    {INDIAN_STATES.map((stateOption) => (
                      <button
                        key={stateOption.value}
                        type="button"
                        onClick={() => handleStateSelect(stateOption.value)}
                        className={`w-full px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 flex items-center gap-3 ${form.state === stateOption.value ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500" : "text-gray-700"}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${form.state === stateOption.value ? "bg-blue-500" : "bg-gray-300"}`} />
                        <span className="font-medium">{stateOption.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your complete address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={`w-full border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* About */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">About Us</label>
            <input
              type="text"
              placeholder="Enter about us"
              value={form.about_us}
              onChange={(e) => setForm({ ...form, about_us: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all duration-200 hover:shadow-sm flex-1 sm:flex-none"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:shadow-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] flex-1 sm:flex-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
