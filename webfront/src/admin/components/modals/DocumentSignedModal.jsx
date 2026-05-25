import { CheckCircle } from "lucide-react";

export default function DocumentSignedModal({
  open,
  onDownload,
  onNext,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={56} className="text-green-500" />
          </div>
        </div>

        {/* Text */}
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          Document Signed Successfully
        </h2>

        <p className="mb-1 text-md text-gray-500">
          Transaction ID: 123a1234b123c123456d1234
        </p>

        <p className="mb-8 text-md text-gray-500">
          Issued by: Company name
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onDownload}
            className="rounded-md border border-gray-300 px-8 py-2 text-md text-gray-600 hover:bg-gray-100"
          >
            Download
          </button>

          <button
            onClick={onNext}
            className="rounded-md bg-black px-10 py-2 text-md font-medium text-white hover:bg-gray-900"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
