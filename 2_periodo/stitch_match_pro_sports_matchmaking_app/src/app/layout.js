import './globals.css';

export const metadata = {
  title: 'MATCH PRO - Elevate Your Game',
  description: 'Aplicación de emparejamiento y reserva de canchas deportivas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#111118] text-white min-h-screen overflow-x-hidden pb-24 antialiased selection:bg-[#39FF14] selection:text-black font-['Inter']">
        {children}
      </body>
    </html>
  );
}
