/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Activity, 
  ClipboardList, 
  History, 
  LayoutDashboard,
  AlertCircle,
  Menu,
  X,
  LogOut,
  Package,
  Settings as SettingsIcon,
  BookOpen
} from 'lucide-react';
import { Patient, Nurse, AuditEntry, Medication } from './types';
import { initialPatients, initialAuditLogs, mockNurses } from './data';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Administer from './components/Administer';
import PatientsMAR from './components/PatientsMAR';
import AuditLog from './components/AuditLog';
import Inventory from './components/Inventory';
import Protocols from './components/Protocols';
import Settings from './components/Settings';

type Tab = 'Dashboard' | 'Administer' | 'Patients & MAR' | 'Inventory' | 'Protocols' | 'Audit Log' | 'Settings';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Nurse | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(initialAuditLogs);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [administerContext, setAdministerContext] = useState<{patientId: string, medId: string} | null>(null);

  const addLog = (patientName: string, medication: string, action: string, type: 'success' | 'failure' | 'info') => {
    const newLog: AuditEntry = {
      id: `L-${Date.now()}`,
      timestamp: new Date().toISOString(),
      nurseName: currentUser?.name || 'Unknown',
      patientName,
      medication,
      action,
      type,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAdministerMed = (patientId: string, medId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          medications: p.medications.map(m => {
            if (m.id === medId) {
              return { ...m, status: 'Administered' as const, administeredAt: new Date().toISOString() };
            }
            return m;
          })
        };
      }
      return p;
    }));

    const patient = patients.find(p => p.id === patientId);
    const med = patient?.medications.find(m => m.id === medId);
    if (patient && med) {
      addLog(patient.name, med.name, 'Administered Successfully', 'success');
    }
  };

  const handleScheduleMed = (patientId: string, medication: Omit<Medication, 'id'>) => {
    const newMedId = `M-${Date.now()}`;
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          medications: [...p.medications, { ...medication, id: newMedId }]
        };
      }
      return p;
    }));
    
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      addLog(patient.name, medication.name, 'Scheduled new medication', 'info');
    }
  };

  const clearLogs = () => {
    setAuditLogs([]);
    addLog('System', 'N/A', 'Audit Log Cleared', 'info');
  };

  const startAdministration = (patientId: string, medId: string) => {
    setAdministerContext({ patientId, medId });
    setActiveTab('Administer');
  };

  if (!currentUser) {
    return <Login onLogin={(nurse) => {
      setCurrentUser(nurse);
      addLog('System', 'N/A', `${nurse.name} logged in`, 'info');
    }} />;
  }

  return (
    <div className="min-h-screen flex relative selection:bg-primary/20">
      {/* Background Pill Silhouette */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00BFA5" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="w-[150vw] h-[150vh] -rotate-12">
           <path d="M10.5 20.5 4 14l10-10 6.5 6.5-10 10Z"/>
           <path d="m10.5 20.5-6.5-6.5"/>
           <path d="m14 4 6.5 6.5"/>
        </svg>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex sidebar w-64">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
               <Stethoscope size={20} />
             </div>
             <h1 className="text-xl font-black text-primary tracking-tight">CodeMed</h1>
          </div>
          <p className="text-[10px] text-slate-light font-bold uppercase tracking-widest pl-10">Enterprise</p>
        </div>

        <nav className="flex-1 space-y-2 mt-8">
          <SidebarButton 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
          />
          <SidebarButton 
            active={activeTab === 'Administer'} 
            onClick={() => setActiveTab('Administer')} 
            icon={<Activity size={20} />} 
            label="Administer" 
          />
          <SidebarButton 
            active={activeTab === 'Patients & MAR'} 
            onClick={() => setActiveTab('Patients & MAR')} 
            icon={<ClipboardList size={20} />} 
            label="Patients" 
          />
          <SidebarButton 
            active={activeTab === 'Inventory'} 
            onClick={() => setActiveTab('Inventory')} 
            icon={<Package size={20} />} 
            label="Inventory" 
          />
          <SidebarButton 
            active={activeTab === 'Audit Log'} 
            onClick={() => setActiveTab('Audit Log')} 
            icon={<History size={20} />} 
            label="Audit Log" 
          />
          <SidebarButton 
            active={activeTab === 'Settings'} 
            onClick={() => setActiveTab('Settings')} 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
          />
        </nav>

        <div className="px-4 mt-6">
           <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <div className="flex items-center gap-3 text-primary mb-2">
                 <BookOpen size={16} />
                 <p className="text-xs font-bold uppercase tracking-widest">Protocols</p>
              </div>
              <p className="text-[10px] text-slate-light mb-3">Quick access to drug interactions and emergency guidelines.</p>
              <button 
                onClick={() => setActiveTab('Protocols')}
                className="text-[10px] font-black bg-white text-primary px-3 py-1.5 rounded-lg border border-primary/20 w-full hover:bg-primary hover:text-white transition-colors"
              >
                View Library
              </button>
           </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/50 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-dark truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-light font-bold uppercase truncate">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentUser(null)}
            className="w-full flex items-center gap-3 p-3 text-slate-light hover:text-red-500 transition-colors uppercase text-[10px] font-bold tracking-widest"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Toolbar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b border-white sticky top-0 z-40 relative">
           <div className="flex items-center gap-4 flex-1">
             <button className="md:hidden p-2 text-slate-dark" onClick={() => setIsMenuOpen(!isMenuOpen)}>
               <Menu size={20} />
             </button>
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/50 border border-white rounded-full w-full max-w-md text-slate-light text-sm">
                <Menu size={16} className="opacity-50" />
                <span className="opacity-50">Search patients, meds, or tasks...</span>
             </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden lg:flex bg-amber-500/10 text-amber-600 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-tighter items-center gap-2">
                <AlertCircle size={12} /> Simulation Active
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              
              {/* User Profiler in Global Header */}
              <div className="flex items-center gap-3">
                 <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-black text-slate-dark tracking-tight">{currentUser.name}</span>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{currentUser.role}</span>
                 </div>
                 <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary font-black shadow-inner">
                    {currentUser.name.charAt(0)}
                 </div>
                 <button 
                   onClick={() => setCurrentUser(null)}
                   className="ml-2 w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                   title="Logout"
                 >
                   <LogOut size={16} />
                 </button>
              </div>
           </div>
        </header>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="md:hidden fixed inset-0 z-50 flex"
            >
              <div className="sidebar w-64 h-full shadow-2xl">
                 <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6">
                   <X size={24} />
                 </button>
                 <div className="flex items-center gap-2 mb-8">
                   <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                     <Stethoscope size={20} />
                   </div>
                   <h1 className="text-xl font-black text-primary tracking-tight">CodeMed</h1>
                </div>
                <nav className="space-y-2">
                   <SidebarButton active={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setIsMenuOpen(false); }} icon={<LayoutDashboard size={20} />} label="Overview" />
                   <SidebarButton active={activeTab === 'Administer'} onClick={() => { setActiveTab('Administer'); setIsMenuOpen(false); }} icon={<Activity size={20} />} label="Administer" />
                   <SidebarButton active={activeTab === 'Patients & MAR'} onClick={() => { setActiveTab('Patients & MAR'); setIsMenuOpen(false); }} icon={<ClipboardList size={20} />} label="Patients" />
                   <SidebarButton active={activeTab === 'Inventory'} onClick={() => { setActiveTab('Inventory'); setIsMenuOpen(false); }} icon={<Package size={20} />} label="Inventory" />
                   <SidebarButton active={activeTab === 'Protocols'} onClick={() => { setActiveTab('Protocols'); setIsMenuOpen(false); }} icon={<BookOpen size={20} />} label="Protocols" />
                   <SidebarButton active={activeTab === 'Audit Log'} onClick={() => { setActiveTab('Audit Log'); setIsMenuOpen(false); }} icon={<History size={20} />} label="Audit Log" />
                   <SidebarButton active={activeTab === 'Settings'} onClick={() => { setActiveTab('Settings'); setIsMenuOpen(false); }} icon={<SettingsIcon size={20} />} label="Settings" />
                </nav>
              </div>
              <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="h-full"
            >
              {activeTab === 'Dashboard' && (
                <Dashboard 
                  nurse={currentUser} 
                  patients={patients} 
                  onAdminister={startAdministration}
                  onNavigateToPatients={() => setActiveTab('Patients & MAR')}
                  onNavigateToTasks={() => setActiveTab('Patients & MAR')} // Simplified navigation destination
                />
              )}
              {activeTab === 'Administer' && (
                <Administer 
                  patients={patients} 
                  context={administerContext}
                  onComplete={(pid, mid) => {
                    handleAdministerMed(pid, mid);
                    setActiveTab('Dashboard');
                    setAdministerContext(null);
                  }}
                  onCancel={() => {
                    setActiveTab('Dashboard');
                    setAdministerContext(null);
                  }}
                />
              )}
              {activeTab === 'Patients & MAR' && (
                <PatientsMAR 
                  patients={patients} 
                  onAdminister={startAdministration}
                  onScheduleMed={handleScheduleMed}
                />
              )}
              {activeTab === 'Inventory' && (
                <Inventory />
              )}
              {activeTab === 'Protocols' && (
                <Protocols />
              )}
              {activeTab === 'Audit Log' && (
                <AuditLog 
                  logs={auditLogs} 
                  onClear={clearLogs} 
                />
              )}
              {activeTab === 'Settings' && (
                <Settings 
                  currentUser={currentUser} 
                  onUpdateUser={setCurrentUser} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-3 rounded-2xl transition-all duration-300 font-bold text-sm ${
        active 
          ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
          : 'text-slate-light hover:bg-white hover:text-primary border border-transparent'
      }`}
    >
      <span className={active ? 'text-white' : 'text-slate-light'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

