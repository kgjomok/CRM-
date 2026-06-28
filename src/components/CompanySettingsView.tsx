import React, { useState } from 'react';
import { CompanySettings } from '../lib/settings';
import { Language, translate } from '../lib/translations';
import { 
  Building2, 
  Image, 
  Phone, 
  MessageSquare, 
  Send, 
  Instagram, 
  Facebook, 
  Globe, 
  Clock, 
  MapPin, 
  Globe2, 
  Palette,
  Check,
  Save,
  RotateCcw
} from 'lucide-react';

interface CompanySettingsViewProps {
  settings: CompanySettings;
  onSave: (settings: CompanySettings) => void;
  lang: Language;
}

export default function CompanySettingsView({ settings, onSave, lang }: CompanySettingsViewProps) {
  const t = (key: any) => translate(key, lang);

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsApp, setWhatsApp] = useState(settings.whatsApp);
  const [telegram, setTelegram] = useState(settings.telegram);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [facebook, setFacebook] = useState(settings.facebook);
  const [website, setWebsite] = useState(settings.website);
  const [workingHours, setWorkingHours] = useState(settings.workingHours);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [selectedLang, setSelectedLang] = useState<Language>(settings.language);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>(settings.theme);
  const [developerMode, setDeveloperMode] = useState(!!settings.developerMode);

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      companyName,
      logoUrl,
      phone,
      whatsApp,
      telegram,
      instagram,
      facebook,
      website,
      workingHours,
      timezone,
      language: selectedLang,
      theme: selectedTheme,
      developerMode
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const resetToDefault = () => {
    if (confirm("Reset to default system parameters?")) {
      setCompanyName('B1 CRM');
      setLogoUrl('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=150&h=150');
      setPhone('+996 (555) 012-345');
      setWhatsApp('https://wa.me/996555012345');
      setTelegram('https://t.me/b1clinic_kg');
      setInstagram('https://instagram.com/b1clinic_kg');
      setFacebook('https://facebook.com/b1clinic_kg');
      setWebsite('https://b1clinic.kg');
      setWorkingHours('09:00 - 20:00, Дш - Иш (Mon - Sun)');
      setTimezone('Asia/Bishkek (GMT+6)');
      setSelectedLang('kg');
      setSelectedTheme('dark');
      setDeveloperMode(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      
      {/* Settings Title Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            {t('settingsTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t('settingsSub')}</p>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Core Company Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Core Profile
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                {t('compName')}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                {t('compLogo')}
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="url" 
                  required
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  {t('compPhone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  {t('compWebsite')}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  {t('compHours')}
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={workingHours}
                    onChange={e => setWorkingHours(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  {t('compTimezone')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Social Media & Integrations */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Social Connections
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                WhatsApp Chat link
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-emerald-500" />
                <input 
                  type="url" 
                  value={whatsApp}
                  onChange={e => setWhatsApp(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                Telegram Handle link
              </label>
              <div className="relative">
                <Send className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                <input 
                  type="url" 
                  value={telegram}
                  onChange={e => setTelegram(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                Instagram Profile link
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3 w-4 h-4 text-pink-500" />
                <input 
                  type="url" 
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                Facebook Page link
              </label>
              <div className="relative">
                <Facebook className="absolute left-3 top-3 w-4 h-4 text-blue-600" />
                <input 
                  type="url" 
                  value={facebook}
                  onChange={e => setFacebook(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Language & Themes Selection (Span Full) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 md:col-span-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            3. Theme & Localization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">
                {t('language')} (Default)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedLang('kg')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    selectedLang === 'kg' 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10" 
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Кыргызча 🇰🇬
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang('ru')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    selectedLang === 'ru' 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10" 
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Русский 🇷🇺
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang('en')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    selectedLang === 'en' 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10" 
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  English 🇺🇸
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">
                {t('theme')}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedTheme('light')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    selectedTheme === 'light' 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10" 
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  ☀ {t('themeLight')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme('dark')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    selectedTheme === 'dark' 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10" 
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  ☾ {t('themeDark')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme('auto')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    selectedTheme === 'auto' 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10" 
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  ⚙ {t('themeAuto')}
                </button>
              </div>
            </div>

            {/* Developer Mode Toggle */}
            <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  {t('developerModeLabel')}
                </label>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {t('developerModeDesc')}
                </span>
              </div>
              <input 
                type="checkbox"
                checked={developerMode}
                onChange={e => setDeveloperMode(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-800"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Save Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={resetToDefault}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-5 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset defaults</span>
        </button>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{t('save')}</span>
        </button>
      </div>

      {isSaved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-bounce">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-bold">{t('settingsSuccess')}</span>
        </div>
      )}

    </form>
  );
}
