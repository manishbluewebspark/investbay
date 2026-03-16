import { X } from 'lucide-react';
import UploadSignatureModal from "../admin/components/modals/UploadSignatureModal";
import { useEffect, useRef, useState } from 'react';


export default function TermsPopup({ 
    isOpen, 
    onClose, 
    onAgree, 
    onSignatureComplete, 
    termsHtml 
}) {
    const popupRef = useRef(null);
    const [isChecked, setIsChecked] = useState(false);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signatureUploaded, setSignatureUploaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsChecked(false);
            setSignatureUploaded(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const signatureModal = document.querySelector('[data-signature-modal]');
            if (popupRef.current && !popupRef.current.contains(event.target) && 
                (!signatureModal || !signatureModal.contains(event.target))) {
                onClose();
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleUploadClick = () => {
        setShowSignatureModal(true);
    };

    const handleSignatureComplete = async (file) => {
        if (onSignatureComplete) {
            await onSignatureComplete(file);
        }
        setSignatureUploaded(true);
        setShowSignatureModal(false);
    };

    const handleSignatureCancel = () => {
        setShowSignatureModal(false);
    };

    const handleAgreeAndProceed = () => {
        if (isChecked && signatureUploaded) {
            onAgree();
        }
    };

    // ✅ Check karo ki termsHtml mein dono signatures hain ya nahi
    useEffect(() => {
        if (termsHtml) {
            console.log('Terms HTML contains RA signature?', termsHtml.includes('RA Signature'));
            console.log('Terms HTML contains User signature?', termsHtml.includes('User Signature'));
        }
    }, [termsHtml]);

    if (!isOpen) return null;

    return (
        <>
            {/* Terms Modal */}
            <div className="fixed inset-0 z-[9999] backdrop-blur-sm bg-black/50 flex items-center justify-center p-4">
                <div 
                    ref={popupRef}
                    className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Research Analyst Service Agreement
                        </h3>
                        <button 
                            onClick={onClose}
                            className="p-1 hover:bg-gray-200 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Terms Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {termsHtml ? (
                            <div 
                                dangerouslySetInnerHTML={{ __html: termsHtml }}
                                className="terms-content prose max-w-none"
                            />
                        ) : (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="ml-3 text-gray-600">Loading terms...</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-gray-50 rounded-b-lg">
                        {/* Signature Upload Section */}
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Step 1: Upload Your Signature</h4>
                            <p className="text-sm text-blue-600 mb-3">Please upload your signature first to proceed</p>
                            
                            {!signatureUploaded ? (
                                <button
                                    onClick={handleUploadClick}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    Click here to Upload Signature
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium">Signature uploaded successfully! ✓</span>
                                </div>
                            )}
                        </div>

                        {/* Terms Agreement Section */}
                        <div className={`mb-4 p-4 rounded-lg border ${signatureUploaded ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                            <h4 className={`font-semibold mb-2 ${signatureUploaded ? 'text-gray-800' : 'text-gray-500'}`}>
                                Step 2: Accept Terms & Conditions
                            </h4>
                            <label className={`flex items-start gap-3 cursor-pointer ${!signatureUploaded && 'cursor-not-allowed'}`}>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                    disabled={!signatureUploaded}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className={`text-sm ${signatureUploaded ? 'text-gray-700' : 'text-gray-400'}`}>
                                    I have read and agree to the terms and conditions above
                                </span>
                            </label>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAgreeAndProceed}
                                disabled={!isChecked || !signatureUploaded}
                                className={`px-6 py-2 rounded-lg font-medium transition ${
                                    isChecked && signatureUploaded
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Modal */}
            {showSignatureModal && (
                <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4" data-signature-modal>
                    <UploadSignatureModal
                        open={showSignatureModal}    
                        onClose={handleSignatureCancel}    
                        onProceed={handleSignatureComplete}
                    />
                </div>
            )}
        </>
    );
}