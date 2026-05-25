import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginProfileForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [date, setDate] = useState(""); // Day
    const [month, setMonth] = useState(""); // Month
    const [year, setYear] = useState(""); // Year
    const [pan, setPan] = useState("");
    const [state, setState] = useState("");
    const [phone, setPhone] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
        { value: "prefer_not_to_say", label: "Prefer not to say" }
    ];

    const stateOptions = [
        { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
        { value: "Andhra Pradesh", label: "Andhra Pradesh" },
        { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
        { value: "Assam", label: "Assam" },
        { value: "Bihar", label: "Bihar" },
        { value: "Chandigarh", label: "Chandigarh" },
        { value: "Chhattisgarh", label: "Chhattisgarh" },
        { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
        { value: "Delhi", label: "Delhi" },
        { value: "Goa", label: "Goa" },
        { value: "Gujarat", label: "Gujarat" },
        { value: "Haryana", label: "Haryana" },
        { value: "Himachal Pradesh", label: "Himachal Pradesh" },
        { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
        { value: "Jharkhand", label: "Jharkhand" },
        { value: "Karnataka", label: "Karnataka" },
        { value: "Kerala", label: "Kerala" },
        { value: "Ladakh", label: "Ladakh" },
        { value: "Lakshadweep", label: "Lakshadweep" },
        { value: "Madhya Pradesh", label: "Madhya Pradesh" },
        { value: "Maharashtra", label: "Maharashtra" },
        { value: "Manipur", label: "Manipur" },
        { value: "Meghalaya", label: "Meghalaya" },
        { value: "Mizoram", label: "Mizoram" },
        { value: "Nagaland", label: "Nagaland" },
        { value: "Odisha", label: "Odisha" },
        { value: "Puducherry", label: "Puducherry" },
        { value: "Punjab", label: "Punjab" },
        { value: "Rajasthan", label: "Rajasthan" },
        { value: "Sikkim", label: "Sikkim" },
        { value: "Tamil Nadu", label: "Tamil Nadu" },
        { value: "Telangana", label: "Telangana" },
        { value: "Tripura", label: "Tripura" },
        { value: "Uttar Pradesh", label: "Uttar Pradesh" },
        { value: "Uttarakhand", label: "Uttarakhand" },
        { value: "West Bengal", label: "West Bengal" }
    ];

    const dateOptions = Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString().padStart(2, '0'),
        label: (i + 1).toString()
    }));

    const monthOptions = [
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" }
    ];

    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 100;
        const maxYear = currentYear - 18;
        const years = [];
        for (let year = maxYear; year >= minYear; year--) {
            years.push({ value: year.toString(), label: year.toString() });
        }
        return years;
    };

    const yearOptions = getYearOptions();

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!date || !month || !year) {
            setError("Please select your complete date of birth");
            setLoading(false);
            return;
        }

        if (!phone || !/^[0-9]{10}$/.test(phone)) {
            setError("Phone number must be exactly 10 digits (e.g., 9876543210)");
            setLoading(false);
            return;
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(pan)) {
            setError("Invalid PAN format. Example: ABCDE1234F");
            setLoading(false);
            return;
        }

        if (!state) {
            setError("Please select your state");
            setLoading(false);
            return;
        }

        const dobString = `${year}-${month}-${date}`;
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setError("You must be at least 18 years old to register");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/auth/register-with-email`, {
                name,
                email,
                gender,
                dob: dobString,
                pan: pan.toUpperCase(),
                state,
                phone
            });

            if (response.data.success) {
                setSuccess("Registration successful.");

                localStorage.setItem("pending_email", email);

                setTimeout(() => {
                    navigate("/login", {
                        state: {
                            email: email,
                            message: "Registration successful."
                        }
                    });
                }, 2000);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Registration error:", error);

            if (error.response?.status === 400) {
                setError(error.response.data.message);
            } else if (error.response?.status === 500) {
                setError("Server error. Please try again later.");
            } else {
                setError("Registration failed. Please check your connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getSelectedGenderLabel = () => {
        const selected = genderOptions.find(option => option.value === gender);
        return selected ? selected.label : "Select Gender";
    };

    const getSelectedStateLabel = () => {
        const selected = stateOptions.find(option => option.value === state);
        return selected ? selected.label : "Select State";
    };

    const getSelectedDateLabel = () => date || "Day";
    const getSelectedMonthLabel = () => {
        const selected = monthOptions.find(option => option.value === month);
        return selected ? selected.label : "Month";
    };
    const getSelectedYearLabel = () => year || "Year";

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/home-signal-bg.svg')" }}
        >

            <div className="relative z-10 w-full max-w-lg">
                <form onSubmit={submit} className="w-full p-8 rounded-2xl bg-white/95 shadow-2x">
                    <h1 className="text-3xl mb-1 text-center">
                        Complete Your Profile
                    </h1>
                    <p className="text-md text-gray-500 mb-6 text-center">
                        Enter your details to continue securely
                    </p>

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-md">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-md">
                            {error}
                        </div>
                    )}

                    <label className="block text-md mb-1 text-gray-700">
                        Name (as per PAN Card) *
                    </label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Enter your full name as per PAN"
                        required
                        disabled={loading}
                    />

                    <label className="block text-md mb-1 text-gray-700">
                        Email Address *
                    </label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter your email address"
                        required
                        disabled={loading}
                    />

                    <label className="block text-md mb-1 text-gray-700">
                        Gender *
                    </label>
                    <div className="relative mb-4">
                        <div
                            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors duration-200 bg-white"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className={gender ? "text-gray-800" : "text-gray-500"}>
                                {getSelectedGenderLabel()}
                            </span>
                            <svg
                                className={`fill-current h-5 w-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {genderOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${gender === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                                        onClick={() => {
                                            setGender(option.value);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <label className="block text-md mb-1 text-gray-700">
                        Date of Birth (as per PAN Card) *
                    </label>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="relative">
                            <div
                                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors duration-200 text-md bg-white"
                                onClick={() => !loading && setIsDateDropdownOpen(!isDateDropdownOpen)}
                            >
                                <span className={date ? "text-gray-800" : "text-gray-500"}>
                                    {getSelectedDateLabel()}
                                </span>
                                <svg
                                    className={`fill-current h-4 w-4 text-gray-500 transition-transform duration-200 ${isDateDropdownOpen ? "transform rotate-180" : ""}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                            {isDateDropdownOpen && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                                    {dateOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150 text-xs ${date === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                                            onClick={() => {
                                                setDate(option.value);
                                                setIsDateDropdownOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <div
                                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors duration-200 text-md bg-white"
                                onClick={() => !loading && setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                            >
                                <span className={month ? "text-gray-800" : "text-gray-500"}>
                                    {getSelectedMonthLabel()}
                                </span>
                                <svg
                                    className={`fill-current h-4 w-4 text-gray-500 transition-transform duration-200 ${isMonthDropdownOpen ? "transform rotate-180" : ""}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                            {isMonthDropdownOpen && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {monthOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150 text-xs ${month === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                                            onClick={() => {
                                                setMonth(option.value);
                                                setIsMonthDropdownOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <div
                                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors duration-200 text-md bg-white"
                                onClick={() => !loading && setIsYearDropdownOpen(!isYearDropdownOpen)}
                            >
                                <span className={year ? "text-gray-800" : "text-gray-500"}>
                                    {getSelectedYearLabel()}
                                </span>
                                <svg
                                    className={`fill-current h-4 w-4 text-gray-500 transition-transform duration-200 ${isYearDropdownOpen ? "transform rotate-180" : ""}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                            {isYearDropdownOpen && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                                    {yearOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150 text-xs ${year === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                                            onClick={() => {
                                                setYear(option.value);
                                                setIsYearDropdownOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 -mt-3 mb-4">
                        You must be at least 18 years old
                    </p>

                    <label className="block text-md font-medium text-gray-700 mb-1">
                        Phone Number (as per PAN Card) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={phone || ""}
                            onChange={(e) => setPhone(e.target.value)}
                            type="tel"
                            name="phone"
                            placeholder="Enter your registered number"
                            pattern="[0-9]{10}"
                            title="Enter valid 10-digit phone number (9876543210)"
                            required
                            maxLength={10}
                        />
                    </div>
                    <p className="text-xs text-gray-500 -mt-3 mb-4">
                        Format: 10-digit mobile number (no spaces or dashes)
                    </p>

                    <label className="block text-md mb-1 text-gray-700">
                        PAN Card Number *
                    </label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                        type="text"
                        placeholder="Enter PAN number (e.g., ABCDE1234F)"
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        title="Enter valid PAN number (e.g., ABCDE1234F)"
                        required
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 -mt-3 mb-4">
                        Format: 5 letters, 4 numbers, 1 letter
                    </p>

                    <label className="block text-md mb-1 text-gray-700">
                        State *
                    </label>
                    <div className="relative mb-6">
                        <div
                            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors duration-200 disabled:opacity-60 bg-white"
                            onClick={() => !loading && setIsStateDropdownOpen(!isStateDropdownOpen)}
                        >
                            <span className={state ? "text-gray-800" : "text-gray-500"}>
                                {getSelectedStateLabel()}
                            </span>
                            <svg
                                className={`fill-current h-5 w-5 text-gray-500 transition-transform duration-200 ${isStateDropdownOpen ? "transform rotate-180" : ""}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>

                        {isStateDropdownOpen && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {stateOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${state === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                                        onClick={() => {
                                            setState(option.value);
                                            setIsStateDropdownOpen(false);
                                        }}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-60 transition duration-200"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </span>
                        ) : "Register & Verify Email"}
                    </button>

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-md mt-4">
                            {success}
                            <p className="mt-1 text-xs">
                                You will receive an email with your password and OTP.
                                Use the password to login first time.
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                                Login here
                            </button>
                        </p>
                        {/* <p className="text-xs text-gray-400 mt-2">
                            By registering, you agree to our{" "}
                            <a href="/terms" className="text-blue-500 hover:underline">Terms</a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
                        </p> */}
                    </div>
                </form>
            </div>
        </div>
    );
}