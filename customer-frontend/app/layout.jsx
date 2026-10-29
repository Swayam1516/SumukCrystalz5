import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import AuthModal from '../components/AuthModal';
import ServiceWorkerCleaner from '../components/ServiceWorkerCleaner';
import AnnouncementBanner from '../components/AnnouncementBanner';
import AICustomerChatbot from '../components/AICustomerChatbot';
import MobileBottomNav from '../components/MobileBottomNav';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sumukcrystalz.com'),
  title: {
    default: 'Sumuk Crystalz 5 | Masterwork Vedic Consecrated Crystals & Gemstones',
    template: '%s | Sumuk Crystalz 5',
  },
  description:
    'Experience museum-grade natural crystals, amethyst cathedral geodes, energized Pyrite wealth bracelets, and healing gemstones. Consecrated with sacred Vedic mantras by Founder Soumyaa Naveen.',
  keywords: [
    'Sumuk Crystalz 5',
    'Soumyaa Naveen',
    'natural crystals Pune',
    'Sus Gaon Pune',
    'Vedic energized gemstones',
    'Pyrite wealth bracelet',
    'Amethyst raw geode',
    'Chakra healing crystals India',
    'Tiger Eye stone',
    'Sound bowl crystal attunement',
    'Vedic consecration ritual',
    'luxury gemstone jewelry India',
  ],
  authors: [
    { name: 'SWAYAM A H', url: 'mailto:swayamh16@gmail.com' },
    { name: 'Soumyaa Naveen', url: 'https://sumukcrystalz.com/about' },
  ],
  creator: 'SWAYAM A H',
  publisher: 'Sumuk Crystalz 5',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sumuk Crystalz 5 | Vedic Consecrated Crystals & Gemstones',
    description:
      'Immerse in museum-grade crystals, 360° digital specimens, and personalized Vedic energization rituals by Founder Soumyaa Naveen.',
    url: 'https://sumukcrystalz.com',
    siteName: 'Sumuk Crystalz 5',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Sumuk Crystalz 5 Masterwork Natural Gemstones',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sumuk Crystalz 5 | Vedic Consecrated Crystals & Gemstones',
    description:
      'Museum-grade natural crystals, Vedic energization rituals, and certified authenticity by Founder Soumyaa Naveen.',
    images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80'],
    creator: '@sumukcrystalz5',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'ecommerce',
};

export const viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  name: 'Sumuk Crystalz 5',
  image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
  '@id': 'https://sumukcrystalz.com',
  url: 'https://sumukcrystalz.com',
  hasMap: 'https://share.google/ZlRBaN7xnl5EdHmIX',
  telephone: '+91 91117 16355',
  priceRange: '₹₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sus Gaon',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  founder: {
    '@type': 'Person',
    name: 'Soumyaa Naveen',
    jobTitle: 'Founder & Certified Usui Reiki Master',
    image: 'https://sumukcrystalz.com/images/soumya-profile.jpeg',
  },
  description:
    'Sumuk Crystalz 5 provides museum-grade natural gemstones, Pyrite wealth bands, Amethyst cathedral geodes, and individualized Vedic consecration rituals.',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '21:00',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Dancing+Script:wght@600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col text-[#1F1A15] antialiased overflow-x-hidden w-full max-w-full pb-16 md:pb-0">
        <ServiceWorkerCleaner />
        <AnnouncementBanner />
        <Header />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
        <Footer />
        <CartDrawer />
        <AuthModal />
        <AICustomerChatbot />
        <MobileBottomNav />
      </body>
    </html>
  );
}
