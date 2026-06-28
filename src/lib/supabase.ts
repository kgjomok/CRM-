import { createClient } from '@supabase/supabase-js';
import { Customer, Service, Staff, Appointment, ClientNote, Reminder, Payment, PaymentStatus, PaymentMethod } from '../types';

// Load Supabase environment variables from import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a real Supabase client if credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Export status check for our views
export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

// Helper to assert that Supabase is configured before executing queries
const getClient = () => {
  if (!supabase) {
    throw new Error(
      "Supabase database is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables using the Secrets panel in AI Studio settings."
    );
  }
  return supabase;
};

// --- LOCAL STORAGE MOCK DATABASE IMPLEMENTATION ---
const getLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Local Storage Error:", e);
  }
};

const DEFAULT_MOCK_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Брекеттерди орнотуу / Установка брекетов',
    description: 'Ооз көңдөйүн тазалоо жана заманбап металл же керамика брекеттерин орнотуу. / Установка современных брекет-систем.',
    duration_minutes: 60,
    price: 35000,
    category: 'Стоматология / Стоматология',
    is_active: true
  },
  {
    id: 'srv-2',
    name: 'Тишти тазалоо жана агартуу / Чистка и отбеливание зубов',
    description: 'Ультраүндүү тазалоо, AirFlow жана тишти зыянсыз агартуу. / Комплексная чистка и безопасное отбеливание.',
    duration_minutes: 45,
    price: 3500,
    category: 'Стоматология / Стоматология',
    is_active: true
  },
  {
    id: 'srv-3',
    name: 'Пломба коюу / Лечение кариеса и пломбирование',
    description: 'Кариести дарылоо, заманбап гелио-пломба коюу. / Эстетическая реставрация зубов фотополимерными пломбами.',
    duration_minutes: 40,
    price: 2200,
    category: 'Стоматология / Стоматология',
    is_active: true
  },
  {
    id: 'srv-4',
    name: 'Бетти терең тазалоо / Глубокая чистка лица',
    description: 'Бет терисин аппараттык жана кол менен терең тазалоо, пилинг. / Комбинированная чистка лица и уход.',
    duration_minutes: 50,
    price: 2500,
    category: 'Косметология / Косметология',
    is_active: true
  },
  {
    id: 'srv-5',
    name: 'Биоревитализация / Биоревитализация',
    description: 'Гиалурон кислотасы менен бетти терең нымдандыруу жана жашартуу. / Инъекционное глубокое увлажнение кожи гиалуроновой кислотой.',
    duration_minutes: 60,
    price: 6000,
    category: 'Косметология / Косметология',
    is_active: true
  }
];

const DEFAULT_MOCK_STAFF: Staff[] = [
  {
    id: 'stf-1',
    name: 'Д-р Бакыт Мамытов',
    specialization: 'Ортодонт-Стоматолог',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    is_active: true,
    email: 'bakyt@b1clinic.kg',
    experience_years: 8,
    education: 'КММА (KSMA) - Стоматология факультети, 2015',
    certificates: 'Ортодонтиялык дарылоо жана брекет тутумдары, 2017',
    description: 'Тиштерди түздөө жана тиш тиштеш көйгөйлөрүн чечүү боюнча жогорку даражадагы адис.',
    phone: '+996 555 111 222',
    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    working_hours_start: '09:00',
    working_hours_end: '18:00',
    vacation_days: [],
    assigned_services: ['srv-1', 'srv-2', 'srv-3'],
    rating: 4.9
  },
  {
    id: 'stf-2',
    name: 'Айсулуу Асанова',
    specialization: 'Дерматолог-Косметолог',
    avatar_url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300',
    is_active: true,
    email: 'aisuluu@b1clinic.kg',
    experience_years: 6,
    education: 'КММА (KSMA) - Педиатрия/Дерматология, 2018',
    certificates: 'Аппараттык жана инъекциялык косметология, Москва 2020',
    description: 'Терини жашартуу жана кам көрүү боюнча кесипкөй косметолог.',
    phone: '+996 555 333 444',
    working_days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    working_hours_start: '10:00',
    working_hours_end: '19:00',
    vacation_days: [],
    assigned_services: ['srv-4', 'srv-5'],
    rating: 4.8
  },
  {
    id: 'stf-3',
    name: 'Д-р Улан Кадыров',
    specialization: 'Хирург-Стоматолог',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
    is_active: true,
    email: 'ulan@b1clinic.kg',
    experience_years: 12,
    education: 'КММА (KSMA) - Стоматология, 2011',
    certificates: 'Имплантология жана сөөк пластикасы, Стамбул 2015',
    description: 'Оорутпай тиш алуу жана сапаттуу импланттарды орнотуу боюнча 12 жылдык тажрыйбага ээ.',
    phone: '+996 555 555 666',
    working_days: ['Monday', 'Wednesday', 'Friday'],
    working_hours_start: '09:00',
    working_hours_end: '17:00',
    vacation_days: [],
    assigned_services: ['srv-2', 'srv-3'],
    rating: 5.0
  },
  {
    id: 'stf-4',
    name: 'Назира Токтобаева',
    specialization: 'Трихолог-Адис',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    is_active: true,
    email: 'nazira@b1clinic.kg',
    experience_years: 9,
    education: 'КММА (KSMA) - Дерматология/Трихология, 2014',
    certificates: 'Чач дарылоо жана баш териси терапиясы, Түштүк Корея 2018',
    description: 'Чачтын түшүүсүн алдын алуу жана баштын терисин дарылоо боюнча тажрыйбалуу трихолог адис.',
    phone: '+996 555 777 888',
    working_days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    working_hours_start: '09:00',
    working_hours_end: '18:00',
    vacation_days: [],
    assigned_services: ['srv-4', 'srv-5'],
    rating: 4.9
  },
  {
    id: 'stf-5',
    name: 'Рустам Алиев',
    specialization: 'Мануалдык терапевт-Массажист',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300',
    is_active: true,
    email: 'rustam@b1clinic.kg',
    experience_years: 7,
    education: 'БМК (Bishkek Medical College) - Физиотерапия, 2016',
    certificates: 'Кесиптик массаж жана мануалдык терапия, Алматы 2019',
    description: 'Муундарды жана омуртканы калыбына келтирүү, терапиялык массаж боюнча адис.',
    phone: '+996 555 888 999',
    working_days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    working_hours_start: '09:00',
    working_hours_end: '18:00',
    vacation_days: [],
    assigned_services: ['srv-4', 'srv-5'],
    rating: 4.9
  },
  {
    id: 'stf-6',
    name: 'Д-р Елена Попова',
    specialization: 'Эстетикалык медицина адиси',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    is_active: true,
    email: 'elena@b1clinic.kg',
    experience_years: 10,
    education: 'КММА (KSMA) - Жалпы медицина, 2012',
    certificates: 'Контурдук пластика жана инъекциялык эстетика, Париж 2017',
    description: 'Бет пластикасы, инъекциялык косметология жана теринин жаштыгын калыбына келтирүү боюнча эл аралык адис.',
    phone: '+996 555 999 000',
    working_days: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    working_hours_start: '10:00',
    working_hours_end: '19:00',
    vacation_days: [],
    assigned_services: ['srv-4', 'srv-5'],
    rating: 5.0
  }
];

const DEFAULT_MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Аскар Акаев',
    phone: '+996 700 123 456',
    email: 'askar@gmail.com',
    whatsapp: '+996 700 123 456',
    gender: 'male',
    dob: '1980-11-10',
    address: 'Бишкек ш., Чүй просп. 120',
    notes: 'Тез кыжырданат, бирок сылык мамилени баалайт.',
    status: 'active',
    preferred_language: 'kg',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_MOCK_CLIENT_NOTES: ClientNote[] = [
  {
    id: 'note-1',
    customer_id: 'cust-1',
    content: 'Аллергиясы бар: Пенициллин',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'Администратор'
  },
  {
    id: 'note-2',
    customer_id: 'cust-1',
    content: 'Сезгич тиштер, агартууда этият болуу зарыл.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'Администратор'
  }
];

const DEFAULT_MOCK_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    customer_id: 'cust-1',
    title: 'Тишти кайра текшерүү (6 айдан кийин)',
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
    status: 'pending',
    created_at: new Date().toISOString(),
    customer_name: 'Аскар Акаев'
  }
];

const DEFAULT_MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    customer_id: 'cust-1',
    service_id: 'srv-2',
    staff_id: 'stf-1',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    status: 'confirmed',
    notes: 'Кадимки тиш тазалоо',
    created_at: new Date().toISOString()
  }
];

const getRelativeDate = (offsetDays: number): string => {
  const d = new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
};

const DEFAULT_MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    appointment_id: 'apt-1',
    customer_id: 'cust-1',
    staff_id: 'stf-1',
    service_id: 'srv-2',
    date: getRelativeDate(0), // Today
    amount: 3500,
    payment_status: 'paid',
    payment_method: 'mbank',
    invoice_number: 'INV-2026-0001',
    notes: 'Төлөм MBank аркылуу кабыл алынды.',
    created_at: new Date(Date.now()).toISOString()
  },
  {
    id: 'pay-2',
    customer_id: 'cust-1',
    staff_id: 'stf-2',
    service_id: 'srv-4',
    date: getRelativeDate(0), // Today
    amount: 2500,
    payment_status: 'unpaid',
    payment_method: 'cash',
    invoice_number: 'INV-2026-0002',
    notes: 'Кабыл алуу аяктаганда төлөнөт.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-3',
    customer_id: 'cust-1',
    staff_id: 'stf-3',
    service_id: 'srv-3',
    date: getRelativeDate(1), // Yesterday
    amount: 2200,
    payment_status: 'paid',
    payment_method: 'cash',
    invoice_number: 'INV-2026-0003',
    notes: 'Накталай төлөндү.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-4',
    customer_id: 'cust-1',
    staff_id: 'stf-1',
    service_id: 'srv-1', // Braces 35000
    date: getRelativeDate(2), // 2 days ago
    amount: 35000,
    payment_status: 'partially_paid',
    payment_method: 'visa_mastercard',
    invoice_number: 'INV-2026-0004',
    notes: 'Биринчи төлөм катары 15000 сом төлөндү. Калган 20000 сом кийинки кабыл алууда.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-5',
    customer_id: 'cust-1',
    staff_id: 'stf-6',
    service_id: 'srv-5', // Biorevitalization 6000
    date: getRelativeDate(4), // 4 days ago
    amount: 6000,
    payment_status: 'refunded',
    payment_method: 'elkart',
    invoice_number: 'INV-2026-0005',
    notes: 'Кардар кабыл алуудан баш тарткандыктан төлөм кайтарылып берилди.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-6',
    customer_id: 'cust-1',
    staff_id: 'stf-4',
    service_id: 'srv-5', // 6000
    date: getRelativeDate(8), // 8 days ago
    amount: 6000,
    payment_status: 'paid',
    payment_method: 'mbank',
    invoice_number: 'INV-2026-0006',
    notes: 'Мбанк аркылуу толук төлөндү.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-7',
    customer_id: 'cust-1',
    staff_id: 'stf-5',
    service_id: 'srv-4', // 2500
    date: getRelativeDate(12), // 12 days ago
    amount: 2500,
    payment_status: 'paid',
    payment_method: 'card',
    invoice_number: 'INV-2026-0007',
    notes: 'Кабыл алуу терминалы аркылуу төлөндү.',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-8',
    customer_id: 'cust-1',
    staff_id: 'stf-3',
    service_id: 'srv-3', // 2200
    date: getRelativeDate(18), // 18 days ago
    amount: 2200,
    payment_status: 'paid',
    payment_method: 'other',
    invoice_number: 'INV-2026-0008',
    notes: 'Оптима Банк QR-код аркылуу төлөндү.',
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-9',
    customer_id: 'cust-1',
    staff_id: 'stf-1',
    service_id: 'srv-2', // 3500
    date: getRelativeDate(25), // 25 days ago
    amount: 3500,
    payment_status: 'paid',
    payment_method: 'cash',
    invoice_number: 'INV-2026-0009',
    notes: '',
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-10',
    customer_id: 'cust-1',
    staff_id: 'stf-2',
    service_id: 'srv-4', // 2500
    date: getRelativeDate(32), // 32 days ago
    amount: 2500,
    payment_status: 'paid',
    payment_method: 'mbank',
    invoice_number: 'INV-2026-0010',
    notes: '',
    created_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-11',
    customer_id: 'cust-1',
    staff_id: 'stf-1',
    service_id: 'srv-3', // 2200
    date: getRelativeDate(45), // 45 days ago
    amount: 2200,
    payment_status: 'paid',
    payment_method: 'visa_mastercard',
    invoice_number: 'INV-2026-0011',
    notes: 'Төлөндү.',
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Offline fallback getters and setters
const getMockServices = () => getLocalData<Service[]>('mock_services', DEFAULT_MOCK_SERVICES);
const saveMockServices = (data: Service[]) => setLocalData('mock_services', data);

const getMockStaff = () => getLocalData<Staff[]>('mock_staff', DEFAULT_MOCK_STAFF);
const saveMockStaff = (data: Staff[]) => setLocalData('mock_staff', data);

const getMockCustomers = () => getLocalData<Customer[]>('mock_customers', DEFAULT_MOCK_CUSTOMERS);
const saveMockCustomers = (data: Customer[]) => setLocalData('mock_customers', data);

const getMockAppointments = () => getLocalData<Appointment[]>('mock_appointments', DEFAULT_MOCK_APPOINTMENTS);
const saveMockAppointments = (data: Appointment[]) => setLocalData('mock_appointments', data);

const getMockClientNotes = () => getLocalData<ClientNote[]>('mock_client_notes', DEFAULT_MOCK_CLIENT_NOTES);
const saveMockClientNotes = (data: ClientNote[]) => setLocalData('mock_client_notes', data);

const getMockReminders = () => getLocalData<Reminder[]>('mock_reminders', DEFAULT_MOCK_REMINDERS);
const saveMockReminders = (data: Reminder[]) => setLocalData('mock_reminders', data);

const getMockPayments = () => getLocalData<Payment[]>('mock_payments', DEFAULT_MOCK_PAYMENTS);
const saveMockPayments = (data: Payment[]) => setLocalData('mock_payments', data);


/**
 * Service Methods
 * All these methods execute live asynchronous queries directly against your live Supabase PostgreSQL database.
 * If Supabase credentials are not found, they fail-soft into a highly functional Local Storage offline mock database!
 */
export const api = {
  // --- CUSTOMERS ---
  async getCustomers(): Promise<Customer[]> {
    if (!supabase) {
      return getMockCustomers();
    }
    const client = getClient();
    const { data, error } = await client
      .from('customers')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Supabase getCustomers error:", error);
      throw error;
    }
    return (data || []) as Customer[];
  },

  async searchCustomers(query: string): Promise<Customer[]> {
    if (!supabase) {
      const list = getMockCustomers();
      if (!query.trim()) return list;
      const q = query.toLowerCase();
      return list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.phone.includes(q) || 
        (c.email && c.email.toLowerCase().includes(q))
      );
    }
    const client = getClient();
    if (!query.trim()) {
      return this.getCustomers();
    }
    const { data, error } = await client
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase searchCustomers error:", error);
      throw error;
    }
    return (data || []) as Customer[];
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    if (!supabase) {
      const list = getMockCustomers();
      // Check existing phone
      const existing = list.find(c => c.phone === customer.phone);
      if (existing) return existing;

      const newCust: Customer = {
        id: 'cust-' + Math.random().toString(36).substr(2, 9),
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        whatsapp: customer.whatsapp || '',
        gender: customer.gender || '',
        dob: customer.dob || '',
        address: customer.address || '',
        notes: customer.notes || '',
        status: customer.status || 'active',
        preferred_language: customer.preferred_language || '',
        created_at: new Date().toISOString()
      };
      list.push(newCust);
      saveMockCustomers(list);
      return newCust;
    }
    const client = getClient();
    const { data, error } = await client
      .from('customers')
      .insert({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || null,
        whatsapp: customer.whatsapp || null,
        gender: customer.gender || null,
        dob: customer.dob || null,
        address: customer.address || null,
        notes: customer.notes || null,
        status: customer.status || 'active',
        preferred_language: customer.preferred_language || null
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        const { data: existing, error: findError } = await client
          .from('customers')
          .select('*')
          .eq('phone', customer.phone)
          .single();
        if (!findError && existing) {
          return existing as Customer;
        }
      }
      console.error("Supabase createCustomer error:", error);
      throw error;
    }
    return data as Customer;
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    if (!supabase) {
      const list = getMockCustomers();
      const idx = list.findIndex(c => c.id === id);
      if (idx === -1) throw new Error("Customer not found");
      list[idx] = { ...list[idx], ...updates };
      saveMockCustomers(list);
      return list[idx];
    }
    const client = getClient();
    const { data, error } = await client
      .from('customers')
      .update({
        name: updates.name,
        phone: updates.phone,
        email: updates.email || null,
        whatsapp: updates.whatsapp || null,
        gender: updates.gender || null,
        dob: updates.dob || null,
        address: updates.address || null,
        notes: updates.notes || null,
        status: updates.status || null,
        preferred_language: updates.preferred_language || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase updateCustomer error:", error);
      throw error;
    }
    return data as Customer;
  },

  // --- CLIENT NOTES ---
  async getClientNotes(customerId?: string): Promise<ClientNote[]> {
    if (!supabase) {
      const list = getMockClientNotes();
      if (customerId) {
        return list.filter(n => n.customer_id === customerId).sort((a, b) => b.created_at.localeCompare(a.created_at));
      }
      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    const client = getClient();
    let query = client.from('client_notes').select('*');
    if (customerId) {
      query = query.eq('customer_id', customerId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error("Supabase getClientNotes error:", error);
      throw error;
    }
    return (data || []) as ClientNote[];
  },

  async createClientNote(note: Omit<ClientNote, 'id' | 'created_at'>): Promise<ClientNote> {
    if (!supabase) {
      const list = getMockClientNotes();
      const newNote: ClientNote = {
        id: 'note-' + Math.random().toString(36).substr(2, 9),
        customer_id: note.customer_id,
        content: note.content,
        author: note.author || 'Administrator',
        created_at: new Date().toISOString()
      };
      list.push(newNote);
      saveMockClientNotes(list);
      return newNote;
    }
    const client = getClient();
    const { data, error } = await client
      .from('client_notes')
      .insert({
        customer_id: note.customer_id,
        content: note.content,
        author: note.author || 'Administrator'
      })
      .select()
      .single();
    if (error) {
      console.error("Supabase createClientNote error:", error);
      throw error;
    }
    return data as ClientNote;
  },

  async deleteClientNote(id: string): Promise<void> {
    if (!supabase) {
      const list = getMockClientNotes().filter(n => n.id !== id);
      saveMockClientNotes(list);
      return;
    }
    const client = getClient();
    const { error } = await client
      .from('client_notes')
      .delete()
      .eq('id', id);
    if (error) {
      console.error("Supabase deleteClientNote error:", error);
      throw error;
    }
  },

  // --- REMINDERS ---
  async getReminders(): Promise<Reminder[]> {
    if (!supabase) {
      const reminders = getMockReminders();
      const customers = getMockCustomers();
      return reminders.map(r => ({
        ...r,
        customer_name: customers.find(c => c.id === r.customer_id)?.name || 'Unknown'
      })).sort((a, b) => a.due_date.localeCompare(b.due_date));
    }
    const client = getClient();
    const { data, error } = await client
      .from('reminders')
      .select('*, customers(name)')
      .order('due_date', { ascending: true });
    if (error) {
      console.error("Supabase getReminders error:", error);
      throw error;
    }
    return (data || []).map((r: any) => ({
      id: r.id,
      customer_id: r.customer_id,
      title: r.title,
      due_date: r.due_date,
      status: r.status,
      created_at: r.created_at,
      customer_name: r.customers?.name || 'Unknown'
    })) as Reminder[];
  },

  async createReminder(reminder: Omit<Reminder, 'id' | 'created_at'>): Promise<Reminder> {
    if (!supabase) {
      const list = getMockReminders();
      const customers = getMockCustomers();
      const newRem: Reminder = {
        id: 'rem-' + Math.random().toString(36).substr(2, 9),
        customer_id: reminder.customer_id,
        title: reminder.title,
        due_date: reminder.due_date,
        status: reminder.status || 'pending',
        created_at: new Date().toISOString(),
        customer_name: customers.find(c => c.id === reminder.customer_id)?.name || 'Unknown'
      };
      list.push(newRem);
      saveMockReminders(list);
      return newRem;
    }
    const client = getClient();
    const { data, error } = await client
      .from('reminders')
      .insert({
        customer_id: reminder.customer_id,
        title: reminder.title,
        due_date: reminder.due_date,
        status: reminder.status || 'pending'
      })
      .select('*, customers(name)')
      .single();
    if (error) {
      console.error("Supabase createReminder error:", error);
      throw error;
    }
    const r = data as any;
    return {
      id: r.id,
      customer_id: r.customer_id,
      title: r.title,
      due_date: r.due_date,
      status: r.status,
      created_at: r.created_at,
      customer_name: r.customers?.name || 'Unknown'
    } as Reminder;
  },

  async updateReminderStatus(id: string, status: 'pending' | 'completed'): Promise<Reminder> {
    if (!supabase) {
      const list = getMockReminders();
      const idx = list.findIndex(r => r.id === id);
      if (idx === -1) throw new Error("Reminder not found");
      list[idx].status = status;
      saveMockReminders(list);
      return list[idx];
    }
    const client = getClient();
    const { data, error } = await client
      .from('reminders')
      .update({ status })
      .eq('id', id)
      .select('*, customers(name)')
      .single();
    if (error) {
      console.error("Supabase updateReminderStatus error:", error);
      throw error;
    }
    const r = data as any;
    return {
      id: r.id,
      customer_id: r.customer_id,
      title: r.title,
      due_date: r.due_date,
      status: r.status,
      created_at: r.created_at,
      customer_name: r.customers?.name || 'Unknown'
    } as Reminder;
  },

  async deleteReminder(id: string): Promise<void> {
    if (!supabase) {
      const list = getMockReminders().filter(r => r.id !== id);
      saveMockReminders(list);
      return;
    }
    const client = getClient();
    const { error } = await client
      .from('reminders')
      .delete()
      .eq('id', id);
    if (error) {
      console.error("Supabase deleteReminder error:", error);
      throw error;
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    if (!supabase) {
      const apts = getMockAppointments();
      const linked = apts.some(a => a.customer_id === id);
      if (linked) {
        throw new Error("Cannot delete customer: existing appointments are linked to this record.");
      }
      const list = getMockCustomers().filter(c => c.id !== id);
      saveMockCustomers(list);
      return;
    }
    const client = getClient();
    const { error } = await client
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        throw new Error("Cannot delete customer: existing appointments are linked to this record.");
      }
      console.error("Supabase deleteCustomer error:", error);
      throw error;
    }
  },

  // --- SERVICES ---
  async getServices(): Promise<Service[]> {
    if (!supabase) {
      return getMockServices();
    }
    const client = getClient();
    const { data, error } = await client
      .from('services')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase getServices error:", error);
      throw error;
    }
    return (data || []) as Service[];
  },

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    if (!supabase) {
      const list = getMockServices();
      const newSrv: Service = {
        id: 'srv-' + Math.random().toString(36).substr(2, 9),
        name: service.name,
        description: service.description,
        duration_minutes: service.duration_minutes,
        price: service.price,
        category: service.category || 'General',
        is_active: service.is_active
      };
      list.push(newSrv);
      saveMockServices(list);
      return newSrv;
    }
    const client = getClient();
    const { data, error } = await client
      .from('services')
      .insert({
        name: service.name,
        description: service.description || null,
        duration_minutes: Number(service.duration_minutes),
        price: Number(service.price),
        category: service.category || 'General',
        is_active: service.is_active
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase createService error:", error);
      throw error;
    }
    return data as Service;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    if (!supabase) {
      const list = getMockServices();
      const idx = list.findIndex(s => s.id === id);
      if (idx === -1) throw new Error("Service not found");
      list[idx] = { ...list[idx], ...updates };
      saveMockServices(list);
      return list[idx];
    }
    const client = getClient();
    const { data, error } = await client
      .from('services')
      .update({
        name: updates.name,
        description: updates.description || null,
        duration_minutes: updates.duration_minutes ? Number(updates.duration_minutes) : undefined,
        price: updates.price ? Number(updates.price) : undefined,
        category: updates.category || undefined,
        is_active: updates.is_active
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase updateService error:", error);
      throw error;
    }
    return data as Service;
  },

  async deleteService(id: string): Promise<void> {
    if (!supabase) {
      const apts = getMockAppointments();
      const linked = apts.some(a => a.service_id === id);
      if (linked) {
        throw new Error("Cannot delete service: existing appointments are booked for this service.");
      }
      const list = getMockServices().filter(s => s.id !== id);
      saveMockServices(list);
      return;
    }
    const client = getClient();
    const { error } = await client
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        throw new Error("Cannot delete service: existing appointments are booked for this service.");
      }
      console.error("Supabase deleteService error:", error);
      throw error;
    }
  },

  // --- STAFF ---
  async getStaff(): Promise<Staff[]> {
    if (!supabase) {
      return getMockStaff();
    }
    const client = getClient();
    const { data, error } = await client
      .from('staff')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase getStaff error:", error);
      throw error;
    }
    return (data || []) as Staff[];
  },

  async createStaff(member: Omit<Staff, 'id'>): Promise<Staff> {
    if (!supabase) {
      const list = getMockStaff();
      const newStf: Staff = {
        id: 'stf-' + Math.random().toString(36).substr(2, 9),
        name: member.name,
        specialization: member.specialization,
        avatar_url: member.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150',
        is_active: member.is_active,
        email: member.email,
        experience_years: member.experience_years || 5,
        education: member.education || '',
        certificates: member.certificates || '',
        description: member.description || '',
        phone: member.phone || '',
        working_days: member.working_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        working_hours_start: member.working_hours_start || '09:00',
        working_hours_end: member.working_hours_end || '18:00',
        vacation_days: member.vacation_days || [],
        assigned_services: member.assigned_services || [],
        rating: member.rating || 5.0
      };
      list.push(newStf);
      saveMockStaff(list);
      return newStf;
    }
    const client = getClient();
    const { data, error } = await client
      .from('staff')
      .insert({
        name: member.name,
        specialization: member.specialization,
        avatar_url: member.avatar_url || null,
        is_active: member.is_active,
        email: member.email || null,
        experience_years: member.experience_years,
        education: member.education,
        certificates: member.certificates,
        description: member.description,
        phone: member.phone,
        working_days: member.working_days,
        working_hours_start: member.working_hours_start,
        working_hours_end: member.working_hours_end,
        vacation_days: member.vacation_days,
        assigned_services: member.assigned_services,
        rating: member.rating || 5.0
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase createStaff error:", error);
      throw error;
    }
    return data as Staff;
  },

  async updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
    if (!supabase) {
      const list = getMockStaff();
      const idx = list.findIndex(s => s.id === id);
      if (idx === -1) throw new Error("Staff member not found");
      list[idx] = { ...list[idx], ...updates };
      saveMockStaff(list);
      return list[idx];
    }
    const client = getClient();
    const { data, error } = await client
      .from('staff')
      .update({
        name: updates.name,
        specialization: updates.specialization,
        avatar_url: updates.avatar_url || null,
        is_active: updates.is_active,
        email: updates.email || null,
        experience_years: updates.experience_years,
        education: updates.education,
        certificates: updates.certificates,
        description: updates.description,
        phone: updates.phone,
        working_days: updates.working_days,
        working_hours_start: updates.working_hours_start,
        working_hours_end: updates.working_hours_end,
        vacation_days: updates.vacation_days,
        assigned_services: updates.assigned_services,
        rating: updates.rating
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase updateStaff error:", error);
      throw error;
    }
    return data as Staff;
  },

  async deleteStaff(id: string): Promise<void> {
    if (!supabase) {
      const apts = getMockAppointments();
      const linked = apts.some(a => a.staff_id === id);
      if (linked) {
        throw new Error("Cannot delete staff: existing appointments are assigned to this staff member.");
      }
      const list = getMockStaff().filter(s => s.id !== id);
      saveMockStaff(list);
      return;
    }
    const client = getClient();
    const { error } = await client
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        throw new Error("Cannot delete staff: existing appointments are assigned to this staff member.");
      }
      console.error("Supabase deleteStaff error:", error);
      throw error;
    }
  },

  // --- APPOINTMENTS ---
  async getAppointments(): Promise<Appointment[]> {
    if (!supabase) {
      const apts = getMockAppointments();
      const custs = getMockCustomers();
      const srvs = getMockServices();
      const stf = getMockStaff();
      
      return apts.map(apt => ({
        ...apt,
        customer: custs.find(c => c.id === apt.customer_id),
        service: srvs.find(s => s.id === apt.service_id),
        staff: stf.find(s => s.id === apt.staff_id)
      })).sort((a,b) => b.date.localeCompare(a.date));
    }
    const client = getClient();
    const { data, error } = await client
      .from('appointments')
      .select(`
        *,
        customers (*),
        services (*),
        staff (*)
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: true });

    if (error) {
      console.error("Supabase getAppointments error:", error);
      throw error;
    }

    return (data || []).map((apt: any) => ({
      id: apt.id,
      customer_id: apt.customer_id,
      service_id: apt.service_id,
      staff_id: apt.staff_id,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      notes: apt.notes,
      created_at: apt.created_at,
      customer: apt.customers || apt.customer || null,
      service: apt.services || apt.service || null,
      staff: apt.staff || null
    })) as Appointment[];
  },

  async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'status'> & { customer_name?: string; customer_phone?: string }): Promise<Appointment> {
    if (!supabase) {
      let custId = appointment.customer_id;
      if (!custId && appointment.customer_name && appointment.customer_phone) {
        const customer = await this.createCustomer({
          name: appointment.customer_name,
          phone: appointment.customer_phone
        });
        custId = customer.id;
      }
      if (!custId) {
        throw new Error("A valid customer record or details must be provided");
      }

      const list = getMockAppointments();
      const newApt: Appointment = {
        id: 'apt-' + Math.random().toString(36).substr(2, 9),
        customer_id: custId,
        service_id: appointment.service_id,
        staff_id: appointment.staff_id,
        date: appointment.date,
        time: appointment.time,
        status: 'pending',
        notes: appointment.notes || '',
        created_at: new Date().toISOString()
      };
      list.push(newApt);
      saveMockAppointments(list);

      // Create an associated unpaid payment record
      try {
        const srvs = getMockServices();
        const service = srvs.find(s => s.id === appointment.service_id);
        const amount = service ? service.price : 0;
        const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        
        const newPay: Payment = {
          id: 'pay-' + Math.random().toString(36).substr(2, 9),
          appointment_id: newApt.id,
          customer_id: custId,
          staff_id: appointment.staff_id,
          service_id: appointment.service_id,
          date: appointment.date,
          amount: amount,
          payment_status: 'unpaid',
          payment_method: 'cash',
          invoice_number: invoiceNumber,
          notes: 'Кабыл алууга жазылууда автоматтык түрдө түзүлдү.',
          created_at: new Date().toISOString()
        };
        const payList = getMockPayments();
        payList.push(newPay);
        saveMockPayments(payList);
      } catch (e) {
        console.error("Failed to auto-create payment record on appointment creation", e);
      }

      const allApts = await this.getAppointments();
      return allApts.find(a => a.id === newApt.id) || newApt;
    }
    const client = getClient();
    let custId = appointment.customer_id;

    // Direct customer details from public customer booking flow
    if (!custId && appointment.customer_name && appointment.customer_phone) {
      const customer = await this.createCustomer({
        name: appointment.customer_name,
        phone: appointment.customer_phone
      });
      custId = customer.id;
    }

    if (!custId) {
      throw new Error("A valid customer record or details must be provided");
    }

    const { data, error } = await client
      .from('appointments')
      .insert({
        customer_id: custId,
        service_id: appointment.service_id,
        staff_id: appointment.staff_id,
        date: appointment.date,
        time: appointment.time,
        status: 'pending',
        notes: appointment.notes || ''
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase createAppointment error:", error);
      throw error;
    }

    // Re-fetch populated appointments list to grab relation records
    const list = await this.getAppointments();
    const populated = list.find(a => a.id === data.id);
    if (populated) return populated;
    return data as Appointment;
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    if (!supabase) {
      const list = getMockAppointments();
      const idx = list.findIndex(a => a.id === id);
      if (idx === -1) throw new Error("Appointment not found");
      list[idx] = { ...list[idx], ...updates };
      saveMockAppointments(list);

      const allApts = await this.getAppointments();
      return allApts.find(a => a.id === id) || list[idx];
    }
    const client = getClient();
    const { data, error } = await client
      .from('appointments')
      .update({
        customer_id: updates.customer_id,
        service_id: updates.service_id,
        staff_id: updates.staff_id,
        date: updates.date,
        time: updates.time,
        status: updates.status,
        notes: updates.notes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase updateAppointment error:", error);
      throw error;
    }

    const list = await this.getAppointments();
    const populated = list.find(a => a.id === data.id);
    if (populated) return populated;
    return data as Appointment;
  },

  async deleteAppointment(id: string): Promise<void> {
    if (!supabase) {
      const list = getMockAppointments().filter(a => a.id !== id);
      saveMockAppointments(list);
      return;
    }
    const client = getClient();
    const { error } = await client
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase deleteAppointment error:", error);
      throw error;
    }
  },

  async getPayments(): Promise<Payment[]> {
    const pays = getMockPayments();
    const custs = getMockCustomers();
    const srvs = getMockServices();
    const stf = getMockStaff();
    return pays.map(pay => ({
      ...pay,
      customer: custs.find(c => c.id === pay.customer_id),
      service: srvs.find(s => s.id === pay.service_id),
      staff: stf.find(s => s.id === pay.staff_id)
    })).sort((a, b) => b.date.localeCompare(a.date));
  },

  async createPayment(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
    const list = getMockPayments();
    const newPay: Payment = {
      ...payment,
      id: 'pay-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    list.push(newPay);
    saveMockPayments(list);
    const all = await this.getPayments();
    return all.find(p => p.id === newPay.id) || newPay;
  },

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const list = getMockPayments();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Payment not found");
    list[idx] = { ...list[idx], ...updates } as Payment;
    saveMockPayments(list);
    const all = await this.getPayments();
    return all.find(p => p.id === id) || list[idx];
  }
};

// Export raw database SQL commands for visual feedback/review inside the app!
export const SUPABASE_POSTGRES_SCHEMA = `-- Business System v1 Schema Creation script
-- Targets: Beauty salons, dental clinics, and private medical clinics.

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    whatsapp VARCHAR(50),
    gender VARCHAR(20),
    dob DATE,
    address TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'inactive')),
    preferred_language VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    email VARCHAR(255),
    experience_years INTEGER DEFAULT 1,
    education TEXT,
    certificates TEXT,
    description TEXT,
    phone VARCHAR(50),
    working_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    working_hours_start VARCHAR(10) DEFAULT '09:00',
    working_hours_end VARCHAR(10) DEFAULT '18:00',
    vacation_days TEXT[] DEFAULT ARRAY[]::TEXT[],
    assigned_services TEXT[] DEFAULT ARRAY[]::TEXT[],
    rating DECIMAL(3, 2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT NOT NULL,
    staff_id UUID REFERENCES public.staff(id) ON DELETE RESTRICT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'::character varying NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Client Medical / General Notes Table
CREATE TABLE IF NOT EXISTS public.client_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) DEFAULT 'Administrator' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'::character varying NOT NULL CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables for Supabase security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Creating helpful indices for quick appointment reads & slot-locking lookups
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_date ON public.appointments(staff_id, date);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON public.appointments(customer_id);

-- 7. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES public.staff(id) ON DELETE RESTRICT NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT NOT NULL,
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'unpaid'::character varying NOT NULL CHECK (payment_status IN ('paid', 'partially_paid', 'unpaid', 'refunded')),
    payment_method VARCHAR(50) DEFAULT 'cash'::character varying NOT NULL CHECK (payment_method IN ('cash', 'card', 'mbank', 'elkart', 'visa_mastercard', 'other')),
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(date);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON public.payments(customer_id);
`;
