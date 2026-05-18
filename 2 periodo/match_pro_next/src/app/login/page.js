'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

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
        // Redirigir al dashboard principal si es exitoso
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

      <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary relative">
        {/* Ambient Background Glow */}
        <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary-container opacity-[0.03] blur-[120px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-secondary-container opacity-[0.02] blur-[150px] pointer-events-none z-0"></div>
        
        {/* Header / Brand Anchor */}
        <header className="w-full flex items-center justify-center p-container-padding pt-xl z-10 relative">
          <h1 className="text-primary-container font-display-xl text-[48px] font-extrabold uppercase tracking-tighter">MATCH PRO</h1>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-container-padding pb-xl z-10 relative">
          {/* Segmented Control */}
          <div className="w-full bg-surface-container-high rounded-xl p-xs flex mb-xl shadow-lg border border-white/5">
            <button className="flex-1 py-md bg-surface text-primary-container rounded-lg font-label-mono text-label-mono shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10 transition-all">
              Ingresar
            </button>
            <button className="flex-1 py-md text-on-surface-variant hover:text-on-surface rounded-lg font-label-mono text-label-mono transition-colors">
              Registrarme
            </button>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="w-full space-y-lg">
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-xl text-center text-sm border border-error">
                {error}
              </div>
            )}
            
            {/* Email Input */}
            <div className="space-y-sm">
              <label className="block text-on-surface-variant font-label-mono text-label-mono ml-sm" htmlFor="email">Correo Electrónico</label>
              <div className="relative neon-glow-focus rounded-xl transition-shadow duration-300">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline text-on-surface font-body-md text-body-md rounded-xl py-md pl-[48px] pr-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/50" 
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
            <div className="space-y-sm">
              <label className="block text-on-surface-variant font-label-mono text-label-mono ml-sm" htmlFor="password">Contraseña</label>
              <div className="relative neon-glow-focus rounded-xl transition-shadow duration-300">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline text-on-surface font-body-md text-body-md rounded-xl py-md pl-[48px] pr-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/50" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-md flex items-center text-on-surface-variant hover:text-primary-container transition-colors">
                  <span className="material-symbols-outlined">visibility_off</span>
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-xs">
              <a className="text-on-surface-variant hover:text-primary-container font-label-mono text-label-mono transition-colors text-[12px]" href="#">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Primary Action Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary py-[18px] rounded-xl font-headline-md text-body-lg uppercase tracking-widest shadow-[0px_10px_30px_rgba(57,255,20,0.15)] hover:shadow-[0px_10px_40px_rgba(57,255,20,0.25)] hover:bg-primary-fixed active:scale-[0.98] transition-all duration-200 mt-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center justify-center my-xl opacity-30 mt-8 mb-8">
            <div className="h-[1px] flex-1 bg-outline"></div>
            <span className="px-md text-on-surface-variant font-label-mono text-[12px]">O ingresa con</span>
            <div className="h-[1px] flex-1 bg-outline"></div>
          </div>

          {/* Floating Biometric Button */}
          <div className="flex justify-center">
            <button type="button" className="glass-panel w-[72px] h-[72px] rounded-full flex items-center justify-center text-primary-container hover:bg-surface-container transition-colors shadow-lg active:scale-95 group">
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
