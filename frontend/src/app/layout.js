import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./mobile-perf.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL('https://gadgetplan.com'),
  title: {
    default: 'GadgetPlan - Toko iPhone Premium & Service Bergaransi',
    template: '%s | GadgetPlan'
  },
  description: 'Jual iPhone original, MacBook, aksesoris Apple premium, dan layanan service iPhone bergaransi di Sukabumi. Harga terbaik, kualitas terjamin, teknisi berpengalaman.',
  keywords: ['iPhone', 'MacBook', 'Apple', 'Service iPhone', 'Aksesoris Apple', 'Toko iPhone Sukabumi', 'iPhone Original', 'Service iPhone Bergaransi', 'Jual iPhone', 'Toko Apple'],
  authors: [{ name: 'GadgetPlan', url: 'https://gadgetplan.com' }],
  creator: 'GadgetPlan',
  publisher: 'GadgetPlan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://gadgetplan.com',
    siteName: 'GadgetPlan',
    title: 'GadgetPlan - Toko iPhone Premium & Service Bergaransi',
    description: 'Jual iPhone original, MacBook, aksesoris Apple premium, dan layanan service iPhone bergaransi. Harga terbaik, kualitas terjamin.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GadgetPlan - Toko iPhone Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GadgetPlan - Toko iPhone Premium & Service Bergaransi',
    description: 'Jual iPhone original, MacBook, aksesoris Apple premium, dan layanan service iPhone bergaransi.',
    images: ['/twitter-image.jpg'],
    creator: '@gadgetplan',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://gadgetplan.com',
  },
  category: 'technology',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GadgetPlan",
    "url": "https://gadgetplan.com",
    "logo": "https://gadgetplan.com/logo.png",
    "description": "Toko iPhone Premium & Service Bergaransi di Sukabumi",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sukabumi",
      "addressRegion": "Jawa Barat",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-852-1611-4357",
      "contactType": "Customer Service",
      "areaServed": "ID",
      "availableLanguage": ["Indonesian"]
    },
    "sameAs": [
      "https://facebook.com/gadgetplan",
      "https://instagram.com/gadgetplan"
    ]
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preconnect to backend API for faster requests */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"} />

        {/* Preload critical assets */}
        <link rel="preload" as="image" href="/logo-gadgetplan-biru.png" fetchPriority="high" />

        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon - Explicit declaration to override cache */}
        <link rel="icon" href="/favicon.png?v=2" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="shortcut icon" href="/favicon.png?v=2" />

        {/* Viewport optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />

        {/* Reduce CLS */}
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* JSON-LD Schema - moved to body to avoid hydration issues */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          suppressHydrationWarning
        />

        {children}

        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('[SW] Registered:', reg.scope))
                .catch(err => console.log('[SW] Registration failed:', err));
            });
          }
        `}} />
      </body>
    </html>
  );
}
