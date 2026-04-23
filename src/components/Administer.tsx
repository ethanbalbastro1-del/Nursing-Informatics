import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Wifi, 
  ScanBarcode, 
  CheckCircle2, 
  X,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  User,
  Pill
} from 'lucide-react';
import { Patient, Medication } from '../types';

interface AdministerProps {
  patients: Patient[];
  context: { patientId: string; medId: string } | null;
  onComplete: (patientId: string, medId: string) => void;
  onCancel: () => void;
}

type Step = 'TAP_PATIENT' | 'SCAN_MED' | 'VERIFY_RIGHTS' | 'CONFIRM';

export default function Administer({ patients, context, onComplete, onCancel }: AdministerProps) {
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(context ? patients.find(p => p.id === context.patientId) || null : null);
  const [medicine, setMedicine] = useState<Medication | null>(context && patient ? patient.medications.find(m => m.id === context.medId) || null : null);

  const [rights, setRights] = useState([
    { id: 'patient', label: 'Right Patient', desc: 'Verify IDENTITY using two unique identifiers (Name, DOB, ID).', checked: false },
    { id: 'drug', label: 'Right Medication', desc: 'Match medication label to the electronic prescription/MAR.', checked: false },
    { id: 'dose', label: 'Right Dose', desc: 'Confirm dosage is correct and appropriate for the patient.', checked: false },
    { id: 'route', label: 'Right Route', desc: 'Verify the route of administration (IV, PO, IM, etc.).', checked: false },
    { id: 'time', label: 'Right Time', desc: 'Ensure administration is within the allowanced window.', checked: false },
    { id: 'doc', label: 'Right Documentation', desc: 'Ensure accurate real-time logging of the administration.', checked: false },
    { id: 'reason', label: 'Right Reason', desc: 'Confirm the medication is for the diagnosed condition.', checked: false },
    { id: 'response', label: 'Right Response', desc: 'Monitor and document intended effect and side effects.', checked: false },
    { id: 'educate', label: 'Right Education', desc: 'Explain the drug purpose and potential effects to patient.', checked: false },
    { id: 'refuse', label: 'Right to Refuse', desc: 'Verify the patient is willing and hasn\'t refused.', checked: false },
    { id: 'history', label: 'Right History', desc: 'Check for allergies and relevant medical history.', checked: false },
    { id: 'expiry', label: 'Right Expiration', desc: 'Confirm medication is not expired or compromised.', checked: false },
    { id: 'tech', label: 'Right Technique', desc: 'Use proper clinical technique for administration.', checked: false },
    { id: 'env', label: 'Right Environment', desc: 'Ensure clean and safe administration environment.', checked: false }
  ]);

  useEffect(() => {
    if (context) setStep(3); // Start at verification if called from MAR
  }, [context]);

  const toggleRight = (id: string) => {
    setRights(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const handlePatientVerified = (p: Patient) => {
    setIsScanning(true);
    setTimeout(() => {
      setPatient(p);
      setIsScanning(false);
      setStep(2);
    }, 1000);
  };

  const handleMedVerified = (m: Medication) => {
    setIsScanning(true);
    setTimeout(() => {
      setMedicine(m);
      setIsScanning(false);
      setStep(3);
    }, 1000);
  };

  const checkedCount = rights.filter(r => r.checked).length;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-dark tracking-tight">Medication Administration</h2>
          <p className="text-sm text-slate-light font-bold uppercase tracking-widest mt-1">Safety Verification Protocol</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-3 bg-white rounded-2xl text-slate-light hover:text-red-500 transition-colors shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-10 px-4">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                step >= s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-300 border border-slate-100'
              }`}>
                {step > s ? <CheckCircle2 size={18} /> : s}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${step >= s ? 'text-primary' : 'text-slate-light'}`}>
                {['Patient', 'Medicine', 'Rights', 'Confirm'][s-1]}
              </span>
            </div>
            {s < 4 && <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${step > s ? 'bg-primary' : 'bg-slate-300/20'}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="glass-card p-10 md:p-16 min-h-[500px] flex flex-col items-center relative overflow-hidden"
        >
          {step === 1 && (
            <div className="w-full space-y-10">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                  <User size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-dark tracking-tight italic">Verify Patient Identity</h3>
                <p className="text-slate-light font-medium max-w-sm mx-auto">
                   Please scan the patient's NFC wristband or barcode to confirm identity.
                </p>
              </div>

              <div className="flex flex-col items-center gap-8 py-6">
                <div className="ripple-container w-full h-48">
                   <div className="ripple-circle w-32 h-32 opacity-20 border-dashed animate-spin-slow" />
                   <div className="ripple-circle w-40 h-40 opacity-10 border-dashed animate-spin-slow-reverse" />
                   <button 
                     onClick={() => handlePatientVerified(patients[0])}
                     disabled={isScanning}
                     className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 transition-all shadow-2xl relative z-10 ${
                       isScanning ? 'bg-secondary' : 'bg-primary hover:scale-105'
                     }`}
                   >
                     {isScanning ? (
                       <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
                     ) : (
                       <>
                         <Wifi size={32} className="text-white" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">Scan Tag</span>
                       </>
                     )}
                   </button>
                </div>

                <div className="w-full pt-8 border-t border-slate-100">
                  <p className="text-[10px] text-slate-light font-black uppercase tracking-widest text-center mb-6">Select patient manually</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patients.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => handlePatientVerified(p)}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all text-left flex items-center gap-4 group"
                      >
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            {p.name.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-dark">{p.name}</p>
                            <p className="text-[10px] text-slate-light font-bold uppercase">{p.room}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && patient && (
            <div className="w-full space-y-10">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                  <ScanBarcode size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-dark tracking-tight">Identify Medication</h3>
                <p className="text-slate-light font-medium">
                   Current Patient: <span className="text-primary font-black">{patient.name}</span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-10">
                <div 
                  className="w-full max-w-sm h-48 bg-slate-100 rounded-3xl border-2 border-slate-200 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden relative"
                  onClick={() => handleMedVerified(patient.medications[0])}
                >
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-red-400/30 animate-scan z-10" />
                  <ScanBarcode size={48} className="text-slate-300 group-hover:text-primary transition-colors duration-500 mb-2" />
                  <p className="text-[10px] font-bold text-slate-light uppercase tracking-widest group-hover:text-primary">Point scanner at barcode</p>
                </div>

                <div className="w-full space-y-4">
                  <p className="text-[10px] text-slate-light font-black uppercase tracking-widest">Scheduled Medications for {patient.name}</p>
                  <div className="grid gap-3">
                    {patient.medications.map(m => (
                      <button 
                        key={m.id}
                        onClick={() => handleMedVerified(m)}
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-primary transition-all flex items-center justify-between group"
                      >
                         <div className="flex items-center gap-4 text-left">
                            <div className="p-2 bg-white rounded-xl text-primary border border-slate-100 group-hover:border-primary transition-colors">
                               <Pill size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-dark">{m.name}</p>
                               <p className="text-[10px] text-slate-light font-bold uppercase">{m.dose} • {m.route}</p>
                            </div>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-black text-slate-dark italic">{m.time}</p>
                           <p className={`text-[9px] font-black uppercase tracking-widest ${m.status === 'Overdue' ? 'text-red-500' : 'text-primary'}`}>{m.status}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && patient && medicine && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                 <div>
                    <h3 className="text-xl font-black text-slate-dark tracking-tight">14 Rights Verification</h3>
                    <p className="text-[10px] text-slate-light font-bold uppercase tracking-widest">Clinical Safety Protocol</p>
                 </div>
                 <div className="text-right bg-primary/10 px-4 py-2 rounded-2xl">
                    <p className="text-[8px] text-primary font-black uppercase tracking-widest">Matching Data</p>
                    <p className="text-xs font-black text-primary italic">{medicine.name}</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {rights.map((right) => (
                  <button
                    key={right.id}
                    onClick={() => toggleRight(right.id)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${
                      right.checked 
                        ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' 
                        : 'bg-white border-slate-100 hover:border-primary/30'
                    }`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      right.checked ? 'bg-primary text-white' : 'bg-slate-50 text-slate-200'
                    }`}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${right.checked ? 'text-primary' : 'text-slate-light'}`}>
                        {right.label}
                      </h4>
                      <p className="text-xs font-bold text-slate-dark leading-tight group-hover:text-primary transition-colors">{right.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                 <div className="text-sm font-bold text-slate-light">
                   {checkedCount} of {rights.length} Rights Verified
                 </div>
                 <button 
                   onClick={() => setStep(4)}
                   disabled={checkedCount < rights.length}
                   className="btn-primary px-8 py-3 rounded-2xl disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-primary/20"
                 >
                   Proceed to Sign <ArrowRight size={18} />
                 </button>
              </div>
            </div>
          )}

          {step === 4 && patient && medicine && (
            <div className="w-full space-y-10">
               <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black text-slate-dark tracking-tighter">Final Confirmation</h3>
                  <p className="text-sm text-slate-light font-medium uppercase tracking-widest">Electronic Signature Required</p>
               </div>

               <div className="grid grid-cols-2 gap-8 py-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-slate-light font-black uppercase tracking-widest mb-2">Patient</p>
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                         <p className="text-sm font-bold text-slate-dark">{patient.name}</p>
                         <p className="text-[10px] text-slate-light font-bold">{patient.room} • {patient.nfcId}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-light font-black uppercase tracking-widest mb-2">Medication</p>
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                         <p className="text-sm font-bold text-slate-dark">{medicine.name}</p>
                         <p className="text-[10px] text-slate-light font-bold italic">{medicine.dose} {medicine.route} • {medicine.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                     <div>
                        <p className="text-[10px] text-slate-light font-black uppercase tracking-widest mb-2">Security Hash</p>
                        <p className="text-[10px] font-mono font-bold text-slate-300 break-all leading-tight italic">
                          SHA-256: 8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
                        </p>
                     </div>
                     
                     <div className="px-6 py-4 bg-mint/50 rounded-2xl border border-primary/20 flex items-center gap-3">
                        <ShieldCheck size={24} className="text-primary" />
                        <p className="text-[10px] font-bold text-primary leading-tight uppercase tracking-tight italic">
                          All 14 clinical rights have been verified and documented digitally.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="w-full h-32 bg-slate-50 border-2 border-slate-100 border-dashed rounded-3xl flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')]">
                  <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">Sign with touch / stylus</p>
               </div>

               <div className="flex gap-4">
                 <button onClick={() => setStep(3)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-light hover:text-slate-dark">Edit Rights</button>
                 <button 
                  onClick={() => onComplete(patient!.id, medicine!.id)}
                  className="flex-[2] btn-primary py-4 rounded-2xl shadow-2xl shadow-primary/30"
                 >
                   Confirm Administration
                 </button>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
