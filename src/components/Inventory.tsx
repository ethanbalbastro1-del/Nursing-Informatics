import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, AlertTriangle, Plus, Search, Archive, Package, Search as SearchIcon, X, Calendar, Factory } from 'lucide-react';

import { MedInventoryItem, mockInventory } from '../data';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<MedInventoryItem[]>(mockInventory);
  const [selectedItem, setSelectedItem] = useState<MedInventoryItem | null>(null);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestock = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: item.stock + item.threshold } : item
    ));
    if (selectedItem && selectedItem.id === id) {
       setSelectedItem(prev => prev ? { ...prev, stock: prev.stock + prev.threshold } : null);
    }
  };

  return (
    <div className="space-y-8 pb-12 h-full flex flex-col relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-dark tracking-tight">Medication Inventory</h2>
          <p className="text-sm text-slate-light font-bold uppercase tracking-widest mt-1">Live Stock Monitoring</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search registry..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-12 pr-4 py-3 bg-white/60 border border-slate-100 rounded-2xl text-sm font-bold w-64 focus:outline-none focus:border-primary transition-all"
             />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-2">
           <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <Package size={20} />
           </div>
           <p className="text-[10px] font-black text-slate-light uppercase tracking-widest">Total SKU Count</p>
           <p className="text-3xl font-black text-slate-dark">{inventory.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
           <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-2">
              <Archive size={20} />
           </div>
           <p className="text-[10px] font-black text-slate-light uppercase tracking-widest">Low Stock Items</p>
           <p className="text-3xl font-black text-slate-dark">{inventory.filter(i => i.stock <= i.threshold).length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2 border border-red-500/20 bg-red-50/30">
           <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
              <AlertTriangle size={20} />
           </div>
           <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Critical Shortages</p>
           <p className="text-3xl font-black text-red-500">{inventory.filter(i => i.stock < i.threshold * 0.5).length}</p>
        </div>
      </div>

      <div className="glass-card flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-white/50 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-light uppercase tracking-widest">Item details</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-light uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-light uppercase tracking-widest">Stock Level</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-light uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredInventory.map((item) => {
                  const isCritical = item.stock < item.threshold * 0.5;
                  const isLow = item.stock <= item.threshold && !isCritical;
                  
                  return (
                    <motion.tr 
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            isCritical ? 'bg-red-100 text-red-600' : 
                            isLow ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'
                          }`}>
                            <Pill size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-dark text-sm">{item.name}</p>
                            <p className="text-[10px] text-slate-light font-bold font-mono">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-bold text-slate-light">{item.category}</span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-primary'}`}
                               style={{ width: `${Math.min((item.stock / (item.threshold * 2)) * 100, 100)}%` }}
                             />
                          </div>
                          <span className={`text-xs font-black ${isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-slate-dark'}`}>
                            {item.stock} <span className="opacity-50 font-normal">/ {item.threshold} min</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button 
                          onClick={(e) => handleRestock(item.id, e)}
                          className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all flex items-center gap-2 ml-auto ${
                            isCritical || isLow 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105' 
                            : 'bg-slate-100 text-slate-dark hover:bg-slate-200'
                          }`}
                        >
                          <Plus size={14} /> Request
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredInventory.length === 0 && (
            <div className="p-12 text-center text-slate-light font-bold">
              No inventory matching your search.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-slate-50 relative border-b border-slate-100 p-8 pb-6 text-center">
                 <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-dark transition-colors">
                    <X size={24} />
                 </button>
                 <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center text-primary mb-4 mx-auto shadow-sm">
                    <Pill size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-dark tracking-tight mb-1">{selectedItem.name}</h3>
                 <p className="text-[10px] text-slate-light font-bold font-mono tracking-widest">{selectedItem.id}</p>
                 <span className="inline-block mt-4 text-[10px] uppercase font-black tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-md">
                   {selectedItem.category}
                 </span>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-100 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-light uppercase tracking-widest flex items-center gap-2 mb-1">
                          <Factory size={12} /> Manufacturer
                       </p>
                       <p className="font-bold text-slate-dark text-sm truncate">PharmaCorp Intl.</p>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-light uppercase tracking-widest flex items-center gap-2 mb-1">
                          <Archive size={12} /> Batch Num
                       </p>
                       <p className="font-bold text-slate-dark text-sm font-mono truncate">B-99824X</p>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-light uppercase tracking-widest flex items-center gap-2 mb-1">
                          <Calendar size={12} /> Exp Date
                       </p>
                       <p className="font-bold text-slate-dark text-sm truncate">12 / 2026</p>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-light uppercase tracking-widest flex items-center gap-2 mb-1">
                          <Package size={12} /> Stock Status
                       </p>
                       <p className={`font-black text-sm truncate ${selectedItem.stock < selectedItem.threshold * 0.5 ? 'text-red-500' : selectedItem.stock <= selectedItem.threshold ? 'text-amber-500' : 'text-primary'}`}>
                          {selectedItem.stock} <span className="text-slate-light text-[10px] font-normal uppercase tracking-tight">Units</span>
                       </p>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-[10px] font-black text-slate-dark uppercase tracking-widest mb-4">Historical Activity (Last 30 Days)</h4>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <Plus size={14} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-dark">Restocked</p>
                                <p className="text-[10px] text-slate-light uppercase">System Admin</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-green-600">+{selectedItem.threshold}</p>
                             <p className="text-[10px] text-slate-light">2 days ago</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                                <Pill size={14} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-dark">Administered</p>
                                <p className="text-[10px] text-slate-light uppercase">Nurse Smith</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-slate-500">-1</p>
                             <p className="text-[10px] text-slate-light">5 hrs ago</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="pt-4">
                   <button 
                     onClick={(e) => handleRestock(selectedItem.id, e)}
                     className="w-full btn-primary py-4 font-black tracking-widest uppercase text-sm"
                   >
                     Order Stock Replenishment
                   </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
