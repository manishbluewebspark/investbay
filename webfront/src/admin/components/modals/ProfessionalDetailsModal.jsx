import React, { useState } from "react";
import uploadIcon from "../../../assets/upload.svg";
import { X, ChevronDown, Check } from "lucide-react";

export default function ProfessionalDetailsModal({ data, onNext, onBack, onClose }) {
  const defaults = {
    sebiNumber: "",
    specialization: "",
    education: "",
    experience: "",
    companyName: "",
    languages: [],
  };

  const [form, setForm] = useState({ ...defaults, ...(data || {}) });
  const [selectedFile, setSelectedFile] = useState(null);
  const [touched, setTouched] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "japanese", label: "Japanese" },
    { value: "chinese", label: "Chinese" },
    { value: "arabic", label: "Arabic" },
    { value: "portuguese", label: "Portuguese" },
    { value: "russian", label: "Russian" },
  ];

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleLanguageToggle = (languageValue) => {
    const currentLanguages = form.languages || [];
    const updatedLanguages = currentLanguages.includes(languageValue)
      ? currentLanguages.filter(lang => lang !== languageValue)
      : [...currentLanguages, languageValue];
    
    setForm({ ...form, languages: updatedLanguages });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleBrowseClick = () => {
    document.getElementById("fileInput").click();
  };

  const validateForm = () => {
    const requiredFields = [
      "sebiNumber",
      "specialization",
      "education",
      "experience",
      "companyName",
    ];
    return requiredFields.every((f) => form[f]?.trim()) && selectedFile && form.languages?.length > 0;
  };

  const handleNext = () => {
    setTouched(true);
    if (validateForm()) {
      onNext({ ...form, selectedFile });
    }
  };

  const isInvalid = (field) => touched && !form[field]?.trim();
  const isLanguagesInvalid = touched && (!form.languages || form.languages.length === 0);
  const isFileInvalid = touched && !selectedFile;

  const getSelectedLanguagesLabel = () => {
    if (!form.languages || form.languages.length === 0) {
      return "Select languages";
    }
    
    const selectedLabels = form.languages.map(langValue => {
      const language = languageOptions.find(opt => opt.value === langValue);
      return language ? language.label : langValue;
    });
    
    return selectedLabels.join(", ");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Professional Details</h3>
          <button onClick={onClose}>
            <X className="w-7 h-7 text-gray-400 hover:text-gray-700 bg-gray-300 rounded-md p-1" />
          </button>
        </div>

        <hr className="border-t border-gray-300 -mx-6 mb-3" />

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                SEBI Registration Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter number"
                value={form.sebiNumber}
                onChange={(e) => handleInputChange("sebiNumber", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isInvalid("sebiNumber") ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Specialization<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter specialization"
                value={form.specialization}
                onChange={(e) => handleInputChange("specialization", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isInvalid("specialization") ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Education / Certification<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter education"
              value={form.education}
              onChange={(e) => handleInputChange("education", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isInvalid("education") ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Experience (in years)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter experience"
                value={form.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isInvalid("experience") ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Current Firm / Company Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                value={form.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isInvalid("companyName") ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Enhanced Language Selector */}
          <div className="relative">
            <label className="block text-md font-medium text-gray-700 mb-1">
              Languages<span className="text-red-500">*</span>
            </label>
            <div
              className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none cursor-pointer transition-all duration-200 ${
                isLanguagesInvalid 
                  ? "border-red-500" 
                  : isLanguageDropdownOpen 
                    ? "border-blue-500 ring-2 ring-blue-200" 
                    : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <div className="flex justify-between items-center">
                <span className={`${!form.languages?.length ? "text-gray-400" : "text-gray-700"}`}>
                  {getSelectedLanguagesLabel()}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`} 
                />
              </div>
            </div>

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {languageOptions.map((language) => {
                    const isSelected = form.languages?.includes(language.value);
                    return (
                      <div
                        key={language.value}
                        className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? "bg-blue-50 text-blue-700"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() => handleLanguageToggle(language.value)}
                      >
                        <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${
                          isSelected 
                            ? "bg-blue-500 border-blue-500" 
                            : "border-gray-300"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm">{language.label}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Selected count and clear option */}
                <div className="border-t border-gray-100 p-2 bg-gray-50">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{form.languages?.length || 0} selected</span>
                    {form.languages?.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({ ...form, languages: [] });
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {isLanguagesInvalid && (
              <p className="text-red-500 text-sm mt-1">Please select at least one language</p>
            )}
          </div>

          {/* Upload Section */}
          <div
            className={`border-2 border-dashed p-2 rounded-lg transition-colors ${
              isFileInvalid ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <label className="flex flex-col items-center justify-center w-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg py-4">
              <div className="flex flex-col items-center justify-center">
                <img src={uploadIcon} alt="Upload" className="mb-2" />
                <p className="text-md text-gray-600">
                  <span className="font-semibold">Upload Documents</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Click to upload or drag and drop</p>
              </div>
              <input id="fileInput" type="file" className="hidden" onChange={handleFileSelect} />
            </label>

            {selectedFile && (
              <div className="mt-3 text-center">
                <p className="text-gray-700 text-sm">
                  Selected file: <span className="font-medium text-green-600">{selectedFile.name}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 text-sm hover:text-red-700 mt-1"
                >
                  Remove file
                </button>
              </div>
            )}

            <div className="text-center my-3">
              <span className="text-gray-400 text-md bg-white px-2">OR</span>
            </div>

            <button
              type="button"
              onClick={handleBrowseClick}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Browse Files
            </button>
            
            {isFileInvalid && (
              <p className="text-red-500 text-sm mt-2 text-center">Please upload a document</p>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!validateForm()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}