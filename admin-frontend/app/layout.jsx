import './globals.css';

export const metadata = {
  title: 'Sumuk Crystalz 5 | Founder Admin Sanctuary | Soumyaa Naveen',
  description: 'Enterprise Vault Management & Order Fulfillment Sanctuary for Sumuk Crystalz 5',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = {
  themeColor: '#06050a',
  width: 'device-width',
  initialScale: 1,
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#06050a] text-[#f3f2fa] antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
