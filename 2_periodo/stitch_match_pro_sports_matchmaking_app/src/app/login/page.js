'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot_password' | 'reset_password'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verificar si venimos de un enlace de recuperación de contraseña
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const urlParams = new URLSearchParams(window.location.search);
      const isReset = urlParams.get('reset') === 'true' || window.location.hash.includes('type=recovery');

      if (isReset || (session && window.location.hash.includes('type=recovery'))) {
        setMode('reset_password');
        setSuccessMsg('Ingresa tu nueva contraseña a continuación.');
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset_password');
        setSuccessMsg('Ingresa tu nueva contraseña a continuación.');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

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

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName || email.split('@')[0],
            email: email,
          });
        } catch (profileErr) {
          console.error('Error guardando perfil:', profileErr);
        }

        if (data.session) {
          window.location.href = '/';
        } else {
          setRegisteredEmail(email);
          setShowConfirmModal(true);
          setSuccessMsg('¡Registro exitoso! Por favor verifica tu correo electrónico para confirmar tu cuenta.');
        }
      }
    } catch (err) {
      setError(err.message || 'Error al registrarse. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });

      if (resetError) throw resetError;

      setSuccessMsg('¡Se han enviado las instrucciones de recuperación a tu correo electrónico!');
    } catch (err) {
      setError(err.message || 'Error al intentar restablecer la contraseña. Verifica tu correo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccessMsg('¡Tu contraseña ha sido actualizada exitosamente!');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') await handleLogin();
    else if (mode === 'register') await handleRegister();
    else if (mode === 'forgot_password') await handleForgotPassword();
    else if (mode === 'reset_password') await handleResetPassword();
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
        {/* Floating Success Modal / Toast for Email Confirmation */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="glass-panel max-w-md w-full rounded-2xl p-8 border border-[#39FF14]/40 shadow-[0_0_60px_rgba(57,255,20,0.25)] flex flex-col items-center text-center relative overflow-hidden">
              {/* Glow accents */}
              <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#39FF14]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-[#39FF14]/20 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Animated Icon */}
              <div className="w-24 h-24 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/40 flex items-center justify-center text-[#39FF14] mb-6 shadow-[0_0_30px_rgba(57,255,20,0.3)] animate-bounce">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
                  mark_email_unread
                </span>
              </div>

              <h3 className="text-3xl font-extrabold text-white tracking-wide mb-3 font-display uppercase text-[#39FF14]">
                ¡Confirma tu Correo!
              </h3>
              
              <p className="text-[#baccb0] text-base mb-8 leading-relaxed">
                Hemos enviado un enlace de confirmación seguro a <span className="text-white font-semibold">{registeredEmail}</span>. <br /><br />
                Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta y empezar a vivir la experiencia <span className="text-[#39FF14] font-bold">MATCH PRO</span>.
              </p>

              <button
                type="button"
                onClick={() => { 
                  setShowConfirmModal(false); 
                  setMode('login'); 
                }}
                className="w-full bg-[#39FF14] text-[#053900] py-4 rounded-xl font-['Syne'] text-base font-bold uppercase tracking-widest shadow-[0px_10px_30px_rgba(57,255,20,0.2)] hover:shadow-[0px_10px_40px_rgba(57,255,20,0.35)] hover:bg-[#79ff5b] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Entendido / Iniciar Sesión
              </button>
            </div>
          </div>
        )}

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
            <button 
              type="button"
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-3 rounded-lg font-['JetBrains_Mono'] text-sm font-medium transition-all cursor-pointer ${mode === 'login' ? 'bg-[#0c1609] text-[#39FF14] shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10' : 'text-[#baccb0] hover:text-white'}`}
            >
              Ingresar
            </button>
            <button 
              type="button"
              onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-3 rounded-lg font-['JetBrains_Mono'] text-sm font-medium transition-all cursor-pointer ${mode === 'register' ? 'bg-[#0c1609] text-[#39FF14] shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10' : 'text-[#baccb0] hover:text-white'}`}
            >
              Registrarme
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {error && (
              <div className="bg-[#93000a] text-[#ffdad6] p-4 rounded-xl text-center text-sm border border-[#ffb4ab] font-medium animate-in fade-in duration-300">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-[#39FF14]/10 text-[#39FF14] p-4 rounded-xl text-center text-sm border border-[#39FF14]/30 animate-in fade-in duration-300 font-bold">
                {successMsg}
              </div>
            )}

            {/* Title for Forgot/Reset Password modes */}
            {mode === 'forgot_password' && (
              <h2 className="text-xl font-bold text-center text-white font-['Syne'] mb-4">Recuperar Contraseña</h2>
            )}
            {mode === 'reset_password' && (
              <h2 className="text-xl font-bold text-center text-white font-['Syne'] mb-4">Restablecer Contraseña</h2>
            )}
            
            {/* Full Name Input (Only in Register mode) */}
            {mode === 'register' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <label className="block text-[#baccb0] font-['JetBrains_Mono'] text-sm font-medium ml-2" htmlFor="fullName">Nombre Completo</label>
                <div className="relative neon-glow-focus rounded-xl transition-shadow duration-300">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#baccb0]">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <input 
                    className="w-full bg-[#071105] border border-[#85967c] text-white font-['Inter'] text-base rounded-xl py-4 pl-[48px] pr-4 focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-all placeholder:text-[#baccb0]/50" 
                    id="fullName" 
                    placeholder="Juan Pérez" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Input (In Login, Register, Forgot Password modes) */}
            {mode !== 'reset_password' && (
              <div className="space-y-2 animate-in fade-in duration-300">
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
            )}

            {/* Password Input (In Login, Register, Reset Password modes) */}
            {mode !== 'forgot_password' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <label className="block text-[#baccb0] font-['JetBrains_Mono'] text-sm font-medium ml-2" htmlFor="password">
                  {mode === 'reset_password' ? 'Nueva Contraseña' : 'Contraseña'}
                </label>
                <div className="relative neon-glow-focus rounded-xl transition-shadow duration-300">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#baccb0]">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <input 
                    className="w-full bg-[#071105] border border-[#85967c] text-white font-['Inter'] text-base rounded-xl py-4 pl-[48px] pr-4 focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-all placeholder:text-[#baccb0]/50" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#baccb0] hover:text-[#39FF14] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Link (Only in Login mode) */}
            {mode === 'login' && (
              <div className="flex justify-end pt-1">
                <button 
                  type="button"
                  onClick={() => { setMode('forgot_password'); setError(null); setSuccessMsg(null); }}
                  className="text-[#baccb0] hover:text-[#39FF14] font-['JetBrains_Mono'] text-xs font-medium transition-colors cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Back to Login Link (In Forgot/Reset Password modes) */}
            {(mode === 'forgot_password' || mode === 'reset_password') && (
              <div className="flex justify-center pt-1">
                <button 
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
                  className="text-[#baccb0] hover:text-[#39FF14] font-['JetBrains_Mono'] text-xs font-medium transition-colors cursor-pointer"
                >
                  Volver a iniciar sesión
                </button>
              </div>
            )}

            {/* Primary Action Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#39FF14] text-[#053900] py-5 rounded-xl font-['Syne'] text-lg font-bold uppercase tracking-widest shadow-[0px_10px_30px_rgba(57,255,20,0.15)] hover:shadow-[0px_10px_40px_rgba(57,255,20,0.25)] hover:bg-[#79ff5b] active:scale-[0.98] transition-all duration-200 mt-8 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                mode === 'login' ? 'INGRESANDO...' :
                mode === 'register' ? 'REGISTRANDO...' :
                mode === 'forgot_password' ? 'ENVIANDO...' : 'GUARDANDO...'
              ) : (
                mode === 'login' ? 'INGRESAR' :
                mode === 'register' ? 'REGISTRARME' :
                mode === 'forgot_password' ? 'ENVIAR RECUPERACIÓN' : 'GUARDAR CONTRASEÑA'
              )}
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
