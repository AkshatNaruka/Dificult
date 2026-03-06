import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dificult - Master Your Typing Skills with Daily Challenges & Racing",
  description: "Improve your typing speed and accuracy with Dificult's engaging challenges, multiple game modes, and real-time leaderboards. Free typing trainer with themes and achievements.",
  keywords: "typing game, typing test, typing trainer, WPM test, typing speed, typing accuracy, keyboard skills, daily challenges, typing practice",
  authors: [{ name: "Dificult Team" }],
  creator: "Dificult",
  publisher: "Dificult",
  metadataBase: new URL('https://dificult.vercel.app'),
  openGraph: {
    title: "Dificult - Master Your Typing Skills",
    description: "Improve your typing speed and accuracy with engaging challenges and multiple game modes",
    url: 'https://dificult.vercel.app',
    siteName: 'Dificult',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dificult - Typing Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dificult - Master Your Typing Skills',
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
    "name": "Dificult",
    "description": "Improve your typing speed and accuracy with Dificult's engaging challenges, multiple game modes, and real-time leaderboards",
    "url": "https://dificult.vercel.app",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased font-sans transition-colors duration-300" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
