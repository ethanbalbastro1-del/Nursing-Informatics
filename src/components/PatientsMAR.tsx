import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  MapPin, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Pill,
  Clock,
  ExternalLink,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Patient, Medication } from '../types';

interface PatientsMARProps {
  patients: Patient[];
  onAdminister: (patientId: string, medId: string) => void;
}

interface PatientCardProps {
  key?: string | number;
  patient: Patient;
  isExpanded: boolean;
  onToggle: () => void;
  onAdminister: (medId: string) => void;
}

export default function PatientsMAR({ patients, onAdminister }: PatientsMARProps) {
  const [expandedPatient, setExpandedPatient] = useState<string | null>(patients[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedPatient(expandedPatient === id ? null : id);
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
         <h2 className="text-4xl font-black text-slate-dark tracking-tight">Patients & MAR</h2>
         <p className="text-sm text-slate-light font-bold uppercase tracking-widest mt-1">Detailed Medication Records</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {patients.map((patient) => (
          <PatientCard 
            key={patient.id} 
            patient={patient} 
            isExpanded={expandedPatient === patient.id}
            onToggle={() => toggleExpand(patient.id)}
            onAdminister={(medId) => onAdminister(patient.id, medId)}
          />
        ))}
      </div>
    </div>
  );
}

function PatientCard({ 
  patient, 
  isExpanded, 
  onToggle, 
  onAdminister 
}: PatientCardProps) {
  return (
    <motion.div 
      layout
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="glass-card overflow-hidden group border-white/50"
    >
      <div 
        onClick={onToggle}
        className="p-8 cursor-pointer hover:bg-white transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/5 group-hover:scale-105 transition-transform">
             <span className="text-xl font-black">{patient.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-2xl font-black text-slate-dark tracking-tight">{patient.name}</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-slate-light flex items-center gap-1 font-bold uppercase py-1 px-3 bg-slate-50 rounded-full">
                <MapPin size={12} /> {patient.room}
              </span>
              <span className="text-[10px] text-primary flex items-center gap-1 font-mono font-black py-1 px-3 bg-primary/5 rounded-full border border-primary/10">
                <Tag size={12} /> {patient.nfcId}
              </span>
              <div className="flex gap-1">
                {patient.allergies.map(allergy => (
                  <span key={allergy} className="text-[9px] font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-tighter">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:block text-right mr-4 border-r border-slate-100 pr-6">
            <p className="text-[10px] text-slate-light font-bold uppercase tracking-widest mb-1">Diagnosis</p>
            <p className="text-sm font-black text-slate-dark">{patient.diagnoses.join(', ')}</p>
          </div>
          <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-primary text-white' : 'bg-slate-50 text-slate-light'}`}>
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>
      </div>

  <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-10 pt-4 overflow-x-auto">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-light">
                      <ClipboardList size={18} />
                   </div>
                   <h5 className="text-sm font-black text-slate-dark uppercase tracking-widest">Medication Administration Record</h5>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                  Sign Full MAR <ExternalLink size={12} />
                </button>
              </div>
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-light uppercase tracking-widest">Medication</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-light uppercase tracking-widest">Dose & Route</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-light uppercase tracking-widest">ID Code</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-light uppercase tracking-widest">Frequency</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-light uppercase tracking-widest">Schedule</th>
                    <th className="px-6 py-2 text-[10px] font-black text-slate-light uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="">
                  {patient.medications.map((med) => (
                    <tr key={med.id} className="bg-slate-50/50 hover:bg-white transition-all rounded-2xl">
                      <td className="px-6 py-4 rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl text-primary border border-slate-100">
                            <Pill size={16} />
                          </div>
                          <span className="font-black text-slate-dark text-sm">{med.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-light">
                        {med.dose} <span className="opacity-30 mx-1">|</span> <span className="uppercase text-primary font-black tracking-tighter">{med.route}</span>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-mono font-bold text-slate-light/60">
                        {med.barcode}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-light">
                        {med.frequency}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-dark font-black text-sm">
                          <Clock size={14} className="text-secondary" />
                          {med.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 rounded-r-2xl text-right">
                        {med.status !== 'Administered' ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAdminister(med.id); }}
                            className="bg-primary text-white p-2.5 rounded-full hover:scale-110 transition-all shadow-lg shadow-primary/20"
                          >
                            <ChevronRight size={18} />
                          </button>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-primary tracking-widest uppercase">Administered</span>
                            <span className="text-[9px] font-bold text-slate-light">{new Date(med.administeredAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    'Due now': 'bg-primary/10 text-primary border-primary/20',
    'Administered': 'bg-green-500/10 text-green-600 border-green-500/20',
    'Overdue': 'bg-red-500/10 text-red-600 border-red-500/20',
    'Scheduled': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  }[status] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${styles}`}>
      {status}
    </span>
  );
}

