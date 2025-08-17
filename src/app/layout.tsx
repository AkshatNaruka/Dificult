import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TypeWarrior - Battle Your Way to Typing Mastery",
  description: "Enhanced typing game with multiplayer racing, achievements, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white font-sans">
        {children}
      </body>
    </html>
  );
}
