'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import Header from '@/components/Header';

export default function ArrendadorDashboard() {
  const [complexes, setComplexes] = useState([
    { id: 1, name: 'Complejo Deportivo Norte', courts: 4, occupancy: '85%', revenue: '$1,250' },
    { id: 2, name: 'Sede Central Match Pro', courts: 6, occupancy: '92%', revenue: '$2,400' },
  ]);
  const [reservations, setReservations] = useState([
    { id: 101, court: 'Cancha 1 - Césped Sintético', player: 'Carlos Mendoza', time: 'Hoy, 19:00', price: '$40', status: 'Confirmada' },
    { id: 102, court: 'Cancha 3 - Techada', player: 'Ana Gómez', time: 'Hoy, 20:30', price: '$45', status: 'Confirmada' },
    { id: 103, court: 'Cancha 2 - Fútbol 7', player: 'Luis Torres', time: 'Mañana, 18:00', price: '$40', status: 'Pendiente' },
  ]);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-20 md:pt-24 pb-24 font-['Inter']">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gradient-to-r from-blue-900/30 to-gray-900 border border-blue-500/30 p-6 rounded-3xl shadow-[0_10px_30px_rgba(59,130,246,0.15)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-black uppercase px-3 py-1 rounded-full border border-blue-500/40 font-['JetBrains_Mono']">MODO ARRENDADOR</span>
            <h1 className="text-2xl md:text-3xl font-black text-white font-['Syne'] mt-2 tracking-wide">Panel de Gestión</h1>
            <p className="text-sm text-gray-400 mt-1">Administra tus sedes, canchas y reservas en tiempo real.</p>
          </div>
          <button 
            onClick={() => alert('Módulo de creación de canchas en mantenimiento 🛠️')}
            className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2 cursor-pointer font-['Syne'] tracking-wider text-sm"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span> Añadir Cancha
          </button>
        </div>

        {/* Financial Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 font-['Syne']">
          <div className="bg-[#1A1D24]/80 border border-gray-800 rounded-3xl p-6 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest font-['JetBrains_Mono'] mb-1">Ingresos del Mes</p>
            <h3 className="text-3xl font-black text-white">$3,650</h3>
            <p className="text-[#39FF14] text-xs font-bold mt-2 flex items-center gap-1 font-['Inter']">
              <span className="material-symbols-outlined text-sm">trending_up</span> +15% vs mes anterior
            </p>
          </div>
          <div className="bg-[#1A1D24]/80 border border-gray-800 rounded-3xl p-6 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest font-['JetBrains_Mono'] mb-1">Canchas Activas</p>
            <h3 className="text-3xl font-black text-blue-400">10 Canchas</h3>
            <p className="text-gray-400 text-xs mt-2 font-['Inter']">En 2 complejos deportivos</p>
          </div>
          <div className="bg-[#1A1D24]/80 border border-gray-800 rounded-3xl p-6 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest font-['JetBrains_Mono'] mb-1">Ocupación Promedio</p>
            <h3 className="text-3xl font-black text-[#39FF14]">88.5%</h3>
            <p className="text-gray-400 text-xs mt-2 font-['Inter']">Horario estelar (18:00 - 23:00)</p>
          </div>
        </section>

        {/* Sedes / Complejos */}
        <section id="complejos" className="mb-10 scroll-mt-24">
          <h2 className="text-xl font-bold font-['Syne'] mb-5 tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">domain</span> Tus Complejos Deportivos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {complexes.map(c => (
              <div key={c.id} className="bg-[#1A1D24] border border-gray-800 hover:border-blue-500/40 rounded-3xl p-6 shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white font-['Syne']">{c.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-blue-400">stadium</span> {c.courts} canchas habilitadas
                    </p>
                  </div>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full font-['JetBrains_Mono']">
                    {c.occupancy} Ocupación
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-800/80 pt-4 mt-4 text-sm font-['Inter']">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-['JetBrains_Mono']">Ingresos Estimados</span>
                  <span className="text-[#39FF14] font-bold font-['Syne'] text-base">{c.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reservas Activas */}
        <section id="reservas" className="scroll-mt-24">
          <div className="flex justify-between items-center mb-5 font-['Syne']">
            <h2 className="text-xl font-bold flex items-center gap-2 tracking-wide">
              <span className="material-symbols-outlined text-blue-400">book_online</span> Reservas Recientes
            </h2>
            <span className="text-xs text-gray-400 font-['Inter']">{reservations.length} reservas activas</span>
          </div>
          
          <div className="space-y-4">
            {reservations.map(r => (
              <div key={r.id} className="bg-[#1A1D24] border border-gray-800 hover:border-gray-700 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined">sports_soccer</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base font-['Syne']">{r.court}</h4>
                    <p className="text-gray-400 text-xs flex items-center gap-3 mt-1 font-['Inter']">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs text-blue-400">person</span> {r.player}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs text-[#39FF14]">schedule</span> {r.time}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 border-gray-800 pt-3 md:pt-0 font-['Inter']">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block font-['JetBrains_Mono']">Total</span>
                    <span className="text-white font-bold text-base font-['Syne']">{r.price}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border font-['JetBrains_Mono'] ${r.status === 'Confirmada' ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
