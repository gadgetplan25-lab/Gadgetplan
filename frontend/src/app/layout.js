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
  metadataBase: new URL('https://gadgetplan.id'),
  title: {
    default: 'GadgetPlan - Toko iPhone Premium & Service Bergaransi',
    template: '%s | GadgetPlan'
  },
  description: 'Jual iPhone original, MacBook, aksesoris Apple premium, dan layanan service iPhone bergaransi di Sukabumi. Harga terbaik, kualitas terjamin, teknisi berpengalaman.',
  keywords: ['iPhone', 'MacBook', 'Apple', 'Service iPhone', 'Aksesoris Apple', 'Toko iPhone Sukabumi', 'iPhone Original', 'Service iPhone Bergaransi', 'Jual iPhone', 'Toko Apple'],
  authors: [{ name: 'GadgetPlan', url: 'https://gadgetplan.id' }],
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
    url: 'https://gadgetplan.id',
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
    google: 'Js9xCgHPI-XlsQ40RZPsQgLh7E4M_5RPWlV44SIdUBA',
  },
  alternates: {
    canonical: 'https://gadgetplan.id',
  },
  category: 'technology',
  icons: {
    icon: [
      { url: '/favicon2.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-1.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: '/favicon2.png',
    apple: '/favicon3.png',
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GadgetPlan",
    "url": "https://gadgetplan.id",
    "logo": "https://gadgetplan.id/logo.png",
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
        <link rel="icon" href="/favicon2.png?v=1" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-1.png?v=1" sizes="192x192" type="image/png" />
        <link rel="shortcut icon" href="/favicon2.png?v=1" />

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

        {/* Google Analytics (GA4) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YJRCXW0P8S"
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YJRCXW0P8S', {
                page_path: window.location.pathname,
              });
            `
          }}
          suppressHydrationWarning
        />

        {children}
      </body>
    </html>
  );
}
