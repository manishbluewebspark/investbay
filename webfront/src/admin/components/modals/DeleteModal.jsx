import deleteIcon from "../../../assets/card/deleteModal.svg";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Delete Plan ?",
  description = "This action will permanently remove the plan and it will no longer be visible to users.",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[380px] p-6">
        <img src={deleteIcon} alt="Delete Icon" className="w-12 h-12 mb-4 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2 items-center text-center">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          {description}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-14 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="px-14 py-2 text-sm rounded-lg bg-black text-white hover:bg-=black-700 transition cursor-pointer"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
