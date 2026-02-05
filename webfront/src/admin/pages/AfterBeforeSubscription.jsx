import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import VerifyDetailsModal from "../components/modals/VerifyDetailsModal";
import TermsConditionsModal from "../components/modals/TermsConditionsModal";
import EsignOtpModal from "../components/modals/EsignOtpModal";
import UploadSignatureModal from "../components/modals/UploadSignatureModal";
import DocumentSignedModal from "../components/modals/DocumentSignedModal";

export default function AfterBeforeSubscription() {
    const [open, setOpen] = useState(false)
    const [terms, setTerms] = useState(false)
    const [otp, setOtp] = useState(false)
    const [uploadSignature, setUploadSignature] = useState(false)
    const [signed, setSigned] = useState(false)

    return ( 
        <div className="min-h-screen bg-gray-50 p-6 lg:px-40">
            <div className="max-w-full bg-white rounded-xl shadow-sm border border-gray-300 p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FaCircle className="text-green-500 text-sm" />
                        <h2 className="text-sm font-semibold text-gray-800">
                            HINDUNILVR30DEC252400CE
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Price Levels */}
                    <div className="border border-gray-300 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Price Levels
                        </h3>

                        <div className="space-y-3">
                            <Level label="Stop Loss" value="60" />
                            <Level label="Entry" value="100" active />
                            <Level label="Target 1" value="150" />
                            <Level label="Target 2" value="200" />
                        </div>
                    </div>

                    {/* Plan Details */}
                    <div className="lg:col-span-2 border border-gray-300 rounded-lg p-4 relative">
                        <span className="absolute top-4 right-4 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            ● Active
                        </span>

                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Plan Details
                        </h3>

                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <Detail label="Segment" value="F&O" />
                            <Detail label="Instrument" value="OPTSTK" />
                            <Detail label="Script" value="HINDUNILVR" />
                            <Detail label="Expiry" value="30DEC2025" />
                            <Detail label="Strike Price" value="2400" />
                            <Detail label="Instrument Type" value="CE" />
                            <Detail label="Duration" value="Intraday" />
                            <Detail label="Trade Direction" value="Buy" />
                            <Detail label="Date" value="12-Apr-2025" />
                            <Detail label="Time" value="10:00 AM" />
                            <Detail label="Current Status" value="NA" />
                            <Detail label="Subscription Plan" value="Options Intraday Pro" />
                            <Detail label="Risk" value="1:1" />
                        </div>
                    </div>
                </div>

                {/* Mentor */}
                <div className="border border-gray-300 rounded-lg p-4 mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://i.pravatar.cc/40"
                            alt="mentor"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                Amit Dwivedi
                            </p>
                            <p className="text-xs text-gray-500">Status - NA</p>
                        </div>
                    </div>

                    <button
                        // onClick={() => setOpen(true)}
                        // onClick={() => setTerms(true)}
                        // onClick={() => setOtp(true)}
                        // onClick={() => setUploadSignature(true)}
                        onClick={() => setSigned(true)}
                        className="border border-gray-300 px-4 py-1.5 rounded-full text-sm text-gray-700 hover:bg-gray-100">
                        View Plan
                    </button>
                </div>
            </div>

            <VerifyDetailsModal open={open} onClose={() => setOpen(false)} />

            <TermsConditionsModal open={terms} onClose={() => setTerms(false)} />

                <EsignOtpModal open={otp} onClose={() => setOtp(false)} />

                    <UploadSignatureModal open={uploadSignature} onClose={() => setUploadSignature(false)}/>

                        <DocumentSignedModal open={signed} onClose={() => setSigned(false)}/>
        </div>
    );
}

/* --------- Small Components ---------- */

const Level = ({ label, value, active }) => (
    <div
        className={`flex items-center justify-between px-4 py-2 rounded-md border ${active
                ? "bg-green-500 text-white border-green-500"
                : "bg-gray-50 text-gray-700"
            }`}
    >
        <span className="text-sm">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
    </div>
);

const Detail = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
    </div>
);
