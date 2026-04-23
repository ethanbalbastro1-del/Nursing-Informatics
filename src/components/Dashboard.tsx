import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  MapPin,
  Tag,
  Bed,
  CheckCircle,
  ChevronRight,
  Quote
} from 'lucide-react';
import { Patient, Nurse } from '../types';

interface DashboardProps {
  nurse: Nurse;
  patients: Patient[];
  onAdminister: (patientId: string, medId: string) => void;
}

export default function Dashboard({ nurse, patients, onAdminister }: DashboardProps) {
  const stats = [
    { label: 'My Patients', value: patients.length, icon: <Bed />, color: 'primary' },
    { 
      label: 'Tasks Remaining', 
      value: patients.reduce((acc, p) => acc + p.medications.filter(m => m.status === 'Due now').length, 0), 
      icon: <CheckCircle2 />, 
      color: 'secondary' 
    },
    { 
      label: 'New Results', 
      value: 3, 
      icon: <Clock />, 
      color: 'primary' 
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-slate-dark tracking-tight">Today's Overview</h2>
        <div className="flex items-center gap-2 text-sm text-slate-light font-bold uppercase tracking-wider">
           <span>Shift started at 07:00 AM</span>
           <span className="opacity-20">•</span>
           <span>Floor 3, Cardiology</span>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 25 }}
            className={`glass-card p-8 flex items-center justify-between group cursor-pointer hover:bg-white transition-all`}
          >
            <div>
              <p className="text-xs font-bold text-slate-light uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-5xl font-black text-slate-dark tracking-tighter">{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
              {React.cloneElement(stat.icon as React.ReactElement, { size: 28 })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Alerts and Huddle */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass-card p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-dark flex items-center gap-2">
               <AlertCircle size={20} className="text-red-500" /> Urgent Alerts
            </h3>
            <div className="space-y-4">
              <AlertItem 
                title="STAT Med" 
                time="2 mins ago" 
                desc="Room 304 - Doe, John. Epinephrine 1mg IV Push scheduled for 09:30 AM." 
                type="stat"
              />
              <AlertItem 
                title="Monitor Alarm" 
                time="10 mins ago" 
                desc="Room 312 - Smith, Sarah. Sustained tachycardia > 120bpm." 
                type="warn"
              />
            </div>
          </section>

          <section className="glass-card p-8 bg-mint/30 border-primary/10">
             <h3 className="text-lg font-black text-slate-dark flex items-center gap-2 mb-4">
                <Quote size={20} className="text-primary rotate-180" /> Shift Huddle
             </h3>
             <div className="border-l-2 border-primary pl-4 py-2">
                <p className="text-slate-light font-medium italic leading-relaxed">
                  "Remember to double-check patient armbands before administering Morning meds. New protocol starts today."
                </p>
             </div>
          </section>
        </div>

        {/* Right Column - Table and Tasks */}
        <div className="lg:col-span-8 space-y-8">
          <section className="glass-card overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-dark tracking-tight">Patient List</h3>
              <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-light uppercase tracking-widest">Patient & Room</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-light uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-light uppercase tracking-widest text-center">Next Med Due</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-light uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patients.map((patient) => {
                    const nextMed = patient.medications.find(m => m.status !== 'Administered') || patient.medications[0];
                    return (
                      <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-[10px] font-black uppercase">
                                 {patient.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-bold text-slate-dark">{patient.name}</p>
                                <p className="text-[10px] text-slate-light font-bold">{patient.room} • Dr. Evans</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${nextMed.status === 'Due now' ? 'bg-amber-500' : 'bg-primary'}`} />
                             <span className="text-xs font-bold text-slate-light">Stable</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <div className="inline-flex flex-col bg-slate-50 px-4 py-2 rounded-xl group-hover:bg-white transition-colors">
                              <span className="text-xs font-black text-slate-dark">{nextMed.time}</span>
                              <span className="text-[10px] text-slate-light font-bold uppercase truncate max-w-[100px]">{nextMed.name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {nextMed.status !== 'Administered' ? (
                            <button 
                              onClick={() => onAdminister(patient.id, nextMed.id)}
                              className="text-primary hover:scale-110 transition-transform inline-block"
                            >
                               <ChevronRight size={24} />
                            </button>
                          ) : (
                            <CheckCircle2 size={24} className="text-primary/30 ml-auto" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="glass-card p-8">
             <h3 className="text-xl font-bold text-slate-dark tracking-tight mb-8">Upcoming Tasks</h3>
             <div className="space-y-6">
                <TaskItem checked={false} label="Change dressing for Room 302" time="Due by 10:30 AM" />
                <TaskItem checked={false} label="Collect CBC draw for Room 308" time="Fasting required. Due by 11:00 AM" />
                <TaskItem checked={true} label="08:00 AM Vitals Round" time="Completed at 08:15 AM" />
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ title, time, desc, type }: { title: string, time: string, desc: string, type: 'stat' | 'warn' }) {
  return (
    <div className={`p-4 rounded-2xl border-l-[3px] shadow-sm ${type === 'stat' ? 'bg-red-50/50 border-red-500' : 'bg-white border-primary'}`}>
       <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${type === 'stat' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>{title}</span>
          <span className="text-[10px] text-slate-light font-bold">{time}</span>
       </div>
       <p className="text-xs font-bold text-slate-dark mb-1 leading-tight">{desc.split('.')[0]}.</p>
       <p className="text-[10px] text-slate-light leading-snug">{desc.split('.')[1]}</p>
    </div>
  );
}

function TaskItem({ checked, label, time }: { checked: boolean, label: string, time: string }) {
   return (
      <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${checked ? 'opacity-50' : 'hover:bg-slate-50'}`}>
         <div className={`w-6 h-6 rounded-md border-2 mt-0.5 flex items-center justify-center transition-all ${checked ? 'bg-primary border-primary text-white' : 'border-slate-200 bg-white'}`}>
            {checked && <CheckCircle2 size={14} />}
         </div>
         <div>
            <p className={`text-sm font-bold ${checked ? 'line-through text-slate-light' : 'text-slate-dark'}`}>{label}</p>
            <p className="text-xs text-slate-light font-medium">{time}</p>
         </div>
      </div>
   );
}
