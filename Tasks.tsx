import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CheckCircle2, Circle, Plus, Trash2, Calendar } from 'lucide-react';
import { triggerNotification } from './NotificationCenter';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await addDoc(collection(db, 'tasks'), {
      text: newTask,
      priority,
      completed: false,
      createdAt: new Date()
    });

    if (priority === 'High' || priority === 'Critical') {
      triggerNotification({
        title: 'High Priority Task',
        message: `A new ${priority} priority task has been created: "${newTask}"`,
        type: priority === 'Critical' ? 'error' : 'warning',
        module: 'ERP'
      });
    }

    setNewTask('');
  };

  const toggleTask = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, 'tasks', id), { completed: !completed });
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-eglaptop-blue">Task Orchestration</h1>
          <p className="text-gray-400 font-mono text-xs">Automate and track team operations for Eglaptop</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <form onSubmit={addTask} className="bg-white border border-gray-100 p-8 space-y-6 rounded-3xl shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-eglaptop-blue">New Task</h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-eglaptop-blue">Description</label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="w-full p-4 border border-gray-100 rounded-xl font-mono text-xs focus:outline-none focus:border-eglaptop-orange bg-gray-50/50 transition-all"
                placeholder="e.g. Audit kernel parameters..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-eglaptop-blue">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-4 border border-gray-100 rounded-xl font-mono text-xs focus:outline-none focus:border-eglaptop-orange bg-gray-50/50 transition-all"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-eglaptop-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 flex items-center justify-center rounded-xl shadow-lg shadow-eglaptop-blue/20 transition-all">
              <Plus size={18} className="mr-3" /> Add Task
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {tasks.map(task => (
            <div key={task.id} className={`p-6 border border-gray-100 flex items-center justify-between transition-all rounded-2xl shadow-sm hover:shadow-md ${task.completed ? 'opacity-50 bg-gray-50' : 'bg-white'}`}>
              <div className="flex items-center space-x-6">
                <button onClick={() => toggleTask(task.id, task.completed)} className="transition-transform hover:scale-110">
                  {task.completed ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-200" size={24} />}
                </button>
                <div>
                  <p className={`text-sm font-bold text-eglaptop-dark ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.text}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      task.priority === 'Critical' ? 'bg-red-500 text-white' :
                      task.priority === 'High' ? 'bg-eglaptop-orange text-white' :
                      task.priority === 'Medium' ? 'bg-eglaptop-blue text-white' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-gray-300 font-mono flex items-center">
                      <Calendar size={12} className="mr-2" />
                      {task.createdAt?.toDate ? task.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="p-3 hover:bg-red-50 text-red-400 rounded-xl transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-24 border border-dashed border-gray-200 text-center rounded-3xl">
              <p className="text-gray-300 font-sans text-sm uppercase tracking-widest font-bold">No active tasks. System is optimized.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
