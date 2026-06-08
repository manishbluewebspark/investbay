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
            <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
                <div 
                    ref={popupRef}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white rounded-t-2xl">
                        <h3 className="text-xl font-['Aileron_Black'] font-bold text-gray-900">
                            Research Analyst Service Agreement
                        </h3>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Terms Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                        {termsHtml ? (
                            <div 
                                dangerouslySetInnerHTML={{ __html: termsHtml }}
                                className="terms-content prose prose-sm max-w-none"
                            />
                        ) : (
                            <div className="flex items-center justify-center py-20">
                                <div className="relative inline-flex">
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-200" />
                                    <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                                </div>
                                <p className="ml-3 text-gray-500">Loading terms...</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl">
                        {/* Signature Upload Section */}
                        <div className={`mb-6 p-5 rounded-xl transition-all duration-300 ${
                            signatureUploaded 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-gray-50 border border-gray-200'
                        }`}>
                            <h4 className={`font-['Aileron_Black'] font-semibold mb-2 flex items-center gap-2 ${
                                signatureUploaded ? 'text-green-800' : 'text-gray-800'
                            }`}>
                                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">1</span>
                                Upload Your Signature
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Please upload your signature to complete the agreement
                            </p>
                            
                            {!signatureUploaded ? (
                                <button
                                    onClick={handleUploadClick}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-['Aileron_Black'] font-semibold"
                                >
                                    Upload Signature
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 text-green-700 bg-green-100 p-4 rounded-xl">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium">Signature uploaded successfully!</span>
                                </div>
                            )}
                        </div>

                        {/* Terms Agreement Section */}
                        <div className={`mb-6 p-5 rounded-xl transition-all duration-300 ${
                            signatureUploaded 
                                ? 'bg-gray-50 border border-gray-200' 
                                : 'bg-gray-100 border border-gray-200 opacity-60'
                        }`}>
                            <h4 className={`font-['Aileron_Black'] font-semibold mb-3 flex items-center gap-2 ${
                                signatureUploaded ? 'text-gray-800' : 'text-gray-500'
                            }`}>
                                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">2</span>
                                Accept Terms & Conditions
                            </h4>
                            <label className={`flex items-start gap-3 cursor-pointer ${!signatureUploaded && 'cursor-not-allowed'}`}>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                    disabled={!signatureUploaded}
                                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2"
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
                                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAgreeAndProceed}
                                disabled={!isChecked || !signatureUploaded}
                                className={`px-6 py-2.5 rounded-xl font-['Aileron_Black'] font-semibold transition-all duration-300 ${
                                    isChecked && signatureUploaded
                                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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

            {/* Global styles for terms content */}
            <style jsx global>{`
                .terms-content {
                    color: #374151;
                    line-height: 1.6;
                }
                .terms-content h1, 
                .terms-content h2, 
                .terms-content h3, 
                .terms-content h4 {
                    font-family: 'Aileron Black', system-ui, -apple-system, sans-serif;
                    color: #111827;
                    margin-top: 1.5em;
                    margin-bottom: 0.75em;
                }
                .terms-content h1 { font-size: 1.5rem; }
                .terms-content h2 { font-size: 1.25rem; }
                .terms-content h3 { font-size: 1.125rem; }
                .terms-content p {
                    margin-bottom: 1em;
                    color: #4b5563;
                }
                .terms-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1em 0;
                }
                .terms-content th,
                .terms-content td {
                    border: 1px solid #e5e7eb;
                    padding: 0.5rem;
                    text-align: left;
                }
                .terms-content th {
                    background-color: #f9fafb;
                    font-weight: 600;
                }
                .terms-content strong {
                    color: #111827;
                }
            `}</style>
        </>
    );
}