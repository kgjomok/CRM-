import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function NotificationToast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4.5 py-3.5 rounded-xl shadow-lg border text-sm max-w-sm ${
        type === 'success' 
          ? 'bg-emerald-50 border-emerald-150 text-emerald-900' 
          : type === 'error' 
          ? 'bg-rose-50 border-rose-150 text-rose-900' 
          : 'bg-slate-50 border-slate-150 text-slate-900'
      }`}
    >
      {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
      {type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
      {type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />}

      <div className="font-semibold flex-1 leading-tight">{message}</div>

      <button 
        onClick={onClose} 
        className="p-1 hover:bg-black/5 rounded-full transition-colors text-slate-400 hover:text-slate-700"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
