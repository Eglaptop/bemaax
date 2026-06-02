import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Target,
  AlertCircle,
  Rocket,
  Zap,
  Shield,
  Globe,
  ChevronRight
} from 'lucide-react';

const data = [
  { name: 'Mon', sales: 4000, traffic: 2400 },
  { name: 'Tue', sales: 3000, traffic: 1398 },
  { name: 'Wed', sales: 2000, traffic: 9800 },
  { name: 'Thu', sales: 2780, traffic: 3908 },
  { name: 'Fri', sales: 1890, traffic: 4800 },
  { name: 'Sat', sales: 2390, traffic: 3800 },
  { name: 'Sun', sales: 3490, traffic: 4300 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 text-eglaptop-blue group-hover:bg-eglaptop-blue group-hover:text-white transition-all rounded-xl">
        <Icon size={20} />
      </div>
      <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {change}
      </div>
    </div>
    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{title}</h3>
    <p className="text-3xl font-bold tracking-tight text-eglaptop-dark">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    leads: 0,
    posts: 0,
    load: 24
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    const seedData = async () => {
      // Seed Products
      const productSnap = await getDocs(collection(db, 'products'));
      if (productSnap.empty) {
        const initialProducts = [
          { name: 'Voiceover Pro Pack', price: 299.99, stock: 50, category: 'Services' },
          { name: 'Eglaptop Academy Access', price: 499.00, stock: 100, category: 'Education' },
          { name: 'Eglaptop Hosting (Annual)', price: 120.00, stock: 200, category: 'Infrastructure' },
          { name: 'AI Integration Module', price: 1500.00, stock: 10, category: 'Technology' },
        ];
        for (const p of initialProducts) {
          await addDoc(collection(db, 'products'), p);
        }
      }

      // Seed Posts
      const postSnap = await getDocs(collection(db, 'posts'));
      if (postSnap.empty) {
        const initialPosts = [
          { title: 'The Future of AI in Voiceover', content: 'Exploring how LLMs are changing the industry...', site: 'voiceover', status: 'published', createdAt: new Date() },
          { title: 'Eglaptop Technology Roadmap 2026', content: 'Our vision for the next 3 years of ecosystem growth...', site: 'eglaptop', status: 'published', createdAt: new Date() },
          { title: 'Eglaptop Kernel Optimization Guide', content: 'Deep dive into Linux kernel tuning for high performance...', site: 'eglaptop', status: 'draft', createdAt: new Date() },
        ];
        for (const p of initialPosts) {
          await addDoc(collection(db, 'posts'), p);
        }
      }

      // Seed Leads
      const leadSnap = await getDocs(collection(db, 'leads'));
      if (leadSnap.empty) {
        const initialLeads = [
          { name: 'Fadi Al-Ahmad', email: 'fadi@example.com', company: 'Al-Ahmad Media', status: 'New', createdAt: new Date() },
          { name: 'Sarah Johnson', email: 'sarah@techcorp.com', company: 'TechCorp Global', status: 'Contacted', createdAt: new Date() },
          { name: 'Ahmed Hassan', email: 'ahmed@voicepro.ae', company: 'VoicePro UAE', status: 'Qualified', createdAt: new Date() },
        ];
        for (const l of initialLeads) {
          await addDoc(collection(db, 'leads'), l);
        }
      }

      // Seed Tasks
      const taskSnap = await getDocs(collection(db, 'tasks'));
      if (taskSnap.empty) {
        const initialTasks = [
          { text: 'Audit kernel parameters for Eglaptop nodes', priority: 'Critical', completed: false, createdAt: new Date() },
          { text: 'Update Eglaptop branding guidelines', priority: 'Medium', completed: true, createdAt: new Date() },
          { text: 'Review Q1 financial reports', priority: 'High', completed: false, createdAt: new Date() },
        ];
        for (const t of initialTasks) {
          await addDoc(collection(db, 'tasks'), t);
        }
      }
    };
    seedData();

    // Real-time Stats
    const unsubTransactions = onSnapshot(collection(db, 'transactions'), (snap) => {
      const total = snap.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
      setStats(prev => ({ ...prev, revenue: total }));
      setRecentTransactions(snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
        .slice(0, 5)
      );
    });

    const unsubLeads = onSnapshot(collection(db, 'leads'), (snap) => {
      setStats(prev => ({ ...prev, leads: snap.size }));
    });

    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setStats(prev => ({ ...prev, posts: snap.size }));
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setLowStockProducts(snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(p => p.stock < 20)
      );
    });

    return () => {
      unsubTransactions();
      unsubLeads();
      unsubPosts();
      unsubProducts();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-eglaptop-blue">System Overview</h1>
          <p className="text-gray-400 font-mono text-xs">Real-time performance metrics for Eglaptop Ecosystem</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-eglaptop-blue text-xs font-bold uppercase tracking-widest hover:bg-gray-50 rounded-lg transition-all">Export CSV</button>
          <button className="px-4 py-2 bg-eglaptop-orange text-white text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 rounded-lg shadow-lg shadow-eglaptop-orange/20 transition-all">Refresh</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} change="+12.5%" icon={DollarSign} trend="up" />
        <StatCard title="Active Leads" value={stats.leads.toString()} change="+3.2%" icon={Target} trend="up" />
        <StatCard title="CMS Posts" value={stats.posts.toString()} change="-1.4%" icon={FileText} trend="down" />
        <StatCard title="System Load" value={`${stats.load}%`} change="+0.5%" icon={Activity} trend="up" />
      </div>

      {/* Future Insights & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-eglaptop-blue text-white p-8 relative overflow-hidden group rounded-3xl shadow-2xl shadow-eglaptop-blue/20">
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center text-eglaptop-sky">
              <TrendingUp size={16} className="mr-2" />
              AI Business Insights
            </h3>
            <p className="text-2xl font-bold tracking-tight mb-6 leading-tight">
              "Revenue is projected to increase by 15% next month based on current lead conversion rates."
            </p>
            <div className="flex space-x-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Confidence: 94%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Model: Jasmin-v3.1</div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500 text-white">
            <TrendingUp size={200} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center text-eglaptop-blue">
            <AlertCircle size={16} className="mr-2 text-red-500" />
            Stock Alerts
          </h3>
          <div className="space-y-3">
            {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
              <div key={p.id} className="flex justify-between items-center p-3 bg-red-50/50 border-l-4 border-red-500 rounded-r-xl">
                <span className="text-xs font-bold text-eglaptop-dark">{p.name}</span>
                <span className="text-[10px] font-mono bg-red-500 text-white px-2 py-0.5 rounded-full">{p.stock} left</span>
              </div>
            )) : (
              <p className="text-xs text-gray-400">All inventory levels stable.</p>
            )}
          </div>
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-eglaptop-blue">Future Roadmap</h2>
            <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest">Planned Ecosystem Expansion</p>
          </div>
          <Rocket className="text-eglaptop-orange/20" size={48} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-eglaptop-orange/10 text-eglaptop-orange rounded-lg">
                <Zap size={20} />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-eglaptop-blue">Phase 1: Automation</h4>
            </div>
            <ul className="space-y-3 text-xs text-gray-500 font-mono">
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-orange" /> AI-Driven Inventory Reordering</li>
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-orange" /> Automated SEO Content Generation</li>
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-orange" /> WhatsApp API Integration</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-eglaptop-coral/10 text-eglaptop-coral rounded-lg">
                <Shield size={20} />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-eglaptop-blue">Phase 2: Security</h4>
            </div>
            <ul className="space-y-3 text-xs text-gray-500 font-mono">
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-coral" /> Blockchain Transaction Verification</li>
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-coral" /> Advanced Kernel Hardening</li>
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-coral" /> Biometric Admin Access</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-eglaptop-sky/10 text-eglaptop-sky rounded-lg">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-eglaptop-blue">Phase 3: Global Scale</h3>
            </div>
            <ul className="space-y-3 text-xs text-gray-500 font-mono">
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-sky" /> Multi-Region Server Clusters</li>
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-sky" /> Global Voiceover Marketplace</li>
              <li className="flex items-center"><ChevronRight size={10} className="mr-2 text-eglaptop-sky" /> Decentralized Data Nodes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-8 flex items-center text-eglaptop-blue">
            <TrendingUp size={16} className="mr-2" />
            Revenue vs Traffic
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1B4F8F', color: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#F27D26" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-8 flex items-center text-eglaptop-blue">
            <Users size={16} className="mr-2" />
            User Engagement
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#1B4F8F', color: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="traffic" fill="#1B4F8F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Experimental Features & Futures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-eglaptop-dark to-eglaptop-blue p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-eglaptop-sky">Experimental</h3>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Quantum SEO Analytics</h2>
            <p className="text-sm text-white/60 mb-8 leading-relaxed">
              Our upcoming search engine optimization engine uses predictive modeling to identify keyword surges before they happen.
            </p>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">In Development</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-eglaptop-orange">Release Q3 2026</span>
            </div>
          </div>
          <Zap size={180} className="absolute -right-10 -bottom-10 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
        </div>

        <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-eglaptop-orange">Alpha Phase</h3>
            <h2 className="text-3xl font-bold tracking-tight mb-6 text-eglaptop-blue">Voice-to-Task AI</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Convert project meetings directly into actionable Eglaptop leads and tasks using Jasmin's new acoustic processing core.
            </p>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-eglaptop-blue/5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-eglaptop-blue/5 text-eglaptop-blue">Internal Testing</span>
              <button className="text-[10px] font-bold uppercase tracking-widest text-eglaptop-orange hover:underline">Apply for Early Access</button>
            </div>
          </div>
          <Activity size={180} className="absolute -right-10 -bottom-10 text-gray-50 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-eglaptop-blue">Recent Transactions</h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-eglaptop-orange hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">ID</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="p-6 font-mono text-xs text-gray-400">#{trx.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-6 font-bold text-sm text-eglaptop-dark group-hover:text-eglaptop-blue transition-colors">{trx.customerName}</td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Completed</span>
                  </td>
                  <td className="p-6 font-bold text-sm text-eglaptop-blue">${trx.total?.toFixed(2)}</td>
                  <td className="p-6 text-xs text-gray-400">
                    {trx.timestamp?.toDate ? trx.timestamp.toDate().toLocaleDateString() : 'Just now'}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No recent transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
