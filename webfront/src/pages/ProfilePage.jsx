import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Save, X, Phone, CreditCard, CheckCircle, AlertCircle, Mail } from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [requestId,setRequestId]=useState("")
    
    // ✅ ALL Verification states
    const [phoneVerification, setPhoneVerification] = useState({
        isVerifying: false, otpSent: false, otp: ""
    });
    const [panVerification, setPanVerification] = useState({
        isVerifying: false, otpSent: false, otp: ""
    });
    const [emailVerification, setEmailVerification] = useState({
        isVerifying: false, otpSent: false, otp: ""
    });
    const [sebiVerification, setSebiVerification] = useState({
        isVerifying: false, otpSent: false, otp: ""
    });

    const apiUrl = import.meta.env.VITE_API_URL;

     const users = localStorage.getItem("user");
     const userId = users ? JSON.parse(users).id : null;


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
            const res = await axios.get(`${apiUrl}/users/profile/${id}`);
            const userData = res.data.data;

            console.log("API Response:", userData);
            
            setUser(userData);

            const formattedData = {
                id: userData.id,
                name: userData.name || "",
                email: userData.email || "",
                phone: userData.phone || userData.phone_number || "",
                gender: userData.gender 
                    ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
                    : "",
                dob: userData.dob || userData.date_of_birth
                    ? new Date(userData.dob || userData.date_of_birth).toISOString().split("T")[0]
                    : "",
                pan: userData.pan || userData.pan_number || "",
                sebi_number: userData.sebi_number || "",
                state: userData.state || userData.address || "",
                role: userData.role, // ✅ Role tracking
                
                // ✅ ALL VERIFICATION FIELDS
                isPhoneVerified: userData.phone_verified === true,
                isPANVerified: userData.pan_verified === true,
                isEmailVerified: userData.email_verified === true,
                isSEBIVerified: userData.sebi_verified === true
            };

            console.log("FormData:", formattedData);
            setFormData(formattedData);
        } catch (error) {
            console.error("Fetch user error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };



    // Phone OTP
    const handleSendPhoneOTP = async () => {
        if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
            setErrors({ ...errors, phone: "Valid 10-digit phone number required" });
            return;
        }
        try {
            setPhoneVerification({ ...phoneVerification, isVerifying: true });
            const token = localStorage.getItem("token");
           const res= await axios.post(`${apiUrl}/users/verification/phone/send-otp`, 
                { phone: formData.phone },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(res,2000)
            setPhoneVerification({ isVerifying: false, otpSent: true, otp: "" });
            setSuccessMessage("OTP sent to phone");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setErrors({ ...errors, phone: error.response?.data?.message || "Failed to send OTP" });
            setPhoneVerification({ ...phoneVerification, isVerifying: false });
        }
    };



    const handleVerifyPhoneOTP = async () => {
        if (!phoneVerification.otp || phoneVerification.otp.length !== 6) {
            setErrors({ ...errors, phone: "Enter 6-digit OTP" });
            return;
        }
        try {
            setPhoneVerification({ ...phoneVerification, isVerifying: true });
            const token = localStorage.getItem("token");
            await axios.post(`${apiUrl}/users/verification/phone/verify-otp`, 
                { phone: formData.phone, otp: phoneVerification.otp , userId:userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchUser(formData.id);
            setPhoneVerification({ isVerifying: false, otpSent: false, otp: "" });
            setSuccessMessage("Phone verified successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setErrors({ ...errors, phone: error.response?.data?.message || "Invalid OTP" });
            setPhoneVerification({ ...phoneVerification, isVerifying: false });
        }
    };



    // PAN OTP
    const handleSendPANOTP = async () => {
        if (!formData.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
            setErrors({ ...errors, pan: "Enter valid PAN (ABCDE1234F)" });
            return;
        }
        try {
            setPanVerification({ ...panVerification, isVerifying: true });
            const token = localStorage.getItem("token");
            await axios.post(`${apiUrl}/users/verification/pan/send-otp`, 
                { pan: formData.pan.toUpperCase() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPanVerification({ isVerifying: false, otpSent: true, otp: "" });
            setSuccessMessage("PAN OTP sent to email");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setErrors({ ...errors, pan: error.response?.data?.message || "Failed to send OTP" });
            setPanVerification({ ...panVerification, isVerifying: false });
        }
    };





    // PAN OTP
    const handleVerifyPANOTP = async () => {
        if (!panVerification.otp || panVerification.otp.length !== 6) {
            setErrors({ ...errors, pan: "Enter 6-digit OTP" });
            return;
        }
        try {
            setPanVerification({ ...panVerification, isVerifying: true });
            const token = localStorage.getItem("token");
            await axios.post(`${apiUrl}/users/verification/pan/verify-otp`, 
                { pan: formData.pan.toUpperCase(), otp: panVerification.otp },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchUser(formData.id);
            setPanVerification({ isVerifying: false, otpSent: false, otp: "" });
            setSuccessMessage("PAN verified successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setErrors({ ...errors, pan: error.response?.data?.message || "Invalid OTP" });
            setPanVerification({ ...panVerification, isVerifying: false });
        }
    };




    const handleSendEmailOTP = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors({ ...errors, email: "Enter valid email" });
        return;
    }
    try {
        setEmailVerification({ ...emailVerification, isVerifying: true });
        const token = localStorage.getItem("token");
        // ✅ FIXED: Use correct URL (without duplicate /users)
        await axios.post(`${apiUrl}/users/verification/email/send-otp`, 
            { email: formData.email, userId: formData.id }, // Add userId
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmailVerification({ isVerifying: false, otpSent: true, otp: "" });
        setSuccessMessage("Email OTP sent");
        setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
        setErrors({ ...errors, email: error.response?.data?.message || "Failed to send OTP" });
        setEmailVerification({ ...emailVerification, isVerifying: false });
    }
};

// Fix handleVerifyEmailOTP
const handleVerifyEmailOTP = async () => {
    if (!emailVerification.otp || emailVerification.otp.length !== 6) {
        setErrors({ ...errors, email: "Enter 6-digit OTP" });
        return;
    }
    try {
        setEmailVerification({ ...emailVerification, isVerifying: true });
        const token = localStorage.getItem("token");
        // ✅ FIXED: Use correct URL
        await axios.post(`${apiUrl}/users/verification/email/verify-otp`, 
            { email: formData.email, otp: emailVerification.otp },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchUser(formData.id);
        setEmailVerification({ isVerifying: false, otpSent: false, otp: "" });
        setSuccessMessage("Email verified successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
        setErrors({ ...errors, email: error.response?.data?.message || "Invalid OTP" });
        setEmailVerification({ ...emailVerification, isVerifying: false });
    }
};






        

const handleSendSebiOTP = async () => {
    if (!formData.sebi_number) {
        setErrors({ ...errors, sebi_number: "Enter SEBI number" });
        return;
    }
    try {
        setSebiVerification({ ...sebiVerification, isVerifying: true });
        const token = localStorage.getItem("token");
        // ✅ FIXED: Use correct URL
        await axios.post(`${apiUrl}/users/verification/sebi/send-otp`, 
            { sebi_number: formData.sebi_number, userId: formData.id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setSebiVerification({ isVerifying: false, otpSent: true, otp: "" });
        setSuccessMessage("SEBI OTP sent");
        setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
        setErrors({ ...errors, sebi_number: error.response?.data?.message || "Failed to send OTP" });
        setSebiVerification({ ...sebiVerification, isVerifying: false });
    }
};

// Add handleVerifySebiOTP function
const handleVerifySebiOTP = async () => {
    if (!sebiVerification.otp || sebiVerification.otp.length !== 6) {
        setErrors({ ...errors, sebi_number: "Enter 6-digit OTP" });
        return;
    }
    try {
        setSebiVerification({ ...sebiVerification, isVerifying: true });
        const token = localStorage.getItem("token");
        await axios.post(`${apiUrl}/users/verification/sebi/verify-otp`, 
            { sebi_number: formData.sebi_number, otp: sebiVerification.otp },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchUser(formData.id);
        setSebiVerification({ isVerifying: false, otpSent: false, otp: "" });
        setSuccessMessage("SEBI verified successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
        setErrors({ ...errors, sebi_number: error.response?.data?.message || "Invalid OTP" });
        setSebiVerification({ ...sebiVerification, isVerifying: false });
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
        setEmailVerification({ isVerifying: false, otpSent: false, otp: "" });
        setSebiVerification({ isVerifying: false, otpSent: false, otp: "" });
    };

    const InputField = ({ label, name, type = "text", placeholder, required = false }) => {
        const isPhoneField = name === 'phone';
        const isPanField = name === 'pan';
        const isEmailField = name === 'email';
        const isSebiField = name === 'sebi_number';
        
        const getVerificationStatus = () => {
            if (isPhoneField) return formData.isPhoneVerified;
            if (isPanField) return formData.isPANVerified;
            if (isEmailField) return formData.isEmailVerified;
            if (isSebiField) return formData.isSEBIVerified;
            return undefined;
        };
        
        const isVerified = getVerificationStatus();
        const verificationState = isPhoneField ? phoneVerification : 
                                 isPanField ? panVerification : 
                                 isEmailField ? emailVerification :
                                 isSebiField ? sebiVerification : {};

        const handleSendOTP = () => {
            if (isPhoneField) return handleSendPhoneOTP;
            if (isPanField) return handleSendPANOTP;
            if (isEmailField) return handleSendEmailOTP;
            if (isSebiField) return handleSendSebiOTP;
        };

        const handleVerifyOTP = () => {
            if (isPhoneField) return handleVerifyPhoneOTP;
            if (isPanField) return handleVerifyPANOTP;
            if (isEmailField) return handleVerifyEmailOTP;
            if (isSebiField) return handleVerifySebiOTP;
        };

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="block text-md font-medium text-gray-700">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    {isVerified !== undefined && (
                        isVerified ? (
                            <span className="flex items-center text-md text-green-600">
                                <CheckCircle size={14} className="mr-1" />
                                Verified
                            </span>
                        ) : !isEditing ? (
                            <span className="flex items-center text-md text-orange-600">
                                <AlertCircle size={14} className="mr-1" />
                                Not Verified
                            </span>
                        ) : null
                    )}
                </div>
                
                <div className="flex space-x-2">
                    <input
                        type={type}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`flex-1 px-4 py-3 rounded-xl border ${
                            errors[name] ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                            !isEditing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""
                        }`}
                        placeholder={placeholder}
                    />
                    
                    {isEditing && !isVerified && (isPhoneField || isPanField || isEmailField || isSebiField) && (
                        <button
                            type="button"
                            onClick={handleSendOTP()}
                            disabled={verificationState.isVerifying}
                            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 whitespace-nowrap"
                        >
                            {isPhoneField ? <Phone size={18} /> : 
                             isEmailField ? <Mail size={18} /> : 
                             isPanField ? <CreditCard size={18} /> : 
                             <CheckCircle size={18} />}
                            <span>{verificationState.otpSent ? "Resend" : "Send"} OTP</span>
                        </button>
                    )}
                </div>

                {(isPhoneField || isPanField || isEmailField || isSebiField) && verificationState.otpSent && isEditing && (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-md text-blue-700 mb-3">
                            Enter OTP sent to {isPhoneField ? `phone ${formData.phone}` : 
                                             isEmailField ? `email ${formData.email}` :
                                             isPanField ? `email for PAN ${formData.pan}` :
                                             `SEBI ${formData.sebi_number}`}
                        </p>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                maxLength="6"
                                value={verificationState.otp}
                                onChange={(e) => {
                                    const newOtp = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    if (isPhoneField) setPhoneVerification({ ...phoneVerification, otp: newOtp });
                                    else if (isPanField) setPanVerification({ ...panVerification, otp: newOtp });
                                    else if (isEmailField) setEmailVerification({ ...emailVerification, otp: newOtp });
                                    else if (isSebiField) setSebiVerification({ ...sebiVerification, otp: newOtp });
                                }}
                                className="flex-1 px-4 py-3 border border-blue-300 rounded-xl focus:border-blue-500 bg-white"
                                placeholder="123456"
                            />
                            <button
                                onClick={handleVerifyOTP()}
                                disabled={verificationState.isVerifying || verificationState.otp.length !== 6}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 font-medium"
                            >
                                {verificationState.isVerifying ? "Verifying..." : "Submit"}
                            </button>
                        </div>
                    </div>
                )}
                
                {errors[name] && <p className="text-md text-red-600 mt-1">{errors[name]}</p>}
            </div>
        );
    };

    const SelectField = ({ label, name, options, required = false }) => (
        <div className="space-y-2">
            <label className="block text-md font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={formData[name] || ""}
                onChange={(e) => handleSelectChange(name, e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                    errors[name] ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    !isEditing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""
                }`}
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            {errors[name] && <p className="text-md text-red-600">{errors[name]}</p>}
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h2>
                <p className="text-gray-600">Please log in to view your profile.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your personal information & verifications</p>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
                        <p className="text-green-700 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" /> {successMessage}
                        </p>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-8 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex space-x-3">
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        <Pencil size={18} /> <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={handleSave}
                                            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            <Save size={18} /> <span>Save Changes</span>
                                        </button>
                                        <button onClick={handleCancel}
                                            className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            <X size={18} /> <span>Cancel</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.isEmailVerified && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        <Mail size={12} className="mr-1" /> Email Verified
                                    </span>
                                )}
                                {formData.isPhoneVerified && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        <Phone size={12} className="mr-1" /> Phone Verified
                                    </span>
                                )}
                                {formData.isPANVerified && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        <CreditCard size={12} className="mr-1" /> PAN Verified
                                    </span>
                                )}
                                {formData.isSEBIVerified && formData.role === 'RA' && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        ✅ SEBI Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <InputField label="Full Name" name="name" placeholder="Enter your full name" required />
                            <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" required />
                            <InputField label="Date of Birth" name="dob" type="date" required />
                            <InputField label="Phone Number" name="phone" type="tel" placeholder="9876543210" />
                            <InputField label="PAN Number" name="pan" placeholder="ABCDE1234F" />
                            
                            {/* ✅ RA ONLY - SEBI Field */}
                            {formData.role === 'RA' && (
                                <InputField label="SEBI Number" name="sebi_number" placeholder="SEBI123456" />
                            )}
                            
                            <SelectField label="Gender" name="gender" options={["Male", "Female", "Other"]} required />
                            <SelectField label="State" name="state" options={indianStates} required />
                        </div>
                    </div>

                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                        <p className="text-md text-gray-600 text-center">Make sure to save your changes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
