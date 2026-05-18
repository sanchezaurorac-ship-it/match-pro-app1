'use client';

import { useEffect, useState } from 'react';
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

const MOCK_MATCHES = [
  {
    id: 'm1',
    sport: 'Fútbol',
    icon: 'sports_soccer',
    title: 'Pachanga Nocturna - Nivel Intermedio',
    complex: 'Complejo Deportivo Norte',
    address: 'Av. Circunvalar #45-12, Bogotá',
    date: 'Hoy, 20:00',
    price_per_player: 15000,
    missing_spots: 3,
    total_spots: 10,
    level: 'Intermedio',
    organizer: 'Carlos Mendoza',
    organizer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    chat_history: [
      { sender: 'Carlos Mendoza', text: '¡Hola muchachos! Por favor lleguen 15 minutos antes para calentar.', time: '14:30' },
      { sender: 'Luis Torres', text: 'Listo Carlos, ahí estaré con balón.', time: '15:10' }
    ]
  },
  {
    id: 'm2',
    sport: 'Baloncesto',
    icon: 'sports_basketball',
    title: 'Reto 3v3 - Cancha Techada',
    complex: 'Sede Central Match Pro',
    address: 'Calle 85 #11-30, Bogotá',
    date: 'Mañana, 18:30',
    price_per_player: 12000,
    missing_spots: 2,
    total_spots: 6,
    level: 'Avanzado',
    organizer: 'Ana Gómez',
    organizer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    chat_history: [
      { sender: 'Ana Gómez', text: '¿Quién se anima a un 3v3 intenso? Faltan 2.', time: 'Ayer' }
    ]
  },
  {
    id: 'm3',
    sport: 'Pádel',
    icon: 'sports_tennis',
    title: 'Dobles Amistoso Pádel',
    complex: 'Pádel Club El Retiro',
    address: 'Carrera 15 #93-60, Bogotá',
    date: 'Jueves, 19:00',
    price_per_player: 25000,
    missing_spots: 1,
    total_spots: 4,
    level: 'Principiante',
    organizer: 'David Silva',
    organizer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    chat_history: [
      { sender: 'David Silva', text: 'Llevo palas extra por si alguien necesita.', time: '09:15' }
    ]
  },
  {
    id: 'm4',
    sport: 'Tenis',
    icon: 'sports_tennis',
    title: 'Práctica Individual',
    complex: 'Country Tennis Club',
    address: 'Calle 127 #20-50, Bogotá',
    date: 'Sábado, 08:00',
    price_per_player: 30000,
    missing_spots: 1,
    total_spots: 2,
    level: 'Intermedio',
    organizer: 'Sofía Vergara',
    organizer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    chat_history: [
      { sender: 'Sofía Vergara', text: 'Busco compañero para pelotear un par de horas.', time: 'Ayer' }
    ]
  }
];

const MOCK_COURTS = [
  {
    id: 'c1',
    name: 'Cancha 1 - Césped Sintético VIP',
    complex_name: 'Complejo Deportivo Norte',
    arrendador: 'Carlos Mendoza',
    sport: 'Fútbol',
    icon: 'sports_soccer',
    price: 50000,
    rating: 4.9,
    reviews: 124,
    surface: 'Césped Sintético',
    is_indoor: false,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'c2',
    name: 'Cancha Central Techada',
    complex_name: 'Sede Central Match Pro',
    arrendador: 'Ana Gómez',
    sport: 'Baloncesto',
    icon: 'sports_basketball',
    price: 45000,
    rating: 4.8,
    reviews: 89,
    surface: 'Madera Pulida',
    is_indoor: true,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'c3',
    name: 'Pista de Pádel de Cristal',
    complex_name: 'Pádel Club El Retiro',
    arrendador: 'Juan Pérez',
    sport: 'Pádel',
    icon: 'sports_tennis',
    price: 60000,
    rating: 5.0,
    reviews: 210,
    surface: 'Césped Artificial / Cristal',
    is_indoor: true,
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'c4',
    name: 'Cancha de Tenis Polvo de Ladrillo',
    complex_name: 'Country Tennis Club',
    arrendador: 'Sofía Vergara',
    sport: 'Tenis',
    icon: 'sports_tennis',
    price: 55000,
    rating: 4.7,
    reviews: 65,
    surface: 'Polvo de Ladrillo',
    is_indoor: false,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'c5',
    name: 'Cancha 2 - Fútbol 7 Profesional',
    complex_name: 'Complejo Deportivo Norte',
    arrendador: 'Carlos Mendoza',
    sport: 'Fútbol',
    icon: 'sports_soccer',
    price: 70000,
    rating: 4.9,
    reviews: 142,
    surface: 'Césped Sintético',
    is_indoor: false,
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800&auto=format&fit=crop'
  }
];

export default function Explorar() {
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'canchas' | 'mapa'
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState('Todos');

  // Chat Modal State
  const [selectedMatchForChat, setSelectedMatchForChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [joinedMatches, setJoinedMatches] = useState([]);

  // Rent Modal State
  const [selectedCourtForRent, setSelectedCourtForRent] = useState(null);
  const [rentDate, setRentDate] = useState('Hoy');
  const [rentTime, setRentTime] = useState('18:00 - 19:00');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [rentSuccess, setRentSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setCurrentUser(user);

      try {
        // Cargar matches abiertos desde Supabase si existen
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*, courts(name, complexes(name, location))')
          .eq('status', 'open');
        
        if (!matchesError && matchesData && matchesData.length > 0) {
          const formattedMatches = matchesData.map(m => ({
            id: m.id,
            sport: m.sport || 'Fútbol',
            icon: m.sport === 'Baloncesto' ? 'sports_basketball' : m.sport === 'Pádel' || m.sport === 'Tenis' ? 'sports_tennis' : 'sports_soccer',
            title: m.title || `${m.sport || 'Partido'} en ${m.courts?.name || 'Cancha'}`,
            complex: m.courts?.complexes?.name || 'Sede MATCH PRO',
            address: m.courts?.complexes?.location || 'Bogotá, Colombia',
            date: m.date_time ? new Date(m.date_time).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }) : 'Hoy, 19:00',
            price_per_player: m.price_per_player || 15000,
            missing_spots: m.missing_spots || 2,
            total_spots: m.total_spots || 10,
            level: m.skill_level || 'Intermedio',
            organizer: 'Organizador Pro',
            organizer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pro',
            chat_history: [
              { sender: 'Organizador Pro', text: '¡Bienvenidos al partido! Preparados para un gran juego.', time: '12:00' }
            ]
          }));
          setMatches([...formattedMatches, ...MOCK_MATCHES]);
        } else {
          setMatches(MOCK_MATCHES);
        }

        // Cargar canchas desde Supabase si existen
        const { data: courtsData, error: courtsError } = await supabase
          .from('courts')
          .select('*, complexes(name, location)');
        
        if (!courtsError && courtsData && courtsData.length > 0) {
          const formattedCourts = courtsData.map(c => ({
            id: c.id,
            name: c.name || 'Cancha Premium',
            complex_name: c.complexes?.name || 'Sede MATCH PRO',
            arrendador: 'Arrendador Pro',
            sport: c.sport || 'Fútbol',
            icon: c.sport === 'Baloncesto' ? 'sports_basketball' : c.sport === 'Pádel' || c.sport === 'Tenis' ? 'sports_tennis' : 'sports_soccer',
            price: c.price_per_hour || 50000,
            rating: 4.8,
            reviews: 45,
            surface: c.surface || 'Sintética',
            is_indoor: c.is_indoor || false,
            image: c.image_url || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop'
          }));
          setCourts([...formattedCourts, ...MOCK_COURTS]);
        } else {
          setCourts(MOCK_COURTS);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setMatches(MOCK_MATCHES);
        setCourts(MOCK_COURTS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrado de matches y canchas
  const filteredMatches = matches.filter(m => {
    const matchSport = filterSport === 'Todos' || m.sport.toLowerCase().includes(filterSport.toLowerCase());
    const matchSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.complex.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sport.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSport && matchSearch;
  });

  const filteredCourts = courts.filter(c => {
    const courtSport = filterSport === 'Todos' || c.sport.toLowerCase().includes(filterSport.toLowerCase());
    const courtSearch = searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complex_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.surface.toLowerCase().includes(searchQuery.toLowerCase());
    return courtSport && courtSearch;
  });

  // Funciones de interacción con Matches
  const handleJoinMatch = (match) => {
    if (!joinedMatches.includes(match.id)) {
      setJoinedMatches([...joinedMatches, match.id]);
    }
    setSelectedMatchForChat(match);
    setChatMessages(match.chat_history || []);
  };

  const handleOpenChat = (match) => {
    setSelectedMatchForChat(match);
    setChatMessages(match.chat_history || []);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const newMessage = {
      sender: 'Tú',
      text: newChatMessage.trim(),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setNewChatMessage('');

    // Actualizar el historial del match en el estado
    setMatches(prevMatches => prevMatches.map(m => 
      m.id === selectedMatchForChat.id ? { ...m, chat_history: updatedMessages } : m
    ));

    // Simular respuesta automática
    setTimeout(() => {
      const replies = [
        '¡Excelente! Nos vemos en la cancha.',
        'Perfecto, gracias por avisar.',
        '¡Buena esa! Vamos con toda.',
        'Listo, ya tengo todo preparado.'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg = {
        sender: selectedMatchForChat?.organizer || 'Carlos Mendoza',
        text: randomReply,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, replyMsg]);
      setMatches(prevMatches => prevMatches.map(m => 
        m.id === selectedMatchForChat.id ? { ...m, chat_history: [...updatedMessages, replyMsg] } : m
      ));
    }, 1500);
  };

  // Funciones de interacción con Canchas
  const handleOpenRentModal = (court) => {
    setSelectedCourtForRent(court);
    setRentSuccess(false);
  };

  const handleRentCourt = async () => {
    setBookingLoading(true);

    try {
      if (currentUser) {
        let dateObj = new Date();
        if (rentDate === 'Mañana') dateObj.setDate(dateObj.getDate() + 1);
        else if (rentDate === 'Pasado Mañana') dateObj.setDate(dateObj.getDate() + 2);
        
        const [hour, minute] = rentTime.split(' - ')[0].split(':');
        dateObj.setHours(parseInt(hour, 10), parseInt(minute || 0, 10), 0);

        try {
          await supabase.from('reservations').insert({
            user_id: currentUser.id,
            court_id: typeof selectedCourtForRent.id === 'string' && selectedCourtForRent.id.startsWith('c') ? null : selectedCourtForRent.id,
            start_time: dateObj.toISOString(),
            end_time: new Date(dateObj.getTime() + 3600000).toISOString(),
            status: 'confirmed',
            total_price: selectedCourtForRent.price
          });
        } catch (e) {
          console.warn('Supabase insert skipped for mock data or error:', e);
        }
      }

      setRentSuccess(true);
      setTimeout(() => {
        setRentSuccess(false);
        setSelectedCourtForRent(null);
        setBookingLoading(false);
        window.location.href = '/partidos';
      }, 2500);

    } catch (error) {
      console.error('Error al reservar:', error);
      setRentSuccess(true);
      setTimeout(() => {
        setRentSuccess(false);
        setSelectedCourtForRent(null);
        setBookingLoading(false);
        window.location.href = '/partidos';
      }, 2500);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-[#111118] text-white pt-20 md:pt-24 pb-24 font-['Inter']">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header & Tab Switcher */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-gradient-to-r from-[#1A1D24] to-gray-900/80 p-6 rounded-3xl border border-gray-800 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#39FF14]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#39FF14]/20 text-[#39FF14] text-xs font-black uppercase px-3 py-1 rounded-full border border-[#39FF14]/40 font-['JetBrains_Mono'] tracking-wider">
                  EXPLORAR DEPORTES
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white font-['Syne'] tracking-wide">
                Encuentra tu próximo juego
              </h1>
              <p className="text-sm text-gray-400 mt-1 max-w-xl leading-relaxed">
                Únete a partidos activos con chat en vivo, alquila canchas premium directamente de arrendadores verificados, o explora el mapa de sedes.
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-black/50 p-1.5 rounded-2xl border border-gray-800 w-full md:w-auto grid grid-cols-3 gap-1.5 font-['Syne'] shadow-inner">
              <button
                onClick={() => setActiveTab('matches')}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer ${activeTab === 'matches' ? 'bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-base md:text-lg">groups</span>
                Buscar Match
              </button>

              <button
                onClick={() => setActiveTab('canchas')}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer ${activeTab === 'canchas' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-base md:text-lg">stadium</span>
                Canchas
              </button>

              <button
                onClick={() => setActiveTab('mapa')}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer ${activeTab === 'mapa' ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-base md:text-lg">map</span>
                Mapa
              </button>
            </div>
          </div>

          {/* Search & Filters Bar (Only for matches and canchas) */}
          {activeTab !== 'mapa' && (
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-[#1A1D24]/60 p-4 rounded-2xl border border-gray-800/80 backdrop-blur-sm shadow-lg">
              {/* Search Input */}
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder={activeTab === 'matches' ? 'Buscar por deporte, complejo o título...' : 'Buscar por nombre de cancha, complejo o superficie...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors font-['Inter']"
                />
              </div>

              {/* Sport Filters */}
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                {['Todos', 'Fútbol', 'Baloncesto', 'Pádel', 'Tenis'].map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setFilterSport(sport)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-['JetBrains_Mono'] tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${filterSport === sport ? (activeTab === 'matches' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 shadow-[0_0_15px_rgba(57,255,20,0.15)]' : 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]') : 'bg-black/40 text-gray-400 border border-gray-800 hover:border-gray-700'}`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Buscar Match */}
          {activeTab === 'matches' && (
            <div>
              <div className="flex justify-between items-center mb-6 font-['Syne']">
                <h2 className="text-xl font-bold flex items-center gap-2 tracking-wide text-white">
                  <span className="material-symbols-outlined text-[#39FF14]">sports_kabaddi</span> Partidos Disponibles para Unirse
                </h2>
                <span className="text-xs text-gray-400 font-['Inter']">{filteredMatches.length} partidos encontrados</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-[#1A1D24] rounded-3xl h-64 w-full border border-gray-800"></div>
                  ))}
                </div>
              ) : filteredMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMatches.map((m) => {
                    const isJoined = joinedMatches.includes(m.id);
                    return (
                      <div key={m.id} className="bg-gradient-to-r from-[#1A1D24] to-gray-900 border border-gray-800 hover:border-[#39FF14]/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-all duration-300 flex flex-col justify-between">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#39FF14]/10 rounded-full blur-3xl group-hover:bg-[#39FF14]/20 transition-all duration-500 pointer-events-none"></div>
                        
                        <div>
                          <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-[#39FF14]/20 text-[#39FF14] text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-[#39FF14]/30 font-['JetBrains_Mono'] tracking-widest">
                                  {m.sport}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border font-['JetBrains_Mono'] ${m.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border-green-500/30' : m.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                                  {m.level}
                                </span>
                              </div>
                              <h3 className="text-white font-black text-2xl mt-3 font-['Syne'] group-hover:text-[#39FF14] transition-colors">{m.title}</h3>
                              <p className="text-gray-400 text-sm mt-1 flex items-center gap-1 font-medium font-['Inter']">
                                <span className="material-symbols-outlined text-[#39FF14] text-base">location_on</span> {m.complex}
                              </p>
                              <p className="text-gray-500 text-xs mt-0.5 ml-5 font-['Inter']">{m.address}</p>
                            </div>
                            <div className="w-12 h-12 bg-black/50 rounded-2xl flex items-center justify-center border border-gray-800 shadow-inner group-hover:border-[#39FF14]/50 transition-colors shrink-0">
                              <span className="material-symbols-outlined text-[#39FF14] text-2xl">{m.icon}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-black/40 rounded-2xl p-4 my-4 border border-gray-800/50 relative z-10 backdrop-blur-sm font-['Inter']">
                            <div className="border-r border-gray-800">
                              <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1 font-['JetBrains_Mono'] tracking-wider">
                                <span className="material-symbols-outlined text-xs">calendar_today</span> Fecha y Hora
                              </p>
                              <p className="text-white font-semibold text-sm">{m.date}</p>
                            </div>
                            <div className="pl-2">
                              <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1 font-['JetBrains_Mono'] tracking-wider">
                                <span className="material-symbols-outlined text-xs">group</span> Cupos Disponibles
                              </p>
                              <p className="text-[#39FF14] font-bold text-sm">{m.total_spots - m.missing_spots} / {m.total_spots} Jugadores</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-6 font-['Inter'] relative z-10">
                            <img src={m.organizer_avatar} alt={m.organizer} className="w-8 h-8 rounded-full border border-gray-700 bg-gray-800" />
                            <div className="text-xs">
                              <p className="text-gray-400 font-medium">Organizado por</p>
                              <p className="text-white font-bold">{m.organizer}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-800/80 pt-4 mt-auto relative z-10 font-['Inter']">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block font-['JetBrains_Mono']">Precio por Jugador</span>
                            <span className="text-white font-black text-xl font-['Syne']">${m.price_per_player} <span className="text-xs font-normal text-gray-400">COP</span></span>
                          </div>

                          {isJoined ? (
                            <button
                              onClick={() => handleOpenChat(m)}
                              className="bg-[#39FF14] hover:bg-[#32e012] text-black font-black uppercase text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] flex items-center gap-2 cursor-pointer font-['Syne'] tracking-wider active:scale-95"
                            >
                              <span className="material-symbols-outlined text-base">forum</span> Abrir Chat
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinMatch(m)}
                              className="bg-white hover:bg-[#39FF14] text-black font-black uppercase text-xs px-6 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] flex items-center gap-2 cursor-pointer font-['Syne'] tracking-wider active:scale-95"
                            >
                              <span className="material-symbols-outlined text-base">person_add</span> Unirse al Partido
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#1A1D24]/40 rounded-3xl p-12 border border-gray-800 text-center max-w-lg mx-auto shadow-xl backdrop-blur-sm">
                  <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                    <span className="material-symbols-outlined text-gray-500 text-4xl">search_off</span>
                  </div>
                  <h3 className="text-white font-black text-2xl font-['Syne'] mb-2">No se encontraron partidos</h3>
                  <p className="text-gray-400 text-sm mb-6 font-medium leading-relaxed">No hay partidos disponibles que coincidan con tu búsqueda o filtro actual.</p>
                  <button onClick={() => { setFilterSport('Todos'); setSearchQuery(''); }} className="bg-[#39FF14] text-black font-black uppercase tracking-wider py-3 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all font-['Syne'] text-xs cursor-pointer">
                    Limpiar Filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Canchas */}
          {activeTab === 'canchas' && (
            <div>
              <div className="flex justify-between items-center mb-6 font-['Syne']">
                <h2 className="text-xl font-bold flex items-center gap-2 tracking-wide text-white">
                  <span className="material-symbols-outlined text-blue-400">stadium</span> Canchas Disponibles para Alquilar
                </h2>
                <span className="text-xs text-gray-400 font-['Inter']">{filteredCourts.length} canchas encontradas</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-[#1A1D24] rounded-3xl h-80 w-full border border-gray-800"></div>
                  ))}
                </div>
              ) : filteredCourts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourts.map((c) => (
                    <div key={c.id} className="bg-[#1A1D24] border border-gray-800 hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-xl relative group transition-all duration-300 flex flex-col justify-between">
                      <div className="relative h-48 w-full overflow-hidden bg-gray-900 shrink-0">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D24] via-transparent to-transparent"></div>
                        
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-blue-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-blue-400/30 font-['JetBrains_Mono'] tracking-widest shadow-lg">
                            {c.sport}
                          </span>
                          {c.is_indoor && (
                            <span className="bg-purple-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-purple-400/30 font-['JetBrains_Mono'] tracking-widest shadow-lg">
                              Techada
                            </span>
                          )}
                        </div>

                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-700/80 flex items-center gap-1 text-yellow-400 text-xs font-bold font-['Inter'] shadow-lg">
                          <span className="material-symbols-outlined text-sm">star</span> {c.rating} <span className="text-[10px] text-gray-400 font-normal">({c.reviews})</span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                        <div>
                          <h3 className="text-white font-black text-xl font-['Syne'] group-hover:text-blue-400 transition-colors leading-snug">{c.name}</h3>
                          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1 font-medium font-['Inter']">
                            <span className="material-symbols-outlined text-blue-400 text-sm">domain</span> {c.complex_name}
                          </p>

                          <div className="flex items-center gap-2 mt-4 bg-black/40 rounded-xl p-3 border border-gray-800/80 font-['Inter']">
                            <span className="material-symbols-outlined text-gray-400 text-base">grass</span>
                            <div className="text-xs">
                              <span className="text-gray-50 block text-[10px] uppercase font-bold font-['JetBrains_Mono']">Superficie</span>
                              <span className="text-gray-200 font-semibold">{c.surface}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-3 font-['Inter'] text-xs text-gray-400">
                            <span className="material-symbols-outlined text-sm text-gray-500">handshake</span>
                            <span>Arrendador: <strong className="text-gray-200">{c.arrendador}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-6 font-['Inter']">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block font-['JetBrains_Mono']">Precio Alquiler</span>
                            <span className="text-white font-black text-xl font-['Syne']">${c.price} <span className="text-xs font-normal text-gray-400">/ hora</span></span>
                          </div>

                          <button
                            onClick={() => handleOpenRentModal(c)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-black uppercase text-xs px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2 cursor-pointer font-['Syne'] tracking-wider active:scale-95"
                          >
                            <span className="material-symbols-outlined text-base">book_online</span> Alquilar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#1A1D24]/40 rounded-3xl p-12 border border-gray-800 text-center max-w-lg mx-auto shadow-xl backdrop-blur-sm">
                  <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                    <span className="material-symbols-outlined text-gray-500 text-4xl">stadium</span>
                  </div>
                  <h3 className="text-white font-black text-2xl font-['Syne'] mb-2">No se encontraron canchas</h3>
                  <p className="text-gray-400 text-sm mb-6 font-medium leading-relaxed">No hay canchas disponibles que coincidan con tu búsqueda o filtro actual.</p>
                  <button onClick={() => { setFilterSport('Todos'); setSearchQuery(''); }} className="bg-blue-500 text-white font-black uppercase tracking-wider py-3 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all font-['Syne'] text-xs cursor-pointer">
                    Limpiar Filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Mapa */}
          {activeTab === 'mapa' && (
            <div className="w-full h-[700px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl relative">
              <Map />
            </div>
          )}

        </div>

        {/* Chat Modal */}
        {selectedMatchForChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 font-['Inter']">
            <div className="bg-[#1A1D24] border border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex flex-col h-[600px] animate-in zoom-in-95 duration-300">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-900 to-[#1A1D24] p-6 border-b border-gray-800 flex justify-between items-center relative overflow-hidden shrink-0">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#39FF14]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-2xl flex items-center justify-center text-[#39FF14] shrink-0">
                    <span className="material-symbols-outlined text-2xl">{selectedMatchForChat.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#39FF14]/20 text-[#39FF14] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#39FF14]/30 font-['JetBrains_Mono']">CHAT EN VIVO</span>
                      <span className="text-xs text-gray-400 font-medium">{selectedMatchForChat.complex}</span>
                    </div>
                    <h3 className="text-white font-black text-xl font-['Syne'] mt-1">{selectedMatchForChat.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMatchForChat(null)}
                  className="text-gray-400 hover:text-white w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-gray-800 flex items-center justify-center transition-colors cursor-pointer relative z-10"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#111118]/60 hide-scrollbar">
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, idx) => {
                    const isMe = msg.sender === 'Tú';
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-400">{msg.sender}</span>
                          <span className="text-[10px] text-gray-600 font-['JetBrains_Mono']">{msg.time}</span>
                        </div>
                        <div className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-md ${isMe ? 'bg-[#39FF14] text-black font-medium rounded-tr-none shadow-[0_5px_15px_rgba(57,255,20,0.2)]' : 'bg-[#1A1D24] text-white border border-gray-800 rounded-tl-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                    <p className="text-sm">No hay mensajes aún. ¡Sé el primero en saludar al grupo!</p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-gray-900/80 border-t border-gray-800 flex gap-3 items-center shrink-0">
                <input
                  type="text"
                  placeholder="Escribe un mensaje para el grupo..."
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  className="flex-1 bg-black/60 border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors font-['Inter']"
                />
                <button
                  type="submit"
                  className="bg-[#39FF14] hover:bg-[#32e012] text-black font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>

            </div>
          </div>
        )}

        {/* Rent Modal */}
        {selectedCourtForRent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 font-['Inter']">
            <div className="bg-[#1A1D24] border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex flex-col animate-in zoom-in-95 duration-300">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-900/40 to-[#1A1D24] p-6 border-b border-gray-800 flex justify-between items-center relative overflow-hidden shrink-0">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-blue-500/30 font-['JetBrains_Mono']">ALQUILER DE CANCHA</span>
                  <h3 className="text-white font-black text-xl font-['Syne'] mt-1">{selectedCourtForRent.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedCourtForRent.complex_name}</p>
                </div>
                <button
                  onClick={() => setSelectedCourtForRent(null)}
                  className="text-gray-400 hover:text-white w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-gray-800 flex items-center justify-center transition-colors cursor-pointer relative z-10"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {rentSuccess ? (
                <div className="p-12 text-center flex flex-col items-center justify-center my-8 animate-in fade-in duration-300">
                  <div className="w-20 h-20 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center text-green-400 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <h4 className="text-white font-black text-2xl font-['Syne'] mb-2">¡Cancha Alquilada con Éxito!</h4>
                  <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">Tu reserva ha sido confirmada y notificada al arrendador <strong>{selectedCourtForRent.arrendador}</strong>.</p>
                  <div className="bg-black/40 border border-gray-800 rounded-2xl p-4 w-full text-left font-['Inter'] text-xs space-y-2 mb-6">
                    <div className="flex justify-between"><span className="text-gray-500 font-medium">Fecha:</span> <span className="text-white font-bold">{rentDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 font-medium">Horario:</span> <span className="text-white font-bold">{rentTime}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 font-medium">Total Pagado:</span> <span className="text-[#39FF14] font-bold font-['Syne'] text-sm">${selectedCourtForRent.price}</span></div>
                  </div>
                  <p className="text-xs text-blue-400 font-medium animate-pulse">Redirigiendo a tus reservas...</p>
                </div>
              ) : (
                <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] hide-scrollbar">
                  
                  {/* Date Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-['JetBrains_Mono'] mb-3">1. Selecciona la Fecha</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Hoy', 'Mañana', 'Pasado Mañana'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setRentDate(d)}
                          className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${rentDate === d ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-['JetBrains_Mono'] mb-3">2. Selecciona el Horario</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setRentTime(t)}
                          className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${rentTime === t ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700'}`}
                        >
                          <span className="material-symbols-outlined text-sm align-middle mr-1.5">schedule</span>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-['JetBrains_Mono'] mb-3">3. Método de Pago</label>
                    <div className="space-y-2.5">
                      {[
                        { id: 'card', name: 'Tarjeta de Crédito / Débito', icon: 'credit_card', desc: 'Pago seguro en línea' },
                        { id: 'apple', name: 'Apple Pay / Google Pay', icon: 'account_balance_wallet', desc: 'Pago rápido con un clic' },
                        { id: 'cash', name: 'Pago en Efectivo en Sede', icon: 'payments', desc: 'Paga al llegar al complejo' }
                      ].map((pm) => (
                        <div
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${paymentMethod === pm.id ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-black/40 border-gray-800 hover:border-gray-700'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${paymentMethod === pm.id ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}>
                              <span className="material-symbols-outlined">{pm.icon}</span>
                            </div>
                            <div>
                              <h5 className="text-white font-bold text-sm font-['Syne']">{pm.name}</h5>
                              <p className="text-gray-500 text-xs mt-0.5">{pm.desc}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id ? 'border-blue-500 bg-blue-500' : 'border-gray-700 bg-transparent'}`}>
                            {paymentMethod === pm.id && <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Submit */}
                  <div className="border-t border-gray-800 pt-6 flex items-center justify-between font-['Inter'] shrink-0">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block font-['JetBrains_Mono']">Total a Pagar</span>
                      <span className="text-white font-black text-2xl font-['Syne']">${selectedCourtForRent.price} <span className="text-xs font-normal text-gray-400">COP</span></span>
                    </div>

                    <button
                      type="button"
                      disabled={bookingLoading}
                      onClick={handleRentCourt}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-black uppercase text-xs px-8 py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2 cursor-pointer font-['Syne'] tracking-wider active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {bookingLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">lock</span> Confirmar Alquiler
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </main>
    </>
  );
}
