import { X } from "lucide-react";
import { useState } from "react";

export default function TermsConditionsModal({ open, onClose, onProceed }) {
  const [confirmEmail, setConfirmEmail] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Terms and Conditions
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* Checkbox 1 */}
          <label className="flex items-start gap-3 text-md text-gray-700">
            <input
              type="checkbox"
              checked={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 accent-blue-600"
            />
            <span>
              I confirm that <strong>manish@gmail.com</strong> belongs to me and
              has been verified by <strong>Company name</strong>
            </span>
          </label>

          {/* Checkbox 2 */}
          <label className="flex items-start gap-3 text-md text-gray-700">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 accent-blue-600"
            />
            <span>I agree to Terms and Conditions of …</span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-300">
          <button
            disabled={!confirmEmail || !agreeTerms}
            onClick={onProceed}
            className={`rounded-md px-8 py-2 text-md font-medium text-white
              ${
                confirmEmail && agreeTerms
                  ? "bg-black hover:bg-[#08184b]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
