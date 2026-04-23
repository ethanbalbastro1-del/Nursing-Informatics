import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, Wifi, ChevronLeft, UserCircle2 } from 'lucide-react';
import { Nurse } from '../types';
import { mockNurses } from '../data';

interface LoginProps {
  onLogin: (nurse: Nurse) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [showNFC, setShowNFC] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const simulateNFCLogin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onLogin(mockNurses[0]);
      setIsProcessing(false);
    }, 1500);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  if (showNFC) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card max-w-md w-full p-10 text-center relative overflow-hidden"
        >
          <button 
            onClick={() => setShowNFC(false)}
            className="absolute top-6 left-6 text-slate-light hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <div className="flex flex-col items-center mb-10 mt-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Stethoscope size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-dark tracking-tight mb-2">Nurse Verification</h2>
            <p className="text-sm text-slate-light font-medium max-w-[240px]">
              Secure login using NFC ID card. Please tap your staff badge.
            </p>
          </div>

          <div className="ripple-container h-64 mb-10">
            <div className="ripple-circle w-32 h-32" />
            <div className="ripple-circle w-48 h-48 [animation-delay:0.5s]" />
            <div className="ripple-circle w-64 h-64 [animation-delay:1s]" />
            
            <button 
              onClick={simulateNFCLogin}
              disabled={isProcessing}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl shadow-primary/30 ${
                isProcessing ? 'bg-secondary' : 'bg-primary'
              }`}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
              ) : (
                <Wifi size={40} className="text-white" />
              )}
            </button>
          </div>

          <div className="space-y-4">
             <p className="text-[10px] text-slate-light font-bold uppercase tracking-[0.2em] mb-4">Or use manual override</p>
             <div className="grid grid-cols-1 gap-2">
                {mockNurses.map(nurse => (
                  <button 
                    key={nurse.id}
                    onClick={() => onLogin(nurse)}
                    className="w-full flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-primary transition-all text-left group"
                  >
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary border border-slate-100 group-hover:border-primary transition-colors">
                        <UserCircle2 size={20} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-dark">{nurse.name}</p>
                        <p className="text-[9px] text-slate-light font-bold uppercase tracking-tighter">{nurse.role}</p>
                     </div>
                  </button>
                ))}
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
       {/* Small Logo Header */}
       <header className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
               <Stethoscope size={20} />
             </div>
             <h1 className="text-xl font-black text-primary tracking-tight">CodeMed</h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-slate-light uppercase tracking-widest">
             <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Secure Network
             </span>
             <span className="border-l border-slate-200 pl-6">Facility ID: TX-8492</span>
          </div>
       </header>

       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-slate-dark tracking-tighter mb-4">Clinical Access System</h2>
            <p className="text-lg text-slate-light font-medium max-w-2xl mx-auto leading-relaxed">
              Authorized personnel only. Please select your operational workspace to authenticate via secure NFC badge or credentials.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 w-full">
             <PortalCard 
               role="Clinical Workspace"
               description="Access medical administration tools, patient monitoring, and clinical workflows."
               icon={<div className="bg-white rounded-full p-4 border border-slate-100"><Stethoscope size={32} className="text-primary" /></div>}
               onClick={() => setShowNFC(true)}
               delay={0.1}
             />
             <PortalCard 
               role="Patient Portal"
               description="View health records, schedule appointments, and connect with your care team."
               icon={<div className="bg-white rounded-full p-4 border border-slate-100"><UserCircle2 size={32} className="text-secondary" /></div>}
               onClick={() => {}}
               delay={0.2}
             />
          </div>
       </div>

       <footer className="p-8 border-t border-white/50 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-light uppercase tracking-widest">
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
             <span>CodeMed Enterprise</span>
             <a href="#" className="hover:text-slate-dark transition-colors">IT Support</a>
             <a href="#" className="hover:text-slate-dark transition-colors">Clinical Protocols</a>
             <a href="#" className="text-red-500 hover:text-red-600 transition-colors">Emergency Override</a>
          </div>
          <span>© 2024 CodeMed. Precision Care.</span>
       </footer>
    </div>
  );
}

function PortalCard({ role, description, icon, onClick, delay }: { role: string, description: string, icon: React.ReactNode, onClick: () => void, delay: number }) {
   return (
      <motion.button
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
         onClick={onClick}
         className="glass-card p-12 flex flex-col items-center gap-8 group hover:shadow-2xl hover:shadow-primary/5 transition-all hover:-translate-y-2"
      >
         <div className="transition-transform group-hover:scale-110 duration-500">
            {icon}
         </div>
         <div>
            <h3 className="text-3xl font-black text-slate-dark mb-4 tracking-tight">{role}</h3>
            <p className="text-slate-light font-medium leading-relaxed">{description}</p>
         </div>
      </motion.button>
   );
}

