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
  ClipboardList,
  Plus,
  X
} from 'lucide-react';
import { Patient, Medication } from '../types';
import { mockInventory } from '../data';

interface PatientsMARProps {
  patients: Patient[];
  onAdminister: (patientId: string, medId: string) => void;
  onScheduleMed?: (patientId: string, medication: Omit<Medication, 'id'>) => void;
}

interface PatientCardProps {
  key?: string | number;
  patient: Patient;
  isExpanded: boolean;
  onToggle: () => void;
  onAdminister: (medId: string) => void;
  onScheduleClick: () => void;
}

export default function PatientsMAR({ patients, onAdminister, onScheduleMed }: PatientsMARProps) {
  const [expandedPatient, setExpandedPatient] = useState<string | null>(patients[0]?.id || null);
  const [schedulingPatientId, setSchedulingPatientId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPatient(expandedPatient === id ? null : id);
  };

  const handleScheduleSubmit = (medication: Omit<Medication, 'id'>) => {
    if (schedulingPatientId && onScheduleMed) {
      onScheduleMed(schedulingPatientId, medication);
    }
    setSchedulingPatientId(null);
  };

  return (
    <div className="space-y-8 pb-12 relative">
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
            onScheduleClick={() => setSchedulingPatientId(patient.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {schedulingPatientId && (
          <ScheduleModal 
             patient={patients.find(p => p.id === schedulingPatientId)!}
             onClose={() => setSchedulingPatientId(null)}
             onSubmit={handleScheduleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ScheduleModal({ patient, onClose, onSubmit }: { patient: Patient, onClose: () => void, onSubmit: (med: Omit<Medication, 'id'>) => void }) {
  const [selectedDrugId, setSelectedDrugId] = useState(mockInventory[0].id);
  const [dose, setDose] = useState('500mg');
  const [route, setRoute] = useState('Oral');
  const [frequency, setFrequency] = useState('Once Daily');
  const [time, setTime] = useState('08:00');

  const selectedDrug = mockInventory.find(d => d.id === selectedDrugId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrug) return;
    
    onSubmit({
      name: selectedDrug.name,
      dose,
      route,
      barcode: `BC-${Date.now()}`,
      nfcTag: `NFC-${Date.now()}`,
      time,
      frequency,
      status: 'Scheduled',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-slate-50 relative border-b border-slate-100 p-6">
           <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-dark transition-colors">
              <X size={24} />
           </button>
           <h3 className="text-xl font-black text-slate-dark tracking-tight mb-1">Schedule Medication</h3>
           <p className="text-xs text-slate-light font-bold uppercase tracking-widest">{patient.name}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div>
              <label className="block text-[10px] font-black text-slate-light uppercase tracking-widest mb-2">Medication (from Inventory)</label>
              <select 
                value={selectedDrugId} 
                onChange={e => setSelectedDrugId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
              >
                {mockInventory.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
           </div>
           <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-light uppercase tracking-widest mb-2">Dose</label>
                  <input 
                    type="text" 
                    value={dose} 
                    onChange={e => setDose(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
                    required
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-light uppercase tracking-widest mb-2">Route</label>
                  <select 
                    value={route} 
                    onChange={e => setRoute(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
                  >
                    <option>Oral</option>
                    <option>IV</option>
                    <option>Inhalation</option>
                    <option>IM</option>
                    <option>Subcutaneous</option>
                  </select>
               </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-light uppercase tracking-widest mb-2">Frequency</label>
                  <select 
                    value={frequency} 
                    onChange={e => setFrequency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
                  >
                    <option>Once Daily</option>
                    <option>Twice Daily</option>
                    <option>Every 4 hours PRN</option>
                    <option>Every 6 hours</option>
                    <option>Every 12 hours</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-light uppercase tracking-widest mb-2">Time to Administer</label>
                  <input 
                    type="time" 
                    value={time} 
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
                    required
                  />
               </div>
           </div>
           
           <div className="pt-4">
             <button type="submit" className="w-full btn-primary py-4 font-black tracking-widest uppercase text-sm">
               Add to Schedule
             </button>
           </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function PatientCard({ 
  patient, 
  isExpanded, 
  onToggle, 
  onAdminister,
  onScheduleClick
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
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-light">
                      <ClipboardList size={18} />
                   </div>
                   <h5 className="text-sm font-black text-slate-dark uppercase tracking-widest">Medication Administration Record</h5>
                </div>
                <div className="flex items-center gap-4">
                   <button 
                     onClick={onScheduleClick}
                     className="text-[10px] bg-primary/10 font-black text-primary px-3 py-2 rounded-lg uppercase tracking-widest flex items-center gap-1 hover:bg-primary hover:text-white transition-colors"
                   >
                     <Plus size={14} /> Schedule Med
                   </button>
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-primary transition-colors">
                     Sign Full MAR <ExternalLink size={12} />
                   </button>
                </div>
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

