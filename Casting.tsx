import React, { useState } from 'react';
import { Radio, Video, Zap, Shield, Globe, ArrowRight, Check, Server, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const packages = [
  {
    id: 'radio-basic',
    name: 'Radio Channel Basic',
    arName: 'قناة راديو أساسية',
    price: '$29',
    period: '/mo',
    icon: Radio,
    color: 'text-eglaptop-orange',
    bgColor: 'bg-eglaptop-orange/10',
    features: [
      'Shoutcast v2.6 Engine',
      '128kbps Audio Quality',
      '50 Concurrent Listeners',
      'Auto-DJ with 10GB Storage',
      'Web Player Integration',
      'Basic Analytics'
    ],
    arFeatures: [
      'محرك Shoutcast v2.6',
      'جودة صوت 128kbps',
      '50 مستمع متزامن',
      'Auto-DJ مع مساحة 10GB',
      'تكامل مشغل الويب',
      'تحليلات أساسية'
    ]
  },
  {
    id: 'video-pro',
    name: 'Video Stream Pro',
    arName: 'بث فيديو احترافي',
    price: '$89',
    period: '/mo',
    icon: Video,
    color: 'text-eglaptop-blue',
    bgColor: 'bg-eglaptop-blue/10',
    features: [
      'Owncast Engine (RTMP)',
      '1080p HD Streaming',
      'Unlimited Bandwidth',
      'Custom Domain Support',
      'Built-in Chat System',
      'Low Latency Infrastructure'
    ],
    arFeatures: [
      'محرك Owncast (RTMP)',
      'بث عالي الدقة 1080p',
      'باندويث غير محدود',
      'دعم النطاق الخاص',
      'نظام دردشة مدمج',
      'بنية تحتية بزمن استجابة منخفض'
    ]
  },
  {
    id: 'enterprise-cast',
    name: 'Enterprise Casting',
    arName: 'بث المؤسسات',
    price: 'Custom',
    period: '',
    icon: Server,
    color: 'text-eglaptop-coral',
    bgColor: 'bg-eglaptop-coral/10',
    features: [
      'Dedicated Casting Server',
      'Multi-bitrate Transcoding',
      'Global CDN Delivery',
      'White-label Solution',
      '24/7 Priority Support',
      'API Access for Automation'
    ],
    arFeatures: [
      'سيرفر بث مخصص',
      'ترميز متعدد البتات',
      'توصيل عبر CDN عالمي',
      'حلول العلامة البيضاء',
      'دعم فني ذو أولوية 24/7',
      'وصول API للأتمتة'
    ]
  }
];

export default function Casting() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-eglaptop-blue">Casting Channels</h1>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">
            Professional Broadcasting Infrastructure | بنية تحتية احترافية للبث
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-2 px-4 py-2 border-r border-gray-100">
            <Activity size={16} className="text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Network: Stable</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2">
            <Zap size={16} className="text-eglaptop-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Uptime: 99.9%</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative p-12 bg-eglaptop-blue rounded-[2.5rem] overflow-hidden text-white shadow-2xl shadow-eglaptop-blue/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-eglaptop-sky/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="mb-8">
            <img 
              src="https://api.dicebear.com/7.x/shapes/svg?seed=Eglaptop&backgroundColor=FF6321" 
              alt="Eglaptop Logo" 
              className="w-16 h-16 rounded-2xl shadow-2xl shadow-eglaptop-orange/20 mb-6"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-3xl font-bold tracking-tight mb-4">Launch Your Own Online Channel</h2>
          </div>
          <div className="text-xl font-bold text-eglaptop-sky/60 mb-6" dir="rtl">أطلق قناتك الخاصة عبر الإنترنت</div>
          <p className="text-white/70 leading-relaxed mb-8">
            Eglaptop provides high-performance servers pre-configured with Shoutcast and Owncast. 
            Focus on your content, we handle the technical orchestration.
            <span className="block mt-2 text-sm opacity-50" dir="rtl">
              إجلابلاب توفر سيرفرات عالية الأداء مهيأة مسبقاً مع Shoutcast و Owncast. ركز على محتواك، ونحن نتولى التنسيق التقني.
            </span>
          </p>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Shield size={16} className="text-eglaptop-orange" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Streams</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-eglaptop-sky" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Global CDN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <motion.div 
            key={pkg.id}
            whileHover={{ y: -10 }}
            className={`bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group ${selectedPackage === pkg.id ? 'ring-2 ring-eglaptop-orange' : ''}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            <div className={`w-16 h-16 ${pkg.bgColor} ${pkg.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              <pkg.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-1">{pkg.name}</h3>
            <div className="text-sm font-bold text-gray-300 mb-6" dir="rtl">{pkg.arName}</div>
            
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold tracking-tight text-eglaptop-blue">{pkg.price}</span>
              <span className="text-sm text-gray-400 font-mono ml-2">{pkg.period}</span>
            </div>

            <div className="space-y-4 mb-10">
              {pkg.features.map((feature, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">{feature}</p>
                    <p className="text-[10px] text-gray-400" dir="rtl">{pkg.arFeatures[i]}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              selectedPackage === pkg.id 
              ? 'bg-eglaptop-orange text-white shadow-lg shadow-eglaptop-orange/20' 
              : 'bg-gray-50 text-eglaptop-blue hover:bg-eglaptop-blue hover:text-white'
            }`}>
              Select Package | اختر الباقة
            </button>
          </motion.div>
        ))}
      </div>

      {/* Technical Specs (Hidden from non-admins or as extra info) */}
      <div className="bg-gray-50 p-12 rounded-[2.5rem] border border-gray-100">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-10 h-10 bg-eglaptop-blue text-white rounded-xl flex items-center justify-center">
            <Activity size={20} />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-eglaptop-blue">Real-time Infrastructure Monitoring</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Network Latency', value: '12ms', status: 'Optimal' },
            { label: 'Server Load', value: '14%', status: 'Stable' },
            { label: 'Active Streams', value: '1,248', status: 'Healthy' },
            { label: 'Bandwidth Usage', value: '4.2 TB/s', status: 'Normal' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-eglaptop-blue tracking-tight">{stat.value}</span>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{stat.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
