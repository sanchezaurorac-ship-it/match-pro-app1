'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data?.user) {
        window.location.href = '/'; 
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .glass-panel {
            background: rgba(17, 17, 24, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(238, 238, 245, 0.1);
        }
        .neon-glow-focus:focus-within {
            box-shadow: 0px 0px 20px rgba(57, 255, 20, 0.15);
        }
        `
      }} />

      <div className="bg-[#111118] text-white min-h-screen flex flex-col antialiased overflow-x-hidden selection:bg-[#39FF14] selection:text-black relative">
        {/* Ambient Background Glow */}
        <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#39FF14] opacity-[0.03] blur-[120px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-[#00d2fd] opacity-[0.02] blur-[150px] pointer-events-none z-0"></div>
        
        {/* Header / Brand Anchor */}
        <header className="w-full flex items-center justify-center p-5 pt-10 z-10 relative">
          <h1 className="text-[#39FF14] font-['Syne'] text-[48px] font-extrabold uppercase tracking-tighter">MATCH PRO</h1>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-5 pb-10 z-10 relative">
          {/* Segmented Control */}
          <div className="w-full bg-[#182214] rounded-xl p-1 flex mb-10 shadow-lg border border-white/5">
            <button className="flex-1 py-3 bg-[#0c1609] text-[#39FF14] rounded-lg font-['JetBrains_Mono'] text-sm font-medium shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10 transition-all">
              Ingresar
            </button>
            <button className="flex-1 py-3 text-[#baccb0] hover:text-white rounded-lg font-['JetBrains_Mono'] text-sm font-medium transition-colors">
              Registrarme
            </button>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="w-full space-y-6">
            {error && (
              <div className="bg-[#93000a] text-[#ffdad6] p-4 rounded-xl text-center text-sm border border-[#ffb4ab] font-medium">
                {error}
              </div>
            )}
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-[#baccb0] font-['JetBrains_Mono'] text-sm font-medium ml-2" htmlFor="email">Correo Electrónico</label>
              <div className="relative neon-glow-focus rounded-xl transition-shadow duration-300">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#baccb0]">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <input 
                  className="w-full bg-[#071105] border border-[#85967c] text-white font-['Inter'] text-base rounded-xl py-4 pl-[48px] pr-4 focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-all placeholder:text-[#baccb0]/50" 
                  id="email" 
                  placeholder="jugador@matchpro.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-[#baccb0] font-['JetBrains_Mono'] text-sm font-medium ml-2" htmlFor="password">Contraseña</label>
              <div className="relative neon-glow-focus rounded-xl transition-shadow duration-300">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#baccb0]">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <input 
                  className="w-full bg-[#071105] border border-[#85967c] text-white font-['Inter'] text-base rounded-xl py-4 pl-[48px] pr-4 focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-all placeholder:text-[#baccb0]/50" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#baccb0] hover:text-[#39FF14] transition-colors">
                  <span className="material-symbols-outlined">visibility_off</span>
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1">
              <a className="text-[#baccb0] hover:text-[#39FF14] font-['JetBrains_Mono'] text-xs font-medium transition-colors" href="#">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Primary Action Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#39FF14] text-[#053900] py-5 rounded-xl font-['Syne'] text-lg font-bold uppercase tracking-widest shadow-[0px_10px_30px_rgba(57,255,20,0.15)] hover:shadow-[0px_10px_40px_rgba(57,255,20,0.25)] hover:bg-[#79ff5b] active:scale-[0.98] transition-all duration-200 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'INGRESANDO...' : 'INGRESAR'}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center justify-center my-8 opacity-30">
            <div className="h-[1px] flex-1 bg-[#85967c]"></div>
            <span className="px-4 text-[#baccb0] font-['JetBrains_Mono'] text-xs font-medium">O ingresa con</span>
            <div className="h-[1px] flex-1 bg-[#85967c]"></div>
          </div>

          {/* Floating Biometric Button */}
          <div className="flex justify-center">
            <button type="button" className="glass-panel w-[72px] h-[72px] rounded-full flex items-center justify-center text-[#39FF14] hover:bg-[#182214] transition-colors shadow-lg active:scale-95 group cursor-pointer">
              <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                fingerprint
              </span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
