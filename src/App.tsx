import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Database, 
  Layers, 
  Calendar as CalendarIcon, 
  Users, 
  Briefcase, 
  UserCheck, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Globe,
  Sun,
  Moon,
  Settings as SettingsIcon,
  LogIn,
  LogOut,
  Lock,
  Mail,
  Home
} from 'lucide-react';
import { Customer, Service, Staff, Appointment } from './types';
import { api, isSupabaseConfigured } from './lib/supabase';
import { AnimatePresence } from 'motion/react';
import CustomerBooking from './components/CustomerBooking';
import AdminDashboard from './components/AdminDashboard';
import SchemaViewer from './components/SchemaViewer';
import NotificationToast from './components/NotificationToast';
import SaaSLandingPage from './components/SaaSLandingPage';
import CompanySettingsView from './components/CompanySettingsView';
import SpecialistsShowcase from './components/SpecialistsShowcase';
import DemoClinicPortal from './components/DemoClinicPortal';

import { Language, translate } from './lib/translations';
import { CompanySettings, getCompanySettings, saveCompanySettings } from './lib/settings';

export default function App() {
  // Navigation: default is 'landing' (SaaS Landing Page)
  const [activeTab, setActiveTab] = useState<'landing' | 'booking' | 'specialists' | 'admin' | 'schema' | 'settings'>('landing');
  const [preselectedSpecialistId, setPreselectedSpecialistId] = useState<string | null>(null);

  // Demo Login States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Company Settings & Localization
  const [companySettings, setCompanySettings] = useState<CompanySettings>(getCompanySettings());
  const [lang, setLang] = useState<Language>(companySettings.language);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(companySettings.theme);

  // Database States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Translation helper
  const t = (key: any) => translate(key, lang);

  // Fetch / Sync with API layer
  const loadDatabase = async () => {
    setLoading(true);
    try {
      const apts = await api.getAppointments();
      const custs = await api.getCustomers();
      const srvs = await api.getServices();
      const stf = await api.getStaff();

      setAppointments(apts);
      setCustomers(custs);
      setServices(srvs);
      setStaffList(stf);
    } catch (e) {
      console.error("Failed to sync database", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Update theme on documentElement & remember
  useEffect(() => {
    const root = document.documentElement;
    const isDark = 
      theme === 'dark' || 
      (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Update SEO / Meta tags dynamically on settings/language change
  useEffect(() => {
    document.title = `${companySettings.companyName} - ${t('heroBadge')}`;
    
    // Dynamically update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `${companySettings.companyName} Online Booking CRM System in Kyrgyzstan.`);

    // Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', companySettings.companyName);

    // Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', t('heroSubtitle'));

    // Open Graph Image
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) {
      ogImg = document.createElement('meta');
      ogImg.setAttribute('property', 'og:image');
      document.head.appendChild(ogImg);
    }
    ogImg.setAttribute('content', companySettings.logoUrl);
  }, [companySettings, lang]);

  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Quick statistics calculation
  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, current) => sum + (current.service?.price || 0), 0);

  const pendingAppointmentsCount = appointments.filter(a => a.status === 'pending').length;

  const handleSaveSettings = (newSettings: CompanySettings) => {
    saveCompanySettings(newSettings);
    setCompanySettings(newSettings);
    setLang(newSettings.language);
    setTheme(newSettings.theme);
    triggerToast(t('settingsSuccess'), 'success');
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    const updated = { ...companySettings, language: newLang };
    saveCompanySettings(updated);
    setCompanySettings(updated);
    triggerToast(`Language switched to ${newLang === 'kg' ? 'Кыргызча' : newLang === 'ru' ? 'Русский' : 'English'}`, 'info');
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
    setTheme(nextTheme);
    const updated = { ...companySettings, theme: nextTheme };
    saveCompanySettings(updated);
    setCompanySettings(updated);
    triggerToast(`Theme switched to ${nextTheme}`, 'info');
  };

  const handleLoginSimulate = () => {
    setIsAdminLoggedIn(true);
    triggerToast(lang === 'kg' ? "Демо режимге администратор катары ийгиликтүү кирдиңиз!" : "Успешный демо-вход в качестве администратора!", 'success');
    setActiveTab('admin');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      
      {/* 1. LEFT SIDE NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-850 shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <img 
              src={companySettings.logoUrl} 
              alt="Logo" 
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-white text-lg font-black tracking-wider block font-sans">B1 CRM</span>
            </div>
          </div>
          <div className="space-y-0.5 text-left">
            <p className="text-[10px] font-bold text-slate-400 leading-snug">
              {lang === 'kg' ? 'Даяр веб-сайт жана CRM системасы' : lang === 'ru' ? 'Готовый веб-сайт и CRM система' : 'Ready website and CRM system'}
            </p>
            <span className="inline-block bg-blue-500/20 text-blue-400 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">
              {lang === 'kg' ? 'Демо версия' : lang === 'ru' ? 'Демо версия' : 'Demo version'}
            </span>
          </div>
        </div>

        {/* Workspace Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 pb-2">
            {t('appNavRails')}
          </div>

          <button
            onClick={() => setActiveTab('landing')}
            className={`w-full p-2.5 rounded-lg flex items-center gap-3 transition-all text-left text-xs font-bold cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="flex-1">
              <span>{t('landing')}</span>
              <span className="block text-[9px] font-normal text-slate-400 mt-0.5">{t('appShowcaseSub')}</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`w-full p-2.5 rounded-lg flex items-center gap-3 transition-all text-left text-xs font-bold cursor-pointer ${
              (activeTab === 'booking' || activeTab === 'specialists')
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <span>{lang === 'kg' ? 'Демо клиника' : lang === 'ru' ? 'Демо клиника' : 'Demo Clinic'}</span>
              <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                {lang === 'kg' ? 'Кызматтар жана CRM башкаруу' : lang === 'ru' ? 'Услуги и управление CRM' : 'Services and CRM management'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full p-2.5 rounded-lg flex items-center gap-3 transition-all text-left text-xs font-bold cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1">
              <span>{lang === 'kg' ? 'Админ панели' : lang === 'ru' ? 'Админ панель' : 'Admin Panel'}</span>
              <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                {lang === 'kg' ? 'Кассалык жана CRM отчеттуулук' : lang === 'ru' ? 'Кассовая и CRM отчетность' : 'Cashier and CRM reporting'}
              </span>
            </div>
          </button>
        </nav>

        {/* Database Status Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          {isSupabaseConfigured() ? (
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="overflow-hidden">
                <span className="text-xs text-white font-semibold block leading-tight">{t('supabaseConnected')}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {lang === 'kg' ? 'PostgreSQL маалымат базасы жигердүү' : lang === 'ru' ? 'База данных PostgreSQL активна' : 'PostgreSQL database live'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="overflow-hidden">
                <span className="text-xs text-white font-semibold block leading-tight">{t('demoMode')}</span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {lang === 'kg' ? 'Офлайн кэш мок жигердүү' : lang === 'ru' ? 'Оффлайн кэш мок активен' : 'Offline cache mock active'}
                </span>
              </div>
            </div>
          )}
        </div>

      </aside>

      {/* 2. MAIN APP CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 transition-colors">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {activeTab === 'landing' ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider block">
                  {lang === 'kg' ? 'Бизнес Платформа' : lang === 'ru' ? 'Бизнес Платформа' : 'Business Platform'}
                </span>
              </div>
            ) : activeTab === 'admin' ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider block">
                  {lang === 'kg' ? 'Админ панели' : lang === 'ru' ? 'Админ панель' : 'Admin Panel'}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'kg' ? 'Башкаруу борбору' : lang === 'ru' ? 'Центр управления' : 'Control Center'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider block">
                  {lang === 'kg' ? 'Демо клиника' : lang === 'ru' ? 'Демо клиника' : 'Demo Clinic'}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'kg' ? 'Веб-сайт жана Кардар порталы' : lang === 'ru' ? 'Веб-сайт и Портал клиентов' : 'Website and Client Portal'}
                </span>
              </div>
            )}
          </div>

          {/* Header Controls: Language Select, Theme Switch, Login */}
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            
            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
              title="Switch Theme"
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <SettingsIcon className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Quick Language Dropdown Selector */}
            <div className="relative flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer border-none p-0 pr-1"
              >
                <option value="kg" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">KG</option>
                <option value="ru" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">RU</option>
                <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">EN</option>
              </select>
            </div>

            {/* Simulated Login / Logout Button */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  triggerToast(lang === 'kg' ? "Системадан чыктыңыз!" : lang === 'ru' ? "Вышли из системы!" : "Logged out successfully!", 'info');
                }}
                className="bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-rose-500/10 cursor-pointer animate-fadeIn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {lang === 'kg' ? 'Чыгуу' : lang === 'ru' ? 'Выйти' : 'Logout'}
                </span>
              </button>
            ) : (
              <button
                onClick={handleLoginSimulate}
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('login')}</span>
              </button>
            )}
          </div>
        </header>

        {/* Panel Container Area */}
        <div className="flex-1 p-6 sm:p-8 space-y-6">
          
          {loading ? (
            <div className="flex h-64 items-center justify-center flex-col gap-3">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">{t('loading')}</span>
            </div>
          ) : (
            <>
              {/* PANELS CHANGER */}
              {activeTab === 'landing' && (
                <SaaSLandingPage 
                  lang={lang}
                  companySettings={companySettings}
                  onStartDemoClinic={(mode) => setActiveTab(mode === 'admin' ? 'admin' : 'booking')}
                />
              )}

              {activeTab === 'booking' && (
                <DemoClinicPortal
                  services={services}
                  staffList={staffList}
                  lang={lang}
                  companySettings={companySettings}
                  onBookingSuccess={() => {
                    loadDatabase();
                    triggerToast(t('appointmentSubmittedToast'), "success");
                  }}
                />
              )}

              {activeTab === 'admin' && (
                !isAdminLoggedIn ? (
                  <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-all animate-fadeIn">
                      <div className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                          <ShieldCheck className="w-6 h-6 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-4">
                          {lang === 'kg' ? 'CRM Башкаруу' : lang === 'ru' ? 'Управление CRM' : 'CRM Management'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                          {lang === 'kg' ? 'Администратор катары кириңиз' : lang === 'ru' ? 'Войдите как администратор' : 'Log in as administrator'}
                        </p>
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (loginEmail === 'admin@demo.kg' && loginPassword === '123456') {
                            setIsAdminLoggedIn(true);
                            setLoginError('');
                            triggerToast(
                              lang === 'kg' 
                                ? "Ийгиликтүү кирдиңиз!" 
                                : lang === 'ru' 
                                ? "Успешный вход!" 
                                : "Successfully logged in!", 
                              'success'
                            );
                          } else {
                            setLoginError(
                              lang === 'kg' 
                                ? "Ката: Электрондук дарек же сырсөз туура эмес!" 
                                : lang === 'ru' 
                                ? "Ошибка: Неверный email или пароль!" 
                                : "Error: Invalid email or password!"
                            );
                            triggerToast(
                              lang === 'kg' 
                                ? "Ката: Маалыматтар туура эмес!" 
                                : lang === 'ru' 
                                ? "Ошибка: Неверные данные!" 
                                : "Error: Invalid credentials!", 
                              'error'
                            );
                          }
                        }}
                        className="space-y-4"
                      >
                        {loginError && (
                          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl">
                            ⚠️ {loginError}
                          </div>
                        )}

                        <div className="space-y-1 text-left">
                          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Email</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input 
                              type="email"
                              required
                              placeholder={
                                lang === 'kg' 
                                  ? "Email дарегиңизди жазыңыз" 
                                  : lang === 'ru' 
                                  ? "Введите ваш email" 
                                  : "Enter your email address"
                              }
                              value={loginEmail}
                              onChange={(e) => {
                                  setLoginEmail(e.target.value);
                                  setLoginError('');
                              }}
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                            {lang === 'kg' ? 'Пароль' : lang === 'ru' ? 'Пароль' : 'Password'}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                              <Lock className="w-4 h-4" />
                            </span>
                            <input 
                              type="password"
                              required
                              placeholder={
                                lang === 'kg' 
                                  ? "Сырсөздү жазыңыз" 
                                  : lang === 'ru' 
                                  ? "Введите пароль" 
                                  : "Enter your password"
                              }
                              value={loginPassword}
                              onChange={(e) => {
                                setLoginPassword(e.target.value);
                                setLoginError('');
                              }}
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>
                            {lang === 'kg' ? 'Кирүү' : lang === 'ru' ? 'Войти' : 'Login'}
                          </span>
                        </button>
                      </form>

                      <div className="border-t border-slate-100 dark:border-slate-850 pt-6 text-center space-y-4">
                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                            {lang === 'kg' ? 'Demo аккаунт:' : lang === 'ru' ? 'Демо-аккаунт:' : 'Demo account:'}
                          </span>
                          <div className="inline-flex flex-col items-center bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 p-3 rounded-xl gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            <div>Email: <span className="text-slate-900 dark:text-white underline">admin@demo.kg</span></div>
                            <div>
                              {lang === 'kg' ? 'Пароль' : lang === 'ru' ? 'Пароль' : 'Password'}: <span className="text-slate-900 dark:text-white">123456</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setLoginEmail('admin@demo.kg');
                            setLoginPassword('123456');
                            setLoginError('');
                            setIsAdminLoggedIn(true);
                            triggerToast(
                              lang === 'kg' 
                                ? "Демо режимге администратор катары ийгиликтүү кирдиңиз!" 
                                : lang === 'ru' 
                                ? "Успешный демо-вход в качестве администратора!" 
                                : "Successfully logged in as demo administrator!", 
                              'success'
                            );
                          }}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 w-full justify-center"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                          <span>
                            {lang === 'kg' ? 'Demo аккаунту менен кирүү' : lang === 'ru' ? 'Войти с демо-аккаунтом' : 'Log in with demo account'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('crmStatsTotalRev')}</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">${totalRevenue}</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('crmStatsPending')}</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">{pendingAppointmentsCount}</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('crmStatsTotalClients')}</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">{customers.length}</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('crmStatsAvgValue')}</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            ${customers.length > 0 ? Math.round(totalRevenue / customers.length) : 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <AdminDashboard 
                      appointments={appointments}
                      customers={customers}
                      services={services}
                      staffList={staffList}
                      onRefresh={loadDatabase}
                      toast={(msg, type) => triggerToast(msg, type === 'success' ? 'success' : 'error')}
                      lang={lang}
                      companySettings={companySettings}
                      onSaveSettings={handleSaveSettings}
                      onLogout={() => {
                        setIsAdminLoggedIn(false);
                        triggerToast(lang === 'kg' ? "Системадан чыктыңыз!" : "Вышли из системы!", 'info');
                      }}
                    />
                  </div>
                )
              )}

              {activeTab === 'specialists' && (
                <SpecialistsShowcase
                  lang={lang}
                  onBookSpecialist={(staffId) => {
                    setPreselectedSpecialistId(staffId);
                    setActiveTab('booking');
                  }}
                />
              )}
            </>
          )}

        </div>

        {/* Global Footer Section */}
        <footer className="bg-slate-100 dark:bg-slate-900/50 p-6 border-t border-slate-200 dark:border-slate-850 text-center text-xs text-slate-500 space-y-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={companySettings.logoUrl} 
                alt="Logo" 
                className="w-6 h-6 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">{companySettings.companyName}</span>
            </div>
            
            <div className="flex gap-4 font-bold text-slate-600 dark:text-slate-400">
              <a href="#booking" onClick={(e) => { e.preventDefault(); setActiveTab('booking'); }} className="hover:text-blue-500">{t('booking')}</a>
              <a href="#admin" onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }} className="hover:text-blue-500">{t('admin')}</a>
              <a href="#settings" onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }} className="hover:text-blue-500">{t('settings')}</a>
            </div>
            
            <div className="flex gap-3 text-slate-400">
              <a href={companySettings.whatsApp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">WhatsApp</a>
              <a href={companySettings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">Instagram</a>
              <a href={companySettings.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Telegram</a>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500">
            {t('footerCopyright')} • {companySettings.phone} • {companySettings.workingHours}
          </div>
        </footer>

      </main>

      {/* TOAST SYSTEM ACCESSIBLE ACROSS ALL PANELS */}
      <AnimatePresence>
        {toastMessage && (
          <NotificationToast 
            message={toastMessage} 
            type={toastType} 
            onClose={() => setToastMessage('')} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
