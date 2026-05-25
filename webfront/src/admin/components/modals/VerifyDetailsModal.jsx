import { X } from "lucide-react";
import { useState } from "react";

export default function VerifyDetailsModal({ open, onClose }) {
  const [dob, setDob] = useState("2000-03-08");
  const [state, setState] = useState("Madhya Pradesh");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Verify your Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-md text-gray-500">
            Name will be verified automatically once PAN Card is verified
            successfully.
          </p>

          {/* Full Name */}
          <div>
            <label className="mb-1 block text-md text-gray-600">
              Full Name (as per PAN Card)
            </label>
            <input
              type="text"
              value="Manish Shukla"
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-md text-gray-700 focus:outline-none"
            />
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-md text-gray-600">
                Date of Birth (as per PAN Card)
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-md text-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-md text-gray-600">
                Gender
              </label>
              <select className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-md text-gray-700 focus:outline-none">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* State & PAN */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-md text-gray-600">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-md text-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-md text-gray-600">
                PAN Number
              </label>
              <input
                type="text"
                value="ABCDE1234F"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-md text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-md text-gray-600">
              Email
            </label>
            <input
              type="email"
              value="manish@gmail.com"
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-md text-gray-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-8 py-1.5 text-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button className="rounded-md bg-black px-8 py-1.5 text-md font-medium text-white hover:bg-[#08184b]">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
