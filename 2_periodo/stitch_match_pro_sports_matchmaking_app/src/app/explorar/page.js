'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/utils/supabase';
import Header from '@/components/Header';

// Import the map dynamically with SSR disabled
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#111118]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39FF14]"></div>
    </div>
  )
});

export default function Explorar() {
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <Header />
      <main className="h-screen w-full relative pt-16 md:pt-16 pb-20 md:pb-0">
        <Map />
      </main>
    </>
  );
}
