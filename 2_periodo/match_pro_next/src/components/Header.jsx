'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import ProfileModal from './ProfileModal';
import { ArrowLeft, Home, Compass, Trophy, User, Building2, Calendar, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) setProfile(data);
      }
    };
    fetchUser();
  }, []);

  const handleBack = () => router.back();

  const [isArrendador, setIsArrendador] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('matchProRole');
      setIsArrendador(role === 'arrendador' || pathname?.includes('/arrendador'));
      
      const updateUrl = () => {
        setCurrentUrl(window.location.pathname + window.location.hash);
      };
      
      updateUrl();
      const interval = setInterval(updateUrl, 150);
      return () => clearInterval(interval);
    }
  }, [pathname]);

  const checkActive = (href) => {
    if (href === '#') return false;
    if (currentUrl === href) return true;
    if (href === '/arrendador' && (currentUrl === '/arrendador' || currentUrl === '/arrendador#')) return true;
    if (href === '/' && (currentUrl === '/' || currentUrl === '')) return true;
    return false;
  };
  
  const navLinks = isArrendador ? [
    { href: '/arrendador', icon: LayoutDashboard, label: 'Inicio' },
    { href: '/arrendador#complejos', icon: Building2, label: 'Complejos' },
    { href: '/arrendador#reservas', icon: Calendar, label: 'Reservas' },
    { href: '#', icon: User, label: 'Mi Perfil', isModal: true }
  ] : [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/explorar', icon: Compass, label: 'Explorar' },
    { href: '/partidos', icon: Trophy, label: 'Partidos' },
    { href: '#', icon: User, label: 'Mi Perfil', isModal: true }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[60] bg-[#1A1D24]/90 backdrop-blur-md border-b border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={handleBack} className="text-white hover:text-[#39FF14] transition-colors p-2 -ml-2 rounded-full hover:bg-gray-800 cursor-pointer">
            <ArrowLeft size={24} />
          </button>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ href, icon: Icon, label, isModal }) => {
              if (isModal) {
                return (
                  <button key={label} onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 transition-colors text-gray-400 hover:text-[#39FF14] cursor-pointer">
                    <Icon size={20} />
                    <span className="font-bold tracking-wide">{label}</span>
                  </button>
                );
              }
              const isActive = checkActive(href);
              return (
                <Link key={href} href={href} className={`flex items-center gap-2 transition-colors ${isActive ? 'text-[#39FF14]' : 'text-gray-400 hover:text-[#39FF14]'}`}>
                  <Icon size={20} fill={isActive ? 'currentColor' : 'none'} />
                  <span className="font-bold tracking-wide">{label}</span>
                </Link>
              );
            })}
          </nav>

          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 hover:bg-gray-800/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-700 cursor-pointer text-left">
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 font-medium">Hola,</span>
              <span className="text-sm font-bold text-white leading-tight">
                {profile?.full_name ? profile.full_name.split(' ')[0] : (isArrendador ? 'Arrendador' : 'Jugador')}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#39FF14] to-blue-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 pb-safe bg-[#111118]/90 backdrop-blur-xl border-t border-white/10 shadow-[0px_-10px_30px_rgba(57,255,20,0.05)]">
        {navLinks.filter(item => !item.isModal).map(({ href, icon: Icon, label }) => {
          const isActive = checkActive(href);
          return (
            <Link key={href} href={href} className={`flex flex-col items-center justify-center transition-colors transition-transform duration-200 w-16 ${isActive ? 'text-[#39FF14] -translate-y-1 relative' : 'text-white/40 hover:text-white'}`}>
              <Icon size={24} fill={isActive ? 'currentColor' : 'none'} />
              <span className="font-['Syne'] font-bold text-[10px] uppercase tracking-widest mt-1">{label}</span>
              {isActive && <div className="w-6 h-1 bg-[#39FF14] rounded-full absolute -bottom-1 shadow-[0_0_10px_#39FF14]"></div>}
            </Link>
          );
        })}
        <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center justify-center text-white/40 hover:text-white transition-colors transition-transform duration-200 w-16 cursor-pointer">
          <User size={24} />
          <span className="font-['Syne'] font-bold text-[10px] uppercase tracking-widest mt-1">Perfil</span>
        </button>
      </nav>

      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={user} 
        profile={profile} 
        onProfileUpdate={(name) => setProfile({ ...profile, full_name: name })} 
      />
    </>
  );
}
