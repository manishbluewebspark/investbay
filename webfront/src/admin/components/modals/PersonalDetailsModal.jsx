import React, { useState, useRef } from "react";
import { X, ChevronDown, Camera, Upload, User, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PersonalDetailsModal({ data, onNext, onClose }) {
  const defaults = {
    name: "",
    email: "",
    gender: "",
    dob: "",
    city: "",
    state: "",
    address: "",
    profilePicture: null,
  };

  const [form, setForm] = useState({ ...defaults, ...(data || {}) });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [startDate, setStartDate] = useState(form.dob ? new Date(form.dob) : null);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const fileInputRef = useRef(null);
  const genderDropdownRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Pass profileImage correctly to next modal
  const handleNext = () => {
    if (validateForm()) {
      onNext({ ...form, profileImage: form.profilePicture });
    }
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setForm({ ...form, dob: formattedDate });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setForm({ ...form, profilePicture: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm({ ...form, profilePicture: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleGenderDropdown = () => setIsGenderOpen(!isGenderOpen);
  const handleGenderSelect = (gender) => {
    setForm({ ...form, gender });
    setIsGenderOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CustomDateInput = React.forwardRef(({ value, onClick, onChange }, ref) => (
    <div className="w-full relative">
      <input
        type="text"
        value={value}
        onClick={onClick}
        onChange={onChange}
        ref={ref}
        placeholder="Select date of birth"
        className="w-full border border-gray-300 rounded-xl pl-4 pr-20 py-3 focus:outline-none bg-white/50 backdrop-blur-sm text-left cursor-pointer"
        readOnly
      />
      <Calendar className="absolute right-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  ));

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const getGenderLabel = (value) => {
    const option = genderOptions.find((opt) => opt.value === value);
    return option ? option.label : "Select Gender";
  };

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

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}

              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl cursor-pointer"
                onClick={triggerFileInput}
              >
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>

            <button
              onClick={triggerFileInput}
              className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 mx-auto"
            >
              <Upload className="h-4 w-4" />
              {imagePreview ? "Change Photo" : "Upload Photo"}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

<div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-xl px-4 py-3 focus:outline-none  bg-white/50 backdrop-blur-sm`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-xl px-4 py-3 focus:outline-none  bg-white/50 backdrop-blur-sm`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom Gender Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Gender
              </label>
              <div className="relative" ref={genderDropdownRef}>
                {/* Dropdown Trigger */}
                <button
                  type="button"
                  onClick={toggleGenderDropdown}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none bg-white/50 backdrop-blur-sm text-left flex items-center justify-between hover:border-gray-400"
                >
                  <span className={form.gender ? "text-gray-900" : "text-gray-400"}>
                    {getGenderLabel(form.gender)}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isGenderOpen ? "rotate-180" : ""
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isGenderOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleGenderSelect(option.value)}
                        className={`w-full px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 flex items-center gap-3 ${
                          form.gender === option.value 
                            ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500" 
                            : "text-gray-700"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          form.gender === option.value ? "bg-blue-500" : "bg-gray-300"
                        }`} />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Date of Birth - Fixed Full Width */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Date of Birth
              </label>
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                customInput={<CustomDateInput />}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                maxDate={new Date()}
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                placeholderText="Select date of birth"
                dateFormat="MMMM d, yyyy"
                popperClassName="z-50"
                popperPlacement="bottom-start"
                className="w-full"
              />
            </div>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                City
              </label>
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
                State
              </label>
              <input
                type="text"
                placeholder="Enter your state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none  bg-white/50 backdrop-blur-sm"
              />
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
              className={`w-full border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-xl px-4 py-3 focus:outline-none  bg-white/50 backdrop-blur-sm`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                {errors.address}
              </p>
            )}
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
