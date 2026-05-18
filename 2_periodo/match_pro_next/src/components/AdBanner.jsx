'use client';
import { useEffect } from 'react';

export default function AdBanner({ dataAdSlot, dataAdFormat = 'auto', dataFullWidthResponsive = true }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window.adsbygoogle = window.adsbygoogle || [])).push({});
      }
    } catch (error) {
      console.error('Error cargando el anuncio de AdSense:', error);
    }
  }, []);

  return (
    <div className="w-full my-6 overflow-hidden flex flex-col items-center justify-center bg-[#1A1D24]/60 p-4 rounded-3xl border border-gray-800 backdrop-blur-sm shadow-lg min-h-[120px] relative group">
      <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500 font-['JetBrains_Mono'] z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></span>
        Anuncio Patrocinado de Google
      </div>
      
      {/* Ins tag for Google AdSense */}
      <ins
        className="adsbygoogle w-full flex justify-center mt-2 relative z-20"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client="ca-pub-2241872778035498"
        data-ad-slot={dataAdSlot || "1234567890"}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />

      {/* Fallback visual en desarrollo por si AdSense no se muestra localmente */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity z-0">
        <span className="material-symbols-outlined text-gray-400 text-2xl mb-1">ads_click</span>
        <p className="text-xs text-gray-400 font-medium font-['Inter']">Espacio Publicitario de Google AdSense</p>
        <p className="text-[10px] text-gray-500 font-['JetBrains_Mono'] mt-0.5">Bloque activo para monetización</p>
      </div>
    </div>
  );
}
