import { Language } from './translations';

export interface CompanySettings {
  companyName: string;
  logoUrl: string;
  phone: string;
  whatsApp: string;
  telegram: string;
  instagram: string;
  facebook: string;
  website: string;
  workingHours: string;
  timezone: string;
  language: Language;
  theme: 'light' | 'dark' | 'auto';
  developerMode?: boolean;
}

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'B1 CRM',
  logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=150&h=150',
  phone: '+996 (555) 012-345',
  whatsApp: 'https://wa.me/996555012345',
  telegram: 'https://t.me/b1clinic_kg',
  instagram: 'https://instagram.com/b1clinic_kg',
  facebook: 'https://facebook.com/b1clinic_kg',
  website: 'https://b1clinic.kg',
  workingHours: '09:00 - 20:00, Дш - Иш (Mon - Sun)',
  timezone: 'Asia/Bishkek (GMT+6)',
  language: 'kg', // Kyrgyz as default
  theme: 'dark', // SaaS-style default dark theme or light/dark/auto
  developerMode: false
};

export const getCompanySettings = (): CompanySettings => {
  try {
    const saved = localStorage.getItem('b1_company_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all fields are populated
      return { ...DEFAULT_COMPANY_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error("Failed to parse company settings", e);
  }
  return DEFAULT_COMPANY_SETTINGS;
};

export const saveCompanySettings = (settings: CompanySettings): void => {
  try {
    localStorage.setItem('b1_company_settings', JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save company settings", e);
  }
};
