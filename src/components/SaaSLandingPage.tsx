import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ChevronDown, 
  MessageSquare,
  Smartphone,
  Layers,
  TrendingUp,
  Award,
  Phone,
  Mail,
  MapPin,
  Send,
  Star,
  Check,
  Globe,
  Calendar,
  CreditCard,
  Briefcase,
  BarChart3,
  Laptop,
  Play,
  ExternalLink,
  Zap,
  Building2,
  CheckSquare,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { Language } from '../lib/translations';
import { CompanySettings } from '../lib/settings';

interface SaaSLandingPageProps {
  lang: Language;
  companySettings: CompanySettings;
  onStartDemoClinic: (mode: 'clinic' | 'admin') => void;
}

export default function SaaSLandingPage({ 
  lang, 
  companySettings, 
  onStartDemoClinic 
}: SaaSLandingPageProps) {
  // FAQ collapse state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactContactInfo, setContactContactInfo] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactContactInfo) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactName('');
        setContactContactInfo('');
        setContactMsg('');
      }, 4000);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToContact = () => {
    const elem = document.getElementById('contact-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const highlightedFeatures = [
    {
      title: "Даяр веб-сайт",
      desc: "Кардарларыңыз үчүн суткасына 24 саат иштеген заманбап, ылдам жеке веб-сайт жана кызматтар каталогу.",
      icon: Globe,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      title: "Онлайн жазылуу",
      desc: "Телефон чалууларсыз ыңгайлуу, 1 мүнөттө каалаган убакытты жана кызматты тандоо мүмкүнчүлүгү.",
      icon: Calendar,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    {
      title: "CRM",
      desc: "Кардарлардын толук электрондук базасы, келүү тарыхы, эскертүүлөр жана жеке арзандатуулар.",
      icon: Users,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      title: "Веб-касса",
      desc: "Күнүмдүк кирешени эсептөө, онлайн төлөмдөрдү кабыл алуу (MBank, О!Деньги, Элкарт) жана көзөмөл.",
      icon: CreditCard,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      title: "Адистерди башкаруу",
      desc: "Врачтардын жана кызматкерлердин иш графигин, жүктөмүн жана киреше пайыздарын так эсептөө.",
      icon: Briefcase,
      color: "bg-sky-500/10 text-sky-500 border-sky-500/20"
    },
    {
      title: "WhatsApp билдирүүлөрү",
      desc: "Жазылууну тастыктоо жана кабыл алууга 2 саат калганда автоматтык эскертүү билдирүүлөрү.",
      icon: MessageSquare,
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 px-6 sm:px-10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl text-white">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            <span>ДАЯР ВЕБ-САЙТ ЖАНА CRM СИСТЕМАСЫ</span>
          </motion.div>
 
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.3] text-white max-w-4xl mx-auto"
          >
            Клиникалар, стоматологиялар жана сулуулук борборлору үчүн даяр веб-сайт, онлайн жазылуу, веб-касса жана CRM башкаруу системасы.
          </motion.h1>
 
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Кагаз журналдарды жана чалууларды унутуңуз. Кардарлар суткасына 24 саат онлайн жазылат, касса автоматтык эсептелет, ал эми WhatsApp аркылуу билдирүүлөр жана эскертүүлөр жөнөтүлөт.
          </motion.p>
 
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <button
              onClick={() => onStartDemoClinic('clinic')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white py-4 px-9 rounded-2xl text-base font-bold shadow-xl shadow-blue-600/30 hover:shadow-blue-600/45 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping group-hover:animate-none shrink-0" />
              <span>Демо клиниканы көрүү</span>
            </button>
 
            <button
              onClick={() => onStartDemoClinic('admin')}
              className="w-full sm:w-auto bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 py-4 px-9 rounded-2xl text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xl"
            >
              <Layers className="w-5 h-5 text-blue-600" />
              <span>CRM системасын көрүү</span>
            </button>
          </motion.div>

          {/* Key Advantages Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-10 text-xs text-slate-400 font-semibold border-t border-slate-800/80 max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>15 мүнөттө ишке кирет</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Коопсуз булут сактоо</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Телефондон башкаруу</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. HIGHLIGHTED FEATURES SECTION */}
      <section className="space-y-12 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Платформанын мүмкүнчүлүктөрү</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Бизнесиңизди өстүрүүчү 6 негизги инструмент
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Бардык керектүү функциялар бирдиктүү экосистемага бириктирилген
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlightedFeatures.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div 
                key={feat.title}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm ${feat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{feat.title}</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto opacity-80" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUCT SHOWCASE / INTERACTIVE DEMO */}
      <section className="bg-slate-900 text-white p-8 sm:p-14 rounded-3xl border border-slate-800 shadow-2xl space-y-12 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">Интерактивдүү Демо</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Системаны азыр реалдуу убакытта сынап көрүңүз
          </h2>
          <p className="text-sm text-slate-300">
            Биз сизге эки багыттуу даяр интерфейсти сунуштайбыз. Каалаган модулду тандап көрүңүз:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Client Portal Demo */}
          <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800/80 space-y-6 flex flex-col justify-between hover:border-blue-500/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                1. Кардарлар үчүн онлайн жазылуу порталы
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Кардарларыңыз сулуулук салонуңузга, стоматология же клиникаңызга кантип жазыларын көрүңүз. Кызматты, врачын жана убакытты 3 чыкылдатуу менен тандоо.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2">
                <li className="flex items-center gap-2">✓ Ыңгайлуу мобилдик интерфейс</li>
                <li className="flex items-center gap-2">✓ Адистердин сүрөттөрү жана рейтингдери</li>
                <li className="flex items-center gap-2">✓ Бош убакыттардын реалдуу графиги</li>
              </ul>
            </div>

            <button
              onClick={() => onStartDemoClinic('clinic')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <span>Демо клиниканы көрүү</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin CRM Demo */}
          <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800/80 space-y-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                2. Жетекчилер үчүн CRM башкаруу панели
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Клиниканын жетекчиси же администратору катары системага кирип жазылуулардын графигин, веб-кассаны жана финансылык аналитиканы көзөмөлдөңүз.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2">
                <li className="flex items-center gap-2">✓ Күнүмдүк кабыл алуулардын электрондук журналы</li>
                <li className="flex items-center gap-2">✓ Кардарлардын толук карточкасы жана тарыхы</li>
                <li className="flex items-center gap-2">✓ Киреше жана кызматкерлердин статистикасы</li>
              </ul>
            </div>

            <button
              onClick={() => onStartDemoClinic('admin')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 py-3.5 px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <span>CRM системасын көрүү</span>
              <ExternalLink className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE OUR SOLUTION (BENEFITS) */}
      <section className="bg-slate-50 dark:bg-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-inner max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-5">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Эмне үчүн бизди тандашат?</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Бизнесиңиздин эффективдүүлүгүн 2 эсе жогорулатыңыз
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Ата мекендик клиникалардын жана сулуулук салондорунун өзгөчөлүктөрүн эске алуу менен иштелип чыккан ишенимдүү программа.
          </p>
          <div className="pt-2">
            <button 
              onClick={scrollToContact}
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 py-3 px-7 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Кеңеш алуу үчүн кайрылуу</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Админдин убактысын үнөмдөө</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Телефон аркылуу кайталанма суроолорго жооп берүү токтоп, администратор кардарларды тейлөөгө көбүрөөк көңүл бурат.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Келбей калууларды 95% азайтуу</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                WhatsApp автоматтык эскертүүлөрү кардарларга убактысын унутуп калбоого жардам берет.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Кирешенин тынбаган өсүшү</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Жазылуу порталы суткасына 24 саат ачык. Кардарлардын 40%ы жумуш убактысынан кийин кечинде онлайн катталат.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Финансылык толук тартип</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ар бир кызматтын баасы, арзандатуулар жана кызматкерлердин пайызы так көзөмөлдөнөт.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="space-y-10 px-4 max-w-3xl mx-auto">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Көп берилүүчү суроолорго жооптор
          </h2>
        </div>

        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleFaq(0)}
              className="w-full flex justify-between items-center p-5 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <span>Системаны канча убакытта орнотуп ишке киргизсе болот?</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === 0 ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === 0 && (
              <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800">
                Бар болгону 15 мүнөттө! Кызматтардын тизмесин, бааларын жана адистердин иш графигин киргизгенден кийин даяр шилтемени кардарларга жөнөтүп же Инстаграмга коёсуз.
              </div>
            )}
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleFaq(1)}
              className="w-full flex justify-between items-center p-5 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <span>WhatsApp билдирүүлөрү автоматтык түрдө жөнөтүлөбү?</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === 1 ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === 1 && (
              <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800">
                Ооба, кардар онлайн жазылганда тастыктоо билдирүүсү, ал эми кабыл алуу убактысына 2 саат калганда автоматтык эскертүү билдирүүсү барат.
              </div>
            )}
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleFaq(2)}
              className="w-full flex justify-between items-center p-5 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <span>Кызматкерлердин айлыгын жана пайызын эсептейби?</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === 2 ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === 2 && (
              <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800">
                Ооба, ар бир адиске жеке киреше пайызын (мисалы, 30% же 50%) белгилеп койсоңуз болот. Веб-касса ар бир өткөрүлгөн кабыл алуудан сумманы автоматтык түрдө бөлүп эсептейт.
              </div>
            )}
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleFaq(3)}
              className="w-full flex justify-between items-center p-5 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <span>Төлөм системалары (MBank, О!Деньги) менен иштейби?</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === 3 ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === 3 && (
              <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800">
                Ооба, биз Кыргызстандагы бардык популярдуу мобилдик банкингдер аркылуу онлайн төлөм жана алдын ала предоплата кабыл алуу интеграцияларын сунуштайбыз.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. CONTACT */}
      <section id="contact-section" className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 max-w-5xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block">Байланышуу</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Системаны кошуу боюнча билдирүү калтырыңыз
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Биздин адистер сизге 15 мүнөттүн ичинде байланышып, тутумду кошуу боюнча акысыз консультация өткөрөт.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Телефон / Телеграм</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">+996 (555) 12-34-56</span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">WhatsApp Чат</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Тез колдоо борбору</span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Дарек</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Бишкек шаары, Эркиндик бульвары 58</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleContactSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
          {contactSubmitted ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Билдирүүңүз кабыл алынды!</h4>
              <p className="text-xs text-slate-500 max-w-xs">Менежер жакынкы мүнөттөрдө көрсөтүлгөн номерге байланышат. Рахмат!</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">Аты-жөнүңүз</label>
                <input 
                  type="text" 
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Мисалы: Азамат"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">Телефон номериңиз же Email</label>
                <input 
                  type="text" 
                  required
                  value={contactContactInfo}
                  onChange={e => setContactContactInfo(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="+996 700 12-34-56"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">Сурооңуз же комментарий</label>
                <textarea 
                  required
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Мисалы: Клиникама онлайн жазылуу кошкум келет..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
              >
                <Send className="w-4 h-4" />
                <span>Билдирүүнү жөнөтүү</span>
              </button>
            </>
          )}
        </form>
      </section>

    </div>
  );
}
