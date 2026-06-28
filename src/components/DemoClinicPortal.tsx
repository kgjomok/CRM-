import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Instagram, 
  Send, 
  Calendar as CalendarIcon, 
  Users, 
  Briefcase, 
  CreditCard, 
  Sparkles, 
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Star,
  Search,
  Image as ImageIcon,
  Compass,
  FileText,
  Check,
  Map,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  X,
  Award,
  DollarSign,
  QrCode,
  ThumbsUp,
  Activity,
  Plus,
  Minus
} from 'lucide-react';
import { Language, translate } from '../lib/translations';
import { CompanySettings } from '../lib/settings';
import { Service, Staff } from '../types';
import CustomerBooking from './CustomerBooking';
import SpecialistsShowcase from './SpecialistsShowcase';

interface DemoClinicPortalProps {
  services: Service[];
  staffList: Staff[];
  lang: Language;
  companySettings: CompanySettings;
  onBookingSuccess: () => void;
}

type SubTabType = 'home' | 'about' | 'services' | 'specialists' | 'booking' | 'prices' | 'gallery' | 'contacts' | 'payment';

export default function DemoClinicPortal({
  services,
  staffList,
  lang,
  companySettings,
  onBookingSuccess
}: DemoClinicPortalProps) {
  const [subTab, setSubTab] = useState<SubTabType>('home');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  // Search state for prices
  const [priceSearch, setPriceSearch] = useState<string>('');
  const [selectedPriceCategory, setSelectedPriceCategory] = useState<string>('all');

  // Payment Simulator states
  const [paymentAmount, setPaymentAmount] = useState<string>('2500');
  const [payerName, setPayerName] = useState<string>('');
  const [payerPhone, setPayerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'mbank' | 'elkart' | 'visa' | 'mastercard' | 'omoney'>('mbank');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');

  // Contacts interactive map zoom simulation
  const [mapZoom, setMapZoom] = useState<number>(3);

  // Animated counters state for statistics
  const [statsExperience, setStatsExperience] = useState(0);
  const [statsPatients, setStatsPatients] = useState(0);
  const [statsSpecialists, setStatsSpecialists] = useState(0);
  const [statsSatisfaction, setStatsSatisfaction] = useState(0);
  const [statsTreatments, setStatsTreatments] = useState(0);

  React.useEffect(() => {
    if (subTab === 'about') {
      setStatsExperience(0);
      setStatsPatients(0);
      setStatsSpecialists(0);
      setStatsSatisfaction(0);
      setStatsTreatments(0);

      const duration = 1200; // ms
      const steps = 30;
      const intervalTime = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setStatsExperience(Math.min(12, Math.round((12 / steps) * currentStep)));
        setStatsPatients(Math.min(15000, Math.round((15000 / steps) * currentStep)));
        setStatsSpecialists(Math.min(8, Math.round((8 / steps) * currentStep)));
        setStatsSatisfaction(Math.min(98, Math.round((98 / steps) * currentStep)));
        setStatsTreatments(Math.min(5000, Math.round((5000 / steps) * currentStep)));

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [subTab]);

  const t = (key: any) => translate(key, lang);

  // Group services by category
  const categories = services.reduce((acc, service) => {
    const cat = service.category || 'Башка кызматтар';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const handleBookSpecialist = (staffId: string) => {
    setSelectedStaffId(staffId);
    setSelectedServiceId(null);
    setSubTab('booking');
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedStaffId(null);
    setSubTab('booking');
  };

  // Helper to fetch Category Curated Images
  const getCategoryImage = (categoryName: string) => {
    const nameLower = categoryName.toLowerCase();
    if (nameLower.includes('ортодон') || nameLower.includes('стом') || nameLower.includes('имплант')) {
      return 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('космет') || nameLower.includes('дермат') || nameLower.includes('эстет')) {
      return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('трихол') || nameLower.includes('чач')) {
      return 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('массаж') || nameLower.includes('терап') || nameLower.includes('калыбына')) {
      return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80';
  };

  // Simulated Payment Execution
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerName.trim()) {
      setPaymentError('Аты-жөнүңүздү толтуруңуз');
      return;
    }
    if (!payerPhone.trim()) {
      setPaymentError('Телефон номериңизди толтуруңуз');
      return;
    }
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setPaymentError('Сумма туура эмес жазылды');
      return;
    }

    setPaymentError('');
    setIsPaid(true);
  };

  const handleResetPayment = () => {
    setIsPaid(false);
    setPayerName('');
    setPayerPhone('');
    setPaymentAmount('2500');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Clinic Header Banner Block */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-center xl:text-left flex-col xl:flex-row">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 p-3 rounded-2xl text-white shadow-lg shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                B1 Premium Dental & Aesthetic
              </h2>
              <span className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Премиум Санарип Клиника
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Бейтаптарга кам көрүүчү даяр сайттын жана кардар порталынын комплекстүү интерактивдүү системасы
            </p>
          </div>
        </div>

        {/* Dynamic Badge for booking summary status */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-800/80 px-4 py-2.5 rounded-2xl shrink-0">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <div className="text-left">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">АКТИВДҮҮ CRM СИНХРОНДОШТУРУУ</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Базада: {services.length} кызмат • {staffList.length} дарыгер</span>
          </div>
        </div>
      </div>

      {/* 9-Tab Navigation System with scroll layout for mobile, bento pills for desktop */}
      <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-900 overflow-x-auto scrollbar-none flex gap-1.5 scroll-smooth">
        {[
          { id: 'home', label: '🏠 Башкы' },
          { id: 'about', label: '🏢 Компания' },
          { id: 'services', label: '📋 Кызматтар' },
          { id: 'specialists', label: '👨‍⚕️ Адистер' },
          { id: 'booking', label: '📅 Жазылуу' },
          { id: 'prices', label: '💰 Баалар' },
          { id: 'gallery', label: '🖼️ Галерея' },
          { id: 'contacts', label: '📍 Контакттар' },
          { id: 'payment', label: '💳 Төлөм' }
        ].map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setSubTab(tabItem.id as SubTabType)}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              subTab === tabItem.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-900/40'
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: HOME (Башкы бет) */}
      {subTab === 'home' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Clinic Banner Hero */}
          <div className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 overflow-hidden text-white border border-slate-800/80 shadow-xl">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200')] bg-cover bg-center mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative max-w-2xl space-y-5">
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Бишкектеги Алдыңкы Премиум Клиника
              </span>
              
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Сиздин жаркыраган ден соолугуңуз жана сулуулугуңуз — <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-sm font-black">Биздин башкы максат!</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                B1 Premium клиникасы – эң заманбап санариптик стоматологияны жана эстетикалык косметологияны айкалыштырган новатордук борбор. Биз менен ар бир жолугушуу коопсуз, ыңгайлуу жана жогорку натыйжалуу болот.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSubTab('booking')}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Онлайн жазылуу</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSubTab('about')}
                  className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-750 text-white text-xs font-black rounded-xl border border-slate-700/80 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Биз жөнүндө толук</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Features Bento List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start shadow-sm">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 rounded-xl shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">10+ Жыл тажрыйба</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">Врачтарыбыздын баары эл аралык деңгээлде билим алышкан жогорку категориядагы адистер.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start shadow-sm">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-950/60 text-sky-500 rounded-xl shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">5,000+ Бейтаптар</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">Биз ар бир кардардын өзгөчөлүгүн эске алуу менен ишенимдүү жана кепилденген натыйжа беребиз.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start shadow-sm">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-500 rounded-xl shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">100% Ишеним жана Коопсуздук</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">Көп баскычтуу стерилизация тутуму жана экологиялык жогорку сапаттагы материалдар.</p>
              </div>
            </div>
          </div>

          {/* Main Services (Негизги кызматтар) Section with Images */}
          <div className="space-y-5">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">АКТУАЛДУУ ТАНДОО</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Негизги Кызматтар</h3>
              </div>
              <button 
                onClick={() => setSubTab('services')}
                className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
              >
                <span>Баардык кызматтар</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'srv-1',
                  name: 'Ортодонтия (Брекеттер)',
                  desc: 'Заманбап Damon тутумдары менен тиштерди оорутпай тез түздөө жана тиштешти оңдоо.',
                  price: '450',
                  duration: '60 мүнөт',
                  img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
                },
                {
                  id: 'srv-2',
                  name: 'Бетти Биоревитализациялоо',
                  desc: 'Гиалурон кычкылы менен терини терең нымдаштыруу, жашартуу жана анын табигый жалтыроосун калыбына келтирүү.',
                  price: '120',
                  duration: '45 мүнөт',
                  img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80'
                },
                {
                  id: 'srv-3',
                  name: 'Тиштерди Имплантациялоо',
                  desc: 'Германиялык жана швейцариялык жогорку сапаттагы импланттарды оорутпай, хирургиялык жол менен ишенимдүү орнотуу.',
                  price: '600',
                  duration: '90 мүнөт',
                  img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80'
                }
              ].map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all group">
                  <div className="relative h-44 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
                      <div>
                        <span className="block text-[8px] font-bold text-slate-400 uppercase">БААСЫ / УБАКТЫСЫ</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">${item.price}</span>
                        <span className="text-slate-400 text-[10px] ml-1">({item.duration})</span>
                      </div>
                      <button
                        onClick={() => handleBookService(item.id)}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg text-[10px] font-black transition-colors"
                      >
                        Жазылуу
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ABOUT US (Компания жөнүндө) */}
      {subTab === 'about' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono block">КЛИНИКА ТУУРАЛУУ</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  B1 Premium Dental & Aesthetic Clinic
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Биздин клиника – бул заманбап стоматологиялык дарылоо жана эстетикалык косметология тармагындагы эң алдыңкы медициналык уюм болуп саналат. Биз Кыргызстанда биринчилерден болуп санариптик 3D моделдөө жана компьютердик диагностика тутумдарын ийгиликтүү киргиздик.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Ар бир бейтапка болгон жогорку медициналык жоопкерчилик, стерилдөөнүн эл аралык катуу протоколдору (АКШ жана Германия стандарттарына туура келген) жана врачтардын эл аралык деңгээлдеги сертификациясы – биздин ишибиздин өзөгүн түзөт.
                </p>
              </div>

              <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Биздин Башкы Миссиябыз
                </h4>
                <p className="text-xs text-emerald-600/90 dark:text-emerald-400 font-semibold leading-relaxed">
                  "Ар бир бейтаптын өзгөчө табигый сулуулугун инновациялык санариптик медицина жана жогорку кесипкөйлүк аркылуу коопсуз сактап калуу жана алардын жашоо сапатын жакшыртуу!"
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[300px] shadow-md border border-slate-200 dark:border-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800" 
                alt="Clinic Interior Lobby" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] bg-emerald-500 px-2 py-0.5 rounded text-white font-extrabold tracking-wider uppercase">КЛИНИКАНЫН ХОЛЛУ</span>
                <h4 className="text-sm font-black">Премиум шарттар жана жайлуулук</h4>
              </div>
            </div>
          </div>

          {/* Клиниканын статистикасы (Clinic Statistics) */}
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono block">БИЗДИН ЖЕТИШКЕНДИКТЕР</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Клиниканын статистикасы</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center space-y-1 group hover:border-emerald-500/30 transition-all">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-sans block pt-1">
                  {statsExperience} жылдык
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">тажрыйба</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center space-y-1 group hover:border-blue-500/30 transition-all">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-sans block pt-1">
                  {statsPatients.toLocaleString()}+
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">бейтап</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center space-y-1 group hover:border-indigo-500/30 transition-all">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-sans block pt-1">
                  {statsSpecialists} адис
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">тажрыйбалуу</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center space-y-1 group hover:border-pink-500/30 transition-all">
                <div className="p-2 bg-pink-50 dark:bg-pink-950/60 text-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-sans block pt-1">
                  {statsSatisfaction}%
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">канааттанган кардар</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center space-y-1 col-span-2 sm:col-span-1 group hover:border-amber-500/30 transition-all">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-sans block pt-1">
                  {statsTreatments.toLocaleString()}+
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">ийгиликтүү дарылоо</span>
              </div>
            </div>
          </div>

          {/* Заманбап жабдуулар (Modern Equipment) */}
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono block">МЕДИЦИНАЛЫК ТЕХНОЛОГИЯЛАР</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Заманбап жабдуулар</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  title: '3D Рентген',
                  desc: 'Planmeca ProMax 3D – минималдуу нурлануу менен тиштердин 3D диагностикасы.',
                  img: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600&auto=format&fit=crop&q=80'
                },
                {
                  title: 'Санарип сканер',
                  desc: '3Shape TRIOS – ооз көңдөйүн бир нече секундда толук сканерлөөчү инновациялык аппарат.',
                  img: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&auto=format&fit=crop&q=80'
                },
                {
                  title: 'Лазердик аппарат',
                  desc: 'Waterlase iPlus – тиштин жумшак жана катуу ткандарын оорутпай, кансыз дарылоочу лазер системасы.',
                  img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80'
                },
                {
                  title: 'Имплантация системасы',
                  desc: 'X-Guide Navigation – импланттарды компьютердик навигация аркылуу жогорку тактыкта коопсуз орнотуу.',
                  img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'
                },
                {
                  title: 'Косметологиялык аппарат',
                  desc: 'InMode Morpheus8 – микроийнелүү RF-лифтинг жана терини терең жашартуучу премиум платформа.',
                  img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all group">
                  <div className="relative h-32 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specific Advantages Grid */}
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">ЭМНЕ ҮЧҮН БИЗДИ ТАНДАШАТ?</span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Башкы Артыкчылыктарыбыз</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: <Users className="w-5 h-5 text-emerald-500" />,
                  title: 'Кесипкөй Адистер',
                  desc: 'Дарыгерлерибиз Түштүк Корея, Германия жана Россиянын алдыңкы академияларында такай билимин өркүндөтүп турушат.'
                },
                {
                  icon: <Activity className="w-5 h-5 text-sky-500" />,
                  title: 'Заманбап Жабдуулар',
                  desc: '3D Компьютердик томографтар, микроскоптор жана акыркы муундагы аппараттык косметологиялык платформалар.'
                },
                {
                  icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
                  title: '100% Коопсуздук',
                  desc: 'АКШ стандарттарына шайкеш келген көп баскычтуу стерилдөө борбору жана сертификатталган препараттар.'
                },
                {
                  icon: <Sparkles className="w-5 h-5 text-pink-500" />,
                  title: 'Индивидуалдык Мамиле',
                  desc: 'Сиздин убактыңызга ыңгайлуу пландар жана 3D симуляция аркылуу келечектеги натыйжаны алдын ала талкуулоо.'
                }
              ].map((adv, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 w-11 h-11 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-850">
                    {adv.icon}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{adv.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">{adv.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Лицензия бөлүмү */}
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono block">КЕПИЛДИК ЖАНА УКУКТУУЛУК</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Медициналык Лицензия</h3>
            </div>

            <div className="relative bg-gradient-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/20 p-6 rounded-3xl border border-emerald-500/20 dark:border-emerald-900/40 flex flex-col sm:flex-row gap-6 items-center justify-between shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
              
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Лицензия Текшерилди
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Мамлекеттик Медициналык Лицензия
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold max-w-xl">
                    Биздин клиника Кыргыз Республикасынын Саламаттык сактоо министрлиги тарабынан расмий уруксат берилген жана бардык стерилдөө, коопсуздук эрежелерине толугу менен жооп берет.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs shrink-0 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-emerald-500/15 pt-4 sm:pt-0 sm:pl-8 relative z-10">
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">ЛИЦЕНЗИЯ №</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 font-mono text-xs">№00524-КР</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">БЕРИЛГЕН КҮНҮ</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 font-mono text-xs">12.04.2022-ж.</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">БЕРГЕН ОРГАН</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 text-[10px]">Саламаттык сактоо министрлиги тарабынан берилген</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SERVICES (Кызматтар) */}
      {subTab === 'services' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">КАТЕГОРИЯЛАР ЖАНА БААЛАР</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Клиникалык Кызматтарыбыз</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Биз сунуштаган заманбап премиум кызматтардын толук категорияланган тизмеси:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.keys(categories).map((catName) => (
              <div key={catName} className="space-y-4">
                {/* Category Header Card with Curated Background Image */}
                <div className="relative h-24 rounded-2xl overflow-hidden flex items-end p-4 border border-slate-200/40 dark:border-slate-800/60 shadow-inner">
                  <img src={getCategoryImage(catName)} alt={catName} className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4]" />
                  <div className="relative z-10">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block font-mono">МЕДИЦИНАЛЫК ТАРМАК</span>
                    <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">{catName}</h4>
                  </div>
                </div>

                <div className="space-y-3">
                  {categories[catName].map((srv) => (
                    <div 
                      key={srv.id}
                      className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-150 dark:border-slate-850 flex justify-between items-center hover:border-emerald-500/30 transition-all gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight">{srv.name}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          ⏱️ {srv.duration_minutes || 45} мүнөт • {srv.description || 'Эл аралык жогорку сапаттагы материалдар колдонулат'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">${srv.price}</span>
                        <button
                          onClick={() => handleBookService(srv.id)}
                          className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 rounded-lg hover:border-emerald-500 hover:text-emerald-500 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>Жазылуу</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SPECIALISTS (Адистер) */}
      {subTab === 'specialists' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">БИЗДИН ДАРЫГЕРЛЕР</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Профессионалдуу Адистерибиз</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Сиздин ден соолугуңуз үчүн жоопкерчиликтүү өз ишинин чеберлери:</p>
          </div>

          <SpecialistsShowcase
            lang={lang}
            onBookSpecialist={handleBookSpecialist}
          />
        </div>
      )}

      {/* TAB CONTENT 5: ONLINE BOOKING (Онлайн жазылуу) */}
      {subTab === 'booking' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-fadeIn">
          
          {/* Booking Info Panel */}
          <div className="xl:col-span-4 space-y-5">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 w-11 h-11 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Кабыл алууга жазылуу</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Бул жерден сиз каалаган кызматты, убакытты жана дарыгерди тандап, кабыл алууга дароо жазыла аласыз. 
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Реалдуу убакытта убакыттарды текшерүү</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Автоматтык түрдө CRM журналына синхрондошуу</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Каттоодон кийин WhatsApp тастыктоо</span>
                </div>
              </div>
            </div>

            {/* Quick Helper Note */}
            <div className="bg-slate-950 p-6 rounded-2xl text-slate-300 space-y-3 border border-slate-800/80 shadow-md">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block font-mono">СЫНОО РЕЖИМИ</span>
              <p className="text-[11px] leading-relaxed font-normal">
                Бул жерде түзүлгөн ар бир жазылуу автоматтык түрдө сол менюдагы <strong>"⚙️ Башкаруу" / "Админ панели"</strong> бөлүмүндөгү CRM журналында дароо пайда болот.
              </p>
            </div>
          </div>

          {/* Booking System Wizard Container */}
          <div className="xl:col-span-8">
            <CustomerBooking 
              services={services} 
              staffList={staffList} 
              onBookingSuccess={() => {
                onBookingSuccess();
                setSubTab('home');
              }} 
              lang={lang}
              initialStaffId={selectedStaffId}
              onClearPreselectedStaff={() => setSelectedStaffId(null)}
              initialServiceId={selectedServiceId}
              onClearPreselectedService={() => setSelectedServiceId(null)}
            />
          </div>

        </div>
      )}

      {/* TAB CONTENT 6: PRICES (Баалар) */}
      {subTab === 'prices' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">ПРАЙС-ЛИСТ</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Кызматтардын Баалары</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Клиникадагы бардык дарылоо жана косметологиялык баалардын толук тизмеси:</p>
            </div>

            {/* Search Filter input */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Издөө..."
                  value={priceSearch}
                  onChange={(e) => setPriceSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-emerald-500 w-full sm:w-48 text-slate-800 dark:text-slate-200"
                />
              </div>

              <select
                value={selectedPriceCategory}
                onChange={(e) => setSelectedPriceCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-850 dark:text-slate-250 cursor-pointer"
              >
                <option value="all">Бардык бөлүмдөр</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Table List */}
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[9px] border-b border-slate-100 dark:border-slate-850">
                <tr>
                  <th className="px-6 py-4">Кызматтын Аталышы</th>
                  <th className="px-6 py-4">Категория</th>
                  <th className="px-6 py-4">⏱️ Убактысы</th>
                  <th className="px-6 py-4">💰 Баасы</th>
                  <th className="px-6 py-4 text-center">Аракет</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {services
                  .filter(srv => {
                    const matchesSearch = srv.name.toLowerCase().includes(priceSearch.toLowerCase()) || 
                                          (srv.description && srv.description.toLowerCase().includes(priceSearch.toLowerCase()));
                    const matchesCat = selectedPriceCategory === 'all' || srv.category === selectedPriceCategory;
                    return matchesSearch && matchesCat;
                  })
                  .map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all font-medium">
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-900 dark:text-white block">{srv.name}</span>
                        {srv.description && <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">{srv.description}</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-[9px] rounded font-bold text-slate-600 dark:text-slate-400">
                          {srv.category || 'Башка кызматтар'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono">
                        {srv.duration_minutes || 45} мүнөт
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-black text-emerald-600 dark:text-emerald-400">${srv.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleBookService(srv.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black transition-colors"
                        >
                          Жазылуу
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: GALLERY (Галерея) */}
      {subTab === 'gallery' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">КЛИНИКАНЫН ФОТОСҮРӨТТӨРҮ</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Фото Галереябыз</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Биздин заманбап кабинеттердин, эң акыркы жабдуулардын жана ыңгайлуу шарттардын фотолору:</p>
          </div>

          {/* Photo Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Кабыл алуу залы (Reception)',
                desc: 'Кардарларыбызды жылуу жана ыңгайлуу кабыл алуучу залыбыз.',
                img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
              },
              {
                title: 'Стоматологиялык Кабинет',
                desc: 'Эң заманбап стоматологиялык кресло жана диагностикалык жабдыктар.',
                img: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&auto=format&fit=crop&q=80'
              },
              {
                title: 'Эстетикалык Косметология Кабинети',
                desc: 'Бет жана тери курагын калыбына келтирүүчү заманбап лазердик бөлмө.',
                img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80'
              },
              {
                title: 'Диагностика тутуму (3D Компьютердик томография)',
                desc: 'Микро-тактыктагы 3D изилдөө жасоочу санарип технологиялар.',
                img: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600&auto=format&fit=crop&q=80'
              },
              {
                title: 'Дарылоо микроскобу',
                desc: 'Эң татаал тиш тамырларын жана каналдарын 20 эсе чоңойтуп дарылоочу жабдык.',
                img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'
              },
              {
                title: 'Бейтаптар үчүн эс алуу зонасы',
                desc: 'Кабыл алуу алдында же дарылоодон кийин кофе ичип тыныгуучу ыңгайлуу бурч.',
                img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
              }
            ].map((pic, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 overflow-hidden shadow-sm hover:border-emerald-500/20 group transition-all">
                <div className="relative h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img src={pic.img} alt={pic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">Чоңойтуп көрүү</span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{pic.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">{pic.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: CONTACTS (Контакттар) */}
      {subTab === 'contacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
          
          {/* Contact details and Working Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">МААЛЫМАТТАР</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Биздин Дарек & Байланыш</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Клиникабызга келүү же суроолор боюнча байланышуу боюнча маалыматтар:</p>
              </div>

              {/* Specific detail rows */}
              <div className="space-y-4 border-t border-b border-slate-100 dark:border-slate-800/80 py-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-500 rounded-lg shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase">Дарегибиз</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">Бишкек ш., Тынчтык проспектиси, 12А (B1 Plaza, 1-кабат)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-500 rounded-lg shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase">Байланыш телефону</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">+996 (555) 012-345 • +996 (312) 90-80-70</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-500 rounded-lg shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase">Иш убактысы</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">Дүйшөмбү - Жекшемби, 09:00 - 20:00, Күн сайын</span>
                  </div>
                </div>
              </div>

              {/* Social channels block */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Дароо жазуу же суроо берүү</h4>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://wa.me/996555012345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all border border-emerald-100 dark:border-emerald-900"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Жазуу</span>
                  </a>
                  <a
                    href="https://instagram.com/b1_premium_clinic_mock"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 rounded-xl text-xs font-black hover:bg-pink-100 dark:hover:bg-pink-900 transition-all border border-pink-100 dark:border-pink-900"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram Баракча</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Fully Interactive Custom Styled Map Grid Mockup (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">КАРТА СИМУЛЯЦИЯСЫ</span>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Интерактивдүү Карта</h4>
              </div>
              
              {/* Map controls */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <button 
                  onClick={() => setMapZoom(prev => Math.max(1, prev - 1))}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  title="Кичирейтүү"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-slate-400 px-1 font-mono">Zoom: {mapZoom}x</span>
                <button 
                  onClick={() => setMapZoom(prev => Math.min(5, prev + 1))}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  title="Чоңойтуу"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Custom high-fidelity CSS styled vector map */}
            <div className="relative h-64 sm:h-80 bg-slate-200 dark:bg-slate-900 rounded-2xl border border-slate-300/40 dark:border-slate-800/80 overflow-hidden flex items-center justify-center">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-slate-200/50 dark:to-slate-950/50 pointer-events-none" />
              <div className="absolute inset-0 bg-grid-pattern opacity-15" />

              {/* Vector Roads & Streets styled according to Zoom state */}
              <div 
                className="absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center"
                style={{ transform: `scale(${1 + (mapZoom - 3) * 0.25})` }}
              >
                {/* Main Avenue */}
                <div className="absolute w-[500px] h-10 bg-slate-300 dark:bg-slate-800 rounded-full rotate-12 -translate-y-8 flex items-center justify-center border-l border-r border-slate-400/40">
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest font-sans">Тынчтык проспектиси</span>
                </div>

                {/* Cross Street */}
                <div className="absolute h-[500px] w-8 bg-slate-300 dark:bg-slate-800 rounded-full -rotate-75 translate-x-12 flex items-center justify-center">
                  <span className="text-[6px] font-extrabold text-slate-500 uppercase tracking-widest rotate-90 whitespace-nowrap">Ахунбаев көчөсү</span>
                </div>

                {/* Nearby buildings representation */}
                <div className="absolute top-12 left-24 w-16 h-12 bg-slate-400/20 dark:bg-slate-850/40 rounded-xl border border-slate-400/10 flex items-center justify-center">
                  <span className="text-[7px] text-slate-400 font-bold uppercase">B1 Plaza</span>
                </div>
                <div className="absolute bottom-12 right-24 w-20 h-10 bg-slate-400/20 dark:bg-slate-850/40 rounded-xl border border-slate-400/10 flex items-center justify-center">
                  <span className="text-[7px] text-slate-400 font-bold uppercase">Парк Аймагы</span>
                </div>

                {/* Glowing Target Clinic Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="bg-emerald-500 p-2.5 rounded-full text-white shadow-xl animate-bounce relative z-10 border-2 border-white dark:border-slate-950">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="w-4 h-4 bg-emerald-500/40 rounded-full absolute -bottom-1 blur-sm animate-ping" />
                  
                  {/* Address Popup block */}
                  <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase whitespace-nowrap mt-1 border border-slate-750 shadow-md">
                    📍 Тынчтык пр., 12А
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Карта симуляциялык режимде иштеп жатат. Сиз даректи так ушул Тынчтык проспектисинен таба аласыз.</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 9: ONLINE PAYMENT (Онлайн төлөм) */}
      {subTab === 'payment' && (
        <div className="max-w-3xl mx-auto animate-fadeIn">
          
          {/* Main Payment Container Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
            
            {/* Payment Header */}
            <div className="bg-slate-950 p-6 sm:p-8 text-white relative">
              <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase">
                ТӨЛӨМ СИМУЛЯТОРУ
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono block">ОНЛАЙН ТӨЛӨӨ</span>
                <h3 className="text-xl font-black text-white tracking-tight">QR-код же Карточка аркылуу төлөө</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Клиникалык дарылоо жана кызматтарды ыңгайлуу аралыктан төлөө симуляциясы.
                </p>
              </div>
            </div>

            {/* Simulated Payment Success State */}
            {isPaid ? (
              <div className="p-8 sm:p-12 text-center space-y-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-full flex items-center justify-center shadow-lg border border-emerald-100 dark:border-emerald-900 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 stroke-[3]" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    Төлөм ийгиликтүү кабыл алынды
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Төлөмүңүз ийгиликтүү катталды! Клиниканын администратору төлөмдү текшерип, Сиздин уюлдук номериңизге байланышат. Рахмат!
                  </p>
                </div>

                {/* Virtual receipt printout detail */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-850 text-left text-xs max-w-sm w-full space-y-2.5 font-medium">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Квитанция</span>
                    <span>Транзакция ID: B1-{Math.floor(Math.random() * 900000) + 100000}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Төлөөчү:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{payerName}</span>
                  </div>

                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Байланыш номери:</span>
                    <span className="font-mono text-slate-900 dark:text-white">{payerPhone}</span>
                  </div>

                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Төлөм ыкмасы:</span>
                    <span className="font-extrabold uppercase text-slate-900 dark:text-white">{paymentMethod}</span>
                  </div>

                  <div className="flex justify-between text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-850 pt-2.5 font-extrabold">
                    <span>Жалпы Төлөнгөн Сумма:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">{paymentAmount} KGS</span>
                  </div>
                </div>

                <button
                  onClick={handleResetPayment}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all shadow cursor-pointer"
                >
                  Жаңы төлөм жасоо
                </button>
              </div>
            ) : (
              // Payment Entry form with QR simulation
              <form onSubmit={handleProcessPayment} className="p-6 sm:p-8 space-y-6">
                
                {/* Method selector options */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Төлөм Системасын Тандоо</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { id: 'mbank', label: 'MBank', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-600 dark:text-emerald-400', logo: '🟢' },
                      { id: 'elkart', label: 'Элкарт', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/30 text-blue-600 dark:text-blue-400', logo: '🔵' },
                      { id: 'visa', label: 'Visa', bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/30 text-indigo-600 dark:text-indigo-400', logo: '💳' },
                      { id: 'mastercard', label: 'MasterCard', bg: 'bg-red-50 dark:bg-red-950/40 border-red-500/30 text-red-600 dark:text-red-400', logo: '🔴' },
                      { id: 'omoney', label: 'O!Money', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/30 text-amber-600 dark:text-amber-400', logo: '🟡' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                          paymentMethod === method.id
                            ? `${method.bg} border-2 scale-[1.02] shadow-sm`
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm">{method.logo}</span>
                        <span className="text-[11px] font-black">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left block (7 cols): Text inputs */}
                  <div className="md:col-span-7 space-y-4">
                    
                    {paymentError && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs flex gap-2 items-center">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="font-bold">{paymentError}</span>
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <label className="block text-slate-400 text-[10px] uppercase tracking-wider">Сиздин Аты-жөнүңүз (ФИО)</label>
                      <input
                        type="text"
                        placeholder="Мисалы: Марат Асанов"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <label className="block text-slate-400 text-[10px] uppercase tracking-wider">Байланыш телефонуңуз</label>
                      <input
                        type="text"
                        placeholder="Мисалы: +996 (555) 123-456"
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <label className="block text-slate-400 text-[10px] uppercase tracking-wider">Төлөм суммасы (KGS)</label>
                      <input
                        type="number"
                        placeholder="Суманы жазыңыз"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 font-extrabold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Төлөмдү ырастоо</span>
                    </button>
                  </div>

                  {/* Right block (5 cols): Beautiful Simulated Scan QR Code card */}
                  <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">ТЕЗ САКТОО & СКАНИРЛӨӨ</span>
                    
                    {/* Simulated High Fidelity QR representation */}
                    <div className="relative bg-white p-4 rounded-xl border border-slate-250/60 dark:border-slate-800 shadow-md">
                      
                      {/* Stylized QR Border Targets */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-500" />

                      {/* Simulated QR block layout */}
                      <div className="w-32 h-32 flex flex-col justify-between p-1 bg-slate-50">
                        {/* Row 1 */}
                        <div className="flex justify-between">
                          <div className="w-8 h-8 bg-slate-900 border-2 border-slate-900 p-0.5"><div className="w-full h-full bg-white flex items-center justify-center"><div className="w-1/2 h-1/2 bg-slate-900"></div></div></div>
                          <div className="w-3 h-5 bg-slate-900 rounded-sm"></div>
                          <div className="w-8 h-8 bg-slate-900 border-2 border-slate-900 p-0.5"><div className="w-full h-full bg-white flex items-center justify-center"><div className="w-1/2 h-1/2 bg-slate-900"></div></div></div>
                        </div>
                        {/* Row 2 */}
                        <div className="flex justify-around items-center h-8">
                          <div className="w-4 h-4 bg-slate-900"></div>
                          {/* Central brand mini shield */}
                          <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center text-[10px] text-white font-black shadow animate-pulse">
                            B1
                          </div>
                          <div className="w-4 h-4 bg-slate-900"></div>
                        </div>
                        {/* Row 3 */}
                        <div className="flex justify-between">
                          <div className="w-8 h-8 bg-slate-900 border-2 border-slate-900 p-0.5"><div className="w-full h-full bg-white flex items-center justify-center"><div className="w-1/2 h-1/2 bg-slate-900"></div></div></div>
                          <div className="w-5 h-2 bg-slate-900"></div>
                          <div className="w-8 h-8 bg-slate-900 flex flex-wrap gap-1 p-0.5">
                            <div className="w-3 h-3 bg-slate-900"></div>
                            <div className="w-3 h-3 bg-slate-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">Кассалык QR Сканер</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                        Смартфонуңуздун камерасы же {paymentMethod.toUpperCase()} тиркемеси аркылуу бул QR-кодду сканерлеп, төлөмдү аткарсаңыз болот.
                      </p>
                    </div>
                  </div>

                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
