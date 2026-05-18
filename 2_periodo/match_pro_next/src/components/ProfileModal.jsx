'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { X, User, Construction, LogOut, Trophy, Activity, Star, Building } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, user, profile, onProfileUpdate }) {
  const [name, setName] = useState(profile?.full_name || '');
  const [password, setPassword] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [supportMessage, setSupportMessage] = useState(false);

  if (!isOpen) return null;

  const handleUpdateName = async () => {
    setIsUpdatingName(true);
    const { error } = await supabase.from('profiles').update({ full_name: name }).eq('id', user.id);
    if (!error) {
      onProfileUpdate(name);
    }
    setTimeout(() => setIsUpdatingName(false), 2000);
  };

  const handleUpdatePassword = async () => {
    if (password.length < 6) return alert('Mínimo 6 caracteres');
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) {
      setPassword('');
    }
    setTimeout(() => setIsUpdatingPassword(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col pt-12 px-5 pb-5 overflow-y-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8 max-w-md mx-auto w-full">
        <h2 className="text-[#39FF14] text-2xl font-black font-['Syne']">MI PERFIL</h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition cursor-pointer">
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#39FF14] to-blue-500 p-1 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <User size={40} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Estadísticas del Jugador */}
        <div className="bg-gray-800/60 border border-gray-700/80 rounded-2xl p-5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-4 border-b border-gray-700/50 pb-3">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-[#39FF14]" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest font-['JetBrains_Mono']">Nivel de Juego</span>
            </div>
            <span className="bg-[#39FF14]/20 text-[#39FF14] text-xs font-black px-3 py-1 rounded-full border border-[#39FF14]/40 shadow-[0_0_15px_rgba(57,255,20,0.2)] font-['Syne']">
              PRO / 4ta Categoría
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-900/50 border border-gray-700/40 rounded-xl p-3 flex flex-col items-center justify-center group hover:border-[#39FF14]/50 transition-colors">
              <div className="flex items-center gap-1 mb-1">
                <Trophy size={14} className="text-gray-400 group-hover:text-[#39FF14] transition-colors" />
                <span className="text-2xl font-black text-white font-['Syne']">28</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-['JetBrains_Mono'] font-semibold">Partidos</span>
            </div>
            <div className="bg-gray-900/50 border border-gray-700/40 rounded-xl p-3 flex flex-col items-center justify-center group hover:border-[#39FF14]/50 transition-colors">
              <div className="flex items-center gap-1 mb-1">
                <Activity size={14} className="text-[#39FF14]" />
                <span className="text-2xl font-black text-[#39FF14] font-['Syne'] shadow-[0_0_20px_rgba(57,255,20,0.2)]">75%</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-['JetBrains_Mono'] font-semibold">Victorias</span>
            </div>
            <div className="bg-gray-900/50 border border-gray-700/40 rounded-xl p-3 flex flex-col items-center justify-center group hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-1 mb-1">
                <Star size={14} className="text-blue-400" />
                <span className="text-2xl font-black text-blue-400 font-['Syne']">15</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-['JetBrains_Mono'] font-semibold">MVPs</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Nombre Completo</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] w-full" 
          />
          <button 
            onClick={handleUpdateName}
            className={`border rounded-xl py-3 font-bold mt-1 transition-colors ${isUpdatingName ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30 hover:bg-[#39FF14]/20'}`}
          >
            {isUpdatingName ? '¡Actualizado!' : 'Actualizar Nombre'}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Nueva Contraseña</label>
          <input 
            type="password" 
            placeholder="Min. 6 caracteres" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 w-full" 
          />
          <button 
            onClick={handleUpdatePassword}
            className={`border rounded-xl py-3 font-bold mt-1 transition-colors ${isUpdatingPassword ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20'}`}
          >
            {isUpdatingPassword ? '¡Contraseña Cambiada!' : 'Cambiar Contraseña'}
          </button>
        </div>

        <div className="h-px w-full bg-gray-800 my-2"></div>

        <button 
          onClick={() => setSupportMessage(true)}
          className="bg-gray-800 text-white border border-gray-700 rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-gray-700 cursor-pointer"
        >
          {supportMessage ? (
            <><Construction size={20} /> Módulo en mantenimiento 🛠️</>
          ) : (
            <><User size={20} /> Soporte Técnico</>
          )}
        </button>

        <button 
          onClick={() => {
            const currentRole = localStorage.getItem('matchProRole') || 'jugador';
            const nextRole = currentRole === 'jugador' ? 'arrendador' : 'jugador';
            localStorage.setItem('matchProRole', nextRole);
            window.location.href = nextRole === 'arrendador' ? '/arrendador' : '/';
          }}
          className="bg-gradient-to-r from-blue-500/10 to-[#39FF14]/10 text-white border border-blue-500/30 hover:border-[#39FF14]/50 rounded-xl py-4 font-bold flex items-center justify-center gap-2 mt-4 hover:from-blue-500/20 hover:to-[#39FF14]/20 transition-all cursor-pointer shadow-md font-['Syne'] tracking-wider"
        >
          {typeof window !== 'undefined' && (localStorage.getItem('matchProRole') === 'arrendador' || window.location.pathname.includes('/arrendador')) ? (
            <><User size={20} className="text-[#39FF14]" /> Cambiar a Perfil de Jugador</>
          ) : (
            <><Building size={20} className="text-blue-400" /> Cambiar a Perfil de Arrendador</>
          )}
        </button>

        <button 
          onClick={handleLogout}
          className="bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl py-4 font-bold flex items-center justify-center gap-2 mt-4 hover:bg-red-500/20 cursor-pointer"
        >
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
