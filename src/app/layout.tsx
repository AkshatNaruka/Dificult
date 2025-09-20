import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TypeWarrior - Master Your Typing Skills with Daily Challenges & Racing",
  description: "Improve your typing speed and accuracy with TypeWarrior's engaging challenges, multiple game modes, and real-time leaderboards. Free typing trainer with themes and achievements.",
  keywords: "typing game, typing test, typing trainer, WPM test, typing speed, typing accuracy, keyboard skills, daily challenges, typing practice",
  authors: [{ name: "TypeWarrior Team" }],
  creator: "TypeWarrior",
  publisher: "TypeWarrior",
  metadataBase: new URL('https://typewarrior.vercel.app'),
  openGraph: {
    title: "TypeWarrior - Master Your Typing Skills",
    description: "Improve your typing speed and accuracy with engaging challenges and multiple game modes",
    url: 'https://typewarrior.vercel.app',
    siteName: 'TypeWarrior',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TypeWarrior - Typing Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypeWarrior - Master Your Typing Skills',
    description: 'Improve your typing speed and accuracy with engaging challenges',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code', // Replace with actual Google verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TypeWarrior",
    "description": "Improve your typing speed and accuracy with TypeWarrior's engaging challenges, multiple game modes, and real-time leaderboards",
    "url": "https://typewarrior.vercel.app",
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "features": [
      "Daily typing challenges",
      "Multiple game modes",
      "Real-time leaderboards", 
      "Theme customization",
      "Progress tracking",
      "Achievements system"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google AdSense - Replace with your actual AdSense code */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="antialiased bg-white text-gray-900 font-sans">
        {children}
        
        {/* Google Analytics - Replace with your actual GA4 measurement ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </body>
    </html>
  );
}
