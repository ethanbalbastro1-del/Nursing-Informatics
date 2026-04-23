import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search as SearchIcon, AlertTriangle, Info, Pill, ArrowRight, ShieldAlert, Activity } from 'lucide-react';
import { mockInventory } from '../data';

export default function Protocols() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(mockInventory[0]);

  const filteredDrugs = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-dark tracking-tight">Clinical Protocols</h2>
          <p className="text-sm text-slate-light font-bold uppercase tracking-widest mt-1">Drug Library & Guidelines</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search by drug or class..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-12 pr-4 py-3 bg-white/60 border border-slate-100 rounded-2xl text-sm font-bold w-64 focus:outline-none focus:border-primary transition-all"
             />
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 h-[calc(100vh-200px)]">
         <div className="lg:w-1/3 glass-card rounded-3xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/50 bg-white/30 backdrop-blur-md">
               <h3 className="text-[10px] font-black text-slate-light uppercase tracking-widest">Available Formularies</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
               {filteredDrugs.map(drug => (
                 <button 
                   key={drug.id}
                   onClick={() => setSelectedDrug(drug)}
                   className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group ${
                     selectedDrug.id === drug.id 
                     ? 'bg-primary border-primary text-white shadow-lg' 
                     : 'hover:bg-white border text-slate-dark border-transparent hover:border-slate-200'
                   }`}
                 >
                   <div>
                      <p className="font-bold text-sm tracking-tight">{drug.name}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedDrug.id === drug.id ? 'text-white/80' : 'text-slate-light'}`}>
                        {drug.category}
                      </p>
                   </div>
                   <ArrowRight size={16} className={`transition-transform ${selectedDrug.id === drug.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 text-primary group-hover:translate-x-0 group-hover:opacity-100'}`} />
                 </button>
               ))}
               {filteredDrugs.length === 0 && (
                 <div className="p-8 text-center text-slate-light font-bold text-sm">
                   No protocols found.
                 </div>
               )}
            </div>
         </div>

         <div className="lg:w-2/3 glass-card rounded-3xl overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
               <motion.div 
                 key={selectedDrug.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="h-full flex flex-col"
               >
                  <div className="p-8 border-b border-white/50 bg-white/30 backdrop-blur-md flex items-start justify-between">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                             <Pill size={20} />
                           </div>
                           <h3 className="text-3xl font-black text-slate-dark tracking-tight">{selectedDrug.name}</h3>
                        </div>
                        <span className="inline-block px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                          {selectedDrug.category}
                        </span>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                     <section>
                       <h4 className="text-[10px] text-slate-light font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                         <Activity size={14} className="text-primary"/> Indications & Dosage
                       </h4>
                       <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium text-slate-700 leading-relaxed shadow-sm">
                         <p>Standard dosing protocols for {selectedDrug.name} according to the latest clinical guidelines. Administer with care and verify patient allergies prior to administration.</p>
                         <ul className="mt-4 space-y-2 list-disc pl-5">
                           <li>Adult: Refer to patient MAR for specific calculated mg/kg dosing.</li>
                           <li>Route: Ensure correct administration route per physician orders.</li>
                           <li>Monitoring: Observe for 15 minutes post-administration for adverse reactions.</li>
                         </ul>
                       </div>
                     </section>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section>
                          <h4 className="text-[10px] text-slate-light font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <ShieldAlert size={14} className="text-amber-500"/> Contraindications
                          </h4>
                          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
                             <ul className="space-y-2 text-sm font-bold text-amber-800 list-disc pl-4">
                               <li>Known hypersensitivity</li>
                               <li>Severe renal impairment</li>
                               <li>Concurrent use of MAOIs</li>
                             </ul>
                          </div>
                        </section>

                        <section>
                          <h4 className="text-[10px] text-slate-light font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-500"/> Black Box Warning
                          </h4>
                          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
                             <p className="text-xs font-bold text-red-700 leading-relaxed">
                               Warning: May cause severe adverse reactions in patients with a history of cardiac arrhythmias. Continuous electrocardiographic monitoring is recommended during IV administration.
                             </p>
                          </div>
                        </section>
                     </div>

                     <section>
                       <h4 className="text-[10px] text-slate-light font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                         <Info size={14} className="text-blue-500"/> Nursing Considerations
                       </h4>
                       <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm space-y-3">
                          <p className="text-sm font-medium text-blue-900 leading-relaxed">
                            • Assess baseline vital signs before administration.<br />
                            • Instruct the patient to report any signs of rash, dizziness, or difficulty breathing immediately.<br />
                            • Document exact time and patient response in the MAR.
                          </p>
                       </div>
                     </section>
                  </div>
               </motion.div>
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
