import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Save, Shield, HardDrive, Smartphone } from 'lucide-react';
import { Nurse } from '../types';

interface SettingsProps {
  currentUser: Nurse;
  onUpdateUser: (updatedNurse: Nurse) => void;
}

export default function Settings({ currentUser, onUpdateUser }: SettingsProps) {
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({ ...currentUser, name, role });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-12 h-full flex flex-col max-w-4xl mx-auto w-full pt-8">
      <header>
        <h2 className="text-4xl font-black text-slate-dark tracking-tight">System Settings</h2>
        <p className="text-sm text-slate-light font-bold uppercase tracking-widest mt-1">Application & User Preferences</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
        
        {/* Profile Settings */}
        <div className="md:col-span-2 space-y-6">
          <section className="glass-card p-8">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <User size={24} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-dark">Active Duty Profile</h3>
                 <p className="text-xs text-slate-light font-bold uppercase tracking-widest mt-0.5">Manage current session user</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-slate-300 relative overflow-hidden group cursor-pointer">
                     <span className="text-3xl font-black uppercase">{name.charAt(0)}</span>
                     <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest text-center leading-tight transition-all">
                       Change Portrait
                     </div>
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                     <div>
                       <label className="block text-[10px] font-black text-slate-light uppercase tracking-widest mb-2">Display Name</label>
                       <input 
                         type="text" 
                         value={name} 
                         onChange={(e) => setName(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-light uppercase tracking-widest mb-2">Clinical Role</label>
                       <input 
                         type="text" 
                         value={role} 
                         onChange={(e) => setRole(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all"
                       />
                     </div>
                  </div>
               </div>

               <div className="pt-4 flex justify-end">
                 <button 
                   onClick={handleSave}
                   disabled={isSaving || (name === currentUser.name && role === currentUser.role)}
                   className="btn-primary w-full md:w-auto px-8 py-3 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                 >
                   {isSaving ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                   ) : saveSuccess ? (
                     <>Saved Successfully</>
                   ) : (
                     <><Save size={18} /> Save Changes</>
                   )}
                 </button>
               </div>
            </div>
          </section>

          <section className="glass-card p-8">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <Shield size={20} />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-slate-dark">Security Settings</h3>
               </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white/50">
                 <div>
                    <p className="text-sm font-bold text-slate-dark">Biometric Authentication</p>
                    <p className="text-[10px] text-slate-light font-bold uppercase tracking-widest mt-1">Face ID / Touch ID</p>
                 </div>
                 <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" />
                 </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white/50">
                 <div>
                    <p className="text-sm font-bold text-slate-dark">Auto-Lock Session</p>
                    <p className="text-[10px] text-slate-light font-bold uppercase tracking-widest mt-1">Requires re-authentication after inactivity</p>
                 </div>
                 <select className="bg-slate-50 border border-slate-100 text-xs font-bold px-3 py-2 rounded-lg outline-none cursor-pointer">
                    <option>5 Minutes</option>
                    <option>10 Minutes</option>
                    <option>15 Minutes</option>
                    <option>Never</option>
                 </select>
              </div>
            </div>
          </section>
        </div>

        {/* System Info Panel */}
        <div className="space-y-6">
           <section className="glass-card p-6 h-auto">
             <h3 className="text-[10px] font-black text-slate-light uppercase tracking-[0.2em] mb-4">Device Status</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                     <Smartphone size={16} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-dark">Terminal MK-IV</p>
                     <p className="text-[10px] text-slate-light uppercase">Connected</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                     <HardDrive size={16} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-dark">Local Database</p>
                     <p className="text-[10px] text-slate-light uppercase">Syncing... 98%</p>
                   </div>
                </div>
             </div>
           </section>

           <section className="glass-card p-6 border-red-500/20 bg-red-50/10">
             <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4">Danger Zone</h3>
             <button className="w-full py-3 bg-red-500/10 text-red-600 font-bold text-xs rounded-xl hover:bg-red-500 hover:text-white transition-all">
               Factory Reset Terminal
             </button>
           </section>
        </div>

      </div>
    </div>
  );
}
