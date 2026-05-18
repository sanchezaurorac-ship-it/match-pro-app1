'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import Header from '@/components/Header';

export default function Partidos() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*, courts(*, complexes(*))')
          .eq('user_id', user.id)
          .order('start_time', { ascending: true });

        if (!error && data) {
          setReservations(data);
        }
      } catch (err) {
        console.error('Error cargando reservas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-20 md:pt-24 pb-24 font-['Inter']">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4 font-['Syne']">
          <h1 className="text-2xl font-black tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-[#39FF14] text-3xl">sports_soccer</span> Mis Partidos Reservados
          </h1>
          <Link href="/explorar" className="bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#39FF14]/20 transition-colors font-['JetBrains_Mono'] uppercase tracking-wider">
            + Nueva Reserva
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800 rounded-3xl h-48 w-full border border-gray-700"></div>
            ))}
          </div>
        ) : reservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reservations.map((res) => {
              const court = res.courts;
              const complexName = court?.complexes?.name || 'Sede MATCH PRO';
              const courtName = court?.name || 'Cancha Asignada';
              const startDate = new Date(res.start_time);
              const dateStr = startDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
              const timeStr = startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={res.id} className="bg-gradient-to-r from-[#1A1D24] to-gray-900 border border-gray-800 hover:border-[#39FF14]/50 rounded-3xl p-6 shadow-lg relative overflow-hidden group transition-all duration-300 cursor-pointer">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#39FF14]/10 rounded-full blur-3xl group-hover:bg-[#39FF14]/20 transition-all duration-500"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <span className="bg-[#39FF14]/20 text-[#39FF14] text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-[#39FF14]/30 font-['JetBrains_Mono'] tracking-widest">CONFIRMADO</span>
                      <h3 className="text-white font-black text-2xl mt-2 font-['Syne']">{courtName}</h3>
                      <p className="text-gray-400 text-sm mt-1 flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[#39FF14] text-base">location_on</span> {complexName}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 shadow-inner group-hover:border-[#39FF14]/50 transition-colors">
                      <span className="material-symbols-outlined text-[#39FF14] text-xl">sports_soccer</span>
                    </div>
                  </div>

                  <div className="flex bg-black/40 rounded-2xl p-4 mt-4 gap-4 border border-gray-800/50 relative z-10 backdrop-blur-sm">
                    <div className="flex-1 border-r border-gray-800">
                      <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1 font-['JetBrains_Mono'] tracking-wider">
                        <span className="material-symbols-outlined text-xs">calendar_today</span> Fecha
                      </p>
                      <p className="text-white font-semibold text-sm capitalize">{dateStr}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1 font-['JetBrains_Mono'] tracking-wider">
                        <span className="material-symbols-outlined text-xs">schedule</span> Hora
                      </p>
                      <p className="text-white font-semibold text-sm">{timeStr}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800/40 rounded-3xl p-12 border border-gray-700 text-center max-w-lg mx-auto shadow-xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700 shadow-inner">
              <span className="material-symbols-outlined text-gray-500 text-4xl">sports_off</span>
            </div>
            <h3 className="text-white font-black text-2xl font-['Syne'] mb-2">No tienes partidos reservados</h3>
            <p className="text-gray-400 text-sm mb-8 font-medium leading-relaxed">Aún no has agendado ningún partido en nuestras sedes. Explora las canchas disponibles y únete al juego.</p>
            <Link href="/explorar" className="bg-[#39FF14] text-black font-black uppercase tracking-wider py-4 px-8 rounded-xl hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all duration-200 font-['Syne'] inline-block active:scale-95">
              Explorar Canchas
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
