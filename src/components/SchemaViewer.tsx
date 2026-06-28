import React, { useState } from 'react';
import { Database, Copy, Check, Table, HelpCircle, HardDrive, Key, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { SUPABASE_POSTGRES_SCHEMA } from '../lib/supabase';

export default function SchemaViewer() {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_POSTGRES_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* DB DIAGRAM HERO */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Supabase / PostgreSQL Schema Blueprint</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              This is a production-ready relational schema optimized for medical, beauty, and dental scheduling SaaS platforms. It supports primary-foreign key integrity constraints, strict domain constraints, indices for slot lookup, and Row Level Security (RLS) configurations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: VISUAL RELATIONSHIPS MAP (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-blue-500" />
              <span>Entity Relationship Map</span>
            </h5>
            
            {/* Table blocks with relation arrows */}
            <div className="space-y-3.5 text-xs">
              {/* Customers Table Card */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 mb-1.5">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1">
                    <Table className="w-3.5 h-3.5 text-indigo-500" />
                    <span>public.customers</span>
                  </span>
                  <span className="text-[9px] font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-600">PK: id</span>
                </div>
                <div className="space-y-1 text-slate-500 font-mono text-[10px]">
                  <div>🔑 id (UUID)</div>
                  <div>👤 name (VARCHAR)</div>
                  <div>📞 phone (VARCHAR, UNIQUE)</div>
                  <div>📧 email (VARCHAR)</div>
                </div>
              </div>

              {/* Relation Indicator */}
              <div className="flex justify-center text-slate-400">
                <div className="h-4 w-0.5 bg-slate-300 relative">
                  <div className="absolute -bottom-1 -left-1 text-[8px]">▼</div>
                </div>
              </div>

              {/* Appointments Table Card */}
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center pb-1.5 border-b border-blue-200 mb-1.5 bg-blue-100/40 p-1 -m-1 rounded-t">
                  <span className="font-extrabold text-blue-950 flex items-center gap-1">
                    <Table className="w-3.5 h-3.5 text-blue-600" />
                    <span>public.appointments</span>
                  </span>
                  <span className="text-[9px] font-mono bg-blue-200 px-1 py-0.5 rounded text-blue-800">PK: id</span>
                </div>
                <div className="space-y-1 text-slate-600 font-mono text-[10px]">
                  <div>🔑 id (UUID)</div>
                  <div>🔗 customer_id (UUID) <span className="text-indigo-600 font-bold">↳ customers.id</span></div>
                  <div>🔗 service_id (UUID) <span className="text-emerald-600 font-bold">↳ services.id</span></div>
                  <div>🔗 staff_id (UUID) <span className="text-rose-600 font-bold">↳ staff.id</span></div>
                  <div>📅 date (DATE)</div>
                  <div>🕒 time (VARCHAR)</div>
                  <div>⚙️ status (VARCHAR) <span className="text-slate-400">['pending', 'confirmed', 'completed', 'cancelled']</span></div>
                  <div>📝 notes (TEXT)</div>
                </div>
              </div>

              {/* Relation Indicator */}
              <div className="flex justify-center text-slate-400">
                <div className="h-4 w-0.5 bg-slate-300 relative">
                  <div className="absolute -top-1.5 -left-1 text-[8px]">▲</div>
                </div>
              </div>

              {/* Services & Staff Side-by-Side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200 mb-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1 truncate text-[10px]">
                      <Table className="w-3 h-3 text-emerald-500" />
                      <span>public.services</span>
                    </span>
                  </div>
                  <div className="space-y-0.5 text-slate-500 font-mono text-[9px]">
                    <div>🔑 id (UUID)</div>
                    <div>🏷️ name (VARCHAR)</div>
                    <div>💵 price (DECIMAL)</div>
                    <div>🕒 duration (INT)</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200 mb-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1 truncate text-[10px]">
                      <Table className="w-3 h-3 text-rose-500" />
                      <span>public.staff</span>
                    </span>
                  </div>
                  <div className="space-y-0.5 text-slate-500 font-mono text-[9px]">
                    <div>🔑 id (UUID)</div>
                    <div>👤 name (VARCHAR)</div>
                    <div>🎓 spec (VARCHAR)</div>
                    <div>⚡ active (BOOL)</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RLS DESCRIPTION CARD */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-950 space-y-2">
            <h6 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Row Level Security (RLS) Plan</span>
            </h6>
            <p className="text-[11px] leading-relaxed text-amber-800">
              For a multi-tenant or single-tenant SaaS environment, Supabase enforces table isolation using RLS. Client portals are allowed to read active <code className="bg-amber-100 px-0.5 rounded">services</code> and <code className="bg-amber-100 px-0.5 rounded">staff</code>, and insert new <code className="bg-amber-100 px-0.5 rounded">appointments</code>, while administrative dashboards require authenticated JWT tokens.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: RAW SQL TERMINAL (7 columns) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-slate-950 rounded-xl border border-slate-800 flex-1 flex flex-col overflow-hidden min-h-[400px]">
            {/* Tab header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 font-mono text-xs font-bold">supabase_schema_v1.sql</span>
              </div>
              <button
                onClick={handleCopy}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-3 py-1.5 rounded text-xs flex items-center gap-1.5 border border-slate-750 active:bg-slate-900 transition-all font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            {/* SQL Terminal Body */}
            <div className="p-4 flex-1 font-mono text-[11px] text-slate-300 overflow-y-auto leading-relaxed max-h-[500px]">
              <pre>{SUPABASE_POSTGRES_SCHEMA}</pre>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
