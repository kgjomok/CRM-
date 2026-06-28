import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Briefcase, 
  UserCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  Phone, 
  CheckCircle2,
  Star,
  BookOpen,
  Award,
  Globe,
  Mail,
  Eye,
  Info,
  MessageSquare,
  Activity,
  MapPin,
  User,
  Sparkles,
  Bell,
  History,
  AlertTriangle,
  FileText,
  CreditCard,
  Settings as SettingsIcon,
  Database,
  Printer,
  FileSpreadsheet,
  LogOut
} from 'lucide-react';
import { Customer, Service, Staff, Appointment, ClientNote, Reminder, Payment } from '../types';
import { api } from '../lib/supabase';
import { Language, translate } from '../lib/translations';
import CompanySettingsView from './CompanySettingsView';
import { CompanySettings } from '../lib/settings';
import SchemaViewer from './SchemaViewer';

const STANDARD_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM"
];

interface AdminDashboardProps {
  appointments: Appointment[];
  customers: Customer[];
  services: Service[];
  staffList: Staff[];
  onRefresh: () => void;
  toast: (msg: string, type: 'success' | 'error') => void;
  lang: Language;
  companySettings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
  onLogout?: () => void;
}

type AdminSection = 'dashboard' | 'appointments' | 'customers' | 'services' | 'staff' | 'calendar' | 'cashier' | 'payments' | 'reports' | 'whatsapp' | 'settings' | 'schema';

export default function AdminDashboard({ 
  appointments, 
  customers, 
  services, 
  staffList, 
  onRefresh, 
  toast,
  lang,
  companySettings,
  onSaveSettings,
  onLogout
}: AdminDashboardProps) {
  const t = (key: any) => translate(key, lang);

  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New CRM modules states
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-06-27');
  const [cashierCustomerId, setCashierCustomerId] = useState<string>('');
  const [cashierServiceId, setCashierServiceId] = useState<string>('');
  const [cashierPaymentMethod, setCashierPaymentMethod] = useState<string>('mbank');
  const [cashierDiscount, setCashierDiscount] = useState<number>(0);
  const [cashierNotes, setCashierNotes] = useState<string>('');
  const [cashierInvoiceReceipt, setCashierInvoiceReceipt] = useState<any | null>(null);

  const [whatsappTemplates, setWhatsappTemplates] = useState([
    { id: 'confirm', name: 'Жазылууну тастыктоо (Confirmation)', text: 'Саламатсызбы {CustomerName}! Сиз B1 Premium клиникасына {ServiceName} кызматына {DateTime} убактысына ийгиликтүү жазылдыңыз. Сизди күтөбүз! Кандайдыр бир суроолор болсо, байланышыңыз.' },
    { id: 'remind', name: 'Жазылууну эскертүү (Reminder)', text: 'Урматтуу {CustomerName}! Бүгүн {DateTime} убактысында {ServiceName} кызматына кабыл алууңузга 2 саат калды. Кечикпей келишиңизди суранабыз.' },
    { id: 'thanks', name: 'Рахмат айтуу билдирүүсү (Thank You)', text: 'Саламатсызбы {CustomerName}! Биздин кызматтарды тандаганыңыз үчүн терең ыраазычылык билдиребиз. Кызмат сапаты жөнүндө пикириңизди ушул жерден бөлүшсөңүз болот.' }
  ]);

  const [whatsappLogs, setWhatsappLogs] = useState([
    { id: 'log-1', name: 'Асель Муратова', service: 'Косметологиялык консультация', time: '2026-06-27 10:15', status: 'Жөнөтүлдү', type: 'Тастыктоо' },
    { id: 'log-2', name: 'Данияр Исмаилов', service: 'Тиштерди тазалоо', time: '2026-06-27 09:00', status: 'Жөнөтүлдү', type: 'Эскертүү' },
    { id: 'log-3', name: 'Нурбек Алиев', service: 'Брекет коюу', time: '2026-06-26 14:30', status: 'Жөнөтүлдү', type: 'Рахмат айтуу' }
  ]);

  // Form Modals states
  const [modalType, setModalType] = useState<'create' | 'edit' | null>(null);
  const [editId, setEditId] = useState<string>('');
  
  // Profile Detail modal
  const [selectedProfileStaff, setSelectedProfileStaff] = useState<Staff | null>(null);

  // APPOINTMENT FORM STATES
  const [aptCustomer, setAptCustomer] = useState<string>('');
  const [aptService, setAptService] = useState<string>('');
  const [aptStaff, setAptStaff] = useState<string>('');
  const [aptDate, setAptDate] = useState<string>('');
  const [aptTime, setAptTime] = useState<string>('');
  const [aptStatus, setAptStatus] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled'>('pending');
  const [aptNotes, setAptNotes] = useState<string>('');

  // CUSTOMER FORM STATES
  const [custName, setCustName] = useState<string>('');
  const [custPhone, setCustPhone] = useState<string>('');
  const [custEmail, setCustEmail] = useState<string>('');
  const [custWhatsapp, setCustWhatsapp] = useState<string>('');
  const [custGender, setCustGender] = useState<string>('');
  const [custDob, setCustDob] = useState<string>('');
  const [custAddress, setCustAddress] = useState<string>('');
  const [custNotes, setCustNotes] = useState<string>('');
  const [custStatus, setCustStatus] = useState<'active' | 'inactive'>('active');
  const [custPrefLang, setCustPrefLang] = useState<string>('');

  // CRM Detail States
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeCrmTab, setActiveCrmTab] = useState<'profile' | 'visits' | 'notes' | 'reminders' | 'payments'>('profile');
  const [clientNotes, setClientNotes] = useState<ClientNote[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'inactive' | 'new' | 'returning' | 'vip'>('all');

  // Payments and Finances State
  const [payments, setPayments] = useState<Payment[]>([]);

  // Load CRM details on mount/updates
  const loadCRMData = async () => {
    try {
      const notes = await api.getClientNotes();
      const rems = await api.getReminders();
      setClientNotes(notes);
      setReminders(rems);
    } catch (e) {
      console.error("Failed to fetch client notes and reminders", e);
    }
  };

  const loadPaymentsData = async () => {
    try {
      const pays = await api.getPayments();
      setPayments(pays);
    } catch (e) {
      console.error("Failed to load payments data", e);
    }
  };

  React.useEffect(() => {
    loadCRMData();
    loadPaymentsData();
  }, [customers, appointments]);

  // SERVICE FORM STATES
  const [srvName, setSrvName] = useState<string>('');
  const [srvDesc, setSrvDesc] = useState<string>('');
  const [srvDuration, setSrvDuration] = useState<number>(30);
  const [srvPrice, setSrvPrice] = useState<number>(50);
  const [srvCategory, setSrvCategory] = useState<string>('');
  const [srvActive, setSrvActive] = useState<boolean>(true);

  // STAFF FORM STATES (WITH ALL EXTENDED FIELDS)
  const [stfName, setStfName] = useState<string>('');
  const [stfSpec, setStfSpec] = useState<string>('');
  const [stfAvatar, setStfAvatar] = useState<string>('');
  const [stfActive, setStfActive] = useState<boolean>(true);
  const [stfEmail, setStfEmail] = useState<string>('');
  const [stfExperience, setStfExperience] = useState<number>(5);
  const [stfEducation, setStfEducation] = useState<string>('');
  const [stfCertificates, setStfCertificates] = useState<string>('');
  const [stfDescription, setStfDescription] = useState<string>('');
  const [stfPhone, setStfPhone] = useState<string>('');
  const [stfWorkingDays, setStfWorkingDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [stfWorkingHoursStart, setStfWorkingHoursStart] = useState<string>("09:00");
  const [stfWorkingHoursEnd, setStfWorkingHoursEnd] = useState<string>("18:00");
  const [stfVacationDays, setStfVacationDays] = useState<string>(''); // comma separated text
  const [stfAssignedServices, setStfAssignedServices] = useState<string[]>([]);
  const [stfRating, setStfRating] = useState<number>(4.9);

  const WEEKDAYS_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Toggle weekday selection
  const handleToggleWorkingDay = (day: string) => {
    if (stfWorkingDays.includes(day)) {
      setStfWorkingDays(stfWorkingDays.filter(d => d !== day));
    } else {
      setStfWorkingDays([...stfWorkingDays, day]);
    }
  };

  // Toggle assigned service selection
  const handleToggleAssignedService = (srvId: string) => {
    if (stfAssignedServices.includes(srvId)) {
      setStfAssignedServices(stfAssignedServices.filter(id => id !== srvId));
    } else {
      setStfAssignedServices([...stfAssignedServices, srvId]);
    }
  };

  // Create or Update operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeSection === 'appointments') {
        if (!aptCustomer || !aptService || !aptStaff || !aptDate || !aptTime) {
          toast(t('adminFillRequiredFields'), "error");
          return;
        }

        if (modalType === 'create') {
          await api.createAppointment({
            customer_id: aptCustomer,
            service_id: aptService,
            staff_id: aptStaff,
            date: aptDate,
            time: aptTime,
            notes: aptNotes
          });
          toast(t('success'), "success");
        } else {
          await api.updateAppointment(editId, {
            customer_id: aptCustomer,
            service_id: aptService,
            staff_id: aptStaff,
            date: aptDate,
            time: aptTime,
            status: aptStatus,
            notes: aptNotes
          });
          toast(t('success'), "success");
        }
      }

      else if (activeSection === 'customers') {
        if (!custName || !custPhone) {
          toast(t('adminNamePhoneRequired'), "error");
          return;
        }

        if (modalType === 'create') {
          await api.createCustomer({
            name: custName,
            phone: custPhone,
            email: custEmail || null,
            whatsapp: custWhatsapp || null,
            gender: custGender || null,
            dob: custDob || null,
            address: custAddress || null,
            notes: custNotes || null,
            status: custStatus,
            preferred_language: custPrefLang || null
          });
          toast(t('success'), "success");
        } else {
          await api.updateCustomer(editId, {
            name: custName,
            phone: custPhone,
            email: custEmail || null,
            whatsapp: custWhatsapp || null,
            gender: custGender || null,
            dob: custDob || null,
            address: custAddress || null,
            notes: custNotes || null,
            status: custStatus,
            preferred_language: custPrefLang || null
          });
          toast(t('success'), "success");
        }
      }

      else if (activeSection === 'services') {
        if (!srvName || !srvPrice || !srvDuration) {
          toast(t('adminSrvNamePriceDurationRequired'), "error");
          return;
        }

        if (modalType === 'create') {
          await api.createService({
            name: srvName,
            description: srvDesc,
            duration_minutes: Number(srvDuration),
            price: Number(srvPrice),
            category: srvCategory || 'General',
            is_active: srvActive
          });
          toast(t('success'), "success");
        } else {
          await api.updateService(editId, {
            name: srvName,
            description: srvDesc,
            duration_minutes: Number(srvDuration),
            price: Number(srvPrice),
            category: srvCategory || 'General',
            is_active: srvActive
          });
          toast(t('success'), "success");
        }
      }

      else if (activeSection === 'staff') {
        if (!stfName || !stfSpec) {
          toast(t('adminStfNameSpecRequired'), "error");
          return;
        }

        // Parse vacation days from comma-separated string
        const parsedVacation = stfVacationDays
          .split(',')
          .map(d => d.trim())
          .filter(d => d.length > 0);

        const staffDataPayload = {
          name: stfName,
          specialization: stfSpec,
          avatar_url: stfAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150',
          is_active: stfActive,
          email: stfEmail,
          experience_years: Number(stfExperience),
          education: stfEducation,
          certificates: stfCertificates,
          description: stfDescription,
          phone: stfPhone,
          working_days: stfWorkingDays,
          working_hours_start: stfWorkingHoursStart,
          working_hours_end: stfWorkingHoursEnd,
          vacation_days: parsedVacation,
          assigned_services: stfAssignedServices,
          rating: Number(stfRating)
        };

        if (modalType === 'create') {
          await api.createStaff(staffDataPayload);
          toast(t('success'), "success");
        } else {
          await api.updateStaff(editId, staffDataPayload);
          toast(t('success'), "success");
        }
      }

      closeModal();
      onRefresh();
    } catch (err: any) {
      toast(err.message || t('error'), "error");
    }
  };

  // Quick operations: Complete, Cancel, Delete
  const handleQuickStatus = async (id: string, status: 'completed' | 'cancelled' | 'confirmed') => {
    try {
      await api.updateAppointment(id, { status });
      toast(t('success'), "success");
      onRefresh();
    } catch (err: any) {
      toast(err.message || t('error'), "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('adminConfirmDeleteRecord'))) return;
    try {
      if (activeSection === 'appointments') {
        await api.deleteAppointment(id);
      } else if (activeSection === 'customers') {
        await api.deleteCustomer(id);
      } else if (activeSection === 'services') {
        await api.deleteService(id);
      } else if (activeSection === 'staff') {
        await api.deleteStaff(id);
      }
      toast(t('success'), "success");
      onRefresh();
    } catch (err: any) {
      toast(err.message || t('error'), "error");
    }
  };

  // Open Modals
  const openCreateModal = () => {
    setModalType('create');
    setEditId('');
    
    // Clear state
    if (activeSection === 'appointments') {
      setAptCustomer(customers[0]?.id || '');
      setAptService(services[0]?.id || '');
      setAptStaff(staffList[0]?.id || '');
      setAptDate(new Date().toISOString().split('T')[0]);
      setAptTime('09:00 AM');
      setAptStatus('pending');
      setAptNotes('');
    } else if (activeSection === 'customers') {
      setCustName('');
      setCustPhone('');
      setCustEmail('');
      setCustWhatsapp('');
      setCustGender('');
      setCustDob('');
      setCustAddress('');
      setCustNotes('');
      setCustStatus('active');
      setCustPrefLang('');
    } else if (activeSection === 'services') {
      setSrvName('');
      setSrvDesc('');
      setSrvDuration(45);
      setSrvPrice(100);
      setSrvCategory('General');
      setSrvActive(true);
    } else if (activeSection === 'staff') {
      setStfName('');
      setStfSpec('');
      setStfAvatar('');
      setStfActive(true);
      setStfEmail('');
      setStfExperience(5);
      setStfEducation('');
      setStfCertificates('');
      setStfDescription('');
      setStfPhone('');
      setStfWorkingDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
      setStfWorkingHoursStart("09:00");
      setStfWorkingHoursEnd("18:00");
      setStfVacationDays('');
      setStfAssignedServices([]);
      setStfRating(4.9);
    }
  };

  const openEditModal = (record: any) => {
    setModalType('edit');
    setEditId(record.id);

    if (activeSection === 'appointments') {
      setAptCustomer(record.customer_id);
      setAptService(record.service_id);
      setAptStaff(record.staff_id);
      setAptDate(record.date);
      setAptTime(record.time);
      setAptStatus(record.status);
      setAptNotes(record.notes || '');
    } else if (activeSection === 'customers') {
      setCustName(record.name);
      setCustPhone(record.phone);
      setCustEmail(record.email || '');
      setCustWhatsapp(record.whatsapp || '');
      setCustGender(record.gender || '');
      setCustDob(record.dob || '');
      setCustAddress(record.address || '');
      setCustNotes(record.notes || '');
      setCustStatus(record.status || 'active');
      setCustPrefLang(record.preferred_language || '');
    } else if (activeSection === 'services') {
      setSrvName(record.name);
      setSrvDesc(record.description || '');
      setSrvDuration(record.duration_minutes);
      setSrvPrice(record.price);
      setSrvCategory(record.category);
      setSrvActive(record.is_active);
    } else if (activeSection === 'staff') {
      setStfName(record.name);
      setStfSpec(record.specialization);
      setStfAvatar(record.avatar_url || '');
      setStfActive(record.is_active);
      setStfEmail(record.email || '');
      setStfExperience(record.experience_years || 5);
      setStfEducation(record.education || '');
      setStfCertificates(record.certificates || '');
      setStfDescription(record.description || '');
      setStfPhone(record.phone || '');
      setStfWorkingDays(record.working_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
      setStfWorkingHoursStart(record.working_hours_start || "09:00");
      setStfWorkingHoursEnd(record.working_hours_end || "18:00");
      setStfVacationDays((record.vacation_days || []).join(', '));
      setStfAssignedServices(record.assigned_services || []);
      setStfRating(record.rating || 4.9);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditId('');
  };

  // --- CRM SUB-COMPONENT ACTION HANDLERS ---
  const handleToggleReminderStatus = async (reminderId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await api.updateReminderStatus(reminderId, nextStatus);
      toast(t('success'), "success");
      await loadCRMData();
    } catch (e: any) {
      toast(e.message || "Failed to update reminder", "error");
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!confirm(t('adminConfirmDeleteRecord'))) return;
    try {
      await api.deleteReminder(reminderId);
      toast(t('success'), "success");
      await loadCRMData();
    } catch (e: any) {
      toast(e.message || "Failed to delete reminder", "error");
    }
  };

  const handleAddClientNote = async (customerId: string, content: string) => {
    if (!content.trim()) return;
    try {
      await api.createClientNote({
        customer_id: customerId,
        content: content.trim(),
        author: 'Administrator'
      });
      toast(t('success'), "success");
      await loadCRMData();
    } catch (e: any) {
      toast(e.message || "Failed to save note", "error");
    }
  };

  const handleDeleteClientNote = async (noteId: string) => {
    if (!confirm(t('adminConfirmDeleteRecord'))) return;
    try {
      await api.deleteClientNote(noteId);
      toast(t('success'), "success");
      await loadCRMData();
    } catch (e: any) {
      toast(e.message || "Failed to delete note", "error");
    }
  };

  const handleAddReminder = async (customerId: string, title: string, dueDate: string) => {
    if (!title.trim() || !dueDate) {
      toast(t('adminFillRequiredFields'), "error");
      return;
    }
    try {
      await api.createReminder({
        customer_id: customerId,
        title: title.trim(),
        due_date: dueDate,
        status: 'pending'
      });
      toast(t('success'), "success");
      await loadCRMData();
    } catch (e: any) {
      toast(e.message || "Failed to create reminder", "error");
    }
  };

  // Helper to resolve working status for profile display
  const getProfileStaffStatus = (member: Staff) => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const todayName = weekdays[today.getDay()];
    const todayStr = today.toISOString().split('T')[0];
    
    const worksToday = member.working_days?.includes(todayName);
    const onVacation = member.vacation_days?.includes(todayStr);
    
    if (worksToday && !onVacation) {
      return { text: t('statusAvailableToday') || 'Available today', color: 'bg-emerald-50 text-emerald-700 border-emerald-150' };
    }
    return { text: t('statusBusyToday') || 'Busy today', color: 'bg-amber-50 text-amber-700 border-amber-150' };
  };

  // Filters search query
  const filteredAppointments = appointments.filter(apt => 
    apt.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.staff?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Customer Stats Aggregator for complete profile analytics
  const getCustomerStats = (customerId: string) => {
    const custApts = appointments.filter(a => a.customer_id === customerId);
    const completed = custApts.filter(a => a.status === 'completed');
    const cancelled = custApts.filter(a => a.status === 'cancelled');
    const upcoming = custApts.filter(a => a.status === 'pending' || a.status === 'confirmed');
    const totalSpent = completed.reduce((sum, current) => sum + (current.service?.price || 0), 0);
    
    // Favorite Service Calculation
    const serviceCounts: { [id: string]: { count: number, name: string } } = {};
    completed.forEach(apt => {
      if (apt.service_id && apt.service) {
        if (!serviceCounts[apt.service_id]) {
          serviceCounts[apt.service_id] = { count: 0, name: apt.service.name };
        }
        serviceCounts[apt.service_id].count++;
      }
    });
    let favService = 'N/A';
    let maxSrvCount = 0;
    Object.values(serviceCounts).forEach(srv => {
      if (srv.count > maxSrvCount) {
        maxSrvCount = srv.count;
        favService = srv.name;
      }
    });

    // Favorite Specialist Calculation
    const staffCounts: { [id: string]: { count: number, name: string } } = {};
    completed.forEach(apt => {
      if (apt.staff_id && apt.staff) {
        if (!staffCounts[apt.staff_id]) {
          staffCounts[apt.staff_id] = { count: 0, name: apt.staff.name };
        }
        staffCounts[apt.staff_id].count++;
      }
    });
    let favStaff = 'N/A';
    let maxStaffCount = 0;
    Object.values(staffCounts).forEach(stf => {
      if (stf.count > maxStaffCount) {
        maxStaffCount = stf.count;
        favStaff = stf.name;
      }
    });

    // Last Visit
    const completedSorted = [...completed].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastVisit = completedSorted[0]?.date || 'N/A';

    // Next Appointment
    const upcomingSorted = [...upcoming].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const nextVisit = upcomingSorted[0] ? `${upcomingSorted[0].date} @ ${upcomingSorted[0].time}` : 'N/A';

    return {
      total: custApts.length,
      completed: completed.length,
      cancelled: cancelled.length,
      upcoming: upcoming.length,
      totalSpent,
      favService,
      favStaff,
      lastVisit,
      nextVisit
    };
  };

  const filteredCustomers = customers.filter(cust => {
    // 1. Search query (matches Name, Phone, and Email)
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      cust.name.toLowerCase().includes(query) ||
      cust.phone.includes(query) ||
      (cust.email && cust.email.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    // 2. Segment Filters (Active, Inactive, New, Returning, VIP)
    const stats = getCustomerStats(cust.id);
    if (customerFilter === 'active') return cust.status === 'active';
    if (customerFilter === 'inactive') return cust.status === 'inactive';
    
    if (customerFilter === 'new') {
      const regTime = cust.created_at ? new Date(cust.created_at).getTime() : new Date().getTime();
      return (new Date().getTime() - regTime) < 30 * 24 * 60 * 60 * 1000;
    }
    if (customerFilter === 'returning') return stats.total >= 2;
    if (customerFilter === 'vip') return stats.totalSpent >= 300 || stats.completed >= 3;

    return true;
  });

  const filteredServices = services.filter(srv => 
    srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    srv.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = staffList.filter(stf => 
    stf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stf.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* SECTION NAV & ACTION HEADER */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-150 dark:bg-slate-950 p-1 rounded-lg w-full">
          <button
            onClick={() => { setActiveSection('dashboard'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'dashboard' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'kg' ? '📊 Жалпы көрүнүш' : lang === 'ru' ? '📊 Обзор' : '📊 Overview'}</span>
          </button>

          <button
            onClick={() => { setActiveSection('customers'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'customers' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>{lang === 'kg' ? '👥 Кардарлар' : lang === 'ru' ? '👥 Клиенты' : '👥 Customers'} ({customers.length})</span>
          </button>

          <button
            onClick={() => { setActiveSection('appointments'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'appointments' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'kg' ? '📅 Жазылуулар' : lang === 'ru' ? '📅 Записи' : '📅 Appointments'} ({appointments.length})</span>
          </button>

          <button
            onClick={() => { setActiveSection('calendar'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'calendar' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-violet-500" />
            <span>{lang === 'kg' ? '🗓️ Календарь' : lang === 'ru' ? '🗓️ Календарь' : '🗓️ Calendar'}</span>
          </button>

          <button
            onClick={() => { setActiveSection('staff'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'staff' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>{lang === 'kg' ? '👨‍⚕️ Адистер' : lang === 'ru' ? '👨‍⚕️ Специалисты' : '👨‍⚕️ Staff'} ({staffList.length})</span>
          </button>

          <button
            onClick={() => { setActiveSection('services'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'services' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lang === 'kg' ? '📋 Кызматтар' : lang === 'ru' ? '📋 Услуги' : '📋 Services'} ({services.length})</span>
          </button>

          <button
            onClick={() => { setActiveSection('cashier'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'cashier' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'kg' ? '💸 Веб-касса' : lang === 'ru' ? '💸 Веб-касса' : '💸 Cashier'}</span>
          </button>

          <button
            onClick={() => { setActiveSection('payments'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'payments' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-500" />
            <span>{lang === 'kg' ? '💳 Төлөмдөр' : lang === 'ru' ? '💳 Платежи' : '💳 Payments'}</span>
          </button>

          <button
            onClick={() => { setActiveSection('reports'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'reports' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>{lang === 'kg' ? '📈 Отчеттор' : lang === 'ru' ? '📈 Отчеты' : '📈 Reports'}</span>
          </button>

          <button
            onClick={() => { setActiveSection('whatsapp'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'whatsapp' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-green-500" />
            <span>💬 WhatsApp</span>
          </button>

          <button
            onClick={() => { setActiveSection('settings'); setSearchQuery(''); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              activeSection === 'settings' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-blue-500 animate-spin-hover" />
            <span>{lang === 'kg' ? '⚙️ Жөндөөлөр' : lang === 'ru' ? '⚙️ Настройки' : '⚙️ Settings'}</span>
          </button>

          {companySettings.developerMode && (
            <button
              onClick={() => { setActiveSection('schema'); setSearchQuery(''); }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${
                activeSection === 'schema' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-purple-500" />
              <span>{t('schema')}</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer ml-auto border border-transparent hover:border-rose-200/40"
              title={lang === 'kg' ? "Системадан чыгуу" : lang === 'ru' ? "Выйти из системы" : "Logout"}
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>{lang === 'kg' ? 'Чыгуу' : lang === 'ru' ? 'Выйти' : 'Logout'}</span>
            </button>
          )}
        </div>

        {/* Global Search and Add Button */}
        {(activeSection === 'appointments' || activeSection === 'customers' || activeSection === 'services' || activeSection === 'staff') && (
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <input
              type="text"
              placeholder={t('adminSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs w-full md:w-48 bg-slate-50 dark:bg-slate-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-slate-300 dark:text-white"
            />
            <button
              onClick={openCreateModal}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeSection === 'appointments' && t('crmAddApt')}
                {activeSection === 'customers' && t('crmAddCust')}
                {activeSection === 'services' && t('crmAddSrv')}
                {activeSection === 'staff' && t('crmAddStf')}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* RENDER ACTIVE TABLE VIEW */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        
        {/* --- 0.1 DASHBOARD VIEW --- */}
        {activeSection === 'dashboard' && (
          <div className="p-6 space-y-8 animate-fadeIn">
            {/* Upper stats widgets row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-100">Жалпы киреше (Total revenue)</span>
                <div className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
                  ${appointments.reduce((sum, apt) => sum + (apt.status === 'completed' || apt.status === 'confirmed' ? (apt.service?.price || 0) : 0), 0) + 380}
                </div>
                <div className="text-[10px] text-blue-200 mt-2 flex items-center gap-1">
                  <span className="text-emerald-400 font-bold">↑ 14%</span> өткөн жумага салыштырмалуу
                </div>
              </div>

              <div className="bg-gradient-to-tr from-emerald-600 to-teal-600 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-100">Активдүү кардарлар (Customers)</span>
                <div className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
                  {customers.length}
                </div>
                <div className="text-[10px] text-emerald-200 mt-2 flex items-center gap-1">
                  <span className="text-emerald-300 font-bold">+{customers.filter(c => c.status === 'active').length}</span> активдүү базада
                </div>
              </div>

              <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-100">Күтүүдөгү жазылуулар (Pending)</span>
                <div className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
                  {appointments.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-[10px] text-amber-200 mt-2 flex items-center gap-1">
                  <span className="animate-pulse bg-white/20 px-1.5 py-0.5 rounded font-extrabold text-[9px]">АРАКЕТ КЕРЕК</span> тез арада тастыктоо
                </div>
              </div>

              <div className="bg-gradient-to-tr from-purple-600 to-pink-600 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-100">Жалпы жазылуулар (Appointments)</span>
                <div className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
                  {appointments.length}
                </div>
                <div className="text-[10px] text-purple-200 mt-2">
                  Кабыл алуулар жана суроолордун жалпы саны
                </div>
              </div>

            </div>

            {/* Middle widgets (Double column layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left sidebar column (Quick Actions & Today's Activity) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Quick Actions Panel */}
                <div className="bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Ыкчам аракеттер (Quick Actions)</h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button 
                      onClick={() => { setActiveSection('cashier'); }}
                      className="p-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-sm transition-all cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Кассадан төлөм кабыл алуу</span>
                    </button>
                    <button 
                      onClick={() => { setActiveSection('appointments'); openCreateModal(); }}
                      className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>Жаңы жазылуу кошуу</span>
                    </button>
                    <button 
                      onClick={() => { setActiveSection('customers'); openCreateModal(); }}
                      className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>Жаңы кардар каттоо</span>
                    </button>
                    <button 
                      onClick={() => { setActiveSection('whatsapp'); }}
                      className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span>WhatsApp эскертүүлөрүн жөндөө</span>
                    </button>
                  </div>
                </div>

                {/* "Бүгүнкү абал" (Today's Activity) Notification Widget */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔔</span>
                      <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 tracking-wider">Бүгүнкү абал (Today's Activity)</h4>
                    </div>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-500 rounded-lg">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Бүгүнкү кабыл алуулар</span>
                      </div>
                      <span className="text-sm font-black text-slate-950 dark:text-white">8</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 rounded-lg">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Бүгүнкү киреше</span>
                      </div>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">18 500 сом</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-500 rounded-lg">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Кийинки бейтап</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">14:00</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 rounded-lg">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Күтүүдөгү жазылуулар</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">2</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 dark:bg-rose-950/60 text-rose-500 rounded-lg">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Бүгүнкү эскертүүлөр</span>
                      </div>
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400">1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical representation & Statuses */}
              <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Статистикалык талдоо</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">Реалдуу убакытта жаңыланды</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Category bars chart */}
                  <div className="space-y-4">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Кызматтар боюнча киреше пайызы</span>
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Косметология (Esthetic)</span>
                          <span>60%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Стоматология (Dental)</span>
                          <span>30%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Консультациялар (Consulting)</span>
                          <span>10%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: '10%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational status counters */}
                  <div className="space-y-4">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Жазылуулардын абалы</span>
                    <div className="space-y-3 pt-1 text-xs">
                      <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 rounded-xl">
                        <span className="flex items-center gap-2 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Тастыкталгандар (Confirmed)</span>
                        <span className="font-black text-slate-900 dark:text-slate-100">{appointments.filter(a => a.status === 'confirmed').length}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 rounded-xl">
                        <span className="flex items-center gap-2 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Бүткөн кабыл алуулар (Completed)</span>
                        <span className="font-black text-slate-900 dark:text-slate-100">{appointments.filter(a => a.status === 'completed').length}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 rounded-xl">
                        <span className="flex items-center gap-2 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Күтүүдөгүнү кароо (Pending)</span>
                        <span className="font-black text-slate-900 dark:text-slate-100">{appointments.filter(a => a.status === 'pending').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Lower row: Recent Appointments table summary */}
            <div className="bg-slate-50 dark:bg-slate-950/10 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Акыркы жазылуулар (Recent Appointments)</h4>
                <button 
                  onClick={() => setActiveSection('appointments')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Баарын көрүү →
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-850">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Кардар</th>
                      <th className="px-4 py-3">Кызмат</th>
                      <th className="px-4 py-3">Адис</th>
                      <th className="px-4 py-3">Убакыт</th>
                      <th className="px-4 py-3">Абалы</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                    {appointments.slice(0, 4).map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{apt.customer?.name || 'Белгисиз кардар'}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{apt.service?.name}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{apt.staff?.name}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{apt.date} • {apt.time}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase ${
                            apt.status === 'confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                            apt.status === 'completed' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                            apt.status === 'cancelled' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                            'bg-amber-50 border-amber-100 text-amber-600 animate-pulse'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- 0.2 CALENDAR VIEW --- */}
        {activeSection === 'calendar' && (
          <div className="p-6 space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column (8 cols): June 2026 Monthly Calendar Grid */}
              <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-violet-500 uppercase tracking-widest font-mono">АКТИВДҮҮ ЖУРНАЛ</span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Июнь 2026 (June 2026)</h3>
                  </div>
                  <div className="flex gap-1.5 text-xs font-bold text-slate-500">
                    <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">←</span>
                    <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">→</span>
                  </div>
                </div>

                {/* Weekdays labels */}
                <div className="grid grid-cols-7 text-center text-[10px] uppercase font-black text-slate-400 tracking-wider">
                  <span>Дш</span>
                  <span>Шш</span>
                  <span>Шр</span>
                  <span>Бш</span>
                  <span>Жм</span>
                  <span>Иш</span>
                  <span>Жш</span>
                </div>

                {/* Days of June 2026 Monthly Grid */}
                <div className="grid grid-cols-7 gap-2.5">
                  {Array.from({ length: 30 }).map((_, index) => {
                    const dayNum = index + 1;
                    const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
                    const hasAppointments = appointments.some(apt => apt.date === dateStr);
                    const isSelected = selectedCalendarDate === dateStr;

                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedCalendarDate(dateStr)}
                        className={`h-14 rounded-xl border flex flex-col justify-between p-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-600/20'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-500 text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        <span className="text-xs font-extrabold">{dayNum}</span>
                        {hasAppointments && (
                          <span className={`w-1.5 h-1.5 rounded-full mx-auto ${isSelected ? 'bg-white' : 'bg-emerald-500'} animate-pulse`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (4 cols): Selected Day Appointments Timeline */}
              <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Талдалган күн</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight mt-1">
                    {selectedCalendarDate} жазылуулары
                  </h4>
                </div>

                <div className="space-y-4">
                  {appointments.filter(apt => apt.date === selectedCalendarDate).length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="text-2xl">💤</div>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        Бул күнгө азырынча онлайн жазылуулар каттала элек. Башка күндөрдү тандап көрүңүз.
                      </p>
                    </div>
                  ) : (
                    appointments.filter(apt => apt.date === selectedCalendarDate).map(apt => (
                      <div 
                        key={apt.id}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{apt.customer?.name}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded font-mono font-bold text-slate-500">
                            {apt.time}
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] text-slate-500">
                          <p>🩺 Кызмат: <span className="font-bold text-slate-700 dark:text-slate-300">{apt.service?.name}</span></p>
                          <p>👨‍⚕️ Адис: <span className="font-bold text-slate-700 dark:text-slate-300">{apt.staff?.name}</span></p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- 0.3 CASHIER (ВЕБ-КАССА) VIEW --- */}
        {activeSection === 'cashier' && (
          <div className="p-6 space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (7 cols): Checkout cashier terminal */}
              <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-mono">B1 CRM WEB-KASSA</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">Кассалык терминал (Cash register desk)</h3>
                </div>

                <div className="space-y-4">
                  {/* Customer Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Кардарды тандоо (Select client)</label>
                    <select
                      value={cashierCustomerId}
                      onChange={(e) => setCashierCustomerId(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100"
                    >
                      <option value="">-- Катталган кардарды тандаңыз --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                      ))}
                    </select>
                  </div>

                  {/* Service Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Кызматты тандоо (Select service)</label>
                    <select
                      value={cashierServiceId}
                      onChange={(e) => setCashierServiceId(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100"
                    >
                      <option value="">-- Төлөнүүчү кызматты тандаңыз --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                      ))}
                    </select>
                  </div>

                  {/* Grid fields for Discount & Payment method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Payment methods list */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Төлөм ыкмасы (Payment Method)</label>
                      <select
                        value={cashierPaymentMethod}
                        onChange={(e) => setCashierPaymentMethod(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100"
                      >
                        <option value="mbank">MBank онлайн</option>
                        <option value="elcart">Элкарт QR</option>
                        <option value="o!dengi">О!Деньги</option>
                        <option value="cash">Наличные (Накталай)</option>
                      </select>
                    </div>

                    {/* Discount input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Арзандатуу (Discount, $)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={cashierDiscount || ''}
                        onChange={(e) => setCashierDiscount(Number(e.target.value))}
                        className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Эскертүү / Комментарий</label>
                    <input
                      type="text"
                      placeholder="Кошумча маалымат..."
                      value={cashierNotes}
                      onChange={(e) => setCashierNotes(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Summary (Жалпы төлөм) Карточкасы */}
                  {(() => {
                    const selectedSrv = services.find(s => s.id === cashierServiceId);
                    const basePriceUSD = selectedSrv ? (selectedSrv.price || 0) : 0;
                    const basePriceSom = basePriceUSD * 90;
                    const discountUSD = cashierDiscount || 0;
                    const discountSom = discountUSD * 90;
                    const totalUSD = Math.max(0, basePriceUSD - discountUSD);
                    const totalSom = totalUSD * 90;

                    return (
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-500/20 dark:border-emerald-900/40 space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2.5">
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono block">Жалпы төлөм (Summary)</span>
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">Авто-эсептөө</span>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Кызмат баасы:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{basePriceSom.toLocaleString()} сом <span className="text-[10px] text-slate-400 font-normal">(${basePriceUSD})</span></span>
                          </div>
                          
                          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Арзандатуу:</span>
                            <span className="font-bold text-rose-500">-{discountSom.toLocaleString()} сом <span className="text-[10px] text-slate-400 font-normal">(${discountUSD})</span></span>
                          </div>

                          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Кошумча кызматтар:</span>
                            <span className="font-bold text-slate-500">0 сом</span>
                          </div>

                          <div className="border-t border-dashed border-emerald-500/20 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Жалпы төлөнө турган сумма</span>
                            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-sans">
                              💰 {totalSom.toLocaleString()} сом
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Submit Accept Payment Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (!cashierCustomerId || !cashierServiceId) {
                          toast("Сураныч, кардарды жана кызматты толук тандаңыз", "error");
                          return;
                        }
                        const selectedCust = customers.find(c => c.id === cashierCustomerId);
                        const selectedSrv = services.find(s => s.id === cashierServiceId);
                        
                        const calculatedTotal = Math.max(0, (selectedSrv?.price || 0) - cashierDiscount);
                        
                        // Set active invoice receipt state to mock print
                        setCashierInvoiceReceipt({
                          invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
                          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                          customer: selectedCust?.name,
                          service: selectedSrv?.name,
                          basePrice: selectedSrv?.price,
                          discount: cashierDiscount,
                          totalPaid: calculatedTotal,
                          method: cashierPaymentMethod.toUpperCase()
                        });

                        // Fire success toast!
                        toast("Төлөм кассадан ийгиликтүү өттү жана чек даярдалды!", "success");
                        onRefresh();
                      }}
                      className="w-full p-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      Төлөмдү кабыл алуу жана кассалык чекти чыгаруу
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Bill Receipt Mock up */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="text-center pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Кассалык чек (Receipt Bill)</h4>
                </div>

                {!cashierInvoiceReceipt ? (
                  <div className="text-center py-20 text-slate-400 space-y-3 font-normal">
                    <div className="text-3xl text-slate-300">🧾</div>
                    <p className="text-xs">
                      Сол жактагы формадан кызматты жана кардарды тандап, төлөмдү аткарыңыз. Кассалык чек ушул жерде жаралат.
                    </p>
                  </div>
                ) : (
                  <div className="font-mono text-xs text-slate-800 dark:text-slate-200 space-y-4">
                    <div className="text-center space-y-1">
                      <span className="font-black tracking-widest text-slate-900 dark:text-white text-sm">B1 CRM SOLUTIONS</span>
                      <span className="block text-[10px] text-slate-400">Бишкек шаары, Тынчтык проспектиси, 12А</span>
                      <span className="block text-[9px] text-slate-400">ТЕЛЕФОН: +996 (555) 012-345</span>
                    </div>

                    <div className="border-t border-b border-dashed border-slate-200 dark:border-slate-800 py-3 space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span>Чек номери:</span>
                        <span className="font-bold">{cashierInvoiceReceipt.invoiceNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Дата:</span>
                        <span>{cashierInvoiceReceipt.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Төлөм ыкмасы:</span>
                        <span className="font-bold text-blue-500">{cashierInvoiceReceipt.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Кассир:</span>
                        <span>Администратор</span>
                      </div>
                    </div>

                    <div className="space-y-2 py-2">
                      <div className="flex justify-between font-bold">
                        <span>Кызмат / Кызмат көрсөтүүчү</span>
                        <span>Баасы</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{cashierInvoiceReceipt.service}</span>
                        <span>${cashierInvoiceReceipt.basePrice}</span>
                      </div>
                      {cashierInvoiceReceipt.discount > 0 && (
                        <div className="flex justify-between text-[11px] text-rose-500 font-semibold">
                          <span>Арзандатуу (Discount):</span>
                          <span>-${cashierInvoiceReceipt.discount}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex justify-between font-black text-sm text-slate-950 dark:text-white">
                      <span>ЖАЛПЫ ТӨЛӨНДҮ (TOTAL PAID):</span>
                      <span>${cashierInvoiceReceipt.totalPaid}</span>
                    </div>

                    <div className="text-center pt-6 space-y-2">
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Кызмат тандаганыңыз үчүн рахмат!</span>
                      <button
                        onClick={() => {
                          toast("Басып чыгаруу симуляцияланды!", "success");
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer transition-all border border-slate-200 dark:border-slate-700"
                      >
                        🖨️ Чекти басып чыгаруу (Print receipt)
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* --- 0.4 PAYMENTS (ТӨЛӨМДӨР) VIEW --- */}
        {activeSection === 'payments' && (
          <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest font-mono">ФИНАНСЫЛЫК КӨЗӨМӨЛ</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Кассалык төлөмдөр архиви</h3>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Чек номери (Invoice)</th>
                    <th className="px-6 py-4">Дата / Убакыт</th>
                    <th className="px-6 py-4">Кардар</th>
                    <th className="px-6 py-4">Кызмат көрсөтүү</th>
                    <th className="px-6 py-4">Баасы</th>
                    <th className="px-6 py-4">Төлөм ыкмасы</th>
                    <th className="px-6 py-4">Статусу</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {cashierInvoiceReceipt && (
                    <tr className="bg-emerald-50/20 hover:bg-emerald-50/30 font-semibold">
                      <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{cashierInvoiceReceipt.invoiceNo}</td>
                      <td className="px-6 py-4 text-slate-500">{cashierInvoiceReceipt.date}</td>
                      <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{cashierInvoiceReceipt.customer}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{cashierInvoiceReceipt.service}</td>
                      <td className="px-6 py-4 font-black text-emerald-600">${cashierInvoiceReceipt.totalPaid}</td>
                      <td className="px-6 py-4 font-bold text-blue-500">{cashierInvoiceReceipt.method}</td>
                      <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-extrabold uppercase">Completed</span></td>
                    </tr>
                  )}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                    <td className="px-6 py-4 font-mono text-slate-600">INV-837482</td>
                    <td className="px-6 py-4 text-slate-500">2026-06-27 10:30</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">Алия Назарбаева</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Тиш катарларын түзөө</td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-slate-100">$200</td>
                    <td className="px-6 py-4 font-bold text-blue-500">MBANK</td>
                    <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-extrabold uppercase">Completed</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                    <td className="px-6 py-4 font-mono text-slate-600">INV-230495</td>
                    <td className="px-6 py-4 text-slate-500">2026-06-27 09:15</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">Кайрат Нуртас</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Косметологиялык консультация</td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-slate-100">$80</td>
                    <td className="px-6 py-4 font-bold text-blue-500">ELCART</td>
                    <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-extrabold uppercase">Completed</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                    <td className="px-6 py-4 font-mono text-slate-600">INV-920495</td>
                    <td className="px-6 py-4 text-slate-500">2026-06-26 16:45</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">Самара Каримова</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Брекет коюу</td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-slate-100">$150</td>
                    <td className="px-6 py-4 font-bold text-blue-500">CASH</td>
                    <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-extrabold uppercase">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 0.5 REPORTS (ФИНАНСЫЛЫК ОТЧЕТ) VIEW --- */}
        {activeSection === 'reports' && (
          <div className="p-6 space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest block font-mono">СТАТИСТИКА ЖАНА ТАЛДОО</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Финансылык отчеттук көрсөткүчтөр</h3>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toast("PDF отчет даярдалды", "success")}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 border border-rose-200/40 dark:border-rose-900/30 text-xs font-black rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📄 PDF</span>
                </button>

                <button
                  onClick={() => toast("Excel отчет даярдалды", "success")}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 border border-emerald-200/40 dark:border-emerald-900/30 text-xs font-black rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>📊 Excel</span>
                </button>

                <button
                  onClick={() => {
                    toast("Басып чыгаруу башталды...", "success");
                    try {
                      window.print();
                    } catch (e) {
                      console.log("Printing not supported in sandbox", e);
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-black rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>🖨 Print</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category Reports Card */}
              <div className="bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Кызматтар категориясы боюнча киреше</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Aesthetic / Косметология</span>
                      <span>$1,420 (58%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '58%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Dental / Стоматология</span>
                      <span>$840 (34%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '34%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Башка кызматтар / Консультациялар</span>
                      <span>$200 (8%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '8%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payments method reports card */}
              <div className="bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Төлөм ыкмалары боюнча талдоо</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>MBank онлайн</span>
                      <span>$1,200 (49%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '49%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Элкарт QR</span>
                      <span>$650 (26%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: '26%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>О!Деньги электрондук капчыгы</span>
                      <span>$400 (16%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '16%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Накталай төлөмдөр (Cash)</span>
                      <span>$210 (9%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-500 to-slate-700 h-full rounded-full" style={{ width: '9%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 0.6 WHATSAPP БАШКАРУУ VIEW --- */}
        {activeSection === 'whatsapp' && (
          <div className="p-6 space-y-8 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest block font-mono">AUTOMATED MESSAGING CONTROL</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">WhatsApp автоматтык эскертүүлөрү</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left card: Template Builder */}
              <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Шаблондорду оңдоо (Template Builder)</h4>
                
                <div className="space-y-4">
                  {whatsappTemplates.map((tmpl, idx) => (
                    <div key={tmpl.id} className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{tmpl.name}</span>
                      <textarea
                        rows={3}
                        value={tmpl.text}
                        onChange={(e) => {
                          const updated = [...whatsappTemplates];
                          updated[idx].text = e.target.value;
                          setWhatsappTemplates(updated);
                        }}
                        className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  ))}
                  
                  <div className="pt-2 text-right">
                    <button
                      onClick={() => {
                        toast("Текст шаблондору ийгиликтүү сакталды!", "success");
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                    >
                      Шаблондорду сактоо (Save templates)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right card: Send Delivery Log */}
              <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Жөнөтүү отчеттору (Delivery Logs)</h4>
                
                <div className="overflow-x-auto rounded-xl border border-slate-200/40 dark:border-slate-850">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Алуучу кардар</th>
                        <th className="px-4 py-3">Билдирүү түрү</th>
                        <th className="px-4 py-3">Убакыт</th>
                        <th className="px-4 py-3">Абалы</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                      {whatsappLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                          <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{log.name}</td>
                          <td className="px-4 py-3 text-slate-500">{log.type}</td>
                          <td className="px-4 py-3 font-mono text-slate-400">{log.time}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-extrabold uppercase">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 1. APPOINTMENTS QUEUE (CRM OPERATIONAL HUB) --- */}
        {activeSection === 'appointments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
            {/* Real-time Appointments List (2/3) */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">{t('adminCustContactHeader')}</th>
                    <th className="px-6 py-4">{t('adminTreatmentPriceHeader')}</th>
                    <th className="px-6 py-4">{t('adminPractitionerHeader')}</th>
                    <th className="px-6 py-4">{t('adminDateTimeHeader')}</th>
                    <th className="px-6 py-4">{t('adminStatusHeader')}</th>
                    <th className="px-6 py-4 text-right">{t('adminActionsHeader')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                        {t('adminNoMatchingApts')}
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => apt.customer_id && setSelectedCustomerId(apt.customer_id)}
                            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left block"
                            title="Open CRM Client Profile"
                          >
                            {apt.customer?.name || t('noData')}
                          </button>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3" />
                            <span>{apt.customer?.phone || t('noData')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-350 px-2 py-0.5 rounded text-xs font-semibold border border-blue-100 dark:border-blue-900/55">
                              {apt.service?.name || t('noData')}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            ${apt.service?.price || '0'} • {apt.service?.duration_minutes || '0'} min
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {apt.staff?.avatar_url ? (
                              <img 
                                src={apt.staff.avatar_url} 
                                alt={apt.staff.name} 
                                className="w-7 h-7 rounded-full object-cover border border-slate-150 dark:border-slate-800"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center">
                                {apt.staff?.name?.charAt(0) || 'S'}
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{apt.staff?.name || t('noData')}</div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500">{apt.staff?.specialization}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">{apt.time}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{apt.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                            apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40' :
                            apt.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-150 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40' :
                            apt.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-150 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40' :
                            'bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40'
                          }`}>
                            {apt.status === 'completed' ? t('adminAptStatusCompleted') :
                             apt.status === 'confirmed' ? t('adminAptStatusConfirmed') :
                             apt.status === 'cancelled' ? t('adminAptStatusCancelled') :
                             t('adminAptStatusPending')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-1 justify-end items-center">
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => handleQuickStatus(apt.id, 'confirmed')}
                                className="p-1.5 text-blue-600 bg-blue-50 rounded border border-blue-100 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900 cursor-pointer"
                                title={t('crmActionConfirm')}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                              <button
                                onClick={() => handleQuickStatus(apt.id, 'completed')}
                                className="p-1.5 text-emerald-600 bg-emerald-50 rounded border border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900 cursor-pointer"
                                title={t('crmActionComplete')}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => openEditModal(apt)}
                              className="p-1.5 text-slate-600 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(apt.id)}
                              className="p-1.5 text-rose-600 bg-rose-50 rounded border border-rose-100 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Upcoming Reminders (1/3 Sidebar Panel) */}
            <div className="p-6 bg-slate-50/40 dark:bg-slate-900/40 flex flex-col border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
                <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t('crmRemindersDashboardHeader')}
                </h3>
                <span className="ml-auto bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-150 dark:border-amber-900/50">
                  {reminders.filter(r => r.status === 'pending').length}
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                {reminders.filter(r => r.status === 'pending').length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-4 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No Pending Callbacks</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Outstanding! All tasks are completed.</p>
                  </div>
                ) : (
                  reminders.filter(r => r.status === 'pending').map(rem => {
                    const cust = customers.find(c => c.id === rem.customer_id);
                    const isOverdue = new Date(rem.due_date).getTime() < new Date().setHours(0,0,0,0);
                    const isToday = rem.due_date === new Date().toISOString().split('T')[0];
                    return (
                      <div key={rem.id} className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 hover:border-slate-250 dark:hover:border-slate-750 transition-all shadow-sm">
                        <div className="flex items-start justify-between gap-1">
                          <div className="space-y-1">
                            <button
                              onClick={() => setSelectedCustomerId(rem.customer_id)}
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left block cursor-pointer"
                              title="Open Customer Profile"
                            >
                              {cust?.name || 'Unknown Customer'}
                            </button>
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                              {rem.title}
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleReminderStatus(rem.id, rem.status)}
                            className="p-1 text-slate-400 hover:text-emerald-500 rounded bg-slate-50 hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/20 border border-slate-100 dark:border-slate-800 cursor-pointer shrink-0"
                            title={t('crmMarkCompleted')}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-900">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                            isOverdue ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/40' :
                            isToday ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40' :
                            'bg-slate-50 text-slate-500 border-slate-150 dark:bg-slate-900 dark:text-slate-450 dark:border-slate-800'
                          }`}>
                            📅 {rem.due_date} {isOverdue && '(Overdue)'}
                          </span>
                          <button
                            onClick={() => handleDeleteReminder(rem.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 2. CUSTOMERS DATABASE (PROFESSIONAL CRM ENGINE) --- */}
        {activeSection === 'customers' && (
          <div className="flex flex-col">
            {/* Horizontal Filter Segments */}
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50/55 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-850">
              {[
                { id: 'all', label: t('crmFilterAll') || 'All Clients', count: customers.length, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
                { id: 'active', label: t('crmFilterActive') || 'Active', count: customers.filter(c => c.status === 'active').length, color: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20' },
                { id: 'inactive', label: t('crmFilterInactive') || 'Inactive', count: customers.filter(c => c.status === 'inactive').length, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
                { id: 'new', label: t('crmFilterNew') || 'New', count: customers.filter(c => (new Date().getTime() - new Date(c.created_at || '').getTime()) < 30 * 24 * 60 * 60 * 1000).length, color: 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20' },
                { id: 'returning', label: t('crmFilterReturning') || 'Returning', count: customers.filter(c => appointments.filter(a => a.customer_id === c.id).length >= 2).length, color: 'text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/20' },
                { id: 'vip', label: t('crmFilterVip') || 'VIP Client', count: customers.filter(c => {
                    const stats = getCustomerStats(c.id);
                    return stats.totalSpent >= 300 || stats.completed >= 3;
                  }).length, color: 'text-amber-800 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20' }
              ].map(segment => (
                <button
                  key={segment.id}
                  onClick={() => setCustomerFilter(segment.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    customerFilter === segment.id 
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-sm font-extrabold scale-102' 
                      : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>{segment.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    customerFilter === segment.id 
                      ? 'bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900' 
                      : segment.color
                  }`}>
                    {segment.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">{t('adminCustNameHeader')}</th>
                    <th className="px-6 py-4">{t('phoneNumberHeader')}</th>
                    <th className="px-6 py-4">{t('crmCustGender')} / {t('crmCustDob')}</th>
                    <th className="px-6 py-4">Visits & LTV</th>
                    <th className="px-6 py-4">{t('crmCustStatus')}</th>
                    <th className="px-6 py-4 text-right">{t('adminActionsHeader')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-slate-400 text-xs">
                        <Users className="w-10 h-10 mx-auto text-slate-300 mb-2.5" />
                        <p className="font-semibold text-slate-600 dark:text-slate-400">No Customers Found</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Try broadening your search or filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(cust => {
                      const stats = getCustomerStats(cust.id);
                      const flag = cust.preferred_language === 'kg' ? '🇰🇬' : cust.preferred_language === 'ru' ? '🇷🇺' : cust.preferred_language === 'en' ? '🇬🇧' : '';
                      
                      return (
                        <tr key={cust.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <button
                                  onClick={() => setSelectedCustomerId(cust.id)}
                                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer text-sm block"
                                  title="Open Professional CRM Profile"
                                >
                                  {cust.name} {flag}
                                </button>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                                  {cust.whatsapp && (
                                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                                      💬 WA: {cust.whatsapp}
                                    </span>
                                  )}
                                  <span>Reg: {cust.created_at ? cust.created_at.split('T')[0] : 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold">{cust.phone}</div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{cust.email || 'No Email'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                              {cust.gender ? (cust.gender === 'male' ? t('crmGenderMale') : cust.gender === 'female' ? t('crmGenderFemale') : t('crmGenderOther')) : 'N/A'}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                              {cust.dob ? `${cust.dob}` : 'No DOB'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              LTV: <span className="text-emerald-600 dark:text-emerald-400">${stats.totalSpent}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                              <span>Total: {stats.total}</span> • <span>Done: {stats.completed}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                              cust.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40' 
                                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                            }`}>
                              {cust.status === 'active' ? t('crmStatusActive') : t('crmStatusInactive')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-1 justify-end items-center">
                              <button
                                onClick={() => setSelectedCustomerId(cust.id)}
                                className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900 cursor-pointer"
                                title="Open CRM Profile details & medical notes"
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditModal(cust)}
                                className="p-1.5 text-slate-600 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(cust.id)}
                                className="p-1.5 text-rose-600 bg-rose-50 rounded border border-rose-100 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 3. SERVICES DIRECTORY --- */}
        {activeSection === 'services' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{t('adminTreatmentNameLabel')}</th>
                  <th className="px-6 py-4">{t('adminTreatmentDescriptionLabel')}</th>
                  <th className="px-6 py-4">{t('adminDurationMinutesLabel')}</th>
                  <th className="px-6 py-4">{t('adminPriceUsdLabel')}</th>
                  <th className="px-6 py-4">{t('adminStatusHeader')}</th>
                  <th className="px-6 py-4 text-right">{t('adminActionsHeader')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">{t('noData')}</td>
                  </tr>
                ) : (
                  filteredServices.map(srv => (
                    <tr key={srv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900 dark:text-white block">{srv.name}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium px-2 py-0.5 rounded mt-1 inline-block">
                          {srv.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs max-w-xs truncate">{srv.description || t('noData')}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">🕒 {srv.duration_minutes} min</td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-bold">${srv.price}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          srv.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}>
                          {srv.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => openEditModal(srv)}
                            className="p-1.5 text-slate-600 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(srv.id)}
                            className="p-1.5 text-rose-600 bg-rose-50 rounded border border-rose-100 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 4. STAFF ROSTER --- */}
        {activeSection === 'staff' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{t('adminPractitionerNameHeader')}</th>
                  <th className="px-6 py-4">{t('adminSpecializationHeader')}</th>
                  <th className="px-6 py-4">{t('adminEmailHeader')}</th>
                  <th className="px-6 py-4">{t('adminRosterStatusHeader')}</th>
                  <th className="px-6 py-4 text-right">{t('adminActionsHeader')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 text-xs">{t('adminNoMatchingStaffFound')}</td>
                  </tr>
                ) : (
                  filteredStaff.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        {member.avatar_url ? (
                          <img 
                            src={member.avatar_url} 
                            alt={member.name} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-150 dark:border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">{member.name}</span>
                          <span className="text-[10px] text-amber-500 font-extrabold flex items-center gap-0.5">
                            ★ {member.rating || 4.9} ({member.experience_years || 5} {t('experienceYearsShort')})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{member.specialization}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-550 text-xs font-mono">{member.email || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          member.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}>
                          {member.is_active ? 'ON DUTY' : 'OFF DUTY'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => setSelectedProfileStaff(member)}
                            className="p-1.5 text-blue-600 bg-blue-50 rounded border border-blue-150 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 cursor-pointer"
                            title="View Specialist Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(member)}
                            className="p-1.5 text-slate-600 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-1.5 text-rose-600 bg-rose-50 rounded border border-rose-100 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 5. SYSTEM SETTINGS --- */}
        {activeSection === 'settings' && (
          <div className="p-6 bg-slate-50 dark:bg-slate-950/20">
            <CompanySettingsView 
              settings={companySettings}
              onSave={onSaveSettings}
              lang={lang}
            />
          </div>
        )}

        {/* --- 6. SCHEMA BLUEPRINT --- */}
        {activeSection === 'schema' && (
          <div className="p-6 bg-slate-50 dark:bg-slate-950/20">
            <SchemaViewer />
          </div>
        )}

      </div>

      {/* COMPREHENSIVE SPECIALIST PROFILE VIEW MODAL */}
      {selectedProfileStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden">
            
            {/* Header / Cover */}
            <div className="bg-slate-900 p-6 text-white relative">
              <button 
                onClick={() => setSelectedProfileStaff(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex gap-4 items-center">
                {selectedProfileStaff.avatar_url ? (
                  <img 
                    src={selectedProfileStaff.avatar_url} 
                    alt={selectedProfileStaff.name} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 shadow"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-700 text-2xl font-bold flex items-center justify-center">
                    {selectedProfileStaff.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedProfileStaff.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{selectedProfileStaff.specialization}</p>
                  
                  <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                    <div className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{selectedProfileStaff.rating || '4.9'}</span>
                    </div>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-bold">{selectedProfileStaff.experience_years || 5} {t('experienceYearsShort')} {t('experienceYears')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20 text-xs text-slate-700 dark:text-slate-300">
              
              {/* Working Status & Info Banner */}
              <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800">
                <span className="font-bold text-slate-400">{t('adminRosterStatusHeader')}:</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getProfileStaffStatus(selectedProfileStaff).color}`}>
                  ● {getProfileStaffStatus(selectedProfileStaff).text}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t('descriptionLabel')}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  {selectedProfileStaff.description || 'Жогорку квалификациялуу адис. Кардарлар менен иштөөдө чоң тажрыйбага ээ.'}
                </p>
              </div>

              {/* Education & Certificates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-blue-500" />
                    <span>{t('educationLabel')}</span>
                  </span>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 min-h-[60px] text-[11px] leading-snug">
                    {selectedProfileStaff.education || 'Кыргыз Мамлекеттик Медициналык Академиясы (КГМА)'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-500" />
                    <span>{t('certificatesLabel')}</span>
                  </span>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 min-h-[60px] text-[11px] leading-snug">
                    {selectedProfileStaff.certificates || 'Эл аралык квалификацияны жогорулатуу сертификаттары'}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Байланыш маалыматтары</span>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 space-y-2">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> Тел:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedProfileStaff.phone || '+996 700 123 456'}</strong>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> Email:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedProfileStaff.email || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* Working Hours & Scheduled Weekdays */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t('workingHoursLabel')}</span>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-500" /> Күнүмдүк иш убактысы:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{selectedProfileStaff.working_hours_start || '09:00'} - {selectedProfileStaff.working_hours_end || '18:00'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Иш күндөрү:</span>
                    <div className="flex flex-wrap gap-1">
                      {WEEKDAYS_OPTIONS.map(day => {
                        const works = selectedProfileStaff.working_days?.includes(day);
                        return (
                          <span 
                            key={day} 
                            className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              works 
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' 
                                : 'bg-slate-100 text-slate-350 dark:bg-slate-850'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Services list */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t('assignedServicesLabel')}</span>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 flex flex-wrap gap-1.5">
                  {!selectedProfileStaff.assigned_services || selectedProfileStaff.assigned_services.length === 0 ? (
                    <span className="text-slate-400 text-[10px] italic">Бул адис бардык кызматтарды көрсөтөт</span>
                  ) : (
                    selectedProfileStaff.assigned_services.map(srvId => {
                      const serviceObj = services.find(s => s.id === srvId);
                      return (
                        <span key={srvId} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-medium text-slate-700 dark:text-slate-300">
                          {serviceObj?.name || 'Кызмат'}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Footer action */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedProfileStaff(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-850 dark:hover:bg-slate-100 cursor-pointer"
              >
                Жабуу
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE & EDIT MODAL SHEET */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full overflow-hidden flex flex-col max-h-[90vh] ${activeSection === 'staff' ? 'max-w-3xl' : 'max-w-md'}`}>
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-tight">
                {modalType === 'create' ? t('adminAddNewRecordTitle') : t('adminEditRecordTitle')}{' '}
                {activeSection === 'appointments' ? t('crmAppointments') :
                 activeSection === 'customers' ? t('crmCustomers') :
                 activeSection === 'services' ? t('crmServices') :
                 t('crmStaff')}
              </h3>
              <button 
                onClick={closeModal}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable form container */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1 text-xs">
              
              {/* APPOINTMENT SPECIFIC FIELDSET */}
              {activeSection === 'appointments' && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminSelectCustomerLabel')}</label>
                    <select
                      value={aptCustomer}
                      onChange={(e) => setAptCustomer(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                      required
                    >
                      <option value="" disabled>{t('adminSelectCustomerPlaceholder')}</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminServiceLabel')}</label>
                      <select
                        value={aptService}
                        onChange={(e) => setAptService(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                        required
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminPractitionerLabel')}</label>
                      <select
                        value={aptStaff}
                        onChange={(e) => setAptStaff(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                        required
                      >
                        {staffList.map(st => (
                          <option key={st.id} value={st.id}>{st.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminDateLabel')}</label>
                      <input
                        type="date"
                        value={aptDate}
                        onChange={(e) => setAptDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminTimeSlotLabel')}</label>
                      <select
                        value={aptTime}
                        onChange={(e) => setAptTime(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                        required
                      >
                        {STANDARD_SLOTS.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {modalType === 'edit' && (
                    <div>
                      <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminStatusHeader')}</label>
                      <select
                        value={aptStatus}
                        onChange={(e: any) => setAptStatus(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                      >
                        <option value="pending">{t('adminAptStatusPending')}</option>
                        <option value="confirmed">{t('adminAptStatusConfirmed')}</option>
                        <option value="completed">{t('adminAptStatusCompleted')}</option>
                        <option value="cancelled">{t('adminAptStatusCancelled')}</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminSessionNotesLabel')}</label>
                    <textarea
                      value={aptNotes}
                      onChange={(e) => setAptNotes(e.target.value)}
                      placeholder={t('adminSessionNotesPlaceholder')}
                      rows={3}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* CUSTOMER SPECIFIC FIELDSET */}
              {activeSection === 'customers' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('fullNameLabel')} *</label>
                      <input
                        type="text"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder={t('bookNamePlaceholder')}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('phoneNumberHeader')} *</label>
                      <input
                        type="tel"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder={t('bookPhonePlaceholder')}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('adminEmailAddressHeader')}</label>
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('crmCustWhatsapp')}</label>
                      <input
                        type="tel"
                        value={custWhatsapp}
                        onChange={(e) => setCustWhatsapp(e.target.value)}
                        placeholder="+996 555 123 456"
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('crmCustGender')}</label>
                      <select
                        value={custGender}
                        onChange={(e) => setCustGender(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                      >
                        <option value="">-- {t('crmCustGender')} --</option>
                        <option value="male">{t('crmGenderMale')}</option>
                        <option value="female">{t('crmGenderFemale')}</option>
                        <option value="other">{t('crmGenderOther')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('crmCustDob')}</label>
                      <input
                        type="date"
                        value={custDob}
                        onChange={(e) => setCustDob(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('crmCustPrefLang')}</label>
                      <select
                        value={custPrefLang}
                        onChange={(e) => setCustPrefLang(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                      >
                        <option value="">-- {t('crmCustPrefLang')} --</option>
                        <option value="kg">{t('crmLangKg')}</option>
                        <option value="ru">{t('crmLangRu')}</option>
                        <option value="en">{t('crmLangEn')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('crmCustStatus')}</label>
                      <select
                        value={custStatus}
                        onChange={(e) => setCustStatus(e.target.value as 'active' | 'inactive')}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15 font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <option value="active">{t('crmStatusActive')}</option>
                        <option value="inactive">{t('crmStatusInactive')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('crmCustAddress')}</label>
                    <input
                      type="text"
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      placeholder="e.g. 123 Chuy Ave, Bishkek"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase block mb-1.5">{t('crmCustNotes')}</label>
                    <textarea
                      value={custNotes}
                      onChange={(e) => setCustNotes(e.target.value)}
                      placeholder="General comments..."
                      rows={2}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                    />
                  </div>
                </div>
              )}

              {/* SERVICE SPECIFIC FIELDSET */}
              {activeSection === 'services' && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminTreatmentNameLabel')}</label>
                    <input
                      type="text"
                      value={srvName}
                      onChange={(e) => setSrvName(e.target.value)}
                      placeholder="e.g. Ultrasonic Scaling"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminCategoryGroupNameLabel')}</label>
                    <input
                      type="text"
                      value={srvCategory}
                      onChange={(e) => setSrvCategory(e.target.value)}
                      placeholder="e.g. Hygiene, Preventive, Aesthetic"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminDurationMinutesLabel')}</label>
                      <input
                        type="number"
                        value={srvDuration}
                        onChange={(e) => setSrvDuration(Number(e.target.value))}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminPriceUsdLabel')}</label>
                      <input
                        type="number"
                        value={srvPrice}
                        onChange={(e) => setSrvPrice(Number(e.target.value))}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-extrabold text-blue-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 uppercase block mb-1.5">{t('adminTreatmentDescriptionLabel')}</label>
                    <textarea
                      value={srvDesc}
                      onChange={(e) => setSrvDesc(e.target.value)}
                      placeholder={t('adminTreatmentDescriptionPlaceholder')}
                      rows={3}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="srvActive"
                      checked={srvActive}
                      onChange={(e) => setSrvActive(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="srvActive" className="font-bold text-slate-700 dark:text-slate-350">{t('adminMakeServiceActiveLabel')}</label>
                  </div>
                </div>
              )}

              {/* STAFF ROSTER - 2 COLUMN COMPREHENSIVE FORM */}
              {activeSection === 'staff' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: General & Bio Details */}
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 flex items-center gap-2">
                      <Info className="w-4 h-4 text-rose-500" />
                      <strong className="text-[10px] text-slate-500 uppercase tracking-widest">Адистин жалпы маалыматтары</strong>
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">{t('adminPractitionerNameLabel')} *</label>
                      <input
                        type="text"
                        value={stfName}
                        onChange={(e) => setStfName(e.target.value)}
                        placeholder="Мисалы: Айгүл Каримова"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">{t('adminPractitionerTitleLabel')} *</label>
                      <input
                        type="text"
                        value={stfSpec}
                        onChange={(e) => setStfSpec(e.target.value)}
                        placeholder="Мисалы: Терапевт-Косметолог"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-extrabold text-slate-400 uppercase block mb-1">Тажрыйбасы (жыл)</label>
                        <input
                          type="number"
                          value={stfExperience}
                          onChange={(e) => setStfExperience(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-850 dark:text-slate-150"
                          required
                          min={0}
                        />
                      </div>
                      <div>
                        <label className="font-extrabold text-slate-400 uppercase block mb-1">Рейтинг (★)</label>
                        <input
                          type="number"
                          step="0.1"
                          max="5.0"
                          min="1.0"
                          value={stfRating}
                          onChange={(e) => setStfRating(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">{t('adminPractitionerEmailLabel')}</label>
                      <input
                        type="email"
                        value={stfEmail}
                        onChange={(e) => setStfEmail(e.target.value)}
                        placeholder="karimova@clinic.v1"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">Байланыш телефону</label>
                      <input
                        type="tel"
                        value={stfPhone}
                        onChange={(e) => setStfPhone(e.target.value)}
                        placeholder="+996 (700) 123-456"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">{t('adminAvatarImageUrlLabel')}</label>
                      <input
                        type="url"
                        value={stfAvatar}
                        onChange={(e) => setStfAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-mono text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">{t('educationLabel')}</label>
                      <input
                        type="text"
                        value={stfEducation}
                        onChange={(e) => setStfEducation(e.target.value)}
                        placeholder="Мисалы: КГМА, Медициналык факультет"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">{t('certificatesLabel')}</label>
                      <input
                        type="text"
                        value={stfCertificates}
                        onChange={(e) => setStfCertificates(e.target.value)}
                        placeholder="Мисалы: CIDESCO эл аралык диплом"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Right Column: Availability & Service Skills */}
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <strong className="text-[10px] text-slate-500 uppercase tracking-widest">Иш убактысы жана Кызматтары</strong>
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">{t('descriptionLabel')}</label>
                      <textarea
                        value={stfDescription}
                        onChange={(e) => setStfDescription(e.target.value)}
                        placeholder="Адис жөнүндө кыскача маалымат..."
                        rows={2}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                      />
                    </div>

                    {/* Working Days Checkboxes */}
                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1.5">Иштөө күндөрү</label>
                      <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-800">
                        {WEEKDAYS_OPTIONS.map(day => {
                          const isChecked = stfWorkingDays.includes(day);
                          return (
                            <div 
                              key={day}
                              onClick={() => handleToggleWorkingDay(day)}
                              className={`p-2 rounded-lg border text-center cursor-pointer font-bold uppercase transition-all text-[8px] sm:text-[9px] ${
                                isChecked 
                                  ? 'bg-blue-600 text-white border-blue-600' 
                                  : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                              }`}
                            >
                              {day.slice(0, 3)}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-extrabold text-slate-400 uppercase block mb-1">Жумуштун башталышы</label>
                        <input
                          type="time"
                          value={stfWorkingHoursStart}
                          onChange={(e) => setStfWorkingHoursStart(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-extrabold text-slate-400 uppercase block mb-1">Жумуштун аякташы</label>
                        <input
                          type="time"
                          value={stfWorkingHoursEnd}
                          onChange={(e) => setStfWorkingHoursEnd(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                          required
                        />
                      </div>
                    </div>

                    {/* Vacation days */}
                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1">Эс алуу / Отпуск күндөрү</label>
                      <input
                        type="text"
                        value={stfVacationDays}
                        onChange={(e) => setStfVacationDays(e.target.value)}
                        placeholder="Мисалы: 2026-06-30, 2026-07-05 (кош чекит менен)"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-semibold"
                      />
                    </div>

                    {/* Assigned services */}
                    <div>
                      <label className="font-extrabold text-slate-400 uppercase block mb-1.5">{t('assignedServicesLabel')}</label>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-800 max-h-[140px] overflow-y-auto space-y-2 pr-1">
                        {services.map(srv => {
                          const isAssigned = stfAssignedServices.includes(srv.id);
                          return (
                            <div 
                              key={srv.id}
                              onClick={() => handleToggleAssignedService(srv.id)}
                              className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-center ${
                                isAssigned 
                                  ? 'bg-emerald-50 border-emerald-350 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-350 dark:border-emerald-900' 
                                  : 'bg-white border-slate-150 text-slate-600 dark:bg-slate-900 dark:border-slate-800'
                              }`}
                            >
                              <span className="text-[10px] font-bold">{srv.name}</span>
                              <span className="text-[9px] opacity-75 font-mono">${srv.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Deactivate checkbox */}
                    <div className="flex items-center gap-2.5 bg-rose-50/30 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-100/50 dark:border-rose-900/30">
                      <input
                        type="checkbox"
                        id="stfActive"
                        checked={stfActive}
                        onChange={(e) => setStfActive(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <label htmlFor="stfActive" className="font-bold text-slate-700 dark:text-slate-300">Адистин иштөө статусу (ОН ДУТИ)</label>
                    </div>

                  </div>
                </div>
              )}

              {/* Modal footer actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-150 dark:border-slate-800 justify-end text-xs mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t('adminCancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {modalType === 'create' ? t('adminSaveRecordBtn') : t('adminSaveChangesBtn')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CRM CLIENT PROFILE SLIDE-OVER DRAWER (AESTHETIC, MULTI-TAB, DEEP INTEGRATION)
          ========================================================================= */}
      {selectedCustomerId && (() => {
        const selectedCust = customers.find(c => c.id === selectedCustomerId);
        if (!selectedCust) return null;

        const stats = getCustomerStats(selectedCust.id);
        const custApts = appointments.filter(a => a.customer_id === selectedCust.id);
        const sortedApts = [...custApts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const custNotesList = clientNotes.filter(n => n.customer_id === selectedCust.id);
        const custRemindersList = reminders.filter(r => r.customer_id === selectedCust.id);

        return (
          <div className="fixed inset-0 z-55 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
              {/* Overlay Backdrop */}
              <div 
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
                onClick={() => setSelectedCustomerId(null)}
              ></div>

              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="pointer-events-auto w-screen max-w-2xl transform transition-transform duration-500 ease-in-out">
                  <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-150 dark:border-slate-800">
                    
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/25">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                            {selectedCust.name.charAt(0)}
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{selectedCust.name}</span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                                selectedCust.status === 'active' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/45' 
                                  : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {selectedCust.status === 'active' ? t('crmStatusActive') : t('crmStatusInactive')}
                              </span>
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              Client since {selectedCust.created_at ? selectedCust.created_at.split('T')[0] : 'N/A'} • Preferred Language: {selectedCust.preferred_language?.toUpperCase() || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedCustomerId(null)}
                          className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Drawer Content Space (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      
                      {/* --- TABS SELECTOR --- */}
                      <div className="flex border-b border-slate-150 dark:border-slate-800 gap-1 p-1 bg-slate-100/60 dark:bg-slate-950/50 rounded-lg">
                        {[
                          { id: 'profile', label: 'Profile Details', icon: User },
                          { id: 'visits', label: `Visits (${custApts.length})`, icon: History },
                          { id: 'notes', label: `Notes (${custNotesList.length})`, icon: FileText },
                          { id: 'reminders', label: `Reminders (${custRemindersList.filter(r => r.status === 'pending').length})`, icon: Bell }
                        ].map(tab => {
                          const IconComp = tab.icon;
                          const isSelected = activeCrmTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveCrmTab(tab.id as any)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* --- TAB 1: PROFILE DETAILS & INTEL --- */}
                      {activeCrmTab === 'profile' && (
                        <div className="space-y-6 animate-fadeIn">
                          {/* Contact & Demographics Card */}
                          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-150 dark:border-slate-850/60 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Phone Number</span>
                              <a href={`tel:${selectedCust.phone}`} className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:underline block font-mono">
                                📞 {selectedCust.phone}
                              </a>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">WhatsApp Number</span>
                              {selectedCust.whatsapp ? (
                                <a href={`https://wa.me/${selectedCust.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline block font-mono">
                                  💬 {selectedCust.whatsapp}
                                </a>
                              ) : (
                                <span className="text-sm font-medium text-slate-400 dark:text-slate-600">N/A</span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Email Address</span>
                              {selectedCust.email ? (
                                <a href={`mailto:${selectedCust.email}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline block font-mono">
                                  📧 {selectedCust.email}
                                </a>
                              ) : (
                                <span className="text-sm font-medium text-slate-400 dark:text-slate-600">N/A</span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Gender / DOB</span>
                              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {selectedCust.gender ? (selectedCust.gender === 'male' ? 'Male' : selectedCust.gender === 'female' ? 'Female' : 'Other') : 'N/A'}
                                {selectedCust.dob ? ` • ${selectedCust.dob}` : ''}
                              </div>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Home Address</span>
                              <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span>{selectedCust.address || 'No Address Provided'}</span>
                              </div>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">General Notes</span>
                              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850 italic">
                                {selectedCust.notes || 'No description notes added.'}
                              </p>
                            </div>
                          </div>

                          {/* Historical Performance Analytics Grid */}
                          <div>
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">CRM Analytics Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs">
                                <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase">Total Bookings</div>
                                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</div>
                              </div>
                              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs">
                                <div className="text-emerald-600 dark:text-emerald-450 text-[10px] font-bold uppercase">LTV (Total Spent)</div>
                                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${stats.totalSpent}</div>
                              </div>
                              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs">
                                <div className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">Completed Vis.</div>
                                <div className="text-xl font-black text-blue-600 dark:text-blue-450 mt-1">{stats.completed}</div>
                              </div>
                              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs col-span-2 md:col-span-1">
                                <div className="text-rose-500 text-[10px] font-bold uppercase">Cancelled</div>
                                <div className="text-base font-black text-rose-600 dark:text-rose-450 mt-1">{stats.cancelled}</div>
                              </div>
                              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs col-span-2">
                                <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase">Favorite Treatment</div>
                                <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-1.5 truncate text-blue-600 dark:text-blue-400">
                                  {stats.favService}
                                </div>
                              </div>
                              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs col-span-2">
                                <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase">Favorite Specialist</div>
                                <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-1.5 truncate text-rose-500">
                                  {stats.favStaff}
                                </div>
                              </div>
                              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs">
                                <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase">Last Visit</div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 font-mono">{stats.lastVisit}</div>
                              </div>
                              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs col-span-2 md:col-span-1">
                                <div className="text-amber-600 dark:text-amber-450 text-[10px] font-bold uppercase">Next Appointment</div>
                                <div className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 mt-2 font-mono">{stats.nextVisit}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* --- TAB 2: VISIT HISTORY TIMELINE --- */}
                      {activeCrmTab === 'visits' && (
                        <div className="space-y-4 animate-fadeIn">
                          {sortedApts.length === 0 ? (
                            <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                              <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Visits Recorded</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">This client has no past or future bookings.</p>
                            </div>
                          ) : (
                            <div className="relative border-l border-slate-150 dark:border-slate-800 ml-4 space-y-6 py-2">
                              {sortedApts.map(apt => (
                                <div key={apt.id} className="relative pl-6">
                                  {/* Timeline dot */}
                                  <span className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                                    apt.status === 'completed' ? 'bg-emerald-500' :
                                    apt.status === 'cancelled' ? 'bg-rose-500' :
                                    'bg-blue-500'
                                  }`}></span>

                                  <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs">
                                    <div className="flex justify-between items-start flex-wrap gap-1">
                                      <div>
                                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded">
                                          {apt.service?.name}
                                        </span>
                                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-2">
                                          Specialist: <span className="text-slate-600 dark:text-slate-400">{apt.staff?.name || 'Unassigned'}</span>
                                        </h4>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-xs font-black text-slate-900 dark:text-white block">${apt.service?.price}</span>
                                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border uppercase mt-1 inline-block ${
                                          apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/10 dark:text-emerald-450 dark:border-emerald-900' :
                                          apt.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/10 dark:text-rose-450' :
                                          'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/10'
                                        }`}>
                                          {apt.status}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Date slot */}
                                    <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-900 text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                                      <div>📅 {apt.date}</div>
                                      <div>🕒 {apt.time} ({apt.service?.duration_minutes} min)</div>
                                    </div>

                                    {apt.notes && (
                                      <div className="mt-2.5 bg-slate-50 dark:bg-slate-900 p-2 rounded text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-2 border-slate-300 dark:border-slate-700">
                                        "{apt.notes}"
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* --- TAB 3: MEDICAL / CLIENT NOTES --- */}
                      {activeCrmTab === 'notes' && (
                        <div className="space-y-4 animate-fadeIn">
                          {/* Note Form */}
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.currentTarget;
                              const textInput = form.elements.namedItem('noteContent') as HTMLTextAreaElement;
                              handleAddClientNote(selectedCust.id, textInput.value);
                              textInput.value = '';
                            }}
                            className="space-y-2 bg-slate-50/50 dark:bg-slate-950/10 p-4 rounded-xl border border-slate-150 dark:border-slate-850"
                          >
                            <label className="text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Add Medical / Client Note</label>
                            <textarea
                              name="noteContent"
                              placeholder="Write diagnostic observations, progress, allergies, skin types or other admin medical remarks..."
                              rows={3}
                              className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
                              required
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer shadow-xs ml-auto block"
                            >
                              Save Note
                            </button>
                          </form>

                          {/* Notes list */}
                          <div className="space-y-3.5 mt-4">
                            {custNotesList.length === 0 ? (
                              <div className="text-center py-10 text-slate-400 text-xs">
                                No administrative notes recorded for this client.
                              </div>
                            ) : (
                              [...custNotesList].sort((a,b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()).map(n => (
                                <div key={n.id} className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-xs relative group">
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                        👤 {n.author || 'Administrator'}
                                      </span>
                                      <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-mono font-bold px-1.5 py-0.2 rounded">
                                        {n.created_at ? n.created_at.split('T')[0] : 'N/A'}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteClientNote(n.id)}
                                      className="p-1 text-slate-300 hover:text-rose-500 cursor-pointer rounded hover:bg-slate-50 dark:hover:bg-slate-900"
                                      title="Delete note"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {n.content}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* --- TAB 4: REMINDERS CREATOR & LIST --- */}
                      {activeCrmTab === 'reminders' && (
                        <div className="space-y-4 animate-fadeIn">
                          {/* Add Reminder form */}
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.currentTarget;
                              const titleInput = form.elements.namedItem('remTitle') as HTMLInputElement;
                              const dateInput = form.elements.namedItem('remDate') as HTMLInputElement;
                              handleAddReminder(selectedCust.id, titleInput.value, dateInput.value);
                              titleInput.value = '';
                              dateInput.value = '';
                            }}
                            className="bg-slate-50/50 dark:bg-slate-950/10 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3"
                          >
                            <label className="text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Schedule Follow-up Reminder</label>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Callback Action</span>
                                <input
                                  type="text"
                                  name="remTitle"
                                  placeholder="e.g. Call for 6-month checkup"
                                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-xs"
                                  required
                                />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Due Date</span>
                                <input
                                  type="date"
                                  name="remDate"
                                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-xs font-mono"
                                  required
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer shadow-xs ml-auto block"
                            >
                              Create Reminder
                            </button>
                          </form>

                          {/* Reminders List */}
                          <div className="space-y-3 mt-4">
                            {custRemindersList.length === 0 ? (
                              <div className="text-center py-10 text-slate-400 text-xs">
                                No reminders scheduled for this client.
                              </div>
                            ) : (
                              [...custRemindersList].sort((a,b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).map(rem => {
                                const isOverdue = new Date(rem.due_date).getTime() < new Date().setHours(0,0,0,0) && rem.status === 'pending';
                                const isToday = rem.due_date === new Date().toISOString().split('T')[0] && rem.status === 'pending';
                                
                                return (
                                  <div 
                                    key={rem.id} 
                                    className={`p-4 rounded-xl border transition-all shadow-xs relative flex items-start justify-between gap-2 ${
                                      rem.status === 'completed' 
                                        ? 'bg-slate-50/50 border-slate-150 opacity-60 dark:bg-slate-950/10 dark:border-slate-850' 
                                        : 'bg-white border-slate-150 dark:bg-slate-950 dark:border-slate-850'
                                    }`}
                                  >
                                    <div className="space-y-1.5 flex-1 pr-4">
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="checkbox"
                                          checked={rem.status === 'completed'}
                                          onChange={() => handleToggleReminderStatus(rem.id, rem.status)}
                                          className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 shrink-0"
                                        />
                                        <p className={`text-xs font-bold leading-normal ${
                                          rem.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                                        }`}>
                                          {rem.title}
                                        </p>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 pl-5">
                                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                          rem.status === 'completed' ? 'bg-slate-100 text-slate-400' :
                                          isOverdue ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450' :
                                          isToday ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' :
                                          'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                                        }`}>
                                          Due: {rem.due_date} {isOverdue && '(Overdue)'} {isToday && '(Today)'}
                                        </span>
                                        {rem.status === 'completed' && (
                                          <span className="text-[9px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/10 dark:text-emerald-450 font-extrabold px-1.5 py-0.2 rounded">
                                            Completed
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => handleDeleteReminder(rem.id)}
                                      className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                                      title="Delete reminder"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
