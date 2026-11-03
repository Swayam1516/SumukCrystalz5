import './globals.css';

export const metadata = {
  title: 'Sumuk Crystalz 5 | Founder Sanctum Executive Portal',
  description: 'Executive Performance Sanctum & Real-Time Key Performance Indicators for Sumuk Crystalz 5',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = {
  themeColor: '#F8F6F2',
  width: 'device-width',
  initialScale: 1,
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8F6F2] text-[#29242D] font-sans antialiased selection:bg-[#EAE2F2] selection:text-[#79539B]">
        {children}
      </body>
    </html>
  );
}
