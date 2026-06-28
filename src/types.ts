export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  gender?: 'male' | 'female' | 'other' | '';
  dob?: string; // YYYY-MM-DD
  address?: string;
  notes?: string;
  status?: 'active' | 'inactive';
  preferred_language?: 'kg' | 'ru' | 'en' | '';
  created_at: string;
}

export interface ClientNote {
  id: string;
  customer_id: string;
  content: string;
  created_at: string;
  author?: string;
}

export interface Reminder {
  id: string;
  customer_id: string;
  title: string;
  due_date: string; // YYYY-MM-DD
  status: 'pending' | 'completed';
  created_at: string;
  customer_name?: string; // Cache for easy dashboard displaying
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category: string;
  is_active: boolean;
}

export interface Staff {
  id: string;
  name: string;
  specialization: string;
  avatar_url?: string;
  is_active: boolean;
  email?: string;
  
  // Extended profile fields
  experience_years?: number;
  education?: string;
  certificates?: string;
  description?: string;
  phone?: string;
  working_days?: string[]; // Array of weekdays like ["Monday", "Tuesday", etc]
  working_hours_start?: string; // e.g. "09:00"
  working_hours_end?: string; // e.g. "18:00"
  vacation_days?: string[]; // Array of "YYYY-MM-DD"
  assigned_services?: string[]; // Array of service_ids they provide
  rating?: number;
}

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  staff_id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (or standard time format)
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  
  // Joined relation fields for convenience
  customer?: Customer;
  service?: Service;
  staff?: Staff;
}

export type PaymentStatus = 'paid' | 'partially_paid' | 'unpaid' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'mbank' | 'elkart' | 'visa_mastercard' | 'other';

export interface Payment {
  id: string;
  appointment_id?: string;
  customer_id: string;
  staff_id: string; // Specialist
  service_id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  invoice_number: string;
  notes?: string;
  created_at: string;
  
  // Joined relation fields
  customer?: Customer;
  service?: Service;
  staff?: Staff;
}

