import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Upload, CircleCheck, Info,
} from "lucide-react";

// ── constants ─────────────────────────────────────────────────────────────────
const STEPS = ["Personal", "Address", "Bank", "Documents", "Review"];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

// ── shared primitives ─────────────────────────────────────────────────────────
const labelCls = "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";
const inputCls = (err) =>
  `w-full border ${err ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"} rounded-xl px-3.5 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all`;
const errCls = "text-red-500 text-[11px] mt-1";

function Field({ label, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-0">
      <label className={labelCls}>{label}{required && <span className="text-red-500 normal-case ml-0.5">*</span>}</label>
      {children}
      {error && <p className={errCls}>{error}</p>}
      {hint && !error && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Pills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)}
          className={`px-3.5 py-1.5 rounded-lg border text-[13px] transition-all ${value === v ? "border-green-500 bg-green-50 text-green-700 font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

function Checkbox({ checked, onChange, label, sub }) {
  return (
    <div onClick={onChange}
      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${checked ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checked ? "bg-green-600 border-green-600" : "border-gray-300 bg-white"}`}>
        {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
      </div>
      <div>
        <p className="text-[13px] text-gray-800 font-medium leading-snug">{label}</p>
        {sub && <p className="text-[12px] text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function UploadZone({ label, file, onChange, accept }) {
  const ref = useRef();
  return (
    <div onClick={() => ref.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${file ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-green-400 hover:bg-green-50"}`}>
      <div className={`w-10 h-10 rounded-xl mx-auto mb-2.5 flex items-center justify-center ${file ? "bg-green-100" : "bg-gray-100"}`}>
        {file ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Upload className="w-5 h-5 text-gray-400" />}
      </div>
      <p className="text-[13px] font-semibold text-gray-800 mb-0.5">{label}</p>
      {file
        ? <p className="text-[12px] text-green-600 font-medium">{file.name}</p>
        : <p className="text-[12px] text-gray-400">JPG, PNG or PDF · max 5 MB</p>}
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => { if (e.target.files[0]) onChange(e.target.files[0]); }} />
    </div>
  );
}

// ── Step components ───────────────────────────────────────────────────────────
function StepPersonal({ data, onChange }) {
  return (
    <div className="space-y-5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100">Identity</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <input className={inputCls()} value={data.name} onChange={e => onChange("name", e.target.value)} placeholder="As per PAN card" />
        </Field>
        <Field label="Date of Birth" required>
          <input type="date" className={inputCls()} value={data.dob} onChange={e => onChange("dob", e.target.value)} />
        </Field>
        <Field label="PAN Number" required hint="ABCDE1234F format">
          <input className={inputCls()} value={data.pan} onChange={e => onChange("pan", e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
        </Field>
        <Field label="Aadhar Number" required>
          <input className={inputCls()} value={data.aadhar} onChange={e => onChange("aadhar", e.target.value)} placeholder="12-digit Aadhar" maxLength={12} />
        </Field>
      </div>
      <Field label="Gender">
        <Pills options={[["male", "Male"], ["female", "Female"], ["other", "Other"]]} value={data.gender} onChange={v => onChange("gender", v)} />
      </Field>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100 mt-2">Contact</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email Address" required>
          <input type="email" className={inputCls()} value={data.email} onChange={e => onChange("email", e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Mobile Number" required>
          <input type="tel" className={inputCls()} value={data.mobile} onChange={e => onChange("mobile", e.target.value)} placeholder="10-digit number" maxLength={10} />
        </Field>
      </div>
    </div>
  );
}

function StepAddress({ data, onChange }) {
  return (
    <div className="space-y-5">
      <Field label="Address Type">
        <Pills options={[["permanent", "Own"], ["rented", "Rented"], ["company", "Company"]]} value={data.type} onChange={v => onChange("type", v)} />
      </Field>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100">Permanent Address</p>
      <Field label="Address Line 1" required>
        <input className={inputCls()} value={data.addr1} onChange={e => onChange("addr1", e.target.value)} placeholder="Flat / House no., Building" />
      </Field>
      <Field label="Address Line 2">
        <input className={inputCls()} value={data.addr2} onChange={e => onChange("addr2", e.target.value)} placeholder="Street, Area, Locality" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="City" required>
          <input className={inputCls()} value={data.city} onChange={e => onChange("city", e.target.value)} placeholder="City" />
        </Field>
        <Field label="State" required>
          <select className={inputCls()} value={data.state} onChange={e => onChange("state", e.target.value)}>
            <option value="">Select</option>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="PIN Code" required>
          <input className={inputCls()} value={data.pin} onChange={e => onChange("pin", e.target.value)} placeholder="6-digit" maxLength={6} />
        </Field>
      </div>
      <Checkbox checked={data.sameCorr} onChange={() => onChange("sameCorr", !data.sameCorr)}
        label="Correspondence address same as permanent" />
    </div>
  );
}

function StepBank({ data, onChange }) {
  return (
    <div className="space-y-5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100">Bank Account</p>
      <Field label="Bank Name" required>
        <input className={inputCls()} value={data.bankName} onChange={e => onChange("bankName", e.target.value)} placeholder="E.g. HDFC Bank" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Account Number" required>
          <input className={inputCls()} value={data.acno} onChange={e => onChange("acno", e.target.value)} placeholder="Enter account number" />
        </Field>
        <Field label="IFSC Code" required hint="11-character code">
          <input className={inputCls()} value={data.ifsc} onChange={e => onChange("ifsc", e.target.value.toUpperCase())} placeholder="HDFC0001234" maxLength={11} />
        </Field>
      </div>
      <Field label="Account Type">
        <Pills options={[["savings", "Savings"], ["current", "Current"], ["nro", "NRO"]]} value={data.actype} onChange={v => onChange("actype", v)} />
      </Field>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100 mt-2">Nominee</p>
      <Checkbox checked={data.addNominee} onChange={() => onChange("addNominee", !data.addNominee)}
        label="Add a nominee to this account" sub="Recommended for your protection" />
      {data.addNominee && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nominee Name">
            <input className={inputCls()} value={data.nomName} onChange={e => onChange("nomName", e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Relationship">
            <select className={inputCls()} value={data.relation} onChange={e => onChange("relation", e.target.value)}>
              <option value="">Select</option>
              {["Spouse", "Child", "Parent", "Sibling", "Other"].map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
        </div>
      )}
    </div>
  );
}

function StepDocuments({ data, onChange }) {
  return (
    <div className="space-y-5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100">Identity Documents</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UploadZone label="PAN Card" file={data.panFile} onChange={f => onChange("panFile", f)} accept="image/*,.pdf" />
        <UploadZone label="Aadhar Card" file={data.aadharFile} onChange={f => onChange("aadharFile", f)} accept="image/*,.pdf" />
      </div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100">Photos</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UploadZone label="Passport Photo" file={data.photo} onChange={f => onChange("photo", f)} accept="image/*" />
        <UploadZone label="Live Selfie" file={data.selfie} onChange={f => onChange("selfie", f)} accept="image/*" />
      </div>
      <div className="flex items-start gap-2.5 p-3.5 bg-green-50 border border-green-200 rounded-xl">
        <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
        <p className="text-[12px] text-green-700 leading-relaxed">
          Documents are encrypted and stored securely. Used only for KYC verification as per SEBI guidelines. Max 5 MB per file.
        </p>
      </div>
    </div>
  );
}

function StepReview({ personal, address, bank, agree, onAgree }) {
  const Section = ({ title, rows }) => (
    <div className="mb-4">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
      <div className="bg-gray-50 border border-gray-100 rounded-xl divide-y divide-gray-100 px-4">
        {rows.map(([l, v]) => (
          <div key={l} className="flex justify-between items-center py-2.5">
            <span className="text-[12px] text-gray-500">{l}</span>
            <span className="text-[13px] font-medium text-gray-900">{v || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="space-y-2">
      <Section title="Personal" rows={[
        ["Full Name", personal.name],
        ["Date of Birth", personal.dob],
        ["PAN", personal.pan ? <code className="bg-gray-100 px-2 py-0.5 rounded text-[12px] font-mono">{personal.pan}</code> : null],
        ["Aadhar", personal.aadhar ? `XXXX XXXX ${personal.aadhar.slice(-4)}` : null],
        ["Email", personal.email],
        ["Mobile", personal.mobile],
      ]} />
      <Section title="Address" rows={[
        ["Line 1", address.addr1],
        ["City / State", [address.city, address.state].filter(Boolean).join(", ")],
        ["PIN", address.pin],
      ]} />
      <Section title="Bank" rows={[
        ["Bank", bank.bankName],
        ["Account No.", bank.acno ? `••••${bank.acno.slice(-4)}` : null],
        ["IFSC", bank.ifsc ? <code className="bg-gray-100 px-2 py-0.5 rounded text-[12px] font-mono">{bank.ifsc}</code> : null],
        ["Type", bank.actype],
      ]} />
      <Checkbox checked={agree} onChange={onAgree}
        label="I confirm that all information provided is accurate and complete"
        sub="By submitting, you agree to InvestBay's KYC Terms & Privacy Policy" />
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ email, onReset }) {
  const ref = `KYC-${Math.floor(Math.random() * 900000 + 100000)}`;
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mb-5">
        <CircleCheck className="w-8 h-8 text-green-600" strokeWidth={1.6} />
      </div>
      <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 22, color: "#111827", letterSpacing: "-0.02em", marginBottom: 8 }}>
        KYC Submitted!
      </h2>
      <p className="text-[14px] text-gray-500 leading-relaxed mb-6 max-w-sm">
        Your application is under review. We'll notify you at <strong className="text-gray-800">{email || "your email"}</strong> within 24–48 hours.
      </p>
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 mb-8">
        <p className="text-[12px] text-gray-400 mb-1">Reference Number</p>
        <code className="text-[15px] font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">{ref}</code>
      </div>
      <button onClick={onReset}
        className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-green-600 text-white text-[13px] font-bold transition-all"
        style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
        Start New KYC
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function UserKYC() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [agree, setAgree] = useState(false);

  const [personal, setPersonal] = useState({ name: "", dob: "", pan: "", aadhar: "", gender: "", email: "", mobile: "" });
  const [address, setAddress] = useState({ type: "permanent", addr1: "", addr2: "", city: "", state: "", pin: "", sameCorr: false });
  const [bank, setBank] = useState({ bankName: "", acno: "", ifsc: "", actype: "savings", addNominee: false, nomName: "", relation: "" });
  const [documents, setDocuments] = useState({ panFile: null, aadharFile: null, photo: null, selfie: null });

  const pct = Math.round((step / STEPS.length) * 100);

  const stepTitles = [
    ["Personal Details", "Full name, PAN, Aadhar & contact info"],
    ["Address Details", "Permanent and correspondence address"],
    ["Bank Details", "Bank account and nominee information"],
    ["Document Upload", "PAN, Aadhar, photo and live selfie"],
    ["Review & Submit", "Confirm your KYC information before submitting"],
  ];

  const nextLabels = ["Save & Continue", "Save & Continue", "Save & Continue", "Upload & Continue", "Submit KYC"];

  const handleNext = () => {
    if (step === STEPS.length - 1) {
      if (!agree) { alert("Please confirm the declaration before submitting."); return; }
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>
      <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-lg shadow-[0_4px_32px_rgba(0,0,0,0.06)]">
        <SuccessScreen email={personal.email} onReset={() => { setDone(false); setStep(0); setAgree(false); }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>

      <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-lg shadow-[0_4px_32px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Back link */}
        <button
          onClick={() => navigate("/user-kyc")}
          className="flex  gap-1.5 items-center px-6 py-3 text-[13px] text-gray-400 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to information
        </button>


        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 17, color: "#111827", letterSpacing: "-0.02em" }}>
                {stepTitles[step][0]}
              </h1>
              <p className="text-[12px] text-gray-400 mt-0.5">{stepTitles[step][1]}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-[11px] font-semibold text-green-700 flex-shrink-0">
              <ShieldCheck className="w-3 h-3" /> Secure KYC
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center px-6 py-3 bg-gray-50 border-b border-gray-100 overflow-x-auto gap-0" style={{ scrollbarWidth: "none" }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className="flex items-center gap-1.5 flex-shrink-0"
                style={{ cursor: i <= step ? "pointer" : "default", opacity: i > step ? 0.4 : 1 }}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all flex-shrink-0 ${i < step ? "bg-green-600 border-green-600 text-white"
                    : i === step ? "bg-gray-900 border-gray-900 text-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  }`}>
                  {i < step ? "✓" : i + 1}
                </span>
                <span className={`text-[11px] font-semibold whitespace-nowrap ${i === step ? "text-gray-900" : i < step ? "text-green-600" : "text-gray-400"}`}>
                  {s}
                </span>
              </button>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-2 flex-shrink-0 min-w-[12px]" />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {step === 0 && <StepPersonal data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} />}
          {step === 1 && <StepAddress data={address} onChange={(k, v) => setAddress(p => ({ ...p, [k]: v }))} />}
          {step === 2 && <StepBank data={bank} onChange={(k, v) => setBank(p => ({ ...p, [k]: v }))} />}
          {step === 3 && <StepDocuments data={documents} onChange={(k, v) => setDocuments(p => ({ ...p, [k]: v }))} />}
          {step === 4 && <StepReview personal={personal} address={address} bank={bank} agree={agree} onAgree={() => setAgree(a => !a)} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-green-600 text-white text-[13px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.3)]"
            style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}
          >
            {nextLabels[step]} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}