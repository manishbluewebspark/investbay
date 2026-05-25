import React from "react";
import SignalCard from "./SignalCard";

export default function RecentSignalsSection({
    signals,
    signalLoading,
    signalError,
    refreshSignals,
}) {
    return (
        <div className="mt-10">
            <h1 className="text-2xl font-semibold mb-6">Recent Signals</h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 place-items-center">
                {!signalLoading && !signalError && signals.length > 0 ? (
                    signals.map((signal, index) => (
                        <SignalCard
                            key={signal.id || index}
                            signal={signal}
                            index={index}
                        />
                    ))
                ) : !signalLoading && !signalError ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-gray-600">No signals available</p>
                        <button
                            onClick={refreshSignals}
                            className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        >
                            Refresh
                        </button>
                    </div>
                ) : signalLoading ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-gray-500">Loading signals...</p>
                    </div>
                ) : signalError ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-500">{signalError}</p>
                        <button
                            onClick={refreshSignals}
                            className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        >
                            Retry
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}