import React from 'react';
import { X } from 'lucide-react';

const DeleteDynamicModal = ({ 
    open, 
    onClose, 
    onConfirm, 
    title = "Delete?", 
    description = "This action cannot be undone."
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m7-10V4a1 1 0 00-1-1h-4M9 3V2a1 1 0 00-1-1H5a1 1 0 00-1 1v1M21 7h-7" />
                        </svg>
                    </div>
                    <p className="text-center text-gray-700 text-md leading-relaxed">{description}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-md font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-md font-medium shadow-sm"
                    >
                        Delete Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDynamicModal;
