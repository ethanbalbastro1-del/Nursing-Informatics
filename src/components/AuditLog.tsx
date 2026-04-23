import React from 'react';
import { motion } from 'motion/react';
import { 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  History,
  XCircle, 
  Info,
  Calendar,
  User,
  Pill
} from 'lucide-react';
import { AuditEntry } from '../types';

interface AuditLogProps {
  logs: AuditEntry[];
  onClear: () => void;
}

export default function AuditLog({ logs, onClear }: AuditLogProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredLogs = [...logs].reverse().filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.nurseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black text-slate-dark tracking-tight">Audit Trail</h2>
           <p className="text-sm text-slate-light font-bold uppercase tracking-widest mt-1">Immutable Activity logs</p>
        </div>
        <div className="flex gap-4">
           <div className="p-2 bg-white/50 border border-white rounded-2xl flex items-center gap-3 px-6 shadow-sm">
              <Search size={18} className="text-slate-300" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-transparent text-sm font-bold text-slate-dark outline-none w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={onClear}
             className="p-3 bg-white/50 border border-white rounded-2xl text-slate-light hover:text-red-500 transition-colors shadow-sm"
             title="Logs are permanent in production. Clearing is for demo only."
           >
             <Trash2 size={20} />
           </button>
        </div>
      </header>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-light uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-light uppercase tracking-widest">Identity</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-light uppercase tracking-widest">Patient</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-light uppercase tracking-widest">Medication</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-light uppercase tracking-widest">Action</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-light uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <Calendar size={14} className="text-slate-300" />
                       <span className="text-xs font-black text-slate-dark">{new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                          <User size={16} />
                       </div>
                       <span className="text-xs font-bold text-slate-dark">{log.nurseName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-slate-light uppercase tracking-tighter">
                      {log.patientName !== 'N/A' ? log.patientName : '-'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-xs font-bold text-slate-dark">{log.medication !== 'N/A' ? log.medication : '-'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-dark leading-tight">{log.action}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      log.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' :
                      log.type === 'failure' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-primary/5 text-primary border border-primary/10'
                    }`}>
                      {log.type === 'success' ? <CheckCircle2 size={10} /> : 
                       log.type === 'failure' ? <XCircle size={10} /> : 
                       <Info size={10} />}
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                     <div className="flex flex-col items-center gap-4 opacity-20">
                        <History size={48} />
                        <p className="text-sm font-black uppercase tracking-[0.2em]">No logs found in this view</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
