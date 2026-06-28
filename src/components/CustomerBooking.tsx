import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  User, 
  Clock, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Phone, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Star,
  BookOpen,
  Briefcase,
  Award,
  Globe,
  Lock
} from 'lucide-react';
import { Service, Staff, Appointment } from '../types';
import { api } from '../lib/supabase';
import { Language, translate } from '../lib/translations';

// Define standard operating hours/slots for appointment booking as backup
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

interface CustomerBookingProps {
  services: Service[];
  staffList: Staff[];
  onBookingSuccess: () => void;
  lang: Language;
  initialStaffId?: string | null;
  onClearPreselectedStaff?: () => void;
  initialServiceId?: string | null;
  onClearPreselectedService?: () => void;
}

export default function CustomerBooking({ 
  services, 
  staffList, 
  onBookingSuccess, 
  lang,
  initialStaffId,
  onClearPreselectedStaff,
  initialServiceId,
  onClearPreselectedService
}: CustomerBookingProps) {
  const t = (key: any) => translate(key, lang);

  // Views: 'landing' -> 'booking' (wizard)
  const [view, setView] = useState<'landing' | 'wizard'>('landing');
  const [step, setStep] = useState<number>(1); // 1: Service, 2: Specialist, 3: Date, 4: Time, 5: Customer Info, 6: Confirm
  
  // Selection States
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Booked appointments to filter availability
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successApt, setSuccessApt] = useState<Appointment | null>(null);

  // Set default date when specialist changes
  useEffect(() => {
    if (selectedStaff) {
      const workingDates = getNextWorkingDates(selectedStaff);
      if (workingDates.length > 0) {
        setSelectedDate(workingDates[0].dateStr);
      } else {
        setSelectedDate('');
      }
    } else {
      setSelectedDate('');
    }
    setSelectedTime('');
  }, [selectedStaff]);

  // Fetch current appointments to compute real-time slot lockouts
  useEffect(() => {
    const loadApts = async () => {
      try {
        const data = await api.getAppointments();
        setBookedAppointments(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadApts();
  }, [step]);

  // Helper to check specialist status (Available today / Busy today)
  const getSpecialistStatus = (member: Staff) => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const todayName = weekdays[today.getDay()];
    const todayStr = today.toISOString().split('T')[0];
    
    const worksToday = member.working_days?.includes(todayName);
    const onVacation = member.vacation_days?.includes(todayStr);
    
    if (worksToday && !onVacation) {
      return { 
        text: t('statusAvailableToday') || 'Available today', 
        color: 'text-emerald-600 bg-emerald-50 border-emerald-150 dark:bg-emerald-950/30 dark:text-emerald-400' 
      };
    }
    return { 
      text: t('statusBusyToday') || 'Busy today', 
      color: 'text-amber-600 bg-amber-50 border-amber-150 dark:bg-amber-950/30 dark:text-amber-400' 
    };
  };

  // Helper to generate selectable working dates for a specialist
  const getNextWorkingDates = (member: Staff) => {
    const dates = [];
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Scan next 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = weekdays[d.getDay()];
      
      const worksThisDay = member.working_days?.includes(dayName);
      const onVacation = member.vacation_days?.includes(dateStr);
      
      if (worksThisDay && !onVacation) {
        dates.push({
          dateStr,
          dayLabel: d.toLocaleDateString(lang === 'kg' ? 'ky-KG' : lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' }),
          weekdayLabel: d.toLocaleDateString(lang === 'kg' ? 'ky-KG' : lang === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' })
        });
      }
    }
    return dates;
  };

  // Generate and filter available time slots
  useEffect(() => {
    if (!selectedDate || !selectedStaff) {
      setAvailableSlots([]);
      return;
    }

    // Determine working hours
    const start = selectedStaff.working_hours_start || '09:00';
    const end = selectedStaff.working_hours_end || '18:00';
    
    const startHour = parseInt(start.split(':')[0], 10) || 9;
    const endHour = parseInt(end.split(':')[0], 10) || 18;
    
    const baseSlots = [];
    for (let h = startHour; h < endHour; h++) {
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const padHour = hour12 < 10 ? `0${hour12}` : `${hour12}`;
      baseSlots.push(`${padHour}:00 ${ampm}`);
    }

    // Filter slots already booked for this specialist on selectedDate
    const bookedOnDate = bookedAppointments
      .filter(apt => apt.date === selectedDate && apt.staff_id === selectedStaff.id && apt.status !== 'cancelled')
      .map(apt => apt.time);

    const activeAvailable = baseSlots.filter(slot => !bookedOnDate.includes(slot));
    setAvailableSlots(activeAvailable);
  }, [selectedDate, selectedStaff, bookedAppointments]);

  // Pre-select specialist and service if initialStaffId or initialServiceId is provided
  useEffect(() => {
    let serviceFound = false;
    let staffFound = false;

    if (initialServiceId && services.length > 0) {
      const foundSrv = services.find(s => s.id === initialServiceId);
      if (foundSrv) {
        setSelectedService(foundSrv);
        serviceFound = true;
      }
    }

    if (initialStaffId && staffList.length > 0) {
      const foundStaff = staffList.find(s => s.id === initialStaffId);
      if (foundStaff) {
        setSelectedStaff(foundStaff);
        staffFound = true;
      }
    }

    if (serviceFound || staffFound) {
      setView('wizard');
      if (serviceFound && staffFound) {
        setStep(3); // Go to date selection
      } else if (serviceFound) {
        setStep(2); // Go to specialist selection
      } else {
        setStep(1); // Go to service selection
      }
    }
  }, [initialStaffId, initialServiceId, staffList, services]);

  const handleStartBooking = () => {
    setView('wizard');
    setStep(1);
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedStaff) return;
    if (step === 3 && !selectedDate) return;
    if (step === 4 && !selectedTime) return;
    if (step === 5 && (!name.trim() || !phone.trim())) return;
    
    if (step === 1 && initialStaffId) {
      setStep(3); // skip step 2
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step === 3 && initialStaffId) {
      setStep(1); // skip step 2 going backwards
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmitBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !phone.trim() || !selectedService || !selectedStaff || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      const newApt = await api.createAppointment({
        customer_id: '', 
        customer_name: name,
        customer_phone: phone,
        service_id: selectedService.id,
        staff_id: selectedStaff.id,
        date: selectedDate,
        time: selectedTime,
        notes: notes
      });

      setSuccessApt(newApt);
      onBookingSuccess(); // Sync master database state
    } catch (error) {
      alert(t('bookErrorBookingAlert'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setView('landing');
    setStep(1);
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedDate('');
    setSelectedTime('');
    setName('');
    setPhone('');
    setNotes('');
    setSuccessApt(null);
    if (onClearPreselectedStaff) {
      onClearPreselectedStaff();
    }
    if (onClearPreselectedService) {
      onClearPreselectedService();
    }
  };

  // Only show specialists assigned to provide the selected service
  const filteredSpecialists = staffList.filter(st => {
    if (!st.is_active) return false;
    if (!st.assigned_services || st.assigned_services.length === 0) return true;
    return st.assigned_services.includes(selectedService?.id || '');
  });

  return (
    <div id="customer-booking-portal" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[620px] justify-between transition-colors">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-6 text-white relative">
        <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase">
          {t('bookClientPortal')}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('bookOnlineSchedSys')}</span>
        </div>
        <h3 className="text-xl font-bold mt-1 tracking-tight text-white">{t('bookEliteServiceBooking')}</h3>
        <p className="text-xs text-slate-200 mt-1">{t('bookEliteServiceBookingDesc')}</p>
      </div>

      {/* PORTAL VIEWS */}
      <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-950/10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* 1. LANDING VIEW */}
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center py-8 space-y-6 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shadow-inner relative">
                <CalendarIcon className="w-7 h-7" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
              
              <div className="space-y-2 max-w-sm">
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{t('bookNeedToBookAptTitle')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('bookNeedToBookAptDesc')}
                </p>
              </div>

              <div className="space-y-3 w-full max-w-xs">
                <button
                  onClick={handleStartBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{t('bookAptNowBtn')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('bookRealtimeDbLock')}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. WIZARD VIEW */}
          {view === 'wizard' && !successApt && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Stepper bar (6 detailed stages, or 5 if specialist is preselected) */}
              <div className={`mb-6 grid ${initialStaffId ? 'grid-cols-5' : 'grid-cols-6'} gap-1 text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-tight text-center`}>
                <div className={`pb-1 border-b-2 transition-all ${step >= 1 ? 'border-blue-600 text-blue-600 font-black' : 'border-slate-200 dark:border-slate-800'}`}>{t('bookStep1')}</div>
                {!initialStaffId && (
                  <div className={`pb-1 border-b-2 transition-all ${step >= 2 ? 'border-blue-600 text-blue-600 font-black' : 'border-slate-200 dark:border-slate-800'}`}>{t('bookStep2')}</div>
                )}
                <div className={`pb-1 border-b-2 transition-all ${step >= 3 ? 'border-blue-600 text-blue-600 font-black' : 'border-slate-200 dark:border-slate-800'}`}>{t('bookStep3')}</div>
                <div className={`pb-1 border-b-2 transition-all ${step >= 4 ? 'border-blue-600 text-blue-600 font-black' : 'border-slate-200 dark:border-slate-800'}`}>{t('bookStep4')}</div>
                <div className={`pb-1 border-b-2 transition-all ${step >= 5 ? 'border-blue-600 text-blue-600 font-black' : 'border-slate-200 dark:border-slate-800'}`}>{t('bookStep5')}</div>
                <div className={`pb-1 border-b-2 transition-all ${step >= 6 ? 'border-blue-600 text-blue-600 font-black' : 'border-slate-200 dark:border-slate-800'}`}>{t('bookStep6')}</div>
              </div>

              {/* Wizard step contents */}
              <div className="flex-1 min-h-[340px] flex flex-col justify-start">
                
                {/* STEP 1: SELECT SERVICE */}
                {step === 1 && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('bookSelectTreatmentSrvTitle')}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('bookSelectTreatmentSrvDesc')}</p>
                    </div>

                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {services.filter(s => s.is_active).map(srv => {
                        const isSelected = selectedService?.id === srv.id;
                        return (
                          <div
                            key={srv.id}
                            onClick={() => setSelectedService(srv)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                              isSelected 
                                ? "bg-blue-50/60 border-2 border-blue-600 dark:bg-blue-950/20 dark:border-blue-500 shadow-sm" 
                                : "bg-white border-slate-200 hover:border-blue-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
                            }`}
                          >
                            <div className="space-y-0.5 max-w-[70%]">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{srv.name}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block line-clamp-1">{srv.description || t('professionalConsultation')}</span>
                              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                                {srv.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400">${srv.price}</div>
                              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">🕒 {srv.duration_minutes} min</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: SELECT SPECIALIST */}
                {step === 2 && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('bookChooseSpecialistTitle')}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('bookChooseSpecialistDesc')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-[280px] overflow-y-auto pr-1">
                      {filteredSpecialists.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          {t('noData')}
                        </div>
                      ) : (
                        filteredSpecialists.map(member => {
                          const isSelected = selectedStaff?.id === member.id;
                          const status = getSpecialistStatus(member);
                          return (
                            <div
                              key={member.id}
                              onClick={() => setSelectedStaff(member)}
                              className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-3 relative ${
                                isSelected 
                                  ? "bg-blue-50/60 border-2 border-blue-600 dark:bg-blue-950/20 dark:border-blue-500 shadow-md ring-1 ring-blue-500" 
                                  : "bg-white border-slate-200 hover:border-blue-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
                              }`}
                            >
                              {/* Top Section */}
                              <div className="flex gap-3">
                                {member.avatar_url ? (
                                  <img 
                                    src={member.avatar_url} 
                                    alt={member.name} 
                                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400 shrink-0">
                                    {member.name.charAt(0)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{member.name}</span>
                                    <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                                      <Star className="w-3 h-3 fill-amber-500" />
                                      <span className="text-[10px] font-extrabold">{member.rating || '5.0'}</span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{member.specialization}</span>
                                  
                                  {/* Experience badge */}
                                  <span className="text-[9px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                                    {member.experience_years || 5} {t('experienceYearsShort')} {t('experienceYears')}
                                  </span>
                                </div>
                              </div>

                              {/* Specialist brief description */}
                              {member.description && (
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-2">
                                  {member.description}
                                </p>
                              )}

                              {/* Languages, Status & Working hours footer */}
                              <div className="flex flex-wrap justify-between items-center gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                                <div className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  <span>{t('languagesSpoken')}: <strong>{t('languagesSpokenList')}</strong></span>
                                </div>

                                <div className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${status.color}`}>
                                  ● {status.text}
                                </div>
                              </div>

                              {/* Selected Tick */}
                              {isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: SELECT DATE */}
                {step === 3 && selectedStaff && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('bookPickDateLabel')}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('bookScheduleAptTimeDesc')}</p>
                    </div>

                    <div className="space-y-4">
                      {/* Selected Specialist Info */}
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        {selectedStaff.avatar_url ? (
                          <img 
                            src={selectedStaff.avatar_url} 
                            alt={selectedStaff.name} 
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">
                            {selectedStaff.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{selectedStaff.name}</span>
                          <span className="text-[9px] text-slate-400 block">{t('workingHoursLabel')}: {selectedStaff.working_hours_start} - {selectedStaff.working_hours_end}</span>
                        </div>
                      </div>

                      {/* Display working dates as elegant cards */}
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-2">{t('selectDateBtn')}</label>
                        <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
                          {getNextWorkingDates(selectedStaff).map(d => {
                            const isSelected = selectedDate === d.dateStr;
                            return (
                              <div
                                key={d.dateStr}
                                onClick={() => setSelectedDate(d.dateStr)}
                                className={`p-3 rounded-xl border text-center cursor-pointer transition-all flex flex-col justify-center items-center gap-0.5 ${
                                  isSelected 
                                    ? "bg-blue-600 text-white border-blue-600 font-bold shadow-md" 
                                    : "bg-white border-slate-200 hover:border-blue-200 dark:bg-slate-900 dark:border-slate-800"
                                }`}
                              >
                                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-85">{d.weekdayLabel}</span>
                                <span className="text-sm font-black block leading-none my-0.5">{d.dayLabel.split(' ')[0]}</span>
                                <span className="text-[9px] block opacity-75">{d.dayLabel.split(' ')[1]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: SELECT AVAILABLE TIME */}
                {step === 4 && selectedStaff && selectedDate && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('bookScheduleAptTimeTitle')}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('bookScheduleAptTimeDesc')}</p>
                    </div>

                    <div className="space-y-4">
                      {/* Header overview details */}
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                        <div>
                          <strong>{t('bookSelectedStaff')}:</strong> <span>{selectedStaff.name}</span>
                        </div>
                        <div>
                          <strong>{t('bookSelectedDate')}:</strong> <span>{selectedDate}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-2">
                          {t('bookAvailableSlotsLabel')} ({availableSlots.length})
                        </label>
                        {availableSlots.length === 0 ? (
                          <div className="p-8 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 text-center text-xs">
                            {t('bookNoSlotsAvailable').replace('{selectedStaff?.name}', selectedStaff.name)}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                            {availableSlots.map(time => {
                              const isSelected = selectedTime === time;
                              return (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => setSelectedTime(time)}
                                  className={`p-3 rounded-xl text-[10px] font-bold tracking-tight transition-all border cursor-pointer ${
                                    isSelected 
                                      ? "bg-blue-600 text-white border-blue-600 font-extrabold shadow-md" 
                                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: ENTER CUSTOMER INFO */}
                {step === 5 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('bookCompleteBookingTitle')}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('bookCompleteBookingDesc')}</p>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">{t('bookFullNameLabel')} *</label>
                        <input
                          type="text"
                          required
                          placeholder={t('bookNamePlaceholder')}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">{t('bookWhatsAppPhoneLabel')} *</label>
                        <input
                          type="tel"
                          required
                          placeholder={t('bookPhonePlaceholder')}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">{t('bookSpecialNotesLabel')}</label>
                        <textarea
                          placeholder={t('bookSpecialNotesPlaceholder')}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: CONFIRM BOOKING */}
                {step === 6 && selectedService && selectedStaff && selectedDate && selectedTime && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('confirmBookingTitle')}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('bookCompleteBookingDesc')}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-slate-900 text-white p-3.5 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{t('bookSelectedService')}</span>
                          <strong className="text-xs text-white block">{selectedService.name}</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-extrabold block text-blue-400">${selectedService.price}</span>
                          <span className="text-[9px] text-slate-400 block font-mono">🕒 {selectedService.duration_minutes} min</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="font-bold text-slate-400">{t('bookSelectedStaff')}:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStaff.name} ({selectedStaff.specialization})</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="font-bold text-slate-400">{t('bookSelectedDate')}:</span>
                          <span className="font-semibold text-slate-850 dark:text-slate-150">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="font-bold text-slate-400">{t('bookSelectedTime')}:</span>
                          <span className="font-semibold text-slate-850 dark:text-slate-150">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="font-bold text-slate-400">{t('bookFullNameLabel')}:</span>
                          <span className="font-semibold text-slate-850 dark:text-slate-150 truncate max-w-[200px]">{name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-400">{t('bookWhatsAppPhoneLabel')}:</span>
                          <span className="font-semibold text-slate-850 dark:text-slate-150 font-mono">{phone}</span>
                        </div>
                      </div>
                    </div>

                    {notes && (
                      <div className="p-3 bg-blue-50/40 dark:bg-slate-900/50 border border-blue-100/60 dark:border-slate-800/60 rounded-xl">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{t('bookSpecialNotesLabel')}</span>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 italic leading-relaxed">"{notes}"</p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Wizard navigation footer */}
              <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-150 dark:border-slate-800">
                <button
                  type="button"
                  onClick={step === 1 ? handleReset : handlePrevStep}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('bookBackBtn')}</span>
                </button>

                {step < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={
                      (step === 1 && !selectedService) ||
                      (step === 2 && !selectedStaff) ||
                      (step === 3 && !selectedDate) ||
                      (step === 4 && !selectedTime) ||
                      (step === 5 && (!name.trim() || !phone.trim()))
                    }
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>{t('bookNextBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmitBooking()}
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('bookSavingStatus')}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t('confirmBookingBtn')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* 3. SUCCESS SCREEN WITH WHATSAPP CONFIRMATION MOCK */}
          {successApt && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-5"
            >
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{t('bookAptSecuredSuccessTitle')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('bookAptSecuredSuccessDesc')}</p>
              </div>

              {/* WhatsApp confirmation preview block */}
              <div className="bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 p-4 rounded-xl text-left max-w-sm mx-auto space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                  <div className="p-1 bg-emerald-500 text-white rounded">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide block">{t('bookWhatsAppDispatchSim')}</span>
                    <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-mono">{t('bookDispatchedTo')} {successApt.customer?.phone || phone}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans space-y-1">
                  <p><strong>{t('bookConfirmedNoticeTitle')}</strong></p>
                  <p>{t('bookConfirmedNoticeText1')} <strong>{successApt.customer?.name || name}</strong>, {t('bookConfirmedNoticeText2')} <strong>{successApt.service?.name || selectedService?.name}</strong> {t('bookConfirmedNoticeText3')} <strong>{successApt.staff?.name || selectedStaff?.name}</strong> {t('bookConfirmedNoticeText4')}</p>
                  <p>📅 <strong>{t('bookSelectedDate')}:</strong> {successApt.date}</p>
                  <p>⏰ <strong>{t('bookSelectedTime')}:</strong> {successApt.time}</p>
                  <p className="text-[9px] text-slate-450 dark:text-slate-500 mt-1 italic">{t('bookReplyCancelText')}</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {t('bookAnotherAptBtn')}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* PORTAL FOOTER */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          {t('bookPublicSchedulerFooter')}
        </p>
      </div>
    </div>
  );
}
