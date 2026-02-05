// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Pencil, Save, X } from "lucide-react";

// export default function ProfilePage() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState({});
//     const [errors, setErrors] = useState({});
//     const [successMessage, setSuccessMessage] = useState("");

//     const apiUrl = import.meta.env.VITE_API_URL;

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         const userId = userData?.id;

//         if (userId) {
//             fetchUser(userId);
//         } else {
//             setLoading(false);
//         }
//     }, []);

//     const fetchUser = async (id) => {
//         try {
//             const res = await axios.get(`${apiUrl}/users/${id}`);
//             const userData = res.data.data;
                        
//             console.log("API Response:", userData);

//             setUser(userData);

//             // Format data for form
//             const formattedData = {
//                 id: userData.id,
//                 name: userData.name || "",
//                 email: userData.email || "",
//                 phone: userData.phone || "",
//                 gender: userData.gender 
//                     ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
//                     : "",
//                 dob: userData.dob 
//                     ? new Date(userData.dob).toISOString().split("T")[0]
//                     : "",
//                 pan: userData.pan || "",
//                 state: userData.state || ""
//             };

//             setFormData(formattedData);
//         } catch (error) {
//             console.error("Fetch user error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });

//         if (errors[name]) {
//             setErrors({
//                 ...errors,
//                 [name]: "",
//             });
//         }
//     };

//     const handleSelectChange = (name, value) => {
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//         if (errors[name]) {
//             setErrors({
//                 ...errors,
//                 [name]: "",
//             });
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.name?.trim()) {
//             newErrors.name = "Name is required";
//         }

//         if (!formData.email?.trim()) {
//             newErrors.email = "Email is required";
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//             newErrors.email = "Invalid email format";
//         }

//         if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
//             newErrors.phone = "Phone number must be 10 digits";
//         }

//         if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
//             newErrors.pan = "Invalid PAN format";
//         }

//         if (!formData.dob) {
//             newErrors.dob = "Date of birth is required";
//         } else {
//             const dobDate = new Date(formData.dob);
//             const today = new Date();
//             if (dobDate > today) {
//                 newErrors.dob = "Date of birth cannot be in the future";
//             }
//         }

//         if (!formData.gender) {
//             newErrors.gender = "Gender is required";
//         }

//         if (!formData.state) {
//             newErrors.state = "State is required";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSave = async () => {
//         if (!validateForm()) {
//             return;
//         }

//         try {
//             setLoading(true);
//             const dataToSend = {
//                 ...formData,
//                 dob: formData.dob ? new Date(formData.dob).toISOString() : null
//             };

//             const res = await axios.put(
//                 `${apiUrl}/users/${user.id}`,
//                 dataToSend
//             );
            
//             // Update user and form data with fresh response
//             const updatedUserData = res.data;
//             setUser(updatedUserData);
            
//             const formattedData = {
//                 id: updatedUserData.id,
//                 name: updatedUserData.name || "",
//                 email: updatedUserData.email || "",
//                 phone: updatedUserData.phone || "",
//                 gender: updatedUserData.gender 
//                     ? updatedUserData.gender.charAt(0).toUpperCase() + updatedUserData.gender.slice(1)
//                     : "",
//                 dob: updatedUserData.dob 
//                     ? new Date(updatedUserData.dob).toISOString().split("T")[0]
//                     : "",
//                 pan: updatedUserData.pan || "",
//                 state: updatedUserData.state || ""
//             };
            
//             setFormData(formattedData);
//             setSuccessMessage("Profile updated successfully!");
//             setIsEditing(false);

//             // Update localStorage
//             const storedUser = JSON.parse(localStorage.getItem("user"));
//             if (storedUser) {
//                 localStorage.setItem("user", JSON.stringify({
//                     ...storedUser,
//                     name: formData.name,
//                     email: formData.email
//                 }));
//             }

//             setTimeout(() => setSuccessMessage(""), 3000);
//         } catch (error) {
//             console.error("Save error:", error);
//             setErrors({ submit: "Failed to update profile. Please try again." });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         if (user) {
//             const formattedData = {
//                 id: user.id,
//                 name: user.name || "",
//                 email: user.email || "",
//                 phone: user.phone || "",
//                 gender: user.gender 
//                     ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
//                     : "",
//                 dob: user.dob 
//                     ? new Date(user.dob).toISOString().split("T")[0]
//                     : "",
//                 pan: user.pan || "",
//                 state: user.state || ""
//             };
//             setFormData(formattedData);
//         }
//         setIsEditing(false);
//         setErrors({});
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//                 <div className="flex flex-col items-center">
//                     <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                     <p className="mt-4 text-gray-600">Loading profile...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h2>
//                     <p className="text-gray-600">Please log in to view your profile.</p>
//                 </div>
//             </div>
//         );
//     }

//     const InputField = ({ label, name, type = "text", placeholder, required = false }) => (
//         <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//                 {label} {required && <span className="text-red-500">*</span>}
//             </label>
//             <input
//                 type={type}
//                 name={name}
//                 value={formData[name] || ""}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className={`w-full px-4 py-3 rounded-xl border ${
//                     errors[name]
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300 bg-white"
//                 } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ${
//                     !isEditing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""
//                 }`}
//                 placeholder={placeholder}
//             />
//             {errors[name] && (
//                 <p className="text-sm text-red-600">{errors[name]}</p>
//             )}
//         </div>
//     );

//     const SelectField = ({ label, name, options, required = false }) => (
//         <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//                 {label} {required && <span className="text-red-500">*</span>}
//             </label>
//             <select
//                 name={name}
//                 value={formData[name] || ""}
//                 onChange={(e) => handleSelectChange(name, e.target.value)}
//                 disabled={!isEditing}
//                 className={`w-full px-4 py-3 rounded-xl border ${
//                     errors[name]
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300 bg-white"
//                 } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ${
//                     !isEditing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""
//                 }`}
//             >
//                 <option value="">Select {label.toLowerCase()}</option>
//                 {options.map((option) => (
//                     <option key={option} value={option}>
//                         {option}
//                     </option>
//                 ))}
//             </select>
//             {errors[name] && (
//                 <p className="text-sm text-red-600">{errors[name]}</p>
//             )}
//         </div>
//     );

//     const indianStates = [
//         "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//         "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
//         "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
//         "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
//         "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
//         "Uttar Pradesh", "Uttarakhand", "West Bengal"
//     ];

//     return (
//         <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
//             <div className="max-w-4xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profile</h1>
//                     <p className="text-gray-600 mt-2">Manage your personal information</p>
//                 </div>

//                 {successMessage && (
//                     <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
//                         <p className="text-green-700 flex items-center">
//                             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                             </svg>
//                             {successMessage}
//                         </p>
//                     </div>
//                 )}

//                 {errors.submit && (
//                     <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
//                         <p className="text-red-700">{errors.submit}</p>
//                     </div>
//                 )}

//                 {/* Profile Card */}
//                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                     {/* Card Header */}
//                     <div className="px-6 py-8 border-b border-gray-200">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                             <div className="flex space-x-3">
//                                 {!isEditing ? (
//                                     <button
//                                         onClick={() => setIsEditing(true)}
//                                         className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
//                                     >
//                                         <Pencil size={18} />
//                                         <span>Edit Profile</span>
//                                     </button>
//                                 ) : (
//                                     <>
//                                         <button
//                                             onClick={handleSave}
//                                             disabled={loading}
//                                             className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//                                         >
//                                             <Save size={18} />
//                                             <span>{loading ? "Saving..." : "Save Changes"}</span>
//                                         </button>
//                                         <button
//                                             onClick={handleCancel}
//                                             className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
//                                         >
//                                             <X size={18} />
//                                             <span>Cancel</span>
//                                         </button>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Form Fields */}
//                     <div className="p-8">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                             <InputField
//                                 label="Full Name"
//                                 name="name"
//                                 placeholder="Enter your full name"
//                                 required
//                             />

//                             <InputField
//                                 label="Email Address"
//                                 name="email"
//                                 type="email"
//                                 placeholder="you@example.com"
//                                 required
//                             />

//                             <InputField
//                                 label="Date of Birth"
//                                 name="dob"
//                                 type="date"
//                                 required
//                             />

//                             <InputField
//                                 label="Phone Number"
//                                 name="phone"
//                                 type="tel"
//                                 placeholder="9876543210"
//                             />

//                             <InputField
//                                 label="PAN Number"
//                                 name="pan"
//                                 placeholder="ABCDE1234F"
//                             />

//                             <SelectField
//                                 label="Gender"
//                                 name="gender"
//                                 options={["Male", "Female", "Other"]}
//                                 required
//                             />

//                             <SelectField
//                                 label="State"
//                                 name="state"
//                                 options={indianStates}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
//                         <p className="text-sm text-gray-600 text-center">
//                             Make sure to save your changes before leaving this page.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }















// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Pencil, Save, X, CheckCircle, Phone, CreditCard } from "lucide-react";

// // export default function ProfilePage() {
// //     const [user, setUser] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [formData, setFormData] = useState({});
// //     const [errors, setErrors] = useState({});
// //     const [successMessage, setSuccessMessage] = useState("");
// //     const [verifyingPhone, setVerifyingPhone] = useState(false);
// //     const [verifyingPan, setVerifyingPan] = useState(false);

// //     const apiUrl = import.meta.env.VITE_API_URL;

// //     useEffect(() => {
// //         const userData = JSON.parse(localStorage.getItem("user"));
// //         const userId = userData?.id;

// //         if (userId) {
// //             fetchUser(userId);
// //         } else {
// //             setLoading(false);
// //         }
// //     }, []);

// //     const fetchUser = async (id) => {
// //         try {
// //             const res = await axios.get(`${apiUrl}/users/${id}`);
// //             setUser(res.data.data);

// //             const formattedData = {
// //                 ...res.data.data,
// //                 gender: res.data.data.gender
// //                     ? res.data.data.gender.charAt(0).toUpperCase() + res.data.data.gender.slice(1)
// //                     : "",
// //                 dob: res.data.data.dob
// //                     ? new Date(res.data.dob).toISOString().split("T")[0]
// //                     : ""
// //             };

// //             setFormData(formattedData);
// //         } catch (error) {
// //             console.error(error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData({
// //             ...formData,
// //             [name]: value,
// //         });

// //         if (errors[name]) {
// //             setErrors({
// //                 ...errors,
// //                 [name]: "",
// //             });
// //         }
// //     };

// //     const handleSelectChange = (name, value) => {
// //         setFormData({
// //             ...formData,
// //             [name]: value,
// //         });
// //         if (errors[name]) {
// //             setErrors({
// //                 ...errors,
// //                 [name]: "",
// //             });
// //         }
// //     };

// //     const validateForm = () => {
// //         const newErrors = {};

// //         if (!formData.name?.trim()) {
// //             newErrors.name = "Name is required";
// //         }

// //         if (!formData.email?.trim()) {
// //             newErrors.email = "Email is required";
// //         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
// //             newErrors.email = "Invalid email format";
// //         }

// //         if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
// //             newErrors.phone = "Phone number must be 10 digits";
// //         }

// //         if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
// //             newErrors.pan = "Invalid PAN format";
// //         }

// //         if (!formData.dob) {
// //             newErrors.dob = "Date of birth is required";
// //         } else {
// //             const dobDate = new Date(formData.dob);
// //             const today = new Date();
// //             if (dobDate > today) {
// //                 newErrors.dob = "Date of birth cannot be in the future";
// //             }
// //         }

// //         if (!formData.gender) {
// //             newErrors.gender = "Gender is required";
// //         }

// //         if (!formData.state) {
// //             newErrors.state = "State is required";
// //         }

// //         setErrors(newErrors);
// //         return Object.keys(newErrors).length === 0;
// //     };

// //     const handleSave = async () => {
// //         if (!validateForm()) {
// //             return;
// //         }

// //         try {
// //             setLoading(true);
// //             const dataToSend = {
// //                 ...formData,
// //                 dob: formData.dob ? new Date(formData.dob).toISOString() : null
// //             };

// //             const res = await axios.put(
// //                 `${apiUrl}/users/${user.id}`,
// //                 dataToSend
// //             );
// //             setUser(res.data.data);
// //             const formattedData = {
// //                 ...res.data.data,
// //                 dob: res.data.data.dob ? new Date(res.data.data.dob).toISOString().split('T')[0] : ''
// //             };
// //             setFormData(formattedData);

// //             setSuccessMessage("Profile updated successfully!");
// //             setIsEditing(false);

// //             const storedUser = JSON.parse(localStorage.getItem("user"));
// //             if (storedUser) {
// //                 localStorage.setItem("user", JSON.stringify({
// //                     ...storedUser,
// //                     name: formData.name,
// //                     email: formData.email
// //                 }));
// //             }

// //             setTimeout(() => setSuccessMessage(""), 3000);
// //         } catch (error) {
// //             console.error(error);
// //             setErrors({ submit: "Failed to update profile. Please try again." });
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleCancel = () => {
// //         if (user) {
// //             const formattedData = {
// //                 ...user,
// //                 gender: user.gender
// //                     ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
// //                     : "",
// //                 dob: user.dob
// //                     ? new Date(user.dob).toISOString().split("T")[0]
// //                     : ""
// //             };
// //             setFormData(formattedData);
// //         }
// //         setIsEditing(false);
// //         setErrors({});
// //     };

// //     // Verification functions
// //     const handleVerifyPhone = async () => {
// //         if (!formData.phone || formData.phone.length !== 10) {
// //             setErrors({ phone: "Please enter a valid 10-digit phone number" });
// //             return;
// //         }

// //         try {
// //             setVerifyingPhone(true);
// //             // Replace with your actual verification API endpoint
// //             await axios.post(`${apiUrl}/users/${user.id}/verify-phone`, {
// //                 phone: formData.phone
// //             });
            
// //             setSuccessMessage("Phone verified successfully!");
// //             setTimeout(() => setSuccessMessage(""), 3000);
// //         } catch (error) {
// //             console.error(error);
// //             setErrors({ phone: "Phone verification failed. Please try again." });
// //         } finally {
// //             setVerifyingPhone(false);
// //         }
// //     };

// //     const handleVerifyPan = async () => {
// //         if (!formData.pan || formData.pan.length !== 10) {
// //             setErrors({ pan: "Please enter a valid PAN number" });
// //             return;
// //         }

// //         try {
// //             setVerifyingPan(true);
// //             // Replace with your actual verification API endpoint
// //             await axios.post(`${apiUrl}/users/${user.id}/verify-pan`, {
// //                 pan: formData.pan
// //             });
            
// //             setSuccessMessage("PAN verified successfully!");
// //             setTimeout(() => setSuccessMessage(""), 3000);
// //         } catch (error) {
// //             console.error(error);
// //             setErrors({ pan: "PAN verification failed. Please try again." });
// //         } finally {
// //             setVerifyingPan(false);
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
// //                 <div className="flex flex-col items-center">
// //                     <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
// //                     <p className="mt-4 text-gray-600">Loading profile...</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     if (!user) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center">
// //                 <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
// //                     <h2 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h2>
// //                     <p className="text-gray-600">Please log in to view your profile.</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     const InputField = ({ label, name, type = "text", placeholder, required = false, value, showVerification = false }) => (
// //         <div className="space-y-2 relative">
// //             <label className="block text-sm font-medium text-gray-700">
// //                 {label} {required && <span className="text-red-500">*</span>}
// //             </label>
// //             <div className="flex items-center gap-2">
// //                 <input
// //                     type={type}
// //                     name={name}
// //                     value={value !== undefined ? value : (formData[name] || "")}
// //                     onChange={handleInputChange}
// //                     disabled={!isEditing}
// //                     className={`flex-1 px-4 py-3 rounded-xl border ${errors[name]
// //                         ? "border-red-300 bg-red-50"
// //                         : "border-gray-300 bg-white"
// //                         } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ${!isEditing ? "bg-gray-50 text-gray-600" : ""
// //                         }`}
// //                     placeholder={placeholder}
// //                 />
// //                 {showVerification && (
// //                     <div className="flex items-center gap-1">
// //                         {user.is_verified && (
// //                             <CheckCircle className="w-5 h-5 text-green-500" title="Verified" />
// //                         )}
// //                         {!isEditing && name === 'phone' && formData.phone && (
// //                             <button
// //                                 onClick={handleVerifyPhone}
// //                                 disabled={verifyingPhone}
// //                                 className="p-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 hover:bg-blue-50 rounded-lg transition-colors"
// //                                 title="Verify Phone"
// //                             >
// //                                 <Phone size={16} />
// //                             </button>
// //                         )}
// //                         {!isEditing && name === 'pan' && formData.pan && (
// //                             <button
// //                                 onClick={handleVerifyPan}
// //                                 disabled={verifyingPan}
// //                                 className="p-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 hover:bg-blue-50 rounded-lg transition-colors"
// //                                 title="Verify PAN"
// //                             >
// //                                 <CreditCard size={16} />
// //                             </button>
// //                         )}
// //                     </div>
// //                 )}
// //             </div>
// //             {errors[name] && (
// //                 <p className="text-sm text-red-600">{errors[name]}</p>
// //             )}
// //         </div>
// //     );

// //     const SelectField = ({ label, name, options, required = false }) => (
// //         <div className="space-y-2">
// //             <label className="block text-sm font-medium text-gray-700">
// //                 {label} {required && <span className="text-red-500">*</span>}
// //             </label>
// //             <select
// //                 name={name}
// //                 value={formData[name] || ""}
// //                 onChange={(e) => handleSelectChange(name, e.target.value)}
// //                 disabled={!isEditing}
// //                 className={`w-full px-4 py-3 rounded-xl border ${errors[name]
// //                     ? "border-red-300 bg-red-50"
// //                     : "border-gray-300 bg-white"
// //                     } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ${!isEditing ? "bg-gray-50 text-gray-600" : ""
// //                     }`}
// //             >
// //                 <option value="">Select {label.toLowerCase()}</option>
// //                 {options.map((option) => (
// //                     <option key={option} value={option}>
// //                         {option}
// //                     </option>
// //                 ))}
// //             </select>
// //             {errors[name] && (
// //                 <p className="text-sm text-red-600">{errors[name]}</p>
// //             )}
// //         </div>
// //     );

// //     const indianStates = [
// //         "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
// //         "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
// //         "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
// //         "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
// //         "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
// //         "Uttar Pradesh", "Uttarakhand", "West Bengal"
// //     ];

// //     const formatDateDDMMYYYY = (isoDate) => {
// //         if (!isoDate) return "";
// //         const date = new Date(isoDate);
// //         return date.toLocaleDateString('en-GB');
// //     };

// //     return (
// //         <div className="min-h-screen p-4 md:p-6">
// //             <div className="max-w-7xl mx-auto">
// //                 {/* Header */}
// //                 <div className="mb-8">
// //                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profile</h1>
// //                     <p className="text-gray-600 mt-2">Manage your personal information</p>
// //                 </div>

// //                 {successMessage && (
// //                     <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
// //                         <p className="text-green-700 flex items-center">
// //                             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
// //                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// //                             </svg>
// //                             {successMessage}
// //                         </p>
// //                     </div>
// //                 )}

// //                 {errors.submit && (
// //                     <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
// //                         <p className="text-red-700">{errors.submit}</p>
// //                     </div>
// //                 )}

// //                 {/* Profile Card */}
// //                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
// //                     {/* Card Header */}
// //                     <div className="px-6 py-8 border-b border-gray-200">
// //                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// //                             <div className="flex space-x-3">
// //                                 {!isEditing ? (
// //                                     <button
// //                                         onClick={() => setIsEditing(true)}
// //                                         className="flex items-center justify-center space-x-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
// //                                     >
// //                                         <Pencil size={18} />
// //                                         <span>Edit Profile</span>
// //                                     </button>
// //                                 ) : (
// //                                     <>
// //                                         <button
// //                                             onClick={handleSave}
// //                                             disabled={loading}
// //                                             className="flex items-center justify-center space-x-2 px-5 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 shadow-md hover:shadow-lg"
// //                                         >
// //                                             <Save size={18} />
// //                                             <span>{loading ? "Saving..." : "Save Changes"}</span>
// //                                         </button>
// //                                         <button
// //                                             onClick={handleCancel}
// //                                             className="flex items-center justify-center space-x-2 px-5 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors duration-200 shadow-md hover:shadow-lg"
// //                                         >
// //                                             <X size={18} />
// //                                             <span>Cancel</span>
// //                                         </button>
// //                                     </>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Form Fields */}
// //                     <div className="p-6">
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                             <InputField
// //                                 label="Full Name"
// //                                 name="name"
// //                                 placeholder="Enter your full name"
// //                                 required
// //                             />

// //                             <InputField
// //                                 label="Email Address"
// //                                 name="email"
// //                                 type="email"
// //                                 placeholder="you@example.com"
// //                                 required
// //                                 showVerification={true}
// //                             />

// //                             <InputField
// //                                 label="Date of Birth"
// //                                 name="dob"
// //                                 type="date"
// //                                 required
// //                             />

// //                             <InputField
// //                                 label="Phone Number"
// //                                 name="phone"
// //                                 type="tel"
// //                                 placeholder="9876543210"
// //                                 showVerification={true}
// //                             />

// //                             <InputField
// //                                 label="PAN Number"
// //                                 name="pan"
// //                                 placeholder="ABCDE1234F"
// //                                 showVerification={true}
// //                             />

// //                             <SelectField
// //                                 label="Gender"
// //                                 name="gender"
// //                                 options={["Male", "Female", "Other"]}
// //                                 required
// //                             />

// //                             <SelectField
// //                                 label="State"
// //                                 name="state"
// //                                 options={indianStates}
// //                                 required
// //                             />
// //                         </div>
// //                     </div>

// //                     {/* Footer */}
// //                     <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
// //                         <p className="text-sm text-gray-600 text-center">
// //                             Make sure to save your changes before leaving this page.
// //                         </p>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }


import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Save, X, Phone, CreditCard, CheckCircle } from "lucide-react";

export default function ProfilePage() {
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
                `${apiUrl}/verification/pan/send-otp`,  // New endpoint needed
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
                `${apiUrl}/verification/pan/verify-otp`,  // New endpoint needed
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
        // Add your save logic here
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
        // Reset verification states
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
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    {isVerified && (
                        <span className="flex items-center text-sm text-green-600">
                            <CheckCircle size={14} className="mr-1" />
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
                        className={`flex-1 px-4 py-3 rounded-xl border ${
                            errors[name]
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 bg-white"
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ${
                            !isEditing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""
                        }`}
                        placeholder={placeholder}
                    />
                    
                    {isEditing && !isVerified && (isPhoneField || isPanField) && (
                        <button
                            type="button"
                            onClick={isPhoneField ? handleSendPhoneOTP : handleSendPANOTP}
                            disabled={verificationState.isVerifying}
                            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
                        >
                            {isPhoneField ? <Phone size={18} /> : <CreditCard size={18} />}
                            <span>{verificationState.otpSent ? "Resend OTP" : "Send OTP"}</span>
                        </button>
                    )}
                </div>

                {/* OTP Input - Same for both Phone & PAN */}
                {(isPhoneField || isPanField) && verificationState.otpSent && isEditing && (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-700 mb-3">
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
                                className="flex-1 px-4 py-3 border border-blue-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                                placeholder="123456"
                            />
                            <button
                                onClick={isPhoneField ? handleVerifyPhoneOTP : handleVerifyPANOTP}
                                disabled={verificationState.isVerifying || verificationState.otp.length !== 6}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium whitespace-nowrap"
                            >
                                {verificationState.isVerifying ? "Verifying..." : "Submit OTP"}
                            </button>
                        </div>
                    </div>
                )}
                
                {errors[name] && (
                    <p className="text-sm text-red-600 mt-1">{errors[name]}</p>
                )}
            </div>
        );
    };

    // SelectField Component
    const SelectField = ({ label, name, options, required = false }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={formData[name] || ""}
                onChange={(e) => handleSelectChange(name, e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${
                    errors[name]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-white"
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 ${
                    !isEditing ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""
                }`}
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {errors[name] && (
                <p className="text-sm text-red-600">{errors[name]}</p>
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

    // Loading & Empty states...
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h2>
                    <p className="text-gray-600">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your personal information</p>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
                        <p className="text-green-700 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {successMessage}
                        </p>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Card Header */}
                    <div className="px-6 py-8 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex space-x-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <Pencil size={18} />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <Save size={18} />
                                            <span>Save Changes</span>
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <X size={18} />
                                            <span>Cancel</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Verification Status */}
                            <div className="flex flex-wrap gap-2">
                                {formData.isPhoneVerified && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        <Phone size={12} className="mr-1" />
                                        Phone Verified
                                    </span>
                                )}
                                {formData.isPANVerified && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        <CreditCard size={12} className="mr-1" />
                                        PAN Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

                            <SelectField
                                label="State"
                                name="state"
                                options={indianStates}
                                required
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            Make sure to save your changes before leaving this page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
