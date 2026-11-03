import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tullipio Fashion House | Modern Yoruba Heritage & Bespoke Tailoring",
  description:
    "Premier African fashion design brand in Akobo, Ibadan. Architectural Agbadas, contemporary two-piece sets, sculpted dresses, and ready-to-wear.",
  keywords: [
    "Tullipio Fashion House",
    "Agbada Ibadan",
    "African Fashion",
    "Bespoke Tailoring Ibadan",
    "Senator Suit",
    "Akobo Ibadan Tailor",
  ],
  openGraph: {
    title: "Tullipio Fashion House | Akobo, Ibadan",
    description: "Architectural African silhouettes crafted from heavyweight heritage textiles.",
    url: "https://tullipio.com",
    siteName: "Tullipio Fashion House",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-stone-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}
