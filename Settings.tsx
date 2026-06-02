import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Globe, Database, Cpu } from 'lucide-react';

export default function Settings() {
  const sections = [
    { title: 'System Security', icon: Shield, desc: 'Manage firewalls and access tokens' },
    { title: 'Notifications', icon: Bell, desc: 'Configure alerts and webhooks' },
    { title: 'Global SEO', icon: Globe, desc: 'Manage meta tags and sitemaps' },
    { title: 'Database', icon: Database, desc: 'Backup and restore operations' },
    { title: 'AI Engine', icon: Cpu, desc: 'Tune Jasmin neural parameters' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-eglaptop-blue">System Settings</h1>
        <p className="text-gray-400 font-mono text-xs">Configure the Eglaptop core infrastructure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-gray-100 p-10 hover:bg-eglaptop-blue transition-all cursor-pointer group rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-eglaptop-blue/20">
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-white/10 group-hover:text-white transition-all text-eglaptop-blue">
                <s.icon size={28} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-white/50">v1.0.4-stable</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3 text-eglaptop-dark group-hover:text-white transition-colors">{s.title}</h3>
            <p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-eglaptop-blue">Environment Variables</h3>
        <div className="space-y-4">
          {['API_KEY', 'DATABASE_URL', 'STORAGE_BUCKET', 'AI_MODEL_ID'].map((env) => (
            <div key={env} className="flex items-center justify-between p-5 bg-gray-50/50 border border-gray-100 rounded-2xl font-mono text-xs">
              <span className="font-bold text-eglaptop-dark">{env}</span>
              <span className="text-gray-300 tracking-widest">••••••••••••••••••••••••••••</span>
              <button className="text-eglaptop-orange font-bold hover:underline">REVEAL</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
