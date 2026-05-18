'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import Header from '@/components/Header';

export default function Home() {
  const [streak, setStreak] = useState(0);
  const [upcoming, setUpcoming] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    // Racha logic
    const today = new Date().toISOString().split('T')[0];
    let storedStreak = JSON.parse(localStorage.getItem('matchProStreak')) || { date: null, count: 0 };
    if (storedStreak.date !== today) {
      const diff = storedStreak.date ? Math.ceil(Math.abs(new Date(today) - new Date(storedStreak.date)) / 86400000) : 0;
      storedStreak.count = diff === 1 ? storedStreak.count + 1 : 1;
      storedStreak.date = today;
      localStorage.setItem('matchProStreak', JSON.stringify(storedStreak));
    }
    setStreak(storedStreak.count);

    // Fetch data
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingUpcoming(false);
        setLoadingMatches(false);
        return;
      }

      try {
        const { data: up, error: errUp } = await supabase.from('reservations')
          .select('*, courts(*, complexes(*))')
          .eq('user_id', user.id)
          .gte('start_time', new Date().toISOString())
          .order('start_time', { ascending: true })
          .limit(1)
          .single();
        if (!errUp && up) setUpcoming(up);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUpcoming(false);
      }

      try {
        const { data: m, error: errM } = await supabase.from('matches')
          .select('*, courts(name, complexes(name))')
          .eq('status', 'open')
          .limit(4);
        if (!errM && m) setMatches(m);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-20 md:pt-24 pb-24">
        {/* Streak Header */}
        <div className="flex justify-between items-center mb-8 bg-[#1A1D24]/50 p-4 rounded-3xl border border-gray-800 shadow-lg backdrop-blur-sm">
          <div>
            <h1 className="text-xl font-bold font-['Syne'] tracking-wide">Racha Activa</h1>
            <p className="text-sm text-[#39FF14] font-['JetBrains_Mono'] font-bold">{streak} DÍAS SEGUIDOS</p>
          </div>
          <div className="flex gap-2">
            {['L','M','M','J','V','S','D'].map((day, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all ${i < Math.min(streak, 7) ? 'bg-[#39FF14] text-black shadow-[0_0_10px_#39FF14] border-[#39FF14]' : 'bg-gray-800 text-gray-500 border-gray-700'}`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Tu Próximo Partido */}
        <section className="mb-10">
          <h2 className="text-xl font-bold font-['Syne'] mb-4 tracking-wide">Tu próximo partido</h2>
          {loadingUpcoming ? (
            <div className="animate-pulse bg-gray-800 rounded-3xl h-48 w-full border border-gray-700"></div>
          ) : upcoming ? (
            <div className="bg-gradient-to-r from-[#1A1D24] to-gray-900 border border-[#39FF14]/30 rounded-3xl p-5 shadow-[0_10px_40px_rgba(57,255,20,0.05)] relative overflow-hidden group cursor-pointer">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#39FF14]/15 rounded-full blur-3xl group-hover:bg-[#39FF14]/30 transition-all duration-500"></div>
              <span className="bg-[#39FF14]/20 text-[#39FF14] text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-[#39FF14]/30 font-['JetBrains_Mono']">CONFIRMADO</span>
              <h3 className="text-white font-black text-2xl mt-2 font-['Syne']">{upcoming.courts?.name || 'Cancha'}</h3>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-1 font-['Inter']">
                <span className="material-symbols-outlined text-[#39FF14] text-base">location_on</span> {upcoming.courts?.complexes?.name}
              </p>
              <div className="flex bg-black/40 rounded-2xl p-4 mt-4 gap-4 border border-gray-800/50 relative z-10 font-['Inter']">
                <div className="flex-1 border-r border-gray-800">
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1 font-['JetBrains_Mono']">
                    <span className="material-symbols-outlined text-xs">calendar_today</span> Fecha
                  </p>
                  <p className="text-white font-semibold text-sm capitalize">
                    {new Date(upcoming.start_time).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1 font-['JetBrains_Mono']">
                    <span className="material-symbols-outlined text-xs">schedule</span> Hora
                  </p>
                  <p className="text-white font-semibold text-sm">
                    {new Date(upcoming.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700 text-center shadow-lg backdrop-blur-sm">
              <p className="text-gray-400 mb-4 font-['Inter']">No tienes partidos agendados</p>
              <Link href="/explorar" className="text-[#39FF14] font-bold uppercase hover:underline font-['Syne'] tracking-wider inline-block">
                Agenda uno ahora
              </Link>
            </div>
          )}
        </section>

        {/* Matches Abiertos */}
        <section>
          <div className="flex justify-between items-end mb-4 font-['Syne']">
            <h2 className="text-xl font-bold flex items-center gap-2 tracking-wide">
              <span className="material-symbols-outlined text-[#39FF14] text-xl">trophy</span> Matches Abiertos
            </h2>
            <Link href="/explorar" className="text-sm text-gray-400 hover:text-white font-bold font-['Inter'] transition-colors">Ver todos</Link>
          </div>
          
          <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
            {loadingMatches ? (
              [...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-gray-800 rounded-3xl h-40 min-w-[280px] shrink-0 border border-gray-700"></div>)
            ) : matches.length > 0 ? (
              matches.map(m => (
                <article key={m.id} className="bg-[#1A1D24] border border-gray-800 rounded-3xl overflow-hidden hover:border-[#39FF14]/50 shadow-lg min-w-[280px] snap-center shrink-0 transition-all group">
                  <div className="p-5 relative font-['Inter']">
                    <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-1 rounded font-['JetBrains_Mono'] border border-red-500/20">
                      FALTAN {m.missing_spots || 2}
                    </div>
                    <h4 className="font-black text-white text-xl pr-16 truncate font-['Syne']">{m.courts?.name || 'Cancha'}</h4>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mb-5">
                      <span className="material-symbols-outlined text-sm text-gray-400 group-hover:text-[#39FF14] transition-colors">location_on</span> {m.courts?.complexes?.name || 'Sede'}
                    </p>
                    <button className="w-full bg-white text-black font-black uppercase text-xs py-3 rounded-xl hover:bg-[#39FF14] transition-colors font-['Syne'] tracking-wider shadow-md cursor-pointer">
                      Unirse (${m.price_per_player || 10})
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="w-full text-center py-10 bg-[#1A1D24] rounded-2xl border border-gray-800 shadow-lg">
                <p className="text-gray-400 font-['Inter']">No hay matches abiertos.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
