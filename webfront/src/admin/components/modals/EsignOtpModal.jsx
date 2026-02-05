import { useState, useRef } from "react";
import { X } from "lucide-react";

export default function EsignOtpModal({ open, onClose, onVerify }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  if (!open) return null;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Esign Authentication
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <hr className="text-gray-300"/>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm text-gray-500 mb-5">
            Please check your email we’ve sent you an OTP.
          </p>

          {/* OTP Boxes */}
          <div className="flex gap-4 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-14 w-14 rounded-lg border border-gray-300 text-center text-lg font-medium focus:border-black focus:outline-none"
              />
            ))}
          </div>

          {/* Resend */}
          <button className="text-sm text-blue-600 hover:underline">
            Resend code
          </button>
        </div>

        {/* Verify Button */}
        <div className="px-6">
          <button
            onClick={() => onVerify?.(otp.join(""))}
            className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white hover:bg-gray-900"
          >
            Verify
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4">
          <p className="text-xs text-gray-500">
            Transaction ID: 1234a5858d585s5858965d8545
          </p>
        </div>
      </div>
    </div>
  );
}
