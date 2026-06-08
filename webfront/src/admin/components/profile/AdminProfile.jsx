import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Save, X, Phone, CreditCard, CheckCircle } from "lucide-react";

export default function AdminProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    
    // Verification states - Phone & PAN both OTP
    const [phoneVerification, setPhoneVerification] = useState({
        isVerifying: false,
        otpSent: false,
        otp: ""
    });
    const [panVerification, setPanVerification] = useState({
        isVerifying: false,
        otpSent: false,
        otp: ""
    });

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?.id;

        if (userId) {
            fetchUser(userId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (id) => {
        try {
            const res = await axios.get(`${apiUrl}/users/${id}`);
            const userData = res.data.data || res.data;
            
            setUser(userData);

            const formattedData = {
                id: userData.id,
                name: userData.name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                gender: userData.gender 
                    ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
                    : "",
                dob: userData.dob 
                    ? new Date(userData.dob).toISOString().split("T")[0]
                    : "",
                pan: userData.pan || "",
                state: userData.state || "",
                isPhoneVerified: userData.isPhoneVerified || false,
                isPANVerified: userData.isPANVerified || false
            };

            setFormData(formattedData);
        } catch (error) {
            console.error("Fetch user error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    // ================= PHONE VERIFICATION =================
    const handleSendPhoneOTP = async () => {
        if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
            setErrors({ ...errors, phone: "Please enter a valid 10-digit phone number (starts with 6-9)" });
            return;
        }

        try {
            setPhoneVerification({ ...phoneVerification, isVerifying: true });
            
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${apiUrl}/verification/phone/send-otp`,
                { phone: formData.phone },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setPhoneVerification({
                    isVerifying: false,
                    otpSent: true,
                    otp: ""
                });
                setSuccessMessage("OTP sent to your phone number");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Send Phone OTP error:", error);
            setErrors({ ...errors, phone: error.response?.data?.message || "Failed to send OTP" });
            setPhoneVerification({ ...phoneVerification, isVerifying: false });
        }
    };

    const handleVerifyPhoneOTP = async () => {
        if (!phoneVerification.otp || phoneVerification.otp.length !== 6) {
            setErrors({ ...errors, phone: "Please enter 6-digit OTP" });
            return;
        }

        try {
            setPhoneVerification({ ...phoneVerification, isVerifying: true });
            
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${apiUrl}/verification/phone/verify-otp`,
                { 
                    phone: formData.phone,
                    otp: phoneVerification.otp 
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setUser(prev => ({
                    ...prev,
                    isPhoneVerified: true,
                    phone: response.data.data?.phone || formData.phone
                }));
                
                setFormData(prev => ({
                    ...prev,
                    isPhoneVerified: true,
                    phone: response.data.data?.phone || formData.phone
                }));

                setPhoneVerification({
                    isVerifying: false,
                    otpSent: false,
                    otp: ""
                });

                setSuccessMessage("Phone number verified successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Verify Phone OTP error:", error);
            setErrors({ ...errors, phone: error.response?.data?.message || "Invalid OTP" });
            setPhoneVerification({ ...phoneVerification, isVerifying: false });
        }
    };

    // ================= PAN VERIFICATION (NEW OTP SYSTEM) =================
    const handleSendPANOTP = async () => {
        if (!formData.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
            setErrors({ ...errors, pan: "Please enter a valid PAN number first (ABCDE1234F)" });
            return;
        }

        try {
            setPanVerification({ ...panVerification, isVerifying: true });
            
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${apiUrl}/verification/pan/send-otp`,
                { pan: formData.pan.toUpperCase() },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setPanVerification({
                    isVerifying: false,
                    otpSent: true,
                    otp: ""
                });
                setSuccessMessage("PAN OTP sent to your registered email");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Send PAN OTP error:", error);
            setErrors({ ...errors, pan: error.response?.data?.message || "Failed to send PAN OTP" });
            setPanVerification({ ...panVerification, isVerifying: false });
        }
    };

    const handleVerifyPANOTP = async () => {
        if (!panVerification.otp || panVerification.otp.length !== 6) {
            setErrors({ ...errors, pan: "Please enter 6-digit OTP" });
            return;
        }

        try {
            setPanVerification({ ...panVerification, isVerifying: true });
            
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${apiUrl}/verification/pan/verify-otp`,
                { 
                    pan: formData.pan.toUpperCase(),
                    otp: panVerification.otp 
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setUser(prev => ({
                    ...prev,
                    isPANVerified: true
                }));
                
                setFormData(prev => ({
                    ...prev,
                    isPANVerified: true
                }));

                setPanVerification({
                    isVerifying: false,
                    otpSent: false,
                    otp: ""
                });

                setSuccessMessage("PAN verified successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Verify PAN OTP error:", error);
            setErrors({ ...errors, pan: error.response?.data?.message || "Invalid OTP" });
            setPanVerification({ ...panVerification, isVerifying: false });
        }
    };

    const handleSave = async () => {
        console.log("Save profile:", formData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
        setPhoneVerification({ isVerifying: false, otpSent: false, otp: "" });
        setPanVerification({ isVerifying: false, otpSent: false, otp: "" });
    };

    // ================= REUSABLE InputField with OTP =================
    const InputField = ({ label, name, type = "text", placeholder, required = false, verificationType = null }) => {
        const isVerified = formData[`is${name.charAt(0).toUpperCase() + name.slice(1)}Verified`];
        const verificationState = name === 'phone' ? phoneVerification : panVerification;
        const isPhoneField = name === 'phone';
        const isPanField = name === 'pan';

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="block text-xs font-semibold tracking-wide uppercase text-white/70">
                        {label} {required && <span className="text-red-400">*</span>}
                    </label>
                    {isVerified && (
                        <span className="flex items-center text-xs font-medium tracking-wide uppercase text-emerald-300">
                            <CheckCircle size={12} className="mr-1" />
                            Verified
                        </span>
                    )}
                </div>
                
                <div className="flex space-x-2">
                    <input
                        type={type}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`flex-1 px-4 py-3 rounded-2xl border transition-all duration-300 placeholder-white/30 text-white outline-none text-sm font-light ${
                            errors[name]
                                ? "border-red-400/50 bg-red-500/10 focus:ring-2 focus:ring-red-400/20"
                                : "border-white/10 bg-white/5 focus:bg-white/10 focus:border-white/20 focus:ring-4 focus:ring-white/5"
                        } ${
                            !isEditing ? "opacity-50 cursor-not-allowed bg-black/5 border-white/5" : ""
                        }`}
                        placeholder={placeholder}
                    />
                    
                    {isEditing && !isVerified && (isPhoneField || isPanField) && (
                        <button
                            type="button"
                            onClick={isPhoneField ? handleSendPhoneOTP : handleSendPANOTP}
                            disabled={verificationState.isVerifying}
                            className="px-4 py-3 bg-slate-500/30 hover:bg-slate-500/40 border border-white/10 text-white font-medium text-xs tracking-wide uppercase rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-98 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.1)]"
                        >
                            <span>{verificationState.otpSent ? "Resend" : "Send OTP"}</span>
                        </button>
                    )}
                </div>

                {/* OTP Input - Nested within Glass UI layout */}
                {(isPhoneField || isPanField) && verificationState.otpSent && isEditing && (
                    <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        <p className="text-xs font-light text-white/80 mb-3">
                            Enter OTP sent to {isPhoneField ? `phone ${formData.phone}` : `email for PAN ${formData.pan}`}
                        </p>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                maxLength="6"
                                value={verificationState.otp}
                                onChange={(e) => {
                                    const newVerificationState = isPhoneField ? 
                                        { ...phoneVerification, otp: e.target.value.replace(/\D/g, '').slice(0, 6) } :
                                        { ...panVerification, otp: e.target.value.replace(/\D/g, '').slice(0, 6) };
                                    
                                    if (isPhoneField) setPhoneVerification(newVerificationState);
                                    else setPanVerification(newVerificationState);
                                }}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:bg-white/10 text-center tracking-widest font-mono text-base"
                                placeholder="000000"
                            />
                            <button
                                onClick={isPhoneField ? handleVerifyPhoneOTP : handleVerifyPANOTP}
                                disabled={verificationState.isVerifying || verificationState.otp.length !== 6}
                                className="px-5 py-2 bg-emerald-600/40 hover:bg-emerald-600/50 border border-emerald-400/20 text-emerald-200 text-xs font-semibold tracking-wide uppercase rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {verificationState.isVerifying ? "..." : "Submit"}
                            </button>
                        </div>
                    </div>
                )}
                
                {errors[name] && (
                    <p className="text-xs text-red-300 px-1 font-light">{errors[name]}</p>
                )}
            </div>
        );
    };

    // SelectField Component
    const SelectField = ({ label, name, options, required = false }) => (
        <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-wide uppercase text-white/70 px-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <select
                    name={name}
                    value={formData[name] || ""}
                    onChange={(e) => handleSelectChange(name, e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all duration-300 text-white outline-none appearance-none text-sm font-light custom-select-dark ${
                        errors[name]
                            ? "border-red-400/50 bg-red-500/10"
                            : "border-white/10 bg-white/5 focus:bg-white/10 focus:border-white/20 focus:ring-4 focus:ring-white/5"
                    } ${
                        !isEditing ? "opacity-50 cursor-not-allowed bg-black/5 border-white/5" : ""
                    }`}
                >
                    <option value="" className="bg-[#5c5047] text-white">Select {label.toLowerCase()}</option>
                    {options.map((option) => (
                        <option key={option} value={option} className="bg-[#5c5047] text-white">
                            {option}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            {errors[name] && (
                <p className="text-xs text-red-300 px-1 font-light">{errors[name]}</p>
            )}
        </div>
    );

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#b5a090]">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                    <p className="mt-4 text-xs font-semibold tracking-widest text-white/60 uppercase">Loading Profile</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#b5a090] p-4">
                <div className="text-center p-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl max-w-sm w-full shadow-2xl">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-2">User Not Found</h2>
                    <p className="text-sm font-light text-white/70">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-12 bg-[#b5a090] relative overflow-hidden flex items-center justify-center font-sans">
            
            {/* 3D Soft Matte Spheres (Claymorphism Background Elements) */}
            {/* <div className="absolute top-[10%] left-[-5%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#5d6d7e] shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.4),20px_30px_60px_rgba(0,0,0,0.25),inset_10px_10px_30px_rgba(255,255,255,0.15)] mix-blend-multiply opacity-85 pointer-events-none transform translate-z-0"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 md:w-[450px] md:h-[450px] rounded-full bg-[#f4f1ea] shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.15),15px_25px_50px_rgba(0,0,0,0.15),inset_15px_15px_40px_rgba(255,255,255,0.7)] mix-blend-initial opacity-90 pointer-events-none transform translate-z-0"></div>
            <div className="absolute top-[65%] left-[5%] w-24 h-24 md:w-36 md:h-36 rounded-full bg-[#e5dfd3] shadow-[inset_-8px_-8px_20px_rgba(0,0,0,0.15),8px_12px_24px_rgba(0,0,0,0.1),inset_6px_6px_15px_rgba(255,255,255,0.6)] opacity-75 pointer-events-none transform translate-z-0"></div> */}

            {/* Brutalist Corner Brand Tags */}
            {/* <div className="hidden lg:block absolute top-6 left-8 text-[10px] tracking-[0.25em] font-light text-white/40 uppercase pointer-events-none">Figma Composition</div>
            <div className="hidden lg:block absolute top-6 right-8 text-[10px] tracking-[0.25em] font-light text-white/40 uppercase pointer-events-none">Design 2026</div>
            <div className="hidden lg:block absolute bottom-6 left-8 text-[10px] tracking-[0.25em] font-light text-white/40 uppercase pointer-events-none">Glass Effect</div>
            <div className="hidden lg:block absolute bottom-6 right-8 text-[10px] tracking-[0.25em] font-light text-white/40 uppercase pointer-events-none">By Boringthings</div> */}

            <div className="max-w-3xl w-full z-10 relative">
                {/* Header Section */}
                <div className="mb-6 text-center md:text-left md:px-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                        Profile
                    </h1>
                    <p className="text-sm font-light text-white/70 tracking-wide mt-2">
                        Manage your personal information
                    </p>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl backdrop-blur-md animate-fade-in">
                        <p className="text-emerald-200 text-xs tracking-wide uppercase font-medium flex items-center justify-center md:justify-start">
                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-300" />
                            {successMessage}
                        </p>
                    </div>
                )}

                {/* Main Glassmorphic Panel Card */}
                <div className="bg-white/[0.06] backdrop-blur-[24px] rounded-[32px] border border-white/15 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden transition-all duration-500">
                    
                    {/* Control Panel Header Bar */}
                    <div className="px-6 md:px-8 py-6 border-b border-white/10 bg-white/[0.02]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#f4f1ea] hover:bg-white text-slate-900 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 transform active:scale-98 shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)]"
                                    >
                                        <Pencil size={12} className="stroke-[3]" />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-slate-600/60 hover:bg-slate-600/80 border border-white/10 text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 transform active:scale-98 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.15)]"
                                        >
                                            <Save size={12} />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-black/10 hover:bg-black/20 border border-white/5 text-white/80 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 transform active:scale-98"
                                        >
                                            <X size={12} />
                                            <span>Cancel</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Live Verification Badges */}
                            <div className="flex flex-wrap gap-2">
                                {formData.isPhoneVerified && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-white/80">
                                        <Phone size={10} className="mr-1.5 opacity-70" />
                                        Phone Verified
                                    </span>
                                )}
                                {formData.isPANVerified && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-white/80">
                                        <CreditCard size={10} className="mr-1.5 opacity-70" />
                                        PAN Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Interactive Form Fields Grid Container */}
                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <InputField
                                label="Full Name"
                                name="name"
                                placeholder="Enter your full name"
                                required
                            />

                            <InputField
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                            />

                            <InputField
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                required
                            />

                            <InputField
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                placeholder="9876543210"
                                verificationType="phone"
                            />

                            <InputField
                                label="PAN Number"
                                name="pan"
                                placeholder="ABCDE1234F"
                                verificationType="pan"
                            />

                            <SelectField
                                label="Gender"
                                name="gender"
                                options={["Male", "Female", "Other"]}
                                required
                            />

                            <div className="md:col-span-2">
                                <SelectField
                                    label="State"
                                    name="state"
                                    options={indianStates}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Premium Card Sub-Footer */}
                    <div className="px-6 py-4 border-t border-white/5 bg-black/[0.04] text-center">
                        <p className="text-[11px] tracking-wide font-light text-white/40">
                            Make sure to save your changes before leaving this session.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}