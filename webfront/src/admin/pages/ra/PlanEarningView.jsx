import { useLocation, Navigate } from "react-router-dom";

export default function PlanEarningView() {
  const { state } = useLocation();

  if (!state) return <Navigate to="/admin/earnings" />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl border border-gray-300 shadow-sm">

        {/* Purchase Details */}
        <div className="p-6 border-b border-gray-300">
          <h3 className="text-lg font-semibold mb-4">
            Purchase Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-md">
            <Info label="User Name" value={state.name} />
            <Info label="Type" value="Plan" />
            <Info label="Transaction ID" value={state.transactionId} />

            <Info label="Plan / Course Name" value={state.plan} />
            <Info
              label="Segment"
              value={state.segment || "Equity / F&O / Commodity"}
            />
            <Info
              label="Subscription Type"
              value={state.subscriptionType || "Monthly"}
            />

            <Info label="Purchase Date" value={state.purchaseDate || state.date} />
            <Info label="Expiry Date" value={state.expiryDate || "12-Apr-2025"} />
            <Info
              label="Phone Number"
              value={state.phone || "98xxxx321"}
            />

            <Info label="Email" value={state.email} />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Payment Summary</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600">
              ● Paid
            </span>
          </div>

          <div className="space-y-3 text-md">
            <Row label="Gross Amount" value={`₹${state.grossAmount}`} />
            <Row label="Platform Fee Amt" value={`₹${state.platformFee}`} />
            <Row
              label="Net Amount"
              value={`₹${state.netAmount}`}
              bold
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helpers (UNCHANGED) */
const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const Row = ({ label, value, bold }) => (
  <div
    className={`flex justify-between ${
      bold ? "font-semibold border-t border-gray-300 pt-3" : ""
    }`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);
