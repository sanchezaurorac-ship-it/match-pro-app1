'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '@/utils/supabase';

// Custom icons using Leaflet DivIcon
const createCustomIcon = (emoji) => {
  return L.divIcon({
    html: `<div class="w-10 h-10 bg-gray-900 border-2 border-[#39FF14] rounded-full flex items-center justify-center text-xl shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:scale-110 transition-transform">${emoji}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const sportsEmojis = ['⚽', '🏀', '🏐', '🏟️'];

export default function Map() {
  const [pins, setPins] = useState([]);
  const center = [4.6097, -74.0817]; // Bogotá

  useEffect(() => {
    const fetchComplexes = async () => {
      const { data } = await supabase.from('complexes').select('name, is_indoor');
      
      const complexes = (data && data.length > 0) ? data : [
        { name: "La 10 Arena", is_indoor: true },
        { name: "Basket City", is_indoor: true },
        { name: "Voley Club", is_indoor: false },
        { name: "Cancha Sintética Norte", is_indoor: false }
      ];

      const mappedPins = complexes.map((c, i) => ({
        id: i,
        name: c.name,
        lat: center[0] + (Math.random() - 0.5) * 0.08,
        lng: center[1] + (Math.random() - 0.5) * 0.08,
        emoji: sportsEmojis[i % 4]
      }));

      setPins(mappedPins);
    };

    fetchComplexes();
  }, []);

  return (
    <div className="w-full h-full relative z-0 font-['Inter']">
      <MapContainer 
        center={center} 
        zoom={13} 
        zoomControl={false}
        className="w-full h-full absolute inset-0 rounded-b-[32px] md:rounded-xl"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          maxZoom={20}
        />
        {pins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.lat, pin.lng]} 
            icon={createCustomIcon(pin.emoji)}
          >
            <Popup className="custom-popup">
              <div className="bg-gray-900 p-2 text-center rounded-lg border border-gray-800 -m-3 font-['Inter']">
                <h4 className="text-white font-bold text-sm mb-2">{pin.name}</h4>
                <button className="bg-[#39FF14] text-black text-xs font-bold px-3 py-1.5 rounded-lg w-full transition-colors hover:bg-green-400 cursor-pointer font-['Syne'] uppercase tracking-wider">
                  Ver canchas
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
