import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { UserPlus, Mail, Phone, Tag, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { triggerNotification } from './NotificationCenter';

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'Manual', status: 'new' });

  useEffect(() => {
    const q = query(collection(db, 'leads'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'leads'), {
        ...newLead,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setNewLead({ name: '', email: '', phone: '', source: 'Manual', status: 'new' });
      
      triggerNotification({
        title: 'New Lead Assigned',
        message: `New lead "${newLead.name}" has been registered from ${newLead.source}.`,
        type: 'info',
        module: 'CRM'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'leads', id), { status });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this lead?')) {
      await deleteDoc(doc(db, 'leads', id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-500 bg-blue-50';
      case 'contacted': return 'text-yellow-500 bg-yellow-50';
      case 'qualified': return 'text-green-500 bg-green-50';
      case 'lost': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-eglaptop-blue">CRM & Leads</h1>
          <p className="text-gray-400 font-mono text-xs">Manage potential customers and automation</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-eglaptop-orange text-white text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 flex items-center rounded-xl shadow-lg shadow-eglaptop-orange/20 transition-all"
        >
          <UserPlus size={18} className="mr-2" />
          Add Lead
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-2xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-8 text-eglaptop-blue">New Lead Entry</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Full Name</label>
              <input 
                type="text" 
                value={newLead.name}
                onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Email Address</label>
              <input 
                type="email" 
                value={newLead.email}
                onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Phone Number</label>
              <input 
                type="text" 
                value={newLead.phone}
                onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Source</label>
              <select 
                value={newLead.source}
                onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
              >
                <option value="Manual">Manual Entry</option>
                <option value="Website">Website Form</option>
                <option value="POS">POS Checkout</option>
                <option value="Social">Social Media</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-4">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-8 py-3 border border-gray-200 text-eglaptop-blue text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-3 bg-eglaptop-blue text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-opacity-90 shadow-lg shadow-eglaptop-blue/20 transition-all"
              >
                Save Lead
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Lead</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Source</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                <td className="p-6">
                  <div className="font-bold text-sm text-eglaptop-dark group-hover:text-eglaptop-blue transition-colors">{lead.name}</div>
                  <div className="text-[10px] font-mono text-gray-400">ID: {lead.id.slice(0, 8)}</div>
                </td>
                <td className="p-6">
                  <div className="flex items-center text-xs space-x-6 text-gray-500">
                    <div className="flex items-center"><Mail size={14} className="mr-2 text-eglaptop-blue" /> {lead.email}</div>
                    {lead.phone && <div className="flex items-center"><Phone size={14} className="mr-2 text-eglaptop-orange" /> {lead.phone}</div>}
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
                    {lead.source}
                  </span>
                </td>
                <td className="p-6">
                  <select 
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border-none focus:ring-0 cursor-pointer transition-all ${getStatusColor(lead.status)}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                  </select>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleDelete(lead.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
