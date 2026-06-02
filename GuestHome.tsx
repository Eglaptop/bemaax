import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mic2, 
  BookOpen, 
  Server, 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe,
  Cpu,
  Radio
} from 'lucide-react';

export default function GuestHome() {
  return (
    <div className="min-h-screen bg-white text-eglaptop-dark font-sans selection:bg-eglaptop-orange selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://api.dicebear.com/7.x/shapes/svg?seed=Eglaptop&backgroundColor=FF6321" 
              alt="Eglaptop Logo" 
              className="w-10 h-10 rounded-xl shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-xl tracking-tight uppercase text-eglaptop-orange">Eglaptop</span>
              <span className="font-display font-medium text-[10px] tracking-[0.3em] uppercase text-eglaptop-blue">Technology</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest">
            <a href="#services" className="hover:text-eglaptop-orange transition-colors">Services</a>
            <a href="#ecosystem" className="hover:text-eglaptop-orange transition-colors">Ecosystem</a>
            <a href="#team" className="hover:text-eglaptop-orange transition-colors">Leadership</a>
            <a href="#ai" className="hover:text-eglaptop-orange transition-colors">Jasmin AI</a>
            <Link to="/auth" className="px-6 py-2 bg-eglaptop-blue text-white hover:bg-opacity-90 transition-all rounded-md">Portal Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden bg-gray-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 bg-eglaptop-blue/10 text-eglaptop-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-8 rounded-full">
              Next-Gen Digital Infrastructure | البنية التحتية الرقمية
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-10">
              The Voice of <br />
              <span className="text-eglaptop-orange">Future Tech.</span>
              <div className="text-3xl md:text-5xl mt-6 font-bold text-eglaptop-blue/40" dir="rtl">صوت التكنولوجيا المستقبلية</div>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mb-12 leading-relaxed">
              Eglaptop Technology orchestrates a global ecosystem of high-end voiceover services, 
              advanced technical education, and secure server infrastructure.
              <span className="block mt-4 text-sm font-medium text-gray-400" dir="rtl">
                إيجلابتوب تكنولوجي تدير منظومة عالمية من خدمات التعليق الصوتي الفاخر، التعليم التقني المتقدم، وبنية تحتية آمنة للسيرفرات.
              </span>
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/auth" className="px-10 py-5 bg-eglaptop-orange text-white font-bold uppercase tracking-widest text-xs flex items-center group rounded-xl shadow-xl shadow-eglaptop-orange/20 transition-all hover:scale-105">
                Access Ecosystem <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <button className="px-10 py-5 border-2 border-eglaptop-blue text-eglaptop-blue font-bold uppercase tracking-widest text-xs hover:bg-eglaptop-blue hover:text-white transition-all rounded-xl hover:scale-105">
                View Portfolio | معرض الأعمال
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-white border border-gray-100 shadow-2xl rounded-[3rem] p-16 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-eglaptop-sky/20 -mr-40 -mt-40 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start relative z-10">
                <Cpu size={56} className="text-eglaptop-blue" />
                <div className="text-right">
                  <span className="text-[10px] font-mono text-eglaptop-blue font-bold uppercase tracking-widest block">System Status: Optimal</span>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest" dir="rtl">حالة النظام: مثالية</span>
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-5xl font-bold tracking-tight mb-3">Jasmin v3.1</div>
                <p className="text-sm text-eglaptop-blue/60 font-mono">Neural Orchestration Engine | محرك التنسيق العصبي</p>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="h-3 bg-gray-100 w-full overflow-hidden rounded-full">
                  <div className="h-full bg-eglaptop-orange w-3/4 animate-pulse rounded-full"></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span>Processing | معالجة</span>
                  <span className="text-eglaptop-orange">74%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-eglaptop-blue mb-4">Core Competencies | الكفاءات الأساسية</h2>
            <h3 className="text-5xl font-bold tracking-tight">Our Ecosystem | منظومتنا</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-14 hover:bg-white hover:shadow-2xl transition-all group rounded-[2.5rem] border border-transparent hover:border-eglaptop-orange/20">
              <Mic2 size={40} className="mb-10 text-eglaptop-orange group-hover:scale-110 transition-transform" />
              <h4 className="text-2xl font-bold tracking-tight mb-4">The Arabic Voiceover</h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-10">
                Premium audio production and voice talent management for global brands and creative agencies.
                <span className="block mt-4 font-medium text-gray-400" dir="rtl">إنتاج صوتي فاخر وإدارة مواهب صوتية للعلامات التجارية العالمية.</span>
              </p>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest flex items-center text-eglaptop-blue hover:text-eglaptop-orange transition-colors">
                Explore Site | استكشف الموقع <ArrowRight size={14} className="ml-3" />
              </a>
            </div>
            <div className="bg-gray-50 p-14 hover:bg-white hover:shadow-2xl transition-all group rounded-[2.5rem] border border-transparent hover:border-eglaptop-orange/20">
              <BookOpen size={40} className="mb-10 text-eglaptop-coral group-hover:scale-110 transition-transform" />
              <h4 className="text-2xl font-bold tracking-tight mb-4">Eglaptop Academy</h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-10">
                Advanced technical training in server management, automation, and digital craftsmanship.
                <span className="block mt-4 font-medium text-gray-400" dir="rtl">تدريب تقني متقدم في إدارة السيرفرات، الأتمتة، والحرفية الرقمية.</span>
              </p>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest flex items-center text-eglaptop-blue hover:text-eglaptop-orange transition-colors">
                Join Academy | انضم للأكاديمية <ArrowRight size={14} className="ml-3" />
              </a>
            </div>
            <div className="bg-gray-50 p-14 hover:bg-white hover:shadow-2xl transition-all group rounded-[2.5rem] border border-transparent hover:border-eglaptop-orange/20">
              <Server size={40} className="mb-10 text-eglaptop-sky group-hover:scale-110 transition-transform" />
              <h4 className="text-2xl font-bold tracking-tight mb-4">Eglaptop Infrastructure</h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-10">
                High-performance Linux server tuning, kernel optimization, and secure cloud hosting solutions.
                <span className="block mt-4 font-medium text-gray-400" dir="rtl">ضبط سيرفرات لينكس عالية الأداء، تحسين الكيرنل، وحلول الاستضافة السحابية الآمنة.</span>
              </p>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest flex items-center text-eglaptop-blue hover:text-eglaptop-orange transition-colors">
                View Specs | عرض المواصفات <ArrowRight size={14} className="ml-3" />
              </a>
            </div>
            <div className="bg-gray-50 p-14 hover:bg-white hover:shadow-2xl transition-all group rounded-[2.5rem] border border-transparent hover:border-eglaptop-orange/20">
              <Radio size={40} className="mb-10 text-eglaptop-orange group-hover:scale-110 transition-transform" />
              <h4 className="text-2xl font-bold tracking-tight mb-4">Casting Channels</h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-10">
                Pre-configured Shoutcast and Owncast servers for professional radio and video broadcasting.
                <span className="block mt-4 font-medium text-gray-400" dir="rtl">سيرفرات Shoutcast و Owncast مهيأة مسبقاً للبث الإذاعي والمرئي الاحترافي.</span>
              </p>
              <Link to="/auth" className="text-[10px] font-bold uppercase tracking-widest flex items-center text-eglaptop-blue hover:text-eglaptop-orange transition-colors">
                Get Started | ابدأ الآن <ArrowRight size={14} className="ml-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="team" className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-eglaptop-blue mb-4">Leadership & Expertise | القيادة والخبرة</h2>
              <h3 className="text-5xl font-bold tracking-tight mb-8">25+ Years of <br /><span className="text-eglaptop-orange">Technical Mastery.</span></h3>
              <div className="text-3xl font-bold text-eglaptop-blue/40 mb-8" dir="rtl">أكثر من 25 عاماً من الإتقان التقني</div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Our foundation is built on decades of experience in high-end server architecture, 
                automation, and digital media. We don't just build systems; we engineer excellence.
                <span className="block mt-4 text-sm font-medium text-gray-400" dir="rtl">
                  تأسست شركتنا على عقود من الخبرة في هندسة السيرفرات المتطورة، الأتمتة، والوسائط الرقمية. نحن لا نبني أنظمة فحسب، بل نصمم التميز.
                </span>
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center shrink-0 text-eglaptop-blue border border-gray-100">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1 text-eglaptop-blue">Enterprise Security | أمن المؤسسات</h4>
                    <p className="text-xs text-gray-500">Hardened infrastructure for mission-critical operations.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center shrink-0 text-eglaptop-orange border border-gray-100">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1 text-eglaptop-blue">Global Reach | انتشار عالمي</h4>
                    <p className="text-xs text-gray-500">Serving clients and students across continents with localized precision.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-eglaptop-blue p-12 flex flex-col justify-end text-white relative group overflow-hidden rounded-[3rem] shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-eglaptop-blue to-transparent opacity-60"></div>
                <div className="relative z-10">
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-eglaptop-sky mb-2">Chief Technology Officer | المدير التقني</div>
                  <h4 className="text-5xl font-bold tracking-tight mb-6">Fadi</h4>
                  <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-xs">
                    Architect of the Eglaptop ecosystem. Expert in Linux Kernel Tuning, 
                    API-First automation, and high-performance digital infrastructure.
                    <span className="block mt-4 font-medium text-eglaptop-sky/60" dir="rtl">
                      مهندس منظومة إيجلابتوب. خبير في ضبط كيرنل لينكس، الأتمتة المعتمدة على API، والبنية التحتية الرقمية عالية الأداء.
                    </span>
                  </p>
                  <div className="flex space-x-4">
                    <a 
                      href="https://g.dev/eglaptop" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-white text-eglaptop-blue hover:bg-eglaptop-orange hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center rounded-xl shadow-lg"
                    >
                      Google Developer Profile <ArrowRight size={14} className="ml-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-32 px-6 bg-eglaptop-blue text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white h-full"></div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 bg-white text-eglaptop-blue text-[10px] font-bold uppercase tracking-widest mb-10 rounded-full">
                <Zap size={14} className="mr-3 text-eglaptop-orange" /> Powered by Jasmin AI | مدعوم بـ ياسمين ذكاء اصطناعي
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-none">
                Intelligent <br />
                <span className="text-eglaptop-sky">Automation.</span>
                <div className="text-3xl md:text-5xl mt-6 font-bold text-white/20" dir="rtl">أتمتة ذكية</div>
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-12">
                Our proprietary AI engine, Jasmin, manages everything from SEO content generation 
                to server kernel tuning, ensuring your digital assets perform at their peak 24/7.
                <span className="block mt-4 font-medium text-white/40" dir="rtl">
                  محرك الذكاء الاصطناعي الخاص بنا "ياسمين" يدير كل شيء من توليد محتوى SEO إلى ضبط كيرنل السيرفرات، مما يضمن أداء أصولك الرقمية في ذروتها على مدار الساعة.
                </span>
              </p>
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <div className="text-4xl font-bold tracking-tight mb-2 text-eglaptop-orange">99.9%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Uptime Reliability | موثوقية التشغيل</div>
                </div>
                <div>
                  <div className="text-4xl font-bold tracking-tight mb-2 text-eglaptop-sky">0.4s</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Avg Response Time | متوسط وقت الاستجابة</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { title: 'Predictive Analytics', ar: 'التحليلات التنبؤية', desc: 'Anticipate market trends and traffic spikes.' },
                { title: 'Automated SEO', ar: 'SEO مؤتمت', desc: 'Real-time content optimization and indexing.' },
                { title: 'Security Hardening', ar: 'تحصين أمني', desc: 'Continuous kernel-level threat monitoring.' }
              ].map((item, i) => (
                <div key={i} className="p-10 border border-white/10 hover:border-eglaptop-orange/50 bg-white/5 hover:bg-white/10 transition-all group rounded-[2rem]">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-2xl font-bold tracking-tight mb-2">{item.title}</h4>
                      <div className="text-sm font-bold text-eglaptop-sky/60 mb-3" dir="rtl">{item.ar}</div>
                      <p className="text-sm text-white/40 font-mono">{item.desc}</p>
                    </div>
                    <ChevronRight className="text-white/20 group-hover:text-eglaptop-orange transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-12 h-12 bg-eglaptop-orange flex items-center justify-center text-white font-bold rounded-xl shadow-lg">E</div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-2xl tracking-tight uppercase text-eglaptop-orange">Eglaptop</span>
                <span className="font-display font-medium text-[11px] tracking-[0.4em] uppercase text-eglaptop-blue">Technology</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
              Leading the digital frontier through voice, education, and infrastructure. 
              Built for the next generation of technical excellence.
            </p>
            <p className="text-xs text-gray-400 font-medium" dir="rtl">
              نحن نقود الحدود الرقمية من خلال الصوت، التعليم، والبنية التحتية. بنيت للجيل القادم من التميز التقني.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-eglaptop-blue">Connect | تواصل</h5>
            <ul className="space-y-5 text-sm font-mono">
              <li><a href="https://g.dev/eglaptop" target="_blank" rel="noopener noreferrer" className="hover:text-eglaptop-orange transition-colors flex items-center">Google Developer <ArrowRight size={12} className="ml-2 opacity-0 group-hover:opacity-100" /></a></li>
              <li><a href="#" className="hover:text-eglaptop-orange transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-eglaptop-orange transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-eglaptop-blue">Contact | اتصل بنا</h5>
            <ul className="space-y-5 text-sm font-mono">
              <li className="hover:text-eglaptop-orange transition-colors">ceo@eglaptoptechnology.com</li>
              <li className="hover:text-eglaptop-orange transition-colors">cto@eglaptoptechnology.com</li>
              <li className="hover:text-eglaptop-orange transition-colors">+20 120 191 1118</li>
              <li className="hover:text-eglaptop-orange transition-colors">+20 101 703 480</li>
              <li className="text-gray-400">Riyadh, Saudi Arabia</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <div className="flex flex-col gap-1">
            <span>© 2026 Eglaptop Technology. All Rights Reserved. | جميع الحقوق محفوظة</span>
            <span className="text-gray-400 font-mono text-[8px]">Developed By BeMaaX</span>
          </div>
          <div className="flex space-x-10 mt-6 md:mt-0">
            <a href="#" className="hover:text-eglaptop-orange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-eglaptop-orange transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-eglaptop-orange transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChevronRight({ className, size = 24 }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
