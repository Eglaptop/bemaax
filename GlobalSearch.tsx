import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Package, ShoppingCart, Users, X, ChevronDown, CheckSquare, Radio, ArrowRight, Command, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, getDocs, limit, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

type Module = 'all' | 'cms' | 'erp' | 'pos' | 'crm' | 'tasks' | 'casting';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  module: Module;
  type: string;
  path: string;
}

const moduleConfig = {
  all: { label: 'All Modules', icon: Search, color: 'text-gray-400', bgColor: 'bg-gray-100' },
  cms: { label: 'CMS (Posts)', icon: FileText, color: 'text-eglaptop-blue', bgColor: 'bg-eglaptop-blue/10' },
  erp: { label: 'ERP (Inventory)', icon: Package, color: 'text-eglaptop-coral', bgColor: 'bg-eglaptop-coral/10' },
  pos: { label: 'POS (Sales)', icon: ShoppingCart, color: 'text-eglaptop-orange', bgColor: 'bg-eglaptop-orange/10' },
  crm: { label: 'CRM (Leads)', icon: Users, color: 'text-eglaptop-sky', bgColor: 'bg-eglaptop-sky/20' },
  tasks: { label: 'Tasks', icon: CheckSquare, color: 'text-green-500', bgColor: 'bg-green-50' },
  casting: { label: 'Casting', icon: Radio, color: 'text-purple-500', bgColor: 'bg-purple-50' },
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<Module>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const allResults: SearchResult[] = [];

      try {
        // CMS Search (Posts)
        if (selectedModule === 'all' || selectedModule === 'cms') {
          const postsSnap = await getDocs(query(collection(db, 'posts'), limit(10)));
          postsSnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                data.content?.toLowerCase().includes(searchTerm.toLowerCase())) {
              allResults.push({
                id: doc.id,
                title: data.title,
                subtitle: data.site || 'CMS Post',
                module: 'cms',
                type: 'Post',
                path: '/cms'
              });
            }
          });
        }

        // ERP/POS Search (Products)
        if (selectedModule === 'all' || selectedModule === 'erp' || selectedModule === 'pos') {
          const productsSnap = await getDocs(query(collection(db, 'products'), limit(10)));
          productsSnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
              allResults.push({
                id: doc.id,
                title: data.name,
                subtitle: `$${data.price} - ${data.stock} in stock`,
                module: selectedModule === 'erp' ? 'erp' : 'pos',
                type: 'Product',
                path: '/pos'
              });
            }
          });
        }

        // CRM Search (Leads)
        if (selectedModule === 'all' || selectedModule === 'crm') {
          const leadsSnap = await getDocs(query(collection(db, 'leads'), limit(10)));
          leadsSnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                data.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
              allResults.push({
                id: doc.id,
                title: data.name,
                subtitle: data.email,
                module: 'crm',
                type: 'Lead',
                path: '/leads'
              });
            }
          });
        }

        // Tasks Search
        if (selectedModule === 'all' || selectedModule === 'tasks') {
          const tasksSnap = await getDocs(query(collection(db, 'tasks'), limit(10)));
          tasksSnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.text?.toLowerCase().includes(searchTerm.toLowerCase())) {
              allResults.push({
                id: doc.id,
                title: data.text,
                subtitle: `Priority: ${data.priority} - ${data.completed ? 'Completed' : 'Pending'}`,
                module: 'tasks',
                type: 'Task',
                path: '/tasks'
              });
            }
          });
        }

        setResults(allResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, selectedModule]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className={`flex items-center bg-gray-50 px-4 py-2 rounded-xl w-[450px] border transition-all ${isOpen ? 'border-eglaptop-orange ring-4 ring-eglaptop-orange/10 bg-white' : 'border-gray-100'}`}>
        <Search size={18} className={isOpen ? 'text-eglaptop-orange' : 'text-gray-400'} />
        <input 
          type="text" 
          placeholder="Search Eglaptop Ecosystem... (Ctrl+K)" 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm text-eglaptop-dark font-medium"
        />
        <div className="flex items-center space-x-2">
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors">
              <X size={14} />
            </button>
          )}
          {!isOpen && (
            <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono text-gray-400">
              <Command size={10} />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Filter Tabs */}
            <div className="p-4 border-b border-gray-50 flex items-center space-x-2 overflow-x-auto no-scrollbar bg-gray-50/30">
              {(Object.keys(moduleConfig) as Module[]).map((mod) => {
                const config = moduleConfig[mod];
                const Icon = config.icon;
                return (
                  <button 
                    key={mod}
                    onClick={() => setSelectedModule(mod)}
                    className={`flex items-center px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                      selectedModule === mod 
                      ? 'bg-eglaptop-blue text-white shadow-lg shadow-eglaptop-blue/20' 
                      : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    <Icon size={12} className="mr-2" />
                    {config.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Results Area */}
            <div className="max-h-[450px] overflow-y-auto p-3 custom-scrollbar">
              {isSearching ? (
                <div className="p-12 text-center">
                  <Loader2 size={24} className="text-eglaptop-orange animate-spin mx-auto mb-4" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">Scanning Eglaptop Databases...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-gray-300">Search Results ({results.length})</div>
                  {results.map((result) => {
                    const config = moduleConfig[result.module];
                    const Icon = config.icon;
                    return (
                      <button 
                        key={`${result.module}-${result.id}`}
                        onClick={() => handleResultClick(result.path)}
                        className="w-full flex items-center p-4 hover:bg-gray-50 rounded-2xl transition-all text-left group"
                      >
                        <div className={`p-3 rounded-xl mr-5 transition-transform group-hover:scale-110 ${config.bgColor} ${config.color}`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-eglaptop-dark truncate group-hover:text-eglaptop-blue transition-colors">{result.title}</h4>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg">{result.type}</span>
                          </div>
                          <p className="text-xs text-gray-400 truncate font-medium">{result.subtitle}</p>
                        </div>
                        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <ArrowRight size={18} className="text-eglaptop-orange" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : searchTerm.length >= 2 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gray-200" />
                  </div>
                  <p className="text-sm font-bold text-eglaptop-blue mb-2">No results found for "{searchTerm}"</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Try searching in a different module or check your spelling</p>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-eglaptop-orange/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Command size={32} className="text-eglaptop-orange/20" />
                  </div>
                  <p className="text-sm font-bold text-eglaptop-blue mb-2">Advanced Ecosystem Search</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Search across CMS, ERP, POS, CRM, and Tasks</p>
                </div>
              )}
            </div>

            {/* Quick Actions / Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 mr-2 shadow-sm">ESC</span> to close
                </div>
                <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 mr-2 shadow-sm">↵</span> to select
                </div>
              </div>
              <div className="flex items-center space-x-2 text-[9px] font-bold uppercase tracking-widest text-eglaptop-blue/40">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Jasmin AI Engine Active</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
